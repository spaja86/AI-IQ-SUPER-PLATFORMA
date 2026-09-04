/**
 * DeployStatusBadge — color-coded badge za stanje deploymenta
 */

import type { VercelDeployState } from '@/lib/deploy/deploy-status';

interface DeployStatusBadgeProps {
  state: VercelDeployState | null;
  size?: 'sm' | 'md';
}

const stateConfig: Record<VercelDeployState, { label: string; classes: string }> = {
  READY: {
    label: '✅ Aktivan',
    classes: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  BUILDING: {
    label: '🔨 Gradi se',
    classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  QUEUED: {
    label: '⏳ U redu',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  INITIALIZING: {
    label: '🔄 Inicijalizacija',
    classes: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  },
  ERROR: {
    label: '❌ Greška',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  CANCELED: {
    label: '⛔ Otkazano',
    classes: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
  UNKNOWN: {
    label: '❓ Nepoznato',
    classes: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function DeployStatusBadge({ state, size = 'sm' }: DeployStatusBadgeProps) {
  const cfg = state ? (stateConfig[state] ?? stateConfig.UNKNOWN) : stateConfig.UNKNOWN;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={`Deploy status: ${cfg.label}`}
      className={`inline-flex items-center rounded-full border font-medium ${cfg.classes} ${sizeClasses[size]}`}
    >
      {cfg.label}
    </span>
  );
}
