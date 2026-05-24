import type { Sekvenca } from '@/lib/types';
import { buildProcesuiranjeSvega } from '@/lib/procesuiranje-svega';
import { KOMPANIJA, APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';

const p = buildProcesuiranjeSvega();

const domenIkone: Record<string, string> = {
  bankarski: '🏦',
  ai: '🧠',
  finansijski: '💰',
  licencni: '📜',
  ekosistem: '🌐',
  autofinish: '♻️',
  bezbednosni: '🔒',
  analiticki: '📊',
};

export const procesuiranjeSvegaSekvence: Sekvenca[] = [
  // ── Hero ─────────────────────────────────────────────────────────────────
  {
    id: 'proc-svega-hero',
    tip: 'hero',
    naslov: '⚙️ PROCESUIRANJE SVEGA — Digitalna Industrija',
    podnaslov: `Aktivni pipeline procesiranja svih domena ${KOMPANIJA} — ${p.ukupanProcenat}% ukupan procenat`,
    ikona: '⚙️',
    redosled: 1,
    podaci: {
      opis: `Jedinstven pregled aktivnog procesiranja svih 8 domena Digitalne Industrije: bankarski, AI, finansijski, licencni, ekosistem, autofinish, bezbednosni i analitički. Ukupan procenat: ${p.ukupanProcenat}%. Aktivnih procesa: ${p.aktivnihProcesa}. Verzija: v${APP_VERSION}.`,
      dugmad: [
        { tekst: 'API: Procesuiranje Svega', href: '/api/procesuiranje-svega' },
        { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },

  // ── KPI ───────────────────────────────────────────────────────────────────
  {
    id: 'proc-svega-kpi',
    tip: 'statistika',
    naslov: '📊 Ukupni KPI Procesiranja',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupan Procenat', vrednost: `${p.ukupanProcenat}%`, ikona: '🎯' },
        { naziv: 'Aktivnih Procesa', vrednost: p.aktivnihProcesa, ikona: '🔄' },
        { naziv: 'Čekajućih', vrednost: p.cekajucihProcesa, ikona: '⏳' },
        { naziv: 'Grešaka', vrednost: p.gresakaUkupno, ikona: '❌' },
        { naziv: 'Završenih', vrednost: p.zavrsenihProcesa, ikona: '✅' },
        { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
        { naziv: 'Domena', vrednost: Object.keys(p.domeni).length, ikona: '🌐' },
        { naziv: 'Verzija', vrednost: `v${APP_VERSION}`, ikona: '🏷️' },
      ],
    },
  },

  // ── Domeni — score tabela ──────────────────────────────────────────────────
  {
    id: 'proc-svega-domeni-tabela',
    tip: 'tabela',
    naslov: '📋 Procenat po Domenima',
    redosled: 3,
    podaci: {
      zaglavlje: ['Domen', 'Status', 'Procenat', 'Aktivnih', 'Završenih', 'Čekajućih'],
      redovi: Object.entries(p.domeni).map(([kljuc, domen]) => [
        `${domenIkone[kljuc] ?? '⚙️'} ${domen.naziv}`,
        domen.status === 'aktivno' ? '🔄 Aktivno'
          : domen.status === 'zavrseno' ? '✅ Završeno'
          : domen.status === 'greska' ? '❌ Greška'
          : '⏳ Čekanje',
        `${domen.procenat}%`,
        domen.stavke.filter((s) => s.status === 'aktivno').length,
        domen.stavke.filter((s) => s.status === 'zavrseno').length,
        domen.stavke.filter((s) => s.status === 'cekanje').length,
      ]),
    },
  },

  // ── Domeni — kartice ──────────────────────────────────────────────────────
  {
    id: 'proc-svega-domeni-kartice',
    tip: 'kartice',
    naslov: '🗂️ Pregled po Domenima',
    podnaslov: 'Svaki domen sa statusom i procenatom obrade',
    redosled: 4,
    podaci: {
      kartice: Object.entries(p.domeni).map(([kljuc, domen]) => ({
        naslov: `${domen.ikona} ${domen.naziv}`,
        opis: `${domen.stavke.length} procesa | ${domen.stavke.filter((s) => s.status === 'aktivno').length} aktivnih | ${domen.stavke.filter((s) => s.status === 'zavrseno').length} završenih`,
        ikona: domen.status === 'aktivno' ? '🔄' : domen.status === 'zavrseno' ? '✅' : domen.status === 'greska' ? '❌' : '⏳',
        oznake: [
          `${domen.procenat}%`,
          domen.status,
          kljuc,
        ],
      })),
    },
  },

  // ── Aktivni procesi ───────────────────────────────────────────────────────
  {
    id: 'proc-svega-aktivni',
    tip: 'tabela',
    naslov: '🔄 Aktivni Procesi — Svi Domeni',
    podnaslov: `${p.aktivneStavke.length} aktivnih procesa u realnom vremenu`,
    redosled: 5,
    podaci: {
      zaglavlje: ['ID', 'Opis', 'Tip', 'Status'],
      redovi: p.aktivneStavke.map((s) => [
        s.id,
        s.opis,
        s.tip,
        '🔄 Aktivno',
      ]),
    },
  },

  // ── Pipeline opis ─────────────────────────────────────────────────────────
  {
    id: 'proc-svega-pipeline',
    tip: 'tekst',
    naslov: '⚙️ Pipeline Arhitektura — Procesuiranje',
    podnaslov: 'Sekvencijalno i paralelno procesiranje svih domena',
    redosled: 6,
    podaci: {
      sadrzaj: 'AI IQ SUPER PLATFORMA koristi hibridni model procesiranja — kritični domeni (bankarski, bezbednosni) rade sekvencijalno za konzistentnost, dok analitički i ekosistem domeni rade paralelno za maksimalnu propusnost.',
      istaknuteStavke: [
        '🏦 Bankarski — ERSTE sinhronizacija + SWIFT/blockchain rutiranje + kamatna obrada',
        '🧠 AI procesi — Omega AI persona + scoring + fraud model + investicioni savetnik',
        '💰 Finansijski — Stripe billing + GitHub Billing + devizni računi + fakture',
        '📜 Licencni — registar + expiry provera + gap analiza + B2B nabavka',
        '🌐 Ekosistem — API rute + sitemap + cron + deploy pipeline + dijagnostika',
        '♻️ Autofinish — iteracije + pokrivenost + changelog + branch cleanup',
        '🔒 Bezbednosni — JWT rotacija + 2FA + OAuth + audit log + enkripcija',
        '📊 Analitički — KPI agregacija + score računanje + izveštaji + snapshot',
      ],
    },
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  {
    id: 'proc-svega-cta',
    tip: 'cta',
    naslov: '🚀 Kompletan Pregled Ekosistema',
    redosled: 99,
    podaci: {
      opis: `PROCESUIRANJE SVEGA — ${p.ukupanProcenat}% ukupan procenat, ${p.aktivnihProcesa} aktivnih procesa, ${p.zavrsenihProcesa} završenih. Autofinish #${AUTOFINISH_COUNT} — ${KOMPANIJA}.`,
      stavke: [
        { naziv: 'Ukupan %', vrednost: `${p.ukupanProcenat}%`, ikona: '🎯' },
        { naziv: 'Aktivnih', vrednost: p.aktivnihProcesa, ikona: '🔄' },
        { naziv: 'Završenih', vrednost: p.zavrsenihProcesa, ikona: '✅' },
        { naziv: 'Domena', vrednost: 8, ikona: '🌐' },
      ],
      dugmad: [
        { tekst: 'Analiza Svega', href: '/analiza-svega' },
        { tekst: 'API Procesuiranje', href: '/api/procesuiranje-svega', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
