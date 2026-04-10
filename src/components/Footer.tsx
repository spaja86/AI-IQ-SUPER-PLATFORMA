import Link from 'next/link';
import { APP_VERSION, TOTAL_PAGES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA, AUTOFINISH_COUNT } from '@/lib/constants';

const footerNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/platforme', label: 'Platforme' },
  { href: '/it-proizvodi', label: 'IT Proizvodi' },
  { href: '/omega-ai', label: 'OMEGA AI' },
  { href: '/spaja-pro', label: 'SpajaPro' },
  { href: '/prompt', label: 'Prompt' },
  { href: '/igrice', label: 'Igrice' },
  { href: '/dimenzije', label: 'Dimenzije' },
  { href: '/proksi', label: 'Proksi' },
  { href: '/mobilna-mreza', label: 'Mobilna Mreža' },
  { href: '/deploy', label: 'Deploy' },
  { href: '/auto-popravka', label: 'Auto-Popravka' },
];

const footerPlatformLinks = [
  { href: '/platforme', label: 'AI IQ SUPER PLATFORMA' },
  { href: '/ekosistem', label: 'IO OPENUI AO' },
  { href: '/banka', label: 'AI IQ World Bank' },
  { href: '/menjacnica', label: 'AI IQ Menjačnica' },
  { href: '/organizacija', label: 'SVETSKA ORGANIZACIJA' },
  { href: '/kompanija', label: 'Kompanija SPAJA' },
];

const footerTechLinks = [
  { href: '/spaja-univerzalni-prompt', label: 'SPAJA Prompt' },
  { href: '/proksi-github-deploy', label: 'Proksi GitHub Deploy' },
  { href: '/proksi-wifi-antena', label: 'Proksi WiFi Antena' },
  { href: '/ai-platforma', label: 'AI Platforma' },
  { href: '/industrija', label: 'Industrija' },
  { href: '/spaja-generator-engine', label: 'Generator Endžin' },
  { href: '/spaja-digitalni-brouvzer', label: 'Digitalni Brouvzer' },
  { href: '/spaja-render-medija', label: 'Render Medija' },
  { href: '/io-openui-ao-laboratorija', label: 'Laboratorija Simulacija' },
  { href: '/io-openui-ao-gaming-platforma', label: 'Gaming Platforma' },
  { href: '/pricing', label: 'Pricing & Login' },
  { href: '/omega-ai-suport', label: 'OMEGA AI Suport' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">🏢 Kompanija SPAJA</h3>
            <p className="text-sm text-gray-400">AI IQ SUPER PLATFORMA — Digitalna Industrija sa SpajaPro Prompt Engine-om, 21 OMEGA AI persona, 95 igrica, Proksi mreža i SPAJA Mobilna Mreža.</p>
            <p className="mt-3 text-xs text-gray-500">v{APP_VERSION} • {TOTAL_PAGES} stranica • {TOTAL_ROUTES} ruta • {TOTAL_DIAGNOSTIKA} dijagnostika • Autofinish ×{AUTOFINISH_COUNT}</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">📊 Navigacija</h4>
            <div className="space-y-1">
              {footerNavLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">🌐 Platforme</h4>
            <div className="space-y-1">
              {footerPlatformLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">⚡ Tehnologije</h4>
            <div className="space-y-1">
              {footerTechLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>🧠 21 OMEGA AI Persona</p>
              <p>🎮 95 Igrica</p>
              <p>📡 Proksi Mreža 10²²⁸ TB</p>
              <p>📱 4 Mobilne Centrale</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>© 2024–2026 Kompanija SPAJA. Sva prava zadržana. Digitalna Industrija.</p>
          <p className="mt-1">Pokreće Vercel ▲ • SpajaPro Engine v6-15 • OMEGA AI Evolucija</p>
        </div>
      </div>
    </footer>
  );
}
