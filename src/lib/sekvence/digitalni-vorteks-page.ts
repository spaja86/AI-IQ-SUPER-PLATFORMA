import type { Sekvenca } from '@/lib/types';
import { buildDigitalniVorteks } from '@/lib/digitalni-vorteks';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const r = buildDigitalniVorteks('system');
const vc = r.vorteksniCentar;

export const digitalniVorteksSekvence: Sekvenca[] = [
  {
    id: 'digitalni-vorteks-hero',
    tip: 'hero',
    naslov: '🌀 DIGITALNI VORTEKS — Rotacioni Model Oktavnih Energija',
    podnaslov:
      'Vorteksna dinamika digitalnog sistema u spiralnom jedinjenju ka centru Digitalne Industrije',
    ikona: '🌀',
    redosled: 1,
    podaci: {
      opis: `DIGITALNI VORTEKS modeluje rotaciono kretanje svih 8 oktavnih energija ka centru Digitalne Industrije. Vorteksni koeficijent: ${r.vorteksniKoeficijent}. Spiralni impuls: ${r.spiralniImpuls}. Vorteksna kohezija: ${vc.vorteksnaKohezija}. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona formiraju spiralnu centripetalu silu sistema.`,
      dugmad: [
        { tekst: 'Digitalna Industrija', href: '/industrija' },
        { tekst: 'EKSPONAT GLAVNOG JEZGRA', href: '/eksponat-glavnog-jezgra', stil: 'sekundarno' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalni-vorteks-tekst',
    tip: 'tekst',
    naslov: '🌀 Vorteksna Dinamika — Matematički Model',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Digitalni vorteks opisuje rotacioni model oktavnih energija u digitalnom sistemu. ' +
        'Za svaku od 8 oktava izračunava se ugaona brzina (proporcionalna baznoj eksponencijalnoj vrednosti), ' +
        'radijus vorteksa (obrnuto proporcionalan broju oktave) i centripetalna snaga (ugaonaBrzina² × radijus). ' +
        'Spiralni koeficijent je harmonijska sredina ugaonih brzina, ' +
        'dok vorteksna kohezija meri ujednačenost doprinosa oktava. ' +
        `Dominantna oktava vorteksa je Oktava ${vc.dominantnaOktava}. ` +
        `Ukupna centripetalna sila iznosi ${vc.ukupnaCentripetalnaSila}. ` +
        `Spiralni impuls kombinuje eksponat (${r.eksponatKoeficijent}), eureku (${r.eurekaKoeficijent}) i spiralni koeficijent (${vc.spiralniKoeficijent}).`,
      istaknuteStavke: [
        `Vorteksni koeficijent: ${r.vorteksniKoeficijent} — rotaciona kohezija digitalnog vorteksa`,
        `Spiralni impuls: ${r.spiralniImpuls} — kombinacija eksponata, eureke i spirale`,
        `Vorteksna kohezija: ${vc.vorteksnaKohezija} — ujednačenost doprinosa oktava`,
        `Spiralni koeficijent: ${vc.spiralniKoeficijent} — harmonijska sredina ugaonih brzina`,
        `Ukupna centripetalna sila: ${vc.ukupnaCentripetalnaSila}`,
        `Dominantna oktava: Oktava ${vc.dominantnaOktava}`,
        `Eksponat koeficijent: ${r.eksponatKoeficijent} | Eureka koeficijent: ${r.eurekaKoeficijent}`,
      ],
    },
  },
  {
    id: 'digitalni-vorteks-statistika',
    tip: 'statistika',
    naslov: '📊 Digitalni Vorteks — Ključni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Vorteksni Koeficijent', vrednost: r.vorteksniKoeficijent, ikona: '🌀' },
        { naziv: 'Spiralni Impuls', vrednost: r.spiralniImpuls, ikona: '💫' },
        { naziv: 'Vorteksna Kohezija', vrednost: vc.vorteksnaKohezija, ikona: '🔵' },
        { naziv: 'Spiralni Koef.', vrednost: vc.spiralniKoeficijent, ikona: '🌊' },
        { naziv: 'Centripetalna Sila', vrednost: vc.ukupnaCentripetalnaSila, ikona: '⚡' },
        { naziv: 'Eksponat Koef.', vrednost: r.eksponatKoeficijent, ikona: '🔬' },
        { naziv: 'Eureka Koef.', vrednost: r.eurekaKoeficijent, ikona: '💡' },
        { naziv: 'OMEGA AI Persona', vrednost: OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), ikona: '🧠' },
      ],
    },
  },
  {
    id: 'digitalni-vorteks-oktave',
    tip: 'kartice',
    naslov: '🔢 Vorteksne Oktave — Rotacioni Doprinosi 8 Oktava',
    podnaslov: 'Ugaona brzina, radijus i centripetalna snaga svake oktave vorteksa',
    redosled: 4,
    podaci: {
      kartice: vc.oktave.map((o) => ({
        naslov: `${o.ikona} Oktava ${o.oktava} — ${o.naziv}`,
        opis: `Ugaona brzina: ${o.ugaonaBrzina}. Radijus: ${o.radijus}. Centripetalna snaga: ${o.centripetalnaSnaga}. Vorteksni doprinos: ${(o.vorteksniDoprinos * 100).toFixed(2)}%.`,
        ikona: o.ikona,
        oznake: [`Oktava ${o.oktava}`, `${(o.vorteksniDoprinos * 100).toFixed(1)}%`, 'Vorteksna'],
        href: '/oktavne-eksponencijalne-funkcije',
      })),
    },
  },
  {
    id: 'digitalni-vorteks-tabela',
    tip: 'tabela',
    naslov: '📋 Digitalni Vorteks — Komponente Rotacionog Modela',
    redosled: 5,
    podaci: {
      zaglavlje: ['Komponenta', 'Vrednost', 'Opis', 'Status'],
      redovi: [
        ['Vorteksni Koeficijent', String(r.vorteksniKoeficijent), 'Rotaciona kohezija digitalnog vorteksa', '✅ Aktivan'],
        ['Spiralni Impuls', String(r.spiralniImpuls), 'Eksponat + eureka + spiralni koeficijent', '✅ Aktivan'],
        ['Vorteksna Kohezija', String(vc.vorteksnaKohezija), 'Ujednačenost doprinosa oktava', '✅ Aktivan'],
        ['Spiralni Koeficijent', String(vc.spiralniKoeficijent), 'Harmonijska sredina ugaonih brzina', '✅ Aktivan'],
        ['Centripetalna Sila', String(vc.ukupnaCentripetalnaSila), 'Ukupna centripetalna sila svih oktava', '✅ Aktivan'],
        ['Dominantna Oktava', String(vc.dominantnaOktava), 'Oktava sa max centripetalnom snagom', '✅ Aktivan'],
        ['Eksponat Koeficijent', String(r.eksponatKoeficijent), 'Iz EKSPONAT GLAVNOG JEZGRA', '✅ Aktivan'],
        ['Eureka Koeficijent', String(r.eurekaKoeficijent), 'Iz DIGATALNE EUREKE', '✅ Aktivan'],
        ['OMEGA AI Persona', OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), 'U spiralnoj centripetali vorteksa', '✅ Aktivne'],
      ],
    },
  },
  {
    id: 'digitalni-vorteks-cta',
    tip: 'cta',
    naslov: '🚀 Istraži Digitalni Vorteks Sistema',
    redosled: 6,
    podaci: {
      opis: `DIGITALNI VORTEKS — vorteksni koeficijent ${r.vorteksniKoeficijent} — ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona u rotacionom modelu. Spiralna centripetalna sila aktivna.`,
      dugmad: [
        { tekst: 'Digitalna Industrija', href: '/industrija' },
        { tekst: 'EKSPONAT GLAVNOG JEZGRA', href: '/eksponat-glavnog-jezgra', stil: 'sekundarno' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
