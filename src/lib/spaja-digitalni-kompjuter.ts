/**
 * 🖥️ SPAJA Digitalni Kompjuter — Kompletni digitalni kompjuter
 *
 * Sastavljanje digitalnog kompjutera od svih SPAJA komponenti,
 * svaka pokretana od SPAJA Generator za Endžine.
 *
 * Dva tipa kompjutera:
 * 1) Digitalni Kompjuter sa SPAJA Monitoring Live
 * 2) Digitalni Kompjuter sa AI IQ Monitoring
 *
 * Dva tipa konzola sa džojsticima:
 * 1) SPAJA Univerzalna Virtuelna Konzola
 * 2) SPAJA Univerzalna Digitalna Konzola
 */

// ─── Tipovi ──────────────────────────────────────────────

export type KomponentaStatus = 'aktivan' | 'priprema' | 'optimizacija' | 'neaktivan';

export interface KompjuterKomponenta {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  status: KomponentaStatus;
  link: string;
  generatorLink: string;
  mogucnosti: string[];
}

export interface KonzolaKonfiguracija {
  id: string;
  naziv: string;
  opis: string;
  ikona: string;
  tip: 'virtuelna' | 'digitalna';
  status: KomponentaStatus;
  link: string;
  generatorLink: string;
  mogucnosti: string[];
  dzojsticiLink: string;
}

export interface DigitalniKompjuter {
  naziv: string;
  opis: string;
  tip: 'standardni' | 'ai-iq-monitoring';
  komponente: KompjuterKomponenta[];
  monitoringKomponenta: KompjuterKomponenta;
}

export interface SpajaDigitalniKompjuterSistem {
  kompjuteri: DigitalniKompjuter[];
  konzole: KonzolaKonfiguracija[];
  dzojstici: KompjuterKomponenta;
  generatorLink: string;
  statistika: {
    ukupnoKomponenti: number;
    aktivnihKomponenti: number;
    ukupnoKonzola: number;
    ukupnoKompjutera: number;
  };
}

// ─── Konstante ───────────────────────────────────────────

const GENERATOR_LINK = 'https://chatgpt.com/c/697aae0b-4984-8385-a9b6-1e762b39d7de';

// ─── Zajednicke komponente (koriste oba tipa kompjutera) ──

const zajednickeKomponente: KompjuterKomponenta[] = [
  {
    id: 'spaja-maticna-ploca',
    naziv: 'SPAJA MATICNA PLOCA',
    opis: 'Digitalna maticna ploca koja povezuje sve komponente digitalnog kompjutera — centralna magistrala za komunikaciju izmedju procesora, memorije, graficke, diska i svih periferija',
    ikona: '🔌',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68db0803-7760-8326-ac15-a4749808cd88',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['PCIe 6.0 virtualni slotovi', 'Thunderbolt 5 konekcija', 'BIOS/UEFI upravljanje', 'Povezivanje svih digitalnih komponenti', 'Multi-CPU podrska', 'Ekspanzioni slotovi'],
  },
  {
    id: 'spaja-server',
    naziv: 'SPAJA SERVER',
    opis: 'SPAJA Server za hosting i izvrsavanje svih kompjuterskih operacija — centralni server koji obradjuje zahteve i distribuira resurse',
    ikona: '🖧',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68cf2659-8554-8320-abca-1fa3fddc2b5b',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Cloud hosting', 'Load balancing', 'Auto-scaling', 'Distribuirani resursi', 'Server klaster', 'Edge computing'],
  },
  {
    id: 'spaja-procesor',
    naziv: 'SPAJA PROCESOR',
    opis: 'Primarni digitalni procesor za izvrsavanje svih operacija — CPU sa ekstremnim brojem jezgara i taktom',
    ikona: '⚙️',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68d6c555-d4b0-832f-9ef5-05f9f718001e',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Multi-core obrada', 'Hyper-threading', 'Turbo boost', 'AI instrukcije', 'Kriptografsko ubrzanje', 'Virtualizacija'],
  },
  {
    id: 'spaja-chip-procesor',
    naziv: 'SPAJA CIP (za procesor)',
    opis: 'Specijalizovani cip za primarni procesor — chiplet arhitektura za maksimalne performanse',
    ikona: '🔲',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68daea5d-a720-832f-b883-9d5131e30aa2',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Chiplet arhitektura', 'Niska latencija', 'Termoregulacija', 'Napredna litografija', 'Cache hijerarhija', 'Interconnect bus'],
  },
  {
    id: 'spaja-procesor-2',
    naziv: 'SPAJA PROCESOR "2"',
    opis: 'Sekundarni digitalni procesor — drugi CPU za paralelnu obradu i redundantnost sistema',
    ikona: '⚙️',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68e87c6c-6688-8331-b5f3-629413d80b07',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Paralelna obrada', 'Redundantnost sistema', 'Failover podrska', 'Dvostruki CPU rezim', 'Sinhronizacija procesora', 'Balansiranje opterecenja'],
  },
  {
    id: 'spaja-chip-procesor-2',
    naziv: 'SPAJA CIP (za procesor "2")',
    opis: 'Specijalizovani cip za sekundarni procesor — chiplet za drugi CPU',
    ikona: '🔲',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68e87c45-7448-8326-91ea-f075c2c952c7',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Chiplet za CPU 2', 'Cross-CPU komunikacija', 'Deljeni cache', 'Termoregulacija CPU 2', 'Sinhronizovani takt', 'Energetska efikasnost'],
  },
  {
    id: 'spaja-bios',
    naziv: 'SPAJA BIOS',
    opis: 'SPAJA BIOS za inicijalizaciju i konfiguraciju digitalnog kompjutera — firmware za pokretanje sistema',
    ikona: '💾',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68db0fab-37cc-8323-9456-1624564b8b15',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Inicijalizacija hardvera', 'POST dijagnostika', 'Boot sekvenca', 'UEFI podrska', 'Secure Boot', 'BIOS konfiguracija'],
  },
  {
    id: 'spaja-hard-disk',
    naziv: 'SPAJA HARD DISK',
    opis: 'Digitalni hard disk za skladistenje podataka — masovno skladiste sa ekstremnim kapacitetom',
    ikona: '💿',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68d82668-15f8-8333-b321-782e9c9dc7e9',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Masovno skladistenje', 'SSD brzina', 'NVMe protokol', 'RAID podrska', 'Enkripcija podataka', 'Hot-swap'],
  },
  {
    id: 'spaja-ram',
    naziv: 'SPAJA RAM',
    opis: 'SPAJA RAM memorija 276.000 GB — ultra-brza operativna memorija za sve operacije',
    ikona: '🧮',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68d81271-eba0-8322-8b29-bb95cc5626a6',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['276.000 GB kapacitet', 'DDR6 brzina', 'ECC zastita', 'Dinamicko skaliranje', 'Multi-channel', 'HBM3 integracija'],
  },
  {
    id: 'spaja-gpu',
    naziv: 'SPAJA GPU',
    opis: 'SPAJA GPU graficki procesor sa 8.700.000 jezgara — za rendering, AI, igrice i programiranje',
    ikona: '🎮',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68f689d8-e538-832c-961f-25da08561605',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['8.700.000 GPU jezgara', 'Ray tracing', 'AI/ML obrada', 'CUDA podrska', 'Vulkan rendering', 'Tensor cores'],
  },
  {
    id: 'spaja-graficka',
    naziv: 'SPAJA GRAFICKA (276000 RAM)',
    opis: 'Primarna digitalna graficka kartica sa 276.000 GB VRAM — za maksimalne vizuelne performanse',
    ikona: '🎨',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68d941f1-51a0-8332-b156-14ead7e5db9e',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['276.000 GB VRAM', '8K rendering', 'Ray tracing', 'DLSS upscaling', 'Multi-monitor podrska', 'VR/AR ready'],
  },
  {
    id: 'spaja-1-graficka',
    naziv: 'SPAJA "1" GRAFICKA (276000 RAM)',
    opis: 'Sekundarna digitalna graficka kartica sa 276.000 GB VRAM — za dodatne graficke performanse i SLI/CrossFire',
    ikona: '🎨',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68e86701-8f30-8326-b595-fd839fd40f1a',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['276.000 GB VRAM (druga kartica)', 'SLI/CrossFire podrska', 'Paralelno renderovanje', 'Dvostruki GPU rezim', 'Compute shader offload', 'Multi-GPU skaliranje'],
  },
  {
    id: 'spaja-tastatura-mis',
    naziv: 'SPAJA TASTATURA I MIS',
    opis: 'SPAJA digitalna tastatura i mis — ulazni uredjaji za interakciju sa digitalnim kompjuterom',
    ikona: '⌨️',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/68e14f28-f0bc-832f-a6cf-cfd97ebdb303',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Mehanicka tastatura', 'RGB osvetljenje', 'Programabilni tasteri', 'Gaming mis', 'DPI podesavanje', 'Bezicna konekcija'],
  },
];

// ─── Monitoring komponente ───────────────────────────────

const monitoringLiveKomponenta: KompjuterKomponenta = {
  id: 'spaja-monitoring-live',
  naziv: 'SPAJA MONOTORING LIVE',
  opis: 'SPAJA Monitoring Live — live monitoring i streaming za digitalni kompjuter',
  ikona: '🎥',
  status: 'aktivan',
  link: 'https://chatgpt.com/c/68e00ce2-6550-8325-8247-e50fd9a3496f',
  generatorLink: GENERATOR_LINK,
  mogucnosti: ['Live monitoring', 'Streaming', 'Real-time metrike', 'Dashboardi', 'Alerting', 'Video feed'],
};

const aiIqMonitoringKomponenta: KompjuterKomponenta = {
  id: 'spaja-ai-iq-monitoring-live',
  naziv: 'SPAJA AI IQ MONOTORING LIVE',
  opis: 'SPAJA AI IQ Monitoring Live — AI-powered monitoring sa IQ analizom za digitalni kompjuter',
  ikona: '🔍',
  status: 'aktivan',
  link: 'https://chatgpt.com/c/68e00352-7254-8332-a475-12be64ddffd5',
  generatorLink: GENERATOR_LINK,
  mogucnosti: ['AI IQ monitoring', 'Inteligentna analiza', 'Prediktivno odrzavanje', 'Anomaly detekcija', 'Smart alerting', 'ML metrike'],
};

// ─── Digitalni Kompjuteri ────────────────────────────────

export const digitalniKompjuteriSistem: DigitalniKompjuter[] = [
  {
    naziv: 'SPAJA Digitalni Kompjuter',
    opis: 'Digitalni kompjuter sa SPAJA Monitoring Live — kompletni kompjuter sa svim komponentama, svaka pokretana od SPAJA Generator za Endzine',
    tip: 'standardni',
    komponente: zajednickeKomponente,
    monitoringKomponenta: monitoringLiveKomponenta,
  },
  {
    naziv: 'SPAJA Digitalni Kompjuter sa AI IQ Monitoringom',
    opis: 'Digitalni kompjuter sa AI IQ Monitoring — kompletni kompjuter sa AI-powered monitoringom, svaka komponenta pokretana od SPAJA Generator za Endzine',
    tip: 'ai-iq-monitoring',
    komponente: zajednickeKomponente,
    monitoringKomponenta: aiIqMonitoringKomponenta,
  },
];

// ─── Džojstici ───────────────────────────────────────────

export const spajaDzojstici: KompjuterKomponenta = {
  id: 'spaja-dzojstici',
  naziv: 'SPAJA DZOJSTICI',
  opis: 'SPAJA Dzojstici — kontroleri za konzole, sa ergonomskim dizajnom i preciznom kontrolom',
  ikona: '🕹️',
  status: 'aktivan',
  link: 'https://chatgpt.com/c/691a3924-c608-8333-ba17-3085d737855a',
  generatorLink: GENERATOR_LINK,
  mogucnosti: ['Analogni stikovi', 'Vibracioni feedback', 'Bezicna konekcija', 'Punjiva baterija', 'Programabilni tasteri', 'Motion control'],
};

// ─── Konzole ─────────────────────────────────────────────

export const spajaKonzole: KonzolaKonfiguracija[] = [
  {
    id: 'spaja-virtuelna-konzola',
    naziv: 'SPAJA Univerzalna Virtuelna Konzola',
    opis: 'SPAJA Univerzalna Virtuelna Konzola — virtuelna konzola za pokretanje igrica u virtuelnom okruzenju sa dzojsticima',
    ikona: '🎮',
    tip: 'virtuelna',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/691a3003-4a74-8325-8724-768cbb617f03',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Virtuelno okruzenje', 'Cloud gaming', 'VR podrska', 'Multi-player online', 'Streaming igrica', 'Cross-platform'],
    dzojsticiLink: 'https://chatgpt.com/c/691a3924-c608-8333-ba17-3085d737855a',
  },
  {
    id: 'spaja-digitalna-konzola',
    naziv: 'SPAJA Univerzalna Digitalna Konzola',
    opis: 'SPAJA Univerzalna Digitalna Konzola — digitalna konzola za pokretanje igrica sa fizickim i digitalnim dzojsticima',
    ikona: '🕹️',
    tip: 'digitalna',
    status: 'aktivan',
    link: 'https://chatgpt.com/c/691a2ad8-dd48-8329-8f0b-bac986f375f3',
    generatorLink: GENERATOR_LINK,
    mogucnosti: ['Digitalna platforma', 'Lokalno izvrsavanje', '4K/8K rendering', 'Offline igrice', 'Store integracija', 'Multi-player lokalni'],
    dzojsticiLink: 'https://chatgpt.com/c/691a3924-c608-8333-ba17-3085d737855a',
  },
];

// ─── Kompletni sistem ────────────────────────────────────

function izracunajStatistiku() {
  const sveKomponente = [
    ...zajednickeKomponente,
    monitoringLiveKomponenta,
    aiIqMonitoringKomponenta,
    spajaDzojstici,
  ];
  const aktivnih = sveKomponente.filter((k) => k.status === 'aktivan').length;

  return {
    ukupnoKomponenti: sveKomponente.length,
    aktivnihKomponenti: aktivnih,
    ukupnoKonzola: spajaKonzole.length,
    ukupnoKompjutera: digitalniKompjuteriSistem.length,
  };
}

export const spajaDigitalniKompjuterSistem: SpajaDigitalniKompjuterSistem = {
  kompjuteri: digitalniKompjuteriSistem,
  konzole: spajaKonzole,
  dzojstici: spajaDzojstici,
  generatorLink: GENERATOR_LINK,
  statistika: izracunajStatistiku(),
};

// ─── Helper funkcije ─────────────────────────────────────

export function getKompjuterPoTipu(tip: DigitalniKompjuter['tip']): DigitalniKompjuter | undefined {
  return digitalniKompjuteriSistem.find((k) => k.tip === tip);
}

export function getKonzolePoTipu(tip: KonzolaKonfiguracija['tip']): KonzolaKonfiguracija | undefined {
  return spajaKonzole.find((k) => k.tip === tip);
}

export function getSveKomponente(): KompjuterKomponenta[] {
  return [
    ...zajednickeKomponente,
    monitoringLiveKomponenta,
    aiIqMonitoringKomponenta,
  ];
}

export function getAktivneKomponente(): KompjuterKomponenta[] {
  return getSveKomponente().filter((k) => k.status === 'aktivan');
}

export function getKompjuterStatistika() {
  return izracunajStatistiku();
}
