# GIGATRON — AI IQ SUPER PLATFORMA

**Verzija:** 1.0.0  
**Datum inicijacije:** 2026-08-02  
**Status:** 🚀 Aktivno u razvoju  
**Vlasnik:** Kompanija SPAJA — Digitalna Industrija  
**Owner:** @spaja86  
**Platforma verzija:** v42.36.0+

---

## Vizija

GIGATRON je integraciona tačka za IT/elektroniku procurement, affiliate/partner prodaju i B2B supply chain u okviru AI IQ SUPER PLATFORMA ekosistema.

Gigatron je najveći srpski elektronski maloprodajni lanac u regionu — integrisan kao B2B procurement i affiliate platforma za Kompanija SPAJA Digitalna Industrija, omogućavajući automatizovano naručivanje IT opreme, praćenje provizija i upravljanje zalihama u realnom vremenu.

---

## Principi Platforme

1. **B2B-first** — sva logika je optimizovana za poslovne narudžbine sa PDV kalkulacijom
2. **Affiliate transparency** — svaki partner event se beleži sa punim audit tragom
3. **Real-time inventory** — stanje zaliha se prati i ažurira pri svakoj rezervaciji
4. **API-first arhitektura** — sve funkcionalnosti su dostupne kroz REST API
5. **Security by default** — bez sekreta u kodu, svi ključevi u GitHub/Vercel Secrets
6. **Staged rollout** — feature flag 10% → 50% → 100% uz kontinuiranu validaciju

---

## Ciljevi i Merila Uspeha

| KPI | Ciljna vrednost |
|---|---|
| API response (catalog/order) | ≤ 200ms |
| Catalog availability | 99.9% |
| Order processing success rate | ≥ 99% |
| Affiliate tracking accuracy | 100% |
| Build duration | ≤ 3 min |
| Security scan coverage | 100% |
| Feature flag rollout | 10% → 50% → 100% |

---

## Obuhvat — Šta GIGATRON Modul Obuhvata

### Core Library (`src/lib/gigatron/`)

| Fajl | Opis |
|---|---|
| `gigatron-catalog.ts` | Katalog IT/elektronike — kategorije, brand-ovi, SKU, cene, dostupnost |
| `gigatron-procurement.ts` | B2B nabavni model — narudžbine, validacija, PDV, status lifecycle |
| `gigatron-affiliate.ts` | Affiliate program — tracking eventi, provizija kalkulator, statistike |
| `gigatron-inventory.ts` | Upravljanje zalihama — dostupnost, rezervacije, alerti |

### API Endpoints (`src/app/api/gigatron/`)

| Endpoint | Metoda | Opis |
|---|---|---|
| `/api/gigatron/health` | GET | Health check za CI smoke test |
| `/api/gigatron/catalog` | GET | Pretraga i filtriranje kataloga |
| `/api/gigatron/order` | POST | Kreiranje B2B narudžbine |
| `/api/gigatron/order/[id]` | GET | Status narudžbine po ID-u |
| `/api/gigatron/affiliate/track` | POST | Affiliate event tracking |
| `/api/gigatron/inventory` | GET | Stanje zaliha u realnom vremenu |

### UI Stranice (`src/app/gigatron/`)

| Stranica | URL | Opis |
|---|---|---|
| Landing | `/gigatron` | GIGATRON platforma landing |
| Katalog | `/gigatron/katalog` | Prikaz kataloga proizvoda |
| Nabavka | `/gigatron/nabavka` | B2B procurement forma |

### Platform Surface

- `platforms/gigatron/README.md` — dokumentacija platforme
- `platforms/gigatron/package.json` — lokalni manifest modula
- `platforms/gigatron/src/index.html` — statički HTML pregled

---

## Faze Implementacije

### Faza 1 — Platform Surface
- [x] `platforms/gigatron/README.md`
- [x] `platforms/gigatron/package.json`
- [x] `platforms/gigatron/src/index.html`
- [x] Registrovan u `platforms/kompanija-spaja/README.md`

### Faza 2 — Core Library i Domain Logic
- [x] `src/lib/gigatron/gigatron-catalog.ts`
- [x] `src/lib/gigatron/gigatron-procurement.ts`
- [x] `src/lib/gigatron/gigatron-affiliate.ts`
- [x] `src/lib/gigatron/gigatron-inventory.ts`

### Faza 3 — API Rute
- [x] `GET /api/gigatron/catalog`
- [x] `POST /api/gigatron/order`
- [x] `GET /api/gigatron/order/[id]`
- [x] `POST /api/gigatron/affiliate/track`
- [x] `GET /api/gigatron/inventory`
- [x] `GET /api/gigatron/health`

### Faza 4 — UI Stranice
- [x] `src/app/gigatron/page.tsx`
- [x] `src/app/gigatron/katalog/page.tsx`
- [x] `src/app/gigatron/nabavka/page.tsx`
- [x] `src/lib/sekvence/gigatron-page.ts`

### Faza 5 — Integracije i Konfiguracija
- [x] Feature flag `gigatron` (10% staged rollout)
- [x] Feature flag `gigatron-affiliate` (biznis/enterprise/unlimited planovi)
- [x] GIGATRON plan u `spaja-pro-planovi.ts`
- [x] GIGATRON u `.agent-config.json` — `gigatron-validator-agent` blok
- [x] GIGATRON u `ekslatacija-proizvoda.ts` kao source
- [x] GIGATRON link u `platforms/kompanija-spaja/README.md`

### Faza 6 — Automatizacija i Agenti
- [x] `.github/workflows/gigatron.yml`
- [x] `gigatron-validator-agent` u `AGENTS.md`
- [x] GIGATRON label schema u `docs/MULTI-REPO-LINKS.md`

### Faza 7 — Testovi
- [x] `src/tests/lib/gigatron-catalog.test.ts`
- [x] `src/tests/lib/gigatron-procurement.test.ts`
- [x] `src/tests/lib/gigatron-affiliate.test.ts`
- [x] GIGATRON testovi u `package.json` test script
- [x] GIGATRON u smoke test

### Faza 8 — Dokumentacija i Audit
- [x] `docs/GIGATRON.md` (ovaj fajl)
- [x] `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md` — governance za korporativnu pretplatu i uplatu velike vrednosti
- [x] GIGATRON Audit Trail u `docs/MULTI-REPO-LINKS.md`
- [x] CHANGELOG.md ažuriran

---

## Katalog Kategorije

| Kategorija | Opis |
|---|---|
| `laptopovi` | Poslovni i gaming laptopovi |
| `desktop-racunari` | Desktop računari i radne stanice |
| `mobilni-telefoni` | Pametni telefoni |
| `tableti` | Tableti i 2-u-1 uređaji |
| `monitori` | Monitori za poslovnu i gaming upotrebu |
| `stampaci` | Laserski i inkjet štampači, MFP |
| `mreza-i-komunikacije` | Ruteri, switch-evi, NAS |
| `komponente` | RAM, SSD, GPU, matične ploče |
| `periferni-uredjaji` | Miš, tastatura, veb kamere |
| `gaming-oprema` | Gaming periferni uređaji i laptopi |
| `kucni-uredjaji` | Kućanski aparati |
| `audio-video` | Audio i video oprema |
| `foto-video` | Fotoaparati i video oprema |

---

## Bezbednosni Zahtevi

- CodeQL coverage gate na svim `gigatron` putanjama u CI
- Security scanner aktivan na svakom PR koji dira GIGATRON fajlove
- Svi API ključevi i kredencijali za spoljne GIGATRON servise ostaju u GitHub/Vercel Secrets
- Nikada ne commitovati `.env` fajlove ili auth tokene
- Sve promene prolaze `security-scanner` + `human-review` pre merge-a

---

## Korporativna pretplata i uplata velike vrednosti

- Source of truth: `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md`
- Status za nevalidiran predmet ili nedokaziv iznos: `blocked-until-validated`
- Bez `payment-confirmed` statusa nema aktivacije enterprise pogodnosti ili B2B pretplate
- Za ekstremno veliku vrednost obavezni su pravni, poreski, compliance i upravljački approval koraci

---

## Cross-Repo Napomena

GIGATRON je repo-local surface u `spaja86/AI-IQ-SUPER-PLATFORMA`.

| This repo | Linked repo | Note |
|---|---|---|
| `AI-IQ-SUPER-PLATFORMA` — GIGATRON rollout | `spaja86/IO-OPENUI-AO` | No linked repo change required |

**Audit convention:**
```
AI-IQ-SUPER-PLATFORMA#GIGATRON -> No linked repo change required
```

---

## Kontakt i Vlasništvo

- **Agent:** `gigatron-validator-agent` (registrovan u `AGENTS.md`)
- **Owner:** Kompanija SPAJA / Digitalna Industrija
- **GitHub:** [@spaja86](https://github.com/spaja86)
- **Repozitorijumi:**
  - 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
  - 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)

---

*GIGATRON — AI IQ SUPER PLATFORMA v42.36.0+*  
*Kompanija SPAJA — Digitalna Industrija — Smederevo 11300 Srbija*
