import type { Sekvenca } from '@/lib/types';
import { buildGeneratorZaPoslovneRacune } from '@/lib/generator-za-poslovne-racune';

const r = buildGeneratorZaPoslovneRacune('system');

export const generatorZaPoslovneRacuneSekvence: Sekvenca[] = [
  {
    id: 'generator-poslovni-racuni-hero',
    tip: 'hero',
    naslov: '🏦 Generator za Poslovne Račune',
    podnaslov: 'AI IQ World Bank — simulacioni generator za korisničke poslovne račune',
    ikona: '🏦',
    redosled: 1,
    podaci: {
      opis:
        'Kroz v1 scope korisnik dobija poslovne račune u RSD/EUR/USD formatu sa validacijama, IBAN-like izlazom, limitima i audit tragom.',
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/banka' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'generator-poslovni-racuni-statistika',
    tip: 'statistika',
    naslov: '📊 Generator — pregled',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno računa', vrednost: r.summary.ukupnoRacuna, ikona: '🧾' },
        { naziv: 'Aktivni', vrednost: r.summary.aktivnihRacuna, ikona: '✅' },
        { naziv: 'Predlozi', vrednost: r.summary.predloga, ikona: '📝' },
        { naziv: 'KYC verifikovan', vrednost: r.summary.verifikovanKyc ? 'da' : 'ne', ikona: '🛡️' },
      ],
    },
  },
  {
    id: 'generator-poslovni-racuni-formalni-racun',
    tip: 'tekst',
    naslov: '🧾 Formalni račun (issuer/owner/phone)',
    redosled: 3,
    podaci: {
      sadrzaj:
        'Generator izlaže formalni invoice blok za AI IQ WORLD BANK, sa vlasnikom, telefonom i statusom (draft/verified).',
      istaknuteStavke: [
        `🏦 Issuer: ${r.formalniRacun.issuer}`,
        `👤 Owner: ${r.formalniRacun.ownerName}`,
        `📱 Phone: ${r.formalniRacun.ownerPhone}`,
        `🧾 Owner račun: ${r.formalniRacun.ownerAccountId}`,
        `📌 Status: ${r.formalniRacun.status}`,
      ],
    },
  },
  {
    id: 'generator-poslovni-racuni-tabela',
    tip: 'tabela',
    naslov: '📋 Generisani računi',
    redosled: 4,
    podaci: {
      zaglavlje: ['Tip', 'Valuta', 'Status', 'Broj računa', 'IBAN-like', 'Dnevni limit', 'Mesečni limit'],
      redovi: r.racuni.map((racun) => [
        racun.tip,
        racun.valuta,
        racun.status,
        racun.brojRacuna,
        racun.ibanLike,
        String(racun.limitDnevno),
        String(racun.limitMesecno),
      ]),
    },
  },
  {
    id: 'generator-poslovni-racuni-compliance',
    tip: 'kartice',
    naslov: '⚖️ Compliance i validacije',
    redosled: 5,
    podaci: {
      kartice: r.racuni.map((racun) => ({
        naslov: `${racun.tip} (${racun.valuta})`,
        opis: `Status: ${racun.status}. KYC/KYB: ${racun.metadata.kycKybStatus}.`,
        ikona: racun.status === 'aktivan' ? '✅' : '🛠️',
        oznake: racun.validacije.map((v) => `${v.polje}:${v.status}`),
      })),
    },
  },
  {
    id: 'generator-poslovni-racuni-preporuke',
    tip: 'lista',
    naslov: '🧠 Sledeći koraci',
    redosled: 6,
    podaci: {
      stavke: r.preporuke.map((item) => ({ ikona: '➡️', naslov: 'Preporuka', opis: item })),
    },
  },
  {
    id: 'generator-poslovni-racuni-cta',
    tip: 'cta',
    naslov: '🚀 Aktiviraj tok poslovnih računa',
    redosled: 7,
    podaci: {
      opis:
        'Generator je simulacioni (in-memory) i spreman za dalju integraciju sa poslovnim novčanikom, menjačnicom i operativnim bankarskim tokovima.',
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
        { tekst: 'API endpoint', href: '/api/generator-za-poslovne-racune', stil: 'sekundarno' },
      ],
    },
  },
];
