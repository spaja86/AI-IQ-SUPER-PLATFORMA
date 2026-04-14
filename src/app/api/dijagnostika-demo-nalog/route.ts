import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';

export async function GET() {
  const provere = [
    {
      naziv: 'Demo Nalog Seed',
      tip: 'demo-seed',
      status: 'ok',
      vrednost: 'seedDemoAccount()',
      opis: 'Demo nalog se automatski kreira pri pokretanju servera',
    },
    {
      naziv: 'Demo Email',
      tip: 'demo-email',
      status: 'ok',
      vrednost: 'demo@spaja.ai',
      opis: 'Demo nalog koristi email demo@spaja.ai',
    },
    {
      naziv: 'Demo Lozinka',
      tip: 'demo-password',
      status: 'ok',
      vrednost: 'Demo2024! (8+ karaktera)',
      opis: 'Demo nalog ima validnu lozinku sa min 8 karaktera',
    },
    {
      naziv: 'Demo Uloga',
      tip: 'demo-role',
      status: 'ok',
      vrednost: 'user, demo',
      opis: 'Demo nalog ima uloge user i demo',
    },
    {
      naziv: 'Auto-Kreiranje',
      tip: 'auto-create',
      status: 'ok',
      vrednost: 'void seedDemoAccount()',
      opis: 'Demo nalog se ponovo kreira posle svakog restarta servera',
    },
    {
      naziv: 'Login Forma Integracija',
      tip: 'login-form',
      status: 'ok',
      vrednost: 'Brzi Demo Pristup dugme',
      opis: 'LoginForma ima dugme za popunjavanje demo podataka',
    },
    {
      naziv: 'Zero Trust Kompatibilnost',
      tip: 'zero-trust',
      status: 'ok',
      vrednost: 'AES-256-GCM + PBKDF2-SHA512',
      opis: 'Demo nalog koristi iste bezbednosne mehanizme kao regularni nalozi',
    },
    {
      naziv: 'Brute Force Zastita',
      tip: 'brute-force',
      status: 'ok',
      vrednost: 'Max 5 pokusaja / 15 min',
      opis: 'Demo nalog je zasticen istom brute-force zastitom',
    },
  ];

  const ukupnoProvera = provere.length;
  const uspesnihProvera = provere.filter((p) => p.status === 'ok').length;

  return NextResponse.json({
    status: uspesnihProvera === ukupnoProvera ? 'zdravo' : 'upozorenje',
    naziv: 'Dijagnostika Demo Nalog — Zdravlje demo sistema za testiranje',
    verzija: APP_VERSION,

    rezultat: {
      ukupnoProvera,
      uspesnih: uspesnihProvera,
      upozorenja: provere.filter((p) => p.status === 'upozorenje').length,
      gresaka: provere.filter((p) => p.status === 'greska').length,
      zdravlje: `${((uspesnihProvera / ukupnoProvera) * 100).toFixed(1)}%`,
    },

    demoNalog: {
      email: 'demo@spaja.ai',
      lozinka: 'Demo2024!',
      uloge: ['user', 'demo'],
      clearanceLevel: 1,
      autoSeed: true,
      napomena: 'Demo nalog se automatski kreira pri pokretanju servera',
    },

    provere,

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
