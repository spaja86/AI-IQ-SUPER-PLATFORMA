/**
 * Ownership Transition Runbook
 *
 * Formalni runbook za tranziciju GitHub ownership modela:
 *   spaja86_model → github_org_priprema → github_org_transfer → enterprise_governance
 *
 * Sadrži:
 * - Faze tranzicije sa pre-uslovima i rollback planom
 * - Go/no-go checklist po fazi
 * - Uloge (owner, billing, backup admin, security)
 * - Vercel i domain impact po fazi
 */

import { APP_VERSION, BASE_URL, OWNER_EMAIL, OWNER_GITHUB, OWNER_IME } from './constants';

// ─── Tipovi ────────────────────────────────────────────────

export type OwnershipFaza =
  | 'spaja86_model'
  | 'github_org_priprema'
  | 'github_org_transfer'
  | 'enterprise_governance';

export type GoNoGoStatus = 'go' | 'no_go' | 'nije_provereno';

export interface GoNoGoKriterijum {
  id: string;
  naziv: string;
  opis: string;
  status: GoNoGoStatus;
  envSignal: string | null;
  blokiranjeAkoNije: boolean;
  odgovornaOsoba: string;
}

export interface OwnershipUloga {
  naziv: string;
  identitet: string;
  odgovornosti: string[];
}

export interface OwnershipFazaDetalji {
  id: OwnershipFaza;
  naziv: string;
  opis: string;
  preUslovi: string[];
  aktivnosti: string[];
  goNoGoKriterijumi: GoNoGoKriterijum[];
  uloge: OwnershipUloga[];
  vercelImpact: string;
  domainImpact: string;
  rollbackPlan: string[];
  trajanje: string;
}

// ─── Env helper ──────────────────────────────────────────

function envFlag(name: string): boolean {
  return /^(1|true|yes|ok|ready|active|done|signed|confirmed|go)$/i.test(
    process.env[name] ?? '',
  );
}

function goNoGoFromEnv(envSignal: string | null): GoNoGoStatus {
  if (!envSignal) return 'nije_provereno';
  if (envFlag(envSignal)) return 'go';
  return 'no_go';
}

// ─── Runbook faze ─────────────────────────────────────────

export function getOwnershipRunbook(): OwnershipFazaDetalji[] {
  return [
    {
      id: 'spaja86_model',
      naziv: 'Faza 0 — Trenutni model (spaja86)',
      opis:
        'Repozitorijum AI-IQ-SUPER-PLATFORMA je pod spaja86 GitHub nalogom. ' +
        'Vercel je vezan za spaja86. Ovo je stabilan model dok nema OpenAI acceptance.',
      preUslovi: ['Nema — ovo je trenutno stanje'],
      aktivnosti: [
        'Operativni nalog spaja86 je aktivan i vlasnik svega',
        'Vercel deployment je aktivan na spaja86 projektu',
        'GitHub Actions runner je konfigurisan za spaja86',
        'Sve secret varijable su pod spaja86 Vercel/GitHub settings',
      ],
      goNoGoKriterijumi: [
        {
          id: 'spaja86-00',
          naziv: 'Owner nalog aktivan',
          opis: 'spaja86 GitHub nalog je aktivan i ima pristup svim repo settings',
          status: envFlag('SPAJA_GITHUB_OWNER_CONFIRMED') ? 'go' : 'nije_provereno',
          envSignal: 'SPAJA_GITHUB_OWNER_CONFIRMED',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'spaja86-01',
          naziv: 'Vercel deployment stabilan',
          opis: 'Vercel Git integracija je aktivna i deployevi su uspešni',
          status: 'go',
          envSignal: null,
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'spaja86-02',
          naziv: 'Backup admin definisan',
          opis: 'Postoji backup admin osoba koja može preuzeti kontrolu u emergenciji',
          status: envFlag('SPAJA_BACKUP_ADMIN_CONFIRMED') ? 'go' : 'no_go',
          envSignal: 'SPAJA_BACKUP_ADMIN_CONFIRMED',
          blokiranjeAkoNije: false,
          odgovornaOsoba: OWNER_IME,
        },
      ],
      uloge: [
        {
          naziv: 'Primarni Owner',
          identitet: `${OWNER_IME} (${OWNER_EMAIL}) — github.com/${OWNER_GITHUB}`,
          odgovornosti: ['Sve GitHub repo akcije', 'Vercel billing i deployment', 'Secret management'],
        },
        {
          naziv: 'Security kontakt',
          identitet: 'security@kompanija-spaja.rs',
          odgovornosti: ['Secrets audit', 'Pristup review', 'Incident response'],
        },
      ],
      vercelImpact: 'Nema promene — Vercel ostaje vezan za spaja86.',
      domainImpact: `Nema promene — ${BASE_URL} ostaje na spaja86 Vercel projektu.`,
      rollbackPlan: ['Nema potrebe za rollback-om — ovo je polazna tačka.'],
      trajanje: 'Trenutno stanje — bez vremenskog limita dok OpenAI ne prihvati.',
    },
    {
      id: 'github_org_priprema',
      naziv: 'Faza 1 — GitHub Org priprema',
      opis:
        'Kreirati GitHub organizaciju za Kompanija SPAJA / Digitalnu Industriju. ' +
        'Invitovati spaja86 kao Owner. Podešavati billing, team strukturu i security policy. ' +
        'Repozitorijum ostaje pod spaja86 dok se ne završi verifikacija.',
      preUslovi: [
        'OpenAI Enterprise zahtev je poslat (poslato stanje)',
        'spaja86 GitHub nalog je verified i active',
        'Billing metoda je potvrđena za GitHub org plan',
        'Backup admin je definisan i confirman',
      ],
      aktivnosti: [
        'Kreirati GitHub organizaciju (npr. kompanija-spaja ili digitalna-industrija)',
        'Invitovati spaja86 kao Organization Owner',
        'Definisati team strukturu: Admins, Developers, Security',
        'Podesiti organization security policy: 2FA required, SSO prep, SAML plan',
        'Aktivirati GitHub Advanced Security za organizaciju',
        'Podesiti billing na organizaciji (ne prenositi billing sa spaja86 pre negotiation)',
        'Kreirati fork ili staging repo unutar org za testove',
        'Pripremiti Vercel team setup (team billing, projektne invite)',
      ],
      goNoGoKriterijumi: [
        {
          id: 'org-prep-01',
          naziv: 'OpenAI request poslan',
          opis: 'SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED = true',
          status: goNoGoFromEnv('SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED'),
          envSignal: 'SPAJA_OPENAI_ENTERPRISE_REQUEST_SUBMITTED',
          blokiranjeAkoNije: false,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'org-prep-02',
          naziv: 'Backup admin confirmed',
          opis: 'Postoji najmanje jedna osoba sa backup Owner pristupom',
          status: goNoGoFromEnv('SPAJA_BACKUP_ADMIN_CONFIRMED'),
          envSignal: 'SPAJA_BACKUP_ADMIN_CONFIRMED',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'org-prep-03',
          naziv: 'GitHub org kreirana',
          opis: 'GitHub organizacija je kreirana i spaja86 je Owner',
          status: goNoGoFromEnv('SPAJA_GITHUB_ORG_CREATED'),
          envSignal: 'SPAJA_GITHUB_ORG_CREATED',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'org-prep-04',
          naziv: 'Billing potvrđen na org',
          opis: 'Billing metoda je aktivna na GitHub organizaciji',
          status: goNoGoFromEnv('SPAJA_GITHUB_ORG_BILLING_CONFIRMED'),
          envSignal: 'SPAJA_GITHUB_ORG_BILLING_CONFIRMED',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'org-prep-05',
          naziv: 'Security audit završen',
          opis: 'Sve secrets su prenesene/replicirane bez izlaganja',
          status: goNoGoFromEnv('SPAJA_SECURITY_AUDIT_DONE'),
          envSignal: 'SPAJA_SECURITY_AUDIT_DONE',
          blokiranjeAkoNije: true,
          odgovornaOsoba: 'Security kontakt',
        },
      ],
      uloge: [
        {
          naziv: 'Organization Owner',
          identitet: `${OWNER_IME} (${OWNER_GITHUB})`,
          odgovornosti: [
            'Kreiranje i upravljanje GitHub org',
            'Team invitacije',
            'Billing i security policy',
          ],
        },
        {
          naziv: 'Backup Admin',
          identitet: 'TBD — mora biti definisan pre transfera',
          odgovornosti: ['Emergency pristup', 'Fallback za ownership akcije'],
        },
        {
          naziv: 'Billing Owner',
          identitet: OWNER_EMAIL,
          odgovornosti: ['GitHub org plan i billing', 'Cost monitoring'],
        },
      ],
      vercelImpact:
        'Kreirati Vercel team za org (paralelno sa spaja86 projektom). ' +
        'NE brisati spaja86 projekat dok transfer nije kompletiran.',
      domainImpact: 'Nema promene domena u ovoj fazi — domain ostaje na spaja86 Vercel projektu.',
      rollbackPlan: [
        'Ukloniti repozitorijum iz org (nije premešten, samo forkan)',
        'Ostaviti org u standby stanju',
        'Nastaviti na spaja86 modelu bez prekida',
      ],
      trajanje: '1–2 nedelje (može biti paralelno sa OpenAI negotiation)',
    },
    {
      id: 'github_org_transfer',
      naziv: 'Faza 2 — GitHub Org Transfer',
      opis:
        'Prenesiti AI-IQ-SUPER-PLATFORMA repozitorijum na GitHub organizaciju. ' +
        'Ažurirati Vercel Git integraciju. Proveriti sve workflow-ove i secrets. ' +
        'Go/no-go gate MORA biti prošao pre ove faze.',
      preUslovi: [
        'Faza 1 (github_org_priprema) je kompletirana sa svim go kriterijumima',
        'Backup admin je aktivan i testiran',
        'Svi secrets su replicirani na org/Vercel team nivo',
        'Vercel team projekat je spreman',
        'Scheduled maintenance window je zakazan (minimum 30 min)',
      ],
      aktivnosti: [
        'GitHub repo Settings → Danger Zone → Transfer ownership → izabrati org',
        'Odmah po transferu: proveriti da su svi GitHub Actions workflow-ovi aktivni',
        'Promeniti Vercel Git integraciju sa spaja86 na org repozitorijum',
        'Ažurirati sve env varijable na Vercel team projektu',
        'Proveriti da su sve branch protection rules prenesene',
        'Testirati deployment na novom Vercel projektu pre brisanja starog',
        'Ažurirati README i AGENTS.md sa novim owner modelom',
        'Setovati SPAJA_GITHUB_ORG_TRANSFER_READY = done',
      ],
      goNoGoKriterijumi: [
        {
          id: 'transfer-01',
          naziv: 'Sve go/no-go iz Faze 1 prošle',
          opis: 'Svi blocking kriterijumi iz github_org_priprema su go',
          status: goNoGoFromEnv('SPAJA_GITHUB_ORG_PREP_COMPLETE'),
          envSignal: 'SPAJA_GITHUB_ORG_PREP_COMPLETE',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'transfer-02',
          naziv: 'Backup admin testiran',
          opis: 'Backup admin je uspešno pristupio test repo akcijama',
          status: goNoGoFromEnv('SPAJA_BACKUP_ADMIN_TESTED'),
          envSignal: 'SPAJA_BACKUP_ADMIN_TESTED',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'transfer-03',
          naziv: 'Vercel team projekat spreman',
          opis: 'Vercel team projekat je konfigurisan i test deployment je uspešan',
          status: goNoGoFromEnv('SPAJA_VERCEL_TEAM_READY'),
          envSignal: 'SPAJA_VERCEL_TEAM_READY',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'transfer-04',
          naziv: 'OpenAI acceptance ili formalni OK signal',
          opis: 'OpenAI je prihvatio ili je formalni interni OK dat za transfer',
          status: goNoGoFromEnv('SPAJA_GITHUB_ORG_TRANSFER_READY'),
          envSignal: 'SPAJA_GITHUB_ORG_TRANSFER_READY',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'transfer-05',
          naziv: 'Maintenance window zakazan',
          opis: 'Transfer se radi u zakazanom maintenance window-u (ne u peak saobraćaju)',
          status: 'nije_provereno',
          envSignal: null,
          blokiranjeAkoNije: false,
          odgovornaOsoba: OWNER_IME,
        },
      ],
      uloge: [
        {
          naziv: 'Transfer Executor',
          identitet: OWNER_IME,
          odgovornosti: [
            'Izvršavanje GitHub repo transfer akcije',
            'Ažuriranje Vercel integracije',
            'Post-transfer verifikacija',
          ],
        },
        {
          naziv: 'Backup Admin',
          identitet: 'TBD',
          odgovornosti: ['Monitoring tokom transfera', 'Emergency rollback ako zatreba'],
        },
      ],
      vercelImpact:
        'Kritičan uticaj: Vercel Git integracija mora biti ažurirana odmah po transferu. ' +
        'Stari spaja86 projekat ostaje aktivan dok novi ne bude testiran.',
      domainImpact:
        'Domain CNAME/DNS ostaje nepromenjen — menja se samo Vercel Git source. ' +
        'Downtime: praktično nula ako je novo deployment testiran pre DNS switch-a.',
      rollbackPlan: [
        'Ako transfer ne uspe: GitHub je atomic — ili prošao ili nije',
        'Ako je Vercel integracija ne radi: revertovati na spaja86 Vercel projekat (DNS/CNAME back)',
        'Ako GitHub Actions ne rade: privremeno prebaciti na spaja86 fork dok se ne reši',
        'Emergency kontakt: spaja86 GitHub support',
      ],
      trajanje: '2–4 sata (maintenance window)',
    },
    {
      id: 'enterprise_governance',
      naziv: 'Faza 3 — Enterprise Governance',
      opis:
        'Post-transfer enterprise governance aktivacija: GitHub Enterprise, Copilot Enterprise, ' +
        'SSO, Advanced Security, team roles, SAML, audit log.',
      preUslovi: [
        'Faza 2 (github_org_transfer) je kompletirana',
        'OpenAI Enterprise API je aktivan',
        'GitHub Enterprise plan je aktivan na organizaciji',
      ],
      aktivnosti: [
        'Aktivirati GitHub Enterprise (ako prihvaćeno od GitHub)',
        'Aktivirati Copilot Enterprise na org nivou',
        'Podesiti SAML SSO (opciono ali preporučeno)',
        'Aktivirati GitHub Advanced Security na svim repo-ovima',
        'Definisati CODEOWNERS i branch protection na org nivou',
        'Aktivirati audit log export za compliance',
        'Podesiti spending limits i billing alerts',
        'Ažurirati AGENTS.md sa novim enterprise governance modelom',
        'Dokumentovati novi ownership model u README i RUNBOOK',
      ],
      goNoGoKriterijumi: [
        {
          id: 'ent-gov-01',
          naziv: 'Transfer završen',
          opis: 'github_org_transfer faza je kompletirana sa svim go kriterijumima',
          status: goNoGoFromEnv('SPAJA_GITHUB_ORG_TRANSFER_DONE'),
          envSignal: 'SPAJA_GITHUB_ORG_TRANSFER_DONE',
          blokiranjeAkoNije: true,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'ent-gov-02',
          naziv: 'OpenAI Enterprise aktivan',
          opis: 'OPENAI_API_KEY sa enterprise dozvolama je aktivan',
          status: goNoGoFromEnv('SPAJA_OPENAI_ENTERPRISE_ACCEPTED'),
          envSignal: 'SPAJA_OPENAI_ENTERPRISE_ACCEPTED',
          blokiranjeAkoNije: false,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'ent-gov-03',
          naziv: 'GitHub Enterprise plan aktivan',
          opis: 'GitHub Enterprise Cloud je aktivan na organizaciji',
          status: goNoGoFromEnv('SPAJA_GITHUB_ENTERPRISE_ACTIVE'),
          envSignal: 'SPAJA_GITHUB_ENTERPRISE_ACTIVE',
          blokiranjeAkoNije: false,
          odgovornaOsoba: OWNER_IME,
        },
        {
          id: 'ent-gov-04',
          naziv: 'Audit log i compliance aktivan',
          opis: 'GitHub audit log export je konfigurisan i testiran',
          status: goNoGoFromEnv('SPAJA_GITHUB_AUDIT_LOG_ACTIVE'),
          envSignal: 'SPAJA_GITHUB_AUDIT_LOG_ACTIVE',
          blokiranjeAkoNije: false,
          odgovornaOsoba: 'Security kontakt',
        },
      ],
      uloge: [
        {
          naziv: 'Enterprise Org Owner',
          identitet: OWNER_IME,
          odgovornosti: ['Enterprise plan upravljanje', 'SSO i SAML', 'Copilot Enterprise'],
        },
        {
          naziv: 'Billing Owner',
          identitet: OWNER_EMAIL,
          odgovornosti: ['Enterprise billing', 'Spending limits', 'Invoice management'],
        },
        {
          naziv: 'Security Admin',
          identitet: 'security@kompanija-spaja.rs',
          odgovornosti: ['Advanced Security', 'Audit log', 'Vulnerability alerts'],
        },
      ],
      vercelImpact: 'Vercel Team plan je aktivan. Domain DNS ostaje nepromenjen.',
      domainImpact: 'Nema promene domena — enterprise governance je na platformskom, ne DNS nivou.',
      rollbackPlan: [
        'GitHub Enterprise se može downgrade-ovati na Team plan bez gubitka podataka',
        'Copilot Enterprise se može deaktivirati bez uticaja na kod',
        'SAML/SSO se može isključiti bez gubitka pristupa',
      ],
      trajanje: 'Trajno — kontinuirana governance aktivnost',
    },
  ];
}

// ─── Current faza ─────────────────────────────────────────

export function getCurrentOwnershipFaza(): OwnershipFaza {
  if (envFlag('SPAJA_GITHUB_ENTERPRISE_ACTIVE')) return 'enterprise_governance';
  if (envFlag('SPAJA_GITHUB_ORG_TRANSFER_DONE')) return 'enterprise_governance';
  if (envFlag('SPAJA_GITHUB_ORG_TRANSFER_READY')) return 'github_org_transfer';
  if (envFlag('SPAJA_GITHUB_ORG_CREATED')) return 'github_org_priprema';
  return 'spaja86_model';
}

// ─── Kompletni runbook status ─────────────────────────────

export function getOwnershipRunbookStatus() {
  const fazaId = getCurrentOwnershipFaza();
  const runbook = getOwnershipRunbook();
  const trenutnaFaza = runbook.find((f) => f.id === fazaId) ?? runbook[0];

  const sviFazaGoNoGo = trenutnaFaza.goNoGoKriterijumi.map((k) => ({
    ...k,
    status: k.envSignal ? goNoGoFromEnv(k.envSignal) : k.status,
  }));

  const blokiranihNema = sviFazaGoNoGo
    .filter((k) => k.blokiranjeAkoNije)
    .every((k) => k.status === 'go');

  return {
    naziv: 'Ownership Transition Runbook — Status',
    appVerzija: APP_VERSION,
    trenutnaFaza: fazaId,
    trenutnaFazaDetalji: {
      ...trenutnaFaza,
      goNoGoKriterijumi: sviFazaGoNoGo,
    },
    sveFaze: runbook.map((f) => ({ id: f.id, naziv: f.naziv })),
    goNoGoSummary: {
      blokiranihNema,
      ukupnoKriterijuma: sviFazaGoNoGo.length,
      goKriterijuma: sviFazaGoNoGo.filter((k) => k.status === 'go').length,
      noGoKriterijuma: sviFazaGoNoGo.filter((k) => k.status === 'no_go').length,
      nijeProvereno: sviFazaGoNoGo.filter((k) => k.status === 'nije_provereno').length,
    },
    spremanZaSledecuFazu: blokiranihNema,
  };
}
