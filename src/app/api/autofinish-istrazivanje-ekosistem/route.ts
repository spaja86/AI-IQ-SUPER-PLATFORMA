import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  TOTAL_PAGES,
  TOTAL_IGRICA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { navigation } from '@/lib/navigation';

export async function GET() {
  const procenat = (AUTOFINISH_COUNT / AUTOFINISH_TARGET) * 100;

  const istrazivanjePodaci = [
    {
      oblast: 'Platforme',
      ikona: '🌐',
      ukupno: platforme.length,
      opis: 'Sve platforme u ekosistemu Digitalne Industrije',
      linkovi: ['/platforme', '/ekosistem', '/industrija'],
    },
    {
      oblast: 'IT Proizvodi',
      ikona: '⚡',
      ukupno: itProizvodi.length,
      opis: 'Svi IT proizvodi Kompanije SPAJA — ubrzanje, monitoring, bezbednost, AI, deploy, gaming',
      linkovi: ['/it-proizvodi', '/proizvodi'],
    },
    {
      oblast: 'Igrice',
      ikona: '🎮',
      ukupno: TOTAL_IGRICA,
      opis: '95 igrica u 18 kategorija — Dota 1350, TRANSFORMERS, BUBLI BABLI, Poker i jos mnogo toga',
      linkovi: ['/igrice', '/io-openui-ao-gaming-platforma'],
    },
    {
      oblast: 'OMEGA AI',
      ikona: '🧠',
      ukupno: 21,
      opis: '21 OMEGA AI persona sa 8 oktava — ukupno 40.000.562 instance',
      linkovi: ['/omega-ai', '/omega-ai-suport'],
    },
    {
      oblast: 'SpajaPro Engine',
      ikona: '🌟',
      ukupno: 10,
      opis: 'SpajaPro v6-15 — 10 verzija AI engine-a koji zamenjuje ChatGPT',
      linkovi: ['/spaja-pro', '/prompt', '/spaja-univerzalni-prompt'],
    },
    {
      oblast: 'Infrastruktura',
      ikona: '🛡️',
      ukupno: 5,
      opis: 'Proksi, Mobilna Mreza, WiFi Antena, GitHub Deploy, Digitalni Kompjuter',
      linkovi: ['/proksi', '/mobilna-mreza', '/proksi-wifi-antena', '/proksi-github-deploy', '/spaja-digitalni-kompjuter'],
    },
    {
      oblast: 'Mediji & Zabava',
      ikona: '🎬',
      ukupno: 3,
      opis: 'Digitalni TV, Render Medija, Digitalni Brouvzer',
      linkovi: ['/digitalni-televizor', '/spaja-render-medija', '/spaja-digitalni-brouvzer'],
    },
    {
      oblast: 'Finansije',
      ikona: '🏦',
      ukupno: 2,
      opis: 'SPAJA Banka i SPAJA Menjacnica — digitalne finansije sa AI podrškom',
      linkovi: ['/banka', '/menjacnica'],
    },
    {
      oblast: 'Nauka & Razvoj',
      ikona: '🔬',
      ukupno: 3,
      opis: 'Laboratorija, Dimenzije, Oktavne Eksponencijalne Funkcije',
      linkovi: ['/io-openui-ao-laboratorija', '/dimenzije', '/oktavne-eksponencijalne-funkcije'],
    },
    {
      oblast: 'Monitoring & Bezbednost',
      ikona: '🔍',
      ukupno: 4,
      opis: 'Monitoring Live, AI IQ Monitoring, Auto-Popravka, Security',
      linkovi: ['/monitoring-live', '/ai-iq-monitoring', '/auto-popravka', '/security'],
    },
  ];

  const ukupnoOblasti = istrazivanjePodaci.length;
  const ukupnoLinkova = istrazivanjePodaci.reduce((sum, o) => sum + o.linkovi.length, 0);

  return NextResponse.json({
    status: 'aktivan',
    naziv: `Autofinish Istrazivanje Ekosistema — Iteracija #${AUTOFINISH_COUNT}`,
    opis: 'Kompletni pregled svih oblasti za istrazivanje u ekosistemu Digitalne Industrije',
    verzija: APP_VERSION,

    iteracija: {
      broj: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
      procenat: procenat.toExponential(2),
    },

    istrazivanje: {
      ukupnoOblasti,
      ukupnoLinkova,
      navigacija: navigation.length,
      stranice: TOTAL_PAGES,
      oblasti: istrazivanjePodaci,
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
      igrice: TOTAL_IGRICA,
      stranice: TOTAL_PAGES,
    },

    timestamp: new Date().toISOString(),
  });
}
