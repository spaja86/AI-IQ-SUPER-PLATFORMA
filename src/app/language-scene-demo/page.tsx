'use client';
import { useState } from 'react';
import { executeSceneDemo, SCENE_DEMO_SOURCE, type DemoScene } from '@/lib/ai-iq-programski-jezik/scene-demo';

export default function LanguageSceneDemo() {
  const [source, setSource] = useState(SCENE_DEMO_SOURCE);
  const [scene, setScene] = useState<DemoScene>(() => executeSceneDemo(SCENE_DEMO_SOURCE));
  const [message, setMessage] = useState('Lokalni deterministički primer.');
  function run() {
    try { setScene(executeSceneDemo(source)); setMessage('Program izvršen: konfiguracija kocke ažurirana.'); }
    catch { setMessage('Nevalidan primer. Prethodna scena ostaje nepromenjena.'); }
  }
  return <main className="mx-auto max-w-3xl p-8">
    <h1>VRH — minimalni DSL / 3D prikaz</h1>
    <p>Ograničen demonstracioni dijalekt. Nije kanonski AI izvršivač, VR ili stereoskopski prikaz. 360° je ugao, ne 360 prostornih dimenzija.</p>
    <label htmlFor="demo-source">Program</label>
    <textarea id="demo-source" rows={6} maxLength={2048} value={source} onChange={e => setSource(e.target.value)} className="block w-full border p-3" />
    <button type="button" onClick={run}>Izvrši lokalni primer</button>
    <p role="status" aria-live="polite">{message}</p>
    <div role="img" aria-label={`CSS 3D kocka, rotacija ${scene.rotationY} stepeni`} style={{ perspective: 600, height: 260, display: 'grid', placeItems: 'center' }}>
      <div style={{ width: 120, height: 120, position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(-20deg) rotateY(${scene.rotationY}deg)` }}>
        {['rotateY(0deg)', 'rotateY(180deg)', 'rotateY(90deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((rotation, i) =>
          <div key={rotation} style={{ position: 'absolute', inset: 0, border: '2px solid #111', background: `hsl(${i * 55} 60% 60% / 0.85)`, transform: `${rotation} translateZ(60px)`, display: 'grid', placeItems: 'center', color: '#111' }}>{i + 1}</div>)}
      </div>
    </div>
  </main>;
}
