// SpajaUltraOmegaCore -∞Ω+∞ — Gaming Session Guard
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 4 (P1): Gaming stabilnost — anti-cheat, replay guard, session kontrola.
//
// Implementira:
//   • Gaming sesija sa TTL-om i token validacijom
//   • Anti-cheat score na osnovu score anomalija
//   • Replay guard (dedupliciranje akcija)
//   • Session rate limiting (maks akcilja/sec)
//   • Score sanity check (otkrivanje nemogućih score-ova)
//
// Upotreba:
//   const session = createGamingSession(userId, igriceId);
//   const check = validateGameAction(session, action);

import { randomUUID } from 'crypto';

// ─── Konstante ────────────────────────────────────────────────────────────────

/** Maksimalno trajanje gaming sesije (30 minuta). */
export const GAMING_SESSION_TTL_MS = 30 * 60 * 1000;

/** Maksimalan broj akcija u sekundi (anti-bot zaštita). */
export const MAX_ACTIONS_PER_SEC = 60;

/** Anti-cheat threshold — score per sekundi koji se smatra nemogućim. */
export const MAX_SCORE_PER_SEC = 500;

/** Maksimalan broj duplikat akcija pre suspenzije. */
export const MAX_REPLAY_VIOLATIONS = 3;

/** Maksimalan broj istovremenih sesija po korisniku. */
export const MAX_SESSIONS_PER_USER = 3;

// ─── Tipovi ───────────────────────────────────────────────────────────────────

export type GamingSessionStatus =
  | 'active'
  | 'paused'
  | 'expired'
  | 'terminated'
  | 'suspended'; // Anti-cheat suspenzija

export interface GamingSession {
  sessionId: string;
  userId: string;
  igriceId: string;
  status: GamingSessionStatus;
  startedAt: number;    // ms timestamp
  expiresAt: number;    // ms timestamp
  lastActionAt: number; // ms timestamp
  score: number;
  actionCount: number;
  /** Anti-cheat: zabilježene sumnjive akcije */
  violations: AntiCheatViolation[];
  /** Replay guard: set heš-ova poslatih akcija */
  actionHashes: Set<string>;
}

export interface AntiCheatViolation {
  tip: 'score_anomaly' | 'action_flood' | 'replay' | 'session_expired' | 'impossible_timing';
  detailji: string;
  timestamp: number;
}

export interface GameAction {
  /** Tip akcije (npr. 'score_update', 'level_complete', 'move'). */
  tip: string;
  /** Vrednost akcije (npr. novi score). */
  vrednost?: number;
  /** Opcioni klijentski timestamp (ms). */
  clientTimestamp?: number;
  /** Heš akcije za replay detekciju. */
  actionHash?: string;
}

export interface ActionValidationResult {
  allowed: boolean;
  /** Razlog odbijanja (ako nije dozvoljeno). */
  razlog?: string;
  /** Novi score posle akcije. */
  noviScore?: number;
  /** Anti-cheat score (0-100, veći = sumnjivije). */
  antiCheatScore?: number;
}

const DOZVOLJENI_STATUS_PRELAZI: Record<GamingSessionStatus, GamingSessionStatus[]> = {
  active: ['paused', 'terminated', 'expired', 'suspended'],
  paused: ['active', 'terminated', 'expired', 'suspended'],
  expired: [],
  terminated: [],
  suspended: [],
};

// ─── Session Store ────────────────────────────────────────────────────────────

const sessionStore = new Map<string, GamingSession>();
const userSessionsIndex = new Map<string, Set<string>>(); // userId → Set<sessionId>

// ─── Session Management ───────────────────────────────────────────────────────

/**
 * Kreira novu gaming sesiju za korisnika.
 * Proverava limit istovremenih sesija po korisniku.
 */
export function createGamingSession(
  userId: string,
  igriceId: string,
): { session: GamingSession; created: boolean; error?: string } {
  const now = Date.now();

  // Provjeri limit sesija po korisniku
  const userSessions = userSessionsIndex.get(userId) ?? new Set<string>();
  const activeSessions = [...userSessions].filter((sid) => {
    const s = sessionStore.get(sid);
    return s && s.status === 'active' && now < s.expiresAt;
  });

  if (activeSessions.length >= MAX_SESSIONS_PER_USER) {
    return {
      session: null as unknown as GamingSession,
      created: false,
      error: `Maksimalan broj aktivnih sesija (${MAX_SESSIONS_PER_USER}) dostignut.`,
    };
  }

  const sessionId = randomUUID();
  const session: GamingSession = {
    sessionId,
    userId,
    igriceId,
    status: 'active',
    startedAt: now,
    expiresAt: now + GAMING_SESSION_TTL_MS,
    lastActionAt: now,
    score: 0,
    actionCount: 0,
    violations: [],
    actionHashes: new Set(),
  };

  sessionStore.set(sessionId, session);
  if (!userSessionsIndex.has(userId)) {
    userSessionsIndex.set(userId, new Set());
  }
  userSessionsIndex.get(userId)!.add(sessionId);

  return { session, created: true };
}

/**
 * Dohvata gaming sesiju po ID-u.
 */
export function getGamingSession(sessionId: string): GamingSession | null {
  return sessionStore.get(sessionId) ?? null;
}

/**
 * Završava gaming sesiju.
 */
export function terminateGamingSession(sessionId: string, reason: GamingSessionStatus = 'terminated'): void {
  const session = sessionStore.get(sessionId);
  if (!session) return;
  transitionSessionStatus(sessionId, reason);
}

/**
 * Kontrolisan prelaz statusa sesije.
 * Vraća false ako prelaz nije dozvoljen.
 */
export function transitionSessionStatus(
  sessionId: string,
  nextStatus: GamingSessionStatus,
): boolean {
  const session = sessionStore.get(sessionId);
  if (!session) return false;
  const dozvoljeni = DOZVOLJENI_STATUS_PRELAZI[session.status] ?? [];
  if (!dozvoljeni.includes(nextStatus) && session.status !== nextStatus) {
    return false;
  }
  session.status = nextStatus;
  sessionStore.set(sessionId, session);
  return true;
}

// ─── Action Validation (Anti-Cheat) ──────────────────────────────────────────

/**
 * Validira gaming akciju sa anti-cheat proverama.
 *
 * Proverava:
 *   1. Sesija postoji i nije expirala
 *   2. Akcija nije replay (duplikat)
 *   3. Action rate nije previše visok (bot detection)
 *   4. Score prirast nije nemoguć
 */
export function validateGameAction(
  sessionId: string,
  action: GameAction,
): ActionValidationResult {
  const session = sessionStore.get(sessionId);
  const now = Date.now();

  // 1. Sesija ne postoji
  if (!session) {
    return { allowed: false, razlog: 'Sesija ne postoji.' };
  }

  // 2. Sesija je ekspirala
  if (now > session.expiresAt || session.status !== 'active') {
    if (session.status === 'active') {
      transitionSessionStatus(sessionId, 'expired');
      addViolation(session, 'session_expired', 'Sesija je istekla.');
    }
    return { allowed: false, razlog: 'Sesija je nevažeća ili istekla.' };
  }

  // 3. Replay guard
  if (action.actionHash) {
    if (session.actionHashes.has(action.actionHash)) {
      addViolation(session, 'replay', `Duplikat akcije: ${action.actionHash}`);
      checkSuspend(session);
      return { allowed: false, razlog: 'Duplikat akcije detektovan.' };
    }
    session.actionHashes.add(action.actionHash);
    // Ograniči veličinu seta
    if (session.actionHashes.size > 10_000) {
      const oldest = session.actionHashes.values().next().value;
      if (oldest) session.actionHashes.delete(oldest);
    }
  }

  // 4. Action flood (rate limiting)
  const timeSinceLast = now - session.lastActionAt;
  if (session.actionCount > 0 && timeSinceLast < 1000 / MAX_ACTIONS_PER_SEC) {
    addViolation(session, 'action_flood', `Akcija prebrza: ${timeSinceLast}ms od prethodne`);
    checkSuspend(session);
    return { allowed: false, razlog: 'Previše akcija u kratkom vremenu.' };
  }

  // 4b. Klijentski timestamp ne sme biti nelogičan
  if (typeof action.clientTimestamp === 'number') {
    const drift = Math.abs(action.clientTimestamp - now);
    if (drift > 30_000) {
      addViolation(session, 'impossible_timing', `Timestamp drift: ${drift}ms`);
      checkSuspend(session);
      return {
        allowed: false,
        razlog: 'Klijentski timestamp je nelogičan.',
        antiCheatScore: calculateAntiCheatScore(session),
      };
    }
  }

  // 5. Score sanity check
  if (action.tip === 'score_update' && action.vrednost !== undefined) {
    const scoreDelta = action.vrednost - session.score;
    const elapsedSec = (now - session.startedAt) / 1000 || 1;
    const maxPossibleScore = MAX_SCORE_PER_SEC * elapsedSec;

    if (action.vrednost > maxPossibleScore) {
      addViolation(
        session,
        'score_anomaly',
        `Nemoguć score: ${action.vrednost} > max ${Math.round(maxPossibleScore)}`,
      );
      checkSuspend(session);
      return {
        allowed: false,
        razlog: 'Score prevazilazi fizička ograničenja igre.',
        antiCheatScore: calculateAntiCheatScore(session),
      };
    }

    if (scoreDelta < 0) {
      addViolation(session, 'score_anomaly', `Negativna promena score-a: ${scoreDelta}`);
    }

    session.score = action.vrednost;
  }

  // Uspešna validacija — ažuriraj sesiju
  session.lastActionAt = now;
  session.actionCount++;
  sessionStore.set(sessionId, session);

  return {
    allowed: true,
    noviScore: session.score,
    antiCheatScore: calculateAntiCheatScore(session),
  };
}

// ─── Anti-Cheat Score ─────────────────────────────────────────────────────────

/**
 * Računa anti-cheat score za sesiju (0-100, veći = sumnjivije).
 */
export function calculateAntiCheatScore(session: GamingSession): number {
  const violationWeight = session.violations.length * 15;
  const replayViolations = session.violations.filter((v) => v.tip === 'replay').length * 25;
  const floodViolations = session.violations.filter((v) => v.tip === 'action_flood').length * 10;
  const scoreAnomalies = session.violations.filter((v) => v.tip === 'score_anomaly').length * 30;

  const raw = violationWeight + replayViolations + floodViolations + scoreAnomalies;
  return Math.min(100, raw);
}

/**
 * Vraća gaming izveštaj za sesiju (za admin/audit).
 */
export function getSessionReport(sessionId: string): {
  session: Omit<GamingSession, 'actionHashes'> & { uniqueActionHashes: number };
  antiCheatScore: number;
  isSuspicious: boolean;
  violationSummary: Record<AntiCheatViolation['tip'], number>;
  lastViolation: AntiCheatViolation | null;
} | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;

  const antiCheatScore = calculateAntiCheatScore(session);
  const { actionHashes, ...sessionWithoutHashes } = session;
  const violationSummary = session.violations.reduce<Record<AntiCheatViolation['tip'], number>>(
    (acc, current) => {
      acc[current.tip] = (acc[current.tip] ?? 0) + 1;
      return acc;
    },
    {
      score_anomaly: 0,
      action_flood: 0,
      replay: 0,
      session_expired: 0,
      impossible_timing: 0,
    },
  );
  const lastViolation = session.violations.at(-1) ?? null;

  return {
    session: { ...sessionWithoutHashes, uniqueActionHashes: actionHashes.size },
    antiCheatScore,
    isSuspicious: antiCheatScore >= 50,
    violationSummary,
    lastViolation,
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function addViolation(
  session: GamingSession,
  tip: AntiCheatViolation['tip'],
  detailji: string,
): void {
  session.violations.push({ tip, detailji, timestamp: Date.now() });
  sessionStore.set(session.sessionId, session);
}

function checkSuspend(session: GamingSession): void {
  const replayViolations = session.violations.filter((v) => v.tip === 'replay').length;
  if (replayViolations >= MAX_REPLAY_VIOLATIONS || calculateAntiCheatScore(session) >= 80) {
    const transitioned = transitionSessionStatus(session.sessionId, 'suspended');
    if (!transitioned) return;
    sessionStore.set(session.sessionId, session);
  }
}

/**
 * Čisti istekle sesije iz store-a (garbage collection).
 * Pokretati periodično (npr. cron svaki sat).
 */
export function cleanupExpiredSessions(): number {
  const now = Date.now();
  let count = 0;

  for (const [sessionId, session] of sessionStore.entries()) {
    if (now > session.expiresAt || session.status === 'terminated') {
      sessionStore.delete(sessionId);
      userSessionsIndex.get(session.userId)?.delete(sessionId);
      count++;
    }
  }

  return count;
}
