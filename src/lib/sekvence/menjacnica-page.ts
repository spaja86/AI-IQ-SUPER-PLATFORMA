import type { Sekvenca } from '@/lib/types';

export const menjacnicaSekvence: Sekvenca[] = [
  {
    id: 'menjacnica-hero',
    tip: 'hero',
    naslov: '💱 Menjačnica',
    podnaslov: 'AI IQ Menjačnica — Kripto i fiat menjačnica sa AI predikcijama',
    ikona: '💱',
    redosled: 1,
    podaci: {
      opis: 'Napredna menjacnica koja kombinuje kripto i fiat valute sa AI predikcijama za optimalne kurseve i tajming trgovanja.',
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'menjacnica-tekst',
    tip: 'tekst',
    naslov: 'Kako radi menjacnica?',
    redosled: 2,
    podaci: {
      sadrzaj: 'AI IQ Menjacnica koristi napredne algoritme vestacke inteligencije za analizu trzista, predikciju kurseva i automatizovano trgovanje. Podrzava kripto i fiat valute.',
      istaknuteStavke: [
        'AI predikcije kurseva u realnom vremenu',
        'Podrska za 50+ kripto valuta',
        'Fiat konverzija sa konkurentnim kursevima',
        'Automatski portfolio menadzment',
      ],
    },
  },
  {
    id: 'menjacnica-statistika',
    tip: 'statistika',
    naslov: '📊 Menjacnica u brojevima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Kripto parovi', vrednost: '150+', ikona: '🪙' },
        { naziv: 'Fiat valute', vrednost: '30+', ikona: '💵' },
        { naziv: 'Dnevni promet', vrednost: '$2M+', ikona: '📊' },
        { naziv: 'AI tacnost', vrednost: '94%', ikona: '🎯' },
      ],
    },
  },
  {
    id: 'menjacnica-kartice',
    tip: 'kartice',
    naslov: '⚡ Funkcije menjacnice',
    redosled: 4,
    podaci: {
      kartice: [
        { naslov: 'Kripto Trading', opis: 'Kupovina i prodaja kriptovaluta', ikona: '🪙', oznake: ['BTC', 'ETH', 'SOL', 'USDT'] },
        { naslov: 'Fiat Konverzija', opis: 'Menjanje fiat valuta po najboljim kursevima', ikona: '💵', oznake: ['EUR', 'USD', 'GBP', 'RSD'] },
        { naslov: 'Portfolio', opis: 'Upravljanje portfoliom sa AI asistentom', ikona: '📊', oznake: ['Balansiranje', 'Diverzifikacija'] },
        { naslov: 'AI Predikcije', opis: 'Predvidjanje trzisnih trendova', ikona: '🎯', oznake: ['ML modeli', 'Sentiment analiza'] },
      ],
    },
  },
  {
    id: 'menjacnica-tabela',
    tip: 'tabela',
    naslov: '📋 Top trgovacki parovi',
    redosled: 5,
    podaci: {
      zaglavlje: ['Par', 'Cena', 'Promena 24h', 'Volumen'],
      redovi: [
        ['BTC/USDT', '$67,450', '+2.4%', '$1.2B'],
        ['ETH/USDT', '$3,820', '+1.8%', '$680M'],
        ['SOL/USDT', '$185', '+5.1%', '$320M'],
        ['EUR/USD', '$1.0845', '-0.1%', '$5.2B'],
        ['GBP/EUR', '€1.1720', '+0.3%', '$890M'],
      ],
    },
  },
  {
    id: 'menjacnica-cta',
    tip: 'cta',
    naslov: '🚀 Pocnite trgovanje',
    redosled: 6,
    podaci: {
      opis: 'AI IQ Menjacnica — pametnija trgovina sa vestackom inteligencijom.',
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
