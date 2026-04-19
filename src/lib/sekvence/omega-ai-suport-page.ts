import type { Sekvenca } from '@/lib/types';
import { OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';

export const omegaAiSuportSekvence: Sekvenca[] = [
  {
    id: 'omega-suport-hero',
    tip: 'hero',
    naslov: '📞 OMEGA AI Maksimalni Suport',
    podnaslov:
      `${OMEGA_AI_PERSONA_COUNT} persona sa direktnim telefonskim linijama, mejl adresama i dispeč sistemom za korisnike — 24/7/365 pokrivenost`,
    ikona: '📞',
    redosled: 1,
    podaci: {
      opis: `Maksimalni suport na OMEGA nivou: svaka od ${OMEGA_AI_PERSONA_COUNT} persona ima direktnu telefonsku liniju, mejl za dopisivanje i dispeč za tikete sa SLA garancijama.`,
      dugmad: [
        { tekst: 'OMEGA AI', href: '/omega-ai' },
        { tekst: 'Mobilna Mreža', href: '/mobilna-mreza', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'omega-suport-statistika',
    tip: 'statistika',
    naslov: '📊 Suport u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Persona', vrednost: '21', ikona: '🤖' },
        { naziv: 'Telefona', vrednost: '21', ikona: '📱' },
        { naziv: 'Departmana', vrednost: '9', ikona: '🏢' },
        { naziv: 'SLA', vrednost: '99.2%', ikona: '🎯' },
        { naziv: 'Zadovoljstvo', vrednost: '4.8/5', ikona: '⭐' },
        { naziv: 'Tiketa', vrednost: '2847', ikona: '🎫' },
      ],
    },
  },
  {
    id: 'omega-suport-kartice',
    tip: 'kartice',
    naslov: '📋 Suport kanali',
    redosled: 3,
    podaci: {
      kartice: [
        {
          naslov: 'Telefonski Suport',
          opis: `Direktne telefonske linije za svaku od ${OMEGA_AI_PERSONA_COUNT} OMEGA AI persona sa IVR navigacijom`,
          ikona: '📞',
          oznake: ['24/7', 'Direktna linija', 'IVR', 'Snimanje poziva'],
        },
        {
          naslov: 'Mejl Suport',
          opis: 'Dedicirane mejl adrese po departmanu sa prosečnim odgovorom od 8 minuta',
          ikona: '📧',
          oznake: ['Departmanski mejl', 'SLA praćenje', 'Automatski odgovor'],
        },
        {
          naslov: 'Live Chat',
          opis: 'Chatbot trijaža sa instant povezivanjem na živog agenta i screen sharing-om',
          ikona: '💬',
          oznake: ['Chatbot', 'Screen sharing', 'Video poziv', 'Instant'],
        },
        {
          naslov: 'Tiket Sistem',
          opis: 'Automatsko dodeljivanje tiketa sa SLA garancijama i eskalacijom u 3 nivoa',
          ikona: '🎫',
          oznake: ['Auto-dodela', 'Eskalacija', 'SLA garancija', 'CSAT'],
        },
      ],
    },
  },
  {
    id: 'omega-suport-tekst',
    tip: 'tekst',
    naslov: 'Kako funkcioniše OMEGA AI Maksimalni Suport',
    redosled: 4,
    podaci: {
      sadrzaj:
        `OMEGA AI Maksimalni Suport objedinjuje telefonski, mejl, live chat i tiket sistem u jedinstven dispeč centar. Svaka od ${OMEGA_AI_PERSONA_COUNT} persona ima direktnu telefonsku liniju, mejl adresu i pristup tiket sistemu. Korisnici dobijaju SLA garancije prema svom planu — od Enterprise (15 min) do Starter (120 min). Eskalacija ide kroz 3 nivoa sa automatskim praćenjem vremena i obaveštavanjem.`,
      istaknuteStavke: [
        '24/7/365 pokrivenost sa 3 smene i automatskim dispeč sistemom',
        'SLA garancije: Enterprise (15 min), Biznis (30 min), Profesionalni (60 min), Starter (120 min)',
        'Dispeč sa IVR navigacijom, prioritetnim rutiranjem i eskalacijom u 3 nivoa',
        'Direktne telefonske linije: +38177, +38188, +38178, +38187 pozivni brojevi',
      ],
    },
  },
];
