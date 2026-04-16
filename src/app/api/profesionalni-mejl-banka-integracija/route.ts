import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'Profesionalni Mejl Sistem - Banka i Menjacnica Integracija',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Profesionalni mejl sistem povezuje AI IQ World Bank i AI IQ Menjacnicu za transakcione notifikacije, verifikaciju i podrsku',
    domeni: [
      { domen: '@spaja.rs', namena: 'Glavni kompanijski mejl domen', status: 'priprema' },
      { domen: '@omega-ai.spaja.rs', namena: 'Omega AI suport mejl', status: 'priprema' },
      { domen: '@banka.spaja.rs', namena: 'AI IQ World Bank mejl notifikacije', status: 'priprema' },
      { domen: '@industrija.spaja.rs', namena: 'Digitalna Industrija mejl', status: 'priprema' },
    ],
    bankaIntegracija: {
      transakcijePotvrda: {
        sablon: 'transakcija',
        domen: '@banka.spaja.rs',
        opis: 'Automatska potvrda svake bankarske transakcije sa IBAN detaljima',
        podaci: ['Iznos', 'Valuta', 'IBAN primaoca', 'Datum', 'Referentni broj'],
      },
      verifikacijaMejla: {
        sablon: 'verifikacija',
        domen: '@banka.spaja.rs',
        opis: '6-cifreni OTP kod za verifikaciju bankarskih naloga',
      },
      bezbednostUpozorenje: {
        sablon: 'bezbednost',
        domen: '@banka.spaja.rs',
        opis: 'Upozorenje o sumnjivim bankarskim aktivnostima sa IP adresom i lokacijom',
      },
      potpis: {
        opis: 'Bankarski potpis sa IBAN brojevima i ERSTE Banka detaljima',
        elementi: ['Naziv banke', 'IBAN RSD', 'IBAN EUR', 'IBAN USD', 'Vlasnik racuna'],
      },
    },
    menjacnicaIntegracija: {
      tradePotvrda: {
        sablon: 'transakcija',
        domen: '@spaja.rs',
        opis: 'Potvrda svake kripto i fiat transakcije na menjacnici',
        podaci: ['Tip trejda (Buy/Sell)', 'Valutni par', 'Kolicina', 'Cena', 'Naknada', 'Ukupno'],
      },
      portfolioIzvestaj: {
        sablon: 'newsletter',
        domen: '@spaja.rs',
        opis: 'Mesecni izvestaj o portfoliu sa alokacijom i performansama',
      },
      cenovnikPromo: {
        sablon: 'marketing',
        domen: '@spaja.rs',
        opis: 'Promotivne ponude za Pro i Enterprise planove menjacnice',
      },
    },
    omegaAiSuport: {
      departmani: [
        { naziv: 'banka', mejl: 'banka-suport@omega-ai.spaja.rs', opis: 'Podrska za bankarske usluge' },
        { naziv: 'menjacnica', mejl: 'menjacnica-suport@omega-ai.spaja.rs', opis: 'Podrska za trading i menjacnicu' },
        { naziv: 'tehnicka-podrska', mejl: 'tehnicka@omega-ai.spaja.rs', opis: 'Tehnicka podrska za platformu' },
      ],
    },
    dnevniKapacitet: 50000,
    sablonaUkupno: 8,
    timestamp: new Date().toISOString(),
  });
}
