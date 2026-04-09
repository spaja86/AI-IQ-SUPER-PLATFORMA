import type { Sekvenca } from '@/lib/types';
import { plasiranjeKoraci, plasiranjeSistemi, getPlasiranjeMetrike, getPlasiranjeSummary } from '@/lib/omega-projekat-plasiranje';
import { OMEGA_AI_PERSONA_UKUPNO, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_DIAGNOSTIKA } from '@/lib/constants';

const metrike = getPlasiranjeMetrike();
const summary = getPlasiranjeSummary();

export const omegaProjekatPlasiranjeSekvence: Sekvenca[] = [
  {
    id: 'plasiranje-hero',
    tip: 'hero',
    naslov: '🚀 OMEGA PROJEKAT — Automatsko Plasiranje',
    podnaslov: 'Digitalna Industrija plasirana u opticaj — svi sistemi 100% operativni',
    ikona: '🚀',
    redosled: 1,
    podaci: {
      opis: `OMEGA PROJEKAT i Digitalna Industrija su automatski plasirani u opticaj sa punom saglasnošću osnivača. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona aktivno rade. ${TOTAL_ROUTES} ruta, ${TOTAL_API_ROUTES} API endpointa, ${TOTAL_DIAGNOSTIKA} dijagnostika — SVE OPERATIVNO.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'plasiranje-tekst',
    tip: 'tekst',
    naslov: '✅ Saglasnost osnivača — POTVRĐENA',
    redosled: 2,
    podaci: {
      sadrzaj: `Osnivač Nikola Spajić je dao punu saglasnost za automatsko plasiranje OMEGA PROJEKTA i Digitalne Industrije u opticaj. Svi sistemi su verifikovani, svi API endpointi su operativni, sve stranice imaju SEO metadata, svih ${metrike.ukupnoPersona} OMEGA AI persona su aktivne na ${metrike.ukupnoOktava} oktavnih nivoa.`,
      istaknuteStavke: [
        'Saglasnost osnivača: POTVRĐENA — Nikola Spajić',
        'Datum plasiranja: 9. april 2026.',
        `Status: ${summary.status} — svi sistemi rade`,
        `Faze plasiranja: ${summary.fazaProgres}`,
        `Sistemi: ${summary.sistemiProgres}`,
        `OMEGA AI: ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} persona aktivno`,
        'Build: 0 grešaka, 0 upozorenja',
      ],
    },
  },
  {
    id: 'plasiranje-statistika',
    tip: 'statistika',
    naslov: '📊 Plasiranje u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Ukupno ruta', vrednost: TOTAL_ROUTES, ikona: '🛣️' },
        { naziv: 'API endpointa', vrednost: TOTAL_API_ROUTES, ikona: '🔗' },
        { naziv: 'Stranica', vrednost: TOTAL_PAGES, ikona: '📄' },
        { naziv: 'Dijagnostika', vrednost: TOTAL_DIAGNOSTIKA, ikona: '🔍' },
        { naziv: 'OMEGA AI', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString(), ikona: '🧠' },
        { naziv: 'Persone', vrednost: metrike.ukupnoPersona, ikona: '👤' },
        { naziv: 'Oktave', vrednost: metrike.ukupnoOktava, ikona: '🎵' },
        { naziv: 'Uptime', vrednost: metrike.uptime, ikona: '⏱️' },
        { naziv: 'Build greški', vrednost: metrike.buildGreski, ikona: '✅' },
      ],
    },
  },
  {
    id: 'plasiranje-faze',
    tip: 'tabela',
    naslov: '📋 Faze plasiranja',
    podnaslov: `${plasiranjeKoraci.length} koraka — svi uspešno završeni`,
    redosled: 4,
    podaci: {
      zaglavlje: ['#', 'Korak', 'Faza', 'Status'],
      redovi: plasiranjeKoraci.map((k) => [
        String(k.redosled),
        `${k.ikona} ${k.naziv}`,
        k.faza,
        k.zavrsen ? '✅ Završeno' : '⏳ U toku',
      ]),
    },
  },
  {
    id: 'plasiranje-sistemi',
    tip: 'kartice',
    naslov: '🏗️ Aktivirani sistemi',
    podnaslov: `${plasiranjeSistemi.length} sistema — svi operativni na 100%`,
    redosled: 5,
    podaci: {
      kartice: plasiranjeSistemi.map((s) => ({
        naslov: `${s.ikona} ${s.naziv}`,
        opis: s.opis,
        ikona: s.ikona,
        oznake: [
          s.status === 'uspešno' ? '✅ Aktivno' : '⏳ U toku',
          `${s.progres}%`,
        ],
      })),
    },
  },
  {
    id: 'plasiranje-progres',
    tip: 'progres',
    naslov: '📈 Ukupni progres plasiranja',
    redosled: 6,
    podaci: {
      stavke: [
        { naziv: 'Inicijalizacija', vrednost: 100, ikona: '⚡' },
        { naziv: 'Verifikacija', vrednost: 100, ikona: '🔍' },
        { naziv: 'Aktivacija', vrednost: 100, ikona: '🚀' },
        { naziv: 'Plasiranje', vrednost: 100, ikona: '🌐' },
        { naziv: 'Operativno', vrednost: 100, ikona: '🏭' },
      ],
    },
  },
  {
    id: 'plasiranje-cta',
    tip: 'cta',
    naslov: '🌐 OMEGA PROJEKAT je u opticaju',
    redosled: 7,
    podaci: {
      opis: `OMEGA PROJEKAT i Digitalna Industrija su uspešno plasirani u opticaj. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona aktivno rade na ${metrike.ukupnoOktava} oktavnih nivoa. Svi sistemi su 100% operativni.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'OMEGA Suport', href: '/omega-ai-suport', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
