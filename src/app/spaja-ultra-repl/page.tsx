import type { Metadata } from 'next';
import SpajaUltraREPL from '@/components/SpajaUltraREPL';

export const metadata: Metadata = {
  title: 'SpajaUltra REPL | Kompanija SPAJA',
  description: 'Interaktivni SpajaUltraOmegaCore REPL sa parserom, transpajlerom, runtime audit logom i sigurnim ASSERT evaluacijama.',
};

const CHEAT_SHEET = [
  'MOŽE: dozvola',
  'ŽELIM: namera',
  'DO: komanda ili ECHO tekst',
  'WAIT: milisekunde',
  'ASSERT: logički izraz',
  'PRIV: uloga',
];

export default function SpajaUltraReplPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">SpajaUltraOmegaCore REPL</h1>
          <p className="mt-2 text-gray-300">
            SpajaUltraOmegaCore je DSL za eksplicitne komande dozvola, namera i kontrolisanog izvršavanja
            kroz auditabilni runtime sloj Kompanije SPAJA.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
            {CHEAT_SHEET.map((item) => (
              <li key={item} className="rounded-lg border border-gray-800 bg-black/50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </header>

        <SpajaUltraREPL />
      </div>
    </main>
  );
}
