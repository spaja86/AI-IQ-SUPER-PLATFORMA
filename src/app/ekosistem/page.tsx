import type { Metadata } from 'next';
import Link from 'next/link';
import { digitalnaIndustrija } from '@/lib/industrija';
import { platforms } from '@/lib/platforms';
import { organizations } from '@/lib/organizations';
import { companies } from '@/lib/companies';
import { products } from '@/lib/products';
import { PageContainer, SectionHeader, StatusBadge } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Ekosistem',
  description: 'Celokupan pregled ekosistema Digitalne Industrije',
};

export default function EkosistemPage() {
  const all = [
    ...platforms.map((p) => ({ ...p, entityType: 'Platforma' as const })),
    ...organizations.map((o) => ({ ...o, entityType: 'Organizacija' as const })),
    ...companies.map((c) => ({ ...c, entityType: 'Kompanija' as const })),
    ...products.map((p) => ({ ...p, entityType: 'Proizvod' as const })),
  ];

  const entityTypeLinks: Record<string, string> = {
    Platforma: '/platforme',
    Organizacija: '/organizacije',
    Kompanija: '/kompanije',
    Proizvod: '/proizvodi',
  };

  const entityTypeColors: Record<string, string> = {
    Platforma: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Organizacija: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Kompanija: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Proizvod: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <PageContainer>
      <SectionHeader
        icon="🌐"
        title="Ekosistem"
        subtitle={`Kompletni pregled — ${all.length} entiteta u Digitalnoj Industriji`}
      />

      {/* Ecosystem Overview */}
      <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { type: 'Platforma', icon: '🧩', count: platforms.length, href: '/platforme' },
          { type: 'Organizacija', icon: '🏢', count: organizations.length, href: '/organizacije' },
          { type: 'Kompanija', icon: '🏛️', count: companies.length, href: '/kompanije' },
          { type: 'Proizvod', icon: '📦', count: products.length, href: '/proizvodi' },
        ].map((item) => (
          <Link
            key={item.type}
            href={item.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-center transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.type}</span>
            <span className="text-2xl font-bold">{item.count}</span>
          </Link>
        ))}
      </section>

      {/* Connection Map */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Struktura ekosistema</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-zinc-300 px-6 py-3 text-lg font-bold dark:border-zinc-600">
              🏭 {digitalnaIndustrija.name}
            </div>
            <div className="mx-auto mb-4 h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((company) => (
                <div key={company.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center justify-center gap-2 font-semibold">
                    <span>{company.icon}</span> {company.name}
                  </div>
                  <div className="mt-2 space-y-1">
                    {company.platformIds.slice(0, 3).map((pid) => {
                      const platform = platforms.find((p) => p.id === pid);
                      return platform ? (
                        <div key={pid} className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{platform.icon}</span> {platform.name}
                        </div>
                      ) : null;
                    })}
                    {company.platformIds.length > 3 && (
                      <p className="text-xs text-zinc-400">+{company.platformIds.length - 3} više</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Entity List */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Svi entiteti ({all.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 font-medium">Entitet</th>
                <th className="px-4 py-3 font-medium">Tip</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Opis</th>
              </tr>
            </thead>
            <tbody>
              {all.map((item) => (
                <tr key={`${item.entityType}-${item.id}`} className="border-b border-zinc-100 dark:border-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={entityTypeLinks[item.entityType]}
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${entityTypeColors[item.entityType]}`}
                    >
                      {item.entityType}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.description.length > 80 ? item.description.slice(0, 80) + '…' : item.description}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageContainer>
  );
}
