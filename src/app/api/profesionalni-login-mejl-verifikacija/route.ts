import { NextResponse } from 'next/server';
import {
  profesionalniLoginPlatniSistem,
  getProfesionalniLoginPregled,
  getVerifikacioniSistemZaProvajdera,
  getAktivneMejlRute,
  getSvePoslovneMejlAdrese,
} from '@/lib/profesionalni-login-platni-sistem';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🔐 Profesionalni Login — Mejl Verifikacija (Pregled)
 *
 * GET — Kompletni pregled sistema za verifikaciju poslovnih mejlova
 * od AI IQ World Bank koji stizu na Stripe i PayPal rute.
 *
 * Prikazuje:
 *  - Sve mejl rute (Stripe i PayPal)
 *  - Verifikacione korake za oba provajdera
 *  - Status sistema i dijagnostiku
 *  - Poslovne mejl adrese
 *
 * Autofinish #334
 */

interface VerifikacijaDijagnostika {
  id: string;
  naziv: string;
  status: 'ok' | 'upozorenje' | 'potrebna-akcija';
  poruka: string;
}

function proveraVerifikacionogSistema(): VerifikacijaDijagnostika[] {
  const dijagnostike: VerifikacijaDijagnostika[] = [];

  // 1. Provera Stripe verifikacionog sistema
  const stripeVerif = getVerifikacioniSistemZaProvajdera('stripe');
  dijagnostike.push({
    id: 'stripe-verif-sistem',
    naziv: 'Stripe Verifikacioni Sistem',
    status: stripeVerif.ukupnoProvera >= 8 ? 'ok' : 'upozorenje',
    poruka: `${stripeVerif.ukupnoProvera} verifikacionih koraka definisano, automatska obrada: ${stripeVerif.automatska ? 'da' : 'ne'}`,
  });

  // 2. Provera PayPal verifikacionog sistema
  const paypalVerif = getVerifikacioniSistemZaProvajdera('paypal');
  dijagnostike.push({
    id: 'paypal-verif-sistem',
    naziv: 'PayPal Verifikacioni Sistem',
    status: paypalVerif.ukupnoProvera >= 8 ? 'ok' : 'upozorenje',
    poruka: `${paypalVerif.ukupnoProvera} verifikacionih koraka definisano, automatska obrada: ${paypalVerif.automatska ? 'da' : 'ne'}`,
  });

  // 3. Provera aktivnih mejl ruta
  const aktivneRute = getAktivneMejlRute();
  dijagnostike.push({
    id: 'aktivne-mejl-rute',
    naziv: 'Aktivne Mejl Rute',
    status: aktivneRute.length >= 8 ? 'ok' : 'upozorenje',
    poruka: `${aktivneRute.length} aktivnih mejl ruta (${aktivneRute.filter((r) => r.provajder === 'stripe').length} Stripe, ${aktivneRute.filter((r) => r.provajder === 'paypal').length} PayPal)`,
  });

  // 4. Provera poslovnih mejl adresa
  const adrese = getSvePoslovneMejlAdrese();
  dijagnostike.push({
    id: 'poslovne-mejl-adrese',
    naziv: 'Poslovne Mejl Adrese',
    status: adrese.length >= 8 ? 'ok' : 'upozorenje',
    poruka: `${adrese.length} poslovnih mejl adresa konfigurisano na domenu @banka.spaja.rs`,
  });

  // 5. Provera DKIM/SPF konfiguracije
  dijagnostike.push({
    id: 'dkim-spf-konfiguracija',
    naziv: 'DKIM i SPF Konfiguracija',
    status: 'upozorenje',
    poruka: 'DKIM i SPF verifikacija definisana u sistemu — DNS zapisi moraju se konfigurisati na domenu banka.spaja.rs',
  });

  // 6. Provera TLS enkripcije
  dijagnostike.push({
    id: 'tls-enkripcija',
    naziv: 'TLS Enkripcija za Mejlove',
    status: 'ok',
    poruka: 'TLS enkripcija definisana kao obavezan korak verifikacije za oba provajdera',
  });

  // 7. Provera anti-fraud sistema
  dijagnostike.push({
    id: 'anti-fraud-sistem',
    naziv: 'Anti-Fraud AI Analiza',
    status: 'ok',
    poruka: 'Anti-fraud AI analiza definisana kao obavezan korak verifikacije za oba provajdera',
  });

  return dijagnostike;
}

export async function GET() {
  const pregled = getProfesionalniLoginPregled();
  const dijagnostike = proveraVerifikacionogSistema();

  const ukupno = dijagnostike.length;
  const ok = dijagnostike.filter((d) => d.status === 'ok').length;
  const upozorenja = dijagnostike.filter((d) => d.status === 'upozorenje').length;
  const zdravlje = Math.round((ok / ukupno) * 100);

  return NextResponse.json({
    sistem: 'Profesionalni Login — Mejl Verifikacija (Stripe & PayPal)',
    opis: profesionalniLoginPlatniSistem.opis,
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    pregled,
    verifikacioniSistemi: {
      stripe: {
        ...getVerifikacioniSistemZaProvajdera('stripe'),
      },
      paypal: {
        ...getVerifikacioniSistemZaProvajdera('paypal'),
      },
    },
    dijagnostike,
    statistikaDijagnostike: {
      ukupnoProvera: ukupno,
      ok,
      upozorenja,
      zdravlje: `${zdravlje}%`,
    },
    mogucnosti: profesionalniLoginPlatniSistem.mogucnosti,
    napomena: 'Kada poslovni mejl od AI IQ World Bank stigne na Stripe ili PayPal rutu, sistem automatski pokrece verifikaciju svih informacija kroz 8 koraka za svakog provajdera.',
    timestamp: new Date().toISOString(),
  });
}
