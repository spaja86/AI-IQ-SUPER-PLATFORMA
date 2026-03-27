import type { Sekvenca } from '@/lib/types';

const persone = [
  { uloga: 'Arhitekta', opis: 'Dizajnira sistemsku arhitekturu', ikona: '🏗️' },
  { uloga: 'Cuvar', opis: 'Cuva bezbednost i integritet sistema', ikona: '🛡️' },
  { uloga: 'Lekar', opis: 'Dijagnostikuje i popravlja probleme', ikona: '⚕️' },
  { uloga: 'Graditelj', opis: 'Gradi nove funkcionalnosti', ikona: '🔨' },
  { uloga: 'Dizajner', opis: 'Kreira UI/UX resenja', ikona: '🎨' },
  { uloga: 'Optimizator', opis: 'Optimizuje performanse', ikona: '⚡' },
  { uloga: 'Strateg', opis: 'Planira strategiju razvoja', ikona: '♟️' },
  { uloga: 'Naucnik', opis: 'Istrazuje nove tehnologije', ikona: '🔬' },
  { uloga: 'Mentor', opis: 'Obucava i vodi tim', ikona: '🎓' },
  { uloga: 'Integrator', opis: 'Integrise razlicite sisteme', ikona: '🔗' },
  { uloga: 'Analiticar', opis: 'Analizira podatke i metrike', ikona: '📊' },
  { uloga: 'Komunikator', opis: 'Upravlja komunikacijom', ikona: '📢' },
  { uloga: 'Evolver', opis: 'Evolucija i napredak sistema', ikona: '🧬' },
  { uloga: 'Tester', opis: 'Testira kvalitet koda', ikona: '🧪' },
  { uloga: 'Dokumentar', opis: 'Pise dokumentaciju', ikona: '📝' },
  { uloga: 'Finansijer', opis: 'Upravlja finansijama', ikona: '💰' },
  { uloga: 'Kreator', opis: 'Kreira sadrzaj i resurse', ikona: '✨' },
  { uloga: 'Skalator', opis: 'Skalira infrastrukturu', ikona: '📐' },
  { uloga: 'Monitor', opis: 'Nadzire operacije u realnom vremenu', ikona: '👁️' },
  { uloga: 'Ekolog', opis: 'Brine o zdravlju ekosistema', ikona: '🌿' },
  { uloga: 'Vizionar', opis: 'Vizija buducnosti platforme', ikona: '🔮' },
];

export const omegaAISekvence: Sekvenca[] = [
  {
    id: 'omega-hero',
    tip: 'hero',
    naslov: '🧠 OMEGA AI',
    podnaslov: '21 AI Persona za upravljanje ekosistemom',
    ikona: '🧠',
    redosled: 1,
    podaci: { opis: 'OMEGA AI je sistem od 21 specijalizovane AI persone koje automatski upravljaju, optimizuju i unapredjuju celokupan ekosistem.' },
  },
  {
    id: 'omega-tekst',
    tip: 'tekst',
    naslov: 'Sta je OMEGA AI?',
    redosled: 2,
    podaci: {
      sadrzaj: 'OMEGA AI je napredni multi-agent sistem gde svaka persona ima specijalizovanu ulogu. Zajedno, 21 persona pokriva sve aspekte upravljanja digitalnom industrijom.',
      istaknuteStavke: [
        'Svaka persona je specijalizovana za odredjenu oblast',
        'Persone komuniciraju i saradjuju medjusobno',
        'Automatska eskalacija problema',
        'Kontinuirano ucenje i adaptacija',
      ],
    },
  },
  {
    id: 'omega-statistika',
    tip: 'statistika',
    naslov: 'OMEGA AI u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Persone', vrednost: 21, ikona: '👥' },
        { naziv: 'Kategorije', vrednost: 7, ikona: '📂' },
        { naziv: 'Aktivne', vrednost: 21, ikona: '✅' },
        { naziv: 'Operativnost', vrednost: '100%', ikona: '📈' },
      ],
    },
  },
  {
    id: 'omega-kartice',
    tip: 'kartice',
    naslov: '👥 Sve OMEGA AI Persone',
    redosled: 4,
    podaci: {
      kartice: persone.map((p) => ({
        naslov: p.uloga,
        opis: p.opis,
        ikona: p.ikona,
      })),
    },
  },
  {
    id: 'omega-cta',
    tip: 'cta',
    naslov: '🚀 OMEGA AI Ekosistem',
    redosled: 5,
    podaci: {
      opis: '21 AI persona radi 24/7 za napredak platforme.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
