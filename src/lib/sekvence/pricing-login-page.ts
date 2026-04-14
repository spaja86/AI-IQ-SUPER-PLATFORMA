import type { Sekvenca } from '@/lib/types';

export const pricingLoginSekvence: Sekvenca[] = [
  {
    id: 'pricing-login-hero',
    tip: 'hero',
    naslov: '💰 Pricing & Login',
    podnaslov: 'SPAJA Pricing & Login — Planovi, registracija i pristup platformi',
    ikona: '💰',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Pricing & Login sistem nudi fleksibilne planove pretplate, visestruke metode prijave i jednostavan proces registracije za sve korisnike platforme.',
      dugmad: [
        { tekst: 'Pogledaj planove', href: '/pricing' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pricing-login-statistika',
    tip: 'statistika',
    naslov: '📊 Pricing & Login u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Planova', vrednost: '5', ikona: '📦' },
        { naziv: 'Login metoda', vrednost: '4', ikona: '🔑' },
        { naziv: 'Dozvola', vrednost: '12', ikona: '🛡️' },
        { naziv: 'Koraka registracije', vrednost: '5', ikona: '📝' },
      ],
    },
  },
  {
    id: 'pricing-login-kartice',
    tip: 'kartice',
    naslov: '💳 Planovi pretplate',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Starter', opis: 'Osnovni plan za pojedince i pocetnike', ikona: '🌱', oznake: ['Besplatno', 'Osnovne funkcije', '1 korisnik'] },
        { naslov: 'Basic', opis: 'Plan za male timove sa prosirenim mogucnostima', ikona: '⭐', oznake: ['$9/mesec', 'API pristup', '5 korisnika'] },
        { naslov: 'Pro', opis: 'Profesionalni plan sa naprednim alatima', ikona: '🚀', oznake: ['$29/mesec', 'Prioritetna podrska', '25 korisnika'] },
        { naslov: 'Enterprise', opis: 'Korporativni plan sa punom podrskom', ikona: '🏢', oznake: ['$99/mesec', 'SLA garancija', '100 korisnika'] },
        { naslov: 'Unlimited', opis: 'Neogranicen pristup svim funkcijama', ikona: '♾️', oznake: ['$199/mesec', 'Sve funkcije', 'Neograniceno'] },
      ],
    },
  },
  {
    id: 'pricing-login-tekst',
    tip: 'tekst',
    naslov: 'O registraciji i pristupu',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA platforma nudi jednostavan proces registracije sa viseslojnom autentifikacijom. Korisnici mogu pristupiti putem email-a, Google naloga, GitHub-a ili telefona. Svaki plan ukljucuje razlicite nivoe dozvola i pristupa funkcijama.',
      istaknuteStavke: [
        'Registracija u 5 jednostavnih koraka',
        'Visestruke metode prijave (Email, Google, GitHub, Telefon)',
        'Fleksibilni planovi od besplatnog do neogranicenog',
        'Granularne dozvole po nivou pretplate',
      ],
    },
  },
  {
    id: 'pricing-login-cta',
    tip: 'cta',
    naslov: '🚀 Zapocnite odmah',
    podnaslov: 'Kreirajte besplatan nalog i isprobajte SpajaPro AI',
    redosled: 5,
    podaci: {
      dugmad: [
        { tekst: 'Registruj se besplatno', href: '/registracija' },
        { tekst: 'SpajaPro AI Chat', href: '/spaja-pro', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'pricing-login-login',
    tip: 'login',
    naslov: '🔐 Prijava',
    podnaslov: 'Prijavite se na svoj nalog',
    redosled: 6,
    podaci: {
      opis: 'Unesite email i lozinku za pristup platformi.',
      metode: [
        { naziv: 'Google', ikona: '🌐', metod: 'google' },
        { naziv: 'GitHub', ikona: '🐙', metod: 'github' },
      ],
    },
  },
];
