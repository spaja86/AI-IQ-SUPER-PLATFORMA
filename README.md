# AI-IQ-SUPER-PLATFORMA v6.0.0

> **Kompanija SPAJA** — Digitalna Industrija | **Omega Autonomna Evolucija**

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
| 🏗️ CI/CD | GitHub Actions push | Svaki push | Build + Lint + TypeCheck |
| 🔄 Auto-merge | GitHub Actions | Po završetku CI | Merge passing PR-ova |
| 📦 Zavisnosti | Dependabot | Dnevno | Update npm + Actions |
| 🔀 Branch sync | GitHub Actions cron | Dnevno u 03:00 | Sinhronizacija grana |
| 👁️ Zdravlje | Vercel Cron | Svakih 30min | Health monitoring |
| 🧬 Cron evolucija | Vercel Cron | Svakih 6h | Server-side evolucija |

### GitHub Actions Workflows

| Workflow | Fajl | Okidač |
|----------|------|--------|
| 🧬 Omega Evolucija | `omega-evolucija.yml` | Cron svakih 6h + manual |
| 🏗️ Omega Build | `omega-auto-build.yml` | Push + PR |
| 🔄 Omega Auto Merge | `omega-auto-merge.yml` | CI success |
| 🔀 Omega Branch Sync | `omega-branch-sync.yml` | Cron dnevno + manual |

### Vercel Cron Jobs

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

## Sadržaj

- 11 platformi u 6 kategorija
- 17 IT proizvoda u 8 kategorija
- 21 OMEGA AI persona u 8 oktavnih nivoa (dispatch + matrica + neuro)
- Auto-Popravka sistem (11 dijagnostičkih provera, repair engine, upgrade engine)
- Evolucioni motor (dijagnostika + preporuke + akcije)
- 14 stranica + 7 API ruta + sitemap + robots + skeleton loaders

## Rute

### Stranice
/, /dashboard, /industrija, /platforme, /it-proizvodi, /banka, /menjacnica, /kompanija, /ai-platforma, /organizacija, /deploy, /ekosistem, /omega-ai, /auto-popravka

### API
/api/status, /api/health, /api/auto-repair, /api/auto-repair/history, /api/omega-ai, /api/cron/evolucija, /api/cron/zdravlje

## Pokretanje

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment varijable (opcione)

```bash
CRON_SECRET=<tajni-kljuc>          # Za Vercel Cron autentifikaciju
GITHUB_TOKEN=<github-pat>          # Za automatsko kreiranje Issues
GITHUB_REPOSITORY=spaja86/AI-IQ-SUPER-PLATFORMA
```
