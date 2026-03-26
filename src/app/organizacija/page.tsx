import type { Metadata } from 'next';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'SVETSKA ORGANIZACIJA',
  description:
    'SVETSKA ORGANIZACIJA za dobrobit čovečanstva — globalna organizacija za humanitarne ciljeve, edukaciju, zdravstvo i tehnologiju.',
};

export default function OrganizacijaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
          🌍 Za dobrobit čovečanstva
        </span>
        <h1 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          SVETSKA ORGANIZACIJA
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Globalna organizacija posvećena dobrobiti čovečanstva — edukacija,
          zdravstvo, životna sredina i tehnologija za sve ljude sveta.
        </p>
      </section>

      {/* Misija */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Naša Misija
        </h2>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-8 text-center">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-300">
            Svetska Organizacija za dobrobit čovečanstva teži da stvori svet u
            kome svaki čovek ima pristup kvalitetnom obrazovanju, zdravstvenoj
            zaštiti i modernoj tehnologiji. Verujemo da tehnologija treba da služi
            ljudima — a ne obrnuto.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Jednakost', 'Edukacija', 'Zdravlje', 'Tehnologija', 'Mir'].map((v) => (
              <span
                key={v}
                className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Oblasti delovanja */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Oblasti Delovanja
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            icon="📚"
            title="Edukacija"
            description="Besplatni edukativni programi i kursevi za sve uzraste. Pristup znanju bez barijera — tehnološka pismenost za svakoga."
          />
          <Card
            icon="🏥"
            title="Zdravstvo"
            description="Inicijative za pristupačnu zdravstvenu zaštitu. AI dijagnostika, telemedicina i podrška zdravstvenim sistemima širom sveta."
          />
          <Card
            icon="🌱"
            title="Životna Sredina"
            description="Projekti za zaštitu životne sredine i održivi razvoj. Zelena tehnologija i obnovljivi izvori energije."
          />
          <Card
            icon="💻"
            title="Tehnologija"
            description="Demokratizacija pristupa tehnologiji. Open-source inicijative, AI za sve i digitalna inkluzija."
          />
        </div>
      </section>

      {/* Vizija budućnosti */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Vizija Budućnosti
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="mx-auto max-w-3xl text-zinc-400 leading-relaxed">
            Do 2030. godine, Svetska Organizacija planira da pokrene globalnu
            mrežu edukativnih centara, uspostavi AI zdravstvene inicijative u 50+
            zemalja i demokratizuje pristup naprednoj tehnologiji za milione ljudi.
            Kroz SPAJA ekosistem, svaka platforma doprinosi ovoj misiji — od banke
            koja pruža finansijsku inkluziju, do AI platforme koja demokratizuje
            pristup veštačkoj inteligenciji.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { value: '50+', label: 'Ciljnih zemalja' },
              { value: '1M+', label: 'Ljudi kojima pomažemo' },
              { value: '2030', label: 'Ciljna godina' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/5 bg-white/5 p-4">
                <div className="text-2xl font-bold text-emerald-400">{s.value}</div>
                <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
