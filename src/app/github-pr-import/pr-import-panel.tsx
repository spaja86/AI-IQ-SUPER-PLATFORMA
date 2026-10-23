'use client';

import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { filterPrs, parsePrSnapshot, PR_IMPORT_MAX_BYTES, PR_IMPORT_PAGE_SIZE, serializePrs, summarizePrs, type PrFilters, type PrSnapshot } from '@/lib/github-pr-import';

const field = 'w-full min-w-0 rounded-lg border border-slate-600 bg-slate-950 p-3 text-white';
const button = 'rounded-lg border border-cyan-700 px-4 py-2 text-cyan-200 hover:bg-cyan-950 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-cyan-300';
const emptyRows: PrSnapshot['pull_requests'] = [];

export default function PrImportPanel() {
  const [snapshot, setSnapshot] = useState<PrSnapshot | null>(null);
  const [filename, setFilename] = useState('');
  const [filters, setFilters] = useState<PrFilters>({});
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const request = useRef(0), fileInput = useRef<HTMLInputElement>(null);
  const rows = snapshot?.pull_requests ?? emptyRows;
  const summary = useMemo(() => summarizePrs(rows), [rows]);
  const filtered = useMemo(() => filterPrs(rows, filters), [rows, filters]);
  const pages = Math.max(1, Math.ceil(filtered.length / PR_IMPORT_PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  function updateFilters(next: PrFilters) { setFilters(next); setPage(0); setSelected(null); }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    const generation = ++request.current; setLoading(true); setError('');
    try {
      if (file.size > PR_IMPORT_MAX_BYTES) throw new Error('Paket je veći od 16 MiB.');
      const parsed = parsePrSnapshot(await file.text());
      if (generation !== request.current) return;
      setSnapshot(parsed); setFilename(file.name); updateFilters({});
    } catch (reason) {
      if (generation === request.current) setError(reason instanceof Error ? reason.message : 'Uvoz nije uspeo.');
    } finally { if (generation === request.current) setLoading(false); }
  }
  function clear() {
    request.current++; setSnapshot(null); setFilename(''); setError(''); setLoading(false); updateFilters({});
    if (fileInput.current) fileInput.current.value = '';
  }
  function download() {
    const url = URL.createObjectURL(new Blob([serializePrs(filtered)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'spaja-pr-izbor.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="min-w-0 space-y-6">
    <section className="space-y-4 rounded-2xl border border-slate-600 bg-slate-900 p-5">
      <label className="block font-semibold" htmlFor="pr-json">JSON paket naloga spaja86</label>
      <p className="text-sm text-slate-300">Izdvoji pull-requests.json iz ZIP paketa. Najviše 16 MiB i 10.000 zapisa.</p>
      <input ref={fileInput} id="pr-json" type="file" accept=".json,application/json" className={field} onChange={importFile} />
      <p className="text-sm text-slate-300">Podaci ostaju u memoriji ove kartice. Osvežavanje ili napuštanje stranice briše uvoz. Statusi predstavljaju trenutak izrade paketa; uvoz ne spaja PR-ove i ne izvršava njihov kod.</p>
      <p id="import-status" role="status" className="break-words">{loading ? 'Proveravam paket…' : snapshot ? `Uvezeno: ${snapshot.total} PR-a · ${filename}` : 'Još nema uvezenih podataka.'}</p>
      {error && <p role="alert" className="text-rose-300">{error}{snapshot ? ' Prethodni uspešan uvoz je sačuvan.' : ''}</p>}
      <button type="button" className={button} onClick={clear} disabled={!snapshot && !loading}>Ukloni podatke iz kartice</button>
    </section>
    {snapshot && <>
      <dl aria-label="Statistika uvoza" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries({ Ukupno: summary.total, Otvoreni: summary.open, Spojeni: summary.merged, Zatvoreni: summary.closed, 'Draft otvoreni': summary.drafts }).map(([label, value]) => <div key={label} className="rounded-xl border border-slate-700 p-4"><dt className="text-sm text-slate-300">{label}</dt><dd className="mt-1 text-2xl font-bold">{value}</dd></div>)}
      </dl>
      <p className="break-words text-sm text-slate-300">Repozitorijumi: {summary.repositories.length} · Zapisi koji nisu javni: {summary.nonPublic}<br />Preuzeto: {summary.retrievedFrom ?? '—'} — {summary.retrievedTo ?? '—'}</p>
      <section aria-label="Filteri" className="grid gap-4 rounded-2xl border border-slate-700 p-5 sm:grid-cols-2">
        <label>Pretraga<input className={field} value={filters.search ?? ''} placeholder="Naslov, opis, autor, #broj…" onChange={event => updateFilters({ ...filters, search: event.target.value })} /></label>
        <label>Repozitorijum<select className={field} value={filters.repository ?? 'all'} onChange={event => updateFilters({ ...filters, repository: event.target.value })}><option value="all">Svi repozitorijumi</option>{summary.repositories.map(repo => <option key={repo}>{repo}</option>)}</select></label>
        <label>Status<select className={field} value={filters.status ?? 'all'} onChange={event => updateFilters({ ...filters, status: event.target.value as PrFilters['status'] })}><option value="all">Svi statusi</option><option value="open">Otvoreni</option><option value="merged">Spojeni</option><option value="closed">Zatvoreni bez spajanja</option></select></label>
        <label>Vidljivost<select className={field} value={filters.visibility ?? 'all'} onChange={event => updateFilters({ ...filters, visibility: event.target.value as PrFilters['visibility'] })}><option value="all">Sve vidljivosti</option><option value="public">Javni</option><option value="private">Privatni</option><option value="internal">Interni</option><option value="unknown">Nepoznato</option></select></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={filters.draftsOnly ?? false} onChange={event => updateFilters({ ...filters, draftsOnly: event.target.checked })} />Samo otvoreni draft PR-ovi</label>
        <button type="button" className={button} onClick={() => updateFilters({})}>Resetuj filtere</button>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-label="Broj rezultata">Prikazano {filtered.length} od {snapshot.total} PR-a</p><button type="button" className={button} onClick={download} disabled={!filtered.length}>Izvezi prikazane PR-ove</button></div>
      {filtered.some(row => row.repository_visibility !== 'public') && <p className="text-sm text-amber-200">Izbor sadrži privatne, interne ili neklasifikovane podatke. Izvezeni fajl čuvaj kao privatni dokument.</p>}
      <ul aria-label="PR rezultati" className="space-y-4">
        {filtered.slice(currentPage * PR_IMPORT_PAGE_SIZE, (currentPage + 1) * PR_IMPORT_PAGE_SIZE).map(row => <li key={row.id} className="min-w-0 space-y-3 rounded-xl border border-slate-700 p-5">
          <p className="break-all text-sm text-cyan-300">{row.repository} · #{row.number}</p>
          <h2 className="break-words text-xl font-semibold">{row.title}</h2>
          <p className="break-words text-sm text-slate-300">{row.status} · {row.repository_visibility}{row.draft ? ' · draft' : ''} · {row.author} · {row.updated_at}</p>
          <div className="flex flex-wrap gap-4"><button type="button" className={button} aria-expanded={selected === row.id} aria-controls={`pr-details-${row.id}`} onClick={() => setSelected(selected === row.id ? null : row.id)}>Detalji #{row.number}</button><a href={row.url} target="_blank" rel="noopener noreferrer" className="self-center text-cyan-300 underline">Otvori na GitHubu</a></div>
          {selected === row.id && <section id={`pr-details-${row.id}`} aria-label={`Detalji PR ${row.number}`} className="min-w-0 space-y-3 border-t border-slate-700 pt-4">
            <p className="break-all text-sm">{row.head.branch} ({row.head.sha}) → {row.base.branch} ({row.base.sha})</p>
            <p className="break-words text-sm">Oznake: {row.labels.join(', ') || '—'} · Preuzeto: {row.retrieved_at}</p>
            <pre className="max-h-[32rem] overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm text-slate-200">{row.body || 'Nema opisa.'}</pre>
          </section>}
        </li>)}
      </ul>
      {!filtered.length && <p>Nema PR-ova za izabrane filtere.</p>}
      <nav aria-label="Stranice rezultata" className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" className={button} disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); setSelected(null); }}>Prethodna</button>
        <span>Stranica {currentPage + 1} od {pages}</span>
        <button type="button" className={button} disabled={currentPage >= pages - 1} onClick={() => { setPage(currentPage + 1); setSelected(null); }}>Sledeća</button>
      </nav>
    </>}
  </div>;
}
