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
    naslov: 'Nikola Spajić',
    podnaslov: 'Osnivač, developer i kreator digitalnog ekosistema Kompanije SPAJA',
    ikona: '👤',
    redosled: 1,
    podaci: {
      opis: 'Javni profil Nikole Spajića fokusira se na proverljiv rad: osnivanje Kompanije SPAJA, vođenje Digitalne Industrije, razvoj platformi, AI sistema i profesionalnu saradnju kroz jasan, audit-safe i ozbiljan proizvodni okvir.',
      dugmad: [
        { tekst: 'Ekosistem', href: '/ekosistem' },
        { tekst: 'Kompanija SPAJA', href: '/organizacija', stil: 'sekundarno' },
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
    id: 'kompanija-profesionalni-profil',
    tip: 'tekst',
    naslov: 'Profesionalni profil',
    redosled: 3,
    podaci: {
      sadrzaj: 'Nikola Spajić vodi Kompaniju SPAJA kao osnivač i CEO sa fokusom na razvoj ozbiljnog digitalnog ekosistema: platforme, AI servisi, operativna infrastruktura i profesionalni governance okvir ostaju objedinjeni u jednoj javno razumljivoj priči.',
      istaknuteStavke: [
        'Uloga: osnivač, developer, kreator i nosilac digitalnog ekosistema',
        'Odgovornost: strateški razvoj platformi, AI sistema i operativnih tokova',
        'Pristup: profesionalan, jasan i proverljiv javni nastup bez nejasnih paralelnih narativa',
        'Fokus: proizvodi, partnerstva, governance disciplina i dugoročna održivost',
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
    id: 'kompanija-biografija',
    tip: 'lista',
    naslov: 'Biografija i javna priča',
    redosled: 5,
    podaci: {
      stavke: [
        {
          ikona: '🏢',
          naslov: 'Osnivač Kompanije SPAJA',
          opis: 'Nikola Spajić je javno predstavljen kao osnivač i CEO kompanije koja objedinjuje Digitalnu Industriju, platforme, proizvode i operativnu koordinaciju.',
        },
        {
          ikona: '💻',
          naslov: 'Developer i produktni kreator',
          opis: 'Rad je usmeren na razvoj ozbiljnih digitalnih površina: aplikacija, API slojeva, AI tokova, prezentacionih stranica i produkcionog iskustva za korisnike i partnere.',
        },
        {
          ikona: '🧠',
          naslov: 'Nosilac AI i ekosistemskog okvira',
          opis: 'AI IQ SUPER PLATFORMA, OMEGA AI i povezane površine predstavljene su kao deo jednog koordinisanog sistema, a ne kao nepovezani projekti.',
        },
        {
          ikona: '🤝',
          naslov: 'Profesionalna saradnja i javni kredibilitet',
          opis: 'Javna prezentacija ostaje fokusirana na proizvode, rezultate, odgovornost, partnerstva i proverljive kontakt tačke za enterprise i B2B komunikaciju.',
        },
      ],
    },
  },
  {
    id: 'kompanija-kljucni-projekti',
    tip: 'kartice',
    naslov: 'Ključni projekti i platforme',
    podnaslov: 'Pregled javno relevantnih površina koje Nikola Spajić vodi ili predstavlja kroz Kompaniju SPAJA',
    redosled: 6,
    podaci: {
      kartice: [
        {
          naslov: 'AI IQ SUPER PLATFORMA',
          opis: 'Centralna platforma Digitalne Industrije za aplikacije, integracije, AI orkestraciju i javni proizvodni sloj.',
          ikona: '🌀',
          href: '/',
          oznake: ['Platforma', 'AI', 'Digitalna Industrija'],
        },
        {
          naslov: 'Kompanija SPAJA',
          opis: 'Matična kompanijska površina za organizaciju, operativni okvir, poslovne kontakte i profesionalnu prezentaciju osnivača.',
          ikona: '🏢',
          href: '/kompanija',
          oznake: ['Kompanija', 'Osnivač', 'Operativa'],
        },
        {
          naslov: 'IO-OPENUI-AO',
          opis: 'Povezana produktna površina koja predstavlja downstream deo šireg digitalnog ekosistema.',
          ikona: '🎮',
          href: '/io-openui-ao-gaming-platforma',
          oznake: ['Linked repo', 'Product surface', 'Gaming'],
        },
        {
          naslov: 'OMEGA AI',
          opis: 'AI sistem sa personama, podrškom za automatizaciju i koordinacijom različitih domena rada.',
          ikona: '🧠',
          href: '/omega-ai',
          oznake: ['AI', 'Persone', 'Automatizacija'],
        },
        {
          naslov: 'SPAJA Banka i Menjačnica',
          opis: 'Finansijske i operativne površine kroz koje se prikazuju poslovni i infrastrukturni tokovi ekosistema.',
          ikona: '💼',
          href: '/banka',
          oznake: ['Finansije', 'Operativa', 'Infrastruktura'],
        },
        {
          naslov: 'EXTRIMLI / Developer-Create okvir',
          opis: 'Interni governance i readiness model koji ostaje prisutan kao audit-safe metodologija, a ne kao dominantni marketinški narativ.',
          ikona: '🛡️',
          href: '/extrimli-price',
          oznake: ['Governance', 'Audit-safe', 'Developer/Create'],
        },
      ],
    },
  },
  {
    id: 'kompanija-javni-interni-sloj',
    tip: 'tabela',
    naslov: 'Javni profil i interni governance sloj',
    redosled: 7,
    podaci: {
      zaglavlje: ['Sloj', 'Namena', 'Šta se javno prikazuje'],
      redovi: [
        ['Javni sajt', 'Profesionalna prezentacija Nikole Spajića', 'Biografija, projekti, odgovornosti, kontakt i partnerstva'],
        ['Kompanijski sloj', 'Operativni i organizacioni kontekst', 'Kompanija SPAJA, Digitalna Industrija, proizvodi i javni kontakti'],
        ['EXTREM', 'Tehnička spremnost i sadržajna potpunost', 'Samo audit-safe rezultat, bez internog tehničkog žargona u glavnoj priči'],
        ['EXTRONDOL', 'Review, compliance, rollout i release audit', 'Samo sažet governance rezultat i public-safe reference'],
        ['SPAJA KOD', 'Javni summary boundary', 'Kratak, ozbiljan i proverljiv izlaz bez internih formula'],
      ],
    },
  },
  {
    id: 'kompanija-metodologija',
    tip: 'lista',
    naslov: 'Developer/Create metodologija',
    redosled: 8,
    podaci: {
      stavke: [
        {
          ikona: '🔒',
          naslov: 'Additive-only pristup',
          opis: 'Javna prezentacija ne ruši postojeći EXTRIMLI/EXTREM/EXTRONDOL model i ne uvodi novi paralelni source-of-truth.',
        },
        {
          ikona: '🧭',
          naslov: 'Jasna podela uloga',
          opis: 'EXTREM ostaje tehnički sloj, EXTRONDOL governance sloj, a javni sajt ostaje jasan, poslovan i razumljiv široj publici.',
        },
        {
          ikona: '📘',
          naslov: 'Sažeto objašnjenje',
          opis: 'Developer/Create i VRH PROGRAMSKOG EKVILADENTA pojavljuju se kao metodološki okvir i dokaz ozbiljnog procesa, bez preopterećenja posetioca internim terminima.',
        },
        {
          ikona: '✅',
          naslov: 'Audit-safe narativ',
          opis: 'Sadržaj ostaje proverljiv, usklađen kroz dokumentaciju, postojeće profile i javni summary sloj bez neproverenih ili nejasnih tvrdnji.',
        },
      ],
    },
  },
  {
    id: 'kompanija-saradnja',
    tip: 'kartice',
    naslov: 'Kontakt i saradnja',
    podnaslov: 'Javne i profesionalne tačke kontakta za partnerstva, operativu i enterprise komunikaciju',
    redosled: 9,
    podaci: {
      kartice: [
        {
          naslov: 'Biznis i partnerstva',
          opis: businessKontakt?.email ?? 'business@spaja.rs',
          ikona: '🤝',
          oznake: ['B2B', 'Partnerstva', 'Digitalna Industrija'],
        },
        {
          naslov: 'Enterprise i pregovori',
          opis: salesKontakt?.email ?? 'sales@spaja.rs',
          ikona: '💼',
          oznake: ['Enterprise', 'Saradnja', 'Komercijala'],
        },
        {
          naslov: 'Podrška i operativa',
          opis: supportKontakt?.email ?? 'support@spaja.rs',
          ikona: '🛟',
          oznake: ['Podrška', 'Onboarding', 'Operativa'],
        },
        {
          naslov: 'AI i tehnološki okvir',
          opis: `${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona u okviru šireg profesionalnog ekosistema`,
          ikona: '🧠',
          oznake: ['AI', 'Sistemi', 'Koordinacija'],
        },
      ],
    },
  },
  {
    id: 'kompanija-operativni-kontakti',
    tip: 'lista',
    naslov: '📞 Operativni kontakti',
    redosled: 10,
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
    naslov: 'Profesionalan profil, jasan kontakt, ozbiljan ekosistem',
    redosled: 11,
    podaci: {
      opis: 'Nikola Spajić i Kompanija SPAJA predstavljeni su kroz jasan javni profil, proverljive projekte i audit-safe governance okvir spreman za saradnju.',
      dugmad: [
        { tekst: 'Pogledaj ekosistem', href: '/ekosistem' },
        { tekst: 'Organizacija', href: '/organizacija', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
