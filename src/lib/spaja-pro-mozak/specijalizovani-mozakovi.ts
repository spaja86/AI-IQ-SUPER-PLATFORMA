/**
 * 🧠 Specijalizovani Mozakovi (MOZAK 0–36, 44, 45)
 *
 * Svaki specijalizovani mozak ima jedinstvenu ulogu u okviru
 * SpajaUltraOmegaCore -∞Ω+∞ platforme.
 *
 * MOZAK 0  — Kontrola sviju mozaka
 * MOZAK 1  — Kreiranje mozaka
 * MOZAK 2  — Rešavanje sviju problema mozaka
 * MOZAK 3  — Automatsko paljenje, gašenje, restartovanje, spavanje
 * MOZAK 4  — Kontrola podešavanja
 * MOZAK 5  — Automatska instalacija, reinstalacija, update, ažuriranje, defragmentacija
 * MOZAK 6  — Komunikacija između sviju mozaka
 * MOZAK 7  — Odbrana
 * MOZAK 8  — Kontraodbrana
 * MOZAK 9  — Kontranapad
 * MOZAK 10 — Napad
 * MOZAK 11 — Generisanje
 * MOZAK 12 — Automatsko dodavanje svega što nedostaje
 * MOZAK 13 — Višestruk ulaz i izlaz informacija
 * MOZAK 14 — Automatsko dupliranje mozaka
 * MOZAK 15 — Kontrola i protokoli mozaka
 * MOZAK 16 — Spajanje mozaka (duplirani ne mogu da se spajaju)
 * MOZAK 17 — Učenjak
 * MOZAK 18 — Laboratorije
 * MOZAK 19 — Softveri
 * MOZAK 20 — Aplikacije
 * MOZAK 21 — Alati
 * MOZAK 22 — Pametni ugovori
 * MOZAK 23 — Maksimalni protokoli i kontrola
 * MOZAK 24 — Maksimalna sigurnost
 * MOZAK 25 — Maksimalna bezbednost
 * MOZAK 26 — Maksimalno očuvanje prirode
 * MOZAK 27 — Maksimalno očuvanje društva
 * MOZAK 28 — Digitalne sličice (ikonice)
 * MOZAK 29 — Božija zajednica
 * MOZAK 30 — Kraljevska porodica
 * MOZAK 31 — Testiranje svega
 * MOZAK 32 — AGUI
 * MOZAK 33 — SUI
 * MOZAK 34 — Parser
 * MOZAK 35 — Hologram
 * MOZAK 36 — Projekat
 * MOZAK 44 — Regulacija SpajaPro
 * MOZAK 45 — Docstring za svaku klasu (opisuje svrhu)
 */

import type { SpecijalizovaniMozak, SpecijalizovaniMozakId } from './types';

// ─── Svih 38 specijalizovanih mozakova ─────────────────────────────

export const specijalizovaniMozakovi: SpecijalizovaniMozak[] = [
  {
    id: 0,
    naziv: 'MOZAK ZA KONTROLU SVIJU MOZAKA',
    opis: 'Glavni kontrolni mozak koji upravlja, nadgleda i koordinira rad svih ostalih mozaka u sistemu. Obezbeđuje centralizovanu kontrolnu tačku za celokupnu hijerarhiju.',
    ikona: '🎛️',
    kategorija: 'kontrola',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 1,
    naziv: 'MOZAK ZA KREIRANJE MOZAKA',
    opis: 'Mozak odgovoran za kreiranje novih mozaka u sistemu. Generiše nove instance mozaka po potrebi, prateći zahteve projekta i optimalne konfiguracije.',
    ikona: '🏗️',
    kategorija: 'kreiranje',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 2,
    naziv: 'MOZAK ZA REŠAVANJE SVIJU PROBLEMA MOZAKA',
    opis: 'Dijagnostički i problem-solving mozak koji automatski identifikuje, analizira i rešava sve probleme koji nastanu u bilo kom mozgu unutar sistema.',
    ikona: '🔧',
    kategorija: 'resavanje-problema',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 3,
    naziv: 'MOZAK ZA AUTOMATSKO PALJENJE, GAŠENJE, RESTARTOVANJE, SPAVANJE',
    opis: 'Upravljač životnog ciklusa svih mozaka — automatski pali, gasi, restartuje i stavlja u režim spavanja mozake prema unapred definisanim pravilima i potrebama sistema.',
    ikona: '⚡',
    kategorija: 'automatika',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 4,
    naziv: 'MOZAK ZA KONTROLU PODEŠAVANJA',
    opis: 'Mozak koji centralno upravlja svim podešavanjima i konfiguracijama ostalih mozaka. Obezbeđuje konzistentnost parametara kroz celokupan sistem.',
    ikona: '⚙️',
    kategorija: 'kontrola',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 5,
    naziv: 'MOZAK ZA AUTOMATSKU INSTALACIJU, REINSTALACIJU, UPDATE, AŽURIRANJE, DEFRAGMENTACIJU',
    opis: 'Mozak za upravljanje softverskim životnim ciklusom — automatski instalira, reinstalira, ažurira i defragmentira sve komponente sistema bez prekida rada.',
    ikona: '📦',
    kategorija: 'automatika',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 6,
    naziv: 'MOZAK ZA KOMUNIKACIJU IZMEĐU SVIJU MOZAKA',
    opis: 'Komunikacioni hub koji omogućava razmenu informacija, signala i podataka između svih mozaka. Koristi interne protokole za brzu i pouzdanu inter-mozak komunikaciju.',
    ikona: '📡',
    kategorija: 'komunikacija',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 7,
    naziv: 'MOZAK ODBRANE',
    opis: 'Defanzivni mozak koji štiti sistem od spoljašnjih pretnji, napada i neovlašćenog pristupa. Implementira višeslojne odbrambene mehanizme.',
    ikona: '🛡️',
    kategorija: 'odbrana',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 8,
    naziv: 'MOZAK KONTRAODBRANE',
    opis: 'Mozak koji nadopunjuje odbrambeni mozak — aktivira se kada primarni odbrambeni mehanizmi budu prevaziđeni, obezbeđujući sekundarnu liniju zaštite.',
    ikona: '🔰',
    kategorija: 'odbrana',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 9,
    naziv: 'MOZAK KONTRANAPADA',
    opis: 'Mozak za aktivni kontranapad — automatski neutralizuje pretnje vraćanjem ofanzivne akcije prema izvoru napada, uz precizno ciljanje i proporcionalnu reakciju.',
    ikona: '⚔️',
    kategorija: 'odbrana',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 10,
    naziv: 'MOZAK NAPADA',
    opis: 'Ofanzivni mozak za aktivne operacije — koristi se za proaktivno testiranje i neutralizaciju potencijalnih pretnji pre nego što dosegnu sistem.',
    ikona: '🗡️',
    kategorija: 'odbrana',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 11,
    naziv: 'MOZAK ZA GENERISANJE',
    opis: 'Generativni mozak koji kreira nove sadržaje, strukture, konfiguracije i komponente na osnovu zadatih parametara i šablona.',
    ikona: '🧪',
    kategorija: 'generisanje',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 12,
    naziv: 'MOZAK ZA AUTOMATSKO DODAVANJE SVEGA ŠTO NEDOSTAJE',
    opis: 'Mozak koji automatski detektuje nedostajuće komponente, konfiguracije, zavisnosti i resurse u sistemu i dodaje ih bez korisničke intervencije.',
    ikona: '➕',
    kategorija: 'automatika',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 13,
    naziv: 'MOZAK ZA VIŠESTRUK ULAZ I IZLAZ INFORMACIJA',
    opis: 'Mozak za upravljanje višestrukim ulazno-izlaznim kanalima — obezbeđuje paralelnu obradu podataka iz više izvora i distribuciju rezultata ka više odredišta.',
    ikona: '🔀',
    kategorija: 'informacije',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 14,
    naziv: 'MOZAK ZA AUTOMATSKO DUPLIRANJE MOZAKA',
    opis: 'Mozak za automatsko kreiranje duplikata mozaka. Generiše instance po šablonu (npr. MOZAK 11.0001, 11.0002, ... 11.1000 do recipročne vrednosti koju projekat zahteva).',
    ikona: '♊',
    kategorija: 'automatika',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 15,
    naziv: 'MOZAK ZA KONTROLU I PROTOKOLE MOZAKA',
    opis: 'Mozak za upravljanje protokolima komunikacije, autentifikacije, i kontrole pristupa između svih mozaka. Definiše i primenjuje standardizovane protokole.',
    ikona: '📋',
    kategorija: 'protokoli',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 16,
    naziv: 'MOZAK ZA SPAJANJE MOZAKA',
    opis: 'Mozak za fuziju i spajanje mozaka — obezbeđuje pravilan proces spajanja uz poštovanje pravila da se duplirani mozakovi ne mogu spajati.',
    ikona: '🔗',
    kategorija: 'spajanje',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 17,
    naziv: 'MOZAK UČENJAK',
    opis: 'Mozak za učenje i akumulaciju znanja — analizira iskustva, uči iz grešaka i optimizuje ponašanje celokupnog sistema na osnovu stečenog znanja.',
    ikona: '📚',
    kategorija: 'ucenje',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 18,
    naziv: 'MOZAK ZA LABORATORIJE',
    opis: 'Laboratorijski mozak za eksperimentisanje, testiranje novih koncepata, simulaciju scenarija i razvoj prototipova u izolovanom okruženju.',
    ikona: '🔬',
    kategorija: 'laboratorija',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 19,
    naziv: 'MOZAK ZA SOFTVERE',
    opis: 'Mozak za upravljanje softverskim komponentama — razvoj, kompajliranje, optimizacija i distribucija softvera unutar ekosistema.',
    ikona: '💻',
    kategorija: 'softver',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 20,
    naziv: 'MOZAK ZA APLIKACIJE',
    opis: 'Mozak za upravljanje aplikacijama — razvoj, deploy, skaliranje i monitoring aplikacija u produkcijskom okruženju.',
    ikona: '📱',
    kategorija: 'aplikacija',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 21,
    naziv: 'MOZAK ZA ALATE',
    opis: 'Mozak za upravljanje alatima — kreira, konfiguriše i održava sve alate potrebne za funkcionisanje ekosistema.',
    ikona: '🛠️',
    kategorija: 'alat',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 22,
    naziv: 'MOZAK ZA PAMETNE UGOVORE',
    opis: 'Mozak za kreiranje i upravljanje pametnim ugovorima — definiše, validira, izvršava i prati ugovore između komponenti i korisnika sistema.',
    ikona: '📜',
    kategorija: 'ugovor',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 23,
    naziv: 'MOZAK ZA MAKSIMALNE PROTOKOLE I KONTROLU',
    opis: 'Mozak za ultimativnu kontrolu i protokole — implementira najstroža pravila i kontrolne mehanizme za kritičke komponente sistema.',
    ikona: '🏛️',
    kategorija: 'protokoli',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 24,
    naziv: 'MOZAK ZA MAKSIMALNU SIGURNOST',
    opis: 'Mozak za maksimalni nivo sigurnosti — implementira enkripciju, autentifikaciju, autorizaciju i nultu-poverenje arhitekturu na najvišem nivou.',
    ikona: '🔐',
    kategorija: 'sigurnost',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 25,
    naziv: 'MOZAK ZA MAKSIMALNU BEZBEDNOST',
    opis: 'Mozak za maksimalnu bezbednost — nadgleda sve aspekte bezbednosti sistema, detektuje anomalije i primenjuje bezbednosne politike.',
    ikona: '🛡️',
    kategorija: 'bezbednost',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 26,
    naziv: 'MOZAK ZA MAKSIMALNO OČUVANJE PRIRODE',
    opis: 'Mozak posvećen očuvanju prirode — optimizuje energetsku efikasnost, smanjuje digitalni otisak i promoviše ekološki odgovorno računarstvo.',
    ikona: '🌿',
    kategorija: 'priroda',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 27,
    naziv: 'MOZAK ZA MAKSIMALNO OČUVANJE DRUŠTVA',
    opis: 'Mozak za očuvanje društvenih vrednosti — obezbeđuje da sve operacije sistema budu u skladu sa etičkim normama i društvenom odgovornošću.',
    ikona: '🤝',
    kategorija: 'drustvo',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 28,
    naziv: 'MOZAK ZA DIGITALNE SLIČICE (IKONICE)',
    opis: 'Mozak za upravljanje vizuelnim identitetom — kreira, organizuje i distribuira digitalne sličice, ikonice i vizuelne resurse sistema.',
    ikona: '🎨',
    kategorija: 'vizuelno',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 29,
    naziv: 'MOZAK ZA BOŽIJU ZAJEDNICU',
    opis: 'Mozak za božiju zajednicu — podržava duhovne vrednosti, zajednicu i međusobno poštovanje u okviru platforme.',
    ikona: '✝️',
    kategorija: 'zajednica',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 30,
    naziv: 'MOZAK ZA KRALJEVSKU PORODICU',
    opis: 'Mozak za kraljevsku porodicu — obezbeđuje hijerarhiju upravljanja, premijer pristup i posebne privilegije za vodeće strukture sistema.',
    ikona: '👑',
    kategorija: 'porodica',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 31,
    naziv: 'MOZAK ZA TESTIRANJE SVEGA',
    opis: 'Mozak za sveobuhvatno testiranje — automatski testira sve komponente, integracije, performanse i bezbednost celokupnog sistema.',
    ikona: '🧪',
    kategorija: 'testiranje',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 32,
    naziv: 'MOZAK ZA AGUI',
    opis: 'Mozak za AGUI (Advanced Graphical User Interface) — kreira i upravlja naprednim grafičkim korisničkim interfejsima sa Omega inteligencijom.',
    ikona: '🖥️',
    kategorija: 'interfejs',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 33,
    naziv: 'MOZAK ZA SUI',
    opis: 'Mozak za SUI (Smart User Interface) — kreira pametne korisničke interfejse koji se adaptiraju na osnovu ponašanja i potreba korisnika.',
    ikona: '🧩',
    kategorija: 'interfejs',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 34,
    naziv: 'MOZAK ZA PARSER',
    opis: 'Mozak za parsiranje — analizira, raščlanjuje i interpretira sve ulazne podatke, komande i sintaksne strukture SpajaUltraOmegaCore jezika.',
    ikona: '📖',
    kategorija: 'parser',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 35,
    naziv: 'MOZAK ZA HOLOGRAM',
    opis: 'Mozak za holografske projekcije — kreira, upravlja i projektuje holografski prikaz podataka, modela i interfejsa u 3D/holografskom prostoru.',
    ikona: '🌀',
    kategorija: 'hologram',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 36,
    naziv: 'MOZAK ZA PROJEKAT',
    opis: 'Mozak za upravljanje projektima — planira, koordinira i prati sve projektne aktivnosti, resurse i rokove unutar ekosistema.',
    ikona: '📊',
    kategorija: 'projekat',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 44,
    naziv: 'MOZAK ZA REGULACIJU SpajaPro',
    opis: 'Mozak za regulaciju SpajaPro engine-a — kontroliše, optimizuje i reguliše sve verzije SpajaPro (6–15 i buduće) obezbeđujući stabilnost i kompatibilnost.',
    ikona: '⚖️',
    kategorija: 'regulacija',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
  {
    id: 45,
    naziv: 'MOZAK ZA DOCSTRING SVAKE KLASE',
    opis: 'Mozak za automatsko generisanje docstring-ova — za svaku klasu, funkciju i modul u sistemu automatski generiše dokumentaciju koja opisuje svrhu, parametre i ponašanje.',
    ikona: '📝',
    kategorija: 'dokumentacija',
    dupliranjeDozvoljeno: true,
    minPodjedinica: 40,
    maxPodjedinica: 120,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Vraća specijalizovani mozak po ID-ju.
 */
export function getMozakPoId(id: SpecijalizovaniMozakId): SpecijalizovaniMozak | undefined {
  return specijalizovaniMozakovi.find((m) => m.id === id);
}

/**
 * Vraća mozakove po kategoriji.
 */
export function getMozakovePoKategoriji(kategorija: string): SpecijalizovaniMozak[] {
  return specijalizovaniMozakovi.filter((m) => m.kategorija === kategorija);
}

/**
 * Vraća ukupan broj specijalizovanih mozakova.
 */
export function getBrojSpecijalizovanihMozakova(): number {
  return specijalizovaniMozakovi.length;
}

/**
 * Vraća sve kategorije mozakova.
 */
export function getSveKategorije(): string[] {
  const kategorije = new Set<string>();
  for (const m of specijalizovaniMozakovi) {
    kategorije.add(m.kategorija);
  }
  return [...kategorije];
}

/**
 * Generiše ID-jeve za automatsko dupliranje mozaka (MOZAK 14).
 *
 * Primer: za mozakId=11 i max=5 generiše: 11.0001, 11.0002, 11.0003, 11.0004, 11.0005
 */
export function generisiDuplikatIdjeve(mozakId: SpecijalizovaniMozakId, brojDuplikata: number): string[] {
  const idjevi: string[] = [];
  for (let i = 1; i <= brojDuplikata; i += 1) {
    idjevi.push(`${mozakId}.${String(i).padStart(4, '0')}`);
  }
  return idjevi;
}

/**
 * Vraća sumarni pregled specijalizovanih mozakova.
 */
export function getSpecijalizovaniSumarno() {
  return {
    ukupnoMozakova: specijalizovaniMozakovi.length,
    kategorije: getSveKategorije(),
    mozakovi: specijalizovaniMozakovi.map((m) => ({
      id: m.id,
      naziv: m.naziv,
      kategorija: m.kategorija,
    })),
  };
}
