'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CallCentarAgent, PaketUsluga, PaketTip } from '@/lib/call-centar';

interface CallCentarResponse {
  pregled: {
    agenti: CallCentarAgent[];
  };
}

interface PaketiResponse {
  paketi: PaketUsluga[];
}

interface LicencaApiResponse {
  licenca?: {
    instalacioniBroj: string;
    naziv: string;
    datumAktivacije: string;
  };
  error?: string;
}

export default function CallCentarPage() {
  const [paketi, setPaketi] = useState<PaketUsluga[]>([]);
  const [agenti, setAgenti] = useState<CallCentarAgent[]>([]);
  const [emailKorisnika, setEmailKorisnika] = useState('');
  const [tipPaketa, setTipPaketa] = useState<PaketTip>('Starter');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  useEffect(() => {
    async function ucitaj() {
      setLoading(true);
      setGreska('');
      try {
        const [pregledRes, paketiRes] = await Promise.all([
          fetch('/api/call-centar', { cache: 'no-store' }),
          fetch('/api/call-centar/paketi', { cache: 'no-store' }),
        ]);

        if (!pregledRes.ok || !paketiRes.ok) {
          throw new Error('Neuspešno učitavanje CALL CENTAR podataka.');
        }

        const pregledJson = (await pregledRes.json()) as CallCentarResponse;
        const paketiJson = (await paketiRes.json()) as PaketiResponse;

        setAgenti(pregledJson.pregled.agenti ?? []);
        setPaketi(paketiJson.paketi ?? []);
      } catch {
        setGreska('Došlo je do greške prilikom učitavanja Call Centra.');
      } finally {
        setLoading(false);
      }
    }

    void ucitaj();
  }, []);

  const aktivniAgenti = useMemo(() => agenti.filter((agent) => agent.status === 'aktivan'), [agenti]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setGreska('');
    setPoruka('');

    try {
      const response = await fetch('/api/call-centar/licenca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailKorisnika, tipPaketa }),
      });

      const json = (await response.json()) as LicencaApiResponse;
      if (!response.ok) {
        throw new Error(json.error ?? 'Neuspešno generisanje instalacionog broja.');
      }

      setPoruka(
        `Instalacioni broj: ${json.licenca?.instalacioniBroj ?? '-'} | Paket: ${json.licenca?.naziv ?? '-'} | Aktivacija: ${new Date(json.licenca?.datumAktivacije ?? '').toLocaleString('sr-RS')}`,
      );
      setEmailKorisnika('');
    } catch (error) {
      setGreska(error instanceof Error ? error.message : 'Neuspešan zahtev.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-gray-100">
      <h1 className="mb-2 text-3xl font-bold">📞 CALL CENTAR — Moblini SPAJA</h1>
      <p className="mb-2 text-sm text-gray-300">
        Nudimo isključivo digitalne usluge. Nakon dodele paketa, instalacioni broj se šalje na email korisnika.
      </p>
      <p className="mb-6 text-xs text-gray-500">Instalacioni broj biće poslat na vaš email.</p>

      {loading && <p className="text-sm text-gray-400">Učitavanje...</p>}
      {!loading && greska && !poruka && (
        <p className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-300">{greska}</p>
      )}

      {!loading && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Paketi usluga</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {paketi.map((paket) => (
                <article key={paket.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <h3 className="text-lg font-semibold">{paket.tip}</h3>
                  <p className="mt-1 text-sm text-gray-300">{paket.opis}</p>
                  <p className="mt-2 text-sm text-emerald-300">€{paket.cenaMesecnoEur}/mesečno</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Instalacioni opseg: {paket.instalacioniOpseg.od}–{paket.instalacioniOpseg.do}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
            <h2 className="mb-3 text-lg font-semibold">Dodela paketa i instalacionog broja</h2>
            <form className="grid gap-3 sm:grid-cols-3" onSubmit={onSubmit}>
              <input
                type="email"
                value={emailKorisnika}
                onChange={(event) => setEmailKorisnika(event.target.value)}
                placeholder="korisnik@email.com"
                className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm"
                required
              />
              <select
                value={tipPaketa}
                onChange={(event) => setTipPaketa(event.target.value as PaketTip)}
                className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm"
              >
                {(['Starter', 'Pro', 'Enterprise', 'VIP'] as PaketTip[]).map((tip) => (
                  <option key={tip} value={tip}>
                    {tip}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {submitting ? 'Obrada...' : 'Generiši broj'}
              </button>
            </form>

            {poruka && <p className="mt-3 rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">{poruka}</p>}
            {greska && <p className="mt-3 rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-300">{greska}</p>}
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
            <h2 className="mb-3 text-lg font-semibold">Aktivni agenti Call Centra ({aktivniAgenti.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="px-2 py-2">Agent</th>
                    <th className="px-2 py-2">Radna stanica</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aktivniAgenti.map((agent) => (
                    <tr key={agent.id} className="border-t border-gray-800">
                      <td className="px-2 py-2">{agent.ime}</td>
                      <td className="px-2 py-2">{agent.radnaStanica}</td>
                      <td className="px-2 py-2 text-emerald-300">{agent.status}</td>
                    </tr>
                  ))}
                  {aktivniAgenti.length === 0 && (
                    <tr>
                      <td className="px-2 py-3 text-gray-500" colSpan={3}>
                        Nema aktivnih agenata u ovom trenutku.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
