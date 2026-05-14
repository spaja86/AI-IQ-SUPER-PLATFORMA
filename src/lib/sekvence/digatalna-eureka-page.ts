import type { Sekvenca } from '@/lib/types';
import { buildDigatalnaEureka } from '@/lib/digatalna-eureka';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const eureka = buildDigatalnaEureka('system');
const eksin = eureka.ektridonalnaEksinometrija;
const epil = eureka.epicentricniEkvivalent;

export const digatalnaEurekaSekvence: Sekvenca[] = [
  {
    id: 'digatalna-eureka-hero',
    tip: 'hero',
    naslov: '💡 DIGATALNA EUREKA — Digitalna Industrija Dostigla Vrhunac',
    podnaslov:
      'Ektridonalna eksinometrijska ekstaza u ekvivalentu epicentričnog eklubriona nad simetrskim digitalnim jedinjenjem u oktavnom sistemu',
    ikona: '💡',
    redosled: 1,
    podaci: {
      opis: `DIGATALNA EUREKA je kulminacioni momenat Digitalne Industrije — trenutak kada svih 8 oktavnih eksponencijalnih funkcija konvergira u jednu simetričnu sinergetsku tačku. Eureka koeficijent: ${eureka.eurekaKoeficijent}. Oktavna sinergija maksimum: ${eksin.maksimalnaVrednost}. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona dostižu epicentar jedinjenja.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digatalna-eureka-tekst',
    tip: 'tekst',
    naslov: '📐 Ektridonalna Eksinometrijska Ekstaza — Matematički Model',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Ektridonalna eksinometrijska ekstaza opisuje sintetsku funkciju koja superponira svih 8 eksponencijalnih funkcija ' +
        'oktavnog sistema u jedan normalizovani signal. Kada je ovaj signal u ekvivalentu epicentričnog eklubriona — ' +
        'tačke gde je centar mase poravnat sa geometrijskim centrom — sistem dostiže stanje maksimalne simetrije. ' +
        'Simetrsko digitalno jedinjenje u oktavnom sistemu je 8×8 matricno jedinjenje čiji trag (matricna simetrija) ' +
        `iznosi ${eureka.matricnaSimetrija}. Ovaj momenat konvergencije naziva se DIGATALNA EUREKA.`,
      istaknuteStavke: [
        `Eureka koeficijent: ${eureka.eurekaKoeficijent} — kulminacija sinergije i simetrije`,
        `Ektridonalna superponija: prosek ${eksin.prosecnaSinergija} kroz 8 oktava`,
        `Epicentričnost eklubriona: ${epil.epicentricnost} — rastojanje cm od geo centra`,
        `Simetrijska snaga: ${epil.simetrijskaSnaga} — mera simetričnosti sistema`,
        `Matricna simetrija: ${eureka.matricnaSimetrija} — trag 8×8 jedinjenja`,
        `Tačka maks. sinergije: x=${eksin.maksimalniX}, vrednost=${eksin.maksimalnaVrednost}`,
        `Epicentar status: ${epil.status}`,
      ],
    },
  },
  {
    id: 'digatalna-eureka-statistika',
    tip: 'statistika',
    naslov: '📊 DIGATALNA EUREKA — Ključni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Eureka Koeficijent', vrednost: eureka.eurekaKoeficijent, ikona: '💡' },
        { naziv: 'Oktavna Sinergija Max', vrednost: eksin.maksimalnaVrednost, ikona: '📈' },
        { naziv: 'Prosečna Sinergija', vrednost: eksin.prosecnaSinergija, ikona: '⚡' },
        { naziv: 'Matricna Simetrija', vrednost: eureka.matricnaSimetrija, ikona: '🔢' },
        { naziv: 'Epicentričnost', vrednost: epil.epicentricnost, ikona: '🎯' },
        { naziv: 'Simetrijska Snaga', vrednost: epil.simetrijskaSnaga, ikona: '🔵' },
        { naziv: 'Ukupna Sinergija', vrednost: eksin.ukupnaSinergija, ikona: '🌐' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'digatalna-eureka-oktave',
    tip: 'kartice',
    naslov: '🔢 Doprinos 8 Oktava DIGATALNA EUREKA Sistemu',
    podnaslov: 'Svaka oktava daje jedinstveni doprinos ektridonalnoj eksinometrijskoj sinergiji',
    redosled: 4,
    podaci: {
      kartice: eksin.doprinosiOktava.map((d) => ({
        naslov: `${d.ikona} Oktava ${d.oktava} — ${d.naziv}`,
        opis: `Doprinos ektridonalnoj sinergiji: ${(d.doprinos * 100).toFixed(2)}%. Normalizovana vrednost pri max x=7.`,
        ikona: d.ikona,
        oznake: [`Oktava ${d.oktava}`, `${(d.doprinos * 100).toFixed(1)}%`, 'Sinergija'],
        href: '/oktavne-eksponencijalne-funkcije',
      })),
    },
  },
  {
    id: 'digatalna-eureka-tabela',
    tip: 'tabela',
    naslov: '📋 Komponente koje Konvergiraju ka Eureka Tački',
    redosled: 5,
    podaci: {
      zaglavlje: ['Komponenta', 'Vrednost', 'Opis', 'Status'],
      redovi: [
        ['Eureka Koeficijent', String(eureka.eurekaKoeficijent), 'Kulminacija sinergije × simetrije', '✅ Aktivan'],
        ['Ektridonalna Superponija Max', String(eksin.maksimalnaVrednost), `Dostignuta u x=${eksin.maksimalniX}`, '✅ Aktivan'],
        ['Epicentričnost', String(epil.epicentricnost), 'Rastojanje centra mase od geo centra', `✅ ${epil.status}`],
        ['Simetrijska Snaga', String(epil.simetrijskaSnaga), 'Poravnatost cm sa geo centrom', '✅ Aktivan'],
        ['Matricna Simetrija', String(eureka.matricnaSimetrija), 'Trag 8×8 matricnog jedinjenja', '✅ Aktivan'],
        ['Centar Mase', `(${epil.centarMase.x}, ${epil.centarMase.y})`, 'Težišna tačka sistema', '✅ Aktivan'],
        ['Geo Centar', `(${epil.geometrijskiCentar.x}, ${epil.geometrijskiCentar.y})`, 'Geometrijski centar opsega', '✅ Aktivan'],
        ['Tačka Maks. Sinergije', `(${epil.tackaMaksSinergije.x}, ${epil.tackaMaksSinergije.y})`, 'Epicentar eklubriona', '✅ Aktivan'],
        ['Ukupna Sinergija', String(eksin.ukupnaSinergija), 'Zbir normalizovanih vrednosti', '✅ Aktivan'],
        ['Prosečna Sinergija', String(eksin.prosecnaSinergija), 'Prosek kroz 8 oktavnih tačaka', '✅ Aktivan'],
      ],
    },
  },
  {
    id: 'digatalna-eureka-cta',
    tip: 'cta',
    naslov: '🚀 Istraži Digitalne Industrije Sisteme',
    redosled: 6,
    podaci: {
      opis: `DIGATALNA EUREKA — eureka koeficijent ${eureka.eurekaKoeficijent} — ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona u simetričnom jedinjenju oktavnog sistema. Ektridonalna ekstaza dostigla epicentar.`,
      dugmad: [
        { tekst: 'Industrija', href: '/industrija' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Glavni Endžin', href: '/glavni-endzin', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
