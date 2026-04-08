import type { Sekvenca } from '@/lib/types';
import {
  renderEngini,
  renderPipeline,
  spajaRenderMedija,
  getAktivniEngini,
  getRenderStatistika,
} from '@/lib/spaja-render-medija';

const statistika = getRenderStatistika();
const aktivnihEng = getAktivniEngini().length;

export const spajaRenderMedijaSekvence: Sekvenca[] = [
  {
    id: 'render-hero',
    tip: 'hero',
    naslov: '🎬 SPAJA Render za Slike i Video',
    podnaslov: 'Render Medija Sistem za celokupni SPAJA Ekosistem',
    ikona: '🎬',
    redosled: 1,
    podaci: {
      opis: `${spajaRenderMedija.opis} Link: ${spajaRenderMedija.link}`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Brouvzer', href: '/spaja-digitalni-brouvzer', stil: 'sekundarno' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'render-tekst',
    tip: 'tekst',
    naslov: 'Šta je SPAJA Render za Slike i Video?',
    redosled: 2,
    podaci: {
      sadrzaj:
        'SPAJA Render za Slike i Video je sistem za renderovanje svih vrsta medijskog sadržaja — slike, ' +
        'video, animacije, 3D modele, vektorsku grafiku, audio-vizuelne kompozicije, holograme i VR/AR ' +
        'sadržaj. Manifestovan kroz SPAJA Generator za Endžine, render sistem pokriva sve medijske kategorije ' +
        'sa naprednim pipeline-ima za profesionalnu obradu.',
      istaknuteStavke: [
        `${renderEngini.length} render engine-a u ${statistika.ukupnoKategorija} kategorija`,
        `${renderPipeline.length} render pipeline-a`,
        `${aktivnihEng} aktivnih render engine-a`,
        `${statistika.ukupnoFormata} podržanih formata`,
        'Manifestovan kroz SPAJA Generator za Endžine',
        `Link: ${spajaRenderMedija.link}`,
      ],
    },
  },
  {
    id: 'render-statistika',
    tip: 'statistika',
    naslov: '📊 Render u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Engine-i', vrednost: renderEngini.length, ikona: '🎬' },
        { naziv: 'Aktivni', vrednost: aktivnihEng, ikona: '✅' },
        { naziv: 'Pipeline', vrednost: renderPipeline.length, ikona: '🔄' },
        { naziv: 'Kategorije', vrednost: statistika.ukupnoKategorija, ikona: '📂' },
        { naziv: 'Formati', vrednost: statistika.ukupnoFormata, ikona: '📄' },
      ],
    },
  },
  {
    id: 'render-progres',
    tip: 'progres',
    naslov: '🚀 Aktivni render engine-i',
    redosled: 4,
    podaci: {
      progres: Math.round((aktivnihEng / renderEngini.length) * 100),
      poruka: `SPAJA Render ima ${aktivnihEng} od ${renderEngini.length} aktivnih render engine-a sa ${statistika.ukupnoFormata} podržanih formata.`,
    },
  },
  {
    id: 'render-kartice-engini',
    tip: 'kartice',
    naslov: '🎬 Render Engine-i',
    podnaslov: `${renderEngini.length} render engine-a za sve medijske kategorije`,
    redosled: 5,
    podaci: {
      kartice: renderEngini.map((e) => ({
        naslov: e.naziv,
        opis: e.opis,
        ikona: e.ikona,
        oznake: [e.kategorija, e.status, `v${e.verzija}`, e.rezolucija],
      })),
    },
  },
  {
    id: 'render-tabela',
    tip: 'tabela',
    naslov: '📋 Specifikacija engine-a',
    redosled: 6,
    podaci: {
      zaglavlje: ['Engine', 'Kategorija', 'Verzija', 'Status', 'Rezolucija', 'Formati'],
      redovi: renderEngini.map((e) => [
        e.naziv,
        e.kategorija,
        `v${e.verzija}`,
        e.status,
        e.rezolucija,
        e.formati.join(', '),
      ]),
    },
  },
  {
    id: 'render-kartice-pipeline',
    tip: 'kartice',
    naslov: '🔄 Render Pipeline-i',
    podnaslov: `${renderPipeline.length} pipeline-a za obradu medija`,
    redosled: 7,
    podaci: {
      kartice: renderPipeline.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [`Ulaz: ${p.ulazniFormati.length}`, `Izlaz: ${p.izlazniFormati.length}`, `Koraci: ${p.koraci.length}`],
      })),
    },
  },
  {
    id: 'render-lista-pipeline',
    tip: 'lista',
    naslov: '⚙️ Pipeline koraci',
    podnaslov: 'Detaljan pregled koraka svakog pipeline-a',
    redosled: 8,
    podaci: {
      stavke: renderPipeline.map((p) => ({
        ikona: p.ikona,
        naslov: p.naziv,
        opis: `${p.opis} — Koraci: ${p.koraci.join(' → ')} | Ulaz: ${p.ulazniFormati.join(', ')} | Izlaz: ${p.izlazniFormati.join(', ')}`,
      })),
    },
  },
  {
    id: 'render-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Render Sistema',
    redosled: 9,
    podaci: {
      nivoi: [
        {
          naziv: 'SPAJA Render za Slike i Video',
          ikona: '🎬',
          deca: ['Render Engine-i', 'Render Pipeline-i', 'SPAJA Generator za Endžine'],
        },
        {
          naziv: 'Render Engine-i',
          ikona: '🎨',
          deca: renderEngini.map((e) => `${e.ikona} ${e.naziv}`),
        },
        {
          naziv: 'Render Pipeline-i',
          ikona: '🔄',
          deca: renderPipeline.map((p) => `${p.ikona} ${p.naziv}`),
        },
      ],
    },
  },
  {
    id: 'render-baner',
    tip: 'baner',
    naslov: 'SPAJA Render — Slike, Video i sve ostalo',
    redosled: 10,
    podaci: {
      bedz: '🎬 Render',
      opis: `SPAJA Render za Slike i Video sa ${renderEngini.length} engine-a u ${statistika.ukupnoKategorija} kategorija i ${renderPipeline.length} pipeline-a. ${statistika.ukupnoFormata} podržanih formata. Manifestovan kroz SPAJA Generator za Endžine.`,
      dugme: { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
    },
  },
  {
    id: 'render-cta',
    tip: 'cta',
    naslov: '🚀 Render infrastruktura',
    redosled: 11,
    podaci: {
      opis: `SPAJA Render — ${renderEngini.length} engine-a, ${renderPipeline.length} pipeline-a, ${statistika.ukupnoFormata} formata. Celokupan render sistem za slike, video i sve medijske kategorije.`,
      dugmad: [
        { tekst: 'Generator Endžina', href: '/spaja-generator-engine' },
        { tekst: 'Brouvzer', href: '/spaja-digitalni-brouvzer', stil: 'sekundarno' },
        { tekst: 'Laboratorija', href: '/io-openui-ao-laboratorija', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
