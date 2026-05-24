import type { Sekvenca } from '@/lib/types';
import { buildAiIqWorldBankProcesiranje, AIIQWB_PROC_SUCCESS_RATE, AIIQWB_PROC_PER_DAY, AIIQWB_PROC_AVG_TIME_MS } from '@/lib/ai-iq-world-bank-procesiranje';
import { AIIQ_WORLD_BANK_KAMATNA_STOPA } from '@/lib/ai-iq-world-bank';

const r = buildAiIqWorldBankProcesiranje();

export const aiIqWorldBankProcesiranjeSekvence: Sekvenca[] = [
  // ── Hero ─────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-hero',
    tip: 'hero',
    naslov: '⚙️ AI IQ World Bank — Procesiranje Transakcija',
    podnaslov: `Aktivni sloj obrade: ${AIIQWB_PROC_PER_DAY.toLocaleString('sr-Latn')} transakcija/dan, ${AIIQWB_PROC_SUCCESS_RATE}% uspešnost, AI fraud detekcija, SWIFT/blockchain rutiranje`,
    ikona: '⚙️',
    redosled: 1,
    podaci: {
      opis: `AI IQ World Bank procesira ${AIIQWB_PROC_PER_DAY.toLocaleString('sr-Latn')} transakcija dnevno uz prosečno vreme obrade od ${AIIQWB_PROC_AVG_TIME_MS}ms. Kamatna stopa od ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% mesečno se obračunava u realnom vremenu za svaki štedni račun. Omega AI Fraud Detekcija štiti svaku transakciju.`,
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank', stil: 'sekundarno' },
        { tekst: 'API Procesiranje', href: '/api/ai-iq-world-bank-procesiranje', stil: 'sekundarno' },
      ],
    },
  },

  // ── KPI procesiranja ──────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-kpi',
    tip: 'statistika',
    naslov: '📊 KPI Procesiranja',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Transakcija/dan', vrednost: r.kpi.transakcijaUDanu.toLocaleString('sr-Latn'), ikona: '💸' },
        { naziv: 'Uspešnost', vrednost: `${r.kpi.uspesnostProcenata}%`, ikona: '✅' },
        { naziv: 'Prosečno vreme', vrednost: `${r.kpi.prosecnoVremeMs}ms`, ikona: '⚡' },
        { naziv: 'Fraud blokirano', vrednost: r.kpi.fraudBlokirano, ikona: '🛡️' },
        { naziv: 'SWIFT transfera', vrednost: r.kpi.swiftTransfera, ikona: '🌍' },
        { naziv: 'Blockchain', vrednost: r.kpi.blockchainTransfera, ikona: '🔗' },
        { naziv: 'Instant prenos', vrednost: r.kpi.instantTransfera, ikona: '⚡' },
        { naziv: 'Aktivnih računa', vrednost: r.kpi.aktivnihRacuna, ikona: '👤' },
      ],
    },
  },

  // ── Transakcije u obradi ──────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-transakcije',
    tip: 'tabela',
    naslov: '🔄 Transakcije u Obradi — Pipeline',
    podnaslov: 'Aktivne transakcije i njihov status u procesu obrade',
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Iznos', 'Valuta', 'Status', 'Fraud Check', 'Vreme (ms)', 'Procesirano'],
      redovi: r.transakcijeUObradi.map((t) => [
        t.id,
        t.iznos.toLocaleString('sr-Latn'),
        t.valuta,
        t.status,
        t.fraudCheck,
        t.vrijemePocetkaMs === 0 ? '—' : `${t.vrijemePocetkaMs}ms`,
        t.procesirano ? '✅' : '🔄',
      ]),
    },
  },

  // ── Kamatna obrada ────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-kamatna',
    tip: 'tabela',
    naslov: `💰 Kamatna Obrada — ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% mesečno`,
    podnaslov: 'Obračun kamate u realnom vremenu za sve štedne račune',
    redosled: 4,
    podaci: {
      zaglavlje: ['Ulog', 'Valuta', 'Stopa', 'Period', 'Zarada', 'Ukupno', 'Status'],
      redovi: r.kamatnaObrada.map((k) => [
        k.ulog.toLocaleString('sr-Latn'),
        k.valuta,
        `${k.stopaProcent}%`,
        k.period,
        k.zarada.toLocaleString('sr-Latn'),
        k.ukupno.toLocaleString('sr-Latn'),
        k.statusObrade === 'aktivno' ? '🔄 Aktivno' : '✅ Završeno',
      ]),
    },
  },

  // ── Računi u obradi ───────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-racuni',
    tip: 'kartice',
    naslov: '🏦 Računi u Obradi — Pipeline Faze',
    podnaslov: 'Status pipeline-a za svaki račun: validacija → odobrenje → izvršavanje → settlement',
    redosled: 5,
    podaci: {
      kartice: r.racuniUObradi.map((racun) => ({
        naslov: `${racun.racunId} (${racun.valuta})`,
        opis: `Tip: ${racun.tip} | Trenutna faza: ${racun.trenutnaFaza}`,
        ikona: racun.valuta === 'RSD' ? '🇷🇸' : racun.valuta === 'EUR' ? '🇪🇺' : '🇺🇸',
        oznake: racun.faze.map((f) =>
          `${f.naziv}: ${f.status === 'zavrsena' ? '✅' : f.status === 'u_toku' ? '🔄' : '⏳'}`
        ),
      })),
    },
  },

  // ── Fraud Checks ──────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-fraud',
    tip: 'tabela',
    naslov: '🛡️ AI Fraud Detekcija — Rezultati',
    podnaslov: 'Omega AI Fraud Model — sigurnosni score za svaku transakciju',
    redosled: 6,
    podaci: {
      zaglavlje: ['Transakcija ID', 'Rezultat', 'Sigurnost Score', 'Razlog'],
      redovi: r.fraudChecks.map((f) => [
        f.transakcijaId,
        f.rezultat === 'ok' ? '✅ OK' : f.rezultat === 'upozorenje' ? '⚠️ Upozorenje' : '🚫 Blokiran',
        `${f.sigurnostScore}/100`,
        f.razlog,
      ]),
    },
  },

  // ── Ruting odluke ─────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-ruting',
    tip: 'kartice',
    naslov: '🔀 Ruting Odluke — SWIFT / Blockchain / Instant',
    podnaslov: 'AI optimizovano rutiranje transakcija za najniže provizije i najbrže izvršavanje',
    redosled: 7,
    podaci: {
      kartice: r.rutingOdluke.map((rut) => ({
        naslov: `${rut.transakcijaId} → ${rut.odabranaMetoda}`,
        opis: rut.obrazlozenje,
        ikona: rut.odabranaMetoda === 'SWIFT' ? '🌍' : rut.odabranaMetoda === 'blockchain' ? '🔗' : '⚡',
        oznake: [
          rut.odabranaMetoda,
          `Provizija: ${rut.provizija}`,
          rut.odabranaMetoda === 'instant' ? `${rut.procenjeniMs}ms` : '',
        ].filter(Boolean),
      })),
    },
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-proc-cta',
    tip: 'cta',
    naslov: '🚀 AI IQ World Bank — Kompletan Ekosistem',
    redosled: 99,
    podaci: {
      opis: `AI IQ World Bank procesira ${AIIQWB_PROC_PER_DAY.toLocaleString('sr-Latn')} transakcija dnevno uz ${AIIQWB_PROC_SUCCESS_RATE}% uspešnost. Kamatna stopa ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% mesečno. Omega AI Fraud zaštita na svakoj transakciji.`,
      stavke: [
        { naziv: 'Transakcija/dan', vrednost: AIIQWB_PROC_PER_DAY.toLocaleString('sr-Latn'), ikona: '💸' },
        { naziv: 'Uspešnost', vrednost: `${AIIQWB_PROC_SUCCESS_RATE}%`, ikona: '✅' },
        { naziv: 'Kamata', vrednost: `${AIIQ_WORLD_BANK_KAMATNA_STOPA}%/mes`, ikona: '💰' },
        { naziv: 'Avg vreme', vrednost: `${AIIQWB_PROC_AVG_TIME_MS}ms`, ikona: '⚡' },
      ],
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank', stil: 'sekundarno' },
        { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
      ],
    },
  },
];
