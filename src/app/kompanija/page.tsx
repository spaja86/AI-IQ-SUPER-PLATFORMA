import type { Metadata } from 'next';
import Card from '@/components/Card';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Kompanija SPAJA',
  description:
    'Profesionalna IT kompanija koja gradi budućnost — web razvoj, AI integracije, cloud arhitektura i poslovne aplikacije.',
};

const technologies = [
  'Next.js', 'TypeScript', 'React', 'Node.js', 'Python',
  'Tailwind CSS', 'Vercel', 'OpenAI',
];

export default function KompanijaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563eb]/30 bg-[#2563eb]/10 px-4 py-1.5 text-sm font-medium text-[#2563eb]">
          🏢 IT Kompanija
        </span>
        <h1 className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#06b6d4] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Kompanija SPAJA
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Profesionalna IT kompanija koja gradi budućnost. Web razvoj, AI
          integracije, cloud arhitektura i poslovne aplikacije.
        </p>
      </section>

      {/* O nama */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">O Nama</h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="mx-auto max-w-3xl text-zinc-400 leading-relaxed">
            Kompanija SPAJA je profesionalna IT kompanija specijalizovana za razvoj
            modernih web aplikacija, AI integracija i cloud rešenja. Gradimo
            budućnost digitalne industrije — od svetske banke i menjačnice do
            revolucionarnog Omega AI koncepta. Naš cilj je da svaku ideju
            transformišemo u profesionalan digitalni proizvod.
          </p>
        </div>
      </section>

      {/* Usluge */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Usluge</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🌐', title: 'Web Razvoj', desc: 'Full-stack web aplikacije sa Next.js, React i TypeScript. Responsive i optimizovano za sve uređaje.' },
            { icon: '🤖', title: 'AI Integracije', desc: 'Integracija OpenAI, WebRTC i drugih AI servisa u vaše poslovne aplikacije.' },
            { icon: '☁️', title: 'Cloud Arhitektura', desc: 'Vercel, AWS i cloud infrastruktura za skalabilnost i visoke performanse.' },
            { icon: '💼', title: 'Poslovne Aplikacije', desc: 'Custom softver za vaše poslovne potrebe — CRM, ERP, dashboard sistemi.' },
            { icon: '📋', title: 'IT Konsalting', desc: 'Strateški IT konsalting za optimizaciju vaših digitalnih procesa i infrastrukture.' },
            { icon: '⚙️', title: 'DevOps Usluge', desc: 'CI/CD pipeline, GitHub Actions, monitoring, automatizacija i deployment.' },
          ].map((s) => (
            <Card key={s.title} icon={s.icon} title={s.title} description={s.desc} />
          ))}
        </div>
      </section>

      {/* Tehnologije */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Tehnologije
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-2 text-sm font-semibold text-[#7c3aed]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Naši Proizvodi */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Naši Proizvodi
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#7c3aed]/40 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{product.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{product.category}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                {product.descriptionSr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tim i Kontakt */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-white">Tim i Kontakt</h2>
        <p className="mt-4 text-zinc-400">
          Kompanija SPAJA — vođena vizijom, pokretnuta tehnologijom.
        </p>
        <p className="mt-2 text-zinc-500">Owner: Nikola Spajić</p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="mailto:spajicn@gmail.com"
            className="text-[#2563eb] transition-colors hover:text-[#7c3aed]"
          >
            spajicn@gmail.com
          </a>
          <a
            href="https://github.com/spaja86"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] transition-colors hover:text-[#7c3aed]"
          >
            GitHub — spaja86 →
          </a>
        </div>
      </section>
    </div>
  );
}
