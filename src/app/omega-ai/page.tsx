import type { Metadata } from 'next';
import StatusBadge from '@/components/StatusBadge';
import { omegaAIs } from '@/lib/omega-ai';

export const metadata: Metadata = {
  title: 'Omega AI Ekosistem',
  description:
    'OMEGA AI — beskonačno evolvuirajuća AI koja neprekidno unapređuje tehnološke platforme. GitHub, Vercel, Google, Social.',
};

export default function OmegaAIPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-1.5 text-sm font-medium text-[#7c3aed]">
          ♾️ Beskonačna Evolucija
        </span>
        <h1 className="bg-gradient-to-r from-[#7c3aed] via-purple-400 to-pink-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          OMEGA AI Ekosistem
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Revolucionarni koncept veštačke inteligencije koja se beskonačno razvija i
          neprekidno unapređuje tehnološke platforme — evolucija bez kraja.
        </p>
      </section>

      {/* Opis koncepta */}
      <section className="mt-24">
        <div className="rounded-xl border border-[#7c3aed]/20 bg-gradient-to-br from-[#7c3aed]/5 to-pink-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Šta je Omega AI?</h2>
          <p className="mt-4 mx-auto max-w-3xl text-zinc-400 leading-relaxed">
            Omega AI je koncept veštačke inteligencije koja neprekidno evolvuira —
            nema krajnju tačku, nema limit. Svaki Omega AI je dizajniran da
            unapređuje jednu specifičnu platformu do beskonačnosti. Zamislite AI
            koji neprestano poboljšava GitHub, Vercel, Google ili društvene mreže —
            to je Omega AI.
          </p>
        </div>
      </section>

      {/* Omega AI Grid */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Omega AI Sistemi
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {omegaAIs.map((omega) => (
            <div
              key={omega.id}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{omega.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {omega.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Target: {omega.target}
                    </p>
                  </div>
                </div>
                <StatusBadge status={omega.status} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {omega.descriptionSr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vizija */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Vizija Beskonačne Evolucije
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl">🔄</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Neprekidna Evolucija
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Omega AI se neprekidno razvija — svaki dan je bolji nego prethodni.
                Nema finalne verzije.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl">🎯</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Ciljana Optimizacija
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Svaki Omega AI je fokusiran na jednu platformu — specijalizovani
                AI za maksimalnu efikasnost.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl">♾️</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Beskonačnost
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Nema granica — Omega AI teži beskonačnom unapređenju, jer
                savršenstvo je putovanje, ne destinacija.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
