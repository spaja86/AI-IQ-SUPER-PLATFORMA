'use client';

/**
 * BorbenaRunner — Borbene igrice sa dualnim elementalnim sistemom
 *
 * Specijalizovani Canvas runner za COLD AND FIRE i buduće borbene igrice.
 *
 * Gameplay mehanika:
 *   - Igrač bira COLD ❄️ ili FIRE 🔥 mod (Tab da promeni)
 *   - COLD: spiralni ledeni projektili, Freeze sposobnost (Q) — usporava neprijatelje
 *   - FIRE: eksplozivni vatrani projektili, Explosion sposobnost (E) — AoE šteta
 *   - Neprijatelji imaju tip (led/vatra) — otporniji na isti element
 *   - Fusion Gauge: naizmenično ubijanje gradi metar → automatski COLD-FIRE Fusion blast
 *   - Dimenzija određuje dostupne modove, vizuelne efekte i brzinu
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

type ElemMod = 'cold' | 'fire';
type TipNeprijatelja = 'led' | 'vatra' | 'neutralni';

interface Neprijatelj {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hp: number;
  maxHp: number;
  tip: TipNeprijatelja;
  usporen: number; // frejmovi usporavanja od Freeze
  vreme: number;
}

interface Projektil {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mod: ElemMod;
  vreme: number;
  aoe: boolean; // AoE projektil od Explosion
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

interface FusionBlast {
  x: number;
  y: number;
  r: number;
  maxR: number;
  vreme: number;
}

interface GameState {
  igrac: { x: number; y: number };
  mod: ElemMod;
  fusionGauge: number; // 0–100
  poslednjiModUbojstva: ElemMod | null; // prati alternirano ubijanje
  alterniranjaBrojac: number;
  abilityFreeze: { cooldown: number; aktivna: number }; // ms cooldown i preostalo aktivno
  abilityExplosion: { cooldown: number };
  neprijatelji: Neprijatelj[];
  projektili: Projektil[];
  particles: Particle[];
  fusionBlasts: FusionBlast[];
  score: GameScore;
  tasteri: Set<string>;
  poslednjiSpawn: number;
  poslednjiPucanj: number;
  poslednjiAbility: number;
  vremeAkumulirano: number;
  poslednjiTick: number;
  gameOver: boolean;
}

// ─── Konstante ───────────────────────────────────────────────────────

const IGRAC_R = 22;
const PROJ_R = 7;
const NEPR_R_MIN = 14;
const NEPR_R_MAX = 28;
const FUSION_POTREBNO = 5; // alterniranih ubojstava za pun Fusion metar
const FREEZE_TRAJANJE = 120; // frejmovi za koje je neprijatelj usporen
const FREEZE_SLOWDOWN = 0.25; // faktor usporavanja
const FREEZE_COOLDOWN = 4000; // ms
const EXPLOSION_COOLDOWN = 5000; // ms
const EXPLOSION_R = 80; // AoE radius eksplozije
const FUSION_BLAST_MAX_R = 140; // max radius fusion vala

// Boje po modu
const BOJE = {
  cold: { prim: '#67e8f9', tamna: '#0e7490', glow: '#a5f3fc' },
  fire: { prim: '#f97316', tamna: '#c2410c', glow: '#fed7aa' },
  fusion: '#a855f7',
  neprijatelj: {
    led: '#93c5fd',
    vatra: '#fca5a5',
    neutralni: '#d1d5db',
  },
};

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
  onModChange?: (mod: ElemMod, fusionGauge: number) => void;
  startingMod?: ElemMod;
}

export default function BorbenaRunner({
  konfiguracija,
  isPauziran,
  onScoreUpdate,
  onKraj,
  onModChange,
  startingMod = 'cold',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parametri } = konfiguracija;
  const brzinaFaktor = parametri.brzinaMultiplikator;

  // Fusion dostupan od 720D+
  const fusionDostupan = parametri.slojevi >= 3;
  // Oba moda dostupna od 720D+
  const obaModa = parametri.slojevi >= 3;
  // Led/vatra tipovi neprijatelja od 1440D+
  const tipizirani = parametri.tredni;
  // Particle efekti od 2880D+
  const particleAktivan = parametri.particleSistem;

  const stateRef = useRef<GameState>({
    igrac: { x: 0, y: 0 },
    mod: startingMod,
    fusionGauge: 0,
    poslednjiModUbojstva: null,
    alterniranjaBrojac: 0,
    abilityFreeze: { cooldown: 0, aktivna: 0 },
    abilityExplosion: { cooldown: 0 },
    neprijatelji: [],
    projektili: [],
    particles: [],
    fusionBlasts: [],
    score: noviScore(parametri.nivo),
    tasteri: new Set(),
    poslednjiSpawn: 0,
    poslednjiPucanj: 0,
    poslednjiAbility: 0,
    vremeAkumulirano: 0,
    poslednjiTick: 0,
    gameOver: false,
  });

  const rafRef = useRef<number>(0);
  const stableLoopRef = useRef<FrameRequestCallback>(() => {});
  const [gameOver, setGameOver] = useState(false);
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

  // ── Spawn neprijatelja ──

  const spawnNeprijatelj = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;
    if (state.neprijatelji.length >= Math.min(parametri.maxEntiteta, 30)) return;

    const r = NEPR_R_MIN + Math.random() * (NEPR_R_MAX - NEPR_R_MIN);
    let tip: TipNeprijatelja = 'neutralni';
    if (tipizirani) {
      tip = Math.random() < 0.5 ? 'led' : 'vatra';
    }
    const hp = tip === 'neutralni' ? 2 : 3;
    state.neprijatelji.push({
      x: r + Math.random() * (canvas.width - 2 * r),
      y: -r,
      vx: (Math.random() - 0.5) * 1.5 * brzinaFaktor,
      vy: (0.7 + Math.random() * 1.0) * brzinaFaktor,
      r,
      hp,
      maxHp: hp,
      tip,
      usporen: 0,
      vreme: 0,
    });
  }, [brzinaFaktor, parametri.maxEntiteta, tipizirani]);

  // ── Pucaj ──

  const pucaj = useCallback((mod: ElemMod) => {
    const state = stateRef.current;
    state.projektili.push({
      x: state.igrac.x,
      y: state.igrac.y - IGRAC_R,
      vx: 0,
      vy: -11 * brzinaFaktor,
      r: PROJ_R,
      mod,
      vreme: 0,
      aoe: false,
    });
  }, [brzinaFaktor]);

  // ── Game over helper ──

  const triggerGameOver = useCallback(() => {
    const state = stateRef.current;
    state.gameOver = true;
    setGameOver(true);
    setFinalScore({ ...state.score });
    onKraj({ ...state.score });
  }, [onKraj]);

  // ── Ability: Freeze ──

  const aktivirajFreeze = useCallback((timestamp: number) => {
    const state = stateRef.current;
    if (timestamp - state.abilityFreeze.cooldown < FREEZE_COOLDOWN) return;
    state.abilityFreeze.cooldown = timestamp;
    state.abilityFreeze.aktivna = FREEZE_TRAJANJE;
    // Usporiti sve neprijatelje
    for (const nepr of state.neprijatelji) {
      // eslint-disable-next-line react-hooks/immutability
      nepr.usporen = FREEZE_TRAJANJE;
    }
  }, []);

  // ── Ability: Explosion ──

  const aktivirajExplosion = useCallback((timestamp: number) => {
    const state = stateRef.current;
    if (timestamp - state.abilityExplosion.cooldown < EXPLOSION_COOLDOWN) return;
    state.abilityExplosion.cooldown = timestamp;
    // AoE projektil
    state.projektili.push({
      x: state.igrac.x,
      y: state.igrac.y - IGRAC_R,
      vx: 0,
      vy: -8 * brzinaFaktor,
      r: PROJ_R * 2,
      mod: 'fire',
      vreme: 0,
      aoe: true,
    });
  }, [brzinaFaktor]);

  // ── Fusion Blast ──

  const aktivirajFusion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;
    state.fusionBlasts.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 0,
      maxR: FUSION_BLAST_MAX_R,
      vreme: 0,
    });
    state.fusionGauge = 0;
    state.alterniranjaBrojac = 0;
    state.poslednjiModUbojstva = null;
    // Šteta svim neprijateljima u radijusu
    for (const nepr of state.neprijatelji) {
      // eslint-disable-next-line react-hooks/immutability
      nepr.hp = 0;
    }
  }, []);

  // ── Dodaj particle ──

  const dodajParticle = useCallback((x: number, y: number, boja: string, broj = 6) => {
    if (!particleAktivan) return;
    const state = stateRef.current;
    for (let i = 0; i < broj; i++) {
      const ugao = (i / broj) * Math.PI * 2 + Math.random() * 0.5;
      const brzina = 2 + Math.random() * 3;
      state.particles.push({
        x,
        y,
        vx: Math.cos(ugao) * brzina,
        vy: Math.sin(ugao) * brzina,
        r: 3 + Math.random() * 3,
        boja,
        vreme: 0,
        maxVreme: 35 + Math.random() * 20,
      });
    }
  }, [particleAktivan]);

  // ── Crtanje pozadine ──

  const crtajPozadinu = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, timestamp: number) => {
    // Split background: levo plava tinta, desno crvena tinta, centar tamno
    const trecina = w / 3;

    const gradL = ctx.createLinearGradient(0, 0, trecina, 0);
    gradL.addColorStop(0, '#0a0f1f');
    gradL.addColorStop(1, '#050a15');
    ctx.fillStyle = gradL;
    ctx.fillRect(0, 0, trecina, h);

    ctx.fillStyle = '#050a15';
    ctx.fillRect(trecina, 0, trecina, h);

    const gradR = ctx.createLinearGradient(trecina * 2, 0, w, 0);
    gradR.addColorStop(0, '#050a15');
    gradR.addColorStop(1, '#1f0a0a');
    ctx.fillStyle = gradR;
    ctx.fillRect(trecina * 2, 0, trecina, h);

    // Grid mreža
    ctx.strokeStyle = '#67e8f918';
    ctx.lineWidth = 1;
    const gridK = 40;
    for (let x = 0; x < w; x += gridK) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridK) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 3D rezonantni prstenovi od 1440D+
    if (parametri.tredni) {
      crtajRezonancu(ctx, w / 2, h / 2, 90, 8, 6, timestamp / 1000, '#67e8f912');
      crtajRezonancu(ctx, w / 2, h / 2, 120, 6, 4, timestamp / 1300, '#f9731612');
      if (parametri.slojevi >= 4) {
        crtajRezonancu(ctx, w / 2, h / 2, 160, 10, 8, timestamp / 900 + 1, '#a855f710');
      }
    }
  }, [parametri.tredni, parametri.slojevi]);

  // ── Crtanje igrača ──

  const crtajIgraca = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, mod: ElemMod, timestamp: number) => {
    const boja = BOJE[mod].prim;
    const glow = BOJE[mod].glow;
    crtajElipsoid(ctx, x, y, IGRAC_R, IGRAC_R * 0.75, boja);
    crtajRezonancu(ctx, x, y, IGRAC_R + 5, 3, 5, timestamp / 500, `${glow}60`);
    // Ikona moda
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mod === 'cold' ? '❄️' : '🔥', x, y);
  }, []);

  // ── Game loop ──

  const gameLoop = useCallback((timestamp: number) => {
    if (isPauziran) {
      rafRef.current = requestAnimationFrame(stableLoopRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = stateRef.current;
    if (state.gameOver) return;

    const dt = state.poslednjiTick ? Math.min((timestamp - state.poslednjiTick) / 16.67, 3) : 1;
    state.poslednjiTick = timestamp;
    state.vremeAkumulirano += dt / 60;

    // ── Kretanje igrača ──
    const brzina = 5 * brzinaFaktor;
    const { tasteri, igrac } = state;
    if ((tasteri.has('ArrowLeft') || tasteri.has('a') || tasteri.has('A')) && igrac.x - IGRAC_R > 0)
      igrac.x -= brzina * dt;
    if ((tasteri.has('ArrowRight') || tasteri.has('d') || tasteri.has('D')) && igrac.x + IGRAC_R < canvas.width)
      igrac.x += brzina * dt;
    if ((tasteri.has('ArrowUp') || tasteri.has('w') || tasteri.has('W')) && igrac.y - IGRAC_R > 0)
      igrac.y -= brzina * dt;
    if ((tasteri.has('ArrowDown') || tasteri.has('s') || tasteri.has('S')) && igrac.y + IGRAC_R < canvas.height)
      igrac.y += brzina * dt;

    // ── Promena moda (Tab) ──
    if (obaModa && tasteri.has('Tab')) {
      // Ukloni Tab da ne triggeruje više puta u istom frejmu
      state.tasteri.delete('Tab');
      state.mod = state.mod === 'cold' ? 'fire' : 'cold';
    }

    // ── Pucanje (Space/Enter) ──
    const pucanjInterval = Math.max(150, 400 / brzinaFaktor);
    if (
      (tasteri.has(' ') || tasteri.has('Enter')) &&
      timestamp - state.poslednjiPucanj > pucanjInterval
    ) {
      pucaj(state.mod);
      state.poslednjiPucanj = timestamp;
    }

    // ── Ability: Freeze (Q) ──
    if (tasteri.has('q') || tasteri.has('Q')) {
      state.tasteri.delete('q');
      state.tasteri.delete('Q');
      aktivirajFreeze(timestamp);
    }

    // ── Ability: Explosion (E) ──
    if (obaModa && (tasteri.has('e') || tasteri.has('E'))) {
      state.tasteri.delete('e');
      state.tasteri.delete('E');
      if (state.mod === 'fire') aktivirajExplosion(timestamp);
    }

    // ── Spawn ──
    const spawnInterval = Math.max(500, 2000 / brzinaFaktor);
    if (timestamp - state.poslednjiSpawn > spawnInterval) {
      spawnNeprijatelj();
      state.poslednjiSpawn = timestamp;
    }

    // Smanji freeze aktivnost
    if (state.abilityFreeze.aktivna > 0) {
      // eslint-disable-next-line react-hooks/immutability
      state.abilityFreeze.aktivna -= dt;
    }

    // ── Update neprijatelja ──
    const neprPreostali: Neprijatelj[] = [];
    for (const nepr of state.neprijatelji) {
      const brzinaMod = nepr.usporen > 0 ? FREEZE_SLOWDOWN : 1;
      // eslint-disable-next-line react-hooks/immutability
      nepr.x += nepr.vx * dt * brzinaMod;
      // eslint-disable-next-line react-hooks/immutability
      nepr.y += nepr.vy * dt * brzinaMod;
      // eslint-disable-next-line react-hooks/immutability
      nepr.vreme += dt;
      if (nepr.usporen > 0) {
        // eslint-disable-next-line react-hooks/immutability
        nepr.usporen -= dt;
      }

      if (nepr.hp <= 0) {
        dodajParticle(nepr.x, nepr.y, nepr.tip === 'led' ? BOJE.cold.prim : BOJE.fire.prim, 8);
        continue;
      }

      // Prošao ispod ekrana → game over
      if (nepr.y - nepr.r > canvas.height) {
        triggerGameOver();
        return;
      }

      // Kolizija igrač — neprijatelj
      const dxI = igrac.x - nepr.x;
      const dyI = igrac.y - nepr.y;
      if (Math.sqrt(dxI * dxI + dyI * dyI) < IGRAC_R + nepr.r - 5) {
        // Resetuj Fusion pri udaru
        // eslint-disable-next-line react-hooks/immutability
        state.fusionGauge = 0;
        // eslint-disable-next-line react-hooks/immutability
        state.alterniranjaBrojac = 0;
        triggerGameOver();
        return;
      }

      neprPreostali.push(nepr);
    }
    state.neprijatelji = neprPreostali;

    // ── Update projektila ──
    const projPreostali: Projektil[] = [];
    for (const proj of state.projektili) {
      // eslint-disable-next-line react-hooks/immutability
      proj.x += proj.vx * dt;
      // eslint-disable-next-line react-hooks/immutability
      proj.y += proj.vy * dt;
      // eslint-disable-next-line react-hooks/immutability
      proj.vreme += dt;
      if (proj.y + proj.r < 0) continue; // izišao gore
      projPreostali.push(proj);
    }

    // ── Kolizija projektil — neprijatelj ──
    const projFinal: Projektil[] = [];
    for (const proj of projPreostali) {
      let pogodio = false;
      const aoeRadius = proj.aoe ? EXPLOSION_R : 0;

      for (const nepr of state.neprijatelji) {
        const dx = proj.x - nepr.x;
        const dy = proj.y - nepr.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = proj.aoe ? aoeRadius : proj.r + nepr.r;

        if (dist < hitRadius) {
          pogodio = true;

          // Određi štetu — otpor istog elementa
          let steta = 1;
          if (nepr.tip !== 'neutralni') {
            if ((proj.mod === 'cold' && nepr.tip === 'led') ||
                (proj.mod === 'fire' && nepr.tip === 'vatra')) {
              steta = 0; // otporan
            } else {
              steta = 2; // slaba tačka
            }
          }

          if (steta > 0) {
            // eslint-disable-next-line react-hooks/immutability
            nepr.hp -= steta;
            dodajParticle(nepr.x, nepr.y, proj.mod === 'cold' ? BOJE.cold.prim : BOJE.fire.prim);

            if (nepr.hp <= 0) {
              const bodovi = Math.round(15 * parametri.brzinaMultiplikator * (steta > 1 ? 1.5 : 1));
              // eslint-disable-next-line react-hooks/immutability
              state.score.bodovi += bodovi;

              // Fusion gauge logika — naizmenično ubijanje
              if (fusionDostupan) {
                if (state.poslednjiModUbojstva !== null && state.poslednjiModUbojstva !== proj.mod) {
                  // eslint-disable-next-line react-hooks/immutability
                  state.alterniranjaBrojac += 1;
                  // eslint-disable-next-line react-hooks/immutability
                  state.fusionGauge = Math.min(100, (state.alterniranjaBrojac / FUSION_POTREBNO) * 100);
                  if (state.fusionGauge >= 100) {
                    aktivirajFusion();
                  }
                }
                // eslint-disable-next-line react-hooks/immutability
                state.poslednjiModUbojstva = proj.mod;
              }
            }
          }

          if (!proj.aoe) break; // ne-AoE projektil se uništava pri prvom pogotku
        }
      }

      if (proj.aoe) {
        // AoE projektil se uništi na mestu ili kada izađe
        if (pogodio) continue;
        projFinal.push(proj);
      } else {
        if (!pogodio) projFinal.push(proj);
      }
    }
    state.projektili = projFinal;

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

    // ── Update Fusion blastova ──
    state.fusionBlasts = state.fusionBlasts.filter((fb) => {
      // eslint-disable-next-line react-hooks/immutability
      fb.r += 6 * dt;
      // eslint-disable-next-line react-hooks/immutability
      fb.vreme += dt;
      return fb.r < fb.maxR;
    });

    // Ažuriraj score vreme i nivo
    state.score.vreme = Math.floor(state.vremeAkumulirano);
    state.score.nivo = 1 + Math.floor(state.vremeAkumulirano / 30);
    onScoreUpdate({ ...state.score });
    onModChange?.(state.mod, state.fusionGauge);

    // ── Crtanje ──
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    crtajPozadinu(ctx, canvas.width, canvas.height, timestamp);

    // Particles
    for (const p of state.particles) {
      const alfa = 1 - p.vreme / p.maxVreme;
      ctx.globalAlpha = alfa;
      crtajElipsoid(ctx, p.x, p.y, p.r, p.r, p.boja);
    }
    ctx.globalAlpha = 1;

    // Fusion blastovi
    for (const fb of state.fusionBlasts) {
      const alfa = 1 - fb.r / fb.maxR;
      ctx.globalAlpha = alfa * 0.6;
      crtajRezonancu(ctx, fb.x, fb.y, fb.r, 12, 6, timestamp / 400, BOJE.fusion);
      if (parametri.nivo === '5760D') {
        crtajHiperbolu(ctx, fb.x, fb.y, fb.r * 0.3, `${BOJE.fusion}90`);
      }
    }
    ctx.globalAlpha = 1;

    // Neprijatelji
    for (const nepr of state.neprijatelji) {
      const boja = BOJE.neprijatelj[nepr.tip];
      const usporenoAlfa = nepr.usporen > 0 ? 0.5 : 1;
      ctx.globalAlpha = usporenoAlfa;
      crtajRezonancu(ctx, nepr.x, nepr.y, nepr.r, 4, 5, timestamp / 700, boja);
      crtajElipsoid(ctx, nepr.x, nepr.y, nepr.r * 0.72, nepr.r * 0.55, boja + '99');
      ctx.globalAlpha = 1;
      // HP bar
      if (nepr.maxHp > 1) {
        const hpFrac = nepr.hp / nepr.maxHp;
        ctx.fillStyle = '#111827';
        ctx.fillRect(nepr.x - nepr.r, nepr.y + nepr.r + 3, nepr.r * 2, 4);
        ctx.fillStyle = hpFrac > 0.5 ? '#4ade80' : '#f87171';
        ctx.fillRect(nepr.x - nepr.r, nepr.y + nepr.r + 3, nepr.r * 2 * hpFrac, 4);
      }
      // Ikona tipa
      if (tipizirani) {
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nepr.tip === 'led' ? '❄' : nepr.tip === 'vatra' ? '🔥' : '●', nepr.x, nepr.y);
      }
    }

    // Projektili
    for (const proj of state.projektili) {
      if (proj.mod === 'cold') {
        // Spiralni ledeni projektil
        crtajElipsoid(ctx, proj.x, proj.y, proj.r, proj.r * 1.4, BOJE.cold.prim);
        crtajSpiralu(ctx, proj.x, proj.y, proj.r * 2.5, 1.5, `${BOJE.cold.glow}80`);
      } else if (proj.aoe) {
        // AoE eksplozivni
        crtajElipsoid(ctx, proj.x, proj.y, proj.r, proj.r, BOJE.fire.prim);
        crtajRezonancu(ctx, proj.x, proj.y, proj.r + 4, 4, 4, timestamp / 300, `${BOJE.fire.glow}90`);
        if (particleAktivan) {
          crtajSpiralu(ctx, proj.x, proj.y, proj.r * 2, 1, `${BOJE.fire.prim}60`);
        }
      } else {
        // Regularni vatrani projektil
        crtajRezonancu(ctx, proj.x, proj.y, proj.r, 3, 4, timestamp / 300, BOJE.fire.prim);
        crtajElipsoid(ctx, proj.x, proj.y, proj.r * 0.7, proj.r * 0.7, BOJE.fire.tamna);
        if (particleAktivan) {
          crtajSpiralu(ctx, proj.x, proj.y, proj.r * 1.8, 1, `${BOJE.fire.prim}50`);
        }
      }
    }

    // Igrač
    crtajIgraca(ctx, igrac.x, igrac.y, state.mod, timestamp);

    // Hint kontrole (prve 3 sekunde)
    if (state.vremeAkumulirano < 3) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const hint = obaModa
        ? 'WASD/Strelice=kretanje  Space=pucaj  Tab=promeni mod  Q=Freeze  E=Eksplozija'
        : 'WASD/Strelice=kretanje  Space=pucaj  Q=Freeze';
      ctx.fillText(hint, canvas.width / 2, canvas.height - 14);
    }

    rafRef.current = requestAnimationFrame(stableLoopRef.current);
  }, [
    isPauziran,
    brzinaFaktor,
    obaModa,
    fusionDostupan,
    tipizirani,
    particleAktivan,
    parametri,
    pucaj,
    spawnNeprijatelj,
    aktivirajFreeze,
    aktivirajExplosion,
    aktivirajFusion,
    triggerGameOver,
    dodajParticle,
    crtajPozadinu,
    crtajIgraca,
    onScoreUpdate,
    onModChange,
  ]);

  stableLoopRef.current = gameLoop;

  // ── Inicijalizacija ──

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
      mod: startingMod,
      fusionGauge: 0,
      poslednjiModUbojstva: null,
      alterniranjaBrojac: 0,
      abilityFreeze: { cooldown: 0, aktivna: 0 },
      abilityExplosion: { cooldown: 0 },
      neprijatelji: [],
      projektili: [],
      particles: [],
      fusionBlasts: [],
      score: noviScore(parametri.nivo),
      tasteri: new Set(),
      poslednjiSpawn: 0,
      poslednjiPucanj: 0,
      poslednjiAbility: 0,
      vremeAkumulirano: 0,
      poslednjiTick: 0,
      gameOver: false,
    };
    setGameOver(false);
    setFinalScore(null);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [konfiguracija, startingMod, parametri.nivo, gameLoop]);

  // ── Touch kontrole ──

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    stateRef.current.igrac.x = Math.max(IGRAC_R, Math.min(canvas.width - IGRAC_R, touch.clientX - rect.left));
    stateRef.current.igrac.y = Math.max(IGRAC_R, Math.min(canvas.height - IGRAC_R, touch.clientY - rect.top));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleTouchMove(e);
    pucaj(stateRef.current.mod);
  }, [handleTouchMove, pucaj]);

  if (gameOver && finalScore) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-950">
        <div className="text-5xl">💥</div>
        <h2 className="text-2xl font-bold text-white">Game Over!</h2>
        <p className="text-4xl font-bold text-yellow-400">{finalScore.bodovi.toLocaleString('sr-RS')}</p>
        <p className="text-sm text-gray-400">bodova · Nivo {finalScore.nivo}</p>
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
