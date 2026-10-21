'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import IdeaCard from '@/app/omegatrojektorijum/idea-card';
import { omegaItems } from '@/lib/omegatrojektorijum';
import { availabilityLabels, availabilityOf, filterRegistry, kindLabels, statusLabels, type RegistryEntry } from '@/lib/superomegatrajektorijum/model';

const ideasById = new Map(omegaItems.map(item => [item.id, item]));
const pageSize = 20;
const fieldClass = 'mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 p-3 text-white focus-visible:outline-2 focus-visible:outline-cyan-300';
const linkClass = 'break-all text-cyan-300 underline focus-visible:outline-2 focus-visible:outline-cyan-300';

function EntryCard({ entry, now }: { entry: RegistryEntry; now: number }) {
  const [expanded, setExpanded] = useState(false);
  const availability = availabilityOf(entry, now);
  const idea = entry.conceptId ? ideasById.get(entry.conceptId) : undefined;
  return <li className="min-w-0 rounded-xl border border-slate-700 bg-slate-900 p-5" data-registry-id={entry.id}>
    <div className="flex flex-wrap gap-2 text-xs text-cyan-200">
      <span className="rounded bg-slate-800 px-2 py-1">{kindLabels[entry.kind]}</span>
      <span className="rounded bg-slate-800 px-2 py-1">{statusLabels[entry.status]}</span>
    </div>
    <h3 className="mt-3 break-words text-lg font-semibold">{entry.name}</h3>
    <p className="mt-2 text-sm text-slate-300">{entry.description}</p>
    <p className={`mt-3 text-sm ${availability === 'available' ? 'text-green-300' : 'text-amber-200'}`}>{availabilityLabels[availability]}</p>
    <p className="mt-2 break-all text-xs text-slate-400">ID: {entry.id}</p>
    <a className={`mt-3 inline-block ${linkClass}`} href={entry.address}>
      {entry.addressScope === 'local-pilot' ? 'Uputstvo za lokalni pilot' : entry.addressScope === 'documentation' ? 'Otvori kod / dokumentaciju' : 'Otvori adresu'}
    </a>
    <details className="mt-4" onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary className="cursor-pointer text-sm font-semibold text-cyan-200 focus-visible:outline-2">Izvor, dokaz i ograničenja</summary>
      {expanded ? <div className="mt-3 space-y-3 text-sm">
        <p className="break-all">Adresa: {entry.address}</p>
        <p>Izvor: <a className={linkClass} href={entry.source.url}>{entry.source.label}</a> · {entry.source.recordId}</p>
        <p>{entry.evidence.scope}</p>
        <a className={linkClass} href={entry.evidence.url}>Pogledaj osnov statusa</a>
        <p>Provera dostupnosti: {entry.availability ? <>
          <time dateTime={entry.availability.checkedAt}>{entry.availability.checkedAt}</time> · {entry.availability.scope}
          {' · '}<a className={linkClass} href={entry.availability.evidenceUrl}>Zapis provere</a>
        </> : 'Nije sprovedena. Konfiguracija i istorijski deployment nisu dokaz dostupnosti.'}</p>
        {entry.metadata ? <dl className="space-y-2">{Object.entries(entry.metadata).map(([key, value]) => <div key={key}>
          <dt className="font-semibold text-slate-300">{key}</dt><dd className="break-words">{value}</dd>
        </div>)}</dl> : null}
        {idea ? <IdeaCard item={idea} /> : null}
      </div> : null}
    </details>
  </li>;
}

export default function SuperOmegaRegistry({ entries, initialNow }: { entries: RegistryEntry[]; initialNow: number }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(0);
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const selected = useMemo(() => filterRegistry(entries, { search: query, kind, status, availability }, now), [entries, query, kind, status, availability, now]);
  const pages = Math.max(1, Math.ceil(selected.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const available = entries.filter(entry => availabilityOf(entry, now) === 'available').length;
  function reset() { setQuery(''); setKind(''); setStatus(''); setAvailability(''); setPage(0); }
  return <section aria-labelledby="registry-title" className="space-y-5">
    <h2 id="registry-title" className="text-2xl font-bold">Zajednički registar</h2>
    <p className="text-slate-300">{entries.length} zapisa iz postojećih izvora · {available} sa važećom potvrdom dostupnosti.
      Projekat može imati zaseban zapis za repozitorijum, aplikaciju i deploy konfiguraciju; broj zapisa nije broj aktivnih servisa.</p>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <label className="text-sm">Pretraga registra
        <input className={fieldClass} type="search" placeholder="Naziv, ID, izvor ili adresa…" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} />
      </label>
      <label className="text-sm">Tip servisa
        <select aria-label="Tip servisa" className={fieldClass} value={kind} onChange={event => { setKind(event.target.value); setPage(0); }}>
          <option value="">Svi tipovi</option>{Object.entries(kindLabels).map(([key, label]) => <option key={key} value={key}>{label} ({entries.filter(entry => entry.kind === key).length})</option>)}
        </select>
      </label>
      <label className="text-sm">Stanje implementacije
        <select aria-label="Stanje implementacije" className={fieldClass} value={status} onChange={event => { setStatus(event.target.value); setPage(0); }}>
          <option value="">Sva stanja</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <label className="text-sm">Provera dostupnosti
        <select aria-label="Provera dostupnosti" className={fieldClass} value={availability} onChange={event => { setAvailability(event.target.value); setPage(0); }}>
          <option value="">Sve provere</option>{Object.entries(availabilityLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={reset}>Poništi filtere</Button>
      <p role="status" aria-live="polite">{selected.length} rezultata · strana {currentPage + 1} / {pages}</p>
    </div>
    {selected.length ? <ul className="grid gap-4 md:grid-cols-2">{selected.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(entry => <EntryCard entry={entry} now={now} key={entry.id} />)}</ul>
      : <p className="rounded-xl border border-slate-600 p-6">Nema rezultata za izabrane filtere. Poništi filtere ili promeni pretragu.</p>}
    <nav aria-label="Stranice registra" className="flex flex-wrap gap-3">
      <Button variant="secondary" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Prethodna</Button>
      <Button variant="secondary" disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>Sledeća</Button>
    </nav>
  </section>;
}
