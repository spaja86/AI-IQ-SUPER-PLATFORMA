import type { Metadata } from 'next';
import { organizations } from '@/lib/organizations';
import { PageContainer, SectionHeader, EntityCard } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Organizacije',
  description: 'Organizaciona struktura Digitalne Industrije',
};

const typeLabels: Record<string, { label: string; icon: string }> = {
  division: { label: 'Divizije', icon: '🏢' },
  department: { label: 'Departmani', icon: '🏬' },
  team: { label: 'Timovi', icon: '👥' },
  unit: { label: 'Jedinice', icon: '📋' },
  lab: { label: 'Laboratorije', icon: '🔬' },
  foundation: { label: 'Fondacije', icon: '🤝' },
};

export default function OrganizacijePage() {
  const types = Object.entries(typeLabels).filter(([key]) =>
    organizations.some((o) => o.type === key)
  );

  return (
    <PageContainer>
      <SectionHeader
        icon="🏢"
        title="Organizacije"
        subtitle={`${organizations.length} organizacionih jedinica u ekosistemu`}
      />

      {/* Org Hierarchy */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-white">Organizaciona hijerarhija</h2>
        <div className="spaja-card p-6">
          {organizations
            .filter((o) => !o.parentId)
            .map((root) => (
              <div key={root.id} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span>{root.icon}</span> {root.name}
                </div>
                <div className="ml-8 mt-2 space-y-2 border-l-2 border-slate-700 pl-4">
                  {organizations
                    .filter((o) => o.parentId === root.id)
                    .map((child) => (
                      <div key={child.id}>
                        <div className="flex items-center gap-2 font-medium">
                          <span>{child.icon}</span> {child.name}
                          <span className="text-xs text-[var(--text-muted)]">({typeLabels[child.type]?.label})</span>
                        </div>
                        <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-800 pl-4">
                          {organizations
                            .filter((o) => o.parentId === child.id)
                            .map((grandchild) => (
                              <div key={grandchild.id} className="flex items-center gap-2 text-sm">
                                <span>{grandchild.icon}</span> {grandchild.name}
                                <span className="text-xs text-[var(--text-muted)]">({typeLabels[grandchild.type]?.label})</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* By Type */}
      {types.map(([key, info]) => {
        const typeOrgs = organizations.filter((o) => o.type === key);
        if (typeOrgs.length === 0) return null;
        return (
          <section key={key} className="mb-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <span>{info.icon}</span> {info.label}
              </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typeOrgs.map((org) => (
                <EntityCard
                  key={org.id}
                  icon={org.icon}
                  name={org.name}
                  description={org.description}
                  status={org.status}
                  tags={org.capabilities}
                >
                    <div className="mt-3 text-xs text-[var(--text-muted)]">
                      <p><span className="font-medium">Misija:</span> {org.mission}</p>
                    {org.platformIds.length > 0 && (
                      <p className="mt-1"><span className="font-medium">Platforme:</span> {org.platformIds.length} povezanih</p>
                    )}
                  </div>
                </EntityCard>
              ))}
            </div>
          </section>
        );
      })}
    </PageContainer>
  );
}
