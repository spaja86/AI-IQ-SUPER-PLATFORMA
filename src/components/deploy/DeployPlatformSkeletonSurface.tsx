'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DeployHistoryEntry } from '@/lib/deploy/deploy-history';
import { deployRegistry } from '@/lib/deploy/deploy-registry';
import type { PlatformDeployStatus } from '@/lib/deploy/deploy-status';
import {
  buildOverviewFromList,
  normalizeStatusApiPayload,
  stateToLabel,
  type DeployOverviewStats,
} from '@/lib/deploy/deploy-ui-contracts';
import DeployPlatformGrid from './DeployPlatformGrid';

interface HistoryApiResponse {
  stavke?: unknown;
}

interface HealthApiResponse {
  healthy?: unknown;
  message?: unknown;
  httpStatus?: unknown;
  responseTimeMs?: unknown;
  checkedAt?: unknown;
}

interface DeployHealthSnapshot {
  healthy: boolean | null;
  message: string;
  httpStatus: number | null;
  responseTimeMs: number | null;
  checkedAt: string;
}

interface AuditEvent {
  id: string;
  level: 'info' | 'success' | 'error';
  message: string;
  timestamp: string;
}

const PIPELINE_GATES = [
  'TypeScript gate',
  'Lint gate',
  'Unit test gate',
  'Smoke gate',
  'Predeploy gate',
  'Security scan',
] as const;

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function formatTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('sr-Latn-RS');
}

function SectionSkeleton({ motionReduced }: { motionReduced: boolean }) {
  return (
    <div className={cx('rounded-xl border border-zinc-800 bg-zinc-900/70 p-4', motionReduced ? '' : 'animate-pulse')}>
      <div className="h-5 w-1/3 rounded bg-zinc-700" />
      <div className="mt-3 h-4 w-4/5 rounded bg-zinc-800" />
      <div className="mt-2 h-4 w-3/5 rounded bg-zinc-800" />
    </div>
  );
}

export default function DeployPlatformSkeletonSurface() {
  const [statuses, setStatuses] = useState<PlatformDeployStatus[]>([]);
  const [overview, setOverview] = useState<DeployOverviewStats>({
    ukupno: 0,
    aktivan: 0,
    grade: 0,
    greska: 0,
    nepoznato: 0,
  });
  const [historyMap, setHistoryMap] = useState<Record<string, DeployHistoryEntry[]>>({});
  const [healthMap, setHealthMap] = useState<Record<string, DeployHealthSnapshot>>({});
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState<Record<string, boolean>>({});
  const [loadingHealth, setLoadingHealth] = useState<Record<string, boolean>>({});
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const appendAudit = useCallback((level: AuditEvent['level'], message: string) => {
    setAuditEvents((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        level,
        message,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 20));
  }, []);

  const loadStatus = useCallback(async () => {
    const res = await fetch('/api/deploy-platforma/status', {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Status API greška (HTTP ${res.status})`);
    }

    const payload = normalizeStatusApiPayload(await res.json());
    const computed = buildOverviewFromList(payload.lista);

    setStatuses(payload.lista);
    setOverview({
      ukupno: payload.platforme.ukupno || computed.ukupno,
      aktivan: payload.platforme.aktivan || computed.aktivan,
      grade: payload.platforme.grade || computed.grade,
      greska: payload.platforme.greska || computed.greska,
      nepoznato: payload.platforme.nepoznato || computed.nepoznato,
    });
    setLastUpdatedAt(payload.timestamp);
    setErrorMessage(null);
    return payload.lista;
  }, []);

  const loadHistoryForPlatform = useCallback(async (platformId: string) => {
    setLoadingHistory((prev) => ({ ...prev, [platformId]: true }));
    try {
      const res = await fetch(`/api/deploy-platforma/history/${platformId}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`History API greška (HTTP ${res.status})`);
      }

      const json = await res.json() as HistoryApiResponse;
      const stavke = Array.isArray(json.stavke)
        ? (json.stavke.filter((entry): entry is DeployHistoryEntry => !!entry && typeof entry === 'object'))
        : [];

      setHistoryMap((prev) => ({ ...prev, [platformId]: stavke }));
      appendAudit('info', `Istorija osvežena za ${platformId} (${stavke.length} stavki)`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      appendAudit('error', `Greška pri učitavanju istorije za ${platformId}: ${msg}`);
    } finally {
      setLoadingHistory((prev) => ({ ...prev, [platformId]: false }));
    }
  }, [appendAudit]);

  const loadHealthForPlatform = useCallback(async (platformId: string) => {
    setLoadingHealth((prev) => ({ ...prev, [platformId]: true }));
    try {
      const res = await fetch(`/api/deploy-platforma/health/${platformId}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok && res.status !== 200) {
        throw new Error(`Health API greška (HTTP ${res.status})`);
      }

      const json = await res.json() as HealthApiResponse;
      const snapshot: DeployHealthSnapshot = {
        healthy:
          typeof json.healthy === 'boolean'
            ? json.healthy
            : json.healthy === null
            ? null
            : null,
        message: typeof json.message === 'string' && json.message.trim().length > 0
          ? json.message
          : 'Health status nije dostupan',
        httpStatus: typeof json.httpStatus === 'number' ? json.httpStatus : null,
        responseTimeMs: typeof json.responseTimeMs === 'number' ? json.responseTimeMs : null,
        checkedAt: typeof json.checkedAt === 'string' ? json.checkedAt : new Date().toISOString(),
      };

      setHealthMap((prev) => ({ ...prev, [platformId]: snapshot }));
      appendAudit('info', `Health check završen za ${platformId}: ${snapshot.message}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setHealthMap((prev) => ({
        ...prev,
        [platformId]: {
          healthy: false,
          message: `Health check greška: ${msg}`,
          httpStatus: null,
          responseTimeMs: null,
          checkedAt: new Date().toISOString(),
        },
      }));
      appendAudit('error', `Health check greška za ${platformId}: ${msg}`);
    } finally {
      setLoadingHealth((prev) => ({ ...prev, [platformId]: false }));
    }
  }, [appendAudit]);

  const loadAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoadingInitial(true);

    try {
      const loadedStatuses = await loadStatus();
      await Promise.all(loadedStatuses.map((status) => loadHistoryForPlatform(status.platformId)));
      if (isRefresh) appendAudit('success', 'Deploy status i istorija su osveženi.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setErrorMessage(msg);
      appendAudit('error', `Neuspešno učitavanje deploy podataka: ${msg}`);
    } finally {
      setLoadingInitial(false);
      setRefreshing(false);
    }
  }, [appendAudit, loadHistoryForPlatform, loadStatus]);

  useEffect(() => {
    void loadAll(false);
  }, [loadAll]);

  const activeStates = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of statuses) {
      map[item.platformId] = stateToLabel(item.state);
    }
    return map;
  }, [statuses]);

  const empty = !loadingInitial && statuses.length === 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Deploy Platform Skeleton UI/UX</p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">🚀 Deploy Platforma Control Surface</h1>
              <p className="max-w-3xl text-sm text-zinc-300">
                Skeleton-first UI za status, trigger, history i health tokove. Površina je usklađena sa
                <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-zinc-200">/api/deploy-platforma/*</code>
                rutama i produkcionim gating pravilima.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void loadAll(true)}
                aria-label="Osveži deploy status i istoriju"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {refreshing ? '⏳ Osvežavanje...' : '🔄 Osveži status'}
              </button>
              <a
                href="/api/deploy-platforma/status"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                📊 Status API
              </a>
              <a
                href="/api/deploy-platforma/trigger"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                🚀 Trigger API
              </a>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Last sync: {lastUpdatedAt ? formatTime(lastUpdatedAt) : '—'}
          </p>
        </section>

        {loadingInitial ? (
          <div className="space-y-4" aria-live="polite" aria-busy="true">
            <SectionSkeleton motionReduced={reducedMotion} />
            <SectionSkeleton motionReduced={reducedMotion} />
            <SectionSkeleton motionReduced={reducedMotion} />
          </div>
        ) : null}

        {!loadingInitial && errorMessage ? (
          <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <h2 className="text-sm font-semibold text-red-300">Greška pri učitavanju</h2>
            <p className="mt-1 text-sm text-red-200">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void loadAll(true)}
              className="mt-3 rounded-lg border border-red-400/40 px-3 py-2 text-xs font-medium text-red-100 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Pokušaj ponovo
            </button>
          </section>
        ) : null}

        {!loadingInitial && !errorMessage && (
          <>
            <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {[
                { label: 'Platforme', value: overview.ukupno, tone: 'zinc' },
                { label: 'Aktivne', value: overview.aktivan, tone: 'green' },
                { label: 'Build/Queue', value: overview.grade, tone: 'yellow' },
                { label: 'Greška', value: overview.greska, tone: 'red' },
                { label: 'Nepoznato', value: overview.nepoznato, tone: 'blue' },
              ].map((item) => (
                <article
                  key={item.label}
                  className={cx(
                    'rounded-xl border p-4',
                    item.tone === 'green' && 'border-green-500/30 bg-green-500/10',
                    item.tone === 'yellow' && 'border-yellow-500/30 bg-yellow-500/10',
                    item.tone === 'red' && 'border-red-500/30 bg-red-500/10',
                    item.tone === 'blue' && 'border-blue-500/30 bg-blue-500/10',
                    item.tone === 'zinc' && 'border-zinc-800 bg-zinc-900/70',
                  )}
                >
                  <p className="text-xs text-zinc-300">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-white">Portfolio platformi</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  CTA tokovi: status, deploy trigger (sa production potvrdom), history refresh i health check.
                </p>
                {empty ? (
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 text-center text-sm text-zinc-400">
                    Nema podataka iz status API-ja. Proverite deploy registry i Vercel pristup.
                  </div>
                ) : (
                  <div className="mt-4">
                    <DeployPlatformGrid
                      statuses={statuses}
                      historyMap={historyMap}
                      healthMap={healthMap}
                      loadingHistory={loadingHistory}
                      loadingHealth={loadingHealth}
                      registry={deployRegistry}
                      onHealthCheck={(platformId) => void loadHealthForPlatform(platformId)}
                      onHistoryRefresh={(platformId) => void loadHistoryForPlatform(platformId)}
                      onAuditEvent={(level, message) => appendAudit(level, message)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">CI/CD Governance</h3>
                  <p className="mt-1 text-xs text-zinc-500">Quality gates prikazani u UI jeziku kao release kriterijumi.</p>
                  <ul className="mt-3 space-y-2">
                    {PIPELINE_GATES.map((gate) => (
                      <li key={gate} className="flex items-center gap-2 text-sm text-zinc-300">
                        <span className="text-green-400" aria-hidden="true">✔</span>
                        <span>{gate}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">State mapping</h3>
                  <ul className="mt-3 max-h-56 space-y-1 overflow-auto pr-1 text-xs text-zinc-400">
                    {statuses.map((status) => (
                      <li key={status.platformId} className="rounded-md border border-zinc-800 bg-zinc-950/50 px-2 py-1">
                        <span className="font-mono text-zinc-300">{status.platformId}</span>
                        <span className="mx-1">→</span>
                        <span>{activeStates[status.platformId] ?? 'Nepoznato'}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Audit feedback</h3>
                  <p className="mt-1 text-xs text-zinc-500">Vidljiv rezultat akcija nakon status/trigger/history/health operacija.</p>
                  <ol className="mt-3 max-h-64 space-y-2 overflow-auto pr-1">
                    {auditEvents.length === 0 ? (
                      <li className="text-xs text-zinc-500">Nema događaja još uvek.</li>
                    ) : (
                      auditEvents.map((event) => (
                        <li
                          key={event.id}
                          className={cx(
                            'rounded-md border px-2 py-1 text-xs',
                            event.level === 'success' && 'border-green-500/30 bg-green-500/10 text-green-200',
                            event.level === 'error' && 'border-red-500/30 bg-red-500/10 text-red-200',
                            event.level === 'info' && 'border-zinc-700 bg-zinc-950/50 text-zinc-300',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{event.message}</span>
                            <time className="text-[10px] opacity-80">{formatTime(event.timestamp)}</time>
                          </div>
                        </li>
                      ))
                    )}
                  </ol>
                </section>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
