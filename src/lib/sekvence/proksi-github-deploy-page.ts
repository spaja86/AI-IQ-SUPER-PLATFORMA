import type { Sekvenca } from '@/lib/types';
import {
  deployGrane,
  proksiGitHubVeze,
  transferProtokoli,
  deployPipeline,
  proksiGitHubDeploySistem,
  getDeployStatistike,
} from '@/lib/proksi-github-deploy';

const stats = getDeployStatistike();

export const proksiGitHubDeploySekvence: Sekvenca[] = [
  {
    id: 'proksi-github-deploy-hero',
    tip: 'hero',
    naslov: '🚀📡 Proksi GitHub Deploy -∞Ω+∞',
    podnaslov: 'Maksimalni deploj na sve grane — Ekscentrični Proksi sa AI IQ SUPER PLATFORMA',
    ikona: '🚀',
    redosled: 1,
    podaci: {
      opis: 'SpajaUltraOmegaCore -∞Ω+∞: Ekscentrični Proksi signal sa AI IQ SUPER PLATFORMA na bazno dejstvo repo sistema GitHub za maksimalni prenos transfer podataka na sve grane. Kapacitet: -∞Ω+∞ TB/s.',
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'proksi-github-deploy-tekst',
    tip: 'tekst',
    naslov: 'Ekscentrični Proksi na Bazno Dejstvo GitHub Repo Sistema',
    redosled: 2,
    podaci: {
      sadrzaj: `${proksiGitHubDeploySistem.opis} Verzija: ${proksiGitHubDeploySistem.verzija}. Spektar: ${proksiGitHubDeploySistem.spektar}. Bazni deploy sistem: ${proksiGitHubDeploySistem.baznoDeploySistem}. Proksi integracija: ${proksiGitHubDeploySistem.proksiIntegracija}.`,
      istaknuteStavke: [
        'Ekscentrični Proksi signal ekscentriše bazno dejstvo GitHub repo sistema',
        'Maksimalni prenos transfer podataka na sve grane simultano',
        `Ukupno grana: ${stats.ukupnoGrana} | Aktivnih: ${stats.aktivne}`,
        `Proksi signala: ${stats.proksiSignala} | Čvorova: ${stats.proksiCvorova}`,
        `Kapacitet: ${stats.kapacitet}`,
        `Paralelni tokovi: ${stats.paralelniTokovi}`,
        'Koncentrični deploy krug udvostručuje domet svakim krugom',
        'Ekliptična orbit vez za stalnu cirkulaciju podataka',
        'Rezonantni sync pojačava propusnost eksponencijalno',
        'Hibridni MAX kombinuje sve protokole: -∞Ω+∞',
      ],
    },
  },
  {
    id: 'proksi-github-deploy-statistika',
    tip: 'statistika',
    naslov: '📊 Deploy Statistika — Sve Grane',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Grane', vrednost: stats.ukupnoGrana, ikona: '🌿' },
        { naziv: 'Deploy završen', vrednost: stats.deployZavrsene, ikona: '✅' },
        { naziv: 'Deploy u toku', vrednost: stats.deployUToku, ikona: '🔄' },
        { naziv: 'Čeka merge', vrednost: stats.cekajuMerge, ikona: '⏳' },
        { naziv: 'Aktivne veze', vrednost: stats.aktivneVeze, ikona: '🔗' },
        { naziv: 'Pipeline koraci', vrednost: stats.pipeline, ikona: '🔧' },
        { naziv: 'Paralelni tokovi', vrednost: stats.paralelniTokovi, ikona: '⚡' },
        { naziv: 'Platforme', vrednost: stats.povezanihPlatformi, ikona: '🌐' },
      ],
    },
  },
  {
    id: 'proksi-github-deploy-kartice-grane',
    tip: 'kartice',
    naslov: '🌿 Deploy Status po Grani',
    podnaslov: 'Sve grane u GitHub repo sistemu sa Proksi transfer protokolom',
    redosled: 4,
    podaci: {
      kartice: deployGrane.map((g) => ({
        naslov: g.naziv,
        opis: g.opis,
        ikona: g.ikona,
        oznake: [g.status, g.transferProtokol, g.kapacitetTransfera],
      })),
    },
  },
  {
    id: 'proksi-github-deploy-tabela-transferi',
    tip: 'tabela',
    naslov: '📡 Transfer Protokoli — Maksimalni Prenos Podataka',
    redosled: 5,
    podaci: {
      zaglavlje: ['Protokol', 'Brzina', 'Kapacitet', 'Kompresija', 'Paralelni Tokovi'],
      redovi: transferProtokoli.map((t) => [
        `${t.ikona} ${t.naziv}`,
        t.brzina,
        t.kapacitet,
        t.kompresija,
        String(t.paralelniTokovi),
      ]),
    },
  },
  {
    id: 'proksi-github-deploy-kartice-veze',
    tip: 'kartice',
    naslov: '🔗 Proksi-GitHub Veze',
    podnaslov: 'Ekscentrični signali ka baznom dejstvu GitHub repo sistema',
    redosled: 6,
    podaci: {
      kartice: proksiGitHubVeze.map((v) => ({
        naslov: v.naziv,
        opis: `${v.opis} | ${v.izvornaGrana} → ${v.ciljnaGrana}`,
        ikona: v.ikona,
        oznake: [v.signalTip, v.frekvencija, v.status],
      })),
    },
  },
  {
    id: 'proksi-github-deploy-lista-pipeline',
    tip: 'lista',
    naslov: '🔧 Deploy Pipeline Koraci',
    podnaslov: `Ukupno trajanje: ${deployPipeline.ukupnoTrajanjeMs}`,
    redosled: 7,
    podaci: {
      stavke: deployPipeline.koraci.map((k) => ({
        ikona: k.ikona,
        naslov: `${k.redosled}. ${k.naziv}`,
        opis: `${k.opis} — Trajanje: ${k.trajanje} | Signal: ${k.proksiSignal}`,
      })),
    },
  },
  {
    id: 'proksi-github-deploy-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Arhitektura Proksi GitHub Deploy',
    redosled: 8,
    podaci: {
      nivoi: [
        {
          naziv: 'Proksi GitHub Deploy -∞Ω+∞',
          ikona: '🚀',
          deca: ['Ekscentrični Signal', 'GitHub Bazno Dejstvo', 'Transfer Protokoli', 'Deploy Pipeline'],
        },
        {
          naziv: 'Ekscentrični Signal',
          ikona: '🌀',
          deca: ['Ekscentrični Modulator', 'Koncentrični Distributer', 'Ekliptična Veza', 'Rezonantni Pojačavač', 'Hibridni Sinhronizator'],
        },
        {
          naziv: 'GitHub Bazno Dejstvo',
          ikona: '💻',
          deca: deployGrane.slice(0, 5).map((g) => g.naziv),
        },
        {
          naziv: 'Transfer Protokoli',
          ikona: '📡',
          deca: transferProtokoli.map((t) => t.naziv),
        },
        {
          naziv: 'Deploy Pipeline',
          ikona: '🔧',
          deca: deployPipeline.koraci.map((k) => k.naziv),
        },
      ],
    },
  },
  {
    id: 'proksi-github-deploy-tabela-grane',
    tip: 'tabela',
    naslov: '📋 Specifikacija Svih Grana',
    redosled: 9,
    podaci: {
      zaglavlje: ['Grana', 'Status', 'Proksi Signal', 'Transfer', 'Latencija'],
      redovi: deployGrane.map((g) => [
        `${g.ikona} ${g.naziv}`,
        g.status,
        g.proksiSignal,
        g.transferProtokol,
        g.latencija,
      ]),
    },
  },
  {
    id: 'proksi-github-deploy-baner',
    tip: 'baner',
    naslov: 'Maksimalni Prenos Transfer Podataka -∞Ω+∞',
    redosled: 10,
    podaci: {
      bedz: '🚀📡 Proksi GitHub Deploy',
      opis: `Ekscentrični Proksi sa AI IQ SUPER PLATFORMA ekscentriše bazno dejstvo GitHub repo sistema. ${stats.ukupnoGrana} grana, ${stats.aktivneVeze} aktivnih veza, ${stats.paralelniTokovi} paralelnih tokova. Kapacitet: ${stats.kapacitet}.`,
      dugme: { tekst: 'Proksi Mreža', href: '/proksi' },
    },
  },
  {
    id: 'proksi-github-deploy-cta',
    tip: 'cta',
    naslov: '🚀 Proksi GitHub Deploy Sistem',
    redosled: 11,
    podaci: {
      opis: 'SpajaUltraOmegaCore -∞Ω+∞ — maksimalni deploj na sve grane sa ekscentričnim Proksi signalom na bazno dejstvo GitHub repo sistema.',
      dugmad: [
        { tekst: 'Proksi', href: '/proksi' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
        { tekst: 'WiFi Antena', href: '/proksi-wifi-antena', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Omega AI', href: '/omega-ai', stil: 'sekundarno' },
      ],
    },
  },
];
