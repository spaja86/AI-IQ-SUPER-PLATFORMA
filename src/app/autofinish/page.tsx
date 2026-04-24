// Autofinish #822 — /autofinish Dashboard UI Stranica
// Autofinish #839 — Accessibility i ARIA Unapređenja
// Autofinish #850 — OG Tags i Metadata
// Autofinish #855 — Changelog Sekcija
// Autofinish #864 — Ekosistem Snapshot Sekcija
// Autofinish #874 — Progress Info Widget
// Autofinish #889 — Verzije Summary Sekcija
// Autofinish #899 — Statistika Summary Sekcija
// Autofinish #909 — Zdravlje Summary Sekcija
// Autofinish #913 — Roadmap Sekcija
// Autofinish #919 — Next Steps Sekcija
// Autofinish #925 — Milestone Detail Modal
// Kompanija SPAJA — Digitalna Industrija

import type { Metadata } from 'next';
import {
  pokreniAutofinishPetlju,
  getLastNIterations,
  getAutofinishEkosistemSnapshot,
  getAutofinishProgressInfo,
  getAutofinishVerzijeSummary,
  getAutofinishStatistikaSummary,
  getAutofinishHealthSummary,
  getAutofinishRoadmapInfo,
  getAutofinishRoadmapStatusSummary,
  getAutofinishNextSteps,
  getAutofinishMilestoneDetail,
} from '@/lib/autofinish-petlja';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
  KOMPANIJA,
} from '@/lib/constants';
import { RoadmapWithModal } from './RoadmapWithModal';

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
  // #864 — ekosistem snapshot
  const ekosistemSnapshot = getAutofinishEkosistemSnapshot();
  // #874 — progress info
  const progressInfo = getAutofinishProgressInfo();
  // #889 — verzije summary
  const verzijeSummary = getAutofinishVerzijeSummary();
  // #899 — statistika summary
  const statistikaSummary = getAutofinishStatistikaSummary();
  // #909 — zdravlje summary
  const zdravljeSummary = getAutofinishHealthSummary();
  // #913/#925 — roadmap sekcija + milestone detail modal
  const roadmapInfo = getAutofinishRoadmapInfo();
  const roadmapStatus = getAutofinishRoadmapStatusSummary();
  // Pre-compute milestone details for all milestones (server-side)
  const milestoneDetails = Object.fromEntries(
    roadmapInfo.milestones.map((m) => {
      const slug = m.naziv.toLowerCase().replace(/\s+/g, '-');
      return [slug, getAutofinishMilestoneDetail(slug)];
    }),
  );
  // #919 — next steps sekcija
  const nextStepsInfo = getAutofinishNextSteps();

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

        {/* #874 — Progress Info Widget */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish progress info"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🎯 </span>Napredak ka Targetu
          </h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>
                {progressInfo.autofinishBroj} / {progressInfo.target} iteracija
              </span>
              <span className="font-bold text-blue-400">{progressInfo.procenat}%</span>
            </div>
            <div
              className="w-full bg-gray-700 rounded-full h-3"
              role="progressbar"
              aria-valuenow={progressInfo.procenat}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Autofinish napredak: ${progressInfo.procenat}%`}
            >
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressInfo.procenat, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-400">{progressInfo.prognoza}</p>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-progress"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi progress info kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* #864 — Ekosistem Snapshot sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Ekosistem snapshot — sve metrike"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🌐 </span>Ekosistem Snapshot
          </h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Rute', value: ekosistemSnapshot.rute },
              { label: 'API Rute', value: ekosistemSnapshot.apiRute },
              { label: 'Stranice', value: ekosistemSnapshot.stranice },
              { label: 'Dijagnostike', value: ekosistemSnapshot.dijagnostike },
              { label: 'Igrice', value: ekosistemSnapshot.igrice },
              { label: 'OMEGA Persone', value: ekosistemSnapshot.omegaAiPersone },
              { label: 'OMEGA Oktave', value: ekosistemSnapshot.omegaAiOktave },
              { label: 'OMEGA Ukupno', value: ekosistemSnapshot.omegaAiUkupno.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-xl font-bold text-teal-400">{s.value}</dd>
                <dt className="text-xs text-gray-500 mt-1">{s.label}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-ekosistem-snapshot"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi ekosistem snapshot kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* #889 — Verzije Summary sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish verzije summary"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🏷️ </span>Verzije platforme — ukupno {verzijeSummary.ukupnoVerzija}
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Aktuelna verzija: <span className="text-green-400 font-bold">{verzijeSummary.aktuelnaVerzija}</span>
          </p>
          <ul
            className="space-y-2"
            role="list"
            aria-label="Lista verzija platforme"
          >
            {verzijeSummary.verzije.map((v) => (
              <li key={v.verzija} className="flex items-start gap-3 text-sm">
                <span className="text-yellow-400 font-mono shrink-0" aria-label={`Verzija ${v.verzija}`}>{v.verzija}</span>
                <span className="text-gray-500">#{v.autofinishBroj}</span>
                <span className="text-gray-400">{v.opis}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-verzije"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi listu verzija kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* #899 — Statistika Summary sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish statistika summary"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">📊 </span>Statistike platforme
          </h2>
          <ul
            className="grid grid-cols-2 gap-2 text-sm"
            role="list"
            aria-label="Lista statistika platforme"
          >
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Ukupno ruta</span>
              <span className="text-white font-mono">{statistikaSummary.rute}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">API ruta</span>
              <span className="text-blue-400 font-mono">{statistikaSummary.apiRute}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Stranice</span>
              <span className="text-white font-mono">{statistikaSummary.stranice}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Dijagnostike</span>
              <span className="text-green-400 font-mono">{statistikaSummary.dijagnostike}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Igrice</span>
              <span className="text-purple-400 font-mono">{statistikaSummary.igrice}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">OMEGA AI persone</span>
              <span className="text-yellow-400 font-mono">{statistikaSummary.omegaAiPersone}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">OMEGA AI oktave</span>
              <span className="text-yellow-400 font-mono">{statistikaSummary.omegaAiOktave}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">SpajaPro verzija</span>
              <span className="text-white font-mono">{statistikaSummary.spajaProVerzija}</span>
            </li>
          </ul>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-statistika"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi statistike kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* #909 — Zdravlje Summary sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish zdravlje summary"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🏥 </span>Zdravlje platforme
          </h2>
          <div
            className={`text-4xl font-bold mb-4 ${
              zdravljeSummary.zdravlje >= 95
                ? 'text-green-400'
                : zdravljeSummary.zdravlje >= 80
                ? 'text-yellow-400'
                : zdravljeSummary.zdravlje >= 60
                ? 'text-orange-400'
                : 'text-red-400'
            }`}
            aria-label={`Zdravlje: ${zdravljeSummary.zdravlje}%`}
          >
            {zdravljeSummary.zdravlje}%
            <span className="ml-3 text-lg font-normal text-gray-400">
              {zdravljeSummary.status}
            </span>
          </div>
          <ul
            className="grid grid-cols-2 gap-2 text-sm"
            role="list"
            aria-label="Lista zdravlje detalja"
          >
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Ukupno provera</span>
              <span className="text-white font-mono">{zdravljeSummary.ukupnoProvera}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Uspešnih</span>
              <span className="text-green-400 font-mono">{zdravljeSummary.uspesnih}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Upozorenja</span>
              <span className="text-yellow-400 font-mono">{zdravljeSummary.upozorenja}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Grešaka</span>
              <span className={zdravljeSummary.gresaka > 0 ? 'text-red-400 font-mono' : 'text-gray-400 font-mono'}>{zdravljeSummary.gresaka}</span>
            </li>
            <li className="flex justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-400">Kritičnih</span>
              <span className={zdravljeSummary.kriticnih > 0 ? 'text-red-600 font-mono font-bold' : 'text-gray-400 font-mono'}>{zdravljeSummary.kriticnih}</span>
            </li>
          </ul>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-zdravlje"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi zdravlje kao JSON"
            >
              JSON API →
            </a>
          </div>
        </section>

        {/* #913/#925 — Roadmap sekcija + Milestone Detail Modal */}
        <RoadmapWithModal
          milestones={roadmapInfo.milestones}
          milestoneDetails={milestoneDetails}
          progres={roadmapStatus.progres}
          done={roadmapStatus.done}
          ukupno={roadmapStatus.ukupno}
        />

        {/* #919 — Next Steps sekcija */}
        <section
          className="rounded-xl p-6 mb-6 bg-gray-900 border border-gray-800"
          aria-label="Autofinish naredni koraci"
        >
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            <span aria-hidden="true">🚀 </span>Naredni koraci
          </h2>
          <ul className="space-y-3" role="list" aria-label="Lista narednih koraka">
            {nextStepsInfo.steps.map((step) => (
              <li
                key={step.id}
                className="flex items-start gap-3 bg-gray-800 rounded-lg px-4 py-3"
              >
                <span
                  className={`mt-0.5 inline-block min-w-[1.5rem] text-center text-xs font-bold px-1.5 py-0.5 rounded ${
                    step.prioritet === 1
                      ? 'bg-red-900 text-red-300'
                      : step.prioritet === 2
                      ? 'bg-orange-900 text-orange-300'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                  aria-label={`Prioritet ${step.prioritet}`}
                >
                  P{step.prioritet}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">{step.naziv}</div>
                  <div className="text-gray-400 text-xs mt-0.5 truncate">{step.opis}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">#{step.autofinishTarget}</span>
                    <span className="text-xs text-gray-600 bg-gray-700 rounded px-1.5 py-0.5">{step.kategorija}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-right">
            <a
              href="/api/autofinish-next-steps"
              className="text-xs text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Preuzmi naredne korake kao JSON"
            >
              JSON API →
            </a>
          </div>
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
