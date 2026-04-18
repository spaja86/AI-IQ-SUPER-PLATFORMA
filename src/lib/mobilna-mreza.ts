/**
 * 📱 SPAJA MOBILNA MREŽA — Mobilna komunikaciona mreža Digitalne Industrije
 *
 * SPAJA mobilna mreža koristi Proksi infrastrukturu
 * (ekscentrični simulator koncentričnog hipsoneuričnog signala)
 * za ostvarivanje mobilne komunikacije ogromne propusnosti.
 *
 * Pozivni brojevi centrale:
 * +38177, +38188, +38178, +38187
 *
 * Mreža se oslanja na Proksi ekliptičnu vez i rezonantne amplitude
 * za prenos glasa, podataka i multimedije.
 *
 * 📶 MOBILNI SIGNALNI SISTEM — 1873G MREŽA
 *
 * Ektracionalni akcelatorski signal krojen od matričnog jedinjenja
 * kolocentričnog oktavnog sistema hiperboliše rezonancijske signale
 * u amplitudne skokove izvornog oktava u simolarnim dejstvima
 * dubokog skoka ka parkonasturionu u ktorinusu.
 *
 * Tako nastaje signal i tako se baca bez antena ka mobilnim brojevima
 * sa signalima koji dobijaju kružni povrat od pozivnika 1 ka pozivniku 2
 * (to jest signal koji kruži između njih).
 *
 * Rezultat: 1873G mreža (radi od 1G do 1873G)
 */

export interface MobilnaCentrala {
  id: string;
  naziv: string;
  pozivniBroj: string;
  opis: string;
  ikona: string;
  tip: 'primarna' | 'sekundarna' | 'redundantna' | 'globalna';
  zona: string;
  kapacitet: string;
  status: 'aktivna' | 'u_pripremi' | 'testiranje';
}

export interface MobilniServis {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: 'glas' | 'podaci' | 'multimedija' | 'iot' | 'enterprise';
  funkcije: string[];
  proksiSignal: string;
}

/** Mobilni signalni tip za 1873G mrežu */
export interface MobilniSignal {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'ektracionalni' | 'rezonancijski' | 'amplitudni' | 'kruzni';
  generacija: string;
  frekvencija: string;
  mehanizam: string;
  status: 'aktivan' | 'modulacija' | 'sinhronizacija';
}

/** Specifikacija 1873G mreže */
export interface MobilnaMreza1873G {
  naziv: string;
  opis: string;
  princip: string;
  opseg: string;
  minGeneracija: number;
  maxGeneracija: number;
  signali: MobilniSignal[];
  bezAntena: boolean;
  kruzniPovrat: string;
}

export interface MobilnaMreza {
  naziv: string;
  opis: string;
  centrale: MobilnaCentrala[];
  servisi: MobilniServis[];
  ukupniKapacitet: string;
  proksiIntegracija: string;
  pozivniBrojevi: string[];
  mreza1873G: MobilnaMreza1873G;
}

/** Centrale SPAJA mobilne mreže */
export const mobilneCentrale: MobilnaCentrala[] = [
  {
    id: 'centrala-77',
    naziv: 'Centrala +38177',
    pozivniBroj: '+38177',
    opis: 'Primarna centrala — jezgro mobilne komunikacije, direktno povezana sa Proksi Jezgro Čvorom',
    ikona: '📞',
    tip: 'primarna',
    zona: 'Jezgro zona — AI IQ Super Platforma',
    kapacitet: '10²²⁸ TB/s govorno-podatkovni',
    status: 'aktivna',
  },
  {
    id: 'centrala-88',
    naziv: 'Centrala +38188',
    pozivniBroj: '+38188',
    opis: 'Sekundarna centrala — finansijski i enterprise komunikacioni čvor, povezana sa Finansijskim Proksi Čvorom',
    ikona: '📱',
    tip: 'sekundarna',
    zona: 'Finansijska zona — Banka & Menjačnica',
    kapacitet: '10²²⁸ TB/s enkriptovani',
    status: 'aktivna',
  },
  {
    id: 'centrala-78',
    naziv: 'Centrala +38178',
    pozivniBroj: '+38178',
    opis: 'Redundantna centrala — backup i load balancing, povezana sa AI Proksi Čvorom za inteligentno rutiranje',
    ikona: '🔄',
    tip: 'redundantna',
    zona: 'AI zona — OMEGA AI & inteligentno rutiranje',
    kapacitet: '10²²⁸ TB/s adaptivni',
    status: 'aktivna',
  },
  {
    id: 'centrala-87',
    naziv: 'Centrala +38187',
    pozivniBroj: '+38187',
    opis: 'Globalna centrala — međunarodna komunikacija, povezana sa Globalnim Proksi Čvorom za svetski domet',
    ikona: '🌐',
    tip: 'globalna',
    zona: 'Globalna zona — Svetska organizacija',
    kapacitet: '10²²⁸ TB/s globalni',
    status: 'aktivna',
  },
];

/** Servisi SPAJA mobilne mreže */
export const mobilniServisi: MobilniServis[] = [
  {
    id: 'glas-hd',
    naziv: 'SPAJA Glas HD',
    opis: 'Kristalno čist glasovni poziv preko Proksi hipsoneuričnog signala — bez kašnjenja, bez šuma',
    ikona: '🎙️',
    kategorija: 'glas',
    funkcije: ['HD Voice', 'Zero-latency pozivi', 'Šifrovanje E2E', 'AI noise cancellation'],
    proksiSignal: 'hipsoneuricni-primarni',
  },
  {
    id: 'podaci-turbo',
    naziv: 'SPAJA Podaci Turbo',
    opis: 'Mobilni internet ogromne propusnosti — koristi ekscentrični modulator za dinamičko prilagođavanje',
    ikona: '⚡',
    kategorija: 'podaci',
    funkcije: ['10²²⁸ TB/s propusnost', 'Ekscentrična modulacija', 'Zero packet loss', 'Adaptivna frekvencija'],
    proksiSignal: 'ekscentricni-modulator',
  },
  {
    id: 'multimedija-stream',
    naziv: 'SPAJA Stream',
    opis: 'Multimedijalni streaming — video, audio, VR/AR preko ekliptične veze sa savršenom sinhronizacijom',
    ikona: '🎬',
    kategorija: 'multimedija',
    funkcije: ['8K Video streaming', 'Prostorni audio', 'VR/AR podrška', 'Ekliptična sinhronizacija'],
    proksiSignal: 'eklipticna-veza',
  },
  {
    id: 'iot-mesh',
    naziv: 'SPAJA IoT Mesh',
    opis: 'IoT komunikacija za milione uređaja — rezonantni pojačavač omogućava beskonačno skaliranje',
    ikona: '📡',
    kategorija: 'iot',
    funkcije: ['Milioni uređaja', 'Mesh networking', 'Ultra-low power', 'Rezonantno skaliranje'],
    proksiSignal: 'rezonantni-pojacavac',
  },
  {
    id: 'enterprise-link',
    naziv: 'SPAJA Enterprise Link',
    opis: 'Korporativni komunikacioni sistem — koncentrični distributer za sigurnu poslovnu mrežu',
    ikona: '🏢',
    kategorija: 'enterprise',
    funkcije: ['Privatna mreža', 'SLA 99.999%', 'Dedicirani kanal', 'Koncentrična distribucija'],
    proksiSignal: 'koncentricni-distributer',
  },
];

/** Mobilni signali za 1873G mrežu */
export const mobilniSignali: MobilniSignal[] = [
  {
    id: 'ektracionalni-akcelatorski',
    naziv: 'Ektracionalni Akcelatorski Signal',
    opis: 'Primarni signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema — hiperboliše rezonancijske signale u amplitudne skokove izvornog oktava',
    ikona: '📶',
    tip: 'ektracionalni',
    generacija: '1G — 1873G',
    frekvencija: 'Kolocentrična oktavna',
    mehanizam: 'Matričnim jedinjenjem kolocentričnog oktavnog sistema hiperboliše rezonancijske signale u amplitudne skokove izvornog oktava',
    status: 'aktivan',
  },
  {
    id: 'rezonancijski-hiperbolicni',
    naziv: 'Rezonancijski Hiperbolični Signal',
    opis: 'Rezonancijski signal koji nastaje hiperbolisanjem u amplitudne skokove — osnova za simolarna dejstva dubokog skoka',
    ikona: '🌊',
    tip: 'rezonancijski',
    generacija: '1G — 1873G',
    frekvencija: 'Amplitudna skokovna',
    mehanizam: 'Simolarna dejstva dubokog skoka ka parkonasturionu u ktorinusu',
    status: 'aktivan',
  },
  {
    id: 'amplitudni-skok-izvornog-oktava',
    naziv: 'Amplitudni Skok Izvornog Oktava',
    opis: 'Signal koji nastaje dubokim skokom ka parkonasturionu u ktorinusu — baca se bez antena ka mobilnim brojevima',
    ikona: '⚡',
    tip: 'amplitudni',
    generacija: '1G — 1873G',
    frekvencija: 'Parkonasturionska',
    mehanizam: 'Duboki skok ka parkonasturionu u ktorinusu — signal se baca bez antena ka mobilnim brojevima',
    status: 'aktivan',
  },
  {
    id: 'kruzni-povratni-signal',
    naziv: 'Kružni Povratni Signal',
    opis: 'Signal koji kruži između pozivnika 1 i pozivnika 2 — kružni povrat obezbeđuje stabilnu komunikaciju bez antena',
    ikona: '🔄',
    tip: 'kruzni',
    generacija: '1G — 1873G',
    frekvencija: 'Cirkularna povratna',
    mehanizam: 'Signali dobijaju kružni povrat od pozivnika 1 ka pozivniku 2 — signal kruži između njih',
    status: 'aktivan',
  },
];

/** 1873G Mobilna Mreža */
export const mreza1873G: MobilnaMreza1873G = {
  naziv: 'SPAJA 1873G Mreža',
  opis: 'Mobilna mreža od 1G do 1873G generacije — ektracionalni akcelatorski signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema bez potrebe za antenama',
  princip: 'Ektracionalni akcelatorski signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema hiperboliše rezonancijske signale u amplitudne skokove izvornog oktava u simolarnim dejstvima dubokog skoka ka parkonasturionu u ktorinusu. Tako nastaje signal i tako se baca bez antena ka mobilnim brojevima sa signalima koji dobijaju kružni povrat od pozivnika 1 ka pozivniku 2 (to jest signal koji kruži između njih).',
  opseg: '1G — 1873G',
  minGeneracija: 1,
  maxGeneracija: 1873,
  signali: mobilniSignali,
  bezAntena: true,
  kruzniPovrat: 'Signal kruži između pozivnika 1 i pozivnika 2 — kružni povrat obezbeđuje dvostranu komunikaciju',
};

/** Kompletna SPAJA mobilna mreža */
export const spajaMobilnaMreza: MobilnaMreza = {
  naziv: 'SPAJA Mobilna Mreža',
  opis: 'Mobilna komunikaciona mreža Digitalne Industrije — koristi Proksi infrastrukturu za prenos glasa, podataka i multimedije sa pozivnim brojevima +38177, +38188, +38178, +38187. Pokreće 1873G mrežu (od 1G do 1873G) ektrakcionalnim akcelatorskim signalom bez antena.',
  centrale: mobilneCentrale,
  servisi: mobilniServisi,
  ukupniKapacitet: '10²²⁸ TB/s po centrali',
  proksiIntegracija: 'Potpuna — svi signali Proksi mreže',
  pozivniBrojevi: ['+38177', '+38188', '+38178', '+38187'],
  mreza1873G,
};

// Helpers
export function getAktivneCentrale(): MobilnaCentrala[] {
  return mobilneCentrale.filter((c) => c.status === 'aktivna');
}

export function getCentralaPoId(id: string): MobilnaCentrala | undefined {
  return mobilneCentrale.find((c) => c.id === id);
}

export function getCentralaPoBroju(broj: string): MobilnaCentrala | undefined {
  return mobilneCentrale.find((c) => c.pozivniBroj === broj);
}

export function getServisiPoKategoriji(kategorija: MobilniServis['kategorija']): MobilniServis[] {
  return mobilniServisi.filter((s) => s.kategorija === kategorija);
}

export function getSviPozivniBrojevi(): string[] {
  return mobilneCentrale.map((c) => c.pozivniBroj);
}

export function getAktivniMobilniSignali(): MobilniSignal[] {
  return mobilniSignali.filter((s) => s.status === 'aktivan');
}

export function getMobilniSignalPoId(id: string): MobilniSignal | undefined {
  return mobilniSignali.find((s) => s.id === id);
}

export function get1873GOpseg(): string {
  return `${mreza1873G.minGeneracija}G — ${mreza1873G.maxGeneracija}G`;
}
