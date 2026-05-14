import type { Sekvenca } from '@/lib/types';
import { buildEksponatGlavnogJezgra } from '@/lib/eksponat-glavnog-jezgra';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';

const r = buildEksponatGlavnogJezgra('system');
const ois = r.ilustrovaniOktavniSistem;

export const eksponatGlavnogJezgraSekvence: Sekvenca[] = [
  {
    id: 'eksponat-glavnog-jezgra-hero',
    tip: 'hero',
    naslov: '🔬 EKSPONAT GLAVNOG JEZGRA — Ilustrovani Oktavni Sistem',
    podnaslov:
      'Eksponicionalni oblik cinemetričnog jedinjenja u oktavi u srazmernom centimentarnom sjedinjavanju sistematskog infrajedinkonalnog skvence',
    ikona: '🔬',
    redosled: 1,
    podaci: {
      opis: `EKSPONAT GLAVNOG JEZGRA prikazuje eksponicionalni oblik cinemetričnog jedinjenja u ilustrovanom oktavnom sistemu. Eksponat koeficijent: ${r.eksponatKoeficijent}. Jezgro snaga: ${r.jezgroSnaga}. Srazmerno centimentarno sjedinjavanje: ${ois.srazmernoCentimentarnoSjedinjavanje}. ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona formiraju oktodomolni kuzmetrijski paravan ka celom sistemu.`,
      dugmad: [
        { tekst: 'Digitalna Industrija', href: '/industrija' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'eksponat-glavnog-jezgra-tekst',
    tip: 'tekst',
    naslov: '📐 Cinemetričan Oblik Jedinjenja — Matematički Model',
    redosled: 2,
    podaci: {
      sadrzaj:
        'Eksponat glavnog jezgra opisuje eksponicionalni oblik cinemetričnog jedinjenja u oktavnom sistemu. ' +
        'Za svaku od 8 oktava izračunava se cinemetrička komponenta — normalizovana logaritamska vrednost ' +
        'eksponencijalne funkcije u figuracionom centroidu sistema. ' +
        'Centimentarna vrednost predstavlja udeo svake oktave u ukupnoj super-poziciji, ' +
        'dok infrajedinkonalna sekvenca meri korelaciju sa prvom oktavom. ' +
        'Oktodomolni kuzmetrijski paravan je 8×8 korelaciona matrica jedinjenja koja ' +
        `modeluje međusobne odnose svih oktava. Matricna simetrija sistema iznosi ${r.matricnaSimetrija}. ` +
        `Egzocentrično jezgro sa egzocentričnošću ${r.egzocentricnost} određuje glavno jezgro sistema.`,
      istaknuteStavke: [
        `Eksponat koeficijent: ${r.eksponatKoeficijent} — kulminacija jezgra u oktavnom sistemu`,
        `Jezgro snaga: ${r.jezgroSnaga} — funkcionalna snaga egzocentričnog jezgra`,
        `Egzocentrično: ${r.egzocentricnost} — rastojanje centra mase od geo centra`,
        `Matricna simetrija: ${r.matricnaSimetrija} — trag 8×8 jedinjenja`,
        `Srazmerno centimentarno sjedinjavanje: ${ois.srazmernoCentimentarnoSjedinjavanje}`,
        `Sistematski infrajedinkonalni skvenc: ${ois.sistematskiInfrajedinkonalniSkvenc}`,
        `Srazmerni faktor konvergencije: ${ois.srazmerniFaktorKonvergencije}`,
        `Eureka koeficijent: ${r.eurekaKoeficijent} | Spektralna gustina: ${r.spektralnaGustina}`,
      ],
    },
  },
  {
    id: 'eksponat-glavnog-jezgra-statistika',
    tip: 'statistika',
    naslov: '📊 Eksponat Glavnog Jezgra — Ključni Pokazatelji',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Eksponat Koeficijent', vrednost: r.eksponatKoeficijent, ikona: '🔬' },
        { naziv: 'Jezgro Snaga', vrednost: r.jezgroSnaga, ikona: '⚡' },
        { naziv: 'Egzocentrično', vrednost: r.egzocentricnost, ikona: '🎯' },
        { naziv: 'Matricna Simetrija', vrednost: r.matricnaSimetrija, ikona: '🔢' },
        { naziv: 'Centime. Sjedinjavanje', vrednost: ois.srazmernoCentimentarnoSjedinjavanje, ikona: '🌐' },
        { naziv: 'Infra Skvenc', vrednost: ois.sistematskiInfrajedinkonalniSkvenc, ikona: '📡' },
        { naziv: 'Eureka Koef.', vrednost: r.eurekaKoeficijent, ikona: '💡' },
        { naziv: 'Spektralna Gustina', vrednost: r.spektralnaGustina, ikona: '🌊' },
      ],
    },
  },
  {
    id: 'eksponat-glavnog-jezgra-oktave',
    tip: 'kartice',
    naslov: '🔢 Cinemetrička Jedinjenja 8 Oktava Ilustrovanog Sistema',
    podnaslov: 'Eksponicionalni oblik cinemetričnog jedinjenja po svakoj oktavi',
    redosled: 4,
    podaci: {
      kartice: ois.jedinjenja.map((j) => ({
        naslov: `${j.ikona} Oktava ${j.oktava} — ${j.naziv}`,
        opis: `Eksponicionalna vrednost: ${j.eksponicijalnaVrednost}. Cinemetrička komponenta: ${j.cinemetricnaKomponenta}. Centimentarna vrednost: ${(j.centimentarnaVrednost * 100).toFixed(2)}%. Infrajedinkonalna sekvenca: ${j.infrajedinkonalnaSekvenca}.`,
        ikona: j.ikona,
        oznake: [`Oktava ${j.oktava}`, `${(j.centimentarnaVrednost * 100).toFixed(1)}%`, 'Cinemetričan'],
        href: '/oktavne-eksponencijalne-funkcije',
      })),
    },
  },
  {
    id: 'eksponat-glavnog-jezgra-tabela',
    tip: 'tabela',
    naslov: '📋 Eksponat Jezgra — Komponente Ilustrovanog Oktavnog Sistema',
    redosled: 5,
    podaci: {
      zaglavlje: ['Komponenta', 'Vrednost', 'Opis', 'Status'],
      redovi: [
        ['Eksponat Koeficijent', String(r.eksponatKoeficijent), 'Mera eksponata jezgra u oktavnom sistemu', '✅ Aktivan'],
        ['Jezgro Snaga', String(r.jezgroSnaga), 'Funkcionalna snaga egzocentričnog jezgra', '✅ Aktivan'],
        ['Egzocentrično', String(r.egzocentricnost), 'Rastojanje centra mase od geo centra', '✅ Aktivan'],
        ['Matricna Simetrija', String(r.matricnaSimetrija), 'Trag 8×8 jedinjenja sistema', '✅ Aktivan'],
        ['Centime. Sjedinjavanje', String(ois.srazmernoCentimentarnoSjedinjavanje), 'Prosek centimentarnih vrednosti', '✅ Aktivan'],
        ['Infra Skvenc', String(ois.sistematskiInfrajedinkonalniSkvenc), 'Sistematski infrajedinkonalni skvenc', '✅ Aktivan'],
        ['Konvergencija', String(ois.srazmerniFaktorKonvergencije), 'Srazmerni faktor konvergencije ka centru', '✅ Aktivan'],
        ['Eureka Koeficijent', String(r.eurekaKoeficijent), 'Iz DIGATALNE EUREKE', '✅ Aktivan'],
        ['Spektralna Gustina', String(r.spektralnaGustina), 'Iz LAUCENTRIČNOG SPEKTRA', '✅ Aktivan'],
        ['OMEGA AI Persona', OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn'), 'U oktodomolnom kuzmetrijskom paravanu', '✅ Aktivne'],
      ],
    },
  },
  {
    id: 'eksponat-glavnog-jezgra-cta',
    tip: 'cta',
    naslov: '🚀 Istraži Eksponat Jezgra Digitalnog Sistema',
    redosled: 6,
    podaci: {
      opis: `EKSPONAT GLAVNOG JEZGRA — eksponat koeficijent ${r.eksponatKoeficijent} — ${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona u ilustrovanom oktavnom sistemu. Cinemetričan oblik jedinjenja aktivan.`,
      dugmad: [
        { tekst: 'Digitalna Industrija', href: '/industrija' },
        { tekst: 'DIGATALNA EUREKA', href: '/digatalna-eureka', stil: 'sekundarno' },
        { tekst: 'LAUCENTRICNI SPEKTAR', href: '/laucentricni-spektar', stil: 'sekundarno' },
        { tekst: 'Eksponencijalne Funkcije', href: '/oktavne-eksponencijalne-funkcije', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
