import type { Metadata } from 'next';
import { platforms } from '@/lib/platforms';
import { PageContainer, SectionHeader, StatusBadge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Deploy',
  description: 'Status deploy-a platformi u ekosistemu',
};

export default function DeployPage() {
  const deployable = platforms.filter((p) => p.deploy);
  const notDeployed = platforms.filter((p) => !p.deploy);

  return (
    <PageContainer>
      <SectionHeader
        icon="🚀"
        title="Deploy Status"
        subtitle="Pregled deploy statusa svih platformi"
      />

      {/* Deployed Platforms */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Deployovane platforme ({deployable.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {deployable.map((platform) => (
            <div
              key={platform.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <StatusBadge status={platform.status} />
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    platform.deploy?.status === 'deployed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {platform.deploy?.status}
                </span>
              </div>
              {platform.deploy && (
                <div className="mt-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {platform.deploy.domain && (
                    <p>
                      <span className="font-medium">Domain:</span>{' '}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                        {platform.deploy.domain}
                      </code>
                    </p>
                  )}
                  {platform.deploy.framework && (
                    <p>
                      <span className="font-medium">Framework:</span> {platform.deploy.framework}
                    </p>
                  )}
                  {platform.deploy.buildCommand && (
                    <p>
                      <span className="font-medium">Build:</span>{' '}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                        {platform.deploy.buildCommand}
                      </code>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Not Yet Deployed */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Čeka deploy ({notDeployed.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notDeployed.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <span className="text-2xl">{platform.icon}</span>
              <div>
                <p className="font-medium">{platform.name}</p>
                <StatusBadge status={platform.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
