import type { Sekvenca } from '@/lib/types';
import { WOLLET_RACUNI } from '@/lib/wollet/accounts';
import { ISTORIJSKE_NABAVKE, UKUPNO_POTROSENO_MINOR } from '@/lib/wollet/transactions';
import { agregirajStanje, formatIznos } from '@/lib/wollet/balance';
import { wolletComplianceRequirements, wolletDataClassification } from '@/lib/wollet/compliance';
import { POLYGON_CONFIG } from '@/lib/wollet/blockchain';

const stanje = agregirajStanje(WOLLET_RACUNI);
const ukupnoUsdDisplay = (UKUPNO_POTROSENO_MINOR / 100).toLocaleString('sr-Latn');

export const wolletSekvence: Sekvenca[] = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  {
    id: 'wollet-hero',
    tip: 'hero',
    naslov: '💳 AI IQ World Bank Wollet',
    podnaslov: 'Digitalni poslovni novčanik — blockchain verifikovan, multi-valutni, NBS usklađen',
    ikona: '💳',
    redosled: 1,
    podaci: {
      opis: `AI IQ World Bank Wollet je poslovni novčanik koji integriše RSD, EUR i USD račune Digitalne Industrije. Svaka transakcija je upisana na Polygon blockchain i javno proverljiva na polygonscan.com. Ukupno nabavki: $${ukupnoUsdDisplay} USD.`,
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
        { tekst: 'Blockchain', href: '/blockchain', stil: 'sekundarno' },
        { tekst: 'Pametni Ugovori', href: '/pametni-ugovori', stil: 'sekundarno' },
      ],
    },
  },

  // ── Statistika — stanje računa ────────────────────────────────────────────
  {
    id: 'wollet-statistika',
    tip: 'statistika',
    naslov: '📊 Stanje računa — AI IQ World Bank',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'RSD Račun', vrednost: `${stanje.rsd.toLocaleString('sr-Latn')} din`, ikona: '🇷🇸' },
        { naziv: 'EUR Račun', vrednost: `€${stanje.eur.toFixed(2)}`, ikona: '🇪🇺' },
        { naziv: 'USD Račun', vrednost: `$${stanje.usd.toFixed(2)}`, ikona: '🇺🇸' },
        { naziv: 'Ukupno nabavki', vrednost: `$${ukupnoUsdDisplay}`, ikona: '💰' },
        { naziv: 'Transakcija', vrednost: `${ISTORIJSKE_NABAVKE.length}`, ikona: '📋' },
        { naziv: 'Blockchain', vrednost: 'Polygon', ikona: '🔗' },
      ],
    },
  },

  // ── Tabela — 50 nabavki ───────────────────────────────────────────────────
  {
    id: 'wollet-nabavke',
    tip: 'tabela',
    naslov: `📦 Svih ${ISTORIJSKE_NABAVKE.length} nabavki Digitalne Industrije`,
    podnaslov: `Ukupno: $${ukupnoUsdDisplay} USD — javno proverljivo na Polygon blockchain-u`,
    redosled: 3,
    podaci: {
      zaglavlje: ['ID', 'Naziv', 'Iznos', 'Valuta', 'Status', 'Polygonscan'],
      redovi: ISTORIJSKE_NABAVKE.map((t) => [
        `#${t.id}`,
        t.naziv,
        formatIznos(t.iznosMinor, t.valuta),
        t.valuta,
        '✅ IZVRSENO',
        `🔗 ${POLYGON_CONFIG.mainnet.explorerUrl}/address/0x0`,
      ]),
    },
  },

  // ── Kartice — računi ──────────────────────────────────────────────────────
  {
    id: 'wollet-racuni',
    tip: 'kartice',
    naslov: '🏦 Poslovni računi — Digitalna Industrija',
    redosled: 4,
    podaci: {
      kartice: WOLLET_RACUNI.map((racun) => ({
        naslov: `${racun.naziv}`,
        opis: `Račun: ${racun.brojRacuna} | Stanje: ${formatIznos(racun.stanjeMinor, racun.valuta)}`,
        ikona: racun.valuta === 'RSD' ? '🇷🇸' : racun.valuta === 'EUR' ? '🇪🇺' : '🇺🇸',
        oznake: [racun.valuta, racun.aktivan ? '✅ Aktivan' : '⏸️ Neaktivan', racun.brojRacuna],
      })),
    },
  },

  // ── Lista — wollet funkcionalnosti ────────────────────────────────────────
  {
    id: 'wollet-funkcionalnosti',
    tip: 'lista',
    naslov: '⚙️ Wollet funkcionalnosti',
    redosled: 5,
    podaci: {
      stavke: [
        { ikona: '💳', naslov: 'Multi-valutni računi', opis: 'RSD, EUR i USD poslovni računi u jednom wollet modulu.' },
        { ikona: '🔗', naslov: 'Blockchain verifikacija', opis: 'Svaka transakcija ima Polygon blockchain hash — javno proverljivo na polygonscan.com.' },
        { ikona: '📥', naslov: 'Depozit', opis: 'Depozit sredstava na poslovne račune uz automatski blockchain upis.' },
        { ikona: '💸', naslov: 'Prenos', opis: 'Interni transfer između računa uz validaciju iznosa i valute.' },
        { ikona: '📜', naslov: 'Istorija transakcija', opis: '50+ nabavki upisano u konstruktoru smart contract-a — trajno i nepromenljivo.' },
        { ikona: '🛡️', naslov: 'Audit trail', opis: 'Svaka akcija generiše audit entry sa Polygonscan deep-linkom.' },
        { ikona: '⚖️', naslov: 'Compliance', opis: 'NBS regulativa, AML/KYC, SEPA, SWIFT i GDPR usklađenost.' },
        { ikona: '🔒', naslov: 'Read-first pristup', opis: 'Javno čitanje bez autentikacije; write operacije zahtevaju vlasnik autentikaciju.' },
      ],
    },
  },

  // ── Tabela — compliance ───────────────────────────────────────────────────
  {
    id: 'wollet-compliance',
    tip: 'tabela',
    naslov: '⚖️ Compliance status',
    podnaslov: 'NBS, AML, SEPA, SWIFT, GDPR, PCI DSS i Polygon verifikacija',
    redosled: 6,
    podaci: {
      zaglavlje: ['Kod', 'Naziv', 'Status', 'Scope', 'Organ'],
      redovi: wolletComplianceRequirements.map((r) => [
        r.code,
        r.title,
        r.status === 'implemented' ? '✅ Implementovan' : r.status === 'in_progress' ? '🛠️ U toku' : '📋 Planiran',
        r.scope,
        r.organ ?? '—',
      ]),
    },
  },

  // ── Hijerarhija — data classification ────────────────────────────────────
  {
    id: 'wollet-data-classification',
    tip: 'hijerarhija',
    naslov: '🗂️ Data classification',
    redosled: 7,
    podaci: {
      nivoi: [
        { naziv: 'SECRET', ikona: '🔴', deca: wolletDataClassification.secret },
        { naziv: 'RESTRICTED', ikona: '🟠', deca: wolletDataClassification.restricted },
        { naziv: 'INTERNAL', ikona: '🔵', deca: wolletDataClassification.internal },
        { naziv: 'PUBLIC', ikona: '🟢', deca: wolletDataClassification.public },
      ],
    },
  },

  // ── Blockchain baner ──────────────────────────────────────────────────────
  {
    id: 'wollet-blockchain-baner',
    tip: 'baner',
    naslov: '🔗 Polygon Blockchain — Javna verifikacija',
    redosled: 8,
    podaci: {
      bedz: '🔗 BLOCKCHAIN VERIFIKOVANO',
      opis: `AIIQWorldBank.sol je deployovan na Polygon (chainId: ${POLYGON_CONFIG.mainnet.chainId}). Svaka transakcija ima blockchain hash proverljiv na ${POLYGON_CONFIG.mainnet.explorerUrl}. Nijedna transakcija ne može biti izbrisana ili izmenjena.`,
      dugme: { tekst: '🔍 Otvori Polygonscan', href: POLYGON_CONFIG.mainnet.explorerUrl },
    },
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  {
    id: 'wollet-cta',
    tip: 'cta',
    naslov: '🚀 AI IQ World Bank Wollet',
    redosled: 9,
    podaci: {
      opis: 'Poslovni novčanik sa blockchain verifikacijom, multi-valutnim računima i punom NBS/AML/SEPA usklađenošću.',
      stavke: [
        { naziv: 'Transakcije', vrednost: `${ISTORIJSKE_NABAVKE.length}`, ikona: '📋' },
        { naziv: 'Ukupno', vrednost: `$${ukupnoUsdDisplay}`, ikona: '💰' },
        { naziv: 'Blockchain', vrednost: 'Polygon', ikona: '🔗' },
        { naziv: 'Status', vrednost: '✅ Aktivan', ikona: '✅' },
      ],
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
        { tekst: 'Pametni Ugovori', href: '/pametni-ugovori', stil: 'sekundarno' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
