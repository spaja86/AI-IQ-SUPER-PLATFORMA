import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { buildPolimerizacija2Report } from '@/lib/polimerizacija-2';
import { polimerizacija2Sekvence } from '@/lib/sekvence/polimerizacija-2-page';
import PolimerizacijaLanciTable from './PolimerizacijaLanciTable';

export const metadata: Metadata = {
  title: 'Polimerizacija 2',
  description: `Polimerizacija 2 — V2 prošireni katalog lanaca, scan istorija i trend analiza — ${KOMPANIJA}`,
};

export default function Polimerizacija2Page() {
  const report = buildPolimerizacija2Report('ui');
  const latestTrend = report.trendovi.at(-1)?.delta ?? 0;

  return (
    <div className="space-y-6">
      <StranicaRenderer sekvence={polimerizacija2Sekvence} />

      <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
        <h1 className="text-2xl font-semibold text-white">🧬 POLIMERIZACIJA 2 Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Admin nivo pregleda: indeks kohezije, stabilnost, trend i istorija skenova.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-400">Indeks kohezije</div>
            <div className="mt-1 text-2xl font-bold text-white">{report.indeksKohezije.toFixed(4)}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-400">Stabilnost</div>
            <div className="mt-1 text-2xl font-bold text-white">{report.stabilnost.toFixed(4)}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-400">Trend Δ</div>
            <div className={`mt-1 text-2xl font-bold ${latestTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {latestTrend >= 0 ? '↑' : '↓'} {latestTrend.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900/70 text-zinc-300">
              <tr>
                <th className="px-3 py-2 text-left">Scan ID</th>
                <th className="px-3 py-2 text-left">Timestamp</th>
                <th className="px-3 py-2 text-right">Indeks kohezije</th>
                <th className="px-3 py-2 text-right">Delta</th>
              </tr>
            </thead>
            <tbody>
              {report.trendovi.slice(-5).map((trend) => (
                <tr key={trend.scanId} className="border-t border-zinc-800 text-zinc-200">
                  <td className="px-3 py-2">{trend.scanId}</td>
                  <td className="px-3 py-2">{new Date(trend.timestamp).toLocaleString('sr-RS')}</td>
                  <td className="px-3 py-2 text-right">{trend.indeksKohezije.toFixed(4)}</td>
                  <td className={`px-3 py-2 text-right ${trend.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend.delta >= 0 ? '+' : ''}
                    {trend.delta.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PolimerizacijaLanciTable lanci={report.lanci} />
    </div>
  );
}
