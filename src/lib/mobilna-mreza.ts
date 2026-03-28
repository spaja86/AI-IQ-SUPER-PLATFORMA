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

export interface MobilnaMreza {
  naziv: string;
  opis: string;
  centrale: MobilnaCentrala[];
  servisi: MobilniServis[];
  ukupniKapacitet: string;
  proksiIntegracija: string;
  pozivniBrojevi: string[];
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

/** Kompletna SPAJA mobilna mreža */
export const spajaMobilnaMreza: MobilnaMreza = {
  naziv: 'SPAJA Mobilna Mreža',
  opis: 'Mobilna komunikaciona mreža Digitalne Industrije — koristi Proksi infrastrukturu za prenos glasa, podataka i multimedije sa pozivnim brojevima +38177, +38188, +38178, +38187',
  centrale: mobilneCentrale,
  servisi: mobilniServisi,
  ukupniKapacitet: '10²²⁸ TB/s po centrali',
  proksiIntegracija: 'Potpuna — svi signali Proksi mreže',
  pozivniBrojevi: ['+38177', '+38188', '+38178', '+38187'],
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
