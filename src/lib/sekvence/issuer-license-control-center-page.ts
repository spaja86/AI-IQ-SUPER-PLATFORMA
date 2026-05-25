import type { Sekvenca } from '@/lib/types';
import { buildIssuerLicensingState } from '@/lib/issuer-licensing';

const issuer = buildIssuerLicensingState();

export const issuerLicenseControlCenterSekvence: Sekvenca[] = [
  {
    id: 'issuer-licensing-hero',
    tip: 'hero',
    naslov: '🪪 Issuer License Control Center',
    podnaslov: 'Ovlašćenja za izdavanje licenci trećim licima',
    ikona: '🪪',
    redosled: 1,
    podaci: {
      opis:
        'Kontrolni centar za issuer lifecycle: od zahteva i odobrenja do finalnog izdavanja, ' +
        'compliance izveštaja i expirations nadzora.',
      dugmad: [
        { tekst: 'Issuer Overview API', href: '/api/issuer-licensing' },
        { tekst: 'Issuer Compliance API', href: '/api/issuer-licensing/compliance', stil: 'sekundarno' },
        { tekst: 'Issuer Expirations API', href: '/api/issuer-licensing/expirations?windowDays=90', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'issuer-licensing-kpi',
    tip: 'statistika',
    naslov: '📊 KPI — Issuer readiness',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno ovlašćenja', vrednost: issuer.summary.ukupnoOvlascenja, ikona: '📄' },
        { naziv: 'Odobreno', vrednost: issuer.summary.odobreno, ikona: '✅' },
        { naziv: 'U proveri', vrednost: issuer.summary.uProveri, ikona: '🔎' },
        { naziv: 'Suspendovano', vrednost: issuer.summary.suspendovano, ikona: '⛔' },
        { naziv: 'Izdato 30d', vrednost: issuer.summary.izdatoPoslednjih30Dana, ikona: '🧾' },
        { naziv: 'Iskorišćenje kvote', vrednost: `${issuer.summary.procenatKvota}%`, ikona: '📈' },
      ],
    },
  },
  {
    id: 'issuer-licensing-authorities',
    tip: 'tabela',
    naslov: '📋 Ovlašćenja za izdavanje',
    redosled: 3,
    podaci: {
      zaglavlje: ['Entitet', 'Naziv', 'Kategorija', 'Status', 'Kvota', 'Izdato', 'Sublicenca'],
      redovi: issuer.authorities.map((a) => [
        a.issuerEntitet,
        a.naziv,
        a.kategorija,
        a.status,
        a.kvotaUkupno === null ? 'neograničeno' : String(a.kvotaUkupno),
        String(a.izdatoDoSada),
        a.sublicenciranjeDozvoljeno ? 'da' : 'ne',
      ]),
    },
  },
  {
    id: 'issuer-licensing-blockers',
    tip: 'kartice',
    naslov: '🚨 Blokatori issuer izdavanja',
    redosled: 4,
    podaci: {
      kartice: issuer.blockers.slice(0, 10).map((b) => ({
        naslov: b.naziv,
        opis: `${b.razlog} (status: ${b.status}, prioritet: ${b.prioritet})`,
        ikona: b.prioritet === 'kriticno' ? '🚨' : b.prioritet === 'visoko' ? '⚠️' : 'ℹ️',
        oznake: [b.status, b.prioritet],
      })),
    },
  },
  {
    id: 'issuer-licensing-pending',
    tip: 'lista',
    naslov: '⏳ Čeka odobrenje',
    redosled: 5,
    podaci: {
      stavke: issuer.pendingApproval.map((a) => ({
        ikona: a.status === 'u_proveri' ? '🔎' : '📝',
        naslov: `${a.naziv} (${a.issuerEntitet})`,
        opis: `Status: ${a.status}. Pravni osnov: ${a.pravniOsnov}.`,
      })),
    },
  },
  {
    id: 'issuer-licensing-issued',
    tip: 'tabela',
    naslov: '🧾 Izdato iz ovlašćenja',
    redosled: 6,
    podaci: {
      zaglavlje: ['Primalac', 'Email', 'Ovlašćenje', 'Tip', 'Valid To', 'Kreirano'],
      redovi: issuer.issued.slice(0, 20).map((i) => [
        i.primalacNaziv,
        i.primalacEmail,
        i.authorityNaziv,
        i.izdavanjeTip,
        i.validTo ?? 'n/a',
        i.createdAt,
      ]),
    },
  },
];
