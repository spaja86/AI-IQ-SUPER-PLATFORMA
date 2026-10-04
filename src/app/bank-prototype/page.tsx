'use client';

import { useState } from 'react';
import { dohvatiSesiju } from '@/lib/auth/omega-session-client';

export default function BankPrototypePage() {
  const [message, setMessage] = useState('Prototip — stvarna plaćanja i izdavanje kartica su isključeni.');
  const [loading, setLoading] = useState(false);
  async function checkSession() {
    const session = dohvatiSesiju();
    if (!session?.token) {
      window.location.assign('/login?redirect=%2Fbank-prototype');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/bank-prototype/session', {
        headers: { Authorization: `Bearer ${session.token}` }, cache: 'no-store',
      });
      if (response.status === 401) {
        setMessage('Sesija nije važeća. Ponovo se prijavite.');
        return;
      }
      if (!response.ok) throw new Error('Verification unavailable');
      const { data } = await response.json();
      if (data.environment !== 'simulation' || data.paymentsEnabled !== false) throw new Error('Unexpected contract');
      setMessage('Sesija potvrđena na serveru. Režim: simulacija. Nema potvrđenog salda ni izvršenih uplata.');
    } catch {
      setMessage('Provera nije uspela. Nijedna uplata nije pokrenuta.');
    } finally { setLoading(false); }
  }
  return <main className="mx-auto max-w-3xl p-8">
    <h1>AI IQ World Bank — bezbedni prototip</h1>
    <p role="status" aria-live="polite">{message}</p>
    <button type="button" onClick={checkSession} disabled={loading}>{loading ? 'Provera…' : 'Proveri prijavu'}</button>
    <p><a href="/login?redirect=%2Fbank-prototype">Prijava</a></p>
    <p>AI identifikator nije poslovni račun. Stvarni računi, kartice i IPS zahtevaju ovlašćenog partnera.</p>
  </main>;
}
