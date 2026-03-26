import type { Metadata } from 'next';
import StatusBadge from '@/components/StatusBadge';
import { omegaAIs, roleDisplayNames, getActiveOmegaAIs } from '@/lib/omega-ai';

export const metadata: Metadata = {
  title: 'Omega AI — 21 Persona',
  description:
    'OMEGA AI — 21 specijalizovana AI persona koja brine o svim aspektima AI IQ SUPER PLATFORMA: popravke, nadogradnje, bezbednost, dizajn, evolucija i beskonačno unapređenje.',
};

function RoleBadge({ role }: { role: string }) {
  const roleColors: Record<string, string> = {
    architecture: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    security: 'bg-red-500/10 text-red-400 border-red-500/20',
    repair: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    build: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    design: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    performance: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    strategy: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    research: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    quality: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    integration: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    analytics: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    communication: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    evolution: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
    testing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    documentation: 'bg-stone-500/10 text-stone-400 border-stone-500/20',
    finance: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    content: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    scalability: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    monitoring: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    ecosystem: 'bg-green-500/10 text-green-400 border-green-500/20',
    vision: 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${roleColors[role] ?? roleColors.vision}`}>
      {roleDisplayNames[role] ?? role}
    </span>
  );
}

export default function OmegaAIPage() {
  const activeCount = getActiveOmegaAIs().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-1.5 text-sm font-medium text-[#7c3aed]">
          ♾️ 21 OMEGA AI Persona
        </span>
        <h1 className="bg-gradient-to-r from-[#7c3aed] via-purple-400 to-pink-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          OMEGA AI Ekosistem
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          21 specijalizovana AI persona koja brine o svim aspektima platforme —
          od popravki i bezbednosti do dizajna, evolucije i beskonačnog unapređenja.
          Svaka persona je aktivna i radi non-stop na svom domenu.
        </p>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="rounded-xl border border-[#7c3aed]/20 bg-[#7c3aed]/5 px-6 py-3 text-center">
            <div className="text-3xl font-black text-[#7c3aed]">{omegaAIs.length}</div>
            <div className="text-xs text-zinc-400">Ukupno Persona</div>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-6 py-3 text-center">
            <div className="text-3xl font-black text-green-400">{activeCount}</div>
            <div className="text-xs text-zinc-400">Aktivnih</div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-6 py-3 text-center">
            <div className="text-3xl font-black text-blue-400">21</div>
            <div className="text-xs text-zinc-400">Specijalnosti</div>
          </div>
        </div>
      </section>

      {/* Opis koncepta */}
      <section className="mt-24">
        <div className="rounded-xl border border-[#7c3aed]/20 bg-gradient-to-br from-[#7c3aed]/5 to-pink-500/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Šta su OMEGA AI Persone?</h2>
          <p className="mt-4 mx-auto max-w-3xl text-zinc-400 leading-relaxed">
            Svaka OMEGA AI persona je specijalizovani AI agent koji se bavi jednim ključnim
            aspektom AI IQ SUPER PLATFORMA. Zajedno, 21 persona pokriva SVE — od arhitekture
            i bezbednosti, preko dizajna i performansi, do evolucije i vizije budućnosti.
            Rade automatski, neprekidno, tražeći maksimalna i sjajna rešenja da sve radi perfektno.
          </p>
        </div>
      </section>

      {/* All 21 Omega AI Grid */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Svih 21 OMEGA AI Persona
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {omegaAIs.map((omega, index) => (
            <div
              key={omega.id}
              className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{omega.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      <span className="text-zinc-500 text-sm font-normal">#{index + 1}</span>{' '}
                      {omega.name}
                    </h3>
                  </div>
                </div>
                <StatusBadge status={omega.status} />
              </div>

              {/* Role */}
              <div className="mt-3">
                <RoleBadge role={omega.role} />
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {omega.descriptionSr}
              </p>

              {/* Responsibilities */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {omega.responsibilities.map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500 transition-colors group-hover:bg-[#7c3aed]/10 group-hover:text-[#7c3aed]"
                  >
                    {r}
                  </span>
                ))}
              </div>
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
                21 AI persona radi non-stop — svaki dan platforma je bolja nego
                prethodni. Nema finalne verzije.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl">🎯</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Specijalizovana Briga
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Svaka persona je fokusirana na jedan domen — od bezbednosti do
                dizajna — za maksimalnu efikasnost.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl">♾️</div>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Savršenstvo kao Putovanje
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Nema granica — 21 persona teži beskonačnom unapređenju, jer
                savršenstvo je putovanje, ne destinacija.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Popravka Integration */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          🔧 Integracija sa Auto-Popravkom
        </h2>
        <div className="rounded-xl border border-[#7c3aed]/20 bg-gradient-to-br from-[#7c3aed]/5 to-blue-500/5 p-8">
          <p className="text-center text-zinc-400 leading-relaxed">
            Svih 21 OMEGA AI persona su integrisane sa Auto-Popravka sistemom.
            Lekar dijagnostikuje probleme, Graditelj popravlja build, Čuvar štiti od napada,
            Dizajner ulepšava interfejs, a Evolver pokreće beskonačnu evoluciju — sve automatski.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: '🩺', label: 'Dijagnostika', desc: 'OMEGA AI Lekar skenira sve' },
              { icon: '🔨', label: 'Popravke', desc: 'OMEGA AI Graditelj popravlja' },
              { icon: '🧬', label: 'Evolucija', desc: 'OMEGA AI Evolver unapređuje' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl">{item.icon}</div>
                <div className="mt-2 text-sm font-semibold text-white">{item.label}</div>
                <div className="mt-1 text-xs text-zinc-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
