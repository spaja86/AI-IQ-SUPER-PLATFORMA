import Link from 'next/link';
import { APP_VERSION, APP_NAME, KOMPANIJA, TOTAL_PAGES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA, AUTOFINISH_COUNT, OMEGA_AI_PERSONA_COUNT, TOTAL_IGRICA, SPAJA_PRO_RANGE, PROKSI_KAPACITET, MOBILNE_CENTRALE } from '@/lib/constants';
import { REFRESH_V1_SCOPE } from '@/lib/refresh-scope';

const footerNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/platforme', label: 'Platforme' },
  { href: '/eksosistzdacija', label: 'Eksosistzdacija' },
  { href: '/kompanije', label: 'Kompanije' },
  { href: '/organizacije', label: 'Organizacije' },
  { href: '/proizvodi', label: 'Proizvodi' },
  { href: '/it-proizvodi', label: 'IT Proizvodi' },
  { href: '/omega-ai', label: 'OMEGA AI' },
  { href: '/omega-evolution', label: 'OmegaEvolution' },
  { href: '/spaja-pro', label: 'SpajaPro' },
  { href: '/prompt', label: 'Prompt' },
  { href: '/akuzativ', label: 'AKUZATIV' },
  { href: '/igrice', label: 'Igrice' },
  { href: '/gejming-industrija', label: 'Gejming Industrija' },
  { href: '/dimenzije', label: 'Dimenzije' },
  { href: '/proksi', label: 'Proksi' },
  { href: '/mobilna-mreza', label: 'Mobilna Mreža' },
  { href: '/deploy', label: 'Deploy' },
  { href: '/auto-popravka', label: 'Auto-Popravka' },
];

const footerPlatformLinks = [
  { href: '/platforme', label: APP_NAME },
  { href: '/ekosistem', label: 'IO OPENUI AO' },
  { href: '/eksosistzdacija', label: 'Eksosistzdacija' },
  { href: '/banka', label: 'AI IQ World Bank' },
  { href: '/menjacnica', label: 'AI IQ Menjačnica' },
  { href: '/organizacija', label: 'SVETSKA ORGANIZACIJA' },
  { href: '/kompanija', label: KOMPANIJA },
  { href: '/login', label: 'Prijava' },
  { href: '/registracija', label: 'Registracija' },
  { href: '/zaboravljena-lozinka', label: 'Zaboravljena Lozinka' },
  { href: '/security', label: 'Bezbednost' },
];

const footerTechLinks = [
  { href: '/spaja-univerzalni-prompt', label: 'SPAJA Prompt' },
  { href: '/proksi-github-deploy', label: 'Proksi GitHub Deploy' },
  { href: '/proksi-wifi-antena', label: 'Proksi WiFi Antena' },
  { href: '/ai-platforma', label: 'AI Platforma' },
  { href: '/industrija', label: 'Industrija' },
  { href: '/spaja-generator-engine', label: 'Generator Endžin' },
  { href: '/spaja-digitalni-brouvzer', label: 'Digitalni Brouvzer' },
  { href: '/spaja-digitalni-kompjuter', label: 'Digitalni Kompjuter' },
  { href: '/spaja-render-medija', label: 'Render Medija' },
  { href: '/spaja-ultra-repl', label: 'SpajaUltra REPL' },
  { href: '/io-openui-ao-laboratorija', label: 'Laboratorija Simulacija' },
  { href: '/io-openui-ao-gaming-platforma', label: 'Gaming Platforma' },
  { href: '/io-openui-ao-analitika', label: 'Analitika' },
  { href: '/pricing', label: 'Pricing & Login' },
  { href: '/digitalni-televizor', label: 'Digitalni TV' },
  { href: '/digitalna-platforma', label: 'Digitalna Platforma' },
  { href: '/monitoring-live', label: 'Monitoring Live' },
  { href: '/ai-iq-monitoring', label: 'AI Monitoring' },
  { href: '/blog', label: 'Blog & FAQ' },
  { href: '/unit-testovi', label: 'Unit Testovi' },
  { href: '/omega-ai-suport', label: 'OMEGA AI Suport' },
  { href: '/omega-evolution', label: 'OmegaEvolution Hub' },
  { href: '/omega-projekat-plasiranje', label: 'OMEGA Plasiranje' },
  { href: '/omega-projekat-zvanicno-otvaranje', label: 'OMEGA Otvaranje' },
  { href: '/oktavne-eksponencijalne-funkcije', label: 'Oktavne Funkcije' },
  { href: '/glavni-endzin', label: 'Glavni Endžin' },
  { href: '/glavni-sistem-nabavka', label: 'Sistem Nabavka' },
  { href: '/reklame-i-partnerstva', label: 'Reklame & Partnerstva' },
  { href: '/dnevna-raspodela-zarade', label: 'Raspodela Zarade' },
  { href: '/oktavni-gpu-ram', label: 'Oktavni GPU/RAM' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/60 bg-slate-950/90 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">🏢 {KOMPANIJA}</h3>
            <p className="text-sm text-slate-300">{APP_NAME} — Digitalna Industrija sa SpajaPro Prompt Engine-om, {OMEGA_AI_PERSONA_COUNT} OMEGA AI persona, {TOTAL_IGRICA} igrica, Proksi mreža i SPAJA Mobilna Mreža.</p>
            <p className="mt-3 text-xs text-slate-400">v{APP_VERSION} • {TOTAL_PAGES} stranica • {TOTAL_ROUTES} ruta • {TOTAL_DIAGNOSTIKA} dijagnostika • Autofinish ×{AUTOFINISH_COUNT}</p>
            <p className="mt-3 text-xs text-blue-300">
              🔄 {REFRESH_V1_SCOPE.title} ({REFRESH_V1_SCOPE.version}) — sigurna isporuka novih verzija svim korisnicima
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">📊 Navigacija</h4>
            <div className="space-y-1">
              {footerNavLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-slate-300 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">🌐 Platforme</h4>
            <div className="space-y-1">
              {footerPlatformLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-slate-300 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">⚡ Tehnologije</h4>
            <div className="space-y-1">
              {footerTechLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-slate-300 transition hover:text-white">{l.label}</Link>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-400">
              <p>🧠 {OMEGA_AI_PERSONA_COUNT} OMEGA AI Persona</p>
              <p>🎮 {TOTAL_IGRICA} Igrica</p>
              <p>📡 Proksi Mreža {PROKSI_KAPACITET}</p>
              <p>📱 {MOBILNE_CENTRALE} Mobilne Centrale</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700/60 pt-6 text-center text-sm text-slate-400">
          <p>© 2024–2026 {KOMPANIJA}. Sva prava zadržana. Digitalna Industrija.</p>
          <p className="mt-1">Pokreće Vercel ▲ • SpajaPro Engine v{SPAJA_PRO_RANGE} • OMEGA AI Evolucija</p>
        </div>
      </div>
    </footer>
  );
}
