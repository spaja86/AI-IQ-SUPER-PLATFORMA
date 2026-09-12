import { APP_VERSION, KOMPANIJA } from './constants';
import { BRAND_ASSETS } from './brand';

export interface DiktorModule {
  id: string;
  naziv: string;
  opis: string;
  status: 'aktivan' | 'pilot' | 'u-pripremi';
  cta: { tekst: string; href: string };
  identitet: string[];
}

export interface DiktorSloj {
  naziv: string;
  funkcija: string;
}

export interface DiktorCommandCenter {
  naziv: string;
  verzija: string;
  slogan: string;
  heroSlika: string;
  slojevi: DiktorSloj[];
  kpi: Array<{ naziv: string; vrednost: string; ikona: string }>;
  moduli: DiktorModule[];
  partnerstva: string[];
  projekti: string[];
  aktivnosti: string[];
  obavestenja: string[];
}

export function getDiktorCommandCenter(): DiktorCommandCenter {
  return {
    naziv: 'DIKTOR Command Center',
    verzija: APP_VERSION,
    slogan: 'Povezujemo ljude, kompanije i budućnost.',
    heroSlika: BRAND_ASSETS.diktorHero,
    slojevi: [
      { naziv: 'DIKTOR', funkcija: 'Centralna vizija, slogan i identitet komandnog centra' },
      { naziv: 'DURM', funkcija: 'Operativni raspored, aktivnosti i ritam rada' },
      { naziv: 'EKSICION', funkcija: 'KPI, analitika i live signal mreza' },
      { naziv: 'SUSTRAS', funkcija: 'Partnerstva, projekti i strateske veze' },
      { naziv: 'DEKORATOR', funkcija: 'Vizuelni polish, glass UI i reusable brand sloj' },
    ],
    kpi: [
      { naziv: 'Aktivni moduli', vrednost: '4', ikona: '🧩' },
      { naziv: 'Partner pipeline', vrednost: '18', ikona: '🤝' },
      { naziv: 'Live KPI kanali', vrednost: '12', ikona: '📈' },
      { naziv: 'Aktivnosti / dan', vrednost: '240+', ikona: '⚡' },
    ],
    moduli: [
      {
        id: 'wotermelow',
        naziv: 'WOTERMELOW',
        opis: 'Operativni signalni centar za aktivnosti, task tokove i orkestraciju timova.',
        status: 'aktivan',
        cta: { tekst: 'Otvori operativni tok', href: '/autofinish' },
        identitet: ['dark-cyber', 'activity-stream', 'ops-glass'],
      },
      {
        id: 'digon',
        naziv: 'DIGON',
        opis: 'B2B partnerstva, monetizacija, pipeline pregovora i komercijalni CTA sloj.',
        status: 'aktivan',
        cta: { tekst: 'Pogledaj partnerstva', href: '/reklame-i-partnerstva' },
        identitet: ['partner-led', 'neon-outline', 'revenue-node'],
      },
      {
        id: 'oken',
        naziv: 'OKEN',
        opis: 'KPI, analitika, upozorenja i health signal koji prati spremnost ekosistema.',
        status: 'pilot',
        cta: { tekst: 'Pregled KPI-ja', href: '/industrija' },
        identitet: ['kpi-monitor', 'alert-grid', 'glass-metrics'],
      },
      {
        id: 'diktar',
        naziv: 'DIKTAR',
        opis: 'Decision cockpit za CTA, prioritete, obaveštenja i koordinaciju projekata.',
        status: 'aktivan',
        cta: { tekst: 'Otvori go-live plan', href: '/go-live-digitalna-industrija' },
        identitet: ['decision-core', 'cta-engine', 'executive-hub'],
      },
    ],
    partnerstva: ['Tehnologija', 'Gaming', 'Finansije', 'Media', 'Telekom', 'B2B integracije'],
    projekti: ['Digitalna Industrija', 'AI IQ World Bank', 'EXTRIMLI', 'Story / Editorial', 'Start Pretplate'],
    aktivnosti: [
      'Novi partner lead ulazi u DIGON tok.',
      'OKEN podiže signal kada KPI odstupa od launch cilja.',
      'DIKTAR objavljuje naredni CTA i kampanjski prioritet.',
    ],
    obavestenja: [
      'Premium dark-cyber / glass UI template spreman za reuse.',
      `${KOMPANIJA} koristi isti template za command-center i druge B2B površine.`,
      'Template zadržava generičku strukturu za buduće vertikale.',
    ],
  };
}
