'use client';

/**
 * EglanRunner — Boss-fight igrica EKSTREMINACIJA EGLANA
 *
 * Canvas-based runner za boss borbu sa EGLANOM, drevnim dimenzionalnim entitetom.
 *
 * Gameplay mehanika:
 *   - Igrač (elipsoid) se kreće WASD/strelicama i puca Space/Enter
 *   - Q taster aktivira posebnu sposobnost heroja (Štitni odboj / Senka Nevidljivosti)
 *   - EGLAN boss ima 4 faze prema HP (100→75→50→25→0%)
 *     Faza 1: Navođeni projektili ka igraču
 *     Faza 2: Dimenzionalni laser (sweep napad)
 *     Faza 3: Spawn dimenzionalnih miniona
 *     Faza 4: Berserk — sve brže + screen-wide šok val svakih 10s
 *   - Dimenzija određuje HP bossa, brzinu napada i broj miniona
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import {
  noviScore,
  crtajElipsoid,
  crtajSpiralu,
  crtajRezonancu,
  crtajHiperbolu,
} from '@/lib/gaming-endzin';

// ─── Tipovi ─────────────────────────────────────────────────────────

export type TipHeroja = 'ratnik' | 'senka';

type EglanFaza = 1 | 2 | 3 | 4;

interface Projektil {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vlasnik: 'igrac' | 'boss' | 'minion';
  odbijen: boolean; // da li je Ratnikov Q odbio projektil
  vreme: number;
}

interface Minion {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hp: number;
  vreme: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  boja: string;
  vreme: number;
  maxVreme: number;
}

interface LaserState {
  aktivan: boolean;
  ugao: number; // radijani
  ugaoBrzina: number;
  trajanje: number; // frejmovi
  maxTrajanje: number;
}

interface SokVal {
  r: number;
  maxR: number;
  vreme: number;
}

interface GameState {
  igrac: { x: number; y: number };
  igracHp: number;
  maxIgracHp: number;
  nevidljivost: number; // frejmovi preostalih nevidljivosti (Senka Q)
  stit: number; // frejmovi aktivnog štita (Ratnik Q)
  abilityCooldown: number; // ms do sledećeg Q
  bossHp: number;
  maxBossHp: number;
  bossFaza: EglanFaza;
  bossVreme: number; // ukupno vreme boss animacije
  poslednjiNapad: number; // timestamp
  poslednjiLaser: number;
  poslednjiSpawnMinion: number;
  poslednjiSokVal: number;
  laser: LaserState;
  sokValovi: SokVal[];
  projektili: Projektil[];
  minioni: Minion[];
  particles: Particle[];
  tasteri: Set<string>;
  poslednjiPucanj: number;
  poslednjiAbility: number;
  vremeAkumulirano: number;
  poslednjiTick: number;
  score: GameScore;
  gameOver: boolean;
  pobeda: boolean;
}

// ─── Konstante ───────────────────────────────────────────────────────

const IGRAC_R = 20;
const PROJ_R = 7;
const BOSS_R_BASE = 55;
const MINION_R = 12;

// Boje
const BOJE = {
  ratnik: { prim: '#facc15', tamna: '#854d0e', glow: '#fef08a' },
  senka: { prim: '#a855f7', tamna: '#581c87', glow: '#e9d5ff' },
  boss: { prim: '#1f0035', tamna: '#0d0018', glow: '#7c3aed', ring: '#6d28d9' },
  minion: '#4c1d95',
  laser: '#7c3aed',
  sokVal: '#9333ea',
};

// HP bossa po dimenziji
const BOSS_HP_PO_DIMENZIJI: Record<string, number> = {
  '360D': 1000,
  '720D': 1800,
  '1440D': 2800,
  '2880D': 4000,
  '5760D': 5500,
};

// HP igrača po dimenziji i heroju
function getIgracHp(nivo: string, tip: TipHeroja): number {
  const osnova: Record<string, number> = {
    '360D': 5,
    '720D': 5,
    '1440D': 6,
    '2880D': 7,
    '5760D': 8,
  };
  const b = osnova[nivo] ?? 5;
  return tip === 'ratnik' ? b + 3 : b;
}

// Cooldown Q sposobnosti (ms)
const ABILITY_COOLDOWN: Record<TipHeroja, number> = {
  ratnik: 5000,
  senka: 4000,
};
const STIT_TRAJANJE = 90; // frejmovi
const NEVIDLJIVOST_TRAJANJE = 70;

// Max miniona po dimenziji
const MAX_MINIONA: Record<string, number> = {
  '360D': 0,
  '720D': 2,
  '1440D': 4,
  '2880D': 6,
  '5760D': 8,
};

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
  startingHero?: TipHeroja;
}

export default function EglanRunner({
  konfiguracija,
  isPauziran,
  onScoreUpdate,
  onKraj,
  startingHero = 'ratnik',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parametri } = konfiguracija;
  const brzinaFaktor = parametri.brzinaMultiplikator;
  const nivoStr = parametri.nivo;
  const particleAktivan = parametri.particleSistem;

  const maxBossHp = BOSS_HP_PO_DIMENZIJI[nivoStr] ?? 1000;
  const maxIgracHp = getIgracHp(nivoStr, startingHero);
  const maxMiniona = MAX_MINIONA[nivoStr] ?? 0;
  const laserDostupan = parametri.slojevi >= 3; // 720D+
  const minionDostupan = parametri.tredni; // 1440D+
  const sokValDostupan = parametri.zakoni >= 5; // 2880D+

  const stateRef = useRef<GameState>({
    igrac: { x: 0, y: 0 },
    igracHp: maxIgracHp,
    maxIgracHp,
    nevidljivost: 0,
    stit: 0,
    abilityCooldown: 0,
    bossHp: maxBossHp,
    maxBossHp,
    bossFaza: 1,
    bossVreme: 0,
    poslednjiNapad: 0,
    poslednjiLaser: 0,
    poslednjiSpawnMinion: 0,
    poslednjiSokVal: 0,
    laser: { aktivan: false, ugao: 0, ugaoBrzina: 0.02, trajanje: 0, maxTrajanje: 120 },
    sokValovi: [],
    projektili: [],
    minioni: [],
    particles: [],
    tasteri: new Set(),
    poslednjiPucanj: 0,
    poslednjiAbility: 0,
    vremeAkumulirano: 0,
    poslednjiTick: 0,
    score: noviScore(parametri.nivo),
    gameOver: false,
    pobeda: false,
  });

  const rafRef = useRef<number>(0);
  const stableLoopRef = useRef<FrameRequestCallback>(() => {});
  const [gameOver, setGameOver] = useState(false);
  const [pobeda, setPobeda] = useState(false);
  const [finalScore, setFinalScore] = useState<GameScore | null>(null);

  // ── Tastatura ──

  useEffect(() => {
    const state = stateRef.current;
    const onDown = (e: KeyboardEvent) => state.tasteri.add(e.key);
    const onUp = (e: KeyboardEvent) => state.tasteri.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── Izračunaj boss fazu ──

  function getBossFazu(hp: number, maxHp: number): EglanFaza {
    const pct = hp / maxHp;
    if (pct > 0.75) return 1;
    if (pct > 0.5) return 2;
    if (pct > 0.25) return 3;
    return 4;
  }

  // ── Dodaj particle efekat ──

  const dodajParticle = useCallback(
    (x: number, y: number, boja: string, broj = 6) => {
      if (!particleAktivan) return;
      const state = stateRef.current;
      for (let i = 0; i < broj; i++) {
        const ugao = (i / broj) * Math.PI * 2;
        state.particles.push({
          x,
          y,
          vx: Math.cos(ugao) * (2 + Math.random() * 3),
          vy: Math.sin(ugao) * (2 + Math.random() * 3),
          r: 4,
          boja,
          vreme: 0,
          maxVreme: 45,
        });
      }
    },
    [particleAktivan],
  );

  // ── Pucanje igrača ──

  const pucaj = useCallback(() => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Pucaj prema centru bossa (gornji srednji deo)
    const bossX = canvas.width / 2;
    const bossY = canvas.height * 0.28;
    const dx = bossX - state.igrac.x;
    const dy = bossY - state.igrac.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const brzina = 10 * brzinaFaktor;
    state.projektili.push({
      x: state.igrac.x,
      y: state.igrac.y - IGRAC_R,
      vx: (dx / dist) * brzina,
      vy: (dy / dist) * brzina,
      r: PROJ_R,
      vlasnik: 'igrac',
      odbijen: false,
      vreme: 0,
    });
  }, [brzinaFaktor]);

  // ── Q sposobnost heroja ──

  const aktivirajAbility = useCallback(
    (timestamp: number) => {
      const state = stateRef.current;
      if (timestamp - state.poslednjiAbility < ABILITY_COOLDOWN[startingHero]) return;
      state.poslednjiAbility = timestamp;
      state.abilityCooldown = ABILITY_COOLDOWN[startingHero];
      if (startingHero === 'ratnik') {
        state.stit = STIT_TRAJANJE;
      } else {
        state.nevidljivost = NEVIDLJIVOST_TRAJANJE;
      }
    },
    [startingHero],
  );

  // ── Spawn boss projektila (Faza 1+) ──

  const spawnBossProjektil = useCallback(
    (bossX: number, bossY: number, igracX: number, igracY: number) => {
      const state = stateRef.current;
      const dx = igracX - bossX;
      const dy = igracY - bossY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const brzina = (1.5 + brzinaFaktor * 0.6) * (state.bossFaza >= 4 ? 1.5 : 1);
      state.projektili.push({
        x: bossX,
        y: bossY + BOSS_R_BASE,
        vx: (dx / dist) * brzina,
        vy: (dy / dist) * brzina,
        r: 10,
        vlasnik: 'boss',
        odbijen: false,
        vreme: 0,
      });
    },
    [brzinaFaktor],
  );

  // ── Spawn miniona ──

  const spawnMinion = useCallback(
    (canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      if (state.minioni.length >= maxMiniona) return;
      const strana = Math.random() < 0.5 ? -1 : 1;
      state.minioni.push({
        x: canvas.width / 2 + strana * (80 + Math.random() * 100),
        y: canvas.height * 0.15 + Math.random() * canvas.height * 0.25,
        vx: strana * -(0.5 + Math.random() * 0.5) * brzinaFaktor,
        vy: (0.3 + Math.random() * 0.4) * brzinaFaktor,
        r: MINION_R,
        hp: 2,
        vreme: 0,
      });
    },
    [brzinaFaktor, maxMiniona],
  );

  // ── Pokretanje šok vala ──

  const spawnSokVal = useCallback((canvas: HTMLCanvasElement) => {
    const state = stateRef.current;
    state.sokValovi.push({
      r: 0,
      maxR: Math.max(canvas.width, canvas.height),
      vreme: 0,
    });
  }, []);

  // ── Game loop ──

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (isPauziran) {
        rafRef.current = requestAnimationFrame(stableLoopRef.current);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const state = stateRef.current;
      if (state.gameOver || state.pobeda) return;

      const dt = state.poslednjiTick ? Math.min((timestamp - state.poslednjiTick) / 16.67, 3) : 1;
      state.poslednjiTick = timestamp;
      state.vremeAkumulirano += dt / 60;

      const bossX = canvas.width / 2;
      const bossY = canvas.height * 0.28;
      const bossR = BOSS_R_BASE + (state.bossFaza - 1) * 8;

      // ── Update cooldown Q ──
      if (state.abilityCooldown > 0) {
        state.abilityCooldown = Math.max(0, state.abilityCooldown - (timestamp - (state.poslednjiTick || timestamp)));
      }
      if (state.stit > 0) state.stit -= dt;
      if (state.nevidljivost > 0) state.nevidljivost -= dt;

      // ── Kretanje igrača ──
      const brzina = (startingHero === 'senka' ? 6.5 : 5) * brzinaFaktor;
      const { tasteri, igrac } = state;
      if ((tasteri.has('ArrowLeft') || tasteri.has('a') || tasteri.has('A')) && igrac.x - IGRAC_R > 0) {
        igrac.x -= brzina * dt;
      }
      if ((tasteri.has('ArrowRight') || tasteri.has('d') || tasteri.has('D')) && igrac.x + IGRAC_R < canvas.width) {
        igrac.x += brzina * dt;
      }
      if ((tasteri.has('ArrowUp') || tasteri.has('w') || tasteri.has('W')) && igrac.y - IGRAC_R > 0) {
        igrac.y -= brzina * dt;
      }
      if ((tasteri.has('ArrowDown') || tasteri.has('s') || tasteri.has('S')) && igrac.y + IGRAC_R < canvas.height) {
        igrac.y += brzina * dt;
      }

      // ── Pucanje igrača ──
      const pucanjInterval = Math.max(200, 600 / brzinaFaktor);
      if (
        (tasteri.has(' ') || tasteri.has('Enter')) &&
        timestamp - state.poslednjiPucanj > pucanjInterval
      ) {
        pucaj();
        state.poslednjiPucanj = timestamp;
      }

      // ── Q sposobnost ──
      if ((tasteri.has('q') || tasteri.has('Q')) && timestamp - state.poslednjiAbility > ABILITY_COOLDOWN[startingHero]) {
        aktivirajAbility(timestamp);
      }

      // ── Boss faza ──
      state.bossFaza = getBossFazu(state.bossHp, state.maxBossHp);
      state.bossVreme += dt;

      // ── Boss napadi ──
      const berzerkFaktor = state.bossFaza === 4 ? 1.6 : 1;
      const napadInterval = Math.max(400, (2000 / brzinaFaktor) / berzerkFaktor);

      if (timestamp - state.poslednjiNapad > napadInterval) {
        spawnBossProjektil(bossX, bossY, igrac.x, igrac.y);
        // Faza 2+: extra projektil sa strane
        if (state.bossFaza >= 2) {
          const offset = 0.5;
          const dx = igrac.x - bossX;
          const dy = igrac.y - bossY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const brzinaNap = (1.5 + brzinaFaktor * 0.6) * berzerkFaktor;
          state.projektili.push({
            x: bossX + BOSS_R_BASE * Math.cos(offset),
            y: bossY + BOSS_R_BASE,
            vx: (dx / dist) * brzinaNap * 0.8,
            vy: (dy / dist) * brzinaNap * 0.8,
            r: 8,
            vlasnik: 'boss',
            odbijen: false,
            vreme: 0,
          });
        }
        state.poslednjiNapad = timestamp;
      }

      // ── Laser (Faza 2+) ──
      if (laserDostupan && state.bossFaza >= 2) {
        const laserInterval = Math.max(5000, 9000 / brzinaFaktor);
        if (!state.laser.aktivan && timestamp - state.poslednjiLaser > laserInterval) {
          state.laser.aktivan = true;
          state.laser.ugao = Math.PI / 2; // počinje od dole
          state.laser.ugaoBrzina = 0.015 * brzinaFaktor * berzerkFaktor;
          state.laser.trajanje = 0;
          state.laser.maxTrajanje = 100;
          state.poslednjiLaser = timestamp;
        }
        if (state.laser.aktivan) {
          state.laser.ugao += state.laser.ugaoBrzina * dt;
          state.laser.trajanje += dt;
          if (state.laser.trajanje >= state.laser.maxTrajanje) {
            state.laser.aktivan = false;
          }
          // Proveri da li laser udara igrača
          if (state.nevidljivost <= 0 && state.stit <= 0) {
            const laserDx = Math.cos(state.laser.ugao);
            const laserDy = Math.sin(state.laser.ugao);
            // Rastojanje od igrača do linije lasera
            const px = igrac.x - bossX;
            const py = igrac.y - bossY;
            const t = px * laserDx + py * laserDy;
            const dist = Math.abs(px * laserDy - py * laserDx);
            if (t > 0 && dist < IGRAC_R + 6) {
              state.igracHp -= 0.05 * dt;
              if (state.igracHp <= 0) {
                state.igracHp = 0;
                state.gameOver = true;
                setGameOver(true);
                setFinalScore({ ...state.score });
                onKraj({ ...state.score });
                return;
              }
            }
          }
        }
      }

      // ── Spawn miniona (Faza 3+) ──
      if (minionDostupan && state.bossFaza >= 3) {
        const minionInterval = Math.max(2000, 5000 / brzinaFaktor);
        if (timestamp - state.poslednjiSpawnMinion > minionInterval) {
          spawnMinion(canvas);
          state.poslednjiSpawnMinion = timestamp;
        }
      }

      // ── Šok val (Faza 4, sokValDostupan) ──
      if (sokValDostupan && state.bossFaza === 4) {
        const sokInterval = 10000;
        if (timestamp - state.poslednjiSokVal > sokInterval) {
          spawnSokVal(canvas);
          state.poslednjiSokVal = timestamp;
        }
      }

      // ── Update projektila ──
      const preziveleProjektile: Projektil[] = [];
      for (const p of state.projektili) {
        // eslint-disable-next-line react-hooks/immutability
        p.x += p.vx * dt;
        // eslint-disable-next-line react-hooks/immutability
        p.y += p.vy * dt;
        // eslint-disable-next-line react-hooks/immutability
        p.vreme += dt;

        // Van platna
        if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) continue;

        if (p.vlasnik === 'igrac' || p.odbijen) {
          // Kolizija sa bossom
          const dx = p.x - bossX;
          const dy = p.y - bossY;
          if (Math.sqrt(dx * dx + dy * dy) < bossR + p.r) {
            const steta = p.odbijen ? 30 : (startingHero === 'senka' ? 15 : 10);
            state.bossHp = Math.max(0, state.bossHp - steta);
            state.score.bodovi += Math.round(steta * parametri.brzinaMultiplikator);
            dodajParticle(p.x, p.y, BOJE.boss.glow, 5);
            if (state.bossHp <= 0) {
              state.pobeda = true;
              state.score.bodovi += Math.round(5000 * parametri.brzinaMultiplikator);
              state.score.nivo = 5;
              setPobeda(true);
              setFinalScore({ ...state.score });
              onKraj({ ...state.score });
              return;
            }
            continue; // Projektil nestaje pri pogotku bossa
          }
          // Kolizija sa minionima
          let pogodioMiniona = false;
          for (const m of state.minioni) {
            const mx = p.x - m.x;
            const my = p.y - m.y;
            if (Math.sqrt(mx * mx + my * my) < m.r + p.r) {
              // eslint-disable-next-line react-hooks/immutability
              m.hp -= 1;
              dodajParticle(m.x, m.y, BOJE.minion, 4);
              state.score.bodovi += Math.round(50 * parametri.brzinaMultiplikator);
              pogodioMiniona = true;
              break;
            }
          }
          if (pogodioMiniona) continue;
          preziveleProjektile.push(p);
        } else {
          // Boss/minion projektil — udara igrača
          const isNev = state.nevidljivost > 0;
          const dxI = p.x - igrac.x;
          const dyI = p.y - igrac.y;
          if (!isNev && Math.sqrt(dxI * dxI + dyI * dyI) < IGRAC_R + p.r - 4) {
            if (state.stit > 0) {
              // Ratnik Q — odbijamo projektil ka bossu
              const ddx = bossX - p.x;
              const ddy = bossY - p.y;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
              const brzOdbij = 8 * brzinaFaktor;
              // eslint-disable-next-line react-hooks/immutability
              p.vx = (ddx / dist) * brzOdbij;
              // eslint-disable-next-line react-hooks/immutability
              p.vy = (ddy / dist) * brzOdbij;
              // eslint-disable-next-line react-hooks/immutability
              p.odbijen = true;
              // eslint-disable-next-line react-hooks/immutability
              p.vlasnik = 'igrac';
              dodajParticle(igrac.x, igrac.y, BOJE.ratnik.glow, 4);
              preziveleProjektile.push(p);
            } else {
              // Udarac
              state.igracHp -= 1;
              dodajParticle(igrac.x, igrac.y, '#ef4444', 4);
              if (state.igracHp <= 0) {
                state.gameOver = true;
                setGameOver(true);
                setFinalScore({ ...state.score });
                onKraj({ ...state.score });
                return;
              }
            }
          } else {
            preziveleProjektile.push(p);
          }
        }
      }
      state.projektili = preziveleProjektile;

      // ── Update miniona ──
      state.minioni = state.minioni.filter((m) => {
        // eslint-disable-next-line react-hooks/immutability
        m.x += m.vx * dt;
        // eslint-disable-next-line react-hooks/immutability
        m.y += m.vy * dt;
        // eslint-disable-next-line react-hooks/immutability
        m.vreme += dt;
        if (m.hp <= 0) return false;
        if (m.x < -50 || m.x > canvas.width + 50 || m.y > canvas.height + 50) return false;
        // Kolizija sa igračem
        if (state.nevidljivost <= 0) {
          const dx = m.x - igrac.x;
          const dy = m.y - igrac.y;
          if (Math.sqrt(dx * dx + dy * dy) < IGRAC_R + m.r) {
            state.igracHp -= 0.5;
            if (state.igracHp <= 0) {
              state.gameOver = true;
              setGameOver(true);
              setFinalScore({ ...state.score });
              onKraj({ ...state.score });
            }
            return false;
          }
        }
        return true;
      });

      // ── Update šok valova ──
      state.sokValovi = state.sokValovi.filter((sv) => {
        // eslint-disable-next-line react-hooks/immutability
        sv.r += 8 * brzinaFaktor * dt;
        // eslint-disable-next-line react-hooks/immutability
        sv.vreme += dt;
        // Udara igrača
        if (state.nevidljivost <= 0 && state.stit <= 0) {
          const dx = igrac.x - bossX;
          const dy = igrac.y - bossY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - sv.r) < IGRAC_R + 8) {
            state.igracHp -= 1;
            if (state.igracHp <= 0) {
              state.gameOver = true;
              setGameOver(true);
              setFinalScore({ ...state.score });
              onKraj({ ...state.score });
              return false;
            }
          }
        }
        return sv.r < sv.maxR;
      });

      // ── Update particles ──
      state.particles = state.particles.filter((p) => {
        // eslint-disable-next-line react-hooks/immutability
        p.x += p.vx * dt;
        // eslint-disable-next-line react-hooks/immutability
        p.y += p.vy * dt;
        // eslint-disable-next-line react-hooks/immutability
        p.vreme += dt;
        return p.vreme < p.maxVreme;
      });

      // ── Ažuriraj score ──
      state.score.vreme = Math.floor(state.vremeAkumulirano);
      state.score.nivo = state.bossFaza;
      onScoreUpdate({ ...state.score });

      // ══════════════════════════════════════════
      // CRTANJE
      // ══════════════════════════════════════════

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pozadina — void tamna
      ctx.fillStyle = '#070010';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid mreža u ljubičastoj
      ctx.strokeStyle = '#3b0764' + '28';
      ctx.lineWidth = 1;
      const grid = 40;
      for (let x = 0; x < canvas.width; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Dimenzionalne hiperboličke linije pozadine
      if (parametri.slojevi >= 2) {
        crtajHiperbolu(ctx, canvas.width / 2, canvas.height * 0.28, 30 + state.bossVreme * 0.2 % 20, '#3b0764' + '40');
      }

      // ── Crtaj šok valove ──
      for (const sv of state.sokValovi) {
        const alfa = Math.max(0, 1 - sv.r / sv.maxR);
        ctx.globalAlpha = alfa * 0.6;
        ctx.beginPath();
        ctx.arc(bossX, bossY, sv.r, 0, Math.PI * 2);
        ctx.strokeStyle = BOJE.sokVal;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ── Crtaj laser ──
      if (state.laser.aktivan) {
        const laserAlfa = 0.7 + 0.3 * Math.sin(state.bossVreme / 5);
        ctx.globalAlpha = laserAlfa;
        ctx.beginPath();
        ctx.moveTo(bossX, bossY);
        ctx.lineTo(
          bossX + Math.cos(state.laser.ugao) * canvas.width * 1.5,
          bossY + Math.sin(state.laser.ugao) * canvas.height * 1.5,
        );
        ctx.strokeStyle = BOJE.laser;
        ctx.lineWidth = 6 + state.bossFaza;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ── Crtaj boss ──
      const bossGlowR = bossR + 15 + 5 * Math.sin(state.bossVreme / 20);
      // Spoljašnji glow
      for (let i = 3; i > 0; i--) {
        ctx.globalAlpha = 0.08 * i;
        crtajElipsoid(ctx, bossX, bossY, bossGlowR + i * 10, bossGlowR * 0.75 + i * 7, BOJE.boss.glow);
      }
      ctx.globalAlpha = 1;
      // Rotacioni prsteni
      for (let r = 0; r < Math.min(parametri.slojevi, 4); r++) {
        const ringR = bossR + 10 + r * 15;
        const faza = state.bossVreme / (40 + r * 10) + r * Math.PI * 0.5;
        crtajRezonancu(ctx, bossX, bossY, ringR, 5 + r * 2, 6 + r, faza, BOJE.boss.ring + (r % 2 === 0 ? '90' : '60'));
      }
      // Jezgro bossa
      crtajElipsoid(ctx, bossX, bossY, bossR, bossR * 0.75, BOJE.boss.prim);
      // Oko — simbol EGLANA
      const ocnaR = bossR * 0.35;
      crtajElipsoid(ctx, bossX, bossY, ocnaR, ocnaR * 0.6, BOJE.boss.glow + 'cc');
      crtajElipsoid(ctx, bossX, bossY, ocnaR * 0.45, ocnaR * 0.45 * 0.6, '#0d0018');

      // ── HP bar bossa ──
      const bossHpPct = state.bossHp / state.maxBossHp;
      const barW = Math.min(canvas.width - 40, 320);
      const barX = (canvas.width - barW) / 2;
      const barY = 16;
      ctx.fillStyle = '#1f0035';
      ctx.fillRect(barX, barY, barW, 14);
      const bossBarBoja = bossHpPct > 0.5 ? '#7c3aed' : bossHpPct > 0.25 ? '#c026d3' : '#ef4444';
      ctx.fillStyle = bossBarBoja;
      ctx.fillRect(barX, barY, barW * bossHpPct, 14);
      ctx.strokeStyle = '#6d28d9';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, 14);
      // Faza markeri
      for (const pct of [0.75, 0.5, 0.25]) {
        ctx.fillStyle = '#a78bfa';
        ctx.fillRect(barX + barW * pct - 1, barY, 2, 14);
      }
      ctx.fillStyle = '#c4b5fd';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`EGLAN — Faza ${state.bossFaza}  HP: ${Math.ceil(state.bossHp)}`, canvas.width / 2, barY + 10);

      // ── Crtaj minionе ──
      for (const m of state.minioni) {
        crtajRezonancu(ctx, m.x, m.y, m.r + 4, 3, 4, timestamp / 600, BOJE.boss.ring + '80');
        crtajElipsoid(ctx, m.x, m.y, m.r, m.r * 0.7, BOJE.minion);
      }

      // ── Crtaj projektile ──
      for (const p of state.projektili) {
        if (p.vlasnik === 'igrac' || p.odbijen) {
          const heroBoja = startingHero === 'ratnik' ? BOJE.ratnik.prim : BOJE.senka.prim;
          crtajElipsoid(ctx, p.x, p.y, p.r, p.r * 1.3, p.odbijen ? BOJE.ratnik.glow : heroBoja);
          if (particleAktivan) crtajSpiralu(ctx, p.x, p.y, p.r * 2, 1.2, heroBoja + '60');
        } else {
          crtajElipsoid(ctx, p.x, p.y, p.r, p.r * 0.8, BOJE.boss.glow);
          crtajRezonancu(ctx, p.x, p.y, p.r + 2, 2, 4, timestamp / 400, BOJE.boss.ring + '80');
        }
      }

      // ── Crtaj particles ──
      for (const p of state.particles) {
        const alfa = 1 - p.vreme / p.maxVreme;
        ctx.globalAlpha = alfa;
        crtajElipsoid(ctx, p.x, p.y, p.r, p.r, p.boja);
      }
      ctx.globalAlpha = 1;

      // ── Crtaj igrača ──
      const heroBoja = startingHero === 'ratnik' ? BOJE.ratnik : BOJE.senka;
      const igracAlfa = state.nevidljivost > 0 ? 0.3 : 1;
      ctx.globalAlpha = igracAlfa;
      if (state.stit > 0) {
        // Štitni prsten
        crtajRezonancu(ctx, igrac.x, igrac.y, IGRAC_R + 10, 4, 6, timestamp / 500, BOJE.ratnik.glow + 'cc');
      }
      crtajElipsoid(ctx, igrac.x, igrac.y, IGRAC_R, IGRAC_R * 0.75, heroBoja.prim);
      crtajRezonancu(ctx, igrac.x, igrac.y, IGRAC_R + 4, 2, 5, timestamp / 700, heroBoja.glow + '80');
      ctx.globalAlpha = 1;

      // ── HP bar igrača ──
      const igracHpPct = Math.max(0, state.igracHp / state.maxIgracHp);
      const igBarW = 80;
      const igBarX = igrac.x - igBarW / 2;
      const igBarY = igrac.y + IGRAC_R + 6;
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(igBarX, igBarY, igBarW, 6);
      ctx.fillStyle = igracHpPct > 0.5 ? '#22c55e' : igracHpPct > 0.25 ? '#eab308' : '#ef4444';
      ctx.fillRect(igBarX, igBarY, igBarW * igracHpPct, 6);

      // ── Q cooldown indikator ──
      const abCd = Math.max(0, ABILITY_COOLDOWN[startingHero] - (timestamp - state.poslednjiAbility));
      const abPct = 1 - abCd / ABILITY_COOLDOWN[startingHero];
      ctx.fillStyle = '#374151';
      ctx.fillRect(igBarX, igBarY + 8, igBarW, 4);
      ctx.fillStyle = heroBoja.prim;
      ctx.fillRect(igBarX, igBarY + 8, igBarW * abPct, 4);

      // Kontrole hint
      if (state.vremeAkumulirano < 4) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WASD/Strelice = kretanje  |  Space = pucaj  |  Q = sposobnost', canvas.width / 2, canvas.height - 16);
      }

      rafRef.current = requestAnimationFrame(stableLoopRef.current);
    },
    [
      isPauziran,
      brzinaFaktor,
      parametri,
      startingHero,
      laserDostupan,
      minionDostupan,
      sokValDostupan,
      maxMiniona,
      pucaj,
      aktivirajAbility,
      spawnBossProjektil,
      spawnMinion,
      spawnSokVal,
      dodajParticle,
      onScoreUpdate,
      onKraj,
    ],
  );

  stableLoopRef.current = gameLoop;

  // ── Mount / restart ──

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const roditelj = canvas.parentElement;
    if (roditelj) {
      canvas.width = roditelj.clientWidth;
      canvas.height = roditelj.clientHeight;
    }
    stateRef.current = {
      igrac: { x: canvas.width / 2, y: canvas.height - 60 },
      igracHp: maxIgracHp,
      maxIgracHp,
      nevidljivost: 0,
      stit: 0,
      abilityCooldown: 0,
      bossHp: maxBossHp,
      maxBossHp,
      bossFaza: 1,
      bossVreme: 0,
      poslednjiNapad: 0,
      poslednjiLaser: 0,
      poslednjiSpawnMinion: 0,
      poslednjiSokVal: 0,
      laser: { aktivan: false, ugao: 0, ugaoBrzina: 0.02, trajanje: 0, maxTrajanje: 120 },
      sokValovi: [],
      projektili: [],
      minioni: [],
      particles: [],
      tasteri: new Set(),
      poslednjiPucanj: 0,
      poslednjiAbility: 0,
      vremeAkumulirano: 0,
      poslednjiTick: 0,
      score: noviScore(parametri.nivo),
      gameOver: false,
      pobeda: false,
    };
    setGameOver(false);
    setPobeda(false);
    setFinalScore(null);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [konfiguracija, gameLoop, maxBossHp, maxIgracHp, parametri.nivo]);

  // ── Touch kontrole ──

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    stateRef.current.igrac.x = Math.max(IGRAC_R, Math.min(canvas.width - IGRAC_R, touch.clientX - rect.left));
    stateRef.current.igrac.y = Math.max(IGRAC_R, Math.min(canvas.height - IGRAC_R, touch.clientY - rect.top));
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleTouchMove(e);
      pucaj();
    },
    [handleTouchMove, pucaj],
  );

  // ── Game over / Pobeda ekrani ──

  if ((gameOver || pobeda) && finalScore) {
    const heroNaziv = startingHero === 'ratnik' ? '⚔️ Ratnik Svetlosti' : '🗡️ Senka Ubojica';
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">{pobeda ? '👁️' : '💀'}</div>
        <h2 className="text-2xl font-bold text-white">
          {pobeda ? 'EGLAN EKSTERMINISAN!' : 'EGLAN TE JE PROGUTAO!'}
        </h2>
        <p className="text-sm text-purple-400">{heroNaziv}</p>
        <p className="text-4xl font-bold text-yellow-400">{finalScore.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Faza {finalScore.nivo}</p>
        <p className="text-xs text-gray-600">
          Dimenzija: {konfiguracija.parametri.nivo} | Bonus: ×{parametri.brzinaMultiplikator.toFixed(1)}
        </p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full cursor-crosshair touch-none"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    />
  );
}
