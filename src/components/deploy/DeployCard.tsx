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
}

export default function DeployCard({ status, history, manualTriggerEnabled }: DeployCardProps) {
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

    const json = await res.json() as { success: boolean; result?: { message?: string } };
    if (!json.success) {
      throw new Error(json.result?.message ?? 'Deploy neuspešan');
    }
    setTriggerResult(json.result?.message ?? 'Deploy pokrenut');
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
        {history.length > 0 && (
          <div>
            <p className="text-xs text-zinc-500 mb-2 font-medium">Istorija:</p>
            <DeployTimeline entries={history} maxItems={3} />
          </div>
        )}

        {/* Trigger result */}
        {triggerResult && (
          <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            {triggerResult}
          </p>
        )}

        {/* Actions */}
        {manualTriggerEnabled && (
          <button
            type="button"
            onClick={() => {
              setTriggerResult(null);
              setModalOpen(true);
            }}
            className="mt-auto w-full py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm font-medium hover:bg-zinc-700 hover:border-zinc-500 transition-colors"
          >
            🚀 Deploy
          </button>
        )}
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
