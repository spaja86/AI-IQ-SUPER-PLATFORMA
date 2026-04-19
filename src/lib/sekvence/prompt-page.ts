import type { Sekvenca } from '@/lib/types';
import { promptovi, getPromptBiblioteka, getPromptKategorije } from '@/lib/prompt';
import { spajaProVerzije, getAktivneVerzije } from '@/lib/spaja-pro';
import { omegaPersone } from '@/lib/omega-ai';
import { OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';

const biblioteka = getPromptBiblioteka();
const kategorije = getPromptKategorije();
const aktivneVerzije = getAktivneVerzije();
const personaPromptovi = promptovi.filter((p) => p.ciljnaPersona);
const platformaPromptovi = promptovi.filter((p) => p.ciljnaPlatforma);

export const promptSekvence: Sekvenca[] = [
  {
    id: 'prompt-hero',
    tip: 'hero',
    naslov: '📝 Prompt Sistem',
    podnaslov: `${biblioteka.ukupnoPromptova} Prompt-ova × ${spajaProVerzije.length} SpajaPro verzija — Prompt je svuda`,
    ikona: '📝',
    redosled: 1,
    podaci: {
      opis: `Centralni Prompt sistem za ceo ekosistem Kompanije SPAJA. ${biblioteka.personaPromptovi} persona Prompt-ova, ${biblioteka.platformaPromptovi} platforma Prompt-ova u ${kategorije.length} kategorija. Svi Prompt-ovi se obrađuju kroz SpajaPro engine.`,
      dugmad: [
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'prompt-tekst',
    tip: 'tekst',
    naslov: 'Prompt je svuda u ekosistemu',
    redosled: 2,
    podaci: {
      sadrzaj: `Prompt sistem je integrisana u svaki aspekt AI IQ SUPER PLATFORMA ekosistema. Svaka OMEGA AI persona ima svoj specijalizovani Prompt. Svaka platforma ima Prompt šablone. SpajaPro engine (verzije 6-15) obrađuje sve Prompt-ove umesto ChatGPT-a.

IO-OPENUI-AO koristi SpajaPro Prompt umesto ChatGPT-a za svu AI komunikaciju. Kompanija-SPAJA repozitorijum je izvor SpajaPro engine-a.`,
      istaknuteStavke: [
        `${biblioteka.ukupnoPromptova} ukupno Prompt-ova u biblioteci`,
        `${biblioteka.personaPromptovi} persona Prompt-ova — po jedan za svaku od ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persone`,
        `${biblioteka.platformaPromptovi} platforma Prompt-ova — za IO-OPENUI-AO, Proksi, Mobilnu mrežu`,
        `${kategorije.length} kategorija: ${kategorije.join(', ')}`,
        `SpajaPro verzije korišćene: ${biblioteka.spajaProVerzije.join(', ')}`,
      ],
    },
  },
  {
    id: 'prompt-statistika',
    tip: 'statistika',
    naslov: 'Prompt u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Prompt-ovi', vrednost: biblioteka.ukupnoPromptova, ikona: '📝' },
        { naziv: 'Kategorije', vrednost: kategorije.length, ikona: '📂' },
        { naziv: 'Persona Prompt', vrednost: biblioteka.personaPromptovi, ikona: '👥' },
        { naziv: 'SpajaPro verzije', vrednost: spajaProVerzije.length, ikona: '🌟' },
      ],
    },
  },
  {
    id: 'prompt-tabela-persona',
    tip: 'tabela',
    naslov: '👥 Persona Prompt-ovi — OMEGA AI × SpajaPro',
    redosled: 4,
    podaci: {
      zaglavlje: ['Persona', 'Prompt', 'SpajaPro', 'Prioritet'],
      redovi: omegaPersone.map((p) => [
        `${p.ikona} ${p.naziv}`,
        p.prompt,
        `v${p.spajaProVerzija}`,
        p.prioritet,
      ]),
    },
  },
  {
    id: 'prompt-tabela-kategorije',
    tip: 'tabela',
    naslov: '📂 Prompt kategorije',
    redosled: 5,
    podaci: {
      zaglavlje: ['Kategorija', 'Broj Prompt-ova', 'Opis'],
      redovi: kategorije.map((kat) => {
        const broj = promptovi.filter((p) => p.kategorija === kat).length;
        const opisMap: Record<string, string> = {
          sistemski: 'Prompt-ovi za inicijalizaciju i upravljanje sistemom',
          persona: 'Prompt-ovi specifični za OMEGA AI persone',
          platforma: 'Prompt-ovi za konkretne platforme u ekosistemu',
          analitika: 'Prompt-ovi za analizu podataka i metrike',
          bezbednost: 'Prompt-ovi za bezbednosne provere i audit',
          kreativni: 'Prompt-ovi za kreaciju sadržaja i dizajn',
          orkestracioni: 'Prompt-ovi za koordinaciju i integraciju',
          evolucioni: 'Prompt-ovi za autonomnu evoluciju sistema',
          dijagnosticki: 'Prompt-ovi za dijagnostiku i monitoring',
          univerzalni: 'Univerzalni Prompt za sve sisteme',
        };
        return [kat, String(broj), opisMap[kat] ?? kat];
      }),
    },
  },
  {
    id: 'prompt-kartice',
    tip: 'kartice',
    naslov: '📝 Svi Prompt-ovi u biblioteci',
    redosled: 6,
    podaci: {
      kartice: promptovi.map((p) => ({
        naslov: `${p.ikona} ${p.naziv}`,
        opis: p.sadrzaj,
        ikona: p.ikona,
        oznake: [p.kategorija, `SpajaPro v${p.spajaProVerzija}`, p.prioritet, ...p.tagovi.slice(0, 2)],
      })),
    },
  },
  {
    id: 'prompt-hijerarhija',
    tip: 'hijerarhija',
    naslov: '🏗️ Prompt arhitektura',
    redosled: 7,
    podaci: {
      nivoi: [
        {
          naziv: `Persona Prompt-ovi (${personaPromptovi.length})`,
          ikona: '👥',
          deca: personaPromptovi.map((p) => `${p.ikona} ${p.naziv} — SpajaPro v${p.spajaProVerzija}`),
        },
        {
          naziv: `Platforma Prompt-ovi (${platformaPromptovi.length})`,
          ikona: '🌐',
          deca: platformaPromptovi.map((p) => `${p.ikona} ${p.naziv} — ${p.ciljnaPlatforma}`),
        },
        {
          naziv: `Sistemski Prompt-ovi (${promptovi.filter((p) => p.kategorija === 'sistemski').length})`,
          ikona: '⚡',
          deca: promptovi.filter((p) => p.kategorija === 'sistemski').map((p) => `${p.ikona} ${p.naziv}`),
        },
        {
          naziv: 'SpajaPro Engine',
          ikona: '🌟',
          deca: aktivneVerzije.map((v) => `${v.ikona} ${v.naziv} — ${v.kodnoIme}: ${v.mogucnosti.length} mogućnosti`),
        },
      ],
    },
  },
  {
    id: 'prompt-lista',
    tip: 'lista',
    naslov: '⚡ Gde je sve Prompt integrisana',
    redosled: 8,
    podaci: {
      stavke: [
        { ikona: '🧠', naslov: 'OMEGA AI Persone', opis: `Svaka od ${OMEGA_AI_PERSONA_COUNT} persone ima SpajaPro Prompt za svoje zadatke` },
        { ikona: '🖥️', naslov: 'IO-OPENUI-AO', opis: 'SpajaPro Prompt zamenjuje ChatGPT u frontend komunikaciji' },
        { ikona: '📡', naslov: 'Proksi Mreža', opis: 'Prompt distribucija kroz egzotične signale' },
        { ikona: '📱', naslov: 'Mobilna Mreža', opis: 'Mobilni Prompt optimizovan za edge i IoT' },
        { ikona: '🔧', naslov: 'Auto-Popravka', opis: 'Dijagnostički Prompt za automatsku popravku' },
        { ikona: '🧬', naslov: 'Evolucija', opis: 'Evolucioni Prompt za autonomni napredak sistema' },
        { ikona: '📊', naslov: 'Dashboard', opis: 'Analitički Prompt za metrike i izveštaje' },
        { ikona: '🚀', naslov: 'Deploy', opis: 'Prompt za automatski deploy i monitoring' },
      ],
    },
  },
  {
    id: 'prompt-cta',
    tip: 'cta',
    naslov: '🚀 Prompt — Svuda u ekosistemu',
    redosled: 9,
    podaci: {
      opis: 'Prompt sistem pokreće ceo ekosistem Kompanije SPAJA kroz SpajaPro engine.',
      stavke: [
        { naziv: 'Prompt-ovi', vrednost: biblioteka.ukupnoPromptova, ikona: '📝' },
        { naziv: 'Persone', vrednost: omegaPersone.length, ikona: '👥' },
        { naziv: 'SpajaPro', vrednost: `v6-15`, ikona: '🌟' },
        { naziv: 'Status', vrednost: '✅', ikona: '✅' },
      ],
      dugmad: [
        { tekst: 'SpajaPro Engine', href: '/spaja-pro' },
        { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
      ],
    },
  },
];
