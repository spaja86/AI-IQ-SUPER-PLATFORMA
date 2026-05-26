'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { dohvatiSesiju, obrisiSesiju, type OmegaSesija } from '@/lib/auth/omega-session-client';
import { navigation } from '@/lib/navigation';
import Button, { buttonClassName } from '@/components/Button';

const navLinks = navigation.map((item) => ({
  href: item.href,
  label: `${item.icon} ${item.label}`,
}));

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const sesija = useSyncExternalStore(
    (cb) => { window.addEventListener('storage', cb); return () => window.removeEventListener('storage', cb); },
    () => dohvatiSesiju(),
    () => null as OmegaSesija | null,
  );

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
    window.location.href = '/login';
  }

  const isLoggedIn = !!sesija;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/60 bg-slate-950/90 backdrop-blur" aria-label="Glavna navigacija">
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
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:border-red-500 hover:bg-transparent hover:text-red-400"
                >
                  Odjavi se
                </Button>
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
                  className={buttonClassName({
                    variant: 'success',
                    size: 'sm',
                    className: 'border-green-600',
                  })}
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
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:bg-transparent hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </Button>
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
                <Button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  variant="ghost"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:border-red-500 hover:bg-transparent hover:text-red-400"
                >
                  Odjavi se
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClassName({
                    variant: 'primary',
                    className: 'flex-1',
                  })}
                >
                  🔐 Prijava
                </Link>
                <Link
                  href="/registracija"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClassName({
                    variant: 'success',
                    className: 'flex-1 border-green-600',
                  })}
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
