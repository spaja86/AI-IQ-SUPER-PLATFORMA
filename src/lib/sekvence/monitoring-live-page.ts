import type { Sekvenca } from '@/lib/types';

export const monitoringLiveSekvence: Sekvenca[] = [
  {
    id: 'monitoring-live-hero',
    tip: 'hero',
    naslov: '🎥 Monitoring Live',
    podnaslov: 'SPAJA Monitoring Live — Platforma za streaming uzivo',
    ikona: '🎥',
    redosled: 1,
    podaci: {
      opis: 'SPAJA Monitoring Live je napredna platforma za live streaming koja omogucava streamovanje u visokom kvalitetu, real-time interakciju sa gledaocima i naprednu analitiku.',
      dugmad: [
        { tekst: 'Pogledaj streamove', href: '/monitoring-live' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'monitoring-live-statistika',
    tip: 'statistika',
    naslov: '📊 Monitoring Live u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Streamova', vrednost: '8', ikona: '🎥' },
        { naziv: 'Streamera', vrednost: '6', ikona: '👤' },
        { naziv: 'Gledaoci', vrednost: '2.5K+', ikona: '👁️' },
        { naziv: 'Kategorija', vrednost: '5', ikona: '📂' },
      ],
    },
  },
  {
    id: 'monitoring-live-kartice',
    tip: 'kartice',
    naslov: '🎥 Top streamovi',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'AI Development', opis: 'Live kodiranje i AI razvoj u realnom vremenu', ikona: '🤖', oznake: ['Uzivo', 'Tehnologija', '4K'] },
        { naslov: 'Gaming Arena', opis: 'Kompetitivni gaming turniri i streamovi', ikona: '🎮', oznake: ['Uzivo', 'Gaming', '1080p'] },
        { naslov: 'Tech Talk', opis: 'Diskusije o najnovijim tehnologijama', ikona: '💻', oznake: ['Zakazan', 'Edukacija', '720p'] },
        { naslov: 'Music Live', opis: 'Muzicki nastupi i DJ setovi uzivo', ikona: '🎵', oznake: ['Uzivo', 'Muzika', '4K'] },
      ],
    },
  },
  {
    id: 'monitoring-live-tekst',
    tip: 'tekst',
    naslov: 'O live streaming platformi',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA Monitoring Live platforma omogucava kreatorima sadrzaja da streamuju uzivo u visokom kvalitetu sa naprednom analitikom i real-time interakcijom sa publikom. Podrska za vise kategorija ukljucujuci tehnologiju, gaming, edukaciju i zabavu.',
      istaknuteStavke: [
        'Streaming u kvalitetu do 4K',
        'Real-time chat i interakcija sa gledaocima',
        'Napredna analitika za streamere',
        'Podrska za vise kategorija sadrzaja',
      ],
    },
  },
];
