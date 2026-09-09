'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Protokol, ProtokolIzvor, ProtokolKriticnost, ProtokolKategorija, ProtokolStatus } from '@/lib/protokoli/types';
import Button from '@/components/Button';

interface ProtokoliApiResponse {
  data?: {
    results: Protokol[];
  };
}

interface StatusApiResponse {
  data?: {
    status: {
      ukupno: number;
      aktivan: number;
      neaktivan: number;
      deprecated: number;
      uTestu: number;
      incident: number;
      pendingPromene: number;
      timestamp: string;
      poKategoriji?: Record<string, number>;
      poIzvoru?: Record<string, number>;
      poKriticnosti?: Record<string, number>;
    };
  };
}

interface ExportApiResponse {
  data?: {
    logs: Array<{ tip: string; timestamp: string; detalji?: Record<string, unknown> }>;
  };
}

interface DetailApiResponse {
  data?: {
    protokol: Protokol;
    latestVerification: {
      status: 'uspesno' | 'neuspesno';
      timestamp: string;
      failedChecks: string[];
      ukupnoProvera: number;
      neuspesneProvere: number;
    } | null;
    lifecycle: Array<{
      id: string;
      noviStatus: string;
      prethodniStatus: string;
      razlog: string;
      tip: string;
      stanje: string;
      createdAt: string;
      updatedAt: string;
    }>;
    audit: Array<{ tip: string; timestamp: string; detalji?: Record<string, unknown> }>;
    dependencies: Array<{ id: string; naziv: string; status: string; found: boolean }>;
  };
}

type StatusSummary = NonNullable<StatusApiResponse['data']>['status'];

type DetailState = NonNullable<DetailApiResponse['data']> | null;

const STATUS_COLORS: Record<ProtokolStatus, string> = {
  aktivan: 'bg-green-500/20 text-green-300 border-green-500/40',
  neaktivan: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
  deprecated: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'u-testu': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  incident: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const KRITICNOSTI: Array<ProtokolKriticnost | 'sve'> = ['sve', 'niska', 'srednja', 'visoka', 'kriticna'];
const KATEGORIJE: Array<ProtokolKategorija | 'sve'> = [
  'sve',
  'komunikacioni',
  'bezbednosni',
  'poslovni',
  'operativni',
  'autentifikacioni',
  'transfer',
];
const STATUSI: Array<ProtokolStatus | 'sve'> = ['sve', 'aktivan', 'neaktivan', 'deprecated', 'u-testu', 'incident'];
const IZVORI: Array<ProtokolIzvor | 'sve'> = [
  'sve',
  'spaja-protokoli',
  'autofinish-protokol-verifikacija',
  'vlasnicki-vip-plan-dispatch-protokoli',
];

function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('sr-RS');
}

export function ProtokoliDashboard() {
  const [protokoli, setProtokoli] = useState<Protokol[]>([]);
  const [logs, setLogs] = useState<Array<{ tip: string; timestamp: string; detalji?: Record<string, unknown> }>>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [kategorija, setKategorija] = useState<ProtokolKategorija | 'sve'>('sve');
  const [status, setStatus] = useState<ProtokolStatus | 'sve'>('sve');
  const [kriticnost, setKriticnost] = useState<ProtokolKriticnost | 'sve'>('sve');
  const [izvor, setIzvor] = useState<ProtokolIzvor | 'sve'>('sve');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [detail, setDetail] = useState<DetailState>(null);
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [proposalStatus, setProposalStatus] = useState<ProtokolStatus>('u-testu');
  const [proposalReason, setProposalReason] = useState('');

  async function loadData(): Promise<void> {
    setLoading(true);
    setActionMessage('');
    try {
      const [listRes, statusRes, exportRes] = await Promise.all([
        fetch('/api/protokoli?limit=200', { cache: 'no-store' }),
        fetch('/api/protokoli/status', { cache: 'no-store' }),
        fetch('/api/protokoli/export', { cache: 'no-store' }),
      ]);
      const listJson = (await listRes.json()) as ProtokoliApiResponse;
      const statusJson = (await statusRes.json()) as StatusApiResponse;
      const exportJson = (await exportRes.json()) as ExportApiResponse;
      const loaded = listJson.data?.results ?? [];
      setProtokoli(loaded);
      setStatusSummary(statusJson.data?.status ?? null);
      setLogs((exportJson.data?.logs ?? []).slice(0, 20));
      setSelectedId((current) => current || loaded[0]?.id || '');
    } catch (error) {
      console.error('[PROTOKOLI_UI] Učitavanje nije uspelo.', error);
      setActionMessage('Greška pri učitavanju podataka o protokolima.');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: string): Promise<void> {
    if (!id) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/protokoli/${id}`, { cache: 'no-store' });
      const payload = (await response.json()) as DetailApiResponse & { error?: string };
      if (!response.ok) {
        setActionMessage(payload.error ?? 'Detalji protokola nisu dostupni.');
        setDetail(null);
        return;
      }
      setDetail(payload.data ?? null);
    } catch (error) {
      console.error('[PROTOKOLI_UI] Detalji nisu učitani.', error);
      setActionMessage('Greška pri učitavanju detalja protokola.');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    void loadDetail(selectedId);
  }, [selectedId]);

  const filtered = useMemo(
    () =>
      protokoli.filter((protokol) => {
        if (kategorija !== 'sve' && protokol.kategorija !== kategorija) return false;
        if (status !== 'sve' && protokol.status !== status) return false;
        if (kriticnost !== 'sve' && protokol.kriticnost !== kriticnost) return false;
        if (izvor !== 'sve' && protokol.izvor !== izvor) return false;
        if (query.trim()) {
          const text = `${protokol.id} ${protokol.naziv} ${protokol.opis} ${protokol.vlasnik.tim}`.toLowerCase();
          if (!text.includes(query.trim().toLowerCase())) return false;
        }
        return true;
      }),
    [protokoli, kategorija, status, kriticnost, izvor, query],
  );

  async function verifyProtocol(id: string): Promise<void> {
    setActionMessage('');
    try {
      const response = await fetch(`/api/protokoli/${id}/verifikuj`, { method: 'POST' });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setActionMessage(payload.error ?? 'Verifikacija nije uspela.');
        return;
      }
      setActionMessage(`Verifikacija uspešno pokrenuta za protokol: ${id}`);
      await loadData();
      await loadDetail(id);
    } catch (error) {
      console.error('[PROTOKOLI_UI] Verifikacija nije uspela.', error);
      setActionMessage('Greška pri pokretanju verifikacije.');
    }
  }

  async function submitProposal(): Promise<void> {
    if (!selectedId || !proposalReason.trim()) {
      setActionMessage('Unesite razlog za promenu statusa.');
      return;
    }
    setActionMessage('');
    try {
      const response = await fetch(`/api/protokoli/${selectedId}/status`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'predlozi', status: proposalStatus, reason: proposalReason.trim() }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setActionMessage(payload.error ?? 'Predlog promene statusa nije uspeo.');
        return;
      }
      setProposalReason('');
      setActionMessage(`Predlog statusa sačuvan za protokol: ${selectedId}`);
      await loadData();
      await loadDetail(selectedId);
    } catch (error) {
      console.error('[PROTOKOLI_UI] Predlog statusa nije uspeo.', error);
      setActionMessage('Greška pri slanju predloga statusa.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">📡 Protokoli Pregled</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Operativni kontrolni centar za lifecycle, verifikacije, incidente, ownership i audit trag svih protokola.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-400">Ukupno protokola</div>
          <div className="mt-1 text-2xl font-bold text-white">{statusSummary?.ukupno ?? protokoli.length}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-400">Aktivni</div>
          <div className="mt-1 text-2xl font-bold text-green-300">{statusSummary?.aktivan ?? 0}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-400">Incidenti</div>
          <div className="mt-1 text-2xl font-bold text-red-300">{statusSummary?.incident ?? 0}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-zinc-400">Pending promene</div>
          <div className="mt-1 text-2xl font-bold text-amber-300">{statusSummary?.pendingPromene ?? 0}</div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          className="min-w-[220px] rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
          placeholder="Pretraga po nazivu, ID-u ili timu"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
          value={kategorija}
          onChange={(event) => setKategorija(event.target.value as ProtokolKategorija | 'sve')}
        >
          {KATEGORIJE.map((value) => (
            <option key={value} value={value}>
              Kategorija: {value}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
          value={status}
          onChange={(event) => setStatus(event.target.value as ProtokolStatus | 'sve')}
        >
          {STATUSI.map((value) => (
            <option key={value} value={value}>
              Status: {value}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
          value={kriticnost}
          onChange={(event) => setKriticnost(event.target.value as ProtokolKriticnost | 'sve')}
        >
          {KRITICNOSTI.map((value) => (
            <option key={value} value={value}>
              Kritičnost: {value}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
          value={izvor}
          onChange={(event) => setIzvor(event.target.value as ProtokolIzvor | 'sve')}
        >
          {IZVORI.map((value) => (
            <option key={value} value={value}>
              Izvor: {value}
            </option>
          ))}
        </select>
        <Button
          type="button"
          onClick={() => void loadData()}
          className="rounded-md border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
        >
          Osveži
        </Button>
      </div>

      {actionMessage ? (
        <div className="mb-4 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
          {actionMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.7fr,1.2fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">Svi protokoli</h2>
              <div className="text-xs text-zinc-400">Prikazano: {filtered.length}</div>
            </div>
            {loading ? (
              <p className="text-sm text-zinc-400">Učitavanje...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-zinc-400">
                      <th className="pb-3 pr-3">Naziv</th>
                      <th className="pb-3 pr-3">Tim</th>
                      <th className="pb-3 pr-3">Kritičnost</th>
                      <th className="pb-3 pr-3">Status</th>
                      <th className="pb-3 pr-3">Latency</th>
                      <th className="pb-3">Akcija</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((protokol) => (
                      <tr
                        key={protokol.id}
                        className={`border-b border-white/5 align-top ${selectedId === protokol.id ? 'bg-white/5' : ''}`}
                      >
                        <td className="py-3 pr-3">
                          <button
                            type="button"
                            className="text-left"
                            onClick={() => setSelectedId(protokol.id)}
                          >
                            <div className="font-medium text-white">{protokol.naziv}</div>
                            <div className="text-xs text-zinc-500">{protokol.id}</div>
                          </button>
                        </td>
                        <td className="py-3 pr-3 text-zinc-300">{protokol.vlasnik.tim}</td>
                        <td className="py-3 pr-3 text-zinc-300">{protokol.kriticnost}</td>
                        <td className="py-3 pr-3">
                          <span className={`rounded-full border px-2 py-1 text-xs ${STATUS_COLORS[protokol.status]}`}>
                            {protokol.status}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-zinc-300">{protokol.latency}</td>
                        <td className="py-3">
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              onClick={() => void verifyProtocol(protokol.id)}
                              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                            >
                              Verifikuj
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setSelectedId(protokol.id)}
                              className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10"
                            >
                              Detalji
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="mb-4 text-lg font-bold text-white">Poslednjih 20 globalnih logova</h2>
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-sm text-zinc-500">Nema događaja.</p>
              ) : (
                logs.map((entry, idx) => (
                  <div key={`${entry.timestamp}-${idx}`} className="rounded-md border border-white/10 bg-black/20 p-2">
                    <div className="text-xs font-semibold text-white">{entry.tip}</div>
                    <div className="text-[11px] text-zinc-500">{formatDate(entry.timestamp)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 text-lg font-bold text-white">Drill-down protokola</h2>
          {detailLoading ? (
            <p className="text-sm text-zinc-400">Učitavanje detalja...</p>
          ) : detail?.protokol ? (
            <div className="space-y-5">
              <div>
                <div className="text-xl font-semibold text-white">{detail.protokol.naziv}</div>
                <div className="text-xs text-zinc-500">{detail.protokol.id}</div>
                <p className="mt-2 text-sm text-zinc-300">{detail.protokol.opis}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                  <div className="text-xs text-zinc-500">Vlasnik</div>
                  <div className="font-medium text-white">{detail.protokol.vlasnik.tim}</div>
                  <div>{detail.protokol.vlasnik.uloga}</div>
                  <div className="text-xs text-zinc-500">{detail.protokol.vlasnik.kontakt}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                  <div className="text-xs text-zinc-500">Source of truth</div>
                  <div className="break-all text-xs text-white">{detail.protokol.sourceOfTruth}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                  <div className="text-xs text-zinc-500">Okruženje / kritičnost</div>
                  <div className="font-medium text-white">{detail.protokol.okruzenje}</div>
                  <div>{detail.protokol.kriticnost}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                  <div className="text-xs text-zinc-500">SLO</div>
                  <div>Latency ≤ {detail.protokol.slo.latencyTargetMs}ms</div>
                  <div>Availability ≥ {detail.protokol.slo.availabilityTargetPct}%</div>
                  <div>Incident response ≤ {detail.protokol.slo.maxIncidentResponseMin} min</div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 text-sm font-semibold text-white">Zavisnosti</div>
                <div className="space-y-1 text-sm text-zinc-300">
                  {detail.dependencies.length === 0 ? (
                    <div className="text-zinc-500">Nema zavisnosti.</div>
                  ) : (
                    detail.dependencies.map((dependency) => (
                      <div key={dependency.id} className="flex items-center justify-between gap-3">
                        <span>{dependency.naziv}</span>
                        <span className={`text-xs ${dependency.found ? 'text-emerald-300' : 'text-red-300'}`}>
                          {dependency.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 text-sm font-semibold text-white">Poslednja verifikacija</div>
                {detail.latestVerification ? (
                  <div className="space-y-1 text-sm text-zinc-300">
                    <div>
                      Status:{' '}
                      <span className={detail.latestVerification.status === 'uspesno' ? 'text-emerald-300' : 'text-red-300'}>
                        {detail.latestVerification.status}
                      </span>
                    </div>
                    <div>Vreme: {formatDate(detail.latestVerification.timestamp)}</div>
                    <div>Ukupno provera: {detail.latestVerification.ukupnoProvera}</div>
                    <div>Neuspešne provere: {detail.latestVerification.neuspesneProvere}</div>
                    {detail.latestVerification.failedChecks.length > 0 ? (
                      <div className="text-xs text-red-300">{detail.latestVerification.failedChecks.join(', ')}</div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500">Još nema verification snapshot-a.</div>
                )}
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-3 text-sm font-semibold text-white">Predlog promene statusa</div>
                <div className="space-y-3">
                  <select
                    className="w-full rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
                    value={proposalStatus}
                    onChange={(event) => setProposalStatus(event.target.value as ProtokolStatus)}
                  >
                    {STATUSI.filter((value): value is ProtokolStatus => value !== 'sve').map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="min-h-[90px] w-full rounded-md border border-white/20 bg-zinc-900 px-3 py-2 text-sm text-white"
                    placeholder="Razlog promene statusa, incident ili rollback kontekst"
                    value={proposalReason}
                    onChange={(event) => setProposalReason(event.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => void submitProposal()}
                    className="rounded-md border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/20"
                  >
                    Pošalji predlog
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 text-sm font-semibold text-white">Lifecycle istorija</div>
                <div className="space-y-2 text-sm text-zinc-300">
                  {detail.lifecycle.length === 0 ? (
                    <div className="text-zinc-500">Nema status promena.</div>
                  ) : (
                    detail.lifecycle.slice(0, 6).map((entry) => (
                      <div key={entry.id} className="rounded-md border border-white/10 p-2">
                        <div className="font-medium text-white">
                          {entry.prethodniStatus} → {entry.noviStatus}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {entry.tip} · {entry.stanje} · {formatDate(entry.createdAt)}
                        </div>
                        <div>{entry.razlog}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 text-sm font-semibold text-white">Audit događaji</div>
                <div className="space-y-2 text-sm text-zinc-300">
                  {detail.audit.length === 0 ? (
                    <div className="text-zinc-500">Nema audit događaja.</div>
                  ) : (
                    detail.audit.slice(0, 6).map((entry, idx) => (
                      <div key={`${entry.timestamp}-${idx}`} className="rounded-md border border-white/10 p-2">
                        <div className="font-medium text-white">{entry.tip}</div>
                        <div className="text-xs text-zinc-500">{formatDate(entry.timestamp)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Izaberite protokol za detaljan pregled.</p>
          )}
        </div>
      </div>
    </div>
  );
}
