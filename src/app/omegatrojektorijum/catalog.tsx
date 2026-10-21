'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { expandOmegaItem, findOmegaItems, omegaItems, omegaTemplates } from '@/lib/omegatrojektorijum';
import IdeaCard from './idea-card';

const domains = [...new Set(omegaItems.map(item => item.domain))];
const pageSize = 20;

export default function OmegaCatalog() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('');
  const [page, setPage] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const items = useMemo(() => findOmegaItems(deferredQuery, domain), [deferredQuery, domain]);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pages - 1);

  function downloadSelection() {
    const data = { metadata: { name: 'OMEGATROJEKTORIJUM', version: '0.1', status: 'ideja', method: '25 oblasti × 53 pravca × 80 zajedničkih obrazaca', item_count: items.length, concept_count: items.length * omegaTemplates.length }, items: items.map(expandOmegaItem) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OMEGATROJEKTORIJUM-izbor.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section aria-labelledby="omega-catalog-title" className="space-y-5">
      <h2 id="omega-catalog-title" className="text-2xl font-semibold">Katalog proširenja</h2>
      <p className="text-slate-300">1.325 stavki · 80 koncepata po stavci · 106.000 koncepata. Ovo je sistematska matrica predloga sa zajedničkim obrascima; pojedinačna izvodljivost nije procenjena. Prisustvo u katalogu ne znači da je funkcija izrađena.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Pretraži ideje ili oznaku
          <input className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 p-3" value={query} type="search" placeholder="Dota, uvoz, OMEGA-0001-K03…" onChange={event => { setQuery(event.target.value); setPage(0); }} />
        </label>
        <label>Oblast
          <select className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 p-3" value={domain} onChange={event => { setDomain(event.target.value); setPage(0); }}>
            <option value="">Sve oblasti</option>{domains.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>
      <p role="status" aria-live="polite">{items.length} stavki · strana {currentPage + 1} / {pages}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 disabled:opacity-40" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Prethodna</button>
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 disabled:opacity-40" disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>Sledeća</button>
        <button type="button" className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-40" disabled={!items.length} onClick={downloadSelection}>Izvezi izbor (JSON)</button>
      </div>
      {items.length === 0 ? <p>Nema rezultata. Promeni pretragu ili oblast.</p> : items.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(item => (
        <IdeaCard key={item.id} item={item} />
      ))}
    </section>
  );
}
