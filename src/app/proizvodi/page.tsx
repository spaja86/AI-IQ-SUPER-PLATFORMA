import type { Metadata } from 'next';
import { products, productCategories } from '@/lib/products';
import { PageContainer, SectionHeader, EntityCard } from '@/components/ui';
import { BASE_URL, KOMPANIJA } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('IT Proizvodi')}&description=${encodeURIComponent('IT proizvodi i alati ekosistema Digitalne Industrije')}`;

export const metadata: Metadata = {
  title: 'Proizvodi',
  description: 'IT proizvodi i alati ekosistema Digitalne Industrije',
  openGraph: {
    title: 'Proizvodi — AI IQ SUPER PLATFORMA',
    description: 'IT proizvodi i alati ekosistema Digitalne Industrije',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'IT Proizvodi — Digitalna Industrija' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proizvodi — AI IQ SUPER PLATFORMA',
    description: 'IT proizvodi i alati ekosistema Digitalne Industrije',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'IT Proizvodi — Digitalna Industrija' }],
  },
};

function ProizvodiJsonLd() {
  const jsonLdProducts = products.slice(0, 10).map((product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Organization', name: KOMPANIJA },
    category: product.category,
  }));

  return (
    <>
      {jsonLdProducts.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}

export default function ProizvodiPage() {
  const categories = Object.entries(productCategories).filter(([key]) =>
    products.some((p) => p.category === key)
  );

  return (
    <PageContainer>
      <ProizvodiJsonLd />
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
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <span>{cat.icon}</span> {cat.label}
                <span className="text-sm font-normal text-[var(--text-muted)]">
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
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <span>v{product.version}</span>
                        {product.platformId && (
                          <span className="rounded border border-slate-700/50 bg-slate-900/70 px-1.5 py-0.5 text-slate-200">
                            {product.platformId}
                          </span>
                        )}
                    </div>
                    {product.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.features.map((f: string) => (
                          <span
                            key={f}
                            className="rounded border border-purple-800/40 bg-purple-900/25 px-1.5 py-0.5 text-xs text-purple-300"
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
