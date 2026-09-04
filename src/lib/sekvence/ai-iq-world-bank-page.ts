import type { Sekvenca } from '@/lib/types';
import { OMEGA_AI_PERSONA_UKUPNO } from '@/lib/constants';
import { buildAiIqWorldBank, AIIQ_WORLD_BANK_KAMATNA_STOPA } from '@/lib/ai-iq-world-bank';

const r = buildAiIqWorldBank('system');

export const aiIqWorldBankSekvence: Sekvenca[] = [
  // ── Hero ─────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-hero',
    tip: 'hero',
    naslov: '🏦 AI IQ World Bank — Sve o njoj',
    podnaslov: `Globalna digitalna banka sa ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% pozitivnom kamatnom stopom, Omega AI tehnologijom i punom finansijskom infrastrukturom`,
    ikona: '🏦',
    redosled: 1,
    podaci: {
      opis: `AI IQ World Bank je digitalna banka koja koristi veštačku inteligenciju za optimizaciju finansijskih operacija, globalnih transfera i investicionih odluka. Pozitivna kamatna stopa od ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% na štedne račune — ulozite 1.000 dinara i za mesec dana povucite 1.400 dinara!`,
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Wollet', href: '/wollet', stil: 'sekundarno' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
        { tekst: 'Generator Računa', href: '/generator-za-poslovne-racune', stil: 'sekundarno' },
      ],
    },
  },

  // ── KPI statistika ────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-kpi',
    tip: 'statistika',
    naslov: '📊 AI IQ World Bank — KPI',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Kamatna stopa', vrednost: `${r.kpi.kamatnaStopaPrompt}%/mes`, ikona: '💰' },
        { naziv: 'Aktivnih računa', vrednost: `${r.kpi.aktivnihRacuna.toLocaleString('sr-Latn')}+`, ikona: '👤' },
        { naziv: 'Transfera/dan', vrednost: `${r.kpi.transferaKnaDan.toLocaleString('sr-Latn')}`, ikona: '💸' },
        { naziv: 'Krediti', vrednost: `${r.kpi.kredita.toLocaleString('sr-Latn')}`, ikona: '📋' },
        { naziv: 'Investicije', vrednost: `${r.kpi.investicija}+`, ikona: '📈' },
        { naziv: 'AI tačnost', vrednost: `${r.kpi.aiTacnost}%`, ikona: '🎯' },
        { naziv: 'Partneri', vrednost: `${r.kpi.partneraUkupno}`, ikona: '🤝' },
        { naziv: 'Srpskih banaka', vrednost: `${r.kpi.srpskihBanaka}`, ikona: '🏦' },
      ],
    },
  },

  // ── Profil banke ──────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-profil',
    tip: 'tekst',
    naslov: '🎯 Profil — Misija i vizija AI IQ World Bank',
    redosled: 3,
    podaci: {
      sadrzaj: `${r.profil.misija}. ${r.profil.inovacija}.`,
      istaknuteStavke: [
        `🎯 Misija: ${r.profil.misija}`,
        `🔭 Vizija: ${r.profil.vizija}`,
        `💡 Inovacija: ${r.profil.inovacija}`,
        `🌍 Lokacija: ${r.profil.lokacija}`,
        `🔗 URL: ${r.profil.url}`,
        `🐙 GitHub Repo: ${r.profil.repo}`,
        ...r.profil.vrednosti.map((v) => `✅ Vrednost: ${v}`),
      ],
    },
  },

  // ── Kamatna stopa kalkulator ──────────────────────────────────────────────
  {
    id: 'aiiqwb-kamatna-stopa',
    tip: 'tabela',
    naslov: '💰 Kamatna stopa — Kalkulator zarade',
    podnaslov: `Pozitivna kamatna stopa od ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% mesečno`,
    redosled: 4,
    podaci: {
      zaglavlje: ['Ulog (RSD)', 'Kamatna stopa', 'Period', 'Zarada', 'Ukupno za podizanje'],
      redovi: r.kamatnaStopaPrompt.primeri.map((p) => [
        p.ulog,
        `${r.kamatnaStopaPrompt.stopa}%`,
        '1 mesec',
        p.zarada,
        p.ukupno,
      ]),
    },
  },

  // ── Usluge ────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-usluge',
    tip: 'kartice',
    naslov: '💳 Bankarski servisi — Sve usluge',
    redosled: 5,
    podaci: {
      kartice: r.usluge.map((u) => ({
        naslov: u.naziv,
        opis: u.opis,
        ikona: u.ikona,
        oznake: u.oznake,
      })),
    },
  },

  // ── Bezbednost ────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-bezbednost',
    tip: 'lista',
    naslov: '🔒 Bezbednosne funkcije',
    redosled: 6,
    podaci: {
      stavke: r.bezbednost.map((b, i) => ({
        ikona: ['🛡️', '🌍', '🧠', '🔐', '🔍', '📊'][i] ?? '✅',
        naslov: b,
        opis: `Napredna zaštita: ${b}`,
      })),
    },
  },

  // ── Omega AI tehnologija ──────────────────────────────────────────────────
  {
    id: 'aiiqwb-omega-ai',
    tip: 'kartice',
    naslov: '🧠 Omega AI Tehnologija',
    podnaslov: r.omegaAiTehnologija.opis,
    redosled: 7,
    podaci: {
      kartice: r.omegaAiTehnologija.funkcije.map((f) => ({
        naslov: f.naziv,
        opis: f.opis,
        ikona: f.kategorija === 'kreditiranje' ? '🎯'
          : f.kategorija === 'bezbednost' ? '🛡️'
          : f.kategorija === 'investicije' ? '📊'
          : f.kategorija === 'analitika' ? '📈'
          : f.kategorija === 'transakcije' ? '⚡'
          : '💬',
        oznake: ['Omega AI', f.kategorija],
      })),
    },
  },

  // ── ERSTE Banka računi ────────────────────────────────────────────────────
  {
    id: 'aiiqwb-erste-racuni',
    tip: 'kartice',
    naslov: `🏦 ${r.ersteInfo.banka} — Računi Digitalne Industrije`,
    podnaslov: `Zvanični bankarski računi kompanije "${r.ersteInfo.vlasnikRacuna}" kod ERSTE banke DOO Smederevo`,
    redosled: 8,
    podaci: {
      kartice: r.ersteInfo.racuni.map((racun) => ({
        naslov: `${racun.ikona} ${racun.tip.charAt(0).toUpperCase() + racun.tip.slice(1)} račun (${racun.valuta})`,
        opis: racun.opis,
        ikona: racun.ikona,
        oznake: [racun.valuta, racun.tip, 'ERSTE Smederevo'],
      })),
    },
  },

  // ── ERSTE info tabela ─────────────────────────────────────────────────────
  {
    id: 'aiiqwb-erste-tabela',
    tip: 'tabela',
    naslov: '📋 ERSTE Banka — Pregled računa i kartica',
    podnaslov: 'Erste banka DOO Smederevo — Digitalna Industrija',
    redosled: 9,
    podaci: {
      zaglavlje: ['Kartica', 'Valuta', 'Broj računa', 'Namena', 'Status'],
      redovi: r.ersteInfo.racuni.map((racun) => [
        `${racun.ikona} ${racun.tip.charAt(0).toUpperCase() + racun.tip.slice(1)} kartica`,
        `${racun.valuta} ${racun.ikona}`,
        racun.brojRacuna,
        racun.opis,
        '✅ Aktivna',
      ]),
    },
  },

  // ── Smederevo ekspanzija ──────────────────────────────────────────────────
  {
    id: 'aiiqwb-smederevo',
    tip: 'tekst',
    naslov: '🏙️ Smederevo Ekspanzija',
    podnaslov: 'Ekspanzija AI IQ World Bank iz Smedereva ka celom svetu',
    redosled: 10,
    podaci: {
      sadrzaj: r.smederevoEkspanzija.opis,
      istaknuteStavke: r.smederevoEkspanzija.aktivnosti.map((a, i) =>
        `${['🏙️', '🏦', '🌍', '💻', '🤝', '📈'][i] ?? '▶️'} ${a}`
      ),
    },
  },

  // ── Partneri ──────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-partneri',
    tip: 'kartice',
    naslov: '🤝 Partneri — Bankarski i tehnološki ekosistem',
    podnaslov: `${r.kpi.partneraUkupno} aktivnih partnera AI IQ World Bank`,
    redosled: 11,
    podaci: {
      kartice: r.partneri.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [p.tip, ...(p.lokacija ? [p.lokacija] : [])],
      })),
    },
  },

  // ── Transferi ─────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-transferi',
    tip: 'kartice',
    naslov: '💸 Transferi — AI IQ World Bank',
    podnaslov: 'Interni transferi i finansijski tokovi',
    redosled: 12,
    podaci: {
      kartice: r.transferi.map((t) => ({
        naslov: `Transfer ${t.iznos.toLocaleString('sr-Latn')} ${t.valuta}`,
        opis: t.opis,
        ikona: '✅',
        oznake: [t.valuta, t.status, t.tip],
      })),
    },
  },

  // ── Dugovi ────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-dugovi',
    tip: 'tabela',
    naslov: '📋 Dugovi — Sumarni pregled',
    podnaslov: 'Pregled trenutnih dugova Digitalne Industrije prema partnerima i servisima',
    redosled: 13,
    podaci: {
      zaglavlje: ['Partner', 'Tip', 'Iznos', 'Valuta', 'Status', 'Napomena'],
      redovi: r.dugovi.stavke.map((d) => [
        d.partner,
        d.tip,
        `~$${d.iznos.toLocaleString('sr-Latn')}`,
        d.valuta,
        d.status,
        d.napomena,
      ]),
    },
  },

  // ── GitHub Billing ────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-github-billing',
    tip: 'tekst',
    naslov: '💳 GitHub Billing — AI IQ World Bank Governance',
    podnaslov: 'Centralizacija svih GitHub plaćanja preko AI IQ World Bank',
    redosled: 14,
    podaci: {
      sadrzaj: `Sva GitHub plaćanja Digitalne Industrije centralizovana su kroz AI IQ World Bank. GLAVNI ENDŽIN odobrava, OMEGA AI izvršava. Budžet: $${r.githubBilling.budzet.mesecniLimitUSD}/mesec, $${r.githubBilling.budzet.godisnjLimitUSD}/god. Pilot faza: ${r.githubBilling.pilotTransakcije.length} transakcija.`,
      istaknuteStavke: [
        `🏦 Billing račun: ${r.githubBilling.racun.naziv}`,
        `💰 Mesečni limit: $${r.githubBilling.budzet.mesecniLimitUSD} USD`,
        `📅 Godišnji limit: $${r.githubBilling.budzet.godisnjLimitUSD} USD`,
        `🔄 Rollout faze: ${r.githubBilling.rolloutFaze.length} (${r.githubBilling.rolloutFaze.filter((f) => f.status === 'u_toku').length} aktivnih)`,
        `📊 Pilot transakcije: ${r.githubBilling.pilotTransakcije.length} (ukupno $${r.githubBilling.statistike.ukupnoIznosUSD} USD)`,
        `📝 Audit zapisi: ${r.githubBilling.auditLog.length}`,
        `👥 Uloge: ${r.githubBilling.uloge.length} (GLAVNI ENDŽIN, OMEGA AI, Usklađenost)`,
      ],
    },
  },

  // ── GitHub Billing rollout ────────────────────────────────────────────────
  {
    id: 'aiiqwb-github-billing-rollout',
    tip: 'kartice',
    naslov: '🔄 GitHub Billing — Rollout plan',
    podnaslov: 'Tri faze centralizacije GitHub troškova kroz AI IQ World Bank',
    redosled: 15,
    podaci: {
      kartice: r.githubBilling.rolloutFaze.map((f) => ({
        naslov: `Faza ${f.faza}: ${f.naziv}`,
        opis: `${f.opis} (${f.trajanje})`,
        ikona: f.status === 'zavrsena' ? '✅' : f.status === 'u_toku' ? '🔄' : '📅',
        oznake: [f.status, f.trajanje],
      })),
    },
  },

  // ── Srpske banke ──────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-srpske-banke',
    tip: 'kartice',
    naslov: '🏦 Srpske banke — Zahtev za registraciju',
    podnaslov: `${r.srpskeBanke.banke.length} banaka u Republici Srbiji — zahtev za poslovne račune i kartice`,
    redosled: 16,
    podaci: {
      kartice: r.srpskeBanke.banke.map((b) => ({
        naslov: b.naziv,
        opis: `${b.lokacija} — zahtev za ${b.valute.join('/')} račun`,
        ikona: b.statusZahteva === 'aktivna-saradnja' ? '✅' : '🏦',
        oznake: [...b.valute, b.statusZahteva],
      })),
    },
  },

  // ── Mesni porez ───────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-mesni-porez',
    tip: 'tekst',
    naslov: '🏛️ Mesni Porez — Registracija i Uspostavljanje',
    podnaslov: 'Digitalna Industrija — uspostavljanje mesnog poreza u Republici Srbiji',
    redosled: 17,
    podaci: {
      sadrzaj: r.srpskeBanke.mesniPorez.opis,
      istaknuteStavke: [
        `🏛️ Vrsta poreza: Mesni porez — lokalna poreska obaveza`,
        `🏙️ Teritorija: ${r.srpskeBanke.mesniPorez.teritorija}`,
        `📋 Osnov: Zakon o porezima na imovinu + Zakon o finansiranju lokalne samouprave`,
        `🏢 Poreski obveznik: Digitalna Industrija — Nikola Spajić`,
        `💰 Valuta obračuna: RSD (srpski dinar)`,
        `✅ Status: ${r.srpskeBanke.mesniPorez.status}`,
      ],
    },
  },

  // ── Kontakt i društvene mreže ─────────────────────────────────────────────
  {
    id: 'aiiqwb-kontakt',
    tip: 'lista',
    naslov: '📱 Kontakt i društvene mreže',
    podnaslov: 'Ostanite u kontaktu sa AI IQ World Bank',
    redosled: 18,
    podaci: {
      stavke: [
        ...r.kontakt.map((k) => ({
          ikona: k.tip === 'podrška' ? '📧' : k.tip === 'billing' ? '💳' : k.tip === 'biznis' ? '🤝' : '🛟',
          naslov: `${k.tip.charAt(0).toUpperCase() + k.tip.slice(1)}: ${k.adresa}`,
          opis: k.namena,
        })),
        ...r.drustvneMreze.map((m) => ({
          ikona: m.ikona,
          naslov: `${m.naziv}: ${m.korisnickoIme}`,
          opis: m.url,
        })),
      ],
    },
  },

  // ── Ekosistem linkovi ─────────────────────────────────────────────────────
  {
    id: 'aiiqwb-ekosistem',
    tip: 'kartice',
    naslov: '🌐 AI IQ World Bank u Ekosistemu',
    podnaslov: 'Svi moduli i rute koje su direktno povezane sa AI IQ World Bank',
    redosled: 19,
    podaci: {
      kartice: [
        { naslov: 'Banka', opis: 'Glavna banka stranica — servis prikaz i kamatna stopa', ikona: '🏦', oznake: ['Stranica', '/banka'] },
        { naslov: 'Poslovni Novčanik', opis: 'Wallet modul — tokovi i poslovna plaćanja', ikona: '💼', oznake: ['Stranica', '/poslovni-novcanik'] },
        { naslov: 'Generator Poslovnih Računa', opis: 'Generisanje poslovnih računa u RSD/EUR/USD', ikona: '🧾', oznake: ['Stranica', '/generator-za-poslovne-racune'] },
        { naslov: 'Validator Poslovnih Računa', opis: 'Validacija generisanih računa', ikona: '✅', oznake: ['Stranica', '/validator-poslovnih-racuna'] },
        { naslov: 'Blockchain', opis: 'Pametni ugovor — Polygon blockchain verifikacija', ikona: '🔗', oznake: ['Stranica', '/blockchain'] },
        { naslov: 'Dnevna Raspodela', opis: '96% ERSTE + 4% AI IQ World Bank dnevni prihod', ikona: '💰', oznake: ['Stranica', '/dnevna-raspodela-zarade'] },
        {
          naslov: `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString('sr-Latn')} OMEGA AI persona`,
          opis: 'Omega AI pokreće sve AI funkcije banke',
          ikona: '🧠',
          oznake: ['OMEGA AI', '/omega-ai'],
        },
      ],
    },
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  {
    id: 'aiiqwb-cta',
    tip: 'cta',
    naslov: '🚀 Započnite sa AI IQ World Bank',
    redosled: 20,
    podaci: {
      opis: `AI IQ World Bank — ${AIIQ_WORLD_BANK_KAMATNA_STOPA}% pozitivna kamatna stopa mesečno. Ulozite 1.000 RSD, za mesec dana podignite 1.400 RSD. Ekstremno jaka i transparentna digitalna banka.`,
      stavke: [
        { naziv: 'Kamata', vrednost: `${AIIQ_WORLD_BANK_KAMATNA_STOPA}%/mes`, ikona: '💰' },
        { naziv: 'Min. ulog', vrednost: '1.000 RSD', ikona: '📌' },
        { naziv: 'Period', vrednost: '30 dana', ikona: '⏳' },
        { naziv: 'Status', vrednost: '✅ Aktivan', ikona: '✅' },
      ],
      dugmad: [
        { tekst: 'Banka', href: '/banka' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
        { tekst: 'Generator Računa', href: '/generator-za-poslovne-racune', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },

  // ── Blockchain baner ──────────────────────────────────────────────────────
  {
    id: 'aiiqwb-blockchain',
    tip: 'baner',
    naslov: '🔗 Pametni Ugovor — Polygon Blockchain',
    redosled: 99,
    podaci: {
      bedz: '🔗 BLOCKCHAIN VERIFIKACIJA',
      opis: 'AI IQ World Bank ima pametni ugovor (Smart Contract) na Polygon mreži. Svaka transakcija je upisana na blockchain i ima hash koji je javno proverljiv na polygonscan.com.',
      dugme: { tekst: '🔍 Pogledaj Blockchain Transakcije', href: '/blockchain' },
    },
  },
];
