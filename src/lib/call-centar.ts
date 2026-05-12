/**
 * 📞 CALL CENTAR — Moblini SPAJA
 *
 * Eksponicioni kod malakogistuarnog transfera signala se manifestuje kroz
 * signalni vokal atrubitskog matričnog jedinjenja kroz alakoidni sistem.
 * U operativnom smislu: distribucija digitalnih instalacionih brojeva korisnicima
 * kroz call-centar tokove i dodelu paketa usluga.
 */

export type PaketTip = 'Starter' | 'Pro' | 'Enterprise' | 'VIP';

export interface LicencaPaketa {
  id: string;
  naziv: string;
  tip: PaketTip;
  instalacioniBroj: string;
  emailKorisnika: string;
  datumAktivacije: string;
  status: 'aktivna' | 'na_cekanju' | 'suspendovana';
}

export interface DigitalnaUsluga {
  id: string;
  naziv: string;
  opis: string;
  kategorija: 'instalacija' | 'podrska' | 'nadogradnja';
}

export interface PaketUsluga {
  id: string;
  naziv: string;
  tip: PaketTip;
  opis: string;
  cenaMesecnoEur: number;
  instalacioniOpseg: { od: number; do: number };
  usluge: string[];
}

export interface CallCentarAgent {
  id: string;
  ime: string;
  radnaStanica: string;
  status: 'aktivan' | 'slobodan' | 'pauza';
}

export interface CallCentarTiket {
  id: string;
  korisnikEmail: string;
  paketTip: PaketTip;
  opis: string;
  prioritet: 'nizak' | 'srednji' | 'visok';
  status: 'otvoren' | 'u_radu' | 'zatvoren';
  agentId: string;
}

export interface CallCentarIzvestaj {
  paketi: PaketUsluga[];
  agenti: CallCentarAgent[];
  aktivniTiketi: CallCentarTiket[];
  ukupanBrojLicenci: number;
}

export const callCentarDigitalneUsluge: DigitalnaUsluga[] = [
  {
    id: 'usluga-inst-remote-setup',
    naziv: 'Remote instalacija',
    opis: 'Digitalna aktivacija i inicijalno podešavanje paketa bez fizičke isporuke.',
    kategorija: 'instalacija',
  },
  {
    id: 'usluga-podrska-priority',
    naziv: 'Priority korisnička podrška',
    opis: 'Brzi odgovor call centra i digitalna asistencija tokom rada.',
    kategorija: 'podrska',
  },
  {
    id: 'usluga-upgrade-kapacitet',
    naziv: 'Nadogradnja kapaciteta',
    opis: 'Digitalni upgrade paketa i funkcionalnosti bez prekida usluge.',
    kategorija: 'nadogradnja',
  },
];

export const callCentarPaketi: PaketUsluga[] = [
  {
    id: 'paket-starter',
    naziv: 'Moblini SPAJA Starter',
    tip: 'Starter',
    opis: 'Osnovni digitalni paket za inicijalnu aktivaciju i standardnu podršku.',
    cenaMesecnoEur: 29,
    instalacioniOpseg: { od: 1000, do: 1999 },
    usluge: ['Remote instalacija', 'Email aktivacija', 'Standardna podrška'],
  },
  {
    id: 'paket-pro',
    naziv: 'Moblini SPAJA Pro',
    tip: 'Pro',
    opis: 'Napredni paket sa većim kapacitetom i prioritetnim odgovorom call centra.',
    cenaMesecnoEur: 79,
    instalacioniOpseg: { od: 2000, do: 4999 },
    usluge: ['Remote instalacija', 'Priority podrška', 'Brza nadogradnja'],
  },
  {
    id: 'paket-enterprise',
    naziv: 'Moblini SPAJA Enterprise',
    tip: 'Enterprise',
    opis: 'Enterprise digitalna usluga za timove sa SLA prioritetom.',
    cenaMesecnoEur: 199,
    instalacioniOpseg: { od: 5000, do: 8999 },
    usluge: ['Dedicated onboarding', 'SLA podrška', 'Napredna administracija'],
  },
  {
    id: 'paket-vip',
    naziv: 'Moblini SPAJA VIP',
    tip: 'VIP',
    opis: 'Premium paket sa 24/7 digitalnom podrškom i najvišim prioritetom.',
    cenaMesecnoEur: 399,
    instalacioniOpseg: { od: 9000, do: 9999 },
    usluge: ['24/7 podrška', 'VIP onboarding', 'Kontinuirani upgrade'],
  },
];

export const callCentarAgenti: CallCentarAgent[] = [
  { id: 'agent-01', ime: 'Ana Petrović', radnaStanica: 'CC-01', status: 'aktivan' },
  { id: 'agent-02', ime: 'Milan Jovanović', radnaStanica: 'CC-02', status: 'aktivan' },
  { id: 'agent-03', ime: 'Jelena Nikolić', radnaStanica: 'CC-03', status: 'slobodan' },
  { id: 'agent-04', ime: 'Marko Ilić', radnaStanica: 'CC-04', status: 'aktivan' },
  { id: 'agent-05', ime: 'Ivana Stanković', radnaStanica: 'CC-05', status: 'pauza' },
  { id: 'agent-06', ime: 'Nenad Milenković', radnaStanica: 'CC-06', status: 'aktivan' },
  { id: 'agent-07', ime: 'Sara Pavlović', radnaStanica: 'CC-07', status: 'slobodan' },
  { id: 'agent-08', ime: 'Vuk Krstić', radnaStanica: 'CC-08', status: 'aktivan' },
  { id: 'agent-09', ime: 'Nikola Simić', radnaStanica: 'CC-09', status: 'aktivan' },
  { id: 'agent-10', ime: 'Teodora Ristić', radnaStanica: 'CC-10', status: 'pauza' },
  { id: 'agent-11', ime: 'Luka Đorđević', radnaStanica: 'CC-11', status: 'aktivan' },
  { id: 'agent-12', ime: 'Mina Đukić', radnaStanica: 'CC-12', status: 'slobodan' },
];

const callCentarTiketi: CallCentarTiket[] = [
  {
    id: 'tiket-001',
    korisnikEmail: 'klijent1@example.com',
    paketTip: 'Pro',
    opis: 'Potreban upgrade na viši paket zbog rasta tima.',
    prioritet: 'srednji',
    status: 'u_radu',
    agentId: 'agent-02',
  },
  {
    id: 'tiket-002',
    korisnikEmail: 'klijent2@example.com',
    paketTip: 'Enterprise',
    opis: 'Verifikacija aktivacije instalacionog broja.',
    prioritet: 'visok',
    status: 'otvoren',
    agentId: 'agent-04',
  },
  {
    id: 'tiket-003',
    korisnikEmail: 'klijent3@example.com',
    paketTip: 'Starter',
    opis: 'Pitanje oko prvog logina i inicijalne konfiguracije.',
    prioritet: 'nizak',
    status: 'zatvoren',
    agentId: 'agent-07',
  },
];

const licence: LicencaPaketa[] = [];

function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidEmail(email: string): boolean {
  if (!email || email.includes(' ')) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0);
}

export function generisiInstalacioniBroj(tip: PaketTip): string {
  const paket = callCentarPaketi.find((p) => p.tip === tip);
  if (!paket) {
    throw new Error('Nepoznat tip paketa.');
  }

  const broj = randomIntInclusive(paket.instalacioniOpseg.od, paket.instalacioniOpseg.do);
  const prefiks = tip.toUpperCase();
  return `MS-${prefiks}-${String(broj).padStart(4, '0')}`;
}

export function posaljiEmailSaInstalacionimBrojem(
  emailKorisnika: string,
  instalacioniBroj: string,
  paketNaziv: string,
) {
  const predmet = `Moblini SPAJA aktivacija — ${paketNaziv}`;
  const poruka = `Poštovani, vaš instalacioni broj je ${instalacioniBroj}. Paket: ${paketNaziv}.`;

  console.log(`[CALL-CENTAR][EMAIL] ${emailKorisnika} | ${predmet} | ${poruka}`);

  return {
    status: 'poslato' as const,
    predmet,
    poruka,
    timestamp: new Date().toISOString(),
  };
}

export function dodeliPaketUsluga(emailKorisnika: string, tip: PaketTip): LicencaPaketa {
  if (!isValidEmail(emailKorisnika)) {
    throw new Error('Neispravna email adresa.');
  }

  const paket = callCentarPaketi.find((p) => p.tip === tip);
  if (!paket) {
    throw new Error('Nepoznat tip paketa.');
  }

  const instalacioniBroj = generisiInstalacioniBroj(tip);

  const licenca: LicencaPaketa = {
    id: `lic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    naziv: paket.naziv,
    tip,
    instalacioniBroj,
    emailKorisnika,
    datumAktivacije: new Date().toISOString(),
    status: 'aktivna',
  };

  licence.push(licenca);
  return licenca;
}

export function buildCallCentarIzvestaj(): CallCentarIzvestaj {
  return {
    paketi: callCentarPaketi,
    agenti: callCentarAgenti,
    aktivniTiketi: callCentarTiketi.filter((t) => t.status !== 'zatvoren'),
    ukupanBrojLicenci: licence.length,
  };
}
