'use client';

/**
 * ReaktRunner — Igra Refleksa i Reakcionog Vremena
 *
 * Canvas-based runner za kategoriju: reakt
 *
 * Gameplay mehanika:
 *   - Dimenzionalni stimulusi (elipsoidi, rezonantni prstenovi) pojavljuju se
 *     na nasumičnim pozicijama na platnu
 *   - Igrač klikće/tapuje stimulus što pre može
 *   - Bodovi = Math.round((1000 / reakcionoVreme_ms) * dimenzionalniBonus * streakMultiplikator)
 *   - Streak: uzastopni brzi hitovi (<400ms) povećavaju streak (max 8×)
 *   - Distraktori (crveni hiperbole-oblici) pojavljuju se od 1440D nadalje —
 *     klik na distraktor oduzima HP i ruši streak
 *
 * Dimenzionalni efekti:
 *   360D  — 1 stimulus, slow fade, bez distraktora
 *   720D  — 2 simultana, brži nestanak
 *   1440D — 3 simultana + distraktori
 *   2880D — 4 simultana + distraktori + pokretni stimulusi
 *   5760D — 5 simultana + distraktori + pokretni + rotacija oblika
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import type { GamingEndzinKonfiguracija, GameScore } from '@/lib/gaming-endzin';
import { noviScore, crtajElipsoid, crtajRezonancu } from '@/lib/gaming-endzin';

// ─── Scoring formula (izvezena radi testiranja) ─────────────────────

export function izracunajBodove(
  reakcionoVremeMs: number,
  dimenzionalniBonus: number,
  streakMultiplikator: number,
): number {
  if (reakcionoVremeMs <= 0) return 0;
  return Math.round((1000 / reakcionoVremeMs) * dimenzionalniBonus * streakMultiplikator);
}

export function izracunajStreakMultiplikator(streak: number): number {
  return Math.min(1 + streak * 0.25, 8);
}

export function jeDistraktor(tipStimulusa: 'cilj' | 'distraktor'): boolean {
  return tipStimulusa === 'distraktor';
}

// ─── Tipovi ─────────────────────────────────────────────────────────

interface Stimulus {
  id: number;
  x: number;
  y: number;
  r: number;
  tip: 'cilj' | 'distraktor';
  vremePojavljivanja: number;
  vremeNestajanja: number;
  /** alfa providnost (1 = pun, 0 = nestao) */
  alfa: number;
  /** kutna brzina rotacije (za 5760D) */
  rotacija: number;
  /** brzina kretanja (za 2880D+) */
  vx: number;
  vy: number;
}

interface Props {
  konfiguracija: GamingEndzinKonfiguracija;
  isPauziran: boolean;
  onScoreUpdate: (score: GameScore) => void;
  onKraj: (score: GameScore) => void;
}

const MAX_HP = 5;
const BRZINA_NESTAJANJA_MS: Record<string, number> = {
  '360D': 2200,
  '720D': 1600,
  '1440D': 1200,
  '2880D': 900,
  '5760D': 700,
};
const MAX_SIMULTANIH: Record<string, number> = {
  '360D': 1,
  '720D': 2,
  '1440D': 3,
  '2880D': 4,
  '5760D': 5,
};
const IMA_DISTRAKTOR: Record<string, boolean> = {
  '360D': false,
  '720D': false,
  '1440D': true,
  '2880D': true,
  '5760D': true,
};
const IMA_KRETANJE: Record<string, boolean> = {
  '360D': false,
  '720D': false,
  '1440D': false,
  '2880D': true,
  '5760D': true,
};
const IMA_ROTACIJU: Record<string, boolean> = {
  '360D': false,
  '720D': false,
  '1440D': false,
  '2880D': false,
  '5760D': true,
};
const STREAK_PRAG_MS = 400;

let nextId = 1;

function kreirajStimulus(
  canvas: HTMLCanvasElement,
  nivo: string,
  vremePojavljivanja: number,
): Stimulus {
  const r = 28 + Math.random() * 16;
  const x = r + Math.random() * (canvas.width - 2 * r);
  const y = r + Math.random() * (canvas.height - 2 * r);
  const imaDistrak = IMA_DISTRAKTOR[nivo] ?? false;
  const tip: 'cilj' | 'distraktor' = imaDistrak && Math.random() < 0.3 ? 'distraktor' : 'cilj';
  const trajanje = BRZINA_NESTAJANJA_MS[nivo] ?? 1500;
  const imaKretanje = IMA_KRETANJE[nivo] ?? false;
  const imaRotaciju = IMA_ROTACIJU[nivo] ?? false;
  return {
    id: nextId++,
    x,
    y,
    r,
    tip,
    vremePojavljivanja,
    vremeNestajanja: vremePojavljivanja + trajanje,
    alfa: 1,
    rotacija: imaRotaciju ? (Math.random() - 0.5) * 0.08 : 0,
    vx: imaKretanje ? (Math.random() - 0.5) * 1.5 : 0,
    vy: imaKretanje ? (Math.random() - 0.5) * 1.5 : 0,
  };
}

export default function ReaktRunner({ konfiguracija, isPauziran, onScoreUpdate, onKraj }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { parametri } = konfiguracija;
  const nivo = konfiguracija.dimenzija.nivo;

  const stateRef = useRef({
    stimulusi: [] as Stimulus[],
    score: noviScore(nivo),
    hp: MAX_HP,
    streak: 0,
    poslednjiHitVreme: 0,
    spawnInterval: null as ReturnType<typeof setInterval> | null,
    rafId: null as number | null,
    vremeStart: 0,
    aktivan: false,
  });

  const [displayHp, setDisplayHp] = useState(MAX_HP);
  const [displayStreak, setDisplayStreak] = useState(0);
  const [feedbackTekst, setFeedbackTekst] = useState<string | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prikaziFeedback = useCallback((tekst: string) => {
    setFeedbackTekst(tekst);
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedbackTekst(null), 600);
  }, []);

  const zavrsíIgru = useCallback(() => {
    const st = stateRef.current;
    if (!st.aktivan) return;
    st.aktivan = false;
    if (st.spawnInterval) clearInterval(st.spawnInterval);
    if (st.rafId) cancelAnimationFrame(st.rafId);
    onKraj({ ...st.score });
  }, [onKraj]);

  const handleKlik = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const st = stateRef.current;
      if (!st.aktivan || isPauziran) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let kx: number;
      let ky: number;
      if ('touches' in e) {
        kx = (e.changedTouches[0]?.clientX ?? 0) - rect.left;
        ky = (e.changedTouches[0]?.clientY ?? 0) - rect.top;
      } else {
        kx = e.clientX - rect.left;
        ky = e.clientY - rect.top;
      }
      // Skaliraj na canvas koordinate
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = kx * scaleX;
      const cy = ky * scaleY;

      const sada = performance.now();
      let pogodio = false;

      for (let i = st.stimulusi.length - 1; i >= 0; i--) {
        const s = st.stimulusi[i];
        const dist = Math.hypot(cx - s.x, cy - s.y);
        if (dist <= s.r + 6) {
          // pogodak
          st.stimulusi.splice(i, 1);
          if (s.tip === 'distraktor') {
            // Klik na distraktor — penalizacija
            st.hp -= 1;
            st.streak = 0;
            setDisplayHp(st.hp);
            setDisplayStreak(0);
            prikaziFeedback('❌ Distraktor!');
            if (st.hp <= 0) zavrsíIgru();
          } else {
            // Pravi stimulus
            const reakcionoVreme = sada - s.vremePojavljivanja;
            const jeStreak = sada - st.poslednjiHitVreme < STREAK_PRAG_MS + (BRZINA_NESTAJANJA_MS[nivo] ?? 1500);
            if (jeStreak) st.streak++;
            else st.streak = 1;
            st.poslednjiHitVreme = sada;

            const streakMult = izracunajStreakMultiplikator(st.streak);
            const bodovi = izracunajBodove(reakcionoVreme, parametri.brzinaMultiplikator, streakMult);
            st.score.bodovi += bodovi;
            st.score.nivo = Math.floor(st.score.bodovi / 500) + 1;
            st.score.vreme = Math.round((sada - st.vremeStart) / 1000);

            setDisplayStreak(st.streak);
            onScoreUpdate({ ...st.score });
            const msText = reakcionoVreme < 1000 ? `${Math.round(reakcionoVreme)}ms` : `${(reakcionoVreme / 1000).toFixed(1)}s`;
            prikaziFeedback(
              st.streak >= 3
                ? `⚡ STREAK ×${st.streak} (+${bodovi})`
                : `+${bodovi} (${msText})`,
            );
          }
          pogodio = true;
          break;
        }
      }

      if (!pogodio) {
        // Promašaj — ruši streak
        st.streak = 0;
        setDisplayStreak(0);
      }
    },
    [isPauziran, nivo, parametri.brzinaMultiplikator, onScoreUpdate, prikaziFeedback, zavrsíIgru],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const st = stateRef.current;
    st.score = noviScore(nivo);
    st.hp = MAX_HP;
    st.streak = 0;
    st.stimulusi = [];
    st.vremeStart = performance.now();
    st.aktivan = true;
    setDisplayHp(MAX_HP);
    setDisplayStreak(0);

    const maxSimult = MAX_SIMULTANIH[nivo] ?? 1;
    const spawnRateMs = Math.max(300, (BRZINA_NESTAJANJA_MS[nivo] ?? 1500) / maxSimult);

    // ── Spawn loop ──
    function spawn() {
      if (!st.aktivan || isPauziran) return;
      const aktuelniBroj = st.stimulusi.length;
      if (aktuelniBroj < maxSimult) {
        st.stimulusi.push(kreirajStimulus(canvas!, nivo, performance.now()));
      }
    }
    spawn();
    st.spawnInterval = setInterval(spawn, spawnRateMs);

    // ── Render loop ──
    function render() {
      if (!st.aktivan) return;
      const sada = performance.now();

      // Resize canvas ako je potrebno
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth * dpr;
      const h = canvas!.offsetHeight * dpr;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Pozadina
      ctx!.fillStyle = '#030712';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      if (isPauziran) {
        st.rafId = requestAnimationFrame(render);
        return;
      }

      // Ažuriraj stimuluse
      const expired: number[] = [];
      for (let i = 0; i < st.stimulusi.length; i++) {
        const s = st.stimulusi[i];
        // Pomeri ako se kreće
        s.x += s.vx;
        s.y += s.vy;
        s.x = Math.max(s.r, Math.min((canvas?.width ?? 400) - s.r, s.x));
        s.y = Math.max(s.r, Math.min((canvas?.height ?? 400) - s.r, s.y));
        if (s.x <= s.r || s.x >= (canvas?.width ?? 400) - s.r) s.vx *= -1;
        if (s.y <= s.r || s.y >= (canvas?.height ?? 400) - s.r) s.vy *= -1;
        // Alfa fade
        const preostalo = s.vremeNestajanja - sada;
        const ukupnoTrajanje = BRZINA_NESTAJANJA_MS[nivo] ?? 1500;
        s.alfa = Math.max(0, Math.min(1, preostalo / (ukupnoTrajanje * 0.3)));

        if (sada >= s.vremeNestajanja) {
          expired.push(i);
          // Propušteni cilj ruši HP
          if (s.tip === 'cilj') {
            st.hp -= 1;
            setDisplayHp(st.hp);
            st.streak = 0;
            setDisplayStreak(0);
            if (st.hp <= 0) {
              st.aktivan = false;
              if (st.spawnInterval) clearInterval(st.spawnInterval);
              onKraj({ ...st.score });
              return;
            }
          }
        }
      }
      // Ukloni expired (od kraja ka početku)
      for (let i = expired.length - 1; i >= 0; i--) {
        st.stimulusi.splice(expired[i], 1);
      }

      // Crtaj stimuluse
      for (const s of st.stimulusi) {
        ctx!.save();
        ctx!.globalAlpha = s.alfa;
        ctx!.translate(s.x, s.y);

        if (s.tip === 'distraktor') {
          // Crveni hiperbola-like cross oblik
          ctx!.strokeStyle = '#ef4444';
          ctx!.lineWidth = 3;
          ctx!.beginPath();
          ctx!.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.moveTo(-s.r * 0.7, -s.r * 0.7);
          ctx!.lineTo(s.r * 0.7, s.r * 0.7);
          ctx!.moveTo(s.r * 0.7, -s.r * 0.7);
          ctx!.lineTo(-s.r * 0.7, s.r * 0.7);
          ctx!.strokeStyle = '#f87171';
          ctx!.lineWidth = 2;
          ctx!.stroke();
        } else {
          // Plavi/zeleni elipsoid + rezonantni prsten
          const boja = parametri.akcentHex;
          crtajElipsoid(ctx!, 0, 0, s.r, s.r * 0.75, boja + '99');
          crtajRezonancu(
            ctx!,
            0,
            0,
            s.r + 4,
            4,
            6,
            (sada / 300 + s.id * 0.7),
            boja,
          );
        }

        ctx!.restore();
      }

      // Puls indikator za dimenzionalni bonus
      if (parametri.particleSistem) {
        const t = sada / 800;
        for (let p = 0; p < 3; p++) {
          const px = Math.cos(t + p * 2.1) * ((canvas?.width ?? 400) * 0.45) + (canvas?.width ?? 400) / 2;
          const py = Math.sin(t + p * 2.1) * ((canvas?.height ?? 400) * 0.4) + (canvas?.height ?? 400) / 2;
          ctx!.beginPath();
          ctx!.arc(px, py, 3, 0, Math.PI * 2);
          ctx!.fillStyle = parametri.akcentHex + '33';
          ctx!.fill();
        }
      }

      st.rafId = requestAnimationFrame(render);
    }

    st.rafId = requestAnimationFrame(render);

    return () => {
      st.aktivan = false;
      if (st.spawnInterval) clearInterval(st.spawnInterval);
      if (st.rafId) cancelAnimationFrame(st.rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivo, konfiguracija.igrica.id]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gray-950">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair touch-none"
        onClick={handleKlik}
        onTouchEnd={handleKlik}
        style={{ display: 'block' }}
      />

      {/* UI Overlay — HP i Streak */}
      <div className="pointer-events-none absolute left-0 top-0 flex w-full items-start justify-between px-3 pt-2">
        {/* HP srca */}
        <div className="flex gap-1">
          {Array.from({ length: MAX_HP }).map((_, i) => (
            <span key={i} className={`text-lg ${i < displayHp ? 'text-red-400' : 'text-gray-700'}`}>
              ♥
            </span>
          ))}
        </div>

        {/* Streak */}
        {displayStreak >= 2 && (
          <div className="rounded-lg bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-300">
            ⚡ STREAK ×{displayStreak}
          </div>
        )}
      </div>

      {/* Feedback poruka */}
      {feedbackTekst && (
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
          {feedbackTekst}
        </div>
      )}

      {/* Uputstvo pri prvom prikazu */}
      {stateRef.current.stimulusi.length === 0 && displayHp === MAX_HP && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-gray-600">
          Klikni na stimuluse ⚡ · Izbegavaj crvene ✕
        </div>
      )}
    </div>
  );
}
