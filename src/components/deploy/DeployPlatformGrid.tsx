'use client';

/**
 * DeployPlatformGrid — responsivni grid svih DeployCard-ova
 */

import type { PlatformDeployStatus } from '@/lib/deploy/deploy-status';
import type { DeployHistoryEntry } from '@/lib/deploy/deploy-history';
import type { DeployPlatformEntry } from '@/lib/deploy/deploy-registry';
import DeployCard from './DeployCard';

interface DeployPlatformGridProps {
  statuses: PlatformDeployStatus[];
  historyMap: Record<string, DeployHistoryEntry[]>;
  registry: DeployPlatformEntry[];
}

export default function DeployPlatformGrid({
  statuses,
  historyMap,
  registry,
}: DeployPlatformGridProps) {
  if (statuses.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p className="text-4xl mb-3">🚀</p>
        <p className="text-lg font-medium">Nema registrovanih platformi</p>
        <p className="text-sm mt-1">Dodajte platforme u deploy-registry.ts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statuses.map((status) => {
        const regEntry = registry.find((r) => r.id === status.platformId);
        return (
          <DeployCard
            key={status.platformId}
            status={status}
            history={historyMap[status.platformId] ?? []}
            manualTriggerEnabled={regEntry?.manualTriggerEnabled ?? false}
          />
        );
      })}
    </div>
  );
}
