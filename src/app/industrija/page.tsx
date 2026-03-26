import type { Metadata } from 'next';
import { digitalnaIndustrija } from '@/lib/industrija';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';
import { PageContainer, SectionHeader, StatCard } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Industrija',
  description: 'O digitalnoj industriji — Kompanija SPAJA',
};

export default function IndustrijaPage() {
  const ind = digitalnaIndustrija;

  const timeline = [
    { year: '2024', event: 'Osnivanje Kompanija SPAJA', icon: '🏛️' },
    { year: '2024', event: 'Pokretanje AI-IQ SUPER PLATFORMA', icon: '🧠' },
    { year: '2024', event: 'Lansiranje IO-OPENUI-AO', icon: '🌐' },
    { year: '2025', event: 'Razvoj finansijskih platformi', icon: '💰' },
    { year: '2025', event: 'Pokretanje AI Engine i AI Lab', icon: '🤖' },
    { year: '2025', event: 'Ekspanzija na sub-kompanije', icon: '🏢' },
    { year: '2026', event: 'Platforma Skeleton v3.0 — Kompletni ekosistem', icon: '🚀' },
  ];

  return (
    <PageContainer>
      <SectionHeader
        icon="🏭"
        title="Digitalna Industrija"
        subtitle={ind.description}
      />

      {/* Identity */}
      <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">Naziv</h3>
            <p className="text-lg font-semibold">{ind.name}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">Verzija</h3>
            <p className="text-lg font-semibold">v{ind.version}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">Osnovana</h3>
            <p className="text-lg font-semibold">{ind.founded}</p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">Ukupno entiteta</h3>
            <p className="text-lg font-semibold">
              {platforms.length + organizations.length + companies.length + products.length}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <span>🎯</span> Misija
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{ind.mission}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <span>🔭</span> Vizija
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{ind.vision}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Ekosistem u brojevima</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon="🧩" label="Platforme" value={ind.stats.totalPlatforms} />
          <StatCard icon="🏢" label="Organizacije" value={ind.stats.totalOrganizations} />
          <StatCard icon="🏛️" label="Kompanije" value={ind.stats.totalCompanies} />
          <StatCard icon="📦" label="Proizvodi" value={ind.stats.totalProducts} />
        </div>
      </section>

      {/* What the Industry creates */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Šta Digitalna Industrija pravi?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🧩', title: 'Platforme', desc: 'Digitalne platforme za različite domene — finansije, AI, e-commerce, socijalne mreže.', count: platforms.length },
            { icon: '🏢', title: 'Organizacije', desc: 'Organizacione jedinice — divizije, timovi, laboratorije, fondacije.', count: organizations.length },
            { icon: '🏛️', title: 'Kompanije', desc: 'Subsidiaries, startups, joint ventures u okviru ekosistema.', count: companies.length },
            { icon: '📦', title: 'Proizvodi', desc: 'IT proizvodi i alati — bezbednost, monitoring, AI, deployment.', count: products.length },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              <p className="mt-2 text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Razvoj kroz vreme</h2>
        <div className="space-y-3">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.year}</span>
                <p className="font-medium">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
