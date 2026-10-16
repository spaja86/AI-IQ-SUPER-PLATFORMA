'use client';

import { useEffect, useState } from 'react';
import { resolveVrCapabilityReport, type VrCapabilityReport } from '@/lib/vr-capability';

type NavigatorWithXr = Navigator & { xr?: { isSessionSupported?: (mode: 'immersive-vr') => Promise<boolean> } };

function supportsWebgl(): boolean {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
}

export default function VrCapabilityCheck() {
  const [report, setReport] = useState<VrCapabilityReport | null>(null);

  useEffect(() => {
    const navigatorWithXr = navigator as NavigatorWithXr;
    const check = async () => {
      const webglAvailable = supportsWebgl();
      const webxrAvailable = typeof navigatorWithXr.xr?.isSessionSupported === 'function';
      let immersiveVrSupported = false;
      if (webxrAvailable) {
        try {
          immersiveVrSupported = await navigatorWithXr.xr!.isSessionSupported!('immersive-vr');
        } catch {
          immersiveVrSupported = false;
        }
      }
      setReport(resolveVrCapabilityReport({ webglAvailable, webxrAvailable, immersiveVrSupported }));
    };
    void check();
  }, []);

  return (
    <section className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">3D / VR capability check</h2>
      {!report && <p className="mt-2 text-sm text-slate-300">Provera WebGL i WebXR mogućnosti pregledača…</p>}
      {report && <>
        <p className="mt-2 text-sm text-cyan-100">{report.message}</p>
        <p className="mt-3 text-xs text-slate-400">WebGL: {String(report.webglAvailable)} · WebXR: {String(report.webxrAvailable)} · immersive VR: {String(report.immersiveVrSupported)}</p>
        <p className="mt-2 text-xs text-amber-100">{report.disclaimer}</p>
      </>}
    </section>
  );
}
