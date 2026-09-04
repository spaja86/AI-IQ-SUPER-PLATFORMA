# GIGATRON — IT & Elektronika Procurement 🛒

GIGATRON je integraciona tačka za IT/elektroniku procurement, affiliate/partner prodaju i B2B supply chain u okviru AI IQ SUPER PLATFORMA ekosistema.

Gigatron je najveći srpski elektronski maloprodajni lanac u regionu — integrisan kao B2B procurement i affiliate platforma za Kompanija SPAJA Digitalna Industrija.

Deo [AI-IQ SUPER PLATFORMA](../../README.md) repozitorijuma.

## Usluge

- 🔍 IT i elektronika katalog — pretraga, filtriranje, SKU upravljanje po kategorijama i brand-ovima
- 📦 B2B nabavka — narudžbine, dobavljači, ugovori, status praćenje
- 🤝 Affiliate / Partner program — provizije, tracking događaja, kumulativno praćenje
- 📊 Upravljanje zalihama — dostupnost u realnom vremenu, sync sa `it-proizvodi` rutom

## Platformske Integracije

- 🛒 **GIGATRON** — `platforms/gigatron/`
- 🏢 **Kompanija SPAJA** — `platforms/kompanija-spaja/`
- 🌍 **AI IQ World Bank** — `platforms/world-bank/`
- 💱 **AI IQ Menjačnica** — `platforms/menjacnica/`

## KPI Ciljevi

| KPI | Ciljna vrednost |
|---|---|
| API response (catalog/order) | ≤ 200ms |
| Catalog availability | 99.9% |
| Order processing success rate | ≥ 99% |
| Affiliate tracking accuracy | 100% |
| Build duration | ≤ 3 min |
| Security scan coverage | 100% |
| Feature flag rollout | 10% → 50% → 100% |

## API Endpoints

| Endpoint | Metoda | Opis |
|---|---|---|
| `/api/gigatron/health` | GET | Health check za CI smoke test |
| `/api/gigatron/catalog` | GET | Pretraga i filtriranje kataloga |
| `/api/gigatron/order` | POST | Kreiranje B2B narudžbine |
| `/api/gigatron/order/[id]` | GET | Status narudžbine |
| `/api/gigatron/affiliate/track` | POST | Affiliate event tracking |
| `/api/gigatron/inventory` | GET | Stanje zaliha u realnom vremenu |

## Stranice

| Stranica | URL | Opis |
|---|---|---|
| Landing | `/gigatron` | GIGATRON platforma landing |
| Katalog | `/gigatron/katalog` | Prikaz kataloga proizvoda |
| Nabavka | `/gigatron/nabavka` | B2B procurement forma |

## Pokretanje

### Statički HTML prikaz

Otvorite fajl direktno:

`platforms/gigatron/src/index.html`

ili kroz lokalni static server:

```bash
npm run dev
```

Otvorite: `http://localhost:3007`

## Bezbednost

- Svi API ključevi i kredencijali za spoljne GIGATRON servise ostaju u GitHub/Vercel Secrets
- Nikada ne commitovati `.env` fajlove ili auth tokene
- Sve promene prolaze `security-scanner` + `human-review` pre merge-a

## Cross-Repo Napomena

GIGATRON je repo-local surface — nema direktne downstream dependency u `IO-OPENUI-AO`.

Audit trail: `AI-IQ-SUPER-PLATFORMA#GIGATRON -> No linked repo change required`
