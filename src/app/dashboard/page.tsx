import type { Metadata } from 'next';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import { getActiveRepositories } from '@/lib/repositories';
import { organizations } from '@/lib/organizations';
import { getEcosystemStats } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Pregled celokupnog SPAJA ekosistema — repozitorijumi, organizacije, proizvodi i status sistema.',
};

export default function DashboardPage() {
  const stats = getEcosystemStats();
  const activeRepos = getActiveRepositories();

  const statCards = [
    { label: 'Repozitorijumi', value: stats.repositories, icon: '📦' },
    { label: 'Organizacije', value: stats.organizations, icon: '🏛️' },
    { label: 'Proizvodi', value: stats.products, icon: '🚀' },
    { label: 'Omega AI', value: stats.omegaAIs, icon: '♾️' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
        <p className="mt-2 text-lg text-zinc-400">
          Pregled celokupnog SPAJA ekosistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-zinc-400">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Repositories */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Aktivni Repozitorijumi
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeRepos.map((repo) => (
            <div
              key={repo.id}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {repo.name}
                </h3>
                <StatusBadge status={repo.status} />
              </div>
              <p className="mt-2 text-sm text-zinc-400">{repo.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {repo.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[#7c3aed]/10 px-2 py-0.5 text-xs text-[#7c3aed]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-medium text-[#7c3aed] transition-colors hover:text-[#2563eb]"
              >
                GitHub →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Organizations */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">Organizacije</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              icon={org.icon}
              title={org.name}
              subtitle={org.type}
              description={org.descriptionSr}
              href={org.url}
            />
          ))}
        </div>
      </section>

      {/* System Status */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">Status Sistema</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'AI IQ World Bank', status: 'active', icon: '🏦' },
            { name: 'AI IQ Menjačnica', status: 'active', icon: '💱' },
            { name: 'IO OpenUI AO', status: 'active', icon: '🤖' },
            { name: 'Kompanija SPAJA', status: 'active', icon: '🏢' },
            { name: 'Omega AI Ekosistem', status: 'concept', icon: '♾️' },
            { name: 'Svetska Organizacija', status: 'planned', icon: '🌍' },
            { name: 'Auto-Popravka System', status: 'active', icon: '🔧' },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <span className="text-2xl">{service.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {service.name}
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
