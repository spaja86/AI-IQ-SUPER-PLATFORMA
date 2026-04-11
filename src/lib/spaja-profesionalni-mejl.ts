/**
 * 📧 SPAJA Profesionalni Mejl Sistem — Email Generator Engine
 *
 * Profesionalni mejl sistem generisan kroz SPAJA Generator za Endžine.
 * Svaki korisnik dobija profesionalni mejl sa bankovnim računom.
 * Svaka OMEGA AI persona ima industrijski mejl za suport.
 *
 * Generisan kroz: SPAJA Generator za Endžine + Profesionalni mejl sistem
 * Link: https://chatgpt.com/c/696e2c9d-36d8-832f-9771-7fcc834f4df6
 *
 * Domeni:
 *  - @spaja.rs — korisnici i zaposleni
 *  - @omega-ai.spaja.rs — OMEGA AI persona suport
 *  - @banka.spaja.rs — bankarski mejlovi
 *  - @industrija.spaja.rs — industrijski mejlovi
 *
 * Funkcije:
 *  1. Generator korisničkih mejlova — ime.prezime@spaja.rs
 *  2. Generator bankarskih mejlova — sa IBAN brojem u potpisu
 *  3. OMEGA AI suport mejlovi — 21 persona, 9 departmana
 *  4. Šabloni profesionalnih mejlova — poslovni, bankarski, suport
 *  5. Notifikacioni sistem — transakcije, pretplate, verifikacije
 *  6. Newsletter engine — marketing, update, onboarding
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import {
  APP_VERSION,
  APP_NAME,
  KOMPANIJA,
  OMEGA_AI_PERSONA_COUNT,
  OMEGA_AI_PERSONA_UKUPNO,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type MejlDomen =
  | '@spaja.rs'
  | '@omega-ai.spaja.rs'
  | '@banka.spaja.rs'
  | '@industrija.spaja.rs';

export type MejlTip =
  | 'korisnicki'
  | 'bankarski'
  | 'suport'
  | 'notifikacija'
  | 'newsletter'
  | 'marketing'
  | 'verifikacija'
  | 'transakcija';

export type MejlPrioritet = 'hitan' | 'visok' | 'normalan' | 'nizak';

export type SablonKategorija =
  | 'dobrodoslica'
  | 'verifikacija'
  | 'transakcija'
  | 'pretplata'
  | 'podrska'
  | 'newsletter'
  | 'marketing'
  | 'upozorenje';

// ─── Interfejsi ──────────────────────────────────────────

export interface ProfesionalniMejl {
  id: string;
  adresa: string;
  domen: MejlDomen;
  vlasnik: string;
  tip: MejlTip;
  bankovniRacun?: string;
  ibanBroj?: string;
  potpis: string;
  aktivan: boolean;
}

export interface MejlSablon {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: SablonKategorija;
  predmet: string;
  teloHtml: string;
  teloTekst: string;
  promenljive: string[];
}

export interface MejlNotifikacija {
  id: string;
  tip: MejlTip;
  primalac: string;
  posiljalac: string;
  predmet: string;
  telo: string;
  prioritet: MejlPrioritet;
  poslat: boolean;
  timestamp: string;
}

export interface MejlGeneratorKonfiguracija {
  smtpServer: string;
  smtpPort: number;
  smtpKorisnik: string;
  smtpLozinka: string;
  tls: boolean;
  maxMejlovaDnevno: number;
  retryBroj: number;
  domeni: MejlDomen[];
}

export interface ProfesionalniMejlSistem {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  domeni: MejlDomen[];
  sabloni: MejlSablon[];
  konfiguracija: MejlGeneratorKonfiguracija;
  mogucnosti: string[];
  statistika: {
    ukupnoMejlova: number;
    ukupnoSablona: number;
    ukupnoNotifikacija: number;
    ukupnoDomena: number;
    ukupnoPersona: number;
    ukupnoPersonaGlobalno: number;
  };
  status: 'aktivan' | 'konfiguracija';
}

// ─── Šabloni Profesionalnih Mejlova ─────────────────────

export const mejlSabloni: MejlSablon[] = [
  {
    id: 'sablon-dobrodoslica',
    naziv: 'Dobrodošlica — Novi Korisnik',
    opis: 'Mejl dobrodošlice za novog korisnika platforme sa uputstvima za početak rada',
    ikona: '👋',
    kategorija: 'dobrodoslica',
    predmet: 'Dobrodošli na {{platformaNaziv}} — Vaš nalog je kreiran!',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#2563eb">👋 Dobrodošli, {{imeKorisnika}}!</h1>
  <p>Vaš nalog na <strong>{{platformaNaziv}}</strong> je uspešno kreiran.</p>
  <p>Vaša mejl adresa: <strong>{{mejlAdresa}}</strong></p>
  <ul>
    <li>Pristupite kontrolnoj tabli</li>
    <li>Podesite profil i preferencije</li>
    <li>Istražite OMEGA AI suport</li>
  </ul>
  <a href="{{loginLink}}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px">Prijavite se</a>
  <p style="margin-top:24px;color:#6b7280">Srdačan pozdrav,<br>{{kompanija}}</p>
</div>`,
    teloTekst: `Dobrodošli, {{imeKorisnika}}!

Vaš nalog na {{platformaNaziv}} je uspešno kreiran.
Vaša mejl adresa: {{mejlAdresa}}

Početni koraci:
- Pristupite kontrolnoj tabli
- Podesite profil i preferencije
- Istražite OMEGA AI suport

Prijavite se: {{loginLink}}

Srdačan pozdrav,
{{kompanija}}`,
    promenljive: ['imeKorisnika', 'platformaNaziv', 'mejlAdresa', 'loginLink', 'kompanija'],
  },
  {
    id: 'sablon-verifikacija',
    naziv: 'Verifikacija Mejla',
    opis: 'Mejl za verifikaciju mejl adrese korisnika sa jednokratnim kodom',
    ikona: '✅',
    kategorija: 'verifikacija',
    predmet: 'Verifikujte vašu mejl adresu — {{platformaNaziv}}',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#2563eb">✅ Verifikacija mejl adrese</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>Vaš verifikacioni kod je:</p>
  <div style="text-align:center;margin:24px 0">
    <span style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#2563eb">{{verifikacioniKod}}</span>
  </div>
  <p>Kod ističe za <strong>{{isticeZa}}</strong> minuta.</p>
  <p>Ako niste vi zatražili verifikaciju, ignorišite ovaj mejl.</p>
  <p style="margin-top:24px;color:#6b7280">{{kompanija}} — Bezbednosni tim</p>
</div>`,
    teloTekst: `Verifikacija mejl adrese

Poštovani {{imeKorisnika}},

Vaš verifikacioni kod je: {{verifikacioniKod}}

Kod ističe za {{isticeZa}} minuta.

Ako niste vi zatražili verifikaciju, ignorišite ovaj mejl.

{{kompanija}} — Bezbednosni tim`,
    promenljive: ['imeKorisnika', 'verifikacioniKod', 'isticeZa', 'platformaNaziv', 'kompanija'],
  },
  {
    id: 'sablon-transakcija',
    naziv: 'Potvrda Transakcije',
    opis: 'Mejl potvrde bankarske transakcije sa detaljima i IBAN brojem',
    ikona: '💳',
    kategorija: 'transakcija',
    predmet: 'Potvrda transakcije #{{transakcijaId}} — {{iznos}} {{valuta}}',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#16a34a">💳 Transakcija uspešna</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>ID transakcije</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{transakcijaId}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Iznos</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{iznos}} {{valuta}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Primalac</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{primalac}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>IBAN</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{ibanBroj}}</td></tr>
    <tr><td style="padding:8px"><strong>Datum</strong></td><td style="padding:8px">{{datum}}</td></tr>
  </table>
  <p style="margin-top:24px;color:#6b7280">{{kompanija}} — AI IQ World Bank</p>
</div>`,
    teloTekst: `Transakcija uspešna

Poštovani {{imeKorisnika}},

ID transakcije: {{transakcijaId}}
Iznos: {{iznos}} {{valuta}}
Primalac: {{primalac}}
IBAN: {{ibanBroj}}
Datum: {{datum}}

{{kompanija}} — AI IQ World Bank`,
    promenljive: ['imeKorisnika', 'transakcijaId', 'iznos', 'valuta', 'primalac', 'ibanBroj', 'datum', 'kompanija'],
  },
  {
    id: 'sablon-pretplata',
    naziv: 'Potvrda Pretplate',
    opis: 'Mejl potvrde aktivacije pretplate sa detaljima plana i plaćanja',
    ikona: '⭐',
    kategorija: 'pretplata',
    predmet: 'Pretplata aktivirana — {{planNaziv}} | {{platformaNaziv}}',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#7c3aed">⭐ Pretplata aktivirana!</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>Vaša pretplata na plan <strong>{{planNaziv}}</strong> je uspešno aktivirana.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Plan</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{planNaziv}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Cena</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{cena}}/mesečno</td></tr>
    <tr><td style="padding:8px"><strong>Sledeće plaćanje</strong></td><td style="padding:8px">{{sledecePlacanje}}</td></tr>
  </table>
  <a href="{{upravljanjePretplatom}}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px">Upravljajte pretplatom</a>
  <p style="margin-top:24px;color:#6b7280">{{kompanija}}</p>
</div>`,
    teloTekst: `Pretplata aktivirana!

Poštovani {{imeKorisnika}},

Vaša pretplata na plan {{planNaziv}} je uspešno aktivirana.

Plan: {{planNaziv}}
Cena: {{cena}}/mesečno
Sledeće plaćanje: {{sledecePlacanje}}

Upravljajte pretplatom: {{upravljanjePretplatom}}

{{kompanija}}`,
    promenljive: ['imeKorisnika', 'planNaziv', 'cena', 'sledecePlacanje', 'upravljanjePretplatom', 'platformaNaziv', 'kompanija'],
  },
  {
    id: 'sablon-reset-lozinke',
    naziv: 'Resetovanje Lozinke',
    opis: 'Mejl za resetovanje lozinke sa sigurnosnim linkom i vremenskim ograničenjem',
    ikona: '🔑',
    kategorija: 'podrska',
    predmet: 'Zahtev za resetovanje lozinke — {{platformaNaziv}}',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#dc2626">🔑 Resetovanje lozinke</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>Primili smo zahtev za resetovanje vaše lozinke. Kliknite na dugme ispod da postavite novu lozinku:</p>
  <div style="text-align:center;margin:24px 0">
    <a href="{{resetLink}}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px">Resetujte lozinku</a>
  </div>
  <p>Link ističe za <strong>{{isticeZa}}</strong> minuta.</p>
  <p>Ako niste vi zatražili resetovanje, odmah kontaktirajte naš bezbednosni tim.</p>
  <p style="margin-top:24px;color:#6b7280">{{kompanija}} — Bezbednosni tim</p>
</div>`,
    teloTekst: `Resetovanje lozinke

Poštovani {{imeKorisnika}},

Primili smo zahtev za resetovanje vaše lozinke.

Resetujte lozinku: {{resetLink}}

Link ističe za {{isticeZa}} minuta.

Ako niste vi zatražili resetovanje, odmah kontaktirajte naš bezbednosni tim.

{{kompanija}} — Bezbednosni tim`,
    promenljive: ['imeKorisnika', 'resetLink', 'isticeZa', 'platformaNaziv', 'kompanija'],
  },
  {
    id: 'sablon-newsletter',
    naziv: 'Newsletter — Mesečni Update',
    opis: 'Mesečni newsletter sa novostima, ažuriranjima i novim funkcionalnostima platforme',
    ikona: '📰',
    kategorija: 'newsletter',
    predmet: '📰 {{platformaNaziv}} Newsletter — {{mesec}} {{godina}}',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#2563eb">📰 Mesečni Newsletter</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>Evo šta je novo na <strong>{{platformaNaziv}}</strong> ovog meseca:</p>
  <h2 style="color:#1e40af">🚀 Nove funkcionalnosti</h2>
  <p>{{noveFunkcionalnosti}}</p>
  <h2 style="color:#1e40af">📊 Statistika meseca</h2>
  <p>{{statistikaMeseca}}</p>
  <h2 style="color:#1e40af">🔜 Uskoro dolazi</h2>
  <p>{{uskoroDolazi}}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
  <p style="color:#6b7280;font-size:12px">Primate ovaj mejl jer ste pretplaćeni na newsletter. <a href="{{odjaviLink}}">Odjavite se</a></p>
</div>`,
    teloTekst: `Mesečni Newsletter — {{mesec}} {{godina}}

Poštovani {{imeKorisnika}},

Evo šta je novo na {{platformaNaziv}} ovog meseca:

🚀 Nove funkcionalnosti:
{{noveFunkcionalnosti}}

📊 Statistika meseca:
{{statistikaMeseca}}

🔜 Uskoro dolazi:
{{uskoroDolazi}}

---
Primate ovaj mejl jer ste pretplaćeni na newsletter.
Odjavite se: {{odjaviLink}}`,
    promenljive: ['imeKorisnika', 'platformaNaziv', 'mesec', 'godina', 'noveFunkcionalnosti', 'statistikaMeseca', 'uskoroDolazi', 'odjaviLink'],
  },
  {
    id: 'sablon-marketing',
    naziv: 'Marketing Kampanja',
    opis: 'Mejl za marketing kampanje sa promotivnim sadržajem i pozivom na akciju',
    ikona: '📣',
    kategorija: 'marketing',
    predmet: '🎁 {{kampanjaNaziv}} — Ekskluzivna ponuda za vas!',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <h1 style="color:#ea580c">🎁 {{kampanjaNaziv}}</h1>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>{{kampanjaOpis}}</p>
  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;margin:16px 0;text-align:center">
    <p style="font-size:24px;font-weight:bold;color:#ea580c">{{popust}}</p>
    <p>Koristite kod: <strong>{{promoKod}}</strong></p>
    <p style="font-size:12px;color:#9a3412">Važi do: {{vaziDo}}</p>
  </div>
  <a href="{{akcijskiLink}}" style="display:inline-block;padding:12px 24px;background:#ea580c;color:#fff;text-decoration:none;border-radius:6px">Iskoristite ponudu</a>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
  <p style="color:#6b7280;font-size:12px"><a href="{{odjaviLink}}">Odjavite se</a> od marketing poruka</p>
</div>`,
    teloTekst: `{{kampanjaNaziv}}

Poštovani {{imeKorisnika}},

{{kampanjaOpis}}

Popust: {{popust}}
Promo kod: {{promoKod}}
Važi do: {{vaziDo}}

Iskoristite ponudu: {{akcijskiLink}}

---
Odjavite se od marketing poruka: {{odjaviLink}}`,
    promenljive: ['imeKorisnika', 'kampanjaNaziv', 'kampanjaOpis', 'popust', 'promoKod', 'vaziDo', 'akcijskiLink', 'odjaviLink'],
  },
  {
    id: 'sablon-bezbednost',
    naziv: 'Upozorenje o Bezbednosti',
    opis: 'Hitno bezbednosno upozorenje o sumnjivoj aktivnosti na nalogu korisnika',
    ikona: '🚨',
    kategorija: 'upozorenje',
    predmet: '🚨 Bezbednosno upozorenje — Detektovana sumnjiva aktivnost',
    teloHtml: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#fef2f2;border:2px solid #dc2626;border-radius:8px;padding:16px;margin-bottom:16px">
    <h1 style="color:#dc2626;margin:0">🚨 Bezbednosno upozorenje</h1>
  </div>
  <p>Poštovani {{imeKorisnika}},</p>
  <p>Detektovali smo <strong>sumnjivu aktivnost</strong> na vašem nalogu:</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Aktivnost</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{opisAktivnosti}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>IP adresa</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{ipAdresa}}</td></tr>
    <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb"><strong>Lokacija</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb">{{lokacija}}</td></tr>
    <tr><td style="padding:8px"><strong>Vreme</strong></td><td style="padding:8px">{{vreme}}</td></tr>
  </table>
  <p>Ako ste to bili vi, ignorišite ovaj mejl. U suprotnom:</p>
  <a href="{{zastitaLink}}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px">Zaštitite nalog</a>
  <p style="margin-top:24px;color:#6b7280">{{kompanija}} — Bezbednosni tim<br>Kontakt: bezbednost@spaja.rs</p>
</div>`,
    teloTekst: `🚨 BEZBEDNOSNO UPOZORENJE

Poštovani {{imeKorisnika}},

Detektovali smo sumnjivu aktivnost na vašem nalogu:

Aktivnost: {{opisAktivnosti}}
IP adresa: {{ipAdresa}}
Lokacija: {{lokacija}}
Vreme: {{vreme}}

Ako ste to bili vi, ignorišite ovaj mejl.
U suprotnom, zaštitite nalog: {{zastitaLink}}

{{kompanija}} — Bezbednosni tim
Kontakt: bezbednost@spaja.rs`,
    promenljive: ['imeKorisnika', 'opisAktivnosti', 'ipAdresa', 'lokacija', 'vreme', 'zastitaLink', 'kompanija'],
  },
];

// ─── Konfiguracija Generatora ────────────────────────────

const mejlGeneratorKonfiguracija: MejlGeneratorKonfiguracija = {
  smtpServer: 'smtp.spaja.rs',
  smtpPort: 587,
  smtpKorisnik: 'sistem@spaja.rs',
  smtpLozinka: '***',
  tls: true,
  maxMejlovaDnevno: 50_000,
  retryBroj: 3,
  domeni: ['@spaja.rs', '@omega-ai.spaja.rs', '@banka.spaja.rs', '@industrija.spaja.rs'],
};

// ─── Kompletni Profesionalni Mejl Sistem ─────────────────

export const profesionalniMejlSistem: ProfesionalniMejlSistem = {
  naziv: 'SPAJA Profesionalni Mejl Sistem',
  opis:
    `Profesionalni mejl sistem za ${APP_NAME} generisan kroz SPAJA Generator za Endžine. ` +
    `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona (${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} ukupno) ` +
    `pruža suport preko 4 domena. Verzija: ${APP_VERSION}. Izvor: ${KOMPANIJA}.`,
  ikona: '📧',
  verzija: APP_VERSION,
  domeni: ['@spaja.rs', '@omega-ai.spaja.rs', '@banka.spaja.rs', '@industrija.spaja.rs'],
  sabloni: mejlSabloni,
  konfiguracija: mejlGeneratorKonfiguracija,
  mogucnosti: [
    'Generisanje korisničkih mejlova (ime.prezime@spaja.rs)',
    'Generisanje bankarskih mejlova sa IBAN potpisom',
    'OMEGA AI suport mejlovi za 21 personu i 9 departmana',
    'Profesionalni šabloni za poslovne mejlove',
    'Notifikacioni sistem za transakcije i pretplate',
    'Newsletter engine za marketing i onboarding',
    'Verifikacioni mejlovi sa jednokratnim kodovima',
    'Bezbednosna upozorenja i monitoring naloga',
    'Multi-domenski sistem (@spaja.rs, @omega-ai.spaja.rs, @banka.spaja.rs, @industrija.spaja.rs)',
    'TLS enkripcija za sve mejlove',
    'Retry mehanizam za neuspešna slanja',
    `Dnevni limit: ${mejlGeneratorKonfiguracija.maxMejlovaDnevno.toLocaleString()} mejlova`,
  ],
  statistika: {
    ukupnoMejlova: mejlGeneratorKonfiguracija.maxMejlovaDnevno,
    ukupnoSablona: mejlSabloni.length,
    ukupnoNotifikacija: 0,
    ukupnoDomena: 4,
    ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
    ukupnoPersonaGlobalno: OMEGA_AI_PERSONA_UKUPNO,
  },
  status: 'aktivan',
};

// ─── Helper Funkcije ─────────────────────────────────────

export function getSablon(id: string): MejlSablon | undefined {
  return mejlSabloni.find((s) => s.id === id);
}

export function getSabloniPoKategoriji(kat: SablonKategorija): MejlSablon[] {
  return mejlSabloni.filter((s) => s.kategorija === kat);
}

function normalizujSrpskiTekst(tekst: string): string {
  const mapa: Record<string, string> = { č: 'c', ć: 'c', ž: 'z', š: 's', đ: 'dj' };
  return tekst.toLowerCase().replace(/[čćžšđ]/g, (c) => mapa[c] ?? c);
}

export function generisiMejlAdresu(ime: string, prezime: string, domen: MejlDomen): string {
  return `${normalizujSrpskiTekst(ime)}.${normalizujSrpskiTekst(prezime)}${domen}`;
}

export function generisiBankarskiPotpis(ime: string, iban: string): string {
  return [
    '—————————————————————————————',
    `${ime}`,
    `IBAN: ${iban}`,
    `${KOMPANIJA} — AI IQ World Bank`,
    `Mejl: banka@banka.spaja.rs`,
    '—————————————————————————————',
  ].join('\n');
}

export function getMejlSistemPregled() {
  return {
    naziv: profesionalniMejlSistem.naziv,
    verzija: profesionalniMejlSistem.verzija,
    status: profesionalniMejlSistem.status,
    ukupnoDomena: profesionalniMejlSistem.domeni.length,
    domeni: profesionalniMejlSistem.domeni,
    ukupnoSablona: mejlSabloni.length,
    sabloniPoKategoriji: {
      dobrodoslica: getSabloniPoKategoriji('dobrodoslica').length,
      verifikacija: getSabloniPoKategoriji('verifikacija').length,
      transakcija: getSabloniPoKategoriji('transakcija').length,
      pretplata: getSabloniPoKategoriji('pretplata').length,
      podrska: getSabloniPoKategoriji('podrska').length,
      newsletter: getSabloniPoKategoriji('newsletter').length,
      marketing: getSabloniPoKategoriji('marketing').length,
      upozorenje: getSabloniPoKategoriji('upozorenje').length,
    },
    ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
    ukupnoPersonaGlobalno: OMEGA_AI_PERSONA_UKUPNO,
    mogucnosti: profesionalniMejlSistem.mogucnosti.length,
    izvor: KOMPANIJA,
  };
}
