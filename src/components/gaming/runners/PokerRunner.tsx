'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameScore, GamingEndzinKonfiguracija } from '@/lib/gaming-endzin';
import { noviScore } from '@/lib/gaming-endzin';
import { FUNNEL_EVENTS, trackEvent } from '@/lib/analytics-events';
import { createGamingSession, terminateGamingSession, validateGameAction } from '@/lib/gaming-session';
import {
  applyPokerAction,
  createActionId,
  createMasterPokerState,
  getLegalActions,
  startNextPokerHand,
} from '@/lib/poker/engine';
import type { PokerAction, PokerState } from '@/lib/poker/types';
import Button from '@/components/Button';

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

const HUMAN_PLAYER_ID = 'p1-human';

function formatCard(code: string): string {
  return code;
}

function deterministicDecision(state: PokerState, playerId: string): number {
  let hash = 17;
  const src = `${state.seed}:${state.handNumber}:${state.actionCount}:${playerId}`;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 100;
}

function chooseBotAction(state: PokerState, playerId: string): PokerAction {
  const legal = getLegalActions(state, playerId);
  const roll = deterministicDecision(state, playerId);

  let type: PokerAction['type'] = 'fold';
  if (legal.includes('raise') && roll >= 70) type = 'raise';
  else if (legal.includes('call') && roll >= 35) type = 'call';
  else if (legal.includes('check')) type = 'check';
  else if (legal.includes('call')) type = 'call';

  return {
    actionId: createActionId('bot', state.handNumber, state.actionCount + 1),
    playerId,
    type,
    amount: type === 'raise' ? state.bigBlind : undefined,
    source: 'bot',
  };
}

export default function PokerRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const [state, setState] = useState<PokerState>(() => createMasterPokerState());
  const [score, setScore] = useState<GameScore>(() => noviScore(konfiguracija.parametri.nivo));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const humanPlayer = useMemo(
    () => state.players.find((p) => p.id === HUMAN_PLAYER_ID),
    [state.players],
  );

  const legalActions = useMemo(
    () => getLegalActions(state, HUMAN_PLAYER_ID),
    [state],
  );

  const updateScore = useCallback((nextState: PokerState) => {
    const human = nextState.players.find((p) => p.id === HUMAN_PLAYER_ID);
    const points = Math.max(0, (human?.chips ?? 0) - 1_000) * 2 + nextState.handNumber * 20;
    setScore((prev) => {
      const updated: GameScore = {
        ...prev,
        bodovi: points,
        nivo: Math.max(1, nextState.handNumber),
      };
      onScoreUpdate(updated);
      return updated;
    });
  }, [onScoreUpdate]);

  const applyAction = useCallback((action: PokerAction) => {
    setError(null);
    setNotice(null);

    if (sessionIdRef.current) {
      const guard = validateGameAction(sessionIdRef.current, {
        tip: 'poker_action',
        actionHash: action.actionId,
      });
      if (!guard.allowed) {
        setError(guard.razlog ?? 'Akcija nije dozvoljena.');
        trackEvent({
          tip: FUNNEL_EVENTS.ERROR_ENCOUNTERED,
          properties: {
            gameId: konfiguracija.igrica.id,
            reason: guard.razlog,
          },
        });
        return;
      }
    }

    setState((prev) => {
      const result = applyPokerAction(prev, action);
      if (result.error) {
        setError(result.error);
        return prev;
      }

      const nextState = result.state;
      updateScore(nextState);

      trackEvent({
        tip: 'master_poker_action',
        properties: {
          gameId: konfiguracija.igrica.id,
          action: action.type,
          playerId: action.playerId,
          hand: nextState.handNumber,
          street: nextState.street,
          pot: nextState.pot,
        },
      });

      if (nextState.street === 'hand-over') {
        trackEvent({
          tip: 'master_poker_hand_completed',
          properties: {
            gameId: konfiguracija.igrica.id,
            hand: nextState.handNumber,
            winners: nextState.winnerIds,
            winningHand: nextState.winningHandLabel,
          },
        });
      }

      return nextState;
    });
  }, [konfiguracija.igrica.id, updateScore]);

  useEffect(() => {
    const created = createGamingSession('local-master-poker-user', konfiguracija.igrica.id);
    if (created.created) {
      sessionIdRef.current = created.session.sessionId;
    }

    trackEvent({
      tip: FUNNEL_EVENTS.GAME_STARTED,
      properties: {
        gameId: konfiguracija.igrica.id,
        gameName: konfiguracija.igrica.naziv,
        variant: 'Texas Holdem',
        mode: 'single-table-vs-bots',
      },
    });

    return () => {
      if (sessionIdRef.current) {
        terminateGamingSession(sessionIdRef.current);
      }
      trackEvent({
        tip: FUNNEL_EVENTS.GAME_ABANDONED,
        properties: { gameId: konfiguracija.igrica.id },
      });
    };
  }, [konfiguracija.igrica.id, konfiguracija.igrica.naziv]);

  useEffect(() => {
    if (isPauziran) return;
    const t = setInterval(() => {
      setScore((prev) => {
        const next = { ...prev, vreme: prev.vreme + 1 };
        onScoreUpdate(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPauziran, onScoreUpdate]);

  useEffect(() => {
    if (isPauziran || state.street === 'hand-over' || state.street === 'showdown') return;
    const current = state.players.find((p) => p.id === state.currentTurnPlayerId);
    if (!current?.isBot) return;

    const timer = setTimeout(() => {
      const botAction = chooseBotAction(state, current.id);
      applyAction(botAction);
    }, 650);

    return () => clearTimeout(timer);
  }, [applyAction, isPauziran, state]);

  const handleHumanAction = useCallback((type: PokerAction['type']) => {
    applyAction({
      actionId: createActionId('human', state.handNumber, state.actionCount + 1),
      playerId: HUMAN_PLAYER_ID,
      type,
      amount: type === 'raise' ? state.bigBlind : undefined,
      source: 'human',
    });
  }, [applyAction, state.actionCount, state.bigBlind, state.handNumber]);

  const handleNextHand = useCallback(() => {
    const next = startNextPokerHand(state);
    setState(next);
    updateScore(next);
    setNotice('Nova ruka je spremna.');
  }, [state, updateScore]);

  const handleEndSession = useCallback(() => {
    onKraj(score);
    trackEvent({
      tip: FUNNEL_EVENTS.GAME_COMPLETED,
      properties: {
        gameId: konfiguracija.igrica.id,
        finalScore: score.bodovi,
        playedHands: state.handNumber,
      },
    });
  }, [konfiguracija.igrica.id, onKraj, score, state.handNumber]);

  return (
    <div className="flex h-full flex-col bg-gray-950 text-white">
      <div className="shrink-0 border-b border-gray-800 bg-gray-900/80 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-indigo-600/30 px-2 py-0.5 text-indigo-200">MASTER POKER HUD</span>
          <span>🂠 Faza: <b>{state.street}</b></span>
          <span>💰 Pot: <b>{state.pot}</b></span>
          <span>🎯 Na potezu: <b>{state.players.find((p) => p.id === state.currentTurnPlayerId)?.ime ?? 'N/A'}</b></span>
          <span>⚠️ Non-real-money simulacija</span>
        </div>
      </div>

      <div className="grid flex-1 min-h-0 gap-3 p-3 md:grid-cols-[2fr,1fr]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
            <p className="mb-2 text-xs text-gray-400">Community karte</p>
            <div className="flex flex-wrap gap-2">
              {state.communityCards.length === 0 && <span className="text-sm text-gray-500">Još nema otvorenih karata.</span>}
              {state.communityCards.map((card, idx) => (
                <span key={`${state.handNumber}-${card.code}-${idx}`} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-sm">
                  {formatCard(card.code)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
            <p className="mb-2 text-xs text-gray-400">Igrači i status</p>
            <div className="space-y-2 text-sm">
              {state.players.map((player) => (
                <div key={player.id} className={`rounded-lg border px-3 py-2 ${player.id === state.currentTurnPlayerId ? 'border-blue-500/60 bg-blue-900/20' : 'border-gray-800 bg-gray-800/40'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      {player.isBot ? '🤖' : '🧑'} {player.ime}
                      {player.folded ? ' (fold)' : ''}
                      {player.allIn ? ' (all-in)' : ''}
                    </span>
                    <span>💵 {player.chips}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Uloženo: {player.totalContribution} • Pobede: {player.handsWon}
                  </div>
                  {!player.isBot && (
                    <div className="mt-2 flex gap-2 text-xs">
                      {player.holeCards.map((card) => (
                        <span key={card.code} className="rounded-md border border-yellow-500/40 bg-yellow-900/20 px-2 py-0.5 text-yellow-100">
                          {formatCard(card.code)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
            <p className="mb-2 text-xs text-gray-400">Akcije (audit trail)</p>
            <div className="max-h-40 space-y-1 overflow-auto text-xs">
              {state.auditLog.slice(-8).map((log) => (
                <div key={log.id} className="rounded bg-gray-800/60 px-2 py-1 text-gray-300">
                  [{log.street}] {log.details}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
            <p className="mb-2 text-xs text-gray-400">Kontrole</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleHumanAction('fold')}
                disabled={isPauziran || state.currentTurnPlayerId !== HUMAN_PLAYER_ID || !legalActions.includes('fold')}
                className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Fold
              </Button>
              <Button
                onClick={() => handleHumanAction('check')}
                disabled={isPauziran || state.currentTurnPlayerId !== HUMAN_PLAYER_ID || !legalActions.includes('check')}
                className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Check
              </Button>
              <Button
                onClick={() => handleHumanAction('call')}
                disabled={isPauziran || state.currentTurnPlayerId !== HUMAN_PLAYER_ID || !legalActions.includes('call')}
                className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Call
              </Button>
              <Button
                onClick={() => handleHumanAction('raise')}
                disabled={isPauziran || state.currentTurnPlayerId !== HUMAN_PLAYER_ID || !legalActions.includes('raise')}
                className="rounded-lg bg-orange-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Raise +{state.bigBlind}
              </Button>
            </div>

            {state.street === 'hand-over' && (
              <div className="mt-3 rounded-lg border border-emerald-700/40 bg-emerald-900/20 p-2 text-xs text-emerald-200">
                Pobedio: {state.winnerIds.join(', ') || 'n/a'} • Ruka: {state.winningHandLabel || 'n/a'}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-2">
              <Button
                onClick={handleNextHand}
                disabled={state.street !== 'hand-over'}
                className="rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                Sledeća ruka
              </Button>
              <Button
                onClick={handleEndSession}
                className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white"
              >
                Završi sesiju
              </Button>
            </div>
          </div>

          {(error || notice) && (
            <div className={`rounded-xl border p-3 text-xs ${error ? 'border-red-700/40 bg-red-900/20 text-red-200' : 'border-blue-700/40 bg-blue-900/20 text-blue-200'}`}>
              {error ?? notice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
