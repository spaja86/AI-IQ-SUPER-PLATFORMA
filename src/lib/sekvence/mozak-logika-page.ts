import type { Sekvenca } from '@/lib/types';
import { glavniEndzinDigitalneIndustrije } from '@/lib/glavni-endzin-digitalne-industrije';

const m = glavniEndzinDigitalneIndustrije.mozakLogika;
const p = glavniEndzinDigitalneIndustrije.povratniOdaziv;

export const mozakLogikaSekvence: Sekvenca[] = [
  {
    id: 'mozak-logika-hero',
    tip: 'hero',
    naslov: '🧠 MOZAK LOGIKA — inteligentni podsistem Glavnog Endžina',
    podnaslov:
      `Non-stop analiza, ideje i projektni planovi — ${m.operativniStatus.povezanihSistema} povezanih sistema, ` +
      `${m.operativniStatus.reviewNaCekanju} review stavki`,
    ikona: '🧠',
    redosled: 1,
    podaci: {
      opis:
        'MOZAK LOGIKA formalizuje logički sloj Glavnog Endžina: neprekidno prati stanje, ' +
        'analizira mogućnosti, predlaže ideje i planove, a sve nepoznato šalje u jasan povratni odaziv za ljudsku potvrdu.',
      dugmad: [
        { tekst: 'Glavni Endžin', href: '/glavni-endzin' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'mozak-logika-status',
    tip: 'statistika',
    naslov: '📊 Operativni status MOZAK LOGIKA',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Status', vrednost: m.status, ikona: '🧠' },
        { naziv: 'Ciklus zdravlja', vrednost: `${m.operativniStatus.ciklusZdravlja}%`, ikona: '💓' },
        { naziv: 'Nove ideje', vrednost: m.operativniStatus.novihIdeja, ikona: '💡' },
        { naziv: 'Review na čekanju', vrednost: m.operativniStatus.reviewNaCekanju, ikona: '📋' },
        { naziv: 'Povezani sistemi', vrednost: m.operativniStatus.povezanihSistema, ikona: '🔗' },
        { naziv: 'Plan status', vrednost: m.operativniStatus.planGenerisanjeStatus, ikona: '🗺️' },
        { naziv: 'Radi non-stop', vrednost: m.operativniStatus.radiNonStop ? 'DA' : 'NE', ikona: '♾️' },
        { naziv: 'Backlog', vrednost: m.operativniStatus.backlogStatus, ikona: '📦' },
      ],
    },
  },
  {
    id: 'mozak-logika-tekst',
    tip: 'tekst',
    naslov: '🧠 Šta radi MOZAK LOGIKA?',
    redosled: 3,
    podaci: {
      sadrzaj:
        `${m.mozakLogikaSummary.objasnjenje} ` +
        'Podsistem radi u režimu orkestracija-i-potvrda: sve što je poznato i niskorizično može da pripremi automatski, ' +
        'dok sve nepoznato, blokirano ili strateški važno ostaje vidljivo za ljudsku odluku.',
      istaknuteStavke: [
        `Fokus: ${m.mozakLogikaSummary.fokus}`,
        `Režim: ${m.mozakLogikaSummary.rezim}`,
        `Aktivnih ciklusa: ${m.aktivniCiklusi.length}`,
        `Projektnih planova: ${m.projektniPlanovi.length}`,
        `Nepoznanica: ${m.nepoznanice.length}`,
        `Povratni odaziv stavki: ${p.ukupnoStavki}`,
      ],
    },
  },
  {
    id: 'mozak-logika-ciklusi',
    tip: 'kartice',
    naslov: '🔄 Aktivni ciklusi',
    podnaslov: 'Neprekidno izvršavanje, analiza i planiranje',
    redosled: 4,
    podaci: {
      kartice: m.aktivniCiklusi.map((ciklus) => ({
        naslov: ciklus.naziv,
        opis: `${ciklus.opis} Izlaz: ${ciklus.izlaz}. Frekvencija: ${ciklus.frekvencija}.`,
        ikona:
          ciklus.status === 'aktivan'
            ? '♾️'
            : ciklus.status === 'sinhronizacija'
              ? '🔁'
              : '🛑',
        oznake: [ciklus.status, ciklus.frekvencija],
      })),
    },
  },
  {
    id: 'mozak-logika-sistemi',
    tip: 'tabela',
    naslov: '🧩 Matrica povezanih sistema',
    redosled: 5,
    podaci: {
      zaglavlje: ['Sistem', 'Tip', 'Ukupno', 'Aktivno', 'Prioritet', 'Uloga'],
      redovi: m.povezaniSistemi.map((sistem) => [
        sistem.naziv,
        sistem.tip,
        String(sistem.ukupnoEndzina),
        String(sistem.aktivnihEndzina),
        sistem.prioritet,
        sistem.razlogPovezivanja,
      ]),
    },
  },
  {
    id: 'mozak-logika-ideje',
    tip: 'kartice',
    naslov: '💡 Nove ideje i vizije',
    redosled: 6,
    podaci: {
      kartice: m.generisaneIdeje.map((ideja) => ({
        naslov: ideja.naslov,
        opis: `${ideja.opis} Uticaj: ${(ideja.uticaj * 100).toFixed(0)}%.`,
        ikona: ideja.kategorija === 'vizija' ? '🌟' : '💡',
        oznake: [ideja.kategorija, ideja.prioritet, ideja.status],
      })),
    },
  },
  {
    id: 'mozak-logika-review',
    tip: 'tabela',
    naslov: '📋 Povratni odaziv i review queue',
    redosled: 7,
    podaci: {
      zaglavlje: ['Stavka', 'Klasifikacija', 'Prioritet', 'Sistemi', 'Sledeća akcija'],
      redovi: m.reviewQueue.map((stavka) => [
        stavka.naslov,
        stavka.klasifikacija,
        stavka.prioritet,
        stavka.pogodjeniSistemi.join(', '),
        stavka.narednaAkcija,
      ]),
    },
  },
  {
    id: 'mozak-logika-planovi',
    tip: 'kartice',
    naslov: '🗺️ Generisani projektni planovi',
    redosled: 8,
    podaci: {
      kartice: m.projektniPlanovi.map((plan) => ({
        naslov: plan.naziv,
        opis: `${plan.cilj} Naredni korak: ${plan.naredniKorak}.`,
        ikona: plan.status === 'spreman' ? '🟢' : plan.status === 'ceka-potvrdu' ? '🟡' : '🔴',
        oznake: [plan.status, `${plan.faze.length} faze`, `${plan.zavisnosti.length} zavisnosti`],
      })),
    },
  },
  {
    id: 'mozak-logika-nepoznanice',
    tip: 'lista',
    naslov: '❓ Nepoznanice za proveru',
    redosled: 9,
    podaci: {
      stavke: m.nepoznanice.map(
        (stavka) =>
          `${stavka.pitanje} — ${stavka.razlog} — Preporuka: ${stavka.preporucenaAkcija}`,
      ),
    },
  },
  {
    id: 'mozak-logika-cta',
    tip: 'cta',
    naslov: '🚀 Nastavi sa radom Glavnog Endžina',
    redosled: 10,
    podaci: {
      opis:
        `MOZAK LOGIKA trenutno prati ${m.operativniStatus.reviewNaCekanju} review stavki, ` +
        `${m.operativniStatus.novihIdeja} novih ideja i ${p.blokirano} blokirane nepoznanice koje traže potvrdu.`,
      dugmad: [
        { tekst: 'Glavni Endžin', href: '/glavni-endzin' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Digitalna Industrija', href: '/industrija', stil: 'sekundarno' },
      ],
    },
  },
];
