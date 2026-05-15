/**
 * 🧠 MOZAK LOGIKA
 *
 * Inteligentni podsistem Glavnog Endžina za neprekidnu analizu, generisanje ideja,
 * projektnih planova i human-in-the-loop povratni odaziv.
 *
 * Model:
 *  - Operativni status — zdravlje ciklusa i status planiranja
 *  - Aktivni ciklusi — neprekidno orkestriranje, samoprocena i planiranje
 *  - Povezani sistemi — pregled kritičnih grupa endžina i sistema
 *  - Generisane ideje — ideje i vizije koje sistem predlaže
 *  - Projektni planovi — operativni planovi spremni za potvrdu ili izvršenje
 *  - Nepoznanice — oblasti koje zahtevaju ljudsku odluku
 *  - Review queue — human-in-the-loop zadaci za potvrdu
 *
 * Autofinish #1256
 */

import type {
  EvolucijaCiklus,
  GlavniEndzinStatistika,
  SpojeniEndzin,
} from './glavni-endzin-digitalne-industrije';
import type { EngineTip } from './spaja-generator-engine';

export type MozakLogikaStatus = 'aktivan' | 'sinhronizacija' | 'potrebna-potvrda';
export type MozakLogikaPrioritet = 'kritican' | 'visok' | 'srednji' | 'nizak';
export type MozakLogikaKlasifikacija =
  | 'auto-executable'
  | 'requires-confirmation'
  | 'blocked-unknown'
  | 'delegated-to-human';

export interface MozakLogikaInput {
  glavniEndzinId: string;
  glavniEndzinNaziv: string;
  glavniEndzinVerzija: string;
  statistika: GlavniEndzinStatistika;
  spojeniEndzini: SpojeniEndzin[];
  evolucija: EvolucijaCiklus[];
  mogucnosti: string[];
}

export interface MozakLogikaOperativniStatus {
  status: MozakLogikaStatus;
  radiNonStop: boolean;
  ciklusZdravlja: number;
  novihIdeja: number;
  reviewNaCekanju: number;
  povezanihSistema: number;
  planGenerisanjeStatus: 'aktivan' | 'sinhronizovan';
  backlogStatus: 'stabilan' | 'potrebna-potvrda';
}

export interface MozakLogikaCiklus {
  id: string;
  naziv: string;
  opis: string;
  status: 'aktivan' | 'sinhronizacija' | 'ceka-potvrdu';
  frekvencija: string;
  izlaz: string;
  povezaniSistemi: string[];
}

export interface MozakLogikaPovezaniSistem {
  id: string;
  naziv: string;
  tip: EngineTip;
  ukupnoEndzina: number;
  aktivnihEndzina: number;
  prioritet: MozakLogikaPrioritet;
  razlogPovezivanja: string;
}

export interface MozakLogikaIdeja {
  id: string;
  naslov: string;
  opis: string;
  kategorija: 'automatizacija' | 'analitika' | 'integracija' | 'rast' | 'vizija';
  prioritet: MozakLogikaPrioritet;
  uticaj: number;
  povezaniSistemi: string[];
  status: 'nova' | 'u-obradi' | 'ceka-potvrdu';
}

export interface MozakLogikaProjektniPlan {
  id: string;
  naziv: string;
  cilj: string;
  faze: string[];
  zavisnosti: string[];
  status: 'spreman' | 'ceka-potvrdu' | 'blokiran';
  naredniKorak: string;
}

export interface MozakLogikaNepoznanica {
  id: string;
  pitanje: string;
  razlog: string;
  preporucenaAkcija: string;
  prioritet: MozakLogikaPrioritet;
}

export interface MozakLogikaReviewStavka {
  id: string;
  naslov: string;
  klasifikacija: MozakLogikaKlasifikacija;
  prioritet: MozakLogikaPrioritet;
  razlog: string;
  pogodjeniSistemi: string[];
  narednaAkcija: string;
}

export interface MozakLogikaPovratniOdaziv {
  rezim: 'human-in-the-loop';
  ukupnoStavki: number;
  cekaPotvrdu: number;
  blokirano: number;
  delegirano: number;
  autoIzvrsivo: number;
  detaljniZadaci: string[];
}

export interface MozakLogikaSummary {
  engineId: string;
  engineNaziv: string;
  engineVerzija: string;
  rezim: 'orkestracija-i-potvrda';
  fokus: string;
  objasnjenje: string;
}

export interface MozakLogikaRezultat {
  status: MozakLogikaStatus;
  operativniStatus: MozakLogikaOperativniStatus;
  aktivniCiklusi: MozakLogikaCiklus[];
  povezaniSistemi: MozakLogikaPovezaniSistem[];
  generisaneIdeje: MozakLogikaIdeja[];
  projektniPlanovi: MozakLogikaProjektniPlan[];
  nepoznanice: MozakLogikaNepoznanica[];
  reviewQueue: MozakLogikaReviewStavka[];
  povratniOdaziv: MozakLogikaPovratniOdaziv;
  mozakLogikaSummary: MozakLogikaSummary;
  userId: string;
  timestamp: string;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function brojAktivnih(spojeniEndzini: SpojeniEndzin[], tip: EngineTip): number {
  return spojeniEndzini.filter((e) => e.tip === tip && e.status === 'aktivan').length;
}

function brojUkupno(spojeniEndzini: SpojeniEndzin[], tip: EngineTip): number {
  return spojeniEndzini.filter((e) => e.tip === tip).length;
}

function buildPovezaniSistemi(
  statistika: GlavniEndzinStatistika,
  spojeniEndzini: SpojeniEndzin[],
): MozakLogikaPovezaniSistem[] {
  return [
    {
      id: 'moz-log-core',
      naziv: 'Core orkestracija Glavnog Endžina',
      tip: 'core',
      ukupnoEndzina: statistika.coreEndžina,
      aktivnihEndzina: brojAktivnih(spojeniEndzini, 'core'),
      prioritet: 'kritican',
      razlogPovezivanja: 'Nosi centralnu koordinaciju svih tokova i sekvencijalnih odluka.',
    },
    {
      id: 'moz-log-ai',
      naziv: 'OMEGA AI i logičko rezonovanje',
      tip: 'ai',
      ukupnoEndzina: statistika.aiEndžina,
      aktivnihEndzina: brojAktivnih(spojeniEndzini, 'ai'),
      prioritet: 'kritican',
      razlogPovezivanja: 'Koristi AI persone za samoprocenu, ideje i predloge planova.',
    },
    {
      id: 'moz-log-mreza',
      naziv: 'Mreža, deploy i komunikacija',
      tip: 'mreza',
      ukupnoEndzina: statistika.mrezaEndžina + statistika.deployEndžina + statistika.komunikacijaEndžina,
      aktivnihEndzina:
        brojAktivnih(spojeniEndzini, 'mreza') +
        brojAktivnih(spojeniEndzini, 'deploy') +
        brojAktivnih(spojeniEndzini, 'komunikacija'),
      prioritet: 'visok',
      razlogPovezivanja: 'Povezuje eksterne sisteme, monitoring i tokove povratnog odaziva.',
    },
    {
      id: 'moz-log-finansije',
      naziv: 'Finansijski i poslovni sistemi',
      tip: 'finansije',
      ukupnoEndzina: statistika.finansijeEndžina,
      aktivnihEndzina: brojAktivnih(spojeniEndzini, 'finansije'),
      prioritet: 'visok',
      razlogPovezivanja: 'Traži potvrdu za odluke sa budžetskim, billing i nabavnim posledicama.',
    },
    {
      id: 'moz-log-gaming',
      naziv: 'Gaming, laboratorija i simulacije',
      tip: 'gaming',
      ukupnoEndzina: statistika.gamingEndžina,
      aktivnihEndzina: brojAktivnih(spojeniEndzini, 'gaming'),
      prioritet: 'srednji',
      razlogPovezivanja: 'Koristi simulacije i eksperimente za proveru novih ideja i vizija.',
    },
    {
      id: 'moz-log-repo',
      naziv: 'Repo i bezbednosni endžini',
      tip: 'repo-engine',
      ukupnoEndzina: statistika.repoEndžina + statistika.bezbednostEndžina,
      aktivnihEndzina:
        brojAktivnih(spojeniEndzini, 'repo-engine') +
        brojAktivnih(spojeniEndzini, 'bezbednost'),
      prioritet: 'visok',
      razlogPovezivanja: 'Prati kod, validaciju i granice autonomnog izvršavanja.',
    },
  ];
}

function buildAktivniCiklusi(
  input: MozakLogikaInput,
  povezaniSistemi: MozakLogikaPovezaniSistem[],
): MozakLogikaCiklus[] {
  return [
    {
      id: 'ciklus-neprekidna-orkestracija',
      naziv: 'Neprekidna orkestracija',
      opis: `Glavni Endžin prati ${input.statistika.ukupnoSpojenih} spojenih endžina i održava ih u sinhronizaciji.`,
      status: 'aktivan',
      frekvencija: 'non-stop',
      izlaz: 'stabilna orkestracija i zdravo stanje sistema',
      povezaniSistemi: povezaniSistemi.slice(0, 3).map((s) => s.naziv),
    },
    {
      id: 'ciklus-samoanaliza',
      naziv: 'Samoanaliza i dijagnostika',
      opis: `Samoprocena koristi ${input.evolucija.length} evolucionih ciklusa i ${input.statistika.autofinishIteracija} autofinish iteracija za procenu rizika.`,
      status: 'aktivan',
      frekvencija: 'na svaki ciklus odluke',
      izlaz: 'otkrivene nepoznanice i prioriteti za pregled',
      povezaniSistemi: ['OMEGA AI i logičko rezonovanje', 'Repo i bezbednosni endžini'],
    },
    {
      id: 'ciklus-sakupljanje-ideja',
      naziv: 'Sakupljanje ideja i vizija',
      opis: `Kombinuje mogućnosti Glavnog Endžina (${input.mogucnosti.length}) sa aktivnim sistemima radi formiranja novih pravaca razvoja.`,
      status: 'aktivan',
      frekvencija: 'po sekvenci planiranja',
      izlaz: 'nove ideje, vizije i prilike za integraciju',
      povezaniSistemi: ['Core orkestracija Glavnog Endžina', 'Gaming, laboratorija i simulacije'],
    },
    {
      id: 'ciklus-planiranje',
      naziv: 'Projektno planiranje',
      opis: 'Pretvara ideje u operativne faze i izdvaja korake koji traže potvrdu pre izvršenja.',
      status: 'sinhronizacija',
      frekvencija: 'na zahtev i pri promeni prioriteta',
      izlaz: 'projektni planovi i naredni koraci',
      povezaniSistemi: ['Finansijski i poslovni sistemi', 'Mreža, deploy i komunikacija'],
    },
    {
      id: 'ciklus-povratni-odaziv',
      naziv: 'Povratni odaziv i ljudska potvrda',
      opis: 'Sve nepoznato, rizično ili blokirano prebacuje se u review queue sa sledećom preporučenom akcijom.',
      status: 'ceka-potvrdu',
      frekvencija: 'po blokadi ili nepoznanici',
      izlaz: 'detaljna lista zadataka za pregled',
      povezaniSistemi: ['Repo i bezbednosni endžini', 'Finansijski i poslovni sistemi'],
    },
  ];
}

function buildGenerisaneIdeje(input: MozakLogikaInput): MozakLogikaIdeja[] {
  return [
    {
      id: 'ideja-adaptivna-sekvenca',
      naslov: 'Adaptivna sekvenca prioriteta',
      opis: `Prioritizovati ${input.statistika.aiEndžina} AI endžina i ${input.statistika.coreEndžina} core endžina kroz jedan zajednički signal prioriteta.`,
      kategorija: 'automatizacija',
      prioritet: 'visok',
      uticaj: 0.96,
      povezaniSistemi: ['OMEGA AI i logičko rezonovanje', 'Core orkestracija Glavnog Endžina'],
      status: 'u-obradi',
    },
    {
      id: 'ideja-matrica-odaziva',
      naslov: 'Matrica povratnog odaziva',
      opis: 'Pretvoriti review queue u jasan operativni redosled sa kritičnim, blokiranim i delegiranim stavkama.',
      kategorija: 'analitika',
      prioritet: 'kritican',
      uticaj: 0.99,
      povezaniSistemi: ['Mreža, deploy i komunikacija', 'Repo i bezbednosni endžini'],
      status: 'ceka-potvrdu',
    },
    {
      id: 'ideja-simulacija-vizija',
      naslov: 'Simulacija novih vizija',
      opis: `Iskoristiti ${input.statistika.laboratorijskihSimulacija} laboratorijskih simulacija za proveru novih razvojnih vizija pre produkcije.`,
      kategorija: 'vizija',
      prioritet: 'srednji',
      uticaj: 0.88,
      povezaniSistemi: ['Gaming, laboratorija i simulacije'],
      status: 'nova',
    },
    {
      id: 'ideja-finansijska-zastita',
      naslov: 'Zaštićena finansijska potvrda',
      opis: 'Sve odluke koje utiču na nabavku, billing ili deploy označiti za ručnu potvrdu pre izvršenja.',
      kategorija: 'integracija',
      prioritet: 'visok',
      uticaj: 0.94,
      povezaniSistemi: ['Finansijski i poslovni sistemi', 'Mreža, deploy i komunikacija'],
      status: 'u-obradi',
    },
  ];
}

function buildProjektniPlanovi(
  _input: MozakLogikaInput,
): MozakLogikaProjektniPlan[] {
  return [
    {
      id: 'plan-ciklicna-analitika',
      naziv: 'Ciklična analitika Glavnog Endžina',
      cilj: 'Uvesti kontinuirani pregled ideja, planova i blokada na nivou Glavnog Endžina.',
      faze: [
        'Prikupiti stanje aktivnih sistema',
        'Izračunati prioritete i zdravlje ciklusa',
        'Objaviti pregled u MOZAK LOGIKA interfejsu',
      ],
      zavisnosti: ['Core orkestracija', 'Monitoring API'],
      status: 'spreman',
      naredniKorak: 'Pokrenuti ciklus samoanalize i objaviti prve rezultate.',
    },
    {
      id: 'plan-human-loop',
      naziv: 'Human-in-the-loop potvrde',
      cilj: 'Sve nepoznate ili rizične odluke preusmeriti na detaljan pregled sa sledećim koracima.',
      faze: [
        'Klasifikovati zadatke u review queue',
        'Dodeliti prioritet i zahvaćene sisteme',
        'Prikazati jasnu preporuku za ručnu odluku',
      ],
      zavisnosti: ['Repo i bezbednosni endžini', 'Finansijski sistemi'],
      status: 'ceka-potvrdu',
      naredniKorak: 'Potvrditi pravila za finansijske i bezbednosne promene.',
    },
    {
      id: 'plan-mapa-povezivanja',
      naziv: 'Mapa povezivanja svih sistema',
      cilj: 'Vizuelno prikazati kako MOZAK LOGIKA povezuje endžine, planove i review queue.',
      faze: [
        'Grupisati endžine po tipu i prioritetu',
        'Mapirati zavisnosti ideja i planova',
        'Objaviti matricu u sekvencama i monitoringu',
      ],
      zavisnosti: ['Sekvence', 'Navigation', 'Sitemap'],
      status: 'spreman',
      naredniKorak: 'Sinhronizovati prikaz sa postojećim Glavni Endžin statistikama.',
    },
  ];
}

function buildNepoznanice(): MozakLogikaNepoznanica[] {
  return [
    {
      id: 'nepoznanica-persistencija',
      pitanje: 'Da li ideje i planovi treba da budu trajno sačuvani?',
      razlog: 'Trenutni model je generativan i radi bez perzistentnog skladišta.',
      preporucenaAkcija: 'Potvrditi da li je potreban storage koji preživljava restart sistema.',
      prioritet: 'visok',
    },
    {
      id: 'nepoznanica-autonomija',
      pitanje: 'Koje akcije smeju da se izvršavaju potpuno autonomno?',
      razlog: 'Deploy, finansije i bezbednost zahtevaju strogu kontrolu promene.',
      preporucenaAkcija: 'Definisati listu dozvoljenih auto-izvršivih akcija.',
      prioritet: 'kritican',
    },
    {
      id: 'nepoznanica-kanal-odaziva',
      pitanje: 'Kroz koji kanal treba da stiže povratni odaziv?',
      razlog: 'Trenutno postoji prikaz unutar UI i API, ali ne i eksterni signal.',
      preporucenaAkcija: 'Odrediti da li je odaziv checklist, notifikacija ili operativni task list.',
      prioritet: 'srednji',
    },
  ];
}

function buildReviewQueue(
  ideje: MozakLogikaIdeja[],
  nepoznanice: MozakLogikaNepoznanica[],
): MozakLogikaReviewStavka[] {
  return [
    {
      id: 'review-auto-prioritet',
      naslov: 'Automatsko slaganje dnevnih prioriteta',
      klasifikacija: 'auto-executable',
      prioritet: 'srednji',
      razlog: 'Niskorizična promena koja koristi postojeće podatke iz monitoringa i statistike.',
      pogodjeniSistemi: ['Core orkestracija Glavnog Endžina', 'OMEGA AI i logičko rezonovanje'],
      narednaAkcija: 'Dozvoliti automatsko osvežavanje prioriteta u svakom ciklusu.',
    },
    {
      id: 'review-finansijska-potvrda',
      naslov: 'Potvrda finansijske zaštite',
      klasifikacija: 'requires-confirmation',
      prioritet: 'kritican',
      razlog: ideje.find((i) => i.id === 'ideja-finansijska-zastita')?.opis ?? 'Finansijske odluke traže potvrdu.',
      pogodjeniSistemi: ['Finansijski i poslovni sistemi'],
      narednaAkcija: 'Ručno potvrditi pravila pre bilo kakvog automatskog izvršenja.',
    },
    {
      id: 'review-persistencija-planova',
      naslov: 'Persistencija ideja i planova',
      klasifikacija: 'blocked-unknown',
      prioritet: 'visok',
      razlog: nepoznanice.find((n) => n.id === 'nepoznanica-persistencija')?.razlog ?? 'Nedostaje odluka o storage-u.',
      pogodjeniSistemi: ['Repo i bezbednosni endžini', 'Mreža, deploy i komunikacija'],
      narednaAkcija: 'Definisati da li su potrebni baza, audit log ili samo generativni prikaz.',
    },
    {
      id: 'review-strateska-vizija',
      naslov: 'Strateška vizija novih ideja',
      klasifikacija: 'delegated-to-human',
      prioritet: 'visok',
      razlog: 'Vizionarski smer razvoja treba ljudsku procenu kako bi se ideje uskladile sa poslovnim prioritetima.',
      pogodjeniSistemi: ['Gaming, laboratorija i simulacije', 'Mreža, deploy i komunikacija'],
      narednaAkcija: 'Pregledati vizije i odabrati koje ulaze u sledeći projektni plan.',
    },
  ];
}

function buildPovratniOdaziv(
  reviewQueue: MozakLogikaReviewStavka[],
): MozakLogikaPovratniOdaziv {
  const cekaPotvrdu = reviewQueue.filter((s) => s.klasifikacija === 'requires-confirmation').length;
  const blokirano = reviewQueue.filter((s) => s.klasifikacija === 'blocked-unknown').length;
  const delegirano = reviewQueue.filter((s) => s.klasifikacija === 'delegated-to-human').length;
  const autoIzvrsivo = reviewQueue.filter((s) => s.klasifikacija === 'auto-executable').length;

  return {
    rezim: 'human-in-the-loop',
    ukupnoStavki: reviewQueue.length,
    cekaPotvrdu,
    blokirano,
    delegirano,
    autoIzvrsivo,
    detaljniZadaci: reviewQueue.map(
      (stavka) =>
        `${stavka.naslov} — ${stavka.prioritet.toUpperCase()} — ${stavka.narednaAkcija}`,
    ),
  };
}

export function buildMozakLogika(
  userId: string,
  input: MozakLogikaInput,
): MozakLogikaRezultat {
  const povezaniSistemi = buildPovezaniSistemi(input.statistika, input.spojeniEndzini);
  const aktivniCiklusi = buildAktivniCiklusi(input, povezaniSistemi);
  const generisaneIdeje = buildGenerisaneIdeje(input);
  const projektniPlanovi = buildProjektniPlanovi(input);
  const nepoznanice = buildNepoznanice();
  const reviewQueue = buildReviewQueue(generisaneIdeje, nepoznanice);
  const povratniOdaziv = buildPovratniOdaziv(reviewQueue);

  const ciklusZdravlja = round2(
    Math.min(
      100,
      82 +
        input.statistika.prosecnaOptimizacija * 0.1 +
        input.statistika.kompletnostSistema * 0.05,
    ),
  );

  const status: MozakLogikaStatus = povratniOdaziv.blokirano > 0
    ? 'potrebna-potvrda'
    : 'aktivan';

  return {
    status,
    operativniStatus: {
      status,
      radiNonStop: true,
      ciklusZdravlja,
      novihIdeja: generisaneIdeje.length,
      reviewNaCekanju: povratniOdaziv.ukupnoStavki,
      povezanihSistema: povezaniSistemi.length,
      planGenerisanjeStatus: 'aktivan',
      backlogStatus: povratniOdaziv.blokirano > 0 ? 'potrebna-potvrda' : 'stabilan',
    },
    aktivniCiklusi,
    povezaniSistemi,
    generisaneIdeje,
    projektniPlanovi,
    nepoznanice,
    reviewQueue,
    povratniOdaziv,
    mozakLogikaSummary: {
      engineId: input.glavniEndzinId,
      engineNaziv: input.glavniEndzinNaziv,
      engineVerzija: input.glavniEndzinVerzija,
      rezim: 'orkestracija-i-potvrda',
      fokus: 'Neprekidna analiza, ideje, planovi i jasna ljudska potvrda za nepoznate odluke.',
      objasnjenje:
        `MOZAK LOGIKA spaja ${input.statistika.ukupnoSpojenih} endžina, ${input.evolucija.length} evolucionih ciklusa ` +
        `i ${input.mogucnosti.length} mogućnosti u jedan kontrolisani sistem ideja, planova i review queue tokova.`,
    },
    userId,
    timestamp: new Date().toISOString(),
  };
}
