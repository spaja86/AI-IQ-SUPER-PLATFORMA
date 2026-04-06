import Link from 'next/link';

const popularneStanice = [
  { href: '/dashboard', label: '📊 Dashboard', opis: 'Pregled stanja ekosistema' },
  { href: '/platforme', label: '🌐 Platforme', opis: '14 platformi u ekosistemu' },
  { href: '/omega-ai', label: '🧠 OMEGA AI', opis: '21 persona u 8 oktava' },
  { href: '/igrice', label: '🎮 Igrice', opis: '95 igrica u 18 kategorija' },
  { href: '/spaja-pro', label: '🌟 SpajaPro', opis: 'SpajaPro Engine v6-15' },
  { href: '/prompt', label: '📝 Prompt', opis: 'Prompt sistem' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 text-7xl font-bold text-blue-400">404</div>
        <h1 className="mb-2 text-3xl font-bold text-white">Stranica nije pronađena</h1>
        <p className="mb-8 text-gray-400">Stranica koju tražite ne postoji ili je premeštena.</p>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularneStanice.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-left transition hover:border-blue-500/50 hover:bg-gray-800/50"
            >
              <div className="text-sm font-medium text-white">{s.label}</div>
              <div className="mt-1 text-xs text-gray-500">{s.opis}</div>
            </Link>
          ))}
        </div>

        <Link href="/" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
          ← Nazad na početnu
        </Link>
      </div>
    </div>
  );
}
