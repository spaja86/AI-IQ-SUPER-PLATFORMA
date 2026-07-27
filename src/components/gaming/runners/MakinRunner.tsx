'use client';

/**
 * MakinRunner — Fintech borbeni dvoboj MAKIN
 *
 * Canvas-based runner za Market Maker vs Manipulator borbu u dimenzionalnom prostoru.
 *
 * Gameplay mehanika:
 *   - Igrač (elipsoid) se kreće WASD/strelicama
 *   - Space/Enter → osnovni napad (finansijski projektil)
 *   - Q → specijalna sposobnost:
 *       Market Maker: bid wall štit — reflektuje sledeći projektil
 *       Manipulator: flash crash šok val — oštećuje sve u radijusu
 *   - E → sekundarni napad (spread zona — usporava protivnika)
 *   - AI protivnik koristi dimenzionalne market-making taktike
 *   - Dimenzija (D) određuje HP, brzinu, spread radijus i jačinu napada
 *   - Particle efekti sa novčanim simbolima ($, €, ₿) pri udaru
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

export type TipKaraktera = 'market-maker' | 'manipulator';

interface Projektil {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vlasnik: 'igrac' | 'ai';
  odbijen: boolean;
  simbol: string;
  vreme: number;
}

interface SpreadZona {
  x: number;
  y: number;
  r: number;
  maxR: number;
  vreme: number;
  maxVreme: number;
  vlasnik: 'igrac' | 'ai';
}

interface SokVal {
  x: number;
  y: number;
  r: number;
  maxR: number;
  vreme: number;
}

interface BidWall {
  aktivan: boolean;
  trajanje: number;
  maxTrajanje: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  boja: string;
  tekst: string;
  vreme: number;
  maxVreme: number;
}

interface GameState {
  igrac: { x: number; y: number };
  igracHp: number;
  maxIgracHp: number;
  usporenIgrac: number;         // frejmovi efekta usporavanja
  qCooldown: number;            // ms do sledećeg Q
  eCooldown: number;            // ms do sledećeg E
  bidWall: BidWall;
  ai: { x: number; y: number };
  aiHp: number;
  maxAiHp: number;
  usporenAi: number;
  aiNapadCooldown: number;
  aiSpecijalCooldown: number;
  aiSpreadCooldown: number;
  projektili: Projektil[];
  spreadZone: SpreadZona[];
  sokValovi: SokVal[];
  particles: Particle[];
  vreme: number;
  pobednikPoruka: string;
}

// ─── Konstante po dimenziji ──────────────────────────────────────

const D_SKALA: Record<string, { hp: number; brzina: number; spreadR: number; napadJacina: number; aiAgresivnost: number }> = {
  '360D':  { hp: 100, brzina: 2.2, spreadR: 60,  napadJacina: 12, aiAgresivnost: 0.6 },
  '720D':  { hp: 130, brzina: 2.8, spreadR: 80,  napadJacina: 16, aiAgresivnost: 0.75 },
  '1440D': { hp: 170, brzina: 3.5, spreadR: 110, napadJacina: 22, aiAgresivnost: 0.85 },
  '2880D': { hp: 220, brzina: 4.2, spreadR: 145, napadJacina: 30, aiAgresivnost: 0.9 },
  '5760D': { hp: 280, brzina: 5.0, spreadR: 190, napadJacina: 42, aiAgresivnost: 1.0 },
};

const FINANSIJSKI_SIMBOLI = ['$', '€', '₿', '📉', '📈', '💰', '🔥', '⚡'];

// ─── Props ───────────────────────────────────────────────────────

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (finalScore: GameScore) => void;
  startingKarakter?: TipKaraktera;
  restartKey?: number;
}

// ─── Pomoćne funkcije ────────────────────────────────────────────

function noviGameState(
  w: number,
  h: number,
  nivo: string,
): GameState {
  const sk = D_SKALA[nivo] ?? D_SKALA['360D'];
  return {
    igrac: { x: w * 0.2, y: h * 0.5 },
    igracHp: sk.hp,
    maxIgracHp: sk.hp,
    usporenIgrac: 0,
    qCooldown: 0,
    eCooldown: 0,
    bidWall: { aktivan: false, trajanje: 0, maxTrajanje: 90 },
    ai: { x: w * 0.8, y: h * 0.5 },
    aiHp: Math.round(sk.hp * 1.25),
    maxAiHp: Math.round(sk.hp * 1.25),
    usporenAi: 0,
    aiNapadCooldown: 60,
    aiSpecijalCooldown: 240,
    aiSpreadCooldown: 180,
    projektili: [],
    spreadZone: [],
    sokValovi: [],
    particles: [],
    vreme: 0,
    pobednikPoruka: '',
  };
}

function kreirajParticle(x: number, y: number, boja: string): Particle {
  const ugao = Math.random() * Math.PI * 2;
  const brzina = 1.5 + Math.random() * 2.5;
  const simbol = FINANSIJSKI_SIMBOLI[Math.floor(Math.random() * FINANSIJSKI_SIMBOLI.length)];
  return {
    x, y,
    vx: Math.cos(ugao) * brzina,
    vy: Math.sin(ugao) * brzina,
    r: 3 + Math.random() * 3,
    boja,
    tekst: simbol,
    vreme: 0,
    maxVreme: 40 + Math.floor(Math.random() * 20),
  };
}

function kreirajParticle4x(x: number, y: number, boja: string, gs: GameState) {
  for (let i = 0; i < 4; i++) gs.particles.push(kreirajParticle(x, y, boja));
}

// ─── Komponenta ──────────────────────────────────────────────────

export default function MakinRunner({
  konfiguracija,
  isPauziran: _isPauziran,
  onScoreUpdate,
  onKraj,
  startingKarakter = 'market-maker',
  restartKey = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const karakterRef = useRef<TipKaraktera>(startingKarakter);
  const [poruka, setPoruka] = useState('');
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const nivo = konfiguracija.dimenzija.nivo;
  const sk = D_SKALA[nivo] ?? D_SKALA['360D'];
  const scoreRef = useRef<GameScore>(noviScore(nivo));

  // ── Crtanje ──────────────────────────────────────────────────────

  const draw = useCallback((ctx: CanvasRenderingContext2D, gs: GameState, w: number, h: number) => {
    const karakter = karakterRef.current;
    const isMarketMaker = karakter === 'market-maker';

    // Pozadina
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Dimenzionalni grid efekt
    ctx.strokeStyle = isMarketMaker ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Dimenzionalni ornamenti u višim D
    const slojevi = konfiguracija.parametri.slojevi;
    if (slojevi >= 3) {
      crtajSpiralu(ctx, w / 2, h / 2, 80, 2, isMarketMaker ? '#22c55e20' : '#ef444420');
    }
    if (slojevi >= 4) {
      crtajRezonancu(ctx, w / 2, h / 2, 120, 5, 6, 0, isMarketMaker ? '#22c55e15' : '#ef444415');
    }

    // Spread zone
    for (const sz of gs.spreadZone) {
      const alpha = 1 - sz.vreme / sz.maxVreme;
      const boja = sz.vlasnik === 'igrac'
        ? (isMarketMaker ? `rgba(34,197,94,${alpha * 0.3})` : `rgba(239,68,68,${alpha * 0.3})`)
        : `rgba(168,85,247,${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(sz.x, sz.y, sz.r, 0, Math.PI * 2);
      ctx.fillStyle = boja;
      ctx.fill();
      ctx.strokeStyle = boja.replace('0.3)', '0.7)');
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Šok valovi (Manipulator Q)
    for (const sv of gs.sokValovi) {
      const alpha = 1 - sv.r / sv.maxR;
      ctx.beginPath();
      ctx.arc(sv.x, sv.y, sv.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239,68,68,${alpha * 0.8})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Bid wall štit (Market Maker Q)
    if (gs.bidWall.aktivan) {
      const alpha = gs.bidWall.trajanje / gs.bidWall.maxTrajanje;
      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.arc(gs.igrac.x, gs.igrac.y, 28 + 10 * alpha, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = 'rgba(34,197,94,0.15)';
      ctx.fill();
      ctx.restore();
    }

    // Projektili
    for (const pr of gs.projektili) {
      const boja = pr.vlasnik === 'igrac'
        ? (isMarketMaker ? '#22c55e' : '#ef4444')
        : '#a855f7';
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2);
      ctx.fillStyle = boja;
      ctx.fill();
      // Simbol na projektilu
      ctx.font = `${Math.floor(pr.r * 1.5)}px monospace`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pr.simbol, pr.x, pr.y);
    }

    // Particles (finansijski simboli)
    for (const p of gs.particles) {
      const alpha = 1 - p.vreme / p.maxVreme;
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${Math.floor(p.r * 2)}px monospace`;
      ctx.fillStyle = p.boja;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.tekst, p.x, p.y);
    }
    ctx.globalAlpha = 1;

    // AI protivnik
    const aiUsporenBojaAlpha = gs.usporenAi > 0 ? 0.5 : 1;
    ctx.globalAlpha = aiUsporenBojaAlpha;
    crtajElipsoid(ctx, gs.ai.x, gs.ai.y, 20, 25, '#a855f7');
    ctx.globalAlpha = 1;
    // AI HP bar
    ctx.fillStyle = '#1f1f2e';
    ctx.fillRect(gs.ai.x - 25, gs.ai.y - 40, 50, 7);
    const aiHpRatio = gs.aiHp / gs.maxAiHp;
    ctx.fillStyle = aiHpRatio > 0.5 ? '#a855f7' : aiHpRatio > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(gs.ai.x - 25, gs.ai.y - 40, 50 * aiHpRatio, 7);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#d1d5db';
    ctx.textAlign = 'center';
    ctx.fillText('AI', gs.ai.x, gs.ai.y - 47);

    // Igrač
    const igracUsporenAlpha = gs.usporenIgrac > 0 ? 0.6 : 1;
    ctx.globalAlpha = igracUsporenAlpha;
    const igracBoja1 = isMarketMaker ? '#22c55e' : '#ef4444';
    crtajElipsoid(ctx, gs.igrac.x, gs.igrac.y, 20, 25, igracBoja1);
    ctx.globalAlpha = 1;
    // Igrač HP bar
    ctx.fillStyle = '#1f1f2e';
    ctx.fillRect(gs.igrac.x - 25, gs.igrac.y - 40, 50, 7);
    const igracHpRatio = gs.igracHp / gs.maxIgracHp;
    ctx.fillStyle = igracHpRatio > 0.5 ? igracBoja1 : igracHpRatio > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(gs.igrac.x - 25, gs.igrac.y - 40, 50 * igracHpRatio, 7);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#d1d5db';
    ctx.textAlign = 'center';
    ctx.fillText('TI', gs.igrac.x, gs.igrac.y - 47);

    // Dimenzionalni spiral efekt u 5760D
    if (nivo === '5760D') {
      crtajHiperbolu(ctx, gs.ai.x, gs.ai.y, 40, '#a855f730');
    }

    // Pobednička poruka overlay
    if (gs.pobednikPoruka) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = gs.igracHp > 0 ? igracBoja1 : '#ef4444';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gs.pobednikPoruka, w / 2, h / 2);
    }
  }, [konfiguracija.parametri.slojevi, nivo]);

  // ── Game loop ────────────────────────────────────────────────────

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const gs = gsRef.current;
    if (!gs) return;

    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;
    const w = canvas.width;
    const h = canvas.height;
    const keys = keysRef.current;
    const karakter = karakterRef.current;
    const isMarketMaker = karakter === 'market-maker';

    if (!gs.pobednikPoruka) {
      gs.vreme += dt;

      // ── Kretanje igrača ──
      const brzina = (gs.usporenIgrac > 0 ? sk.brzina * 0.4 : sk.brzina);
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) gs.igrac.x -= brzina;
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) gs.igrac.x += brzina;
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) gs.igrac.y -= brzina;
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) gs.igrac.y += brzina;
      gs.igrac.x = Math.max(18, Math.min(w - 18, gs.igrac.x));
      gs.igrac.y = Math.max(18, Math.min(h - 18, gs.igrac.y));

      // ── Cooldown ticking ──
      if (gs.usporenIgrac > 0) gs.usporenIgrac--;
      if (gs.usporenAi > 0) gs.usporenAi--;
      if (gs.qCooldown > 0) gs.qCooldown -= dt;
      if (gs.eCooldown > 0) gs.eCooldown -= dt;
      if (gs.bidWall.aktivan) {
        gs.bidWall.trajanje--;
        if (gs.bidWall.trajanje <= 0) gs.bidWall.aktivan = false;
      }

      // ── AI kretanje ──
      const aiUsporenBrzina = gs.usporenAi > 0 ? sk.brzina * 0.35 : sk.brzina * 0.85;
      const dxAi = gs.igrac.x - gs.ai.x;
      const dyAi = gs.igrac.y - gs.ai.y;
      const distAi = Math.hypot(dxAi, dyAi) || 1;
      // AI orbitira — ne ulazi preblizu
      const targetDist = 180 + sk.spreadR * 0.5;
      if (distAi > targetDist + 10) {
        gs.ai.x += (dxAi / distAi) * aiUsporenBrzina;
        gs.ai.y += (dyAi / distAi) * aiUsporenBrzina;
      } else if (distAi < targetDist - 10) {
        gs.ai.x -= (dxAi / distAi) * aiUsporenBrzina * 0.7;
        gs.ai.y -= (dyAi / distAi) * aiUsporenBrzina * 0.7;
      } else {
        // Bočno kretanje
        gs.ai.x += (-dyAi / distAi) * aiUsporenBrzina * 0.5;
        gs.ai.y += (dxAi / distAi) * aiUsporenBrzina * 0.5;
      }
      gs.ai.x = Math.max(18, Math.min(w - 18, gs.ai.x));
      gs.ai.y = Math.max(18, Math.min(h - 18, gs.ai.y));

      // ── AI napadi ──
      if (gs.aiNapadCooldown > 0) {
        gs.aiNapadCooldown--;
      } else {
        // Navođeni projektil ka igraču
        const ugaoAi = Math.atan2(gs.igrac.y - gs.ai.y, gs.igrac.x - gs.ai.x);
        const brzinaProj = 3.5 + sk.aiAgresivnost;
        gs.projektili.push({
          x: gs.ai.x, y: gs.ai.y,
          vx: Math.cos(ugaoAi) * brzinaProj,
          vy: Math.sin(ugaoAi) * brzinaProj,
          r: 7,
          vlasnik: 'ai',
          odbijen: false,
          simbol: '📉',
          vreme: 0,
        });
        gs.aiNapadCooldown = Math.round(100 / sk.aiAgresivnost);
      }

      // AI spread napad
      if (gs.aiSpreadCooldown > 0) {
        gs.aiSpreadCooldown--;
      } else {
        gs.spreadZone.push({ x: gs.ai.x, y: gs.ai.y, r: 10, maxR: sk.spreadR * 1.1, vreme: 0, maxVreme: 50, vlasnik: 'ai' });
        gs.aiSpreadCooldown = Math.round(180 / sk.aiAgresivnost);
      }

      // AI specijal (šok val u višim D)
      if (gs.aiSpecijalCooldown > 0) {
        gs.aiSpecijalCooldown--;
      } else if (konfiguracija.parametri.slojevi >= 3) {
        gs.sokValovi.push({ x: gs.ai.x, y: gs.ai.y, r: 15, maxR: sk.spreadR * 1.5, vreme: 0 });
        gs.aiSpecijalCooldown = Math.round(300 / sk.aiAgresivnost);
      }

      // ── Projektili ──
      for (let i = gs.projektili.length - 1; i >= 0; i--) {
        const pr = gs.projektili[i];
        pr.x += pr.vx;
        pr.y += pr.vy;
        pr.vreme++;

        // Granice
        if (pr.x < 0 || pr.x > w || pr.y < 0 || pr.y > h || pr.vreme > 200) {
          gs.projektili.splice(i, 1);
          continue;
        }

        // Kolizija igrač
        if (pr.vlasnik === 'ai') {
          const dx = pr.x - gs.igrac.x;
          const dy = pr.y - gs.igrac.y;
          if (Math.hypot(dx, dy) < 22) {
            if (gs.bidWall.aktivan) {
              // Reflektovati projektil
              pr.vlasnik = 'igrac';
              pr.vx = -pr.vx;
              pr.vy = -pr.vy;
              pr.simbol = '🔄';
              pr.odbijen = true;
              gs.bidWall.aktivan = false;
              kreirajParticle4x(pr.x, pr.y, '#22c55e', gs);
            } else {
              const steta = sk.napadJacina;
              gs.igracHp = Math.max(0, gs.igracHp - steta);
              kreirajParticle4x(pr.x, pr.y, '#ef4444', gs);
              gs.projektili.splice(i, 1);
              scoreRef.current = { ...scoreRef.current, bodovi: scoreRef.current.bodovi + 5 };
              onScoreUpdate(scoreRef.current);
            }
            continue;
          }
        }

        // Kolizija AI
        if (pr.vlasnik === 'igrac') {
          const dx = pr.x - gs.ai.x;
          const dy = pr.y - gs.ai.y;
          if (Math.hypot(dx, dy) < 22) {
            const steta = sk.napadJacina;
            gs.aiHp = Math.max(0, gs.aiHp - steta);
            kreirajParticle4x(pr.x, pr.y, '#a855f7', gs);
            gs.projektili.splice(i, 1);
            scoreRef.current = { ...scoreRef.current, bodovi: scoreRef.current.bodovi + 15 };
            onScoreUpdate(scoreRef.current);
            continue;
          }
        }
      }

      // ── Spread zone ──
      for (let i = gs.spreadZone.length - 1; i >= 0; i--) {
        const sz = gs.spreadZone[i];
        sz.vreme++;
        const progress = sz.vreme / sz.maxVreme;
        sz.r = sz.maxR * progress;

        // Kolizija usporavanja
        if (sz.vlasnik === 'igrac') {
          const dx = gs.ai.x - sz.x;
          const dy = gs.ai.y - sz.y;
          if (Math.hypot(dx, dy) < sz.r + 20) gs.usporenAi = 60;
        } else {
          const dx = gs.igrac.x - sz.x;
          const dy = gs.igrac.y - sz.y;
          if (Math.hypot(dx, dy) < sz.r + 20) gs.usporenIgrac = 60;
        }

        if (sz.vreme >= sz.maxVreme) gs.spreadZone.splice(i, 1);
      }

      // ── Šok valovi ──
      for (let i = gs.sokValovi.length - 1; i >= 0; i--) {
        const sv = gs.sokValovi[i];
        sv.r += 4;
        sv.vreme++;
        // Oštećenje kad igrač ulazi u val
        const dx = gs.igrac.x - sv.x;
        const dy = gs.igrac.y - sv.y;
        const dist = Math.hypot(dx, dy);
        if (Math.abs(dist - sv.r) < 12) {
          gs.igracHp = Math.max(0, gs.igracHp - sk.napadJacina * 0.4);
          kreirajParticle4x(gs.igrac.x, gs.igrac.y, '#ef4444', gs);
        }
        if (sv.r >= sv.maxR) gs.sokValovi.splice(i, 1);
      }

      // ── Particles ──
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vreme++;
        if (p.vreme >= p.maxVreme) gs.particles.splice(i, 1);
      }

      // ── Provera pobednika ──
      if (gs.igracHp <= 0) {
        gs.pobednikPoruka = '💀 BANKROT — AI pobedio!';
        onKraj({ ...scoreRef.current });
      } else if (gs.aiHp <= 0) {
        gs.pobednikPoruka = '🏆 TRŽIŠNA DOMINACIJA!';
        onKraj({ ...scoreRef.current, bodovi: scoreRef.current.bodovi + 500 });
      }
    }

    draw(ctx, gs, w, h);
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw, sk, onScoreUpdate, onKraj, konfiguracija.parametri.slojevi]);

  // ── Tastatura ────────────────────────────────────────────────────

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);

      const gs = gsRef.current;
      if (!gs || gs.pobednikPoruka) return;
      const karakter = karakterRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Osnovni napad
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const ugao = Math.atan2(gs.ai.y - gs.igrac.y, gs.ai.x - gs.igrac.x);
        const brzinaProj = 5 + sk.brzina * 0.5;
        const simbol = karakter === 'market-maker' ? '$' : '📈';
        gs.projektili.push({
          x: gs.igrac.x, y: gs.igrac.y,
          vx: Math.cos(ugao) * brzinaProj,
          vy: Math.sin(ugao) * brzinaProj,
          r: 8,
          vlasnik: 'igrac',
          odbijen: false,
          simbol,
          vreme: 0,
        });
      }

      // Q — specijalna sposobnost
      if ((e.key === 'q' || e.key === 'Q') && gs.qCooldown <= 0) {
        if (karakter === 'market-maker') {
          gs.bidWall.aktivan = true;
          gs.bidWall.trajanje = gs.bidWall.maxTrajanje;
        } else {
          // Flash crash šok val
          gs.sokValovi.push({ x: gs.igrac.x, y: gs.igrac.y, r: 20, maxR: sk.spreadR * 1.3, vreme: 0 });
        }
        gs.qCooldown = 3000;
      }

      // E — spread napad
      if ((e.key === 'e' || e.key === 'E') && gs.eCooldown <= 0) {
        gs.spreadZone.push({ x: gs.igrac.x, y: gs.igrac.y, r: 10, maxR: sk.spreadR, vreme: 0, maxVreme: 50, vlasnik: 'igrac' });
        gs.eCooldown = 1500;
      }
    };

    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [sk]);

  // ── Init / restart ───────────────────────────────────────────────

  useEffect(() => {
    karakterRef.current = startingKarakter;
  }, [startingKarakter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gsRef.current = noviGameState(canvas.width, canvas.height, nivo);
    scoreRef.current = noviScore(nivo);
    keysRef.current.clear();
    setPoruka('');
    cancelAnimationFrame(animRef.current);
    lastTimeRef.current = performance.now();
    animRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animRef.current);
  }, [restartKey, nivo, gameLoop]);

  // ── Cooldown display ─────────────────────────────────────────────

  const gs = gsRef.current;
  const qReady = !gs || gs.qCooldown <= 0;
  const eReady = !gs || gs.eCooldown <= 0;
  const karakter = startingKarakter;
  const isMarketMaker = karakter === 'market-maker';

  return (
    <div className="relative flex h-full flex-col bg-gray-950">
      {/* Controls HUD */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-3 py-1.5 text-xs">
        <div className="flex gap-3 text-gray-400">
          <span><kbd className="rounded bg-gray-700 px-1">WASD</kbd> Kretanje</span>
          <span><kbd className="rounded bg-gray-700 px-1">Space</kbd> Napad</span>
          <span className={qReady ? 'text-green-400' : 'text-gray-500'}>
            <kbd className="rounded bg-gray-700 px-1">Q</kbd>{' '}
            {isMarketMaker ? 'Bid Wall štit' : 'Flash Crash'}
            {!qReady && ' ⏳'}
          </span>
          <span className={eReady ? 'text-yellow-400' : 'text-gray-500'}>
            <kbd className="rounded bg-gray-700 px-1">E</kbd> Spread napad{!eReady && ' ⏳'}
          </span>
        </div>
        <span className={`font-semibold ${isMarketMaker ? 'text-green-400' : 'text-red-400'}`}>
          {isMarketMaker ? '📊 Market Maker' : '📉 Manipulator'}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1 w-full block"
        style={{ touchAction: 'none' }}
      />

      {poruka && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xl font-bold text-white drop-shadow">{poruka}</p>
        </div>
      )}
    </div>
  );
}
