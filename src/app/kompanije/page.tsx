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
          <div className="spaja-card border-2 p-6">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{parentCompany.icon}</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{parentCompany.name}</h3>
                <p className="mt-1 text-[var(--text-muted)]">{parentCompany.description}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Industrija</p>
                    <p className="font-semibold text-white">{parentCompany.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Platforme</p>
                    <p className="font-semibold text-white">{parentCompany.platformIds.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Organizacije</p>
                    <p className="font-semibold text-white">{parentCompany.organizationIds.length}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-medium text-[var(--text-muted)]">Proizvodi</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {parentCompany.products.map((p: string) => (
                      <span
                        key={p}
                        className="rounded-md border border-emerald-700/40 bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-300"
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
                    <div className="mt-3 text-xs text-[var(--text-muted)]">
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
        <h2 className="mb-4 text-xl font-semibold text-white">Korporativna struktura</h2>
        <div className="spaja-card p-6">
          {parentCompany && (
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 px-6 py-3 text-lg font-bold text-white">
                <span>{parentCompany.icon}</span> {parentCompany.name}
              </div>
              <div className="mx-auto h-8 w-0.5 bg-slate-600" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subsidiaries.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-3 text-center"
                  >
                    <span className="text-2xl">{sub.icon}</span>
                    <p className="mt-1 text-sm font-medium text-white">{sub.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{sub.industry}</p>
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
