'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dohvatiSesiju, obrisiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';

const navLinks = [
  { href: '/', label: '🏠 Početna' },
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/industrija', label: '🏭 Industrija' },
  { href: '/platforme', label: '🌐 Platforme' },
  { href: '/kompanije', label: '🏛️ Kompanije' },
  { href: '/organizacije', label: '🏢 Organizacije' },
  { href: '/proizvodi', label: '📦 Proizvodi' },
  { href: '/it-proizvodi', label: '⚡ IT Proizvodi' },
  { href: '/omega-ai', label: '🧠 OMEGA AI' },
  { href: '/spaja-pro', label: '🌟 SpajaPro' },
  { href: '/prompt', label: '📝 Prompt' },
  { href: '/igrice', label: '🎮 Igrice' },
  { href: '/dimenzije', label: '🌀 Dimenzije' },
  { href: '/proksi', label: '📡 Proksi' },
  { href: '/mobilna-mreza', label: '📱 Mobilna' },
  { href: '/ekosistem', label: '🔗 Ekosistem' },
  { href: '/deploy', label: '🚀 Deploy' },
  { href: '/auto-popravka', label: '🔧 Auto-Popravka' },
  { href: '/ai-platforma', label: '🤖 AI Platforma' },
  { href: '/banka', label: '🏦 Banka' },
  { href: '/menjacnica', label: '💱 Menjačnica' },
  { href: '/kompanija', label: '🏗️ Kompanija' },
  { href: '/organizacija', label: '🌍 Organizacija' },
  { href: '/proksi-github-deploy', label: '🐙 GitHub Deploy' },
  { href: '/proksi-wifi-antena', label: '📶 WiFi Antena' },
  { href: '/spaja-univerzalni-prompt', label: '🎯 SPAJA Prompt' },
  { href: '/spaja-generator-engine', label: '⚙️ Generator Endžin' },
  { href: '/spaja-digitalni-brouvzer', label: '🌐 Digitalni Brouvzer' },
  { href: '/spaja-render-medija', label: '🎬 Render Medija' },
  { href: '/io-openui-ao-laboratorija', label: '🔬 Laboratorija' },
  { href: '/io-openui-ao-gaming-platforma', label: '🎮 Gaming Platforma' },
  { href: '/pricing', label: '💰 Pricing' },
  { href: '/digitalni-televizor', label: '📺 Digitalni TV' },
  { href: '/monitoring-live', label: '🎥 Monitoring Live' },
  { href: '/ai-iq-monitoring', label: '🔍 AI Monitoring' },
  { href: '/blog', label: '📝 Blog & FAQ' },
  { href: '/unit-testovi', label: '🧪 Unit Testovi' },
  { href: '/omega-ai-suport', label: '📞 OMEGA Suport' },
  { href: '/omega-projekat-plasiranje', label: '🚀 OMEGA Plasiranje' },
  { href: '/digitalna-platforma', label: '🌐 Digitalna Platforma' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sesija, setSesija] = useState<OmegaSesija | null>(null);

  useEffect(() => {
    setSesija(dohvatiSesiju());
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sesija?.token ? { Authorization: `Bearer ${sesija.token}` } : {}),
        },
      });
    } catch {
      // Nastavi sa brisanjem lokalne sesije cak i ako API poziv ne uspe
    }
    obrisiSesiju();
    setSesija(null);
    window.location.href = '/login';
  }

  const isLoggedIn = !!sesija;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur" aria-label="Glavna navigacija">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-blue-600 focus:p-2 focus:text-white">
        Preskoči na sadržaj
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/user-attachments/assets/157afec1-4d04-4282-8303-e6a736a89dd3"
            alt="Digitalna Industrija logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-cover"
          />
          SPAJA
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                pathname === link.href
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth dugmad */}
          <div className="ml-2 flex items-center gap-2 border-l border-gray-700 pl-3">
            {isLoggedIn ? (
              <>
                <span className="text-xs text-gray-500" title={sesija?.email}>
                  {sesija?.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-400"
                >
                  Odjavi se
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === '/login'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-blue-400 hover:bg-blue-600/10 hover:text-blue-300'
                  }`}
                >
                  🔐 Prijava
                </Link>
                <Link
                  href="/registracija"
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-500"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile auth indicator */}
          {isLoggedIn && (
            <span className="text-xs text-green-400" title={sesija?.email}>●</span>
          )}
          <button
            className="rounded-lg p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-800 bg-gray-900 px-4 py-2 md:hidden">
          {/* Mobile auth section */}
          <div className="mb-3 border-b border-gray-800 pb-3">
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{sesija?.email}</span>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="rounded-lg border border-gray-600 px-3 py-1.5 text-xs text-gray-300 transition hover:border-red-500 hover:text-red-400"
                >
                  Odjavi se
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  🔐 Prijava
                </Link>
                <Link
                  href="/registracija"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-green-500"
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm ${
                pathname === link.href
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
