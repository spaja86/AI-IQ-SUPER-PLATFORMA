/**
 * DeployPipelineTrack — vizualizacija dev → staging → production pipeline-a
 */

interface PipelineStage {
  label: string;
  ikona: string;
  status: 'active' | 'pending' | 'blocked';
  opis?: string;
}

interface DeployPipelineTrackProps {
  stages?: PipelineStage[];
  platformName?: string;
}

const defaultStages: PipelineStage[] = [
  {
    label: 'dev',
    ikona: '🔨',
    status: 'active',
    opis: 'Feature branch — lint, typecheck, unit test',
  },
  {
    label: 'staging',
    ikona: '🧪',
    status: 'active',
    opis: 'Smoke testovi, predeploy check, security gate',
  },
  {
    label: 'production',
    ikona: '🚀',
    status: 'active',
    opis: 'Vercel deploy — human review required, confirmToken za trigger',
  },
];

function stageColor(status: PipelineStage['status']) {
  switch (status) {
    case 'active':
      return 'border-green-500/60 bg-green-500/10 text-green-300';
    case 'pending':
      return 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300';
    case 'blocked':
      return 'border-red-500/60 bg-red-500/10 text-red-300';
  }
}

export default function DeployPipelineTrack({ stages = defaultStages, platformName }: DeployPipelineTrackProps) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-5">
      {platformName && (
        <p className="mb-4 text-xs font-medium text-zinc-400">{platformName}</p>
      )}
      <div className="flex items-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 text-center ${stageColor(stage.status)}`}
              title={stage.opis}
            >
              <span className="text-lg" role="img" aria-label={stage.label}>{stage.ikona}</span>
              <span className="text-xs font-semibold uppercase tracking-wide">{stage.label}</span>
              {stage.opis && (
                <span className="hidden text-xs opacity-70 sm:block">{stage.opis}</span>
              )}
            </div>
            {i < stages.length - 1 && (
              <span className="flex-shrink-0 text-zinc-600">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
