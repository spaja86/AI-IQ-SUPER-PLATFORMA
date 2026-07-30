# AGENTS

Ovo je dokument koji opisuje agente, njihove uloge i pravila korišćenja u ovom repozitorijumu za mega-platformu.

## Purpose / Svrha
- Define agent roles, responsibilities, and how they should be used in CI / automation.
- Koordinacija između više povezanih repozitorijuma (IO-OPENUI-AO, gaming calculator, itd.)
- Održavanje stabilnosti i sigurnosti kroz multi-repo sinhronizaciju.

## Agent Roles / Uloge Agenta

### human-review
- Zahteva ljudsku proveru pre merge-a.
- Komentiše na PR-u sa detaljnim povratnim informacijama.
- Odgovoran za quality assurance na svim kritičnim promenama.

### ci-bot
- Automatska provera i formatiranje (lint, tests).
- Proverava TypeScript, JavaScript, Python zavisnosti.
- Pokušava automatsku ispravku manjих problema (format, linting).
- **Multi-repo scope**: Pokreće testove u svim povezanim repozitorijumima.

### deploy-bot
- Obavlja deploy kada su testovi prošli.
- Ne može deploy-ovati bez green status od ci-bot-a.
- Ostavlja audit log u PR komentar.
- **Multi-repo scope**: Sinhronizuje deploymente između povezanih platformi.

### security-scanner
- **Role**: Automated security scanning (dependencies, secrets, SAST)
- **Scope**: Sva repozitorijuma u organizaciji i multi-repo linkovi
- **Trigger**: Na svakom PR-u, svakodnevni nightly scans
- **Actions**: 
  - Auto-label PRs sa `security:review-needed` ako ima kritičnog nalaza
  - Blokira merge ako je pronađena kritična ranjivost
  - Skenira za lozinke, tokene, sekrete u kodu
  - Proverava zavisnosti (npm audit, pip audit, cargo audit)
  - **Multi-repo check**: Skenira sve linkove između repozitorijuma

### multi-repo-sync-agent (NEW)
- **Role**: Sinhronizacija konfiguracije i status između povezanih repozitorijuma
- **Scope**: AI-IQ-SUPER-PLATFORMA ↔ IO-OPENUI-AO i drugi povezani repo-ji
- **Trigger**: Na Push-u na main branch, weekly sync, manual trigger
- **Actions**:
  - Proverava verzije zavisnosti koherencije
  - Sinhronizuje `.agent-config.json` između repozitorijuma
  - Ažurira README references i inter-repo links
  - Sinhronizuje labels, milestones, i project status
  - Ostavlja detailed audit log sa linkovima između PRs

### calculator-validator-agent (NEW)
- **Role**: Validacija logike gaming calculator-a (IO-OPENUI-AO)
- **Scope**: Samo IO-OPENUI-AO i calculator-specific branches
- **Trigger**: PR sa labelom `calculator:logic-change`, push na `calc-*` branches
- **Actions**:
  - Pokreće custom test suite za calculator logiku
  - Verifikuje matematičke rezultate i edge cases
  - Proverava performance (execution time < 100ms)
  - Skenira za nedoslednosti u kodu (NaN, Infinity, division by zero)
  - Auto-labels sa `calculator:validated` ili `calculator:needs-review`

### analytics-bot (NEW)
- **Role**: Tracking agent performance, metrics, i automation health
- **Scope**: Sva repozitorijuma, nema ograničenja
- **Trigger**: Nightly, weekly summary, on-demand
- **Actions**:
  - Broji number of automated reviews, deployments, security findings
  - Prati average PR review time
  - Generiše monthly reports u Issues ili Discussions
  - Identifikuje failing patterns (which tests fail most often)
  - Sinhronizuje metrics između repozitorijuma

## Rules / Pravila

1. **Audit Log** - Svaki agent mora ostaviti jasan audit log u commit poruci ili kao komentar na PR.
2. **Human Review** - Agenti nikada ne smeju merge-ovati promene bez najmanje jedne ljudske provere (osim za hotfix branch-e označene sa `auto-merge: allowed`).
3. **Security** - Agenti moraju poštovati sigurnosne varnice: 
   - Ne dodavati tajne u kod
   - Korišćenje Secrets Management (GitHub Secrets, Vault)
   - Nikada ne commitovati `.env` fajlove
4. **Config Changes** - Ako agent menja konfiguracione fajlove (npr. CI, deploy), mora označiti PR sa labelom `agent:config-change`.
5. **Security Scanning** - Security agents moraju skenirati za ranjivosti zavisnosti i označiti ih sa `security:needs-review`.
6. **Multi-Repo Sync** - Za multi-repo platforme (kao SUPER-PLATFORMA), agenti moraju sinhronizovati status između povezanih repozitorijuma.
7. **Custom Config** - Svi agenti moraju poštovati `.agent-config.json` fajlove u svakom repozitorijumu za custom ponašanje.
8. **Commit Sign-off** - Svi commits od strane agenta moraju biti potpisani (`git commit -S`).
9. **Cross-Repo Links** - Multi-repo agenti moraju održavati working linkove i references između PRs, Issues, i commits.
10. **Dependency Coherence** - Verzije zavisnosti moraju biti sinhronizovane gde je moguće (shared packages).

## How to Add a New Agent / Kako dodati novog agenta

1. Dodajte opis u ovaj fajl: ime, uloga, scope, webhook/identity, owner i kontakt.
2. Kreirajte `.github/workflows/` fajl za agenta.
3. Kreirajte `.agent-config.json` fajl sa custom podesavanjima.
4. Napravite PR koji dokumentuje ponašanje i dodajte test koji potvrđuje expected behavior.
5. Dobijte human-review pre merge-a.

## Registered Agents / Registrovani agenti

| Agent | Role | Trigger | Owner | Status | Scope |
|-------|------|---------|-------|--------|-------|
| ci-bot | Testing & Linting | PR, Push | @spaja86 | ✅ Active | All repos |
| human-review | Code Review | Manual | @spaja86 | ✅ Active | All repos |
| deploy-bot | Deployment | Merge to main | @spaja86 | ⏳ Planned | All repos |
| security-scanner | Security Scanning | PR, Nightly | @spaja86 | ✅ Active | All repos |
| multi-repo-sync-agent | Multi-Repo Sync | Push, Weekly | @spaja86 | 📋 Ready | SUPER-PLATFORMA ↔ IO-OPENUI-AO |
| calculator-validator-agent | Calculator Logic | PR, Branch | @spaja86 | 📋 Ready | IO-OPENUI-AO |
| analytics-bot | Metrics & Reports | Nightly, Weekly | @spaja86 | 📋 Ready | All repos |

## Agent Configuration Files / Konfiguracione Datoteke

Svaki repozitorijum može imati `.agent-config.json`:

```json
{
  "agents": {
    "ci-bot": {
      "enabled": true,
      "languages": ["typescript", "javascript"],
      "autoFix": true,
      "requireApproval": false
    },
    "multi-repo-sync-agent": {
      "enabled": true,
      "linkedRepos": ["spaja86/IO-OPENUI-AO"],
      "syncInterval": "weekly",
      "fields": ["versions", "labels", "milestones"]
    },
    "calculator-validator-agent": {
      "enabled": false,
      "performanceThreshold": 100,
      "testSuite": "calculator-tests"
    }
  }
}
```

## Contact / Kontakt

- **Owner**: IO-OPENUI-AO tim / SUPER-PLATFORMA team
- **Email**: team@spaja86.dev
- **GitHub**: [@spaja86](https://github.com/spaja86)
- **Repository Links**:
  - 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)
  - 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
- Ostavite kontakt ili questions u PR-u

---

# AGENTS (English)

This file describes agents, their roles, and usage rules for automation in this mega-platform repository.

## Purpose
- Define agent roles, responsibilities, and how they should be used in CI / automation.
- Coordinate between multiple linked repositories (IO-OPENUI-AO, gaming calculator, etc.)
- Maintain stability and security through multi-repo synchronization.

## Agent Roles

### human-review
- Requires a human reviewer before merge.
- Comments on PR with detailed feedback.
- Responsible for quality assurance on all critical changes.

### ci-bot
- Runs automated checks (lint, tests) and reports results.
- Validates TypeScript, JavaScript, Python dependencies.
- Attempts auto-fix for minor issues (formatting, linting).
- **Multi-repo scope**: Runs tests across all linked repositories.

### deploy-bot
- Handles deployments after passing checks.
- Cannot deploy without green status from ci-bot.
- Leaves audit log in PR comment.
- **Multi-repo scope**: Synchronizes deployments between linked platforms.

### security-scanner
- **Role**: Automated security scanning (dependencies, secrets, SAST)
- **Scope**: All repositories in the organization and multi-repo links
- **Trigger**: On every PR, nightly scans
- **Actions**:
  - Auto-label PRs with `security:review-needed` if critical findings
  - Blocks merge if critical vulnerability detected
  - Scans for passwords, tokens, secrets in code
  - Checks dependencies (npm audit, pip audit, cargo audit)
  - **Multi-repo check**: Scans all links between repositories

### multi-repo-sync-agent (NEW)
- **Role**: Synchronize configuration and status across linked repositories
- **Scope**: AI-IQ-SUPER-PLATFORMA ↔ IO-OPENUI-AO and other linked repos
- **Trigger**: Push to main branch, weekly sync, manual trigger
- **Actions**:
  - Validates dependency version coherence
  - Synchronizes `.agent-config.json` between repositories
  - Updates README references and inter-repo links
  - Synchronizes labels, milestones, and project status
  - Leaves detailed audit log with cross-repo PR links

### calculator-validator-agent (NEW)
- **Role**: Validate gaming calculator logic (IO-OPENUI-AO)
- **Scope**: IO-OPENUI-AO only and calculator-specific branches
- **Trigger**: PR with `calculator:logic-change` label, push to `calc-*` branches
- **Actions**:
  - Runs custom test suite for calculator logic
  - Verifies mathematical results and edge cases
  - Checks performance (execution time < 100ms)
  - Scans for code inconsistencies (NaN, Infinity, division by zero)
  - Auto-labels with `calculator:validated` or `calculator:needs-review`

### analytics-bot (NEW)
- **Role**: Track agent performance, metrics, and automation health
- **Scope**: All repositories, no restrictions
- **Trigger**: Nightly, weekly summary, on-demand
- **Actions**:
  - Counts automated reviews, deployments, security findings
  - Tracks average PR review time
  - Generates monthly reports in Issues or Discussions
  - Identifies failing patterns (which tests fail most often)
  - Synchronizes metrics across repositories

## Rules

1. **Audit Logs** - Agents must leave clear audit logs either in commit messages or PR comments.
2. **Human Review** - Agents must not merge changes without at least one human review (except branches marked `auto-merge: allowed`).
3. **Security** - Agents must not introduce secrets into the repo; use GitHub Secrets or a secret manager.
   - Never commit `.env` files
   - Use GitHub Secrets for sensitive data
4. **Config Changes** - Agents that modify configuration must label PRs with `agent:config-change`.
5. **Security Scanning** - Security agents must scan for vulnerable dependencies and flag them with `security:needs-review`.
6. **Multi-Repo Sync** - For multi-repo platforms (like SUPER-PLATFORMA), agents must sync status across all linked repos.
7. **Custom Config** - All agents must respect `.agent-config.json` files in each repo for custom behavior.
8. **Commit Sign-off** - All agent commits must be signed (`git commit -S`).
9. **Cross-Repo Links** - Multi-repo agents must maintain working links and references between PRs, Issues, and commits.
10. **Dependency Coherence** - Dependency versions must be synchronized where possible (shared packages).

## How to Add a New Agent

1. Add an entry here with name, role, scope, identity/webhook, owner and contact.
2. Create a `.github/workflows/` file for the agent.
3. Create a `.agent-config.json` file with custom settings.
4. Open a PR documenting behavior and add tests that validate expected behavior.
5. Get human-review before merging.

## Registered Agents

| Agent | Role | Trigger | Owner | Status | Scope |
|-------|------|---------|-------|--------|-------|
| ci-bot | Testing & Linting | PR, Push | @spaja86 | ✅ Active | All repos |
| human-review | Code Review | Manual | @spaja86 | ✅ Active | All repos |
| deploy-bot | Deployment | Merge to main | @spaja86 | ⏳ Planned | All repos |
| security-scanner | Security Scanning | PR, Nightly | @spaja86 | ✅ Active | All repos |
| multi-repo-sync-agent | Multi-Repo Sync | Push, Weekly | @spaja86 | 📋 Ready | SUPER-PLATFORMA ↔ IO-OPENUI-AO |
| calculator-validator-agent | Calculator Logic | PR, Branch | @spaja86 | 📋 Ready | IO-OPENUI-AO |
| analytics-bot | Metrics & Reports | Nightly, Weekly | @spaja86 | 📋 Ready | All repos |

## Agent Configuration Files

Each repository can have a `.agent-config.json`:

```json
{
  "agents": {
    "ci-bot": {
      "enabled": true,
      "languages": ["typescript", "javascript"],
      "autoFix": true,
      "requireApproval": false
    },
    "multi-repo-sync-agent": {
      "enabled": true,
      "linkedRepos": ["spaja86/IO-OPENUI-AO"],
      "syncInterval": "weekly",
      "fields": ["versions", "labels", "milestones"]
    },
    "calculator-validator-agent": {
      "enabled": false,
      "performanceThreshold": 100,
      "testSuite": "calculator-tests"
    }
  }
}
```

## Contact

- **Owner**: IO-OPENUI-AO team / SUPER-PLATFORMA team
- **Email**: team@spaja86.dev
- **GitHub**: [@spaja86](https://github.com/spaja86)
- **Repository Links**:
  - 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)
  - 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
- Leave feedback or questions in a PR
