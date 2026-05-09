import type { Sekvenca } from '@/lib/types';
import { getStatistike } from '@/lib/statistika';
import { osnivacProfil, getOsnivacFotografije } from '@/lib/vizuelni-identitet';
import { OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';
import { getKontaktKanal, primarniOperativniNalog } from '@/lib/kompanija-spaja-operativa';

const stats = getStatistike();
const fotografije = getOsnivacFotografije();
const supportKontakt = getKontaktKanal('support');
const businessKontakt = getKontaktKanal('business');
const salesKontakt = getKontaktKanal('sales');
const securityKontakt = getKontaktKanal('security');

export const kompanijaSekvence: Sekvenca[] = [
  {
    id: 'kompanija-hero',
    tip: 'hero',
    naslov: '🏢 Kompanija SPAJA',
    podnaslov: 'Digitalna industrija koja spaja tehnologiju i inovacije',
    ikona: '🏢',
    redosled: 1,
    podaci: {
      opis: 'Kompanija SPAJA je digitalna industrija koja upravlja sa vise platformi, IT proizvoda i AI agenata. Misija je da spoji sve aspekte digitalnog poslovanja u jedan ekosistem.',
      dugmad: [
        { tekst: 'Organizacija', href: '/organizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'kompanija-osnivac',
    tip: 'slika',
    naslov: `👤 ${osnivacProfil.punoIme} — ${osnivacProfil.titula}`,
    podnaslov: osnivacProfil.opis,
    redosled: 2,
    podaci: {
      slike: fotografije.map((f) => ({
        url: f.url,
        alt: f.alt,
        zaobljeno: true,
      })),
      raspored: 'red',
    },
  },
  {
    id: 'kompanija-tekst',
    tip: 'tekst',
    naslov: 'Misija i vizija',
    redosled: 3,
    podaci: {
      sadrzaj: 'Kompanija SPAJA ima za cilj da postane lider u digitalnoj industriji kroz inovativne platforme, naprednu vestacku inteligenciju i jedinstveni ekosistem koji povezuje sve digitalne servise.',
      istaknuteStavke: [
        'Misija: Spajanje svih digitalnih servisa u jednu celinu',
        'Vizija: Globalna digitalna korporacija sa AI autonomijom',
        'Vrednosti: Inovacija, Pouzdanost, Skalabilnost',
        'Fokus: Platforme, AI agenti, Finansijski servisi',
      ],
    },
  },
  {
    id: 'kompanija-statistika',
    tip: 'statistika',
    naslov: '📊 Kompanija u brojevima',
    redosled: 4,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: stats.ukupnoPlatformi, ikona: '🌐' },
        { naziv: 'IT Proizvodi', vrednost: stats.ukupnoProizvoda, ikona: '⚡' },
        { naziv: 'AI Persone', vrednost: 21, ikona: '🧠' },
        { naziv: 'God. osnivanja', vrednost: 2024, ikona: '📅' },
      ],
    },
  },
  {
    id: 'kompanija-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Struktura kompanije',
    redosled: 5,
    podaci: {
      nivoi: [
        { naziv: 'Kompanija SPAJA', ikona: '🏢', deca: ['Tehnologija', 'Finansije', 'AI Division', 'Operacije'] },
        { naziv: 'Tehnologija', ikona: '💻', deca: ['Platforme', 'IT Proizvodi', 'Infrastruktura'] },
        { naziv: 'Finansije', ikona: '💰', deca: ['Banka', 'Menjacnica', 'Investicije'] },
        { naziv: 'AI Division', ikona: '🧠', deca: ['OMEGA AI', 'ML Modeli', 'Automatizacija'] },
        { naziv: 'Operacije', ikona: '⚙️', deca: ['Deploy', 'Monitoring', 'Podrska'] },
      ],
    },
  },
  {
    id: 'kompanija-kartice',
    tip: 'kartice',
    naslov: '🏛️ Sektori kompanije',
    redosled: 6,
    podaci: {
      kartice: [
        { naslov: 'Tehnologija', opis: 'Razvoj platformi i IT proizvoda', ikona: '💻', oznake: ['Next.js', 'TypeScript', 'Vercel'] },
        { naslov: 'Finansije', opis: 'Digitalno bankarstvo i menjacnica', ikona: '💰', oznake: ['Banka', 'Menjacnica', 'Kripto'] },
        { naslov: 'AI Division', opis: `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona za automatizaciju`, ikona: '🧠', oznake: ['GPT-4', 'OpenAI', 'LangChain'] },
        { naslov: 'Operacije', opis: 'Deploy, monitoring i infrastruktura', ikona: '⚙️', oznake: ['Vercel', 'GitHub', 'CI/CD'] },
      ],
    },
  },
  {
    id: 'kompanija-operativni-kontakti',
    tip: 'lista',
    naslov: '📞 Operativni kontakti',
    redosled: 7,
    podaci: {
      stavke: [
        { ikona: '📧', naslov: supportKontakt?.email ?? 'support@spaja.rs', opis: 'Korisnicka podrska, onboarding i standardni upiti' },
        { ikona: '💼', naslov: businessKontakt?.email ?? 'business@spaja.rs', opis: 'Biznis/B2B saradnja i partnerstva' },
        { ikona: '🤝', naslov: salesKontakt?.email ?? 'sales@spaja.rs', opis: 'Pregovori i enterprise upiti za Vercel/GitHub operativu' },
        { ikona: '🛡️', naslov: securityKontakt?.email ?? 'security@kompanija-spaja.rs', opis: 'Security incidenti i privatne prijave ranjivosti' },
        { ikona: '🛟', naslov: primarniOperativniNalog.email, opis: 'Fallback owner kontakt dok se svi kompanijski kanali ne potvrde kroz produkcionu operativu' },
      ],
    },
  },
  {
    id: 'kompanija-cta',
    tip: 'cta',
    naslov: '🚀 Priduzite se ekosistemu',
    redosled: 8,
    podaci: {
      opis: 'Kompanija SPAJA — digitalna industrija buducnosti.',
      dugmad: [
        { tekst: 'Organizacija', href: '/organizacija' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
