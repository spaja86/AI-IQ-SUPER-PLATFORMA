import type { Metadata } from 'next';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'AI IQ Menjačnica',
  description:
    'Najbolja kripto i fiat menjačnica na svetu. Live kursevi, BUY/SELL, BTC, ETH, USDT, EUR, RSD. Fee: 2%.',
};

const currencies = [
  'BTC', 'ETH', 'USDT', 'EUR', 'RSD', 'USD', 'LTC',
];

const cryptoBadge = '1000+ kriptovaluta';

export default function MenjacnicaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
          💱 Svetska Menjačnica
        </span>
        <h1 className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          AI IQ Menjačnica
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Najbolja kripto i fiat menjačnica na svetu. Live kursevi, BUY/SELL sa
          transparentnom provizijom od 2%. Podržavamo 1000+ kriptovaluta.
        </p>
      </section>

      {/* Zašto mi */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Zašto Izabrati Nas?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '📊', title: 'Live Kursevi', desc: 'Real-time kripto cene sa CoinGecko API. Uvek tačne i ažurirane cene za sve valute.' },
            { icon: '🛡️', title: 'Sigurnost', desc: 'End-to-end enkripcija i 2FA autentifikacija. Vaša sredstva su uvek zaštićena.' },
            { icon: '💸', title: '2% Transparentan Fee', desc: 'Jasna i transparentna provizija od samo 2% za svaku transakciju. Bez skrivenih troškova.' },
            { icon: '🌐', title: 'Svetski Standard', desc: 'Globalna menjačnica sa podrškom za sve svetske valute — kripto i fiat.' },
            { icon: '🤖', title: 'AI Analiza', desc: 'AI algoritmi analiziraju tržište u realnom vremenu i daju preporuke za trading.' },
            { icon: '📱', title: 'Mobilna Aplikacija', desc: 'Trgujte sa bilo kog uređaja — optimizovano za desktop, tablet i mobilne uređaje.' },
          ].map((f) => (
            <Card key={f.title} icon={f.icon} title={f.title} description={f.desc} />
          ))}
        </div>
      </section>

      {/* Podržane valute */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Podržane Valute
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {currencies.map((c) => (
            <span
              key={c}
              className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400"
            >
              {c}
            </span>
          ))}
          <span className="rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-4 py-2 text-sm font-semibold text-[#7c3aed]">
            + {cryptoBadge}
          </span>
        </div>
      </section>

      {/* Usluge */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Usluge</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card
            icon="💹"
            title="Spot Trading"
            description="Instant kupovina i prodaja kripto i fiat valuta po tržišnoj ceni. Brzo, jednostavno i sigurno."
          />
          <Card
            icon="📉"
            title="Limit Orderi"
            description="Postavi svoju ciljnu cenu i sačekaj da tržište dođe k tebi. Automatska kupovina i prodaja."
          />
          <Card
            icon="💼"
            title="Portfolio Tracker"
            description="Prati vrednost svojih sredstava u realnom vremenu. Pregled celokupnog portfolija na jednom mestu."
          />
        </div>
      </section>

      {/* Kako funkcioniše */}
      <section className="mt-24">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Kako Funkcioniše?
        </h2>
        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">
                🟢 BUY — Kupovina
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Izaberite valutu, unesite iznos. Cena se računa live po trenutnom
                kursu + 2% provizija. Potvrdi i vaša sredstva su instant dostupna.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">
                🔴 SELL — Prodaja
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Izaberite valutu za prodaju, unesite količinu. Cena se računa live
                po trenutnom kursu — 2% provizija. Sredstva se šalju na vaš račun.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <p className="text-sm font-medium text-amber-400">
              💡 Provizija: 2% za svaku transakciju — transparentno i fer.
            </p>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-white">Kontakt</h2>
        <p className="mt-4 text-zinc-400">
          Za sva pitanja o menjačnici, podržanim valutama ili poslovnoj saradnji:
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <a
            href="mailto:spajicn@gmail.com"
            className="text-amber-400 transition-colors hover:text-amber-300"
          >
            spajicn@gmail.com
          </a>
          <a
            href="https://github.com/spaja86/Ai-Iq-Menja-nica"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 transition-colors hover:text-amber-300"
          >
            GitHub Repozitorijum →
          </a>
        </div>
      </section>
    </div>
  );
}
