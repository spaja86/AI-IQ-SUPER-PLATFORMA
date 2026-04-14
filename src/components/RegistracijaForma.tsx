'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Registracija Forma
// Kompanija SPAJA — Digitalna Industrija
// Forma za registraciju novih korisnika preko Supabase Auth

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function RegistracijaForma() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [ime, setIme] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poruka, setPoruka] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setPoruka('');

    if (lozinka.length < 8) {
      setStatus('error');
      setPoruka('Lozinka mora imati najmanje 8 karaktera.');
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password: lozinka,
        options: {
          data: { full_name: ime },
        },
      });

      if (error) {
        setStatus('error');
        setPoruka(error.message === 'User already registered'
          ? 'Korisnik sa ovim email-om vec postoji.'
          : error.message);
        return;
      }

      setStatus('success');
      setPoruka('Registracija uspesna! Proverite email za potvrdu naloga.');
    } catch {
      setStatus('error');
      setPoruka('Greska u mrezi. Pokusajte ponovo.');
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
      <div className="mx-auto max-w-md">
        <h2 className="mb-2 text-center text-3xl font-bold text-white">
          🚀 Registracija
        </h2>
        <p className="mb-8 text-center text-gray-400">
          Kreirajte nalog i dobijte pristup SpajaPro AI i celom ekosistemu
        </p>

        <form onSubmit={handleRegister} className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-8">
          <div className="mb-5">
            <label htmlFor="reg-ime" className="mb-1 block text-sm font-medium text-gray-300">
              Ime i prezime
            </label>
            <input
              id="reg-ime"
              type="text"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              placeholder="Vase ime"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-300">
              Email adresa
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.com"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="reg-lozinka" className="mb-1 block text-sm font-medium text-gray-300">
              Lozinka
            </label>
            <input
              id="reg-lozinka"
              type="password"
              required
              minLength={8}
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              placeholder="Minimum 8 karaktera"
              className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
          >
            {status === 'loading' ? 'Registracija...' : 'Kreiraj nalog'}
          </button>

          {poruka && (
            <div
              role="alert"
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                status === 'success'
                  ? 'bg-green-900/40 text-green-300'
                  : 'bg-red-900/40 text-red-300'
              }`}
            >
              {poruka}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Vec imate nalog?{' '}
          <a href="/pricing" className="text-blue-400 hover:text-blue-300">
            Prijavite se
          </a>
        </p>
      </div>
    </div>
  );
}
