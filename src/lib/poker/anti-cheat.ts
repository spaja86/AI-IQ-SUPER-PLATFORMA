import type { PokerAction, PokerAntiCheatResult, PokerPlayerState, PokerState } from './types';

function getPlayer(state: PokerState, playerId: string): PokerPlayerState | undefined {
  return state.players.find((p) => p.id === playerId);
}

export function validatePokerActionIntegrity(state: PokerState, action: PokerAction): PokerAntiCheatResult {
  const player = getPlayer(state, action.playerId);

  if (!player) return { allowed: false, reason: 'Nepostojeći igrač.' };
  if (state.street === 'showdown' || state.street === 'hand-over') {
    return { allowed: false, reason: 'Akcije nisu dozvoljene u ovoj fazi.' };
  }
  if (state.seenActionIds[action.actionId]) {
    return { allowed: false, reason: 'Duplikat action ID detektovan.' };
  }
  if (state.currentTurnPlayerId !== action.playerId) {
    return { allowed: false, reason: 'Neispravan redosled poteza.' };
  }
  if (player.folded || player.allIn) {
    return { allowed: false, reason: 'Igrač ne može više da igra ovu ruku.' };
  }

  const toCall = Math.max(0, state.currentBet - player.contribution);

  if (action.type === 'check' && toCall > 0) {
    return { allowed: false, reason: 'Check nije moguć kada postoji ulog za poziv.' };
  }

  if (action.type === 'call' && toCall === 0) {
    return { allowed: false, reason: 'Call nije potreban bez aktivnog uloga.' };
  }

  if (action.type === 'raise') {
    const raiseAmount = action.amount ?? state.bigBlind;
    if (!Number.isFinite(raiseAmount) || raiseAmount <= 0) {
      return { allowed: false, reason: 'Raise iznos mora biti pozitivan broj.' };
    }
    if (raiseAmount < state.bigBlind) {
      return { allowed: false, reason: 'Raise mora biti najmanje visina big blind-a.' };
    }
    const required = toCall + raiseAmount;
    if (required > player.chips) {
      return { allowed: false, reason: 'Nedovoljno chip-ova za raise.' };
    }
  }

  return { allowed: true };
}
