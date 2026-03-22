# AI-IQ-SUPER-PLATFORMA 🚀

Centralni monorepo koji objedinjuje sve AI-IQ platforme na jednom mestu.

## 📁 Struktura projekta

```
AI-IQ-SUPER-PLATFORMA/
├── platforms/
│   ├── io-openui-ao/          ← IO OpenUI AO platforma
│   ├── world-bank/            ← Ai IQ World Bank
│   ├── menjacnica/            ← Ai IQ Menjačnica
│   └── kompanija-spaja/       ← Kompanija SPAJA
├── shared/                    ← Zajednički komponente i stilovi
│   ├── components/            ← Reusable UI komponente
│   └── styles/                ← Globalni CSS/stilovi
├── portal/                    ← Glavni ulazni portal (landing page)
└── README.md
```

## ✅ Prednosti monorepo pristupa

- **Nema merge konflikata između repoa** — sve je na jednom mestu
- **Jednostavno dodavanje novih platformi** — novi folder u `platforms/`
- **Zajednički dizajn/komponente** — dele se kroz `shared/`
- **Jedan deployment** — npr. Vercel monorepo ili GitHub Pages

## 🚀 Početak rada

### Instalacija svih zavisnosti

```bash
npm install
```

### Pokretanje portala

```bash
npm run dev --workspace=portal
```

### Pokretanje pojedinačne platforme

```bash
npm run dev --workspace=platforms/io-openui-ao
npm run dev --workspace=platforms/world-bank
npm run dev --workspace=platforms/menjacnica
npm run dev --workspace=platforms/kompanija-spaja
```

## 🏗️ Platforme

| Platforma | Opis | Folder |
|-----------|------|--------|
| IO OpenUI AO | Platforma za otvoreni UI | `platforms/io-openui-ao/` |
| Ai IQ World Bank | Svetska banka platforma | `platforms/world-bank/` |
| Ai IQ Menjačnica | Menjačnica platforma | `platforms/menjacnica/` |
| Kompanija SPAJA | Korporativna platforma | `platforms/kompanija-spaja/` |

## 📦 Tehnički stack

- **Framework:** HTML5 / CSS3 / JavaScript (vanilla, proširivo na React/Vue)
- **Monorepo:** npm workspaces
- **Deployment:** Vercel / GitHub Pages

---

*Platforma za spajanje ekstremno mnogo platformi koja u budućnosti treba da izraste u korporaciju ili je već korporacija.*
