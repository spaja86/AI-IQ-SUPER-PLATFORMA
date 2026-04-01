'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: '🏠 Početna' },
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/industrija', label: '🏭 Industrija' },
  { href: '/platforme', label: '🌐 Platforme' },
  { href: '/it-proizvodi', label: '⚡ IT Proizvodi' },
  { href: '/banka', label: '🏦 Banka' },
  { href: '/menjacnica', label: '💱 Menjačnica' },
  { href: '/kompanija', label: '🏢 Kompanija' },
  { href: '/ai-platforma', label: '🤖 AI Platforma' },
  { href: '/organizacija', label: '🌍 Organizacija' },
  { href: '/deploy', label: '🚀 Deploy' },
  { href: '/ekosistem', label: '🔗 Ekosistem' },
  { href: '/omega-ai', label: '🧠 Omega AI' },
  { href: '/prompt', label: '📝 Prompt' },
  { href: '/spaja-pro', label: '🌟 SpajaPro' },
  { href: '/auto-popravka', label: '🔧 Auto-Popravka' },
  { href: '/proksi', label: '📡 Proksi' },
  { href: '/mobilna-mreza', label: '📱 Mobilna' },
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
        <Link href="/" className="text-lg font-bold text-white">🏢 SPAJA</Link>

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
