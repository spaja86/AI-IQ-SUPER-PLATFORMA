import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'AI IQ World Bank — Digitalna Banka',
    appVerzija: APP_VERSION,
    status: 'aktivan',
    kamatnaStopaPrompt: {
      stopa: '40%',
      period: 'mesecno',
      opis: 'Pozitivna kamatna stopa od 40% mesecno na stedne racune',
      uslov: 'Mesec dana (30 dana) bez povlacenja sredstava',
      primeri: [
        { ulog: '1.000 RSD', zarada: '400 RSD', ukupno: '1.400 RSD' },
        { ulog: '5.000 RSD', zarada: '2.000 RSD', ukupno: '7.000 RSD' },
        { ulog: '10.000 RSD', zarada: '4.000 RSD', ukupno: '14.000 RSD' },
        { ulog: '50.000 RSD', zarada: '20.000 RSD', ukupno: '70.000 RSD' },
        { ulog: '100.000 RSD', zarada: '40.000 RSD', ukupno: '140.000 RSD' },
        { ulog: '1.000.000 RSD', zarada: '400.000 RSD', ukupno: '1.400.000 RSD' },
      ],
    },
    servisi: [
      'Stedni racun sa 40% kamatom',
      'Multi-valutni racuni (RSD, EUR, USD, GBP + kripto)',
      'Globalni transferi (Instant, SWIFT, Blockchain)',
      'AI-optimizovani krediti',
      'Investicije sa AI preporukama',
      'Real-time analitika i izvestaji',
    ],
    bezbednost: [
      'E2E enkripcija',
      'Biometricka autentifikacija',
      '2FA',
      'AI fraud detekcija',
    ],
    analiza: 'Ekstremno jaka banka — sve se moze proveriti i analizirati',
    ersteBankaDOOSmederevo: {
      naziv: 'ERSTE Banka DOO Smederevo',
      vlasnikRacuna: 'Digitalna Industrija',
      vlasnik: {
        ime: 'Nikola Spajic',
        registarskiBrojLicneKarte: '015639997',
        jmbg: '0312986850017',
      },
      status: 'aktivan',
      racuni: [
        {
          tip: 'dinarski',
          valuta: 'RSD',
          brojRacuna: '025897158',
          opis: 'Dinarski racun za domace transakcije',
        },
        {
          tip: 'devizni',
          valuta: 'EUR',
          brojRacuna: '038971285',
          opis: 'Devizni racun u evrima za medjunarodne transakcije',
        },
        {
          tip: 'devizni',
          valuta: 'USD',
          brojRacuna: '05364215985',
          opis: 'Devizni racun u dolarima za globalne transakcije',
        },
      ],
      kartice: 'Izdate na ERSTE Banka DOO Smederevo',
    },
    url: 'https://ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app/index.html',
    repo: 'spaja86/Ai-Iq-World-Bank',
    misijaIVizija: {
      misija: 'Globalna digitalna banka sa AI optimizacijom za sve korisnike',
      vizija: 'Vodeca svetska AI banka sa 40% pozitivnom kamatnom stopom',
      vrednosti: ['Transparentnost', 'Pouzdanost', 'Sigurnost', 'Pristupacnost'],
      inovacija: 'Spajanje tradicionalnog bankarstva sa naprednim AI tehnologijama',
    },
    omegaAiTehnologija: {
      opis: 'Omega AI pokrece sve AI funkcije AI IQ World Bank',
      funkcije: [
        'AI Scoring sistem — analiza kreditne sposobnosti sa 97% tacnosti',
        'AI Fraud detekcija — automatska detekcija sumnjivih transakcija',
        'AI Investicioni savetnik — pametne preporuke za investiranje',
        'AI Predikcija trzista — predvidjanje kretanja na osnovu big data',
        'AI Optimizacija transakcija — najnize provizije automatski',
        'AI Korisnicka podrska — 24/7 chatbot za resavanje problema',
      ],
    },
    smederevoEkspanzija: {
      lokacija: 'Smederevo, Srbija',
      opis: 'Sediste AI IQ World Bank i Digitalne Industrije',
      aktivnosti: [
        'Sediste kompanije i centar razvoja',
        'ERSTE Banka DOO Smederevo — zvanicni bankarski partner',
        'Globalna ekspanzija iz Smedereva ka celom svetu',
        'Tehnoloski hub za razvoj platformi i AI sistema',
      ],
    },
    partneri: [
      { naziv: 'ERSTE Banka DOO Smederevo', tip: 'bankarski', opis: 'Zvanicni bankarski partner' },
      { naziv: 'Kompanija SPAJA', tip: 'maticna', opis: 'Maticna kompanija digitalnog ekosistema' },
      { naziv: 'Omega AI', tip: 'tehnoloski', opis: 'AI tehnoloski partner sa 40M+ persona' },
      { naziv: 'AI IQ Menjacnica', tip: 'finansijski', opis: 'Partnerska menjacnica za konverziju valuta' },
      { naziv: 'Vercel', tip: 'hosting', opis: 'Hosting i deploy partner' },
      { naziv: 'GitHub', tip: 'razvoj', opis: 'Platforma za razvoj i repozitorijume' },
    ],
    kontakt: {
      vlasnik: 'Nikola Spajic',
      mejlovi: ['spajicn@yahoo.com', 'spajicn@gmail.com'],
      drustvneMreze: [
        { naziv: 'Facebook', url: 'https://www.facebook.com/Spaja86' },
        { naziv: 'Facebook (Digitalna Industrija)', url: 'https://www.facebook.com/profile.php?id=61583240952997' },
        { naziv: 'Instagram', url: 'https://www.instagram.com/spaja.1986' },
        { naziv: 'TikTok', url: 'https://www.tiktok.com/@spaja.1986' },
        { naziv: 'YouTube', url: 'https://www.youtube.com/@spajanikopenevolution' },
      ],
    },
    racuniAiIqWorldBank: [
      {
        vlasnikRacuna: 'Digitalna Industrija',
        brojRacuna: 'DIGI-IND-001',
        valuta: 'RSD',
        tip: 'digitalni',
        opis: 'Racun Digitalne Industrije u AI IQ World Bank — prima 4% od celokupnog dnevnog dobita',
        namena: 'Dnevna raspodela zarade — 4% rezerva',
        status: 'aktivan',
      },
    ],
    timestamp: new Date().toISOString(),
  });
}
