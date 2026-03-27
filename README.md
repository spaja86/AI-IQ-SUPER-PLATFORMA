# AI-IQ-SUPER-PLATFORMA v5.3.0

> **Kompanija SPAJA** — Digitalna Industrija

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

## OMEGA AI Dispatch + Sinhronizacija

- 21 persona u 8 oktavnih nivoa
- Sekvencijalni dispatch: oktave se izvršavaju redom 1→8
- Elastična specijalizovana sinhronizacija: 5 faza po oktavi (skeleton → init → obrada → sync → završeno)
- Elastično tajmovanje: niže oktave imaju veći težinski faktor

## Sadrzaj

- 11 platformi u 6 kategorija
- 17 IT proizvoda u 8 kategorija
- 21 OMEGA AI persona u 8 oktavnih nivoa (sekvencijalni dispatch + elastična sinhronizacija)
- Auto-Popravka sistem (11 dijagnostickih provera, repair engine, upgrade engine)
- 14 stranica + 5 API ruta + sitemap + robots + skeleton loaders

## Rute

### Stranice
/, /dashboard, /industrija, /platforme, /it-proizvodi, /banka, /menjacnica, /kompanija, /ai-platforma, /organizacija, /deploy, /ekosistem, /omega-ai, /auto-popravka

### API
/api/status, /api/health, /api/auto-repair, /api/auto-repair/history, /api/omega-ai

## Pokretanje

```bash
npm install
npm run dev
npm run build
npm run lint
```
