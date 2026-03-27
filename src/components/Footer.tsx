import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/platforme', label: 'Platforme' },
  { href: '/it-proizvodi', label: 'IT Proizvodi' },
  { href: '/deploy', label: 'Deploy' },
  { href: '/ekosistem', label: 'Ekosistem' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-lg font-bold text-white">🏢 Kompanija SPAJA</h3>
            <p className="text-sm text-gray-400">AI IQ SUPER PLATFORMA — Digitalna Industrija. Unified platforma za upravljanje svim AI i IT projektima.</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-white">Navigacija</h4>
            <div className="space-y-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-white">Platforme</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>AI IQ SUPER PLATFORMA</p>
              <p>IO OPENUI AO</p>
              <p>AI IQ World Bank</p>
              <p>OMEGA AI za GitHub</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>© 2024–2026 Kompanija SPAJA. Sva prava zadrzana.</p>
          <p className="mt-1">Pokrece Vercel ▲</p>
        </div>
      </div>
    </footer>
  );
}
