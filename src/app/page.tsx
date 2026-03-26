import Link from 'next/link';
import { digitalnaIndustrija } from '@/lib/industrija';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { PageContainer, StatCard } from '@/components/ui';

export default function HomePage() {
  const { stats } = digitalnaIndustrija;

  const quickLinks = [
    { href: '/platforme', icon: '🧩', label: 'Platforme', count: stats.totalPlatforms },
    { href: '/organizacije', icon: '🏢', label: 'Organizacije', count: stats.totalOrganizations },
    { href: '/kompanije', icon: '🏛️', label: 'Kompanije', count: stats.totalCompanies },
    { href: '/proizvodi', icon: '📦', label: 'Proizvodi', count: stats.totalProducts },
  ];

  const recentActive = [
    ...platforms.filter((p) => p.status === 'active').slice(0, 2),
    ...companies.filter((c) => c.status === 'active').slice(0, 1),
    ...organizations.filter((o) => o.status === 'active').slice(0, 2),
  ];

  return (
    <PageContainer>
      {/* Hero */}
      <section className="mb-12 text-center">
        <div className="mb-4 text-6xl">🧠</div>
        <h1 className="text-4xl font-bold sm:text-5xl">{digitalnaIndustrija.name}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {digitalnaIndustrija.description}
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          v{digitalnaIndustrija.version} — Aktivno
        </div>
      </section>

      {/* Stats Grid */}
      <section className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="🧩" label="Platforme" value={stats.totalPlatforms} />
        <StatCard icon="🏢" label="Organizacije" value={stats.totalOrganizations} />
        <StatCard icon="🏛️" label="Kompanije" value={stats.totalCompanies} />
        <StatCard icon="📦" label="Proizvodi" value={stats.totalProducts} />
      </section>

      {/* Quick Navigation */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Brza navigacija</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-6 text-center transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
            >
              <span className="text-3xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
              <span className="text-2xl font-bold">{link.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <span>🎯</span> Misija
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{digitalnaIndustrija.mission}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <span>🔭</span> Vizija
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{digitalnaIndustrija.vision}</p>
        </div>
      </section>

      {/* Recently Active */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Aktivni elementi ekosistema</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentActive.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.description.slice(0, 60)}…
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
