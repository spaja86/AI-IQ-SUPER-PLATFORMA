# AI-IQ-SUPER-PLATFORMA v6.3.1

> **Kompanija SPAJA** — Digitalna Industrija | **SpajaPro Prompt Engine** | **Omega Autonomna Evolucija** | **Proksi Mreža** | **SPAJA Mobilna** | **Eksterni Sajt Platformi**

## 🌟 SpajaPro Engine 6-15 — Zamena za ChatGPT

SpajaPro je AI engine Kompanije SPAJA sa **10 verzija (6-15)** koji potpuno zamenjuje ChatGPT u celom ekosistemu. Izvor: **Kompanija-SPAJA** repozitorijum.

### SpajaPro verzije

| Verzija | Kodno ime | Status | Mogućnosti | Max tokena |
|---------|-----------|--------|------------|------------|
| SpajaPro 6 | Temelj | ✅ Aktivna | Bazna Prompt obrada, tekst generisanje | 4K |
| SpajaPro 7 | Štit | ✅ Aktivna | Napredna zaštita, injection prevention | 8K |
| SpajaPro 8 | Analitik | ✅ Aktivna | Prediktivno modelovanje, analitika | 16K |
| SpajaPro 9 | Kreator | ✅ Aktivna | Multimodalni Prompt, kreacija | 32K |
| SpajaPro 10 | Orkestrator | ✅ Aktivna | Multi-agent dispatch, OMEGA AI | 64K |
| SpajaPro 11 | Proksi | 🧪 Beta | Proksi distribucija, egzotični signali | 128K |
| SpajaPro 12 | Mobilni | 🧪 Beta | Edge AI, offline keš, IoT | 64K |
| SpajaPro 13 | Evolucija | 🔨 Razvoj | Samo-evolucija, genetski algoritmi | 256K |
| SpajaPro 14 | Matriks | 🔨 Razvoj | 8×8 matrični dispatch, neurološka mreža | 512K |
| SpajaPro 15 | Omega | 📋 Planirana | Univerzalni kvantni procesor | 1M |

### Integracija: IO-OPENUI-AO

IO-OPENUI-AO repozitorijum koristi **SpajaPro engine umesto ChatGPT-a** za svu AI komunikaciju. SpajaPro Prompt Chat, AI modul sa Prompt-om, i SpajaPro 6-15 integracija.

## 📝 Prompt Sistem — Svuda u ekosistemu

Centralni Prompt sistem sa **28 Prompt-ova** u **10 kategorija**. Prompt je integrisana u svaki aspekt platforme:

- **21 persona Prompt-ova** — po jedan za svaku OMEGA AI personu
- **4 platforma Prompt-a** — IO-OPENUI-AO, Super Platforma, Proksi, Mobilna
- **3 sistemska Prompt-a** — inicijalizacija, zdravlje, evolucija
- **1 univerzalni Prompt** — SpajaPro 15 za sve sisteme

### Prompt kategorije

| Kategorija | Opis |
|-----------|------|
| sistemski | Inicijalizacija i upravljanje |
| persona | OMEGA AI persona Prompt-ovi |
| platforma | Platformski šabloni |
| analitika | Analiza i metrike |
| bezbednost | Bezbednosne provere |
| kreativni | Kreacija sadržaja |
| orkestracioni | Koordinacija i integracija |
| evolucioni | Autonomna evolucija |
| dijagnosticki | Dijagnostika i monitoring |
| univerzalni | Univerzalni Prompt |

## 🧬 Autonomna Evolucija — Večiti Rad

Platforma je dizajnirana da radi **potpuno autonomno**, bez ljudske intervencije.
Omega Evolucioni Motor neprestano dijagnostikuje, popravlja, i unapređuje sistem.

### Ciklus autonomne evolucije

```
┌─────────────────────────────────────────────────────────────────┐
│                   🧬 OMEGA EVOLUCIONI CIKLUS                     │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ 🩺 Dijag. │──▶│ 📋 Issue  │──▶│ 🤖 Agent │──▶│ 📦 PR    │     │
│  │ svakih 6h │   │ kreiranje│   │ rešava   │   │ + merge  │     │
│  └──────────┘   └──────────┘   └──────────┘   └─────┬────┘     │
│       ▲                                              │          │
│       │         ┌──────────┐   ┌──────────┐          │          │
│       └─────────│ 👁️ Monitor│◀──│ 🚀 Deploy│◀─────────┘          │
│                 │ svakih 30m│   │ Vercel   │                    │
│                 └──────────┘   └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### 4 sloja autonomije

| Sloj | Mehanizam | Interval | Opis |
|------|-----------|----------|------|
| 🧬 Evolucija | GitHub Actions cron | Svakih 6h | Dijagnostika + Issue kreiranje |
| 🏗️ CI/CD | GitHub Actions push | Svaki push | Lint + TypeCheck + Test quality gate |
| 🔄 Auto-merge | GitHub Actions | Po završetku CI | Merge passing PR-ova |
| 📦 Zavisnosti | Dependabot | Dnevno | Update npm + Actions |
| 🔀 Branch sync | GitHub Actions cron | Dnevno u 03:00 | Sinhronizacija grana |
| 👁️ Zdravlje | Scheduler (Vercel Cron / eksterni) | Svakih 30min | Health monitoring |
| 🧬 Cron evolucija | Scheduler (Vercel Cron / eksterni) | Svakih 6h | Server-side evolucija |

### GitHub Actions Workflows

| Workflow | Fajl | Okidač |
|----------|------|--------|
| 🧬 Omega Evolucija | `omega-evolucija.yml` | Cron svakih 6h + manual |
| 🏗️ Omega Build | `omega-auto-build.yml` | Push + PR |
| 🔄 Omega Auto Merge | `omega-auto-merge.yml` | CI success |
| 🔀 Omega Branch Sync | `omega-branch-sync.yml` | Cron dnevno + manual |
| 💸 FinOps Governance Gate | `finops-governance-gate.yml` | PR sa izmenama automacije/config-a |
| ▲ Vercel Deploy Hook | `vercel-deploy.yml` | Manual fallback (`workflow_dispatch`) |
| 🚀 Deploy Platforma | `deploy-platforma.yml` | Push na `src/lib/deploy/**`, `src/app/deploy-platforma/**` + manual |

### Cron Jobs (scheduler-agnostic)

| Endpoint | Interval | Opis |
|----------|----------|------|
| `/api/cron/evolucija` | Svakih 6h | Evolucioni ciklus + Issue kreiranje |
| `/api/cron/zdravlje` | Svakih 30min | Health check + OMEGA AI status |

## Arhitektura: Sekvence

Stranice se grade od tipiziranih sekvenci (`Sekvenca[]`), ne od hardkodiranih sekcija.

### 10 tipova sekvenci + Skeleton sistem

| Tip | Komponenta | Skeleton | Opis |
|-----|-----------|----------|------|
| hero | HeroSekvenca | HeroSkeleton | Hero baner |
| statistika | StatistikaSekvenca | StatistikaSkeleton | Grid statistika |
| progres | ProgresSekvenca | ProgresSkeleton | Progress bar |
| kartice | KarticeSekvenca | KarticeSkeleton | Grid kartica |
| tabela | TabelaSekvenca | TabelaSkeleton | Tabela podataka |
| cta | CTASekvenca | CTASkeleton | Call-to-action |
| baner | BanerSekvenca | BanerSkeleton | Promotivni baner |
| lista | ListaSekvenca | ListaSkeleton | Lista stavki |
| hijerarhija | HijerarhijaSekvenca | HijerarhijaSkeleton | Vizualizacija hijerarhije |
| tekst | TekstSekvenca | TekstSkeleton | Formatiran tekst |

### Objektno opredeljenje sekvence — TypeScript interfejsi

Sekvenca je definisana kao tipizirani objekat sa eksponziturom (izloženom strukturom) u armanalnom (harmoničnom) kodu:

```typescript
type SekvencaTip =
  | 'hero' | 'statistika' | 'progres' | 'kartice' | 'tabela'
  | 'cta' | 'baner' | 'lista' | 'hijerarhija' | 'tekst';

interface Sekvenca {
  id: string;                    // Jedinstveni identifikator sekvence
  tip: SekvencaTip;              // Tip komponente za renderovanje
  naslov?: string;               // Naslov sekcije
  podnaslov?: string;            // Podnaslov sekcije
  ikona?: string;                // Emoji ikona
  podaci: Record<string, unknown>; // Podaci specifični za tip komponente
  stil?: 'podrazumevani' | 'gradijent' | 'tamni' | 'svetli' | 'akcent';
  redosled: number;              // Redni broj za sortiranje
}

interface StranicaKonfiguracija {
  putanja: string;               // URL putanja stranice
  naslov: string;                // Naslov stranice
  opis: string;                  // Opis stranice
  sekvence: Sekvenca[];          // Niz sekvenci koje čine stranicu
}
```

### Eksponzitura sekvence — JSON obrazac objektnog opredeljenja

Ekvivalentni JSON obrazac za objektno opredeljenje sekvence:

```json
{
  "id": "pocetna-hero",
  "tip": "hero",
  "naslov": "Kompanija SPAJA",
  "podnaslov": "AI IQ SUPER PLATFORMA — Digitalna Industrija sa SpajaPro Prompt Engine-om",
  "ikona": "🏢",
  "redosled": 1,
  "podaci": {
    "opis": "Kompanija SPAJA upravlja celim digitalnim ekosistemom sa SpajaPro engine-om.",
    "dugmad": [
      { "tekst": "Industrija", "href": "/industrija" },
      { "tekst": "Dashboard", "href": "/dashboard" },
      { "tekst": "Prompt", "href": "/prompt", "stil": "sekundarno" },
      { "tekst": "SpajaPro", "href": "/spaja-pro", "stil": "sekundarno" }
    ]
  }
}
```

### Ekstenzija monologije sekvence — 18 straničnih modula

Svaka stranica je definisana kao `Sekvenca[]` niz u svom modulu:

| Modul | Eksport | Broj sekvenci |
|-------|---------|---------------|
| `pocetna.ts` | `pocetnaSekvence` | 7 |
| `dashboard.ts` | `dashboardSekvence` | — |
| `industrija.ts` | `industrijaSekvence` | — |
| `platforme-page.ts` | `platformeSekvence` | — |
| `it-proizvodi-page.ts` | `itProizvodiSekvence` | — |
| `banka-page.ts` | `bankaSekvence` | — |
| `menjacnica-page.ts` | `menjacnicaSekvence` | — |
| `kompanija-page.ts` | `kompanijaSekvence` | — |
| `ai-platforma-page.ts` | `aiPlatformaSekvence` | — |
| `organizacija-page.ts` | `organizacijaSekvence` | — |
| `deploy-page.ts` | `deploySekvence` | — |
| `ekosistem-page.ts` | `ekosistemSekvence` | — |
| `omega-ai-page.ts` | `omegaAISekvence` | — |
| `auto-popravka-page.ts` | `autoPopravkaSekvence` | — |
| `proksi-page.ts` | `proksiSekvence` | — |
| `mobilna-mreza-page.ts` | `mobilnaMrezaSekvence` | — |
| `prompt-page.ts` | `promptSekvence` | — |
| `spaja-pro-page.ts` | `spajaProSekvence` | — |

### Stranica = 3 linije koda

```tsx
import { StranicaRenderer } from '@/components/sekvence';
import { pocetnaSekvence } from '@/lib/sekvence/pocetna';
export default function Home() {
  return <StranicaRenderer sekvence={pocetnaSekvence} />;
}
```

### Skeleton mod

`StranicaRenderer` podržava `skeleton` prop za prikaz skeleton placeholder-a:

```tsx
<StranicaRenderer sekvence={sekvence} skeleton />
```

## OMEGA AI — Oktavni dispatch + Matrično jezgro + Neurološka mreža

- 21 persona u 8 oktavnih nivoa
- Sekvencijalni dispatch: oktave se izvršavaju redom 1→8
- Elastična specijalizovana sinhronizacija: 5 faza po oktavi (skeleton → init → obrada → sync → završeno)
- Matrično jezgro: 8×8 matrica sekvencionih odaziva (ekscitatorni, inhibitorni, modulatorni)
- Neurološka mreža: sinaptičke veze između persona (intra-oktavne, inter-oktavne, povratne)
- Povratna petlja: Evolucija (okt 8) ↔ Temelj (okt 1) — modulatorni odaziv

## 🧬 Evolucioni motor

- Automatska dijagnostika sistema
- Generisanje preporuka za poboljšanje
- Kreiranje GitHub Issues sa detaljnim instrukcijama
- Copilot agent automatski rešava issue-e
- Auto-merge za PR-ove koji prolaze CI
- Dnevni limit: max 5 issue-a po ciklusu

## 📡 PROKSI — Digitalni Proksi Sistem

Proksi je mrežni sloj Digitalne Industrije — ekscentrični simulator koncentričnog hipsoneuričnog signala prema plasiranim objektima sa WiFi antenama. Rezonance i amplitude se međusobno uvezuju u ekliptičnu vez koja razvija snagu signala od 10²²⁸ TB.

- 6 tipova signala: koncentrični, ekscentrični, ekliptični, rezonantni
- 5 čvorova: Jezgro, Finansijski, AI, Globalni, Alati
- Hibridna topologija sa auto-sinhronizacijom
- Kapacitet: 10²²⁸ TB po signalu
- Povezuje sve 11 platformi u jednu mrežu

## 📱 SPAJA Mobilna Mreža — 1873G

Mobilna komunikaciona mreža Digitalne Industrije — koristi Proksi infrastrukturu za prenos glasa, podataka i multimedije.

### 📶 Mobilni signalni sistem — 1873G Mreža

Ektracionalni akcelatorski signal krojen od matričnog jedinjenja kolocentričnog oktavnog sistema hiperboliše rezonancijske signale u amplitudne skokove izvornog oktava u simolarnim dejstvima dubokog skoka ka parkonasturionu u ktorinusu. Tako nastaje signal i tako se baca bez antena ka mobilnim brojevima sa signalima koji dobijaju kružni povrat od pozivnika 1 ka pozivniku 2 (to jest signal koji kruži između njih). Rezultat: **1873G mreža** (radi od 1G do 1873G).

- **Opseg**: 1G — 1873G
- **Bez antena**: Signal se baca direktno ka mobilnim brojevima
- **Kružni povrat**: Signal kruži između pozivnika 1 i pozivnika 2

### Mobilni signali

| Signal | Tip | Mehanizam |
|--------|-----|-----------|
| Ektracionalni Akcelatorski | ektracionalni | Matričnim jedinjenjem kolocentričnog oktavnog sistema |
| Rezonancijski Hiperbolični | rezonancijski | Simolarna dejstva dubokog skoka ka parkonasturionu |
| Amplitudni Skok Izvornog Oktava | amplitudni | Duboki skok ka parkonasturionu — bez antena |
| Kružni Povratni Signal | kružni | Kružni povrat od pozivnika 1 ka pozivniku 2 |

### Centrale i servisi

- Pozivni brojevi centrale: **+38177**, **+38188**, **+38178**, **+38187**
- 4 centrale: Primarna (jezgro), Sekundarna (finansije), Redundantna (AI), Globalna
- 5 servisa: Glas HD, Podaci Turbo, Stream, IoT Mesh, Enterprise Link
- Potpuna integracija sa Proksi hipsoneuričnim signalom
- Kapacitet: 10²²⁸ TB/s po centrali

## Sadržaj

- 12 platformi u 6 kategorija (IO-OPENUI-AO sa SpajaPro engine-om)
- 18 IT proizvoda u 8 kategorija (uključujući SpajaPro Prompt Engine)
- 21 OMEGA AI persona u 8 oktavnih nivoa — svaka sa SpajaPro Prompt-om
- SpajaPro engine: 10 verzija (6-15) — zamena za ChatGPT
- Prompt sistem: 28 Prompt-ova u 10 kategorija — Prompt je svuda
- STORY OF LIFE modul — narativ evolucije sa sekvencama i timeline prikazom
- Auto-Popravka sistem (11 dijagnostičkih provera, repair engine, upgrade engine)
- Evolucioni motor (dijagnostika + preporuke + akcije)
- Proksi mreža (6 signala, 5 čvorova, hibridna topologija)
- SPAJA Mobilna Mreža (4 centrale, 5 servisa, 4 mobilna signala, 1873G mreža, Proksi integracija)
- Eksterni sajt platformi — svaka platforma otvara Vercel domen u novom tabu
- 18 stranica + 9 API ruta + sitemap + robots + skeleton loaders

## 🌐 Eksterni Sajt Platformi — domeni platformi

Svaka platforma u Digitalnoj Industriji ima eksterni domen (provider može biti Vercel ili drugi hosting). Klikom na platformu na `/platforme` stranici, sajt platforme se otvara u **novom brauzer tabu** (`target="_blank"`).

### Domeni platformi

| Platforma | Domen |
|-----------|-------|
| AI IQ SUPER PLATFORMA | ai-iq-super-platforma.vercel.app |
| IO OPENUI AO — SpajaPro Engine | io-openui-ao.vercel.app |
| AI IQ Menjacnica | ai-iq-menja-nica-6cnf-git-copi-0e2b0a-nikolas-projects-b8a8458f.vercel.app |
| AI IQ World Bank | ai-iq-world-bank-git-copilot-n-697903-nikolas-projects-b8a8458f.vercel.app |
| SVETSKA ORGANIZACIJA | svetska-organizacija-git-copil-0ce22a-nikolas-projects-b8a8458f.vercel.app |
| OMEGA AI za GitHub | omega-ai-github.vercel.app |
| OMEGA AI za Vercel | omega-ai-vercel.vercel.app |
| OMEGA AI za Google | omega-ai-google.vercel.app |
| OMEGA AI 5 Persona | omega-ai-5-persona.vercel.app |
| SpajaPro Platforma | spajapro-platforma.vercel.app |
| Input/Output za Copilot | io-copilot.vercel.app |

### Implementacija — `eksterniLink` u sekvenci

`KarticeSekvenca` podržava `eksterniLink` za otvaranje eksternog sajta platforme u novom tabu:

```typescript
kartice: platforme.map((p) => ({
  naslov: p.naziv,
  opis: p.opis,
  ikona: p.ikona,
  progres: p.progres,
  oznake: [...p.tehnologije, p.status],
  eksterniLink: p.url,  // eksterni domen → otvara se u novom tabu
}))
```

## Rute

### Stranice
/, /dashboard, /industrija, /platforme, /it-proizvodi, /banka, /menjacnica, /kompanija, /ai-platforma, /organizacija, /deploy, /ekosistem, /omega-ai, /prompt, /spaja-pro, /story-of-life, /auto-popravka, /proksi, /mobilna-mreza

### API
/api/status, /api/health, /api/auto-repair, /api/auto-repair/history, /api/omega-ai, /api/prompt, /api/spaja-pro, /api/story-of-life, /api/cron/evolucija, /api/cron/zdravlje

## Pokretanje

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment varijable (opcione)

```bash
CRON_SECRET=<tajni-kljuc>          # Za cron autentifikaciju (Bearer ili x-cron-secret)
GITHUB_TOKEN=<github-pat>          # Za automatsko kreiranje Issues
GITHUB_REPOSITORY=spaja86/AI-IQ-SUPER-PLATFORMA
SPAJA_BAZA_INDEX_MAX_RETRIES=5     # Max retry pokušaja za failed chunk-ove pri indeksiranju
SPAJA_BAZA_INDEX_RETRY_BACKOFF_MS=60000 # Backoff između retry pokušaja (ms)
```

## 🤖 Automation & Agent Notice — For All Contributors

> **Applies to**: all contributors across `AI-IQ-SUPER-PLATFORMA` and linked repositories (`IO-OPENUI-AO`, etc.)

This repository uses documented automation agents for CI, security, analytics, and multi-repo coordination.
**Read [`AGENTS.md`](./AGENTS.md) before making workflow, configuration, deployment, or cross-repository changes.**

### Active agents

| Agent | Status | What it does |
|-------|--------|-------------|
| `ci-bot` | ✅ Active | Runs the shared quality gate surfaces for lint, tests, smoke, and predeploy validation |
| `human-review` | ✅ Active | Required code review before merge |
| `security-scanner` | ✅ Active | Runs CodeQL, dependency review, npm audit, and secret heuristics |
| `multi-repo-sync-agent` | 📋 Ready | Uses the documented cross-repo sync process for `IO-OPENUI-AO` |
| `analytics-bot` | 📋 Ready | KPI and automation health reporting are defined in config/docs |
| `deploy-bot` | ⏳ Planned | Deployment after green CI |

### Open-code deploy operating model

- **Public in this repository** — application code, documentation, workflow definitions, agent policies, and PR process stay reviewable in Git.
- **Linked-repo process** — changes that affect `spaja86/IO-OPENUI-AO` must be recorded in the PR under **Cross-repo impact** and tracked through [`docs/MULTI-REPO-LINKS.md`](./docs/MULTI-REPO-LINKS.md).
- **Operational controls** — deploy hooks, environment-specific credentials, API keys, wallets, and all secrets stay outside the repo in GitHub Secrets, Vercel secrets, or equivalent secret-management systems.
- **Runtime split** — Vercel remains the runtime for frontend/SSR and lightweight APIs, worker/container compute is the target for heavy or long-running jobs, and GitHub Actions remains the governance and audit layer.
- **XP cadence** — short iterations, continuous integration on each PR/push, test-first work on risky changes, small/frequent releases, required human review, and shared ownership through source-of-truth docs.

### Contributor expectations

- **Flow is issue → PR → review → release** — open or link an issue, ship the smallest safe PR, request review, then release only after gates are green.
- **Human review is required before merge** (except `hotfix/*` branches tagged `auto-merge: allowed`).
- **Never commit secrets** — no `.env` files, tokens, API keys, or credentials. Use GitHub Secrets.
- **Quality gates must be green** — run the relevant `lint`, `test`, `test:smoke`, and `predeploy:check` commands before opening a PR; `build` remains part of the documented release gate and should be verified when the touched surface supports it.
- **Config/CI changes** — PRs that modify `.github/workflows/`, `.agent-config.json`, or deployment config must be labeled `agent:config-change`.
- **Security-sensitive changes** — PRs touching auth, payments, or dependencies are automatically flagged; add a security approver.
- **Cross-repo changes** — if your change affects `IO-OPENUI-AO` or other linked repositories, describe the cross-repo impact in the PR and open any follow-up work there.
- **Deploy changes require audit evidence** — PRs affecting deploy, workflow, or config surfaces must include rollout, rollback, KPI impact, and downstream follow-up references.
- **OKRID linkage is required on high-impact changes** — use `OKRID-YYYY-TRACK-###` in PRs for config/deploy/cross-repo/risky work and keep KPI status current.

### Repo readiness & roadmap

- **Roadmap:** [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- **Multi-repo coordination:** [`docs/MULTI-REPO-LINKS.md`](./docs/MULTI-REPO-LINKS.md)
- **OKRID standard:** [`docs/OKRID.md`](./docs/OKRID.md)
- **OKRID registry:** [`docs/OKRID-REGISTRY.md`](./docs/OKRID-REGISTRY.md)
- **Security operating model:** [`docs/SECURITY.md`](./docs/SECURITY.md)
- **Go-live and rollout:** [`docs/GO-LIVE.md`](./docs/GO-LIVE.md)
- **FinOps and KPI model:** [`docs/finops-enterprise-operating-model.md`](./docs/finops-enterprise-operating-model.md)
- **Deployment power-resolution model:** [`docs/DEPLOYMENT-POWER-RESOLUTION.md`](./docs/DEPLOYMENT-POWER-RESOLUTION.md)

### Copilot setup vs Codex user installs

- `.github/workflows/copilot-setup-steps.yml` is for deterministic, repo-scoped Copilot cloud agent bootstrap only.
- Codex marketplace installs such as `vercel/vercel-plugin` and Codex-specific skills are optional user-scoped tooling and require a working `codex` CLI on the target machine.
- In Copilot cloud agent runs, Codex-specific installs are skipped automatically when `codex` is unavailable instead of failing repository setup.

### CI troubleshooting — "Setup step failed (no output captured)" / `startup_failure`

When a workflow run shows **`startup_failure`** with **zero jobs created** (no step logs), the problem is **infrastructure- or policy-level** — it is NOT caused by workflow file content or code changes.

**Diagnostic checklist:**

| Step | Action |
|------|--------|
| 1 | Check [GitHub Status](https://githubstatus.com) for incidents |
| 2 | Repo → Settings → Actions → General — confirm Actions are **enabled** |
| 3 | Repo → Settings → Billing → Actions — check runner-minute quota |
| 4 | Check org-level Actions policy if the repo is inside an organization |
| 5 | Contact GitHub Support if all of the above look healthy |

**Key diagnostic signals:**
- A `startup_failure` run has **`"jobs": []`** (zero jobs) in the API response — this means GitHub never assigned a runner, so no step output will ever appear.
- If ALL workflows across the repo show `startup_failure` simultaneously (like `copilot-setup-steps`, `omega-auto-build`, `vercel-deploy`), this confirms a runner-availability or account-level issue rather than a per-workflow bug.
- The **🏥 CI Health Canary** workflow (`.github/workflows/ci-health.yml`) runs daily at 06:00 UTC as a sentinel — if it succeeds, runners are available; if it also shows `startup_failure`, the problem is confirmed infrastructure/policy.

**What will NOT fix `startup_failure`:**
- Updating action versions (e.g., `actions/checkout@v4` → `@v5`)
- Changing workflow YAML content
- Fixing TypeScript or lint errors

### Source of truth

| Document | Purpose |
|----------|---------|
| [`AGENTS.md`](./AGENTS.md) | Full agent policy, rules, and registry |
| [`.agent-config.json`](./.agent-config.json) | Per-repo operational agent settings and linked-repo rules |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Open-code contribution flow, XP expectations, and deploy review requirements |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Release roadmap, readiness model, and KPI ownership |
| [`docs/MULTI-REPO-LINKS.md`](./docs/MULTI-REPO-LINKS.md) | Cross-repo sync registry, label schema, and follow-up rules |
| [`docs/OKRID.md`](./docs/OKRID.md) | Canonical OKRID scope, naming, lifecycle, and governance model |
| [`docs/OKRID-REGISTRY.md`](./docs/OKRID-REGISTRY.md) | Active and archived OKRID source-of-truth registry |
| [`.github/pull_request_template.md`](./.github/pull_request_template.md) | PR checklist |
| [`docs/finops-enterprise-operating-model.md`](./docs/finops-enterprise-operating-model.md) | FinOps, KPI, enterprise collaboration model |
| [`docs/DEPLOYMENT-POWER-RESOLUTION.md`](./docs/DEPLOYMENT-POWER-RESOLUTION.md) | Deployment runtime split, SLO baseline, release/rollback policy |

### FinOps source of truth (GitHub + Vercel)

- **Deploy/build source of truth:** Vercel Git integration.
- **GitHub Actions source of truth:** quality gates + governance checks.
- Automation/config PR-ovi moraju imati cost impact i rollback plan sekciju u PR opisu.

## ☁️ Multi-provider napomena

- `deploy.provider` + `deploy.projectId` u platform metadata modelu su primarni način za označavanje hosting provajdera.
- `deploy.vercelProjekt` ostaje samo radi kompatibilnosti sa starijim podacima.
- Operativna spremnost je podeljena na:
  - `runtime-ready` (runtime env i kritični servisi),
  - `ops-ready` (operativni procesi),
  - `enterprise-in-progress` / `enterprise-ready` (procurement, bez blokiranja runtime-a).
- API kompatibilnost zadržava postojeće status vrednosti, a novi normalizovani signal koristi `READY` / `NOT_READY` kroz `readyState` i `normalizedReady`.
