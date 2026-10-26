'use client';

import { useEffect, useReducer, useRef } from 'react';
import { CAMERAS, SECTOR, createDuel, duelReducer, project, type Duel, type Unit } from '@/lib/transformers/engine';

function Box({ x, z, w, d, h, color, state }: {
  x: number; z: number; w: number; d: number; h: number; color: string; state: Duel;
}) {
  const points = (vertices: number[][]) => vertices.map(([a, b, c]) => project(a, b, c, state).join(',')).join(' ');
  return <g stroke="#020617" strokeWidth="1.5">
    <polygon fill={color} opacity="0.65" points={points([[x,z,0],[x+w,z,0],[x+w,z,h],[x,z,h]])} />
    <polygon fill={color} opacity="0.8" points={points([[x+w,z,0],[x+w,z+d,0],[x+w,z+d,h],[x+w,z,h]])} />
    <polygon fill={color} points={points([[x,z,h],[x+w,z,h],[x+w,z+d,h],[x,z+d,h]])} />
  </g>;
}

function Robot({ unit, state }: { unit: Unit; state: Duel }) {
  const color = unit.id === 'player' ? '#22d3ee' : '#fb7185';
  const p = project(unit.x, unit.z, 10, state);
  return <g opacity={unit.transition > 0 ? 0.5 : 1}>
    {unit.form === 'robot' ? <>
      <Box x={unit.x-1.8} z={unit.z-1.2} w={3.6} d={2.4} h={5} color={color} state={state}/>
      <Box x={unit.x-1} z={unit.z-0.9} w={2} d={1.8} h={7} color={color} state={state}/>
      {[-3, 2].map(offset => <Box key={offset} x={unit.x+offset} z={unit.z-1} w={1} d={2} h={3.5} color={color} state={state}/>)}
    </> : <>
      <Box x={unit.x-2} z={unit.z-2} w={4} d={4} h={1.5} color={color} state={state}/>
      <Box x={unit.x-1.5} z={unit.z-1} w={3} d={2} h={2.7} color={color} state={state}/>
    </>}
    <text x={p[0]} y={p[1]} textAnchor="middle" fill={color} fontSize="12" fontFamily="monospace">
      {unit.id === 'player' ? 'TI' : 'BOT'} · {unit.hp} HP
    </text>
  </g>;
}

const controlStyle = 'min-h-11 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:opacity-40';
export default function TransformersRunner({ onIzlaz }: { onIzlaz?: () => void }) {
  const [state, dispatch] = useReducer(duelReducer, undefined, createDuel);
  const keys = useRef(new Set<string>());
  useEffect(() => {
    if (state.phase !== 'active' || state.paused) return;
    let previous = performance.now();
    const clear = () => { keys.current.clear(); previous = performance.now(); };
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    const interval = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.max(0, (now - previous) / 1000);
      previous = now;
      if (document.hidden) return;
      const pressed = keys.current;
      dispatch({ type: 'advance', dt,
        x: Number(pressed.has('d') || pressed.has('arrowright')) - Number(pressed.has('a') || pressed.has('arrowleft')),
        z: Number(pressed.has('s') || pressed.has('arrowdown')) - Number(pressed.has('w') || pressed.has('arrowup')),
        fire: pressed.has(' ') });
    }, 50);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
      clear();
    };
  }, [state.phase, state.paused]);
  const active = state.phase === 'active' && !state.paused;
  const [player, bot] = state.units;
  const result = state.result === 'win' ? 'POBEDA' : state.result === 'loss' ? 'PORAZ' : 'NEREŠENO';
  const line = (x: number, z: number, a: number, b: number) => {
    const p = project(x,z,0,state), q = project(a,b,0,state);
    return { x1:p[0], y1:p[1], x2:q[0], y2:q[1] };
  };
  const switchCamera = () => dispatch({ type:'camera', id: state.camera % 4 + 1 });
  return <section aria-label="TRANSFORMERS lokalni prototip" tabIndex={0}
    className="flex h-full min-h-[600px] flex-col overflow-auto bg-slate-950 text-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) keys.current.clear(); }}
    onKeyDown={event => {
      if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLSelectElement) return;
      const key = event.key.toLowerCase();
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','t','c','p','escape'].includes(key)) event.preventDefault();
      keys.current.add(key);
      if (event.repeat) return;
      if (key === 't') dispatch({type:'transform'});
      if (key === 'c') switchCamera();
      if (key === 'p' || key === 'escape') { keys.current.clear(); dispatch({type:'pause'}); }
    }}
    onKeyUp={event => keys.current.delete(event.key.toLowerCase())}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4">
      <div><p className="text-xs tracking-[0.25em] text-cyan-300">SPAJA / LOKALNI PROTOTIP</p>
        <h1 className="text-2xl font-black tracking-tight">TRANSFORMERS <span className="text-cyan-300">1350</span></h1></div>
      <div className="flex gap-2">
        <button type="button" className={controlStyle} disabled={state.phase !== 'active'} onClick={() => { keys.current.clear(); dispatch({type:'pause'}); }}>{state.paused ? 'Nastavi' : 'Pauza'}</button>
        {onIzlaz && <button type="button" className={controlStyle} onClick={onIzlaz}>Izlaz</button>}
      </div>
    </header>
    <div className="grid grid-cols-3 gap-2 px-4 pt-4 text-center text-sm">
      <div className="rounded-xl bg-cyan-950 p-3 text-cyan-200">TI <strong>{player.hp} HP</strong><br/>{player.transition > 0 ? 'Transformacija…' : player.form === 'robot' ? 'ROBOT' : 'VOZILO'}</div>
      <div className="rounded-xl bg-slate-900 p-3"><strong className="text-xl tabular-nums">{Math.ceil(state.remaining)} s</strong><br/>LOKALNI DUEL</div>
      <div className="rounded-xl bg-rose-950 p-3 text-rose-200">BOT <strong>{bot.hp} HP</strong><br/>SKRIPTOVANI PROTIVNIK</div>
    </div>
    <div className="relative mx-4 mt-3 min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-slate-700 bg-[#071621]">
      <svg onPointerDown={event => event.currentTarget.closest('section')?.focus()} viewBox="0 0 800 520" className="h-full min-h-[260px] max-h-[520px] w-full" role="img" aria-label={`${SECTOR.name}, kamera ${state.camera}, igrač ${player.hp} HP, bot ${bot.hp} HP`}>
        <defs><radialGradient id="transformers-ground"><stop stopColor="#123744"/><stop offset="1" stopColor="#071621"/></radialGradient></defs>
        <rect width="800" height="520" fill="url(#transformers-ground)"/>
        {Array.from({length:11},(_,i) => <g key={i} stroke="#24505e" strokeWidth="1"><line {...line(i*10,0,i*10,100)}/><line {...line(0,i*10,100,i*10)}/></g>)}
        <polygon points={[[0,0],[100,0],[100,100],[0,100]].map(([x,z]) => project(x,z,0,state).join(',')).join(' ')} fill="none" stroke="#38bdf8" strokeWidth="2"/>
        {SECTOR.obstacles.map((o,i) => <Box key={i} {...o} h={4} color="#64748b" state={state}/>)}
        {[...state.units].sort((a,b) => project(a.x,a.z,0,state)[1]-project(b.x,b.z,0,state)[1]).map(unit => <Robot key={unit.id} unit={unit} state={state}/>)}
        {state.units.map(unit => unit.flash > 0 && <line key={unit.id} {...line(unit.x,unit.z,unit.id === 'player' ? bot.x : player.x,unit.id === 'player' ? bot.z : player.z)} stroke={unit.id === 'player' ? '#67e8f9' : '#fda4af'} strokeWidth="3" strokeDasharray="5 6"/>)}
        <text x="20" y="28" fill="#94a3b8" fontSize="12">SMEDEREVO / 2 × 2 km / ŠEMATSKI TEREN</text>
        <text x="20" y="502" fill="#94a3b8" fontSize="12">{CAMERAS[state.camera-1].name} · 2.5D prikaz</text>
      </svg>
      {(state.phase !== 'active' || state.paused) && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-5 text-center backdrop-blur-sm">
        <div className="max-w-sm space-y-3"><p className="text-xs tracking-widest text-cyan-300">SEKTOR ZEMLJE / SMEDEREVO</p>
          <h2 className="text-3xl font-black" role="status">{state.phase === 'ready' ? 'SPREMAN ZA DUEL?' : state.phase === 'finished' ? result : 'PAUZA'}</h2>
          <p className="text-sm text-slate-300">{state.phase === 'finished' ? 'Duel je završen. Novi duel vraća zdravlje, oblike, položaje i sat.' : 'Robot napada u dometu 520 m. Vozilo se kreće brže, ali ne puca. Prepreke zaustavljaju kretanje i napade. Posle 90 s bez pobednika: nerešeno.'}</p>
          <button type="button" className={`${controlStyle} !bg-cyan-300 !text-slate-950`} onClick={event => {
            keys.current.clear();
            dispatch({type: state.phase === 'ready' ? 'start' : state.phase === 'finished' ? 'reset' : 'pause'});
            event.currentTarget.closest('section')?.focus();
          }}>{state.phase === 'ready' ? 'Pokreni duel' : state.phase === 'finished' ? 'Novi duel' : 'Nastavi duel'}</button>
        </div>
      </div>}
    </div>
    <div className="flex flex-wrap items-center gap-2 p-4">
      <label className="flex flex-1 items-center gap-2 text-sm">Kamera
        <select aria-label="Pogled kamere" className="min-h-11 max-w-full rounded-xl border border-slate-600 bg-slate-900 px-2" value={state.camera} onChange={event => dispatch({type:'camera',id:Number(event.target.value)})}>
          {CAMERAS.map(camera => <option key={camera.id} value={camera.id} disabled={!camera.implemented}>{camera.id}. {camera.name}{!camera.implemented ? ' — planirano' : ''}</option>)}
        </select>
      </label>
      {state.camera === 3 && <><button type="button" className={controlStyle} aria-label="Rotiraj kameru ulevo" onClick={() => dispatch({type:'orbit',delta:-0.2})}>↶</button><button type="button" className={controlStyle} aria-label="Rotiraj kameru udesno" onClick={() => dispatch({type:'orbit',delta:0.2})}>↷</button></>}
      <button type="button" className={controlStyle} disabled={!active || player.transition > 0} onClick={() => dispatch({type:'transform'})}>T · Transformiši</button>
      <button type="button" className={controlStyle} disabled={!active || player.form !== 'robot' || player.transition > 0} onClick={() => dispatch({type:'fire'})}>Napad · Space</button>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4">
      <div className="flex gap-2" aria-label="Kontrole kretanja na dodir">
        {([['a','←'],['w','↑'],['s','↓'],['d','→']] as const).map(([key,label]) => <button type="button" key={key} aria-label={`Kretanje ${label}`} disabled={!active} className={`${controlStyle} touch-none select-none`}
          onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); keys.current.add(key); }}
          onPointerUp={() => keys.current.delete(key)} onPointerCancel={() => keys.current.delete(key)} onLostPointerCapture={() => keys.current.delete(key)}>{label}</button>)}
      </div>
      <p className="text-xs text-slate-400">Klikni teren za tastaturu · WASD/strelice · T oblik · C kamera · P pauza</p>
    </div>
    <details className="mx-4 mb-4 rounded-xl border border-slate-800 p-3 text-xs text-slate-400"><summary className="cursor-pointer">Obuhvat prototipa — 4 od 23 pogleda</summary>
      <p className="mt-2">Jedna transformacija, lokalni bot i šematski sektor oko {SECTOR.latitude}° N, {SECTOR.longitude}° E. Lokacija je približna; teren nije geografski snimak. Pregled duela drži oba učesnika u kadru. Sve dimenzionalne oznake koriste istu simulaciju. Liga, eliminacija, mrežni mečevi, ostale transformacije, cela Zemlja i pogledi 5–23 su planirani.</p>
    </details>
  </section>;
}
