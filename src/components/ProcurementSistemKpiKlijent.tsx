'use client';

import { useEffect, useState } from 'react';
import { dohvatiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';
import type {
  ProcurementDomenStatus,
  ProcurementKpi,
  ProcurementSistemStatus,
  ProcurementSpremnost,
} from '@/lib/procurement-sistem';

interface ApiPayload extends ProcurementSistemStatus {
  status?: string;
  naziv?: string;
  verzija?: string;
}

const READINESS_BADGE: Record<ProcurementSpremnost, { label: string; cls: string }> = {
  zavrsen: { label: '✅ Završen', cls: 'bg-green-100 text-green-800' },
  spreman: { label: '🟡 Spreman', cls: 'bg-yellow-100 text-yellow-800' },
  u_toku: { label: '🔵 U toku', cls: 'bg-blue-100 text-blue-800' },
  blokiran: { label: '🔴 Blokiran', cls: 'bg-red-100 text-red-800' },
};

const DOMEN_ICON: Record<string, string> = {
  b2b: '🤝',
  enterprise: '🏢',
  licencni: '📋',
};

function Badge({ readiness }: { readiness: ProcurementSpremnost }) {
  const { label, cls } = READINESS_BADGE[readiness] ?? READINESS_BADGE.u_toku;
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function DomenKartica({ domen }: { domen: ProcurementDomenStatus }) {
  const icon = DOMEN_ICON[domen.domen] ?? '📦';
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">
          {icon} {domen.naziv}
        </h3>
        <Badge readiness={domen.readiness} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="font-bold text-slate-800">{domen.ukupno}</p>
          <p className="text-xs text-slate-500">Ukupno</p>
        </div>
        <div>
          <p className="font-bold text-blue-600">{domen.aktivnih}</p>
          <p className="text-xs text-slate-500">Aktivnih</p>
        </div>
        <div>
          <p className="font-bold text-green-600">{domen.zavrsenih}</p>
          <p className="text-xs text-slate-500">Završenih</p>
        </div>
      </div>
      {domen.napomena && (
        <p className="mt-3 rounded bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
          ⚠️ {domen.napomena}
        </p>
      )}
    </div>
  );
}

function B2BFazeTabela({ poFazi }: { poFazi: Record<string, number> }) {
  const faze = Object.entries(poFazi).filter(([, v]) => v > 0);
  if (faze.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">📊 B2B slučajevi po fazi</h3>
      <div className="flex flex-wrap gap-2">
        {faze.map(([faza, broj]) => (
          <span
            key={faza}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {faza}: <strong>{broj}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProcurementSistemKpiKlijent() {
  const [sesija] = useState<OmegaSesija | null>(() => {
    if (typeof window === 'undefined') return null;
    return dohvatiSesiju();
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<(ProcurementSistemStatus & { verzija?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sesija?.token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStatus() {
      setLoading(true);
      try {
        const res = await fetch('/api/procurement-sistem', {
          headers: { Authorization: `Bearer ${sesija!.token}` },
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as { error?: string } | null;
          setError(err?.error ?? `Greška ${res.status}`);
          return;
        }
        const payload = (await res.json()) as ApiPayload;
        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Nepoznata greška');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [sesija]);

  if (!sesija?.token) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        🔒 Prijavite se da biste videli procurement KPI pregled.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
        Učitavanje procurement sistema…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        ❌ {error}
      </div>
    );
  }

  if (!data) return null;

  const kpi: ProcurementKpi = data.kpi;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            🏭 Prkitandejrski sistem — KPI Pregled
          </h2>
          <p className="text-sm text-slate-500">
            Unified procurement: B2B · Enterprise · Licencni
          </p>
        </div>
        <Badge readiness={data.ukupnaSpremnost} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Ukupno slučajeva" value={kpi.ukupnoSlucajeva} />
        <KpiCard label="Otvorenih" value={kpi.otvorenih} sub="aktivno u toku" />
        <KpiCard label="Završenih" value={kpi.zavrsenih} sub="zavrsen ili kupljeno" />
        <KpiCard
          label="Blokiranih"
          value={kpi.blokiranih}
          sub="nedostaje dok. ili ugovor"
        />
      </div>

      {/* Secondary KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard
          label="B2B spremni za uplatu"
          value={kpi.b2bSpremniZaUplatu}
          sub="checklist 100%"
        />
        <KpiCard
          label="Enterprise potpisano"
          value={`${kpi.enterprisePotpisano}/${kpi.enterpriseUkupno}`}
          sub="ugovori"
        />
        <KpiCard
          label="Licencni kupljeno"
          value={`${kpi.licencniKupljeno}/${kpi.licencniUkupno}`}
          sub="stavki"
        />
      </div>

      {/* Per-domain cards */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Status po domenu
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.domeni.map((d) => (
            <DomenKartica key={d.domen} domen={d} />
          ))}
        </div>
      </div>

      {/* B2B phases */}
      {kpi.b2bPoFazi && <B2BFazeTabela poFazi={kpi.b2bPoFazi} />}

      {/* Warnings */}
      {data.upozorenja.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">⚠️ Upozorenja</h3>
          <ul className="space-y-1">
            {data.upozorenja.map((u, i) => (
              <li key={i} className="text-sm text-amber-700">
                • {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta */}
      <p className="text-right text-xs text-slate-400">
        Verzija sistema: {data.sistemVerzija} · App: {data.verzija ?? data.appVerzija} ·{' '}
        {new Date(data.timestamp).toLocaleString('sr-RS')}
      </p>
    </section>
  );
}
