import { NextResponse } from 'next/server';
import {
  spajaDigitalniKompjuterSistem,
  getSveKomponente,
  spajaKonzole,
  spajaDzojstici,
} from '@/lib/spaja-digitalni-kompjuter';
import {
  APP_VERSION,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
  AUTOFINISH_COUNT,
  AUTOFINISH_TARGET,
} from '@/lib/constants';

/**
 * GET /api/spaja-digitalni-kompjuter-aktivacija
 *
 * Aktivacija SPAJA Digitalnog Kompjutera za ulogovanog korisnika.
 * Svako ko se loguje dobija aktiviran Digitalni Kompjuter sa svim
 * komponentama pokretanim od SPAJA Generator za Endzine:
 *
 *  - SPAJA MATICNA PLOCA
 *  - SPAJA SERVER
 *  - SPAJA PROCESOR + CIP
 *  - SPAJA PROCESOR "2" + CIP "2"
 *  - SPAJA BIOS
 *  - SPAJA HARD DISK
 *  - SPAJA RAM (276.000 GB)
 *  - SPAJA GPU (8.700.000 jezgara)
 *  - SPAJA GRAFICKA (276000 RAM)
 *  - SPAJA "1" GRAFICKA (276000 RAM)
 *  - SPAJA TASTATURA I MIS
 *  - SPAJA MONITORING LIVE / AI IQ MONITORING LIVE
 */
export async function GET() {
  const sistem = spajaDigitalniKompjuterSistem;
  const sveKomponente = getSveKomponente();
  const aktivnih = sveKomponente.filter((k) => k.status === 'aktivan').length;

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SPAJA Digitalni Kompjuter — Aktivacija',
    opis: 'Aktivacija digitalnog kompjutera za svakog ulogovanog korisnika — sve komponente pokretane od SPAJA Generator za Endzine',
    verzija: APP_VERSION,

    aktivacija: {
      aktiviran: true,
      poruka: 'Digitalni Kompjuter je uspesno aktiviran za korisnika — sve komponente su u funkciji',
      generatorLink: sistem.generatorLink,
    },

    kompjuter: {
      ukupnoKomponenti: sistem.statistika.ukupnoKomponenti,
      aktivnihKomponenti: aktivnih,
      procenatAktivnih: Math.round((aktivnih / sveKomponente.length) * 100),
      ukupnoKompjutera: sistem.statistika.ukupnoKompjutera,
      ukupnoKonzola: sistem.statistika.ukupnoKonzola,

      komponente: sveKomponente.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        ikona: k.ikona,
        status: k.status,
        opis: k.opis,
        link: k.link,
        generatorLink: k.generatorLink,
      })),

      konzole: spajaKonzole.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        tip: k.tip,
        ikona: k.ikona,
        status: k.status,
        link: k.link,
        dzojsticiLink: k.dzojsticiLink,
      })),

      dzojstici: {
        id: spajaDzojstici.id,
        naziv: spajaDzojstici.naziv,
        ikona: spajaDzojstici.ikona,
        status: spajaDzojstici.status,
        link: spajaDzojstici.link,
      },
    },

    ekosistem: {
      apiEndpointi: TOTAL_API_ROUTES,
      ukupnoRuta: TOTAL_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3x10^17',
    },

    timestamp: new Date().toISOString(),
  });
}
