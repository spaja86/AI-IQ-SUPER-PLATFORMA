import type { Sekvenca } from '@/lib/types';
import { spajaDigitalniTelevizor, getTVSignalReadiness } from '@/lib/spaja-digitalni-televizor';

const signalReadiness = getTVSignalReadiness();

export const digitalniTelevizorSekvence: Sekvenca[] = [
  {
    id: 'digitalni-televizor-hero',
    tip: 'hero',
    naslov: '📺 Digitalni Televizor',
    podnaslov: `SPAJA Digitalni Televizor — signal ${signalReadiness.signalLifecycle}, partner status ${signalReadiness.partnerStatus}`,
    ikona: '📺',
    redosled: 1,
    podaci: {
      opis: `SPAJA Digitalni Televizor platforma trenutno radi u modu "${signalReadiness.signalLifecycle}" sa izvorom signala "${signalReadiness.signalSource}" i statusom monetizacije "${signalReadiness.monetizacijaStatus}".`,
      dugmad: [
        { tekst: 'Pregledaj kanale', href: '/digitalni-televizor' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'digitalni-televizor-statistika',
    tip: 'statistika',
    naslov: '📊 TV platforma u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Kanala', vrednost: '12', ikona: '📺' },
        { naziv: 'Signali aktivni', vrednost: `${signalReadiness.signalAktivnihKanala}/${signalReadiness.ukupnoKanala}`, ikona: '📡' },
        { naziv: 'Programa', vrednost: `${spajaDigitalniTelevizor.programi.length}`, ikona: '📋' },
        { naziv: 'Monetizacija', vrednost: signalReadiness.monetizacijaStatus, ikona: '💰' },
        { naziv: 'Partner', vrednost: signalReadiness.partnerStatus, ikona: '🤝' },
      ],
    },
  },
  {
    id: 'digitalni-televizor-kartice',
    tip: 'kartice',
    naslov: '📺 Top kanali',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'SPAJA News', opis: 'Najnovije vesti i analize 24/7', ikona: '📰', oznake: ['Uzivo', '4K', 'Informativni'] },
        { naslov: 'SPAJA Sport', opis: 'Sportski prenosi i highlights', ikona: '⚽', oznake: ['Uzivo', '8K', 'Sport'] },
        { naslov: 'SPAJA Film', opis: 'Premium filmovi i serije', ikona: '🎬', oznake: ['HD', '4K', 'Zabava'] },
        { naslov: 'SPAJA Edukacija', opis: 'Obrazovni sadrzaj i kursevi', ikona: '🎓', oznake: ['1080p', 'Edukacija', 'AI'] },
      ],
    },
  },
  {
    id: 'digitalni-televizor-tekst',
    tip: 'tekst',
    naslov: 'O TV platformi',
    redosled: 4,
    podaci: {
      sadrzaj: `SPAJA Digitalni Televizor povezuje TV domenu sa partnerstvom i monetizacijom. Kastler rikvest je trenutno "${signalReadiness.requestStatus}", signal je "${signalReadiness.signalLifecycle}", a monetizacioni model je "${signalReadiness.monetizacijaModel}".`,
      istaknuteStavke: [
        `Signal readiness: ${signalReadiness.signalLifecycle}`,
        `Partner approval: ${signalReadiness.partnerStatus}`,
        `Monetizacija: ${signalReadiness.monetizacijaStatus}`,
        signalReadiness.blokatori.length > 0 ? `Blokatori: ${signalReadiness.blokatori.join(', ')}` : 'Nema blokatora za produkciju',
      ],
    },
  },
];
