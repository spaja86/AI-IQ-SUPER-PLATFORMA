# AI-IQ-SUPER-PLATFORMA v5.2.0

> **Kompanija SPAJA** — Digitalna Industrija

## Arhitektura: Sekvence

Stranice se grade od tipiziranih sekvenci (`Sekvenca[]`), ne od hardkodiranih sekcija.

### 10 tipova sekvenci

| Tip | Komponenta | Opis |
|-----|-----------|------|
| hero | HeroSekvenca | Hero baner |
| statistika | StatistikaSekvenca | Grid statistika |
| progres | ProgresSekvenca | Progress bar |
| kartice | KarticeSekvenca | Grid kartica |
| tabela | TabelaSekvenca | Tabela podataka |
| cta | CTASekvenca | Call-to-action |
| baner | BanerSekvenca | Promotivni baner |
| lista | ListaSekvenca | Lista stavki |
| hijerarhija | HijerarhijaSekvenca | Vizualizacija hijerarhije |
| tekst | TekstSekvenca | Formatiran tekst |

### Stranica = 3 linije koda

```tsx
import { StranicaRenderer } from '@/components/sekvence';
import { pocetnaSekvence } from '@/lib/sekvence/pocetna';
export default function Home() {
  return <StranicaRenderer sekvence={pocetnaSekvence} />;
}
```

## Sadrzaj

- 11 platformi u 6 kategorija
- 17 IT proizvoda u 8 kategorija
- 21 OMEGA AI persona u 8 oktavnih nivoa (sekvencijalni dispatch)
- Auto-Popravka sistem (11 dijagnostickih provera, repair engine, upgrade engine)
- 14 stranica + 5 API ruta + sitemap + robots

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
