import type { Sekvenca } from '@/lib/types';

export const aiIqMonitoringSekvence: Sekvenca[] = [
  {
    id: 'ai-iq-monitoring-hero',
    tip: 'hero',
    naslov: '🔍 AI IQ Monitoring',
    podnaslov: 'SPAJA AI IQ Monitoring — Pracenje gresaka, alerti i AI auto-popravka',
    ikona: '🔍',
    redosled: 1,
    podaci: {
      opis: 'SPAJA AI IQ Monitoring je napredan sistem za pracenje produkcijskih gresaka, uptime monitoring i automatsku AI popravku problema. Osigurajte 99.97% uptime sa inteligentnim alertima.',
      dugmad: [
        { tekst: 'Pogledaj monitoring', href: '/ai-iq-monitoring' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'ai-iq-monitoring-statistika',
    tip: 'statistika',
    naslov: '📊 Monitoring u brojevima',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Pracene greske', vrednost: '24', ikona: '🐛' },
        { naziv: 'Uptime', vrednost: '99.97%', ikona: '✅' },
        { naziv: 'AI reseno', vrednost: '89%', ikona: '🤖' },
        { naziv: 'Aktivni alerti', vrednost: '3', ikona: '🔔' },
      ],
    },
  },
  {
    id: 'ai-iq-monitoring-kartice',
    tip: 'kartice',
    naslov: '🔍 Monitoring funkcije',
    redosled: 3,
    podaci: {
      kartice: [
        { naslov: 'Error Tracking', opis: 'Automatsko pracenje i klasifikacija produkcijskih gresaka', ikona: '🐛', oznake: ['Real-time', 'AI klasifikacija', 'Stack trace'] },
        { naslov: 'Alerts', opis: 'Inteligentni sistem alertiranja sa eskalacijom', ikona: '🔔', oznake: ['Slack', 'Email', 'SMS'] },
        { naslov: 'Uptime', opis: 'Kontinuirano pracenje dostupnosti servisa', ikona: '✅', oznake: ['99.97%', '24/7', 'Multi-region'] },
        { naslov: 'AI Auto-fix', opis: 'Automatska AI popravka detektovanih problema', ikona: '🤖', oznake: ['GPT', 'Auto-deploy', 'Rollback'] },
      ],
    },
  },
  {
    id: 'ai-iq-monitoring-tekst',
    tip: 'tekst',
    naslov: 'O monitoring sistemu',
    redosled: 4,
    podaci: {
      sadrzaj: 'SPAJA AI IQ Monitoring koristi vestacku inteligenciju za proaktivno otkrivanje i resavanje produkcijskih problema. Sistem automatski klasifikuje greske po ozbiljnosti, salje inteligentne alerte i moze samostalno primeniti popravke za poznate obrasce gresaka.',
      istaknuteStavke: [
        'Automatsko pracenje i klasifikacija gresaka po ozbiljnosti',
        'Inteligentni alerti sa eskalacijom (Slack, Email, SMS)',
        '99.97% uptime sa multi-region monitoringom',
        'AI auto-popravka za poznate obrasce gresaka',
      ],
    },
  },
];
