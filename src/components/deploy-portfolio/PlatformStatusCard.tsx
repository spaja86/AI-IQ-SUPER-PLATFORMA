/**
 * PlatformStatusCard — kartica platforme sa statusom, runtime-om i KPI oznakom
 */

import type { DeployPlatformEntry, DeployPlatformStatus } from '@/lib/deploy/deploy-registry';

interface PlatformStatusCardProps {
  platform: DeployPlatformEntry;
}

function statusBadge(status: DeployPlatformStatus) {
  switch (status) {
    case 'aktivan':
      return <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">✅ Aktivan</span>;
    case 'u_pripremi':
      return <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">🔧 U pripremi</span>;
    case 'greska':
      return <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">⚠️ Greška</span>;
    default:
      return <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-xs font-medium text-zinc-400">⛔ Neaktivan</span>;
  }
}

export default function PlatformStatusCard({ platform }: PlatformStatusCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-5 transition-colors hover:border-zinc-500">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl flex-shrink-0" role="img" aria-label={platform.naziv}>{platform.ikona}</span>
          <h3 className="truncate text-sm font-semibold text-white">{platform.naziv}</h3>
        </div>
        {statusBadge(platform.status)}
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400">{platform.opis}</p>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-1">
        <span className="rounded-full border border-zinc-700/40 bg-zinc-800/70 px-2 py-0.5 text-xs text-zinc-300">
          {platform.framework}
        </span>
        {platform.manualTriggerEnabled && (
          <span className="rounded-full border border-blue-700/30 bg-blue-900/30 px-2 py-0.5 text-xs text-blue-300">
            🚀 Triggable
          </span>
        )}
        {platform.healthUrl && (
          <span className="rounded-full border border-teal-700/30 bg-teal-900/30 px-2 py-0.5 text-xs text-teal-300">
            🩺 Health check
          </span>
        )}
      </div>

      {/* Production link */}
      <a
        href={platform.produktionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-xs text-blue-400 hover:text-blue-300"
      >
        🔗 {platform.produktionUrl.replace('https://', '')}
      </a>
    </div>
  );
}
