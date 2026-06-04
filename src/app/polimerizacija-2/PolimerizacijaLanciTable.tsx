'use client';

import { useMemo, useState } from 'react';
import type { PolimerizacijaFazaProcesa, PolimerzacijaLanacV2 } from '@/lib/polimerizacija-2';

type SortBy = 'reakcionaStopa' | 'molekularnaTezina';
type StatusFilter = 'all' | 'aktivan' | 'optimizacija' | 'kritican';
type FazaFilter = 'all' | PolimerizacijaFazaProcesa;

interface PolimerizacijaLanciTableProps {
  lanci: PolimerzacijaLanacV2[];
}

export default function PolimerizacijaLanciTable({ lanci }: PolimerizacijaLanciTableProps) {
  const [faza, setFaza] = useState<FazaFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('reakcionaStopa');

  const filtered = useMemo(() => {
    const next = lanci.filter((lanac) => {
      if (faza !== 'all' && lanac.fazaProcesa !== faza) return false;
      if (status !== 'all' && lanac.status !== status) return false;
      return true;
    });
    return next.toSorted((a, b) =>
      sortBy === 'reakcionaStopa'
        ? b.reakcionaStopa - a.reakcionaStopa
        : b.molekularnaTezina - a.molekularnaTezina,
    );
  }, [lanci, faza, status, sortBy]);

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-white">🔎 Filter tabela V2 lanaca</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <select
            value={faza}
            onChange={(e) => setFaza(e.target.value as FazaFilter)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-200"
          >
            <option value="all">Sve faze</option>
            <option value="inicijacija">Inicijacija</option>
            <option value="propagacija">Propagacija</option>
            <option value="terminacija">Terminacija</option>
            <option value="kroslink">Kroslink</option>
            <option value="umrezavanje">Umrežavanje</option>
            <option value="purifikacija">Purifikacija</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-200"
          >
            <option value="all">Svi statusi</option>
            <option value="aktivan">Aktivan</option>
            <option value="optimizacija">Optimizacija</option>
            <option value="kritican">Kritičan</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-200"
          >
            <option value="reakcionaStopa">Sort: reakciona stopa</option>
            <option value="molekularnaTezina">Sort: molekularna težina</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900/70 text-zinc-300">
            <tr>
              <th className="px-3 py-2 text-left">Lanac</th>
              <th className="px-3 py-2 text-left">Faza</th>
              <th className="px-3 py-2 text-right">Reakciona stopa</th>
              <th className="px-3 py-2 text-right">Molekularna težina</th>
              <th className="px-3 py-2 text-right">Viskoznost</th>
              <th className="px-3 py-2 text-right">Gustina</th>
              <th className="px-3 py-2 text-right">Pritisak</th>
              <th className="px-3 py-2 text-right">Ciklusi</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lanac) => (
              <tr key={lanac.id} className="border-t border-zinc-800 text-zinc-200">
                <td className="px-3 py-2">{lanac.naziv}</td>
                <td className="px-3 py-2">{lanac.fazaProcesa}</td>
                <td className="px-3 py-2 text-right">{lanac.reakcionaStopa.toFixed(4)}</td>
                <td className="px-3 py-2 text-right">{lanac.molekularnaTezina}</td>
                <td className="px-3 py-2 text-right">{lanac.viskoznost.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{lanac.gustina.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{lanac.pritisak.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{lanac.ciklusiBroj}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs">{lanac.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
