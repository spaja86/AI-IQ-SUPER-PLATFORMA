// Autofinish #822 — /autofinish Dashboard UI Stranica
// Kompanija SPAJA — Digitalna Industrija

import type { Metadata } from 'next';
import { pokreniAutofinishPetlju } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Autofinish Dashboard — AI IQ SUPER PLATFORMA',
  description: `Autofinish petlja — ponavljanje do 100% za sve OMEGA podsisteme. Iteracija #${AUTOFINISH_COUNT} — ${KOMPANIJA}`,
};

export default function AutofinishPage() {
  const izvestaj = pokreniAutofinishPetlju();
  const procenat = ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2);

  const statusLabel =
    izvestaj.status === 'zavrsena'
      ? '✅ OMEGA PROJEKAT NA 100%'
      : izvestaj.status === 'ponavljanje'
        ? '🔄 PONAVLJANJE U TOKU'
        : '⚡ U TOKU';

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ⚡ Autofinish Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            {KOMPANIJA} — Verzija {APP_VERSION} — Iteracija #{AUTOFINISH_COUNT}
          </p>
        </div>

        {/* Status kartica */}
        <div className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{statusLabel}</div>
              <div className="text-gray-300 mt-1">
                Podsistemi: {izvestaj.podsistemiNa100}/{izvestaj.ukupnoPodsistema} na 100%
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Iteracija petlje: {izvestaj.iteracijaPetlje}/{izvestaj.maksIteracija}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">{izvestaj.ukupniProgres}%</div>
              <div className="text-gray-400 text-xs mt-1">Ukupni progres</div>
            </div>
          </div>
        </div>

        {/* Autofinish brojač */}
        <div className="rounded-xl p-4 mb-6 bg-gray-900 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Autofinish Iteracija</div>
          <div className="text-xl font-mono font-bold text-purple-400">
            #{AUTOFINISH_COUNT} / 3×10¹⁷
          </div>
          <div className="text-xs text-gray-500 mt-1">{procenat}% cilja dostignuto</div>
        </div>

        {/* Podsistemi */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            🔩 OMEGA Podsistemi ({izvestaj.ukupnoPodsistema})
          </h2>
          <div className="space-y-3">
            {izvestaj.podsistemi.map((p) => (
              <div key={p.id} className="rounded-lg p-4 bg-gray-900 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.ikona}</span>
                    <span className="font-medium text-gray-200">{p.naziv}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${p.progres >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {p.progres}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === 'ok' ? 'bg-green-900 text-green-300' :
                      p.status === 'u_toku' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {p.status === 'ok' ? '✅' : p.status === 'u_toku' ? '🔄' : '❌'}
                    </span>
                  </div>
                </div>
                {/* Progres bar */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${p.progres >= 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(p.progres, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.poruka}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ekosistem statistike */}
        <div className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">📊 Ekosistem</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Rute', value: izvestaj.ekosistem.rute },
              { label: 'API Rute', value: izvestaj.ekosistem.apiRute },
              { label: 'Stranice', value: izvestaj.ekosistem.stranice },
              { label: 'Dijagnostike', value: izvestaj.ekosistem.dijagnostike },
              { label: 'Igrice', value: izvestaj.ekosistem.igrice },
              { label: 'OMEGA AI Persone', value: izvestaj.ekosistem.omegaAiPersone },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-blue-400">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs">
          <p>AI IQ SUPER PLATFORMA — {KOMPANIJA}</p>
          <p className="mt-1">Verzija {APP_VERSION} | Autofinish #{AUTOFINISH_COUNT}</p>
          <p className="mt-1">
            <a href="/api/autofinish-petlja" className="text-blue-500 hover:underline mr-3">API</a>
            <a href="/api/autofinish-health-stream" className="text-blue-500 hover:underline">Health Stream</a>
          </p>
        </div>

      </div>
    </main>
  );
}
