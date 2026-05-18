import type { Sekvenca } from '@/lib/types';
import {
  buildAIIQWorldBankLicencniRegistar,
  getLicencniComplianceIzvestaj,
} from '@/lib/aiiq-world-bank-licencni-registar';

const reg = buildAIIQWorldBankLicencniRegistar();
const mesecni = getLicencniComplianceIzvestaj('mesecni');
const kvartalni = getLicencniComplianceIzvestaj('kvartalni');

export const aiiqWorldBankLicencnaAnalizaSekvence: Sekvenca[] = [
  {
    id: 'aiiq-license-hero',
    tip: 'hero',
    naslov: '📑 AI IQ WORLD BANK — Licencna Analiza',
    podnaslov: 'Centralni registar licenci po poslovnim delatnostima sa gap analizom i nabavkom',
    ikona: '📑',
    redosled: 1,
    podaci: {
      opis:
        'Jedinstveni pregled: obavezne regulatorne, softverske i operativne licence; status, dokazi, istek i prioritet nabavke.',
      dugmad: [
        { tekst: 'Licencni registar API', href: '/api/aiiq-world-bank-licencni-registar' },
        { tekst: 'Gap izvestaj API', href: '/api/aiiq-world-bank-licencni-gap-izvestaj', stil: 'sekundarno' },
        { tekst: 'Nabavka status API', href: '/api/aiiq-world-bank-licencna-nabavka-status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'aiiq-license-kpi',
    tip: 'statistika',
    naslov: '📊 Coverage i rizik',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Delatnosti', vrednost: reg.delatnosti.length, ikona: '🏢' },
        { naziv: 'Ukupno licenci', vrednost: reg.licence.length, ikona: '📄' },
        { naziv: 'Otvoreni gapovi', vrednost: reg.gapovi.length, ikona: '⚠️' },
        { naziv: 'Kriticni gapovi', vrednost: reg.gapovi.filter((x) => x.rizik === 'kriticno').length, ikona: '🚨' },
        { naziv: 'Mesecni coverage', vrednost: `${mesecni.coverageProcenat}%`, ikona: '📆' },
        { naziv: 'Kvartalni coverage', vrednost: `${kvartalni.coverageProcenat}%`, ikona: '🗓️' },
      ],
    },
  },
  {
    id: 'aiiq-license-coverage-table',
    tip: 'tabela',
    naslov: '📋 Coverage po delatnostima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Delatnost', 'Ukupno licenci', 'Pokrivene', 'Coverage %'],
      redovi: reg.coveragePoDelatnosti.map((x) => [x.delatnost, String(x.ukupnoLicenci), String(x.pokrivene), `${x.procenat}%`]),
    },
  },
  {
    id: 'aiiq-license-gaps',
    tip: 'kartice',
    naslov: '🧩 Kriticni gapovi — kupiti sada',
    redosled: 4,
    podaci: {
      kartice: reg.gapovi.slice(0, 10).map((gap) => ({
        naslov: `${gap.delatnost} — ${gap.licenca}`,
        opis: `${gap.razlog} (status: ${gap.status}, rizik: ${gap.rizik}, prioritet: ${gap.prioritet})`,
        ikona: gap.rizik === 'kriticno' ? '🚨' : gap.rizik === 'visoko' ? '⚠️' : 'ℹ️',
        oznake: [gap.status, gap.rizik, `prioritet:${gap.prioritet}`],
      })),
    },
  },
  {
    id: 'aiiq-license-procurement',
    tip: 'lista',
    naslov: '🛒 Nabavka licenci — operativni tok',
    redosled: 5,
    podaci: {
      stavke: reg.nabavka.slice(0, 12).map((item) => ({
        ikona: item.status === 'u_toku' ? '🔄' : item.status === 'zavrseno' ? '✅' : '⏳',
        naslov: `${item.licenca} (${item.delatnost})`,
        opis: `Status: ${item.status}. Endpoint: ${item.b2bEndpoint}. Izvor: ${item.paymentSource}.`,
      })),
    },
  },
  {
    id: 'aiiq-license-cta',
    tip: 'cta',
    naslov: '✅ Compliance izveštaji i rokovi',
    redosled: 6,
    podaci: {
      opis:
        'Koristi mesečni/kvartalni izveštaj za kontinuiranu usklađenost, a expirations endpoint za preventivnu obnovu licenci pre isteka.',
      dugmad: [
        { tekst: 'Mesecni izvestaj', href: '/api/aiiq-world-bank-licencni-compliance-izvestaj?periodTip=mesecni' },
        { tekst: 'Kvartalni izvestaj', href: '/api/aiiq-world-bank-licencni-compliance-izvestaj?periodTip=kvartalni', stil: 'sekundarno' },
        { tekst: 'Expirations', href: '/api/aiiq-world-bank-licencni-expirations?windowDays=90', stil: 'sekundarno' },
      ],
    },
  },
];
