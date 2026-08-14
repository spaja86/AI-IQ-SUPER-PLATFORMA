'use client';

/**
 * DeployCard — kartica jedne platforme sa deploy statusom, dugmetom i timeline-om
 */

import { useState } from 'react';
import type { PlatformDeployStatus } from '@/lib/deploy/deploy-status';
import type { DeployHistoryEntry } from '@/lib/deploy/deploy-history';
import type { DeployEnvironment } from '@/lib/deploy/deploy-registry';
import DeployStatusBadge from './DeployStatusBadge';
import DeployTimeline from './DeployTimeline';
import DeployTriggerModal from './DeployTriggerModal';

interface DeployCardProps {
  status: PlatformDeployStatus;
  history: DeployHistoryEntry[];
  manualTriggerEnabled: boolean;
  healthSnapshot?: {
    healthy: boolean | null;
    message: string;
    httpStatus: number | null;
    responseTimeMs: number | null;
    checkedAt: string;
  };
  loadingHistory?: boolean;
  loadingHealth?: boolean;
  onHealthCheck: (platformId: string) => void;
  onHistoryRefresh: (platformId: string) => void;
  onAuditEvent?: (level: 'info' | 'success' | 'error', message: string) => void;
}

export default function DeployCard({
  status,
  history,
  manualTriggerEnabled,
  healthSnapshot,
  loadingHistory = false,
  loadingHealth = false,
  onHealthCheck,
  onHistoryRefresh,
  onAuditEvent,
}: DeployCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  async function handleDeploy(environment: DeployEnvironment, confirmToken?: string) {
    const res = await fetch('/api/deploy-platforma/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platformId: status.platformId,
        environment,
        confirmToken,
      }),
    });

    const json = await res.json() as { success: boolean; result?: { message?: string }; historyEntryId?: string };
    if (!json.success) {
      throw new Error(json.result?.message ?? 'Deploy neuspešan');
    }
    const message = json.result?.message ?? 'Deploy pokrenut';
    setTriggerResult(message);
    onAuditEvent?.(
      'success',
      `${status.platformId}: ${message}${json.historyEntryId ? ` (history: ${json.historyEntryId})` : ''}`,
    );
    onHistoryRefresh(status.platformId);
  }

  return (
    <>
      <div className="bg-zinc-900/80 border border-zinc-700/60 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-600 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl flex-shrink-0">{status.ikona}</span>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">{status.naziv}</h3>
              <p className="text-zinc-500 text-xs font-mono truncate">{status.vercelProjectId}</p>
            </div>
          </div>
          <DeployStatusBadge state={status.state} size="sm" />
        </div>

        {/* Meta */}
        <div className="space-y-1 text-xs text-zinc-500">
          {status.url && (
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 truncate max-w-[220px]"
              >
                {status.url.replace('https://', '')}
              </a>
            </div>
          )}
          {status.createdAt && (
            <div>
              <span>⏱️ Poslednji: </span>
              <time>{new Date(status.createdAt).toLocaleString('sr-Latn-RS')}</time>
            </div>
          )}
          {status.deploymentId && (
            <div className="font-mono text-zinc-600">
              # {status.deploymentId.slice(0, 16)}
            </div>
          )}
          {status.error && (
            <div className="text-red-400 text-xs truncate" title={status.error}>
              ⚠️ {status.error}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-zinc-500">Istorija:</p>
            <button
              type="button"
              onClick={() => onHistoryRefresh(status.platformId)}
              className="rounded border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300 transition hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {loadingHistory ? '⏳' : '↻'} History
            </button>
          </div>
          {history.length > 0 ? (
            <DeployTimeline entries={history} maxItems={3} />
          ) : (
            <p className="text-xs italic text-zinc-500">Nema zabeleženih deploymenta.</p>
          )}
        </div>

        {/* Trigger result */}
        {triggerResult && (
          <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            {triggerResult}
          </p>
        )}

        {healthSnapshot && (
          <div
            className={`rounded-lg border px-3 py-2 text-xs ${
              healthSnapshot.healthy === true
                ? 'border-green-500/20 bg-green-500/10 text-green-300'
                : healthSnapshot.healthy === false
                ? 'border-red-500/20 bg-red-500/10 text-red-300'
                : 'border-zinc-700 bg-zinc-800/70 text-zinc-300'
            }`}
          >
            <p>{healthSnapshot.message}</p>
            <p className="mt-1 text-[11px] opacity-80">
              {healthSnapshot.httpStatus !== null ? `HTTP ${healthSnapshot.httpStatus}` : 'HTTP —'}
              {' · '}
              {healthSnapshot.responseTimeMs !== null ? `${healthSnapshot.responseTimeMs}ms` : '—'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              onHealthCheck(status.platformId);
              onAuditEvent?.('info', `${status.platformId}: health check pokrenut`);
            }}
            className="rounded-lg border border-zinc-700 py-2 text-xs text-zinc-200 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {loadingHealth ? '⏳' : '🩺'} Health
          </button>
          <button
            type="button"
            onClick={() => {
              onHistoryRefresh(status.platformId);
              onAuditEvent?.('info', `${status.platformId}: history refresh pokrenut`);
            }}
            className="rounded-lg border border-zinc-700 py-2 text-xs text-zinc-200 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            📜 History
          </button>
          {manualTriggerEnabled ? (
            <button
              type="button"
              onClick={() => {
                setTriggerResult(null);
                setModalOpen(true);
              }}
              className="rounded-lg border border-zinc-600 bg-zinc-800 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              🚀 Deploy
            </button>
          ) : (
            <span className="inline-flex items-center justify-center rounded-lg border border-zinc-800 py-2 text-xs text-zinc-500">
              Trigger off
            </span>
          )}
        </div>
      </div>

      <DeployTriggerModal
        platformId={status.platformId}
        platformName={status.naziv}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeploy}
      />
    </>
  );
}
