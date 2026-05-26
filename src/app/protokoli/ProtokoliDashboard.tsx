'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Protokol, ProtokolKategorija, ProtokolStatus } from '@/lib/protokoli/types';
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
      timestamp: string;
    };
  };
}

type StatusSummary = NonNullable<StatusApiResponse['data']>['status'];

interface ExportApiResponse {
  data?: {
    logs: Array<{ tip: string; timestamp: string; detalji?: Record<string, unknown> }>;
  };
}

const STATUS_COLORS: Record<ProtokolStatus, string> = {
  aktivan: 'bg-green-500/20 text-green-300 border-green-500/40',
  neaktivan: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
  deprecated: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'u-testu': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  incident: 'bg-red-500/20 text-red-300 border-red-500/40',
};

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

export function ProtokoliDashboard() {
  const [protokoli, setProtokoli] = useState<Protokol[]>([]);
  const [logs, setLogs] = useState<Array<{ tip: string; timestamp: string; detalji?: Record<string, unknown> }>>([]);
  const [loading, setLoading] = useState(true);
  const [kategorija, setKategorija] = useState<ProtokolKategorija | 'sve'>('sve');
  const [status, setStatus] = useState<ProtokolStatus | 'sve'>('sve');
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(null);
  const [actionMessage, setActionMessage] = useState<string>('');

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
      setProtokoli(listJson.data?.results ?? []);
      setStatusSummary(statusJson.data?.status ?? null);
      setLogs((exportJson.data?.logs ?? []).slice(0, 20));
    } catch (error) {
      console.error('[PROTOKOLI_UI] Učitavanje nije uspelo.', error);
      setActionMessage('Greška pri učitavanju podataka o protokolima.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(
    () =>
      protokoli.filter((protokol) => {
        if (kategorija !== 'sve' && protokol.kategorija !== kategorija) return false;
        if (status !== 'sve' && protokol.status !== status) return false;
        return true;
      }),
    [protokoli, kategorija, status],
  );

  async function verifyProtocol(id: string): Promise<void> {
    setActionMessage('');
    try {
      const response = await fetch(`/api/protokoli/${id}/verifikuj`, { method: 'POST' });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setActionMessage(payload.error ?? 'Verifikacija nije uspela.');
        return;
      }
      setActionMessage(`Verifikacija uspešno pokrenuta za protokol: ${id}`);
      await loadData();
    } catch (error) {
      console.error('[PROTOKOLI_UI] Verifikacija nije uspela.', error);
      setActionMessage('Greška pri pokretanju verifikacije.');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">📡 Protokoli Pregled</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Centralizovano upravljanje protokolima: status, verifikacije i audit trag.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
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

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 text-lg font-bold text-white">Svi protokoli</h2>
          {loading ? (
            <p className="text-sm text-zinc-400">Učitavanje...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="pb-3 pr-3">Naziv</th>
                    <th className="pb-3 pr-3">Kategorija</th>
                    <th className="pb-3 pr-3">Status</th>
                    <th className="pb-3 pr-3">Latency</th>
                    <th className="pb-3">Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((protokol) => (
                    <tr key={protokol.id} className="border-b border-white/5 align-top">
                      <td className="py-3 pr-3">
                        <div className="font-medium text-white">{protokol.naziv}</div>
                        <div className="text-xs text-zinc-500">{protokol.id}</div>
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">{protokol.kategorija}</td>
                      <td className="py-3 pr-3">
                        <span className={`rounded-full border px-2 py-1 text-xs ${STATUS_COLORS[protokol.status]}`}>
                          {protokol.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">{protokol.latency}</td>
                      <td className="py-3">
                        <Button
                          type="button"
                          onClick={() => void verifyProtocol(protokol.id)}
                          className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                        >
                          Verifikuj
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 text-lg font-bold text-white">Poslednjih 20 logova</h2>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-500">Nema događaja.</p>
            ) : (
              logs.map((entry, idx) => (
                <div key={`${entry.timestamp}-${idx}`} className="rounded-md border border-white/10 bg-black/20 p-2">
                  <div className="text-xs font-semibold text-white">{entry.tip}</div>
                  <div className="text-[11px] text-zinc-500">
                    {new Date(entry.timestamp).toLocaleString('sr-RS')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
