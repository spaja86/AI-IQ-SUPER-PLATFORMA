import type { Metadata } from 'next';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { repositories } from '@/lib/repositories';
import { getEcosystemStats } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'Deployment Centar',
  description:
    'Deployment centar za SPAJA ekosistem — Vercel, CDN, Edge caching i status svih platformi.',
};

export default function DeployPage() {
  const stats = getEcosystemStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/10 px-4 py-1.5 text-sm font-medium text-[#2563eb]">
          ▲ Deployment Centar
        </span>
        <h1 className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#06b6d4] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Deployment Centar
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Centralizovani pregled deployment statusa svih platformi u SPAJA
          ekosistemu — Vercel, CDN distribucija i Edge caching.
        </p>
      </section>

      {/* Deployment Info */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Infrastruktura
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl">▲</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Vercel</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Sve platforme su deployovane na Vercel — automatski deploy iz GitHub
              repozitorijuma sa zero-downtime.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl">🌐</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Global CDN</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Globalna distribucija sadržaja preko Vercel Edge mreže za minimalnu
              latenciju svuda u svetu.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-3xl">⚡</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Edge Caching</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Inteligentno keširanje na Edge lokacijama za blazing-fast učitavanje
              stranica širom sveta.
            </p>
          </div>
        </div>
      </section>

      {/* Deployment Status */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Status Repozitorijuma
        </h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="divide-y divide-white/5">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between bg-white/5 px-6 py-4 transition-colors hover:bg-white/[0.07]"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      {repo.name}
                    </h3>
                    <StatusBadge status={repo.status} />
                  </div>
                  <p className="mt-1 block text-xs text-zinc-500 truncate max-w-md">
                    {repo.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="text-xs text-zinc-500">{repo.language}</span>
                  )}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#7c3aed] transition-colors hover:text-[#2563eb]"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Tehnološki Stek
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {stats.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#2563eb]/20 bg-[#2563eb]/10 px-3 py-1.5 text-xs font-medium text-[#2563eb]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Brzi Linkovi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'AI IQ World Bank', href: '/banka', icon: '🏦' },
            { name: 'AI IQ Menjačnica', href: '/menjacnica', icon: '💱' },
            { name: 'IO OpenUI AO', href: '/ai-platforma', icon: '🤖' },
            { name: 'Kompanija SPAJA', href: '/kompanija', icon: '🏢' },
            { name: 'Omega AI', href: '/omega-ai', icon: '♾️' },
            { name: 'Ekosistem', href: '/ekosistem', icon: '🗺️' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm font-semibold text-white">{link.name}</span>
              <span className="ml-auto text-xs text-[#7c3aed]">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
