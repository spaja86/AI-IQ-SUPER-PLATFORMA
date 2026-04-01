import type { Metadata } from 'next';
import { companies } from '@/lib/companies';
import { PageContainer, SectionHeader, EntityCard } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Kompanije',
  description: 'Kompanije u ekosistemu Digitalne Industrije',
};

const typeLabels: Record<string, { label: string; icon: string }> = {
  parent: { label: 'Matična kompanija', icon: '🏛️' },
  subsidiary: { label: 'Subsidiary kompanije', icon: '🏢' },
  'joint-venture': { label: 'Joint Ventures', icon: '🤝' },
  startup: { label: 'Startups', icon: '🚀' },
  'spin-off': { label: 'Spin-offs', icon: '🔄' },
};

export default function KompanijePage() {
  const parentCompany = companies.find((c) => c.type === 'parent');
  const subsidiaries = companies.filter((c) => c.type !== 'parent');

  return (
    <PageContainer>
      <SectionHeader
        icon="🏛️"
        title="Kompanije"
        subtitle={`${companies.length} kompanija u ekosistemu Digitalne Industrije`}
      />

      {/* Parent Company */}
      {parentCompany && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <span>🏛️</span> Matična kompanija
          </h2>
          <div className="rounded-xl border-2 border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{parentCompany.icon}</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{parentCompany.name}</h3>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">{parentCompany.description}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Industrija</p>
                    <p className="font-semibold">{parentCompany.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Platforme</p>
                    <p className="font-semibold">{parentCompany.platformIds.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Organizacije</p>
                    <p className="font-semibold">{parentCompany.organizationIds.length}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Proizvodi</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {parentCompany.products.map((p) => (
                      <span
                        key={p}
                        className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Subsidiaries & Others */}
      {Object.entries(typeLabels)
        .filter(([key]) => key !== 'parent')
        .map(([key, info]) => {
          const typeCompanies = subsidiaries.filter((c) => c.type === key);
          if (typeCompanies.length === 0) return null;
          return (
            <section key={key} className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <span>{info.icon}</span> {info.label}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {typeCompanies.map((company) => (
                  <EntityCard
                    key={company.id}
                    icon={company.icon}
                    name={company.name}
                    description={company.description}
                    status={company.status}
                    tags={company.products}
                  >
                    <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <p>
                        <span className="font-medium">Industrija:</span> {company.industry}
                      </p>
                      <p className="mt-0.5">
                        <span className="font-medium">Platforme:</span> {company.platformIds.length} |{' '}
                        <span className="font-medium">Organizacije:</span> {company.organizationIds.length}
                      </p>
                    </div>
                  </EntityCard>
                ))}
              </div>
            </section>
          );
        })}

      {/* Corporate Structure Visual */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Korporativna struktura</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          {parentCompany && (
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-zinc-300 px-6 py-3 text-lg font-bold dark:border-zinc-600">
                <span>{parentCompany.icon}</span> {parentCompany.name}
              </div>
              <div className="mx-auto h-8 w-0.5 bg-zinc-300 dark:bg-zinc-600" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subsidiaries.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-lg border border-zinc-200 px-4 py-3 text-center dark:border-zinc-700"
                  >
                    <span className="text-2xl">{sub.icon}</span>
                    <p className="mt-1 text-sm font-medium">{sub.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{sub.industry}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
