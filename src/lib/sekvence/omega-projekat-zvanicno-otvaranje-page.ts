import type { Sekvenca } from '@/lib/types';
import { otvaranjePotvrde, getZvanicnoOtvaranjeSummary } from '@/lib/omega-projekat-zvanicno-otvaranje';
import { OMEGA_AI_PERSONA_UKUPNO, TOTAL_ROUTES, TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_DIAGNOSTIKA, OMEGA_AI_OKTAVA_COUNT } from '@/lib/constants';
import { getOktavniMonologSummary } from '@/lib/oktavni-monolog';

const summary = getZvanicnoOtvaranjeSummary();
const monolog = getOktavniMonologSummary();

export const omegaProjekatZvanicnoOtvaranjeSekvence: Sekvenca[] = [
  {
    id: 'otvaranje-hero',
    tip: 'hero',
    naslov: '🎉 OMEGA PROJEKAT — Zvanično Otvaranje',
    podnaslov: 'Prema monolizmima — svi sistemi verifikovani — ZVANIČNO OTVORENO',
    ikona: '🎉',
    redosled: 1,
    podaci: {
      opis: `OMEGA PROJEKAT je zvanično otvoren na osnovu verifikacije oktavnih monolizama. Matricno jedinjenje ${monolog.matricnaDimenzija}x${monolog.matricnaDimenzija} potvrđeno, egzocentrično jezgro validirano, laucentrični sistem operativan. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona aktivno rade. Saglasnost osnivača: POTVRĐENA.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Plasiranje', href: '/omega-projekat-plasiranje', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'otvaranje-saglasnost',
    tip: 'tekst',
    naslov: '🏛️ Saglasnost osnivača — prema monolizmima',
    redosled: 2,
    podaci: {
      sadrzaj: `Osnivač Nikola Spajić je dao punu saglasnost za zvanično otvaranje OMEGA PROJEKTA na osnovu verifikacije monolizama. Oktavni monolog eksponencijalnog ekvivalenta potvrdio je stabilnost svih ${monolog.ekvivalentiBroj} ekvivalenata, matricno jedinjenje je punog ranga (${monolog.matricniRang}/8), egzocentrično jezgro je validirano sa snagom ${monolog.jezgroSnaga}, a sirena rezonanca je stabilna na ${monolog.sirenaRezonanca} Hz.`,
      istaknuteStavke: [
        `Status: ${summary.status}`,
        `Saglasnost: ${summary.saglasnost}`,
        `Otvaranje: ${summary.otvaranje}`,
        `Monolog status: ${summary.monologStatus}`,
        `Matricni rang: ${summary.matricniRang}`,
        `Egzocentricnost: ${summary.egzocentricnost}`,
        `Sirena rezonanca: ${summary.sirenaRezonanca}`,
        `Integritet: ${summary.integritet}`,
        `Potvrde: ${summary.potvrde}`,
      ],
    },
  },
  {
    id: 'otvaranje-monolog',
    tip: 'statistika',
    naslov: '🎵 Monolog verifikacija',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Ekvivalenti', vrednost: monolog.ekvivalentiBroj, ikona: '🎵' },
        { naziv: 'Matricna dimenzija', vrednost: `${monolog.matricnaDimenzija}x${monolog.matricnaDimenzija}`, ikona: '🧮' },
        { naziv: 'Matricni rang', vrednost: `${monolog.matricniRang}/8`, ikona: '📐' },
        { naziv: 'Matricni trag', vrednost: monolog.matricniTrag, ikona: '📏' },
        { naziv: 'Egzocentricnost', vrednost: monolog.egzocentricnost, ikona: '🔮' },
        { naziv: 'Jezgro snaga', vrednost: monolog.jezgroSnaga, ikona: '⚡' },
        { naziv: 'Sirena rezonanca', vrednost: `${monolog.sirenaRezonanca} Hz`, ikona: '🔊' },
        { naziv: 'Laucentricni slojevi', vrednost: monolog.laucentricniSlojevi, ikona: '🎯' },
        { naziv: 'Laucentricna snaga', vrednost: monolog.laucentricnaSnaga, ikona: '💪' },
      ],
    },
  },
  {
    id: 'otvaranje-potvrde',
    tip: 'tabela',
    naslov: '📋 Potvrde za zvanično otvaranje',
    podnaslov: `${otvaranjePotvrde.length} potvrda — sve potvrđene`,
    redosled: 4,
    podaci: {
      zaglavlje: ['#', 'Potvrda', 'Faza', 'Status'],
      redovi: otvaranjePotvrde.map((p) => [
        String(p.redosled),
        `${p.ikona} ${p.naziv}`,
        p.faza,
        p.status === 'potvrdjeno' ? '✅ Potvrđeno' : '⏳ Čeka',
      ]),
    },
  },
  {
    id: 'otvaranje-ekosistem',
    tip: 'statistika',
    naslov: '📊 Ekosistem u brojevima',
    redosled: 5,
    podaci: {
      stavke: [
        { naziv: 'Ukupno ruta', vrednost: TOTAL_ROUTES, ikona: '🛣️' },
        { naziv: 'API endpointa', vrednost: TOTAL_API_ROUTES, ikona: '🔗' },
        { naziv: 'Stranica', vrednost: TOTAL_PAGES, ikona: '📄' },
        { naziv: 'Dijagnostika', vrednost: TOTAL_DIAGNOSTIKA, ikona: '🔍' },
        { naziv: 'OMEGA AI', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString(), ikona: '🧠' },
        { naziv: 'Oktave', vrednost: OMEGA_AI_OKTAVA_COUNT, ikona: '🎵' },
      ],
    },
  },
  {
    id: 'otvaranje-progres',
    tip: 'progres',
    naslov: '📈 Progres otvaranja',
    redosled: 6,
    podaci: {
      stavke: [
        { naziv: 'Monolog verifikacija', vrednost: 100, ikona: '🎵' },
        { naziv: 'Matricna potvrda', vrednost: 100, ikona: '🧮' },
        { naziv: 'Jezgro validacija', vrednost: 100, ikona: '🔮' },
        { naziv: 'Saglasnost osnivača', vrednost: 100, ikona: '🏛️' },
        { naziv: 'Zvanično otvaranje', vrednost: 100, ikona: '🎉' },
      ],
    },
  },
  {
    id: 'otvaranje-cta',
    tip: 'cta',
    naslov: '🎉 OMEGA PROJEKAT je ZVANIČNO OTVOREN',
    redosled: 7,
    podaci: {
      opis: `OMEGA PROJEKAT je zvanično otvoren prema monolizmima. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} OMEGA AI persona aktivno rade na ${OMEGA_AI_OKTAVA_COUNT} oktavnih nivoa. Digitalna Industrija je u punom opticaju. Svi sistemi su 100% operativni.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'OMEGA Suport', href: '/omega-ai-suport', stil: 'sekundarno' },
        { tekst: 'Plasiranje', href: '/omega-projekat-plasiranje', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Ekosistem', href: '/ekosistem', stil: 'sekundarno' },
      ],
    },
  },
];
