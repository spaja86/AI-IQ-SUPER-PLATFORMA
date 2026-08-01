/**
 * AgentAuditLog — poslednji audit log unosi od CI/deploy agenata
 */

interface AuditEntry {
  agent: string;
  ikona: string;
  akcija: string;
  status: 'success' | 'warning' | 'info' | 'error';
  vreme?: string;
}

interface AgentAuditLogProps {
  entries?: AuditEntry[];
  maxItems?: number;
}

const defaultEntries: AuditEntry[] = [
  {
    agent: 'ci-bot',
    ikona: '🏗️',
    akcija: 'TypeScript + ESLint + unit/smoke testovi prošli. Build gate: PASS.',
    status: 'success',
    vreme: 'omega-auto-build.yml',
  },
  {
    agent: 'security-scanner',
    ikona: '🛡️',
    akcija: 'CodeQL SAST skeniranje završeno. Dependency audit: bez kritičnih nalaza.',
    status: 'success',
    vreme: 'security-scanner.yml',
  },
  {
    agent: 'nova-generacija-agent',
    ikona: '⚡',
    akcija: 'Nova Generacija KPI gate: eval p99 ≤ 50ms ✅, build ≤ 3 min ✅. Staged rollout: 20% canary aktivan.',
    status: 'success',
    vreme: 'nova-generacija.yml',
  },
  {
    agent: 'human-review',
    ikona: '👁️',
    akcija: 'Deploy/config promene zahtevaju human review pre merge-a. Operativna pravila: AGENTS.md.',
    status: 'info',
    vreme: 'Manual',
  },
  {
    agent: 'multi-repo-sync-agent',
    ikona: '🔗',
    akcija: 'SUPER-PLATFORMA ↔ IO-OPENUI-AO sinhronizacija: config, labels, milestones — docs/MULTI-REPO-LINKS.md.',
    status: 'info',
    vreme: 'Push/Weekly',
  },
];

function statusDot(status: AuditEntry['status']) {
  switch (status) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
}

export default function AgentAuditLog({ entries = defaultEntries, maxItems = 10 }: AgentAuditLogProps) {
  const visible = entries.slice(0, maxItems);

  return (
    <div className="space-y-2">
      {visible.map((entry, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-3"
        >
          <span className="mt-0.5 flex-shrink-0 text-lg" role="img" aria-label={entry.agent}>{entry.ikona}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-zinc-300">{entry.agent}</span>
              <span className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${statusDot(entry.status)}`} />
              {entry.vreme && (
                <span className="text-xs text-zinc-600">{entry.vreme}</span>
              )}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{entry.akcija}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
