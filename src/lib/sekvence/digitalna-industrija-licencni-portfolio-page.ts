import type { Sekvenca } from '@/lib/types';
import {
  buildDigitalnaIndustrijaLicencniPortfolio,
  getLicencniPortfolioBlokatori,
} from '@/lib/digitalna-industrija-licencni-portfolio';

const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();
const blokatori = getLicencniPortfolioBlokatori();
const { summary } = portfolio;

export const digitalnaIndustrijaLicencniPortfolioSekvence: Sekvenca[] = [
  {
    id: 'di-licencni-portfolio-hero',
    tip: 'hero',
    naslov: '📋 Licencni Portfolio — Digitalna Industrija',
    podnaslov: 'Centralni 4-nivoski registar svih licenci za legalan rad Digitalne Industrije i svega na njoj',
    ikona: '📋',
    redosled: 1,
    podaci: {
      opis:
        `Jedinstven pregled za tržište Srbije: regulatorne, softverske, operativne i enterprise-ugovor licence ` +
        `za sve entitete i platforme Digitalne Industrije. ` +
        `Ukupno ${summary.ukupno} licenci — budžet ${summary.ukupniBudzetRSD.toLocaleString('sr-Latn')} RSD. ` +
        `Verifikovano: ${summary.verifikovano} / ${summary.ukupno} (${summary.procenatZavrsenih}%).`,
      dugmad: [
        { tekst: 'Portfolio API', href: '/api/digitalna-industrija-licencni-portfolio' },
        { tekst: 'Procurement Queue', href: '/api/digitalna-industrija-licencni-procurement-queue', stil: 'sekundarno' },
        { tekst: 'Vendor Status', href: '/api/digitalna-industrija-licencni-vendor-status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'di-licencni-portfolio-kpi',
    tip: 'statistika',
    naslov: '📊 KPI — Licencni portfolio',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Ukupno licenci', vrednost: summary.ukupno, ikona: '📄' },
        { naziv: 'Verifikovano', vrednost: summary.verifikovano, ikona: '✅' },
        { naziv: 'Završenost (%)', vrednost: `${summary.procenatZavrsenih}%`, ikona: '🎯' },
        { naziv: 'Blokira legalan rad', vrednost: summary.blokirajucihLegalanRad, ikona: '🚨' },
        { naziv: 'Blokira platforme', vrednost: summary.blokirajucihPlatforme, ikona: '⚠️' },
        { naziv: 'Budžet (RSD)', vrednost: summary.ukupniBudzetRSD.toLocaleString('sr-Latn'), ikona: '💰' },
      ],
    },
  },
  {
    id: 'di-licencni-portfolio-po-nivou',
    tip: 'statistika',
    naslov: '🏗️ Distribution po nivoima',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Matični subjekt', vrednost: summary.poNivou['maticni-subjekt'], ikona: '🏛️' },
        { naziv: 'Povezani entiteti', vrednost: summary.poNivou['povezani-entitet'], ikona: '🔗' },
        { naziv: 'Platforme/Assets', vrednost: summary.poNivou['platforma-asset'], ikona: '🧩' },
        { naziv: 'Vendor Enterprise', vrednost: summary.poNivou['vendor-enterprise'], ikona: '🤝' },
      ],
    },
  },
  {
    id: 'di-licencni-portfolio-blokatori',
    tip: 'kartice',
    naslov: '🚨 Šta blokira rad Digitalne Industrije — aktivni blokatori',
    redosled: 4,
    podaci: {
      kartice: blokatori.slice(0, 10).map((s) => ({
        naslov: `${s.entitet} — ${s.naziv}`,
        opis: `${s.napomena} (status: ${s.status}, rok: ${s.rok ?? 'n/a'}, budžet: ${s.budzetRSD.toLocaleString('sr-Latn')} RSD)`,
        ikona: s.blokator === 'blokira_legalan_rad' ? '🚨' : '⚠️',
        oznake: [s.blokator, s.obaveznost, s.tip, s.nivo],
      })),
    },
  },
  {
    id: 'di-licencni-portfolio-procurement-queue',
    tip: 'tabela',
    naslov: '🛒 Redosled nabavke — procurement queue',
    redosled: 5,
    podaci: {
      zaglavlje: ['Entitet', 'Licenca', 'Tip', 'Blokator', 'Status', 'Rok', 'Budžet (RSD)'],
      redovi: portfolio.procurementQueue.slice(0, 15).map((s) => [
        s.entitet,
        s.naziv,
        s.tip,
        s.blokator,
        s.status,
        s.rok ?? 'n/a',
        s.budzetRSD.toLocaleString('sr-Latn'),
      ]),
    },
  },
  {
    id: 'di-licencni-portfolio-vendor-enterprise',
    tip: 'kartice',
    naslov: '🤝 Vendor Enterprise — integrisani status',
    redosled: 6,
    podaci: {
      kartice: portfolio.vendorEnterpriseIntegrisan.map((v) => ({
        naslov: v.vendor,
        opis: `Enterprise zahtev: ${v.enterpriseZahtevStatus} | Portfolio status: ${v.portfolioStatus} | Usklađenost: ${v.uskladen ? '✅ DA' : '❌ NE'}`,
        ikona: v.uskladen ? '✅' : '🔄',
        oznake: [v.enterpriseZahtevStatus, v.portfolioStatus, v.uskladen ? 'uskladen' : 'neuskladen'],
      })),
    },
  },
  {
    id: 'di-licencni-portfolio-tabela',
    tip: 'tabela',
    naslov: '📋 Kompletan registar licenci',
    redosled: 7,
    podaci: {
      zaglavlje: ['Nivo', 'Entitet', 'Licenca', 'Tip', 'Obaveznost', 'Status', 'Blokator'],
      redovi: portfolio.stavke.map((s) => [
        s.nivo,
        s.entitet,
        s.naziv,
        s.tip,
        s.obaveznost,
        s.status,
        s.blokator,
      ]),
    },
  },
  {
    id: 'di-licencni-portfolio-cta',
    tip: 'cta',
    naslov: '🚀 Operativna aktivacija nabavke',
    redosled: 8,
    podaci: {
      opis:
        `Procurement queue sadrži ${portfolio.procurementQueue.length} licenci čekaju nabavku. ` +
        `Prioritet: ${blokatori.filter((s) => s.blokator === 'blokira_legalan_rad').length} kritičnih blokatora legalnog rada. ` +
        `Vendor enterprise usklađenost: ${portfolio.vendorEnterpriseIntegrisan.filter((v) => v.uskladen).length}/${portfolio.vendorEnterpriseIntegrisan.length}.`,
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
        { tekst: 'Licencna Analiza', href: '/ai-iq-world-bank-licencna-analiza', stil: 'sekundarno' },
        { tekst: 'Licencni Budžet', href: '/licencni-budzet-srbija', stil: 'sekundarno' },
        { tekst: 'Enterprise Ugovori', href: '/api/enterprise-ugovori', stil: 'sekundarno' },
      ],
    },
  },
];
