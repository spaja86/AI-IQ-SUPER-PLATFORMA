import type { Sekvenca } from '@/lib/types';
import { walletComplianceRequirements, walletDataClassification, walletKpiBaseline } from '@/lib/wallet/compliance';
import { getWalletCoverageMatrix } from '@/lib/wallet/payment-orchestration';
import { getDigitalnaIndustrijaNacinPlacanjaPregled } from '@/lib/digitalna-industrija-nacini-placanja';
import { walletReleaseLanes } from '@/lib/wallet/mobile-release';

const diPregled = getDigitalnaIndustrijaNacinPlacanjaPregled();
const coverageMatrix = getWalletCoverageMatrix();

export const poslovniNovcanikSekvence: Sekvenca[] = [
  {
    id: 'wallet-hero',
    tip: 'hero',
    naslov: '💼 Poslovni Novčanik',
    podnaslov: 'Platformski wallet modul povezan sa AI IQ World Bank slojem',
    ikona: '💼',
    redosled: 1,
    podaci: {
      opis: 'Poslovni novčanik uvodi identitet, račune, kartice, plaćanja i evidencije u jedinstven domen. Tokenizacija je PCI-prihvatljiva, a fallback tokovi pokrivaju mrežne i regionalne izazove.',
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/banka' },
        { tekst: 'Generator za Poslovne Račune', href: '/generator-za-poslovne-racune', stil: 'sekundarno' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'wallet-obim',
    tip: 'lista',
    naslov: '📦 Domen i granice proizvoda',
    redosled: 2,
    podaci: {
      stavke: [
        { ikona: '🪪', naslov: 'Identitet', opis: 'KYC/KYB statusi, nivo pristupa i audit tragovi po korisniku/organizaciji.' },
        { ikona: '🏦', naslov: 'Računi', opis: 'Poslovni račun, valutne postavke i regionalna pokrivenost sa fallback procesorima.' },
        { ikona: '💳', naslov: 'Kartice', opis: 'Ručni unos + kamera tok sa obaveznom potvrdom korisnika pre tokenizacije.' },
        { ikona: '💸', naslov: 'Plaćanja', opis: 'Orkestracija po regionu, valuti i kartičnoj šemi uz fallback rute.' },
        { ikona: '📚', naslov: 'Evidencije', opis: 'KPI/SLO metrika, compliance status, incident runbook i revizijski zapis.' },
      ],
    },
  },
  {
    id: 'wallet-kpi',
    tip: 'statistika',
    naslov: '📊 Operativni KPI/SLO baseline',
    redosled: 3,
    podaci: {
      stavke: [
        { naziv: 'Auth success', vrednost: `${Math.round(walletKpiBaseline.authorizationSuccessRate * 1000) / 10}%`, ikona: '✅' },
        { naziv: 'Latencija', vrednost: `${walletKpiBaseline.avgAuthorizationLatencyMs}ms`, ikona: '⚡' },
        { naziv: 'False decline', vrednost: `${Math.round(walletKpiBaseline.falseDeclineRate * 1000) / 10}%`, ikona: '🎯' },
        { naziv: 'Fraud rate', vrednost: `${Math.round(walletKpiBaseline.fraudRate * 1000) / 10}%`, ikona: '🛡️' },
        { naziv: 'Uptime', vrednost: `${walletKpiBaseline.uptimePercent}%`, ikona: '📈' },
        { naziv: 'Release lane', vrednost: walletReleaseLanes.length, ikona: '🚀' },
      ],
    },
  },
  {
    id: 'wallet-regionalna-pokrivenost',
    tip: 'tabela',
    naslov: `🌍 Regionalna pokrivenost i fallback rutiranje (${diPregled.meta.entitet})`,
    redosled: 4,
    podaci: {
      zaglavlje: ['Region', 'Valute', 'Kartične šeme', 'Primarni procesori', 'Fallback'],
      redovi: coverageMatrix.map((row) => [
        row.region,
        row.currencies.join(', '),
        row.cardNetworks.join(', '),
        row.processors.join(', '),
        row.fallbackProcessors.join(', '),
      ]),
    },
  },
  {
    id: 'wallet-compliance',
    tip: 'kartice',
    naslov: '⚖️ Compliance i bezbednost',
    redosled: 5,
    podaci: {
      kartice: walletComplianceRequirements.map((item) => ({
        naslov: item.code,
        opis: `${item.title}. Scope: ${item.scope}`,
        ikona: item.status === 'implemented' ? '✅' : item.status === 'in_progress' ? '🛠️' : '📋',
        oznake: [item.status, item.scope],
      })),
    },
  },
  {
    id: 'wallet-release-lanes',
    tip: 'tabela',
    naslov: '📱 Android/iOS release lane-ovi',
    redosled: 6,
    podaci: {
      zaglavlje: ['Lane', 'Signing', 'Provisioning', 'Store track', 'Napomena'],
      redovi: walletReleaseLanes.map((lane) => [lane.lane, lane.signing, lane.provisioning, lane.storeTrack, lane.notes]),
    },
  },
  {
    id: 'wallet-data-classification',
    tip: 'hijerarhija',
    naslov: '🗂️ Data classification',
    redosled: 7,
    podaci: {
      nivoi: [
        { naziv: 'SECRET', ikona: '🔴', deca: walletDataClassification.secret },
        { naziv: 'RESTRICTED', ikona: '🟠', deca: walletDataClassification.restricted },
        { naziv: 'INTERNAL', ikona: '🔵', deca: walletDataClassification.internal },
        { naziv: 'PUBLIC', ikona: '🟢', deca: walletDataClassification.public },
      ],
    },
  },
  {
    id: 'wallet-cta',
    tip: 'cta',
    naslov: '🚀 Poslovni novčanik rollout',
    redosled: 8,
    podaci: {
      opis: 'M1→M5 roadmap je aktivan: domen + skeleton, kartični tokovi, kamera verifikacija, mobilna distribucija i globalna orkestracija.',
      dugmad: [
        { tekst: 'AI IQ World Bank', href: '/banka' },
        { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
      ],
    },
  },
];
