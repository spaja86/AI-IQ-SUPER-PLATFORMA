import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/Card';
import { organizations } from '@/lib/organizations';
import { getEcosystemStats } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
  description:
    'Jedinstveni digitalni ekosistem koji spaja banku, menjačnicu, AI platformu, IT kompaniju i Omega AI. Kompanija SPAJA — Digitalna Industrija.',
};

export default function HomePage() {
  const stats = getEcosystemStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-1.5 text-sm font-medium text-[#7c3aed]">
          🌍 SPAJA Ekosistem v4.0
        </span>

        <h1 className="bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          AI IQ SUPER PLATFORMA
        </h1>

        <p className="mt-4 text-xl font-medium text-zinc-300 sm:text-2xl">
          Kompanija SPAJA — Digitalna Industrija
        </p>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
          Jedinstveni digitalni ekosistem koji spaja svetsku banku, menjačnicu sa
          1000+ kriptovaluta, AI real-time platformu, IT kompaniju i revolucionarni
          Omega AI koncept — sve na jednom mestu.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Otvori Dashboard
          </Link>
          <Link
            href="/ekosistem"
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Istraži Ekosistem
          </Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Moduli Ekosistema
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card
              key={org.id}
              icon={org.icon}
              title={org.name}
              subtitle={org.type}
              description={org.descriptionSr}
              href={org.url}
            />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Ekosistem u Brojevima
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Repozitorijumi', value: stats.repositories, icon: '📦' },
            { label: 'Organizacije', value: stats.organizations, icon: '🏛️' },
            { label: 'Proizvodi', value: stats.products, icon: '🚀' },
            { label: 'Omega AI', value: stats.omegaAIs, icon: '♾️' },
            { label: 'Lansirano', value: stats.yearLaunched, icon: '📅' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div className="mt-2 text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
