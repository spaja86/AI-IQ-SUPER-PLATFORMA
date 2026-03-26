import type { Metadata } from 'next';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'IO OpenUI AO — AI Platforma',
  description:
    'WebRTC + OpenAI Realtime API — glasovni razgovor sa AI u realnom vremenu. Profesionalna platforma za saradnju.',
};

export default function AIPlatformaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
          🤖 AI Real-time Platforma
        </span>
        <h1 className="bg-gradient-to-r from-cyan-400 via-[#2563eb] to-[#7c3aed] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          IO OpenUI AO
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          WebRTC + OpenAI Realtime API — glasovni razgovor sa AI u realnom vremenu.
          Profesionalna platforma za saradnju, igrice i komunikaciju.
        </p>
      </section>

      {/* Mogućnosti */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Mogućnosti
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🎙️', title: 'Glasovni AI Chat', desc: 'Real-time glasovni razgovor sa AI asistentom koristeći WebRTC i OpenAI Realtime API.' },
            { icon: '📡', title: 'WebRTC Konekcija', desc: 'Peer-to-peer konekcija za minimalnu latenciju. Glasovni chat bez posrednika.' },
            { icon: '🔑', title: 'Efemerni API Ključevi', desc: 'Sigurna autentifikacija sa efemernim API ključevima — bez izlaganja kredencijala klijentu.' },
            { icon: '💬', title: 'Socket.IO Chat', desc: 'Real-time tekstualni chat za timsku saradnju i profesionalnu komunikaciju.' },
            { icon: '🎮', title: 'Igrice & Zabava', desc: 'Integrisane igrice za timski rad i zabavu — sve u jednoj platformi.' },
            { icon: '🔒', title: 'Sigurnost', desc: 'End-to-end enkripcija svih komunikacija. Bezbedna platforma za poslovnu i ličnu upotrebu.' },
          ].map((f) => (
            <Card key={f.title} icon={f.icon} title={f.title} description={f.desc} />
          ))}
        </div>
      </section>

      {/* Status platforme */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Status Platforme
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: 'WebRTC', status: 'Online', color: 'text-emerald-400' },
              { name: 'Socket.IO', status: 'Online', color: 'text-emerald-400' },
              { name: 'OpenAI API', status: 'Connected', color: 'text-emerald-400' },
            ].map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4"
              >
                <span className="text-sm font-medium text-zinc-300">
                  {s.name}
                </span>
                <span className={`flex items-center gap-1.5 text-sm font-semibold ${s.color}`}>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O platformi */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          O Platformi
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Tehnologije</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Vite', 'TypeScript', 'React', 'WebRTC', 'Socket.IO', 'OpenAI API', 'Vercel'].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Deployment</h3>
            <p className="mt-2 text-sm text-zinc-400">
              IO OpenUI AO je deployovan na Vercel platformi sa globalnom CDN
              distribucijom. Unified SPAJA ecosystem frontend sa 4 modula: banka,
              menjačnica, AI i kompanija.
            </p>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-white">Kontakt</h2>
        <p className="mt-4 text-zinc-400">
          Za pitanja o AI platformi, integracijama ili saradnji:
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="mailto:spajicn@gmail.com"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            spajicn@gmail.com
          </a>
          <a
            href="https://github.com/spaja86/IO-OPENUI-AO"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            GitHub Repozitorijum →
          </a>
        </div>
      </section>
    </div>
  );
}
