'use client';

/**
 * DeployTimeline — prikaz poslednje N deploymenta za platformu
 */

import type { DeployHistoryEntry } from '@/lib/deploy/deploy-history';

interface DeployTimelineProps {
  entries: DeployHistoryEntry[];
  maxItems?: number;
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `pre ${diff}s`;
  if (diff < 3600) return `pre ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `pre ${Math.floor(diff / 3600)}h`;
  return `pre ${Math.floor(diff / 86400)}d`;
}

export default function DeployTimeline({ entries, maxItems = 5 }: DeployTimelineProps) {
  const shown = entries.slice(0, maxItems);

  if (shown.length === 0) {
    return (
      <p className="text-sm text-zinc-500 italic">Nema zabeleženih deploymenta.</p>
    );
  }

  return (
    <ol className="relative border-l border-zinc-700 ml-2 space-y-4">
      {shown.map((entry) => (
        <li key={entry.id} className="ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-zinc-800 bg-zinc-600" />
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                entry.status === 'success'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : entry.status === 'pending'
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {entry.status === 'success' ? '✅' : entry.status === 'pending' ? '⏳' : '❌'}{' '}
              {entry.environment}
            </span>
            <time className="text-xs text-zinc-500">{formatRelative(entry.triggeredAt)}</time>
            <span className="text-xs text-zinc-600">by {entry.triggeredBy}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{entry.message}</p>
          {entry.deploymentId && (
            <p className="text-xs text-zinc-600 font-mono">#{entry.deploymentId.slice(0, 12)}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
