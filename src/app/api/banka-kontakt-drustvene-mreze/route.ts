import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ World Bank — Kontakt i drustvene mreze',
    verzija: APP_VERSION,
    status: 'aktivan',
    vlasnik: {
      ime: 'Nikola Spajic',
      kompanija: 'Digitalna Industrija',
    },
    mejlovi: [
      { tip: 'primarni', adresa: 'spajicn@yahoo.com', namena: 'Svi upiti i saradnja' },
      { tip: 'sekundarni', adresa: 'spajicn@gmail.com', namena: 'Tehnicka podrska' },
    ],
    drustvneMreze: [
      { naziv: 'Facebook', url: 'https://www.facebook.com/Spaja86', korisnickoIme: 'Spaja86' },
      { naziv: 'Facebook (Stranica 2)', url: 'https://www.facebook.com/profile.php?id=61583240952997', korisnickoIme: 'Digitalna Industrija' },
      { naziv: 'Instagram', url: 'https://www.instagram.com/spaja.1986', korisnickoIme: '@spaja.1986' },
      { naziv: 'TikTok', url: 'https://www.tiktok.com/@spaja.1986', korisnickoIme: '@spaja.1986' },
      { naziv: 'YouTube', url: 'https://www.youtube.com/@spajanikopenevolution', korisnickoIme: 'SpajaNikopEvolution' },
    ],
    partneri: [
      { naziv: 'ERSTE Banka DOO Smederevo', tip: 'bankarski', opis: 'Zvanicni bankarski partner' },
      { naziv: 'Kompanija SPAJA', tip: 'maticna', opis: 'Maticna kompanija digitalnog ekosistema' },
      { naziv: 'Omega AI', tip: 'tehnoloski', opis: 'AI tehnoloski partner sa 40M+ persona' },
      { naziv: 'AI IQ Menjacnica', tip: 'finansijski', opis: 'Partnerska menjacnica za konverziju valuta' },
      { naziv: 'Vercel', tip: 'hosting', opis: 'Hosting i deploy partner' },
      { naziv: 'GitHub', tip: 'razvoj', opis: 'Platforma za razvoj i repozitorijume' },
    ],
    smederevoEkspanzija: {
      lokacija: 'Smederevo, Srbija',
      opis: 'Sediste AI IQ World Bank i Digitalne Industrije',
      status: 'aktivna',
    },
    ukupnoKontakata: 2,
    ukupnoDrustvnihMreza: 5,
    ukupnoPartnera: 6,
    timestamp: new Date().toISOString(),
  });
}
