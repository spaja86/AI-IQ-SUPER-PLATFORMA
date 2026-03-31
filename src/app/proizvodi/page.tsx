import type { Metadata } from 'next';
import { products, productCategories } from '@/lib/products';
import { PageContainer, SectionHeader, EntityCard } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Proizvodi',
  description: 'IT proizvodi i alati ekosistema Digitalne Industrije',
};

export default function ProizvodiPage() {
  const categories = Object.entries(productCategories).filter(([key]) =>
    products.some((p) => p.category === key)
  );

  return (
    <PageContainer>
      <SectionHeader
        icon="📦"
        title="IT Proizvodi"
        subtitle={`${products.length} proizvoda i alata u ekosistemu`}
      />

      {categories.map(([key, cat]) => {
        const categoryProducts = products.filter((p) => p.category === key);
        if (categoryProducts.length === 0) return null;

        return (
          <section key={key} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <span>{cat.icon}</span> {cat.label}
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                ({categoryProducts.length})
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <EntityCard
                  key={product.id}
                  icon={product.icon}
                  name={product.name}
                  description={product.description}
                  status={product.status}
                  tags={product.techStack}
                >
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>v{product.version}</span>
                      {product.platformId && (
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                          {product.platformId}
                        </span>
                      )}
                    </div>
                    {product.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.features.map((f) => (
                          <span
                            key={f}
                            className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
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
