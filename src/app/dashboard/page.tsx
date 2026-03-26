import type { Metadata } from 'next';
import { getIndustrijaStats } from '@/lib/industrija';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';
import { PageContainer, SectionHeader, StatCard, StatusBadge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Statistika i stanje ekosistema Digitalne Industrije',
};

export default function DashboardPage() {
  const stats = getIndustrijaStats();

  const statusBreakdown = {
    active: { platforms: 0, organizations: 0, companies: 0, products: 0 },
    development: { platforms: 0, organizations: 0, companies: 0, products: 0 },
    planned: { platforms: 0, organizations: 0, companies: 0, products: 0 },
  };

  platforms.forEach((p) => {
    if (p.status in statusBreakdown) statusBreakdown[p.status as keyof typeof statusBreakdown].platforms++;
  });
  organizations.forEach((o) => {
    if (o.status in statusBreakdown) statusBreakdown[o.status as keyof typeof statusBreakdown].organizations++;
  });
  companies.forEach((c) => {
    if (c.status in statusBreakdown) statusBreakdown[c.status as keyof typeof statusBreakdown].companies++;
  });
  products.forEach((p) => {
    if (p.status in statusBreakdown) statusBreakdown[p.status as keyof typeof statusBreakdown].products++;
  });

  return (
    <PageContainer>
      <SectionHeader icon="📊" title="Dashboard" subtitle="Statistika i stanje celokupnog ekosistema" />

      {/* Total Stats */}
      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="🧩" label="Ukupno platformi" value={stats.totalPlatforms} />
        <StatCard icon="🏢" label="Ukupno organizacija" value={stats.totalOrganizations} />
        <StatCard icon="🏛️" label="Ukupno kompanija" value={stats.totalCompanies} />
        <StatCard icon="📦" label="Ukupno proizvoda" value={stats.totalProducts} />
      </section>

      {/* Active Stats */}
      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="✅" label="Aktivne platforme" value={stats.activePlatforms} />
        <StatCard icon="✅" label="Aktivne organizacije" value={stats.activeOrganizations} />
        <StatCard icon="✅" label="Aktivne kompanije" value={stats.activeCompanies} />
        <StatCard icon="✅" label="Aktivni proizvodi" value={stats.activeProducts} />
      </section>

      {/* Status Breakdown Table */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Status po kategorijama</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Platforme</th>
                <th className="px-4 py-3 font-medium text-center">Organizacije</th>
                <th className="px-4 py-3 font-medium text-center">Kompanije</th>
                <th className="px-4 py-3 font-medium text-center">Proizvodi</th>
              </tr>
            </thead>
            <tbody>
              {(['active', 'development', 'planned'] as const).map((status) => (
                <tr key={status} className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{statusBreakdown[status].platforms}</td>
                  <td className="px-4 py-3 text-center font-semibold">{statusBreakdown[status].organizations}</td>
                  <td className="px-4 py-3 text-center font-semibold">{statusBreakdown[status].companies}</td>
                  <td className="px-4 py-3 text-center font-semibold">{statusBreakdown[status].products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack Overview */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Najkorišćenije tehnologije</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(
            new Set([
              ...platforms.flatMap((p) => p.techStack),
              ...products.flatMap((p) => p.techStack),
            ])
          )
            .sort()
            .map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium dark:bg-zinc-800"
              >
                {tech}
              </span>
            ))}
        </div>
      </section>
    </PageContainer>
  );
}
