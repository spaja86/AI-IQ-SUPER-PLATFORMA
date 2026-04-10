'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
        <div className="hidden gap-1 md:flex">
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
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-gray-400 hover:text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-800 bg-gray-900 px-4 py-2 md:hidden">
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
