'use client';

import { useEffect, useState } from 'react';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';

type Status = {
  naziv: string;
  rezim: string;
  napomena: string;
  statistika: { ukupnoKomponenti: number; aktivnihKomponenti: number; ukupnoKompjutera: number; ukupnoKonzola: number };
  komponente: Array<{ id: string; naziv: string; status: string }>;
  timestamp: string;
};

export default function DigitalniKompjuterControlCenter() {
  const [status, setStatus] = useState<Status | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    const sesija = dohvatiSesiju();
    if (!sesija) return;

    fetch('/api/b2b-control-center/digitalni-kompjuter', {
      headers: { Authorization: `Bearer ${sesija.token}` },
    })
      .then(async (response) => {
        const payload = await response.json() as Status | { error?: string };
        if (!response.ok) throw new Error('error' in payload ? payload.error : 'Status nije dostupan.');
        setStatus(payload as Status);
      })
      .catch((error: unknown) => setGreska(error instanceof Error ? error.message : 'Status nije dostupan.'));
  }, []);

  if (greska) return <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-200">{greska}</p>;
  if (!status) return <p className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-300">Učitavanje statusa…</p>;

  const metrike = [
    ['Komponente', status.statistika.ukupnoKomponenti],
    ['Deklarisano aktivne', status.statistika.aktivnihKomponenti],
    ['Tipovi sistema', status.statistika.ukupnoKompjutera],
    ['Konzole', status.statistika.ukupnoKonzola],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-300">{status.rezim}</p>
      <h1 className="text-3xl font-bold text-white">{status.naziv}</h1>
      <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">{status.napomena}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrike.map(([naziv, vrednost]) => <div key={String(naziv)} className="rounded-xl border border-slate-700 bg-slate-900 p-5"><p className="text-sm text-slate-400">{naziv}</p><p className="mt-2 text-3xl font-bold text-cyan-200">{vrednost}</p></div>)}
      </div>
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-lg font-semibold text-white">Deklarisano aktivne komponente</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{status.komponente.map((komponenta) => <li key={komponenta.id} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200">{komponenta.naziv} <span className="text-cyan-300">({komponenta.status})</span></li>)}</ul>
      </div>
    </section>
  );
}
