import type { Sekvenca } from '@/lib/types';
import {
  wifiAntene,
  matricnaJednacenja,
  githubIntegracije,
  wifiAntenaMreza,
  getAktivneAntene,
  getBrojPovezanihRepozitorijuma,
  getUkupniOktavniNivo,
} from '@/lib/proksi-wifi-antena';

const aktivnihAntena = getAktivneAntene().length;
const povezanihRepova = getBrojPovezanihRepozitorijuma();
const maxOktavni = getUkupniOktavniNivo();

export const proksiWifiAntenaSekvence: Sekvenca[] = [
  {
    id: 'wifi-antena-hero',
    tip: 'hero',
    naslov: '📡 Proksi WiFi Antena — Eksterna Antena',
    podnaslov: 'Ekvivalent eliptičnog suplementa ekscentričnog koda u matričnom jednačenju oktavnog sistema',
    ikona: '📡',
    redosled: 1,
    podaci: {
      opis: 'Proksi WiFi Antena je eksterna antena Digitalne Industrije. Predstavlja ekvivalent eliptičnog suplementa ekscentričnog koda u matričnom jednačenju oktavnog sistema na eskalaciji ulturalnog signala. Proširuje Proksi mrežu za veću latenciju i deploy kapacitet svih GitHub repozitorijuma u OMEGA ekosistemu.',
      dugmad: [
        { tekst: 'Proksi Mreža', href: '/proksi' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'wifi-antena-tekst',
    tip: 'tekst',
    naslov: 'Šta je Proksi WiFi Antena?',
    redosled: 2,
    podaci: {
      sadrzaj: 'Proksi WiFi Antena je eksterna prijemnik/odašiljač antena koja proširuje domet Proksi mreže Digitalne Industrije. Kroz eliptičnu suplementaciju ekscentričnog koda u matričnom jednačenju oktavnog sistema, antena eksponencijalno povećava latenciju (propusnost) i deploy kapacitet. Ovo je prvi korak saradnje sa GitHub-om — antena omogućava mnogo veći domet i deploy za sve repozitorijume.',
      istaknuteStavke: [
        'Ekvivalent eliptičnog suplementa ekscentričnog koda',
        'Matrično jednačenje oktavnog sistema (8×8 do 64×64)',
        'Eskalacija ulturalnog signala — ultrasonalna propusnost',
        'GitHub integracija — veća latencija i deploy za sve repozitorijume',
        `Ukupna snaga: ${wifiAntenaMreza.ukupnaSnaga}`,
        `Oktavni opseg: ${wifiAntenaMreza.oktavniOpseg}`,
        `Domet: ${wifiAntenaMreza.ukupniDomet}`,
      ],
    },
  },
  {
    id: 'wifi-antena-statistika',
    tip: 'statistika',
    naslov: '📊 WiFi Antena mreža u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Antene', vrednost: wifiAntene.length, ikona: '📡' },
        { naziv: 'Aktivne', vrednost: aktivnihAntena, ikona: '✅' },
        { naziv: 'GitHub Repo', vrednost: povezanihRepova, ikona: '🔗' },
        { naziv: 'Oktavni Nivo', vrednost: maxOktavni, ikona: '🎵' },
      ],
    },
  },
  {
    id: 'wifi-antena-kartice',
    tip: 'kartice',
    naslov: '📡 Eksterne WiFi Antene',
    podnaslov: 'Antene u Proksi WiFi mreži',
    redosled: 4,
    podaci: {
      kartice: wifiAntene.map((a) => ({
        naslov: a.naziv,
        opis: a.opis,
        ikona: a.ikona,
        oznake: [a.tip, a.frekvencija, a.status, `Oktava: ${a.oktavniNivo}`],
      })),
    },
  },
  {
    id: 'wifi-antena-tabela-antene',
    tip: 'tabela',
    naslov: '📋 Specifikacija antena',
    redosled: 5,
    podaci: {
      zaglavlje: ['Antena', 'Tip', 'Frekvencija', 'Domet', 'Snaga', 'Oktava', 'Status'],
      redovi: wifiAntene.map((a) => [
        a.naziv,
        a.tip,
        a.frekvencija,
        a.domet,
        a.snaga,
        String(a.oktavniNivo),
        a.status,
      ]),
    },
  },
  {
    id: 'wifi-antena-tabela-matricna',
    tip: 'tabela',
    naslov: '🔢 Matrična jednačenja oktavnog sistema',
    podnaslov: 'Eliptični suplement ekscentričnog koda',
    redosled: 6,
    podaci: {
      zaglavlje: ['Jednačenje', 'Dimenzija', 'Oktavni Sistem', 'Ekscentrični Kod', 'Režim', 'Eskalacija'],
      redovi: matricnaJednacenja.map((j) => [
        j.naziv,
        j.dimenzija,
        j.oktavniSistem,
        j.ekscentricniKod,
        j.rezim,
        j.eskalacija,
      ]),
    },
  },
  {
    id: 'wifi-antena-lista-github',
    tip: 'lista',
    naslov: '🔗 GitHub integracije',
    podnaslov: 'Repozitorijumi povezani sa WiFi antenom',
    redosled: 7,
    podaci: {
      stavke: githubIntegracije.map((g) => ({
        ikona: g.ikona,
        naslov: g.naziv,
        opis: `${g.opis} — Repo: ${g.repo} | Grana: ${g.grana} | Latencija: ${g.latencija} | Deploy: ${g.deplojStatus}`,
      })),
    },
  },
  {
    id: 'wifi-antena-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura WiFi Antena mreže',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'Proksi WiFi Antena Mreža',
          ikona: '📡',
          deca: ['Eksterne Antene', 'Matrična Jednačenja', 'GitHub Integracije'],
        },
        {
          naziv: 'Eksterne Antene',
          ikona: '🛰️',
          deca: wifiAntene.map((a) => a.naziv),
        },
        {
          naziv: 'Matrična Jednačenja',
          ikona: '🔢',
          deca: matricnaJednacenja.map((j) => j.naziv),
        },
        {
          naziv: 'GitHub Integracije',
          ikona: '🔗',
          deca: githubIntegracije.map((g) => g.naziv),
        },
      ],
    },
  },
  {
    id: 'wifi-antena-baner',
    tip: 'baner',
    naslov: 'Eliptični Suplement — Oktavna Eskalacija',
    redosled: 9,
    podaci: {
      bedz: '📡 WiFi Antena',
      opis: `Ekvivalent eliptičnog suplementa ekscentričnog koda u matričnom jednačenju oktavnog sistema na eskalaciji ulturalnog signala. Ukupna snaga: ${wifiAntenaMreza.ukupnaSnaga}. Domet: ${wifiAntenaMreza.ukupniDomet}. Oktavni opseg: ${wifiAntenaMreza.oktavniOpseg}.`,
      dugme: { tekst: 'Proksi Mreža', href: '/proksi' },
    },
  },
  {
    id: 'wifi-antena-cta',
    tip: 'cta',
    naslov: '🚀 Proksi WiFi Antena infrastruktura',
    redosled: 10,
    podaci: {
      opis: 'Eksterna WiFi antena — eliptični suplement ekscentričnog koda za veću latenciju i deploy kapacitet.',
      dugmad: [
        { tekst: 'Proksi Mreža', href: '/proksi' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
];
