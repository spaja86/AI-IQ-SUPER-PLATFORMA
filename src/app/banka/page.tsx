import type { Metadata } from 'next';
import Link from 'next/link';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'AI IQ World Bank',
  description:
    'Najbolja banka na svetu — maksimalno profesionalna. AI pametne kartice, međunarodni transferi, Omega AI tehnologija.',
};

export default function BankaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
          🏦 Svetska Banka #1
        </span>
        <h1 className="bg-gradient-to-r from-emerald-400 via-[#2563eb] to-[#7c3aed] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          AI IQ World Bank
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Najbolja banka na svetu — maksimalno profesionalna, saradnju ima sa svim
          bankama sveta. Pokretana revolucionarnom Omega AI tehnologijom.
        </p>
      </section>

      {/* O nama */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">O Nama</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card
            icon="🎯"
            title="Misija"
            description="Omogućiti svakom čoveku na planeti pristup modernim bankarskim uslugama uz AI sigurnost i transparentnost."
          />
          <Card
            icon="🔭"
            title="Vizija"
            description="Postati banka broj jedan na svetu koja spaja tradicionalno bankarstvo sa najnovijim AI tehnologijama."
          />
          <Card
            icon="💎"
            title="Vrednosti"
            description="Transparentnost, sigurnost, inovacija, profesionalnost i jednakost — za sve ljude sveta."
          />
        </div>
      </section>

      {/* Usluge */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Usluge</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '💳', title: 'AI Pametne Kartice', desc: 'Debitne i kreditne kartice sa AI zaštitom od prevara u realnom vremenu. Kontaktless & NFC plaćanje.' },
            { icon: '🌐', title: 'Međunarodni Transferi', desc: 'Instant SWIFT i SEPA transferi sa najnižim provizijama na svetu. 150+ zemalja podrška.' },
            { icon: '📈', title: 'AI Investicioni Portfolio', desc: 'Automatizovano upravljanje investicijama kroz napredne AI algoritme i mašinsko učenje.' },
            { icon: '🏠', title: 'Hipotekarni Krediti', desc: 'Najkonkurentnije kamatne stope za stambene i poslovne kredite sa AI procenom rizika.' },
            { icon: '💰', title: 'Štedni Računi', desc: 'Premium štedni računi sa visokim kamatama i fleksibilnim uslovima. AI optimizacija prinosa.' },
            { icon: '🔐', title: 'Kriptografska Sigurnost', desc: 'End-to-end enkripcija, 2FA autentifikacija i AI fraud detection sa 99.99% preciznosti.' },
          ].map((s) => (
            <Card key={s.title} icon={s.icon} title={s.title} description={s.desc} />
          ))}
        </div>
      </section>

      {/* Omega AI Tehnologija */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Tehnologija — Omega AI
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card
            icon="♾️"
            title="Omega AI Core"
            description="Beskonačno evolvuirajući AI koji neprekidno unapređuje bankarsko iskustvo korisnika."
          />
          <Card
            icon="⚡"
            title="Real-time Procesiranje"
            description="Obrada miliona transakcija u sekundi sa sub-milisekundnom latencijom."
          />
          <Card
            icon="🛡️"
            title="Fraud Detection 99.99%"
            description="AI detektuje sumnjive transakcije sa 99.99% preciznosti — zaštita u realnom vremenu."
          />
        </div>
      </section>

      {/* Smederevo Ekspanzija */}
      <section className="mt-24">
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#7c3aed]/10 to-[#2563eb]/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            🏗️ Smederevo Ekspanzija
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-zinc-400">
            AI IQ World Bank širi operacije u Smederevu — lokalna filijala koja
            spaja globalnu AI tehnologiju sa lokalnim potrebama. Smederevo postaje
            regionalni centar digitalne finansije.
          </p>
        </div>
      </section>

      {/* Partneri */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Partneri</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: '🏛️', name: 'Centralne Banke', desc: 'Saradnja sa centralnim bankama širom sveta za regulatornu usklađenost.' },
            { icon: '🌐', name: 'SWIFT / SEPA', desc: 'Integracija sa globalnim platnim mrežama za instant međunarodne transfere.' },
            { icon: '🤝', name: 'SPAJA Ekosistem', desc: 'Deo jedinstvenog SPAJA ekosistema — povezani sa menjačnicom, AI platformom i kompanijom.' },
          ].map((p) => (
            <Card key={p.name} icon={p.icon} title={p.name} description={p.desc} />
          ))}
        </div>
      </section>

      {/* Statistike */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Statistike
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '2M+', label: 'Korisnika', icon: '👥' },
            { value: '150+', label: 'Zemalja', icon: '🌍' },
            { value: '€50B+', label: 'Godišnji Obrt', icon: '💶' },
            { value: '99.99%', label: 'Uptime', icon: '⚡' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div className="mt-2 text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Finansijski Asistent */}
      <section className="mt-24">
        <div className="rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            🤖 AI Finansijski Asistent
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-zinc-400">
            Vaš lični finansijski savetnik dostupan 24/7. Powered by OpenAI —
            postavite pitanje o kreditima, investicijama ili štednji.
          </p>
          <Link
            href="/ai-platforma"
            className="mt-6 inline-block rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Otvori AI Platformu →
          </Link>
        </div>
      </section>

      {/* Kontakt */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-white">Kontakt</h2>
        <p className="mt-4 text-zinc-400">
          Za sve informacije o bankarskim uslugama, otvaranju računa ili saradnji:
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="mailto:spajicn@gmail.com"
            className="text-[#7c3aed] transition-colors hover:text-[#2563eb]"
          >
            spajicn@gmail.com
          </a>
          <a
            href="https://github.com/spaja86/Ai-Iq-World-Bank"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7c3aed] transition-colors hover:text-[#2563eb]"
          >
            GitHub Repozitorijum →
          </a>
        </div>
      </section>
    </div>
  );
}
