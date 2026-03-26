# AI-IQ SUPER PLATFORMA

> **Kompanija SPAJA — Digitalna Industrija**  
> Platforma za spajanje ekstremno mnogo platformi koja u budućnosti treba da izraste u korporaciju ili je već korporacija.

## 🏭 Digitalna Industrija — Šta pravimo?

| Kategorija | Broj | Opis |
|---|---|---|
| 🧩 **Platforme** | 11 | Digitalne platforme za razne domene |
| 🏢 **Organizacije** | 7 | Divizije, timovi, laboratorije, fondacije |
| 🏛️ **Kompanije** | 6 | Parent, subsidiaries, startups, JVs |
| 📦 **Proizvodi** | 17 | IT proizvodi i alati |

## 🗺️ Rute

| Ruta | Opis |
|---|---|
| `/` | Početna — pregled Digitalne Industrije |
| `/dashboard` | Statistika i stanje ekosistema |
| `/industrija` | O digitalnoj industriji |
| `/platforme` | Sve platforme u ekosistemu |
| `/organizacije` | Organizaciona struktura |
| `/kompanije` | Kompanije u ekosistemu |
| `/proizvodi` | IT proizvodi i alati |
| `/ekosistem` | Celokupan pregled ekosistema |
| `/deploy` | Status deploy-a platformi |
| `/api/status` | API status ekosistema |
| `/api/health` | Health check |

## 🛠️ Tech Stack

- **Next.js 16** + TypeScript + Tailwind CSS 4
- Vercel deployment
- SEO: sitemap.xml, robots.txt
- Security: CSP, HSTS, X-Frame-Options

## 🚀 Pokretanje

```bash
npm install
npm run dev     # Development
npm run build   # Production build
npm run lint    # Lint
```

## 📁 Struktura

```
src/
├── app/
│   ├── page.tsx              # Početna
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Error handling
│   ├── not-found.tsx         # 404
│   ├── loading.tsx           # Loading state
│   ├── sitemap.ts            # SEO sitemap
│   ├── robots.ts             # SEO robots
│   ├── dashboard/page.tsx    # Dashboard
│   ├── industrija/page.tsx   # Industrija
│   ├── platforme/page.tsx    # Platforme
│   ├── organizacije/page.tsx # Organizacije
│   ├── kompanije/page.tsx    # Kompanije
│   ├── proizvodi/page.tsx    # Proizvodi
│   ├── ekosistem/page.tsx    # Ekosistem
│   ├── deploy/page.tsx       # Deploy
│   └── api/
│       ├── status/route.ts   # Status API
│       └── health/route.ts   # Health API
├── components/
│   ├── Navigation.tsx        # Navigacija
│   ├── Footer.tsx            # Footer
│   └── ui.tsx                # Shared UI components
└── lib/
    ├── types.ts              # Core type definitions
    ├── platforms.ts          # Platforme data
    ├── organizations.ts      # Organizacije data
    ├── companies.ts          # Kompanije data
    ├── products.ts           # Proizvodi data
    ├── industrija.ts         # Digitalna Industrija config
    └── navigation.ts         # Navigation config
```

## 📜 Verzija

**v3.0.0** — Kompletni skelet platforme sa Digitalnom Industrijom
