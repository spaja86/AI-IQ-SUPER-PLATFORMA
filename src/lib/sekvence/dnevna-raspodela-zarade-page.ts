import type { Sekvenca } from '@/lib/types';
import {
  dnevnaRaspodelaSistem,
  racuniRaspodela,
  digitalnaIndustrijaRacun,
  primerSimulacije,
  PROCENAT_RASPODELE,
  PROCENAT_PO_RACUNU,
  OPERATIVNA_REZERVA,
} from '@/lib/dnevna-raspodela-zarade';
import { KOMPANIJA } from '@/lib/constants';

export const dnevnaRaspodelaSaradeSekvence: Sekvenca[] = [
  {
    id: 'dnevna-raspodela-hero',
    tip: 'hero',
    naslov: '💰 Dnevna Raspodela Zarade',
    podnaslov: `${KOMPANIJA} — Distribucija dnevnog dobita na ${racuniRaspodela.length + 1} računa`,
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis: dnevnaRaspodelaSistem.opis,
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Nabavka', href: '/glavni-sistem-nabavka', stil: 'sekundarno' },
        { tekst: 'Pricing', href: '/pricing', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'dnevna-raspodela-statistika',
    tip: 'statistika',
    naslov: '📊 Raspodela u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'ERSTE računi', vrednost: `${PROCENAT_RASPODELE}%`, ikona: '🏦' },
        { naziv: 'Po računu', vrednost: `${PROCENAT_PO_RACUNU}%`, ikona: '💳' },
        { naziv: 'ERSTE računa', vrednost: racuniRaspodela.length, ikona: '🔢' },
        { naziv: 'Rezerva (DI)', vrednost: `${OPERATIVNA_REZERVA}%`, ikona: '🏭' },
        { naziv: 'Raspodeljeno', vrednost: '100%', ikona: '✅' },
        { naziv: 'Simulacija', vrednost: primerSimulacije.length, ikona: '📈' },
        { naziv: 'Mogućnosti', vrednost: dnevnaRaspodelaSistem.mogucnosti.length, ikona: '⚙️' },
        { naziv: 'Status', vrednost: dnevnaRaspodelaSistem.status === 'aktivan' ? 'Aktivan' : 'Konfiguracija', ikona: '🟢' },
      ],
    },
  },
  {
    id: 'dnevna-raspodela-racuni',
    tip: 'kartice',
    naslov: '🏦 ERSTE Banka računi — 96% raspodele',
    podnaslov: `${racuniRaspodela.length} računa kod ERSTE Banka DOO Smederevo — po ${PROCENAT_PO_RACUNU}% od dnevnog dobita`,
    redosled: 3,
    podaci: {
      kartice: [
        ...racuniRaspodela.map((r) => ({
          naslov: `${r.ikona} ${r.naziv}`,
          opis: r.opis,
          ikona: r.ikona,
          oznake: [
            `${r.procenatOdDnevnogDobita}%`,
            r.valuta,
            r.banka,
            `Račun: ${r.brojRacuna}`,
          ],
        })),
        {
          naslov: `${digitalnaIndustrijaRacun.ikona} ${digitalnaIndustrijaRacun.naziv}`,
          opis: digitalnaIndustrijaRacun.opis,
          ikona: digitalnaIndustrijaRacun.ikona,
          oznake: [
            `${digitalnaIndustrijaRacun.procenatOdDnevnogDobita}%`,
            digitalnaIndustrijaRacun.valuta,
            digitalnaIndustrijaRacun.banka,
            `Račun: ${digitalnaIndustrijaRacun.brojRacuna}`,
          ],
        },
      ],
    },
  },
  {
    id: 'dnevna-raspodela-tabela-racuni',
    tip: 'tabela',
    naslov: '📋 Pregled svih računa',
    podnaslov: 'Račun, valuta, procenat, banka — kompletni pregled raspodele',
    redosled: 4,
    podaci: {
      zaglavlje: ['Račun', 'Valuta', 'Procenat', 'Broj računa', 'Banka'],
      redovi: [
        ...racuniRaspodela.map((r) => [
          `${r.ikona} ${r.naziv}`,
          r.valuta,
          `${r.procenatOdDnevnogDobita}%`,
          r.brojRacuna,
          r.banka,
        ]),
        [
          `${digitalnaIndustrijaRacun.ikona} ${digitalnaIndustrijaRacun.naziv}`,
          digitalnaIndustrijaRacun.valuta,
          `${digitalnaIndustrijaRacun.procenatOdDnevnogDobita}%`,
          digitalnaIndustrijaRacun.brojRacuna,
          digitalnaIndustrijaRacun.banka,
        ],
      ],
    },
  },
  {
    id: 'dnevna-raspodela-simulacije',
    tip: 'tabela',
    naslov: '📈 Simulacije raspodele',
    podnaslov: `${primerSimulacije.length} primera — od 10.000 do 1.000.000 RSD dnevnog dobita`,
    redosled: 5,
    podaci: {
      zaglavlje: ['Dnevni dobit', 'RSD (32%)', 'EUR (32%)', 'USD (32%)', 'DI (4%)', 'Ukupno'],
      redovi: primerSimulacije.map((s) => [
        `${s.dnevniDobit.toLocaleString()} RSD`,
        `${s.raspodelaNaRacune[0].iznos.toLocaleString()} RSD`,
        `${s.raspodelaNaRacune[1].iznos.toLocaleString()} RSD`,
        `${s.raspodelaNaRacune[2].iznos.toLocaleString()} RSD`,
        `${s.rezervaDigitalnaIndustrija.iznos.toLocaleString()} RSD`,
        `${s.ukupnoRaspodeljeno.toLocaleString()} RSD (${s.procenatRaspodeljen}%)`,
      ]),
    },
  },
  {
    id: 'dnevna-raspodela-tekst-pravilo',
    tip: 'tekst',
    naslov: '⚙️ Pravilo raspodele zarade',
    redosled: 6,
    podaci: {
      sadrzaj: `Od celokupne zarade na dnevnom nivou, 100% dnevnog dobita se raspoređuje ovako: ${PROCENAT_RASPODELE}% (3 × ${PROCENAT_PO_RACUNU}%) ide na 3 računa kod ERSTE Banka DOO Smederevo (dinarski RSD, devizni EUR, devizni USD). Preostalih ${OPERATIVNA_REZERVA}% ide na račun Digitalne Industrije u AI IQ World Bank. Ništa ne ostaje neraspoređeno — 100% je pokriveno.`,
      istaknuteStavke: dnevnaRaspodelaSistem.mogucnosti,
    },
  },
  {
    id: 'dnevna-raspodela-baner',
    tip: 'baner',
    naslov: '💰 Transparentna raspodela — 100% pokriveno',
    redosled: 7,
    podaci: {
      bedz: '🏦 Finansije',
      opis: `${KOMPANIJA} — svaki dinar dnevnog dobita je raspoređen: ${PROCENAT_RASPODELE}% na 3 ERSTE računa i ${OPERATIVNA_REZERVA}% na Digitalnu Industriju u AI IQ World Bank. Automatski, transparentno, proverljivo.`,
      dugme: { tekst: 'SPAJA Banka →', href: '/banka' },
    },
  },
  {
    id: 'dnevna-raspodela-cta',
    tip: 'cta',
    naslov: '🚀 Finansijski sistem Digitalne Industrije',
    redosled: 8,
    podaci: {
      opis: `${KOMPANIJA} — kompletna finansijska infrastruktura sa ERSTE Bankom Smederevo i AI IQ World Bank. ${racuniRaspodela.length + 1} računa, automatska raspodela, ${primerSimulacije.length} simulacija.`,
      stavke: [
        { naziv: 'ERSTE računi', vrednost: racuniRaspodela.length, ikona: '🏦' },
        { naziv: 'DI račun', vrednost: 1, ikona: '🏭' },
        { naziv: 'Raspodela', vrednost: '100%', ikona: '✅' },
        { naziv: 'Simulacija', vrednost: primerSimulacije.length, ikona: '📈' },
        { naziv: 'Valuta', vrednost: '3 (RSD/EUR/USD)', ikona: '💱' },
      ],
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
        { tekst: 'Nabavka', href: '/glavni-sistem-nabavka', stil: 'sekundarno' },
      ],
    },
  },
];
