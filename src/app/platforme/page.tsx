import type { Metadata } from 'next';
import { platforms, platformCategories } from '@/lib/platforms';
import { PageContainer, SectionHeader, EntityCard } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Platforme',
  description: 'Sve platforme u ekosistemu Digitalne Industrije',
};

export default function PlatformePage() {
  const categories = Object.entries(platformCategories).filter(([key]) =>
    platforms.some((p) => p.category === key)
  );

  return (
    <PageContainer>
      <SectionHeader
        icon="🧩"
        title="Platforme"
        subtitle={`${platforms.length} platformi u ekosistemu Digitalne Industrije`}
      />

      {categories.map(([key, cat]) => {
        const categoryPlatforms = platforms.filter((p) => p.category === key);
        if (categoryPlatforms.length === 0) return null;

        return (
          <section key={key} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <span>{cat.icon}</span> {cat.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPlatforms.map((platform) => (
                <EntityCard
                  key={platform.id}
                  icon={platform.icon}
                  name={platform.name}
                  description={platform.description}
                  status={platform.status}
                  tags={platform.techStack}
                >
                  {platform.features.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Funkcionalnosti:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {platform.features.map((f) => (
                          <span
                            key={f}
                            className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {platform.deploy && (
                    <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      Deploy: <span className="font-medium">{platform.deploy.status}</span>
                      {platform.deploy.domain && (
                        <> — <span className="font-mono">{platform.deploy.domain}</span></>
                      )}
                    </div>
                  )}
                </EntityCard>
              ))}
            </div>
          </section>
        );
      })}
    </PageContainer>
  );
}
