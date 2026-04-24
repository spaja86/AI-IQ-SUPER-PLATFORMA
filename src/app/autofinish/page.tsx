// Autofinish #822 — /autofinish Dashboard UI Stranica
// Autofinish #839 — Accessibility i ARIA Unapređenja
// Autofinish #850 — OG Tags i Metadata
// Autofinish #855 — Changelog Sekcija
// Kompanija SPAJA — Digitalna Industrija

import type { Metadata } from 'next';
import { pokreniAutofinishPetlju, getLastNIterations } from '@/lib/autofinish-petlja';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET, KOMPANIJA } from '@/lib/constants';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ai-iq-super-platforma.vercel.app';

// #850 — OG Tags i Twitter Card metadata
export const metadata: Metadata = {
  title: 'Autofinish Dashboard — AI IQ SUPER PLATFORMA',
  description: `Autofinish petlja — ponavljanje do 100% za sve OMEGA podsisteme. Iteracija #${AUTOFINISH_COUNT} — ${KOMPANIJA}`,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${APP_URL}/autofinish`,
  },
  openGraph: {
    type: 'website',
    url: `${APP_URL}/autofinish`,
    title: `Autofinish #${AUTOFINISH_COUNT} — AI IQ SUPER PLATFORMA`,
    description: `OMEGA PROJECT: Autofinish petlja — iteracija #${AUTOFINISH_COUNT} od ${KOMPANIJA}. Sve OMEGA platforme na 100%.`,
    siteName: 'AI IQ SUPER PLATFORMA',
    locale: 'sr_RS',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Autofinish #${AUTOFINISH_COUNT} — AI IQ SUPER PLATFORMA`,
    description: `OMEGA PROJECT autofinish petlja — ${KOMPANIJA}. Iteracija #${AUTOFINISH_COUNT}.`,
  },
  other: {
    'x-app-version': APP_VERSION,
    'x-autofinish-count': String(AUTOFINISH_COUNT),
  },
};

export default function AutofinishPage() {
  const izvestaj = pokreniAutofinishPetlju();
  const procenat = ((AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100).toExponential(2);
  // #855 — poslednjih 10 iteracija za changelog sekciju
  const changelog = getLastNIterations(10);

  const statusLabel =
    izvestaj.status === 'zavrsena'
      ? 'OMEGA PROJEKAT NA 100%'
      : izvestaj.status === 'ponavljanje'
        ? 'PONAVLJANJE U TOKU'
        : 'U TOKU';

  const statusIkona =
    izvestaj.status === 'zavrsena' ? '✅' : izvestaj.status === 'ponavljanje' ? '🔄' : '⚡';

  return (
    <main
      className="min-h-screen bg-gray-950 text-white p-6"
      aria-label="Autofinish Dashboard"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span aria-hidden="true">⚡ </span>Autofinish Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            {KOMPANIJA} — Verzija {APP_VERSION} — Iteracija #{AUTOFINISH_COUNT}
          </p>
        </header>

        {/* Status kartica */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Status autofinish petlje"
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-2xl font-bold"
                role="status"
                aria-live="polite"
                aria-label={`Status: ${statusLabel}`}
              >
                <span aria-hidden="true">{statusIkona} </span>{statusLabel}
              </div>
              <div className="text-gray-300 mt-1">
                Podsistemi: {izvestaj.podsistemiNa100}/{izvestaj.ukupnoPodsistema} na 100%
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Iteracija petlje: {izvestaj.iteracijaPetlje}/{izvestaj.maksIteracija}
              </div>
            </div>
            <div className="text-right" aria-label={`Ukupni progres: ${izvestaj.ukupniProgres}%`}>
              <div className="text-4xl font-bold text-green-400" aria-hidden="true">
                {izvestaj.ukupniProgres}%
              </div>
              <div className="text-gray-400 text-xs mt-1">Ukupni progres</div>
            </div>
          </div>
        </section>

        {/* Autofinish brojač */}
        <section
          className="rounded-xl p-4 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish iteracija brojač"
        >
          <div className="text-sm text-gray-400 mb-1" id="autofinish-label">Autofinish Iteracija</div>
          <div
            className="text-xl font-mono font-bold text-purple-400"
            aria-labelledby="autofinish-label"
          >
            #{AUTOFINISH_COUNT} / 3×10¹⁷
          </div>
          <div className="text-xs text-gray-500 mt-1">{procenat}% cilja dostignuto</div>
        </section>

        {/* Podsistemi */}
        <section className="mb-6" aria-label="OMEGA podsistemi">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🔩 </span>
            OMEGA Podsistemi ({izvestaj.ukupnoPodsistema})
          </h2>
          <ul className="space-y-3" role="list">
            {izvestaj.podsistemi.map((p) => {
              const statusTekst = p.status === 'ok' ? 'Uspešno' : p.status === 'u_toku' ? 'U toku' : 'Greška';
              return (
                <li
                  key={p.id}
                  className="rounded-lg p-4 bg-gray-900 border border-gray-800 focus-within:ring-2 focus-within:ring-blue-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{p.ikona}</span>
                      <span className="font-medium text-gray-200">{p.naziv}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${p.progres >= 100 ? 'text-green-400' : 'text-yellow-400'}`}
                        aria-hidden="true"
                      >
                        {p.progres}%
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.status === 'ok' ? 'bg-green-900 text-green-300' :
                          p.status === 'u_toku' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-red-900 text-red-300'
                        }`}
                        aria-label={statusTekst}
                      >
                        <span aria-hidden="true">
                          {p.status === 'ok' ? '✅' : p.status === 'u_toku' ? '🔄' : '❌'}
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* Progres bar — #839 role=progressbar */}
                  <div
                    className="w-full bg-gray-800 rounded-full h-2"
                    role="progressbar"
                    aria-valuenow={p.progres}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${p.naziv} napredak`}
                  >
                    <div
                      className={`h-2 rounded-full transition-all ${p.progres >= 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(p.progres, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{p.poruka}</div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Ekosistem statistike */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Ekosistem statistike"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">📊 </span>Ekosistem
          </h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Rute', value: izvestaj.ekosistem.rute },
              { label: 'API Rute', value: izvestaj.ekosistem.apiRute },
              { label: 'Stranice', value: izvestaj.ekosistem.stranice },
              { label: 'Dijagnostike', value: izvestaj.ekosistem.dijagnostike },
              { label: 'Igrice', value: izvestaj.ekosistem.igrice },
              { label: 'OMEGA AI Persone', value: izvestaj.ekosistem.omegaAiPersone },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-2xl font-bold text-blue-400">{s.value}</dd>
                <dt className="text-xs text-gray-500 mt-1">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* #855 — Changelog sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish changelog — poslednjih 10 iteracija"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">📋 </span>Changelog — poslednjih {changelog.length} iteracija
          </h2>
          <ul className="space-y-2" role="list">
            {changelog.map((stavka) => (
              <li
                key={stavka.broj}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className="shrink-0 w-12 font-mono text-purple-400 font-bold"
                  aria-label={`Iteracija broj ${stavka.broj}`}
                >
                  #{stavka.broj}
                </span>
                <span className="text-gray-300">{stavka.opis}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-changelog"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi kompletan changelog kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-xs">
          <p>AI IQ SUPER PLATFORMA — {KOMPANIJA}</p>
          <p className="mt-1">Verzija {APP_VERSION} | Autofinish #{AUTOFINISH_COUNT}</p>
          <nav aria-label="API linkovi" className="mt-1">
            <a
              href="/api/autofinish-petlja"
              className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded mr-3"
            >
              API
            </a>
            <a
              href="/api/autofinish-health-stream"
              className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            >
              Health Stream
            </a>
          </nav>
        </footer>

      </div>
    </main>
  );
}
