import type { Sekvenca } from '@/lib/types';
import { getSpajaDrustvenaMrezaHealthReport, getSpajaDrustvenaMrezaPregled } from '@/lib/spaja-drustvena-mreza';

export function getSpajaDrustvenaMrezaSekvence(): Sekvenca[] {
  const pregled = getSpajaDrustvenaMrezaPregled();
  const health = getSpajaDrustvenaMrezaHealthReport();

  return [
    {
      id: 'spaja-drustvena-mreza-hero',
      tip: 'hero',
      naslov: '👥 SPAJA Društvena Mreža',
      podnaslov: 'Repo-local socijalna platforma za interne timove, partnere i javni community',
      ikona: '👥',
      redosled: 1,
      podaci: {
        opis: 'SPAJA Social uvodi profile, feed, grupe, poruke, događaje i notifikacioni readiness bez eksternih tajni i bez produkcionih kredencijala u Git-u.',
        dugmad: [
          { tekst: 'API pregled', href: '/api/spaja-drustvena-mreza/pregled' },
          { tekst: 'Health', href: '/api/spaja-drustvena-mreza/health', stil: 'sekundarno' },
          { tekst: 'Platforme', href: '/platforme', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'spaja-drustvena-mreza-scope',
      tip: 'kartice',
      naslov: '🎯 Proizvodni obuhvat',
      redosled: 2,
      podaci: {
        kartice: [
          { naslov: 'Interni korisnici', opis: pregled.productScope.internalUsers.join(', '), ikona: '🏢' },
          { naslov: 'Partneri', opis: pregled.productScope.partners.join(', '), ikona: '🤝' },
          { naslov: 'Javni korisnici', opis: pregled.productScope.publicUsers.join(', '), ikona: '🌐' },
        ],
      },
    },
    {
      id: 'spaja-drustvena-mreza-stats',
      tip: 'statistika',
      naslov: '📊 Trenutni readiness',
      redosled: 3,
      podaci: {
        stavke: [
          { naziv: 'Profili', vrednost: health.activeProfiles, ikona: '🪪' },
          { naziv: 'Objave', vrednost: health.feedPosts, ikona: '📝' },
          { naziv: 'Grupe', vrednost: health.groups, ikona: '👥' },
          { naziv: 'Poruke', vrednost: health.conversations, ikona: '💬' },
          { naziv: 'Događaji', vrednost: health.events, ikona: '📅' },
          { naziv: 'Status', vrednost: health.readinessStatus, ikona: '🟢' },
        ],
      },
    },
    {
      id: 'spaja-drustvena-mreza-capabilities',
      tip: 'lista',
      naslov: '🧩 Funkcionalni slojevi',
      redosled: 4,
      podaci: {
        stavke: pregled.capabilities.map((capability) => ({
          ikona: '✅',
          naslov: capability,
          opis: 'Repo-local i deterministički v1 sloj',
        })),
      },
    },
    {
      id: 'spaja-drustvena-mreza-rules',
      tip: 'tabela',
      naslov: '🛡️ Vidljivost i moderacija',
      redosled: 5,
      podaci: {
        kolone: ['Tip pravila', 'Detalj'],
        redovi: [
          ...pregled.visibilityRules.map((rule) => ['Vidljivost', rule]),
          ...pregled.moderationRules.map((rule) => ['Moderacija', rule]),
        ],
      },
    },
    {
      id: 'spaja-drustvena-mreza-kpi',
      tip: 'tabela',
      naslov: '📈 KPI i governance',
      redosled: 6,
      podaci: {
        kolone: ['KPI', 'Cilj'],
        redovi: pregled.kpis.map((kpi) => [kpi.name, kpi.target]),
      },
    },
    {
      id: 'spaja-drustvena-mreza-rollout',
      tip: 'lista',
      naslov: '🚀 Rollout i rollback',
      redosled: 7,
      podaci: {
        stavke: [
          ...pregled.rolloutPhases.map((phase) => ({ ikona: '➡️', naslov: phase, opis: 'Plan aktivacije' })),
          ...pregled.rollbackPlan.map((item) => ({ ikona: '↩️', naslov: item, opis: 'Fallback i oporavak' })),
        ],
      },
    },
    {
      id: 'spaja-drustvena-mreza-ban',
      tip: 'baner',
      naslov: '🔗 Multi-repo status',
      redosled: 8,
      podaci: {
        poruka: pregled.multiRepo.note,
        stil: 'info',
      },
    },
    {
      id: 'spaja-drustvena-mreza-cta',
      tip: 'cta',
      naslov: 'Otvori SPAJA Social surface',
      redosled: 9,
      podaci: {
        tekst: 'Koristi repo-local API-first sloj za profile, feed, grupe, poruke i događaje uz validator workflow i audit-ready dokumentaciju.',
        dugmad: [
          { tekst: 'Profiles API', href: '/api/spaja-drustvena-mreza/profiles' },
          { tekst: 'Feed API', href: '/api/spaja-drustvena-mreza/feed', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
