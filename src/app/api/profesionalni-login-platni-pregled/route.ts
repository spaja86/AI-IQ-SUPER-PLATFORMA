import { NextResponse } from 'next/server';
import {
  profesionalniLoginPlatniSistem,
  getProfesionalniLoginPregled,
  getAktivneMejlRute,
  getSvePoslovneMejlAdrese,
  getRutaZaProvajdera,
  getVerifikacioniSistemZaProvajdera,
} from '@/lib/profesionalni-login-platni-sistem';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🔐💳 Profesionalni Login — Platni Pregled
 *
 * GET — Unificirani pregled profesionalnog login platnog sistema
 * sa Stripe i PayPal rutama, poslovnim mejlovima od AI IQ World Bank,
 * verifikacionim sistemom i dijagnostikom.
 *
 * Autofinish #335
 */

interface PlatniDijagnostika {
  id: string;
  naziv: string;
  status: 'ok' | 'upozorenje' | 'kriticno';
  poruka: string;
}

function pokreniDijagnostiku(): PlatniDijagnostika[] {
  const dijagnostike: PlatniDijagnostika[] = [];
  const stripeRuta = getRutaZaProvajdera('stripe');
  const paypalRuta = getRutaZaProvajdera('paypal');
  const stripeVerif = getVerifikacioniSistemZaProvajdera('stripe');
  const paypalVerif = getVerifikacioniSistemZaProvajdera('paypal');
  const aktivneRute = getAktivneMejlRute();
  const adrese = getSvePoslovneMejlAdrese();

  // 1. Stripe ruta status
  dijagnostike.push({
    id: 'stripe-ruta-status',
    naziv: 'Stripe Ruta — Status',
    status: stripeRuta.status === 'aktivan' ? 'ok' : 'upozorenje',
    poruka: `Stripe ruta: ${stripeRuta.status}, ${stripeRuta.mejlRute.length} mejl ruta, ${stripeRuta.mogucnosti.length} mogucnosti`,
  });

  // 2. PayPal ruta status
  dijagnostike.push({
    id: 'paypal-ruta-status',
    naziv: 'PayPal Ruta — Status',
    status: paypalRuta.status === 'aktivan' ? 'ok' : 'upozorenje',
    poruka: `PayPal ruta: ${paypalRuta.status}, ${paypalRuta.mejlRute.length} mejl ruta, ${paypalRuta.mogucnosti.length} mogucnosti`,
  });

  // 3. Stripe verifikacija
  dijagnostike.push({
    id: 'stripe-verifikacija',
    naziv: 'Stripe Verifikacioni Sistem',
    status: stripeVerif.ukupnoProvera >= 8 ? 'ok' : 'upozorenje',
    poruka: `${stripeVerif.ukupnoProvera} verifikacionih koraka, automatska: ${stripeVerif.automatska ? 'da' : 'ne'}`,
  });

  // 4. PayPal verifikacija
  dijagnostike.push({
    id: 'paypal-verifikacija',
    naziv: 'PayPal Verifikacioni Sistem',
    status: paypalVerif.ukupnoProvera >= 8 ? 'ok' : 'upozorenje',
    poruka: `${paypalVerif.ukupnoProvera} verifikacionih koraka, automatska: ${paypalVerif.automatska ? 'da' : 'ne'}`,
  });

  // 5. Aktivne mejl rute
  dijagnostike.push({
    id: 'aktivne-mejl-rute',
    naziv: 'Aktivne Mejl Rute',
    status: aktivneRute.length >= 8 ? 'ok' : 'upozorenje',
    poruka: `${aktivneRute.length} aktivnih mejl ruta od ukupno ${adrese.length} adresa`,
  });

  // 6. Poslovne mejl adrese
  dijagnostike.push({
    id: 'poslovne-adrese',
    naziv: 'Poslovne Mejl Adrese — AI IQ World Bank',
    status: adrese.length >= 8 ? 'ok' : 'upozorenje',
    poruka: `${adrese.length} poslovnih mejl adresa na domenu @banka.spaja.rs`,
  });

  // 7. Platni sistem integritet
  dijagnostike.push({
    id: 'platni-sistem-integritet',
    naziv: 'Platni Sistem Integritet',
    status: profesionalniLoginPlatniSistem.status === 'aktivan' ? 'ok' : 'upozorenje',
    poruka: `Sistem: ${profesionalniLoginPlatniSistem.status}, ${profesionalniLoginPlatniSistem.ukupnoRuta} provajdera, ${profesionalniLoginPlatniSistem.ukupnoVerifikacija} ukupno verifikacija`,
  });

  return dijagnostike;
}

export async function GET() {
  const pregled = getProfesionalniLoginPregled();
  const dijagnostike = pokreniDijagnostiku();

  const ukupno = dijagnostike.length;
  const ok = dijagnostike.filter((d) => d.status === 'ok').length;
  const zdravlje = Math.round((ok / ukupno) * 100);

  return NextResponse.json({
    sistem: 'Profesionalni Login — Platni Pregled (Stripe & PayPal)',
    opis: profesionalniLoginPlatniSistem.opis,
    verzija: APP_VERSION,
    izvor: KOMPANIJA,

    pregled,

    stripeRuta: {
      ...getRutaZaProvajdera('stripe'),
      verifikacioniSistem: getVerifikacioniSistemZaProvajdera('stripe'),
    },
    paypalRuta: {
      ...getRutaZaProvajdera('paypal'),
      verifikacioniSistem: getVerifikacioniSistemZaProvajdera('paypal'),
    },

    dijagnostike,
    statistikaDijagnostike: {
      ukupnoProvera: ukupno,
      ok,
      upozorenja: ukupno - ok,
      zdravlje: `${zdravlje}%`,
    },

    poslovneMejlAdrese: getSvePoslovneMejlAdrese(),
    mogucnosti: profesionalniLoginPlatniSistem.mogucnosti,

    apiEndpointi: [
      '/api/profesionalni-login-stripe',
      '/api/profesionalni-login-paypal',
      '/api/profesionalni-login-mejl-verifikacija',
      '/api/profesionalni-login-platni-pregled',
    ],

    timestamp: new Date().toISOString(),
  });
}
