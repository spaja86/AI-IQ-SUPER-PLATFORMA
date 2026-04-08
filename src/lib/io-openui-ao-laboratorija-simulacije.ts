/**
 * 🔬 IOOpenUIAO Laboratorija za Simulacije
 *
 * Laboratorija za simulacije koja izvodi razne simulacije
 * za celokupni SPAJA ekosistem — fizika, hemija, biologija,
 * matematika, AI/ML, inženjerstvo, ekonomija i ekologija.
 *
 * Pokretana od strane "SPAJA Generator za Endžine" koji
 * prevlači engine-e preko svih simulacionih modula.
 *
 * Link: https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6
 */

// ─── Tipovi ──────────────────────────────────────────────

export type SimulacijaStatus = 'aktivna' | 'pokrenuta' | 'pauzirana' | 'zavrsena' | 'planirana';
export type SimulacijaKategorija = 'fizika' | 'hemija' | 'biologija' | 'matematika' | 'ai-ml' | 'inzenjerstvo' | 'ekonomija' | 'ekologija';

export interface Simulacija {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  kategorija: SimulacijaKategorija;
  status: SimulacijaStatus;
  verzija: string;
  parametri: string[];
  rezultati: string[];
  preciznost: number;
}

export interface LaboratorijskiAlat {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: string;
  mogucnosti: string[];
}

export interface LaboratorijaStatistika {
  ukupnoSimulacija: number;
  aktivnihSimulacija: number;
  ukupnoAlata: number;
  prosecnaPreciznost: number;
  ukupnoKategorija: number;
}

export interface IOOpenUIAOLaboratorija {
  naziv: string;
  opis: string;
  verzija: string;
  link: string;
  generatorLink: string;
  simulacije: Simulacija[];
  alati: LaboratorijskiAlat[];
  statistika: LaboratorijaStatistika;
}

// ─── Simulacije ──────────────────────────────────────────

export const simulacije: Simulacija[] = [
  {
    id: 'sim-kvantna-fizika',
    naziv: 'Kvantna Fizika Simulacija',
    opis: 'Simulacija kvantnih fenomena — superpozicija, entanglement, kvantno tunelovanje i talasne funkcije',
    ikona: '⚛️',
    kategorija: 'fizika',
    status: 'aktivna',
    verzija: '2.0.0',
    parametri: ['Broj čestica', 'Energetski nivo', 'Temperatura', 'Magnetno polje', 'Vreme simulacije'],
    rezultati: ['Talasna funkcija', 'Verovatnoća distribucije', 'Energetski spektar', 'Korelacione matrice'],
    preciznost: 95,
  },
  {
    id: 'sim-hemijski-reakcioni',
    naziv: 'Hemijski Reakcioni Sistem',
    opis: 'Simulacija hemijskih reakcija — kinetika, termodinamika, kataliza i molekularne interakcije',
    ikona: '🧪',
    kategorija: 'hemija',
    status: 'aktivna',
    verzija: '1.5.0',
    parametri: ['Reaktanti', 'Koncentracija', 'Temperatura', 'Pritisak', 'Katalizator'],
    rezultati: ['Prinos reakcije', 'Brzina reakcije', 'Ravnotežna konstanta', 'Entalpija'],
    preciznost: 92,
  },
  {
    id: 'sim-bioloska-evolucija',
    naziv: 'Biološka Evolucija Model',
    opis: 'Model biološke evolucije — prirodna selekcija, mutacije, genetski drift i specijacija',
    ikona: '🧬',
    kategorija: 'biologija',
    status: 'aktivna',
    verzija: '1.0.0',
    parametri: ['Veličina populacije', 'Stopa mutacije', 'Selekcioni pritisak', 'Generacije', 'Okruženje'],
    rezultati: ['Fitnes distribucija', 'Genetska raznolikost', 'Filogenetsko drvo', 'Adaptivni pejzaž'],
    preciznost: 88,
  },
  {
    id: 'sim-matematicka-optimizacija',
    naziv: 'Matematička Optimizacija',
    opis: 'Simulacija optimizacionih algoritama — linearno, nelinearno, konveksno i kombinatorno programiranje',
    ikona: '📐',
    kategorija: 'matematika',
    status: 'aktivna',
    verzija: '2.0.0',
    parametri: ['Ciljna funkcija', 'Ograničenja', 'Dimenzionalnost', 'Preciznost', 'Maksimalne iteracije'],
    rezultati: ['Optimalno rešenje', 'Konvergencija', 'Osetljivost analiza', 'Pareto front'],
    preciznost: 97,
  },
  {
    id: 'sim-ai-neuronska-mreza',
    naziv: 'AI Neuronska Mreža Trening',
    opis: 'Simulacija treninga neuronskih mreža — arhitekture, hiperparametri, backpropagation i evaluacija',
    ikona: '🧠',
    kategorija: 'ai-ml',
    status: 'aktivna',
    verzija: '3.0.0',
    parametri: ['Arhitektura mreže', 'Learning rate', 'Batch size', 'Epohe', 'Regularizacija'],
    rezultati: ['Tačnost modela', 'Loss kriva', 'Confusion matrica', 'ROC kriva', 'Feature importance'],
    preciznost: 94,
  },
  {
    id: 'sim-inzenjersko-testiranje',
    naziv: 'Inženjersko Testiranje Materijala',
    opis: 'Simulacija testiranja materijala — čvrstoća, elastičnost, zamor, termička i koroziona otpornost',
    ikona: '🔩',
    kategorija: 'inzenjerstvo',
    status: 'aktivna',
    verzija: '1.5.0',
    parametri: ['Tip materijala', 'Opterećenje', 'Temperatura', 'Vlažnost', 'Trajanje testa'],
    rezultati: ['Naprezanje-deformacija kriva', 'Modul elastičnosti', 'Tačka loma', 'Zamor ciklusi'],
    preciznost: 91,
  },
  {
    id: 'sim-ekonomski-trzisni',
    naziv: 'Ekonomski Tržišni Model',
    opis: 'Simulacija ekonomskih tržišta — ponuda i potražnja, cene, inflacija i makroekonomski indikatori',
    ikona: '📈',
    kategorija: 'ekonomija',
    status: 'pokrenuta',
    verzija: '1.0.0',
    parametri: ['GDP', 'Inflacija', 'Kamatna stopa', 'Nezaposlenost', 'Spoljnotrgovinski bilans'],
    rezultati: ['Tržišna prognoza', 'Indeks cena', 'Rast BDP-a', 'Investicioni potencijal'],
    preciznost: 85,
  },
  {
    id: 'sim-ekoloski-ekosistem',
    naziv: 'Ekološki Ekosistem Simulacija',
    opis: 'Simulacija ekoloških ekosistema — biodiverzitet, lanac ishrane, klimatski uticaj i konzervacija',
    ikona: '🌿',
    kategorija: 'ekologija',
    status: 'aktivna',
    verzija: '1.0.0',
    parametri: ['Broj vrsta', 'Površina staništa', 'Klimatski parametri', 'Zagađenje', 'Ljudski uticaj'],
    rezultati: ['Biodiverzitet indeks', 'Populaciona dinamika', 'Ekosistemska stabilnost', 'Konzervacioni plan'],
    preciznost: 87,
  },
  {
    id: 'sim-molekularna-dinamika',
    naziv: 'Molekularna Dinamika',
    opis: 'Simulacija molekularne dinamike — interakcije atoma, proteinski folding i molekulsko modelovanje',
    ikona: '🔬',
    kategorija: 'hemija',
    status: 'aktivna',
    verzija: '2.0.0',
    parametri: ['Broj atoma', 'Force field', 'Temperatura', 'Pritisak', 'Vremenski korak'],
    rezultati: ['Trajektorija', 'Radijalna distribucija', 'Energija sistema', 'RMSD analiza'],
    preciznost: 93,
  },
  {
    id: 'sim-klimatski-model',
    naziv: 'Klimatski Model',
    opis: 'Simulacija klimatskih promena — temperatura, padavine, nivo mora i emisije gasova sa efektom staklene bašte',
    ikona: '🌡️',
    kategorija: 'ekologija',
    status: 'pokrenuta',
    verzija: '1.5.0',
    parametri: ['CO2 emisije', 'Temperatura oceana', 'Ledeni pokrivač', 'Albedo', 'Solarni ciklus'],
    rezultati: ['Temperatura prognoza', 'Nivo mora projekcija', 'Padavine mapa', 'Ekstremni događaji'],
    preciznost: 82,
  },
];

// ─── Laboratorijski Alati ────────────────────────────────

export const laboratorijskiAlati: LaboratorijskiAlat[] = [
  {
    id: 'alat-spektralni-analizator',
    naziv: 'Spektralni Analizator',
    opis: 'Analizator spektralnih podataka — frekvencijska analiza, FFT transformacija i spektrogram',
    ikona: '📊',
    tip: 'Analiza',
    mogucnosti: ['FFT transformacija', 'Spektrogram', 'Frekvencijska analiza', 'Harmonička detekcija', 'Filtriranje šuma'],
  },
  {
    id: 'alat-vizualizator-3d',
    naziv: 'Vizualizator 3D',
    opis: 'Trodimenzionalni vizualizator — renderovanje simulacija u 3D prostoru sa interaktivnom kontrolom',
    ikona: '🎨',
    tip: 'Vizualizacija',
    mogucnosti: ['3D renderovanje', 'Interaktivna rotacija', 'Presek pogledi', 'Animacija rezultata', 'Export slike/video'],
  },
  {
    id: 'alat-merac-performansi',
    naziv: 'Merač Performansi',
    opis: 'Merenje performansi simulacija — brzina, memorija, CPU/GPU utilizacija i optimizacija',
    ikona: '⏱️',
    tip: 'Performanse',
    mogucnosti: ['CPU profajliranje', 'GPU utilizacija', 'Memorija monitoring', 'Brzina kalkulacije', 'Optimizacione preporuke'],
  },
  {
    id: 'alat-data-logger',
    naziv: 'Data Logger',
    opis: 'Sistem za beleženje podataka — logovanje parametara, rezultata i metapodataka simulacija',
    ikona: '📝',
    tip: 'Logovanje',
    mogucnosti: ['Kontinualno logovanje', 'Vremenski pečat', 'Filtriranje zapisa', 'Pretraga logova', 'Automatski backup'],
  },
  {
    id: 'alat-kalibracija-sistem',
    naziv: 'Kalibracija Sistem',
    opis: 'Sistem za kalibraciju simulacija — podešavanje parametara, validacija i verifikacija modela',
    ikona: '🎯',
    tip: 'Kalibracija',
    mogucnosti: ['Auto-kalibracija', 'Referentni podaci', 'Validacija modela', 'Verifikacija rezultata', 'Senzitivnost analiza'],
  },
  {
    id: 'alat-export-modul',
    naziv: 'Export Modul',
    opis: 'Modul za izvoz podataka — CSV, JSON, XML, PDF i grafički formati za rezultate simulacija',
    ikona: '📤',
    tip: 'Export',
    mogucnosti: ['CSV export', 'JSON export', 'XML export', 'PDF izveštaji', 'Grafički export (PNG, SVG)'],
  },
  {
    id: 'alat-kolaborativni-prostor',
    naziv: 'Kolaborativni Radni Prostor',
    opis: 'Prostor za timsku saradnju — deljenje simulacija, komentari, verzionisanje i real-time kolaboracija',
    ikona: '👥',
    tip: 'Kolaboracija',
    mogucnosti: ['Deljenje simulacija', 'Real-time kolaboracija', 'Komentari i diskusije', 'Verzionisanje', 'Kontrola pristupa'],
  },
  {
    id: 'alat-automatski-izvestaji',
    naziv: 'Automatski Izveštaji',
    opis: 'Generator automatskih izveštaja — sumarni, detaljni i komparativni izveštaji sa vizualizacijama',
    ikona: '📋',
    tip: 'Izveštavanje',
    mogucnosti: ['Sumarni izveštaji', 'Detaljne analize', 'Komparativni izveštaji', 'Grafici i dijagrami', 'Automatsko slanje'],
  },
];

// ─── Kompletna IOOpenUIAO Laboratorija ───────────────────

function izracunajStatistiku(): LaboratorijaStatistika {
  const aktivnih = simulacije.filter((s) => s.status === 'aktivna').length;
  const prosek = simulacije.length > 0
    ? Math.round(simulacije.reduce((acc, s) => acc + s.preciznost, 0) / simulacije.length)
    : 0;
  const kategorije = new Set(simulacije.map((s) => s.kategorija)).size;

  return {
    ukupnoSimulacija: simulacije.length,
    aktivnihSimulacija: aktivnih,
    ukupnoAlata: laboratorijskiAlati.length,
    prosecnaPreciznost: prosek,
    ukupnoKategorija: kategorije,
  };
}

export const ioOpenUIAOLaboratorija: IOOpenUIAOLaboratorija = {
  naziv: 'IOOpenUIAO Laboratorija za Simulacije',
  opis:
    'Laboratorija za simulacije koja izvodi razne simulacije za celokupni SPAJA ekosistem — ' +
    'fizika, hemija, biologija, matematika, AI/ML, inženjerstvo, ekonomija i ekologija. Pokretana ' +
    'od strane SPAJA Generator za Endžine koji prevlači engine-e preko svih simulacionih modula.',
  verzija: '1.0.0',
  link: 'https://chatgpt.com/c/694db5ba-2930-8331-898c-a9f3eb2a96d6',
  generatorLink: 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de',
  simulacije,
  alati: laboratorijskiAlati,
  statistika: izracunajStatistiku(),
};

// ─── Helper funkcije ─────────────────────────────────────

export function getAktivneSimulacije(): Simulacija[] {
  return simulacije.filter((s) => s.status === 'aktivna');
}

export function getSimulacijePoKategoriji(kat: SimulacijaKategorija): Simulacija[] {
  return simulacije.filter((s) => s.kategorija === kat);
}

export function getSimulacijaPoId(id: string): Simulacija | undefined {
  return simulacije.find((s) => s.id === id);
}

export function getAlati(): LaboratorijskiAlat[] {
  return laboratorijskiAlati;
}

export function getLaboratorijaStatistika(): LaboratorijaStatistika {
  return izracunajStatistiku();
}
