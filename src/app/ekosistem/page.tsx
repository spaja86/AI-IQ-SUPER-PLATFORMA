import type { Metadata } from 'next';
import StatusBadge from '@/components/StatusBadge';
import { getRepositoriesByCategory } from '@/lib/repositories';
import { getEcosystemStats } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'Ekosistem',
  description:
    'Kompletna mapa SPAJA ekosistema — svi repozitorijumi, tehnologije i platforme na jednom mestu.',
};

const categoryLabels: Record<string, string> = {
  platform: '🏗️ Platforme',
  finance: '💰 Finansije',
  ai: '🤖 Veštačka Inteligencija',
  tools: '🔧 Alati',
  omega: '♾️ Omega AI',
  legacy: '📦 Legacy',
};

const categories = ['platform', 'finance', 'ai', 'tools', 'omega', 'legacy'] as const;

export default function EkosistemPage() {
  const stats = getEcosystemStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-1.5 text-sm font-medium text-[#7c3aed]">
          🗺️ Mapa Ekosistema
        </span>
        <h1 className="bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          SPAJA Ekosistem
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Kompletna mapa svih repozitorijuma, platformi i tehnologija u SPAJA
          ekosistemu — organizovano po kategorijama.
        </p>
      </section>

      {/* Repos by Category */}
      {categories.map((category) => {
        const repos = getRepositoriesByCategory(category);
        if (repos.length === 0) return null;

        return (
          <section key={category} className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {categoryLabels[category]}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {repo.name}
                    </h3>
                    <StatusBadge status={repo.status} />
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    {repo.description}
                  </p>

                  {repo.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {repo.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-[#7c3aed]/10 px-2 py-0.5 text-xs text-[#7c3aed]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {repo.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {repo.features.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="text-xs text-zinc-500"
                        >
                          • {f}
                        </li>
                      ))}
                      {repo.features.length > 4 && (
                        <li className="text-xs text-zinc-600">
                          + još {repo.features.length - 4}
                        </li>
                      )}
                    </ul>
                  )}

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-[#7c3aed] transition-colors hover:text-[#2563eb]"
                  >
                    GitHub →
                  </a>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Statistike */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Statistike Ekosistema
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Repozitorijumi', value: stats.repositories, icon: '📦' },
            { label: 'Aktivne platforme', value: stats.platforms, icon: '🚀' },
            { label: 'Proizvodi', value: stats.products, icon: '💡' },
            { label: 'Omega AI', value: stats.omegaAIs, icon: '♾️' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 text-2xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tehnologije */}
      <section className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Tehnologije u Ekosistemu
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {stats.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#7c3aed]/20 bg-[#7c3aed]/10 px-3 py-1.5 text-xs font-medium text-[#7c3aed]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
