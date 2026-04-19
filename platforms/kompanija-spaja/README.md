# Kompanija SPAJA 🏢

Kompanija SPAJA je matična organizacija u okviru AI-IQ SUPER PLATFORMA ekosistema. Fokusirana je na razvoj poslovnih platformi, AI automatizaciju i sigurnu orkestraciju procesa.

Deo [AI-IQ SUPER PLATFORMA](../../README.md) repozitorijuma.

## Usluge

- AI konsulting i poslovna automatizacija
- Full-stack razvoj platformi (Next.js + TypeScript)
- Integracije eksternih sistema i API orkestracija
- Sigurnost, autentifikacija i audit log sistemi

## Platforme

- 🌍 **AI IQ World Bank** — `platforms/world-bank/`
- 💱 **AI IQ Menjačnica** — `platforms/menjacnica/`
- 🧪 **IO OpenUI AO** — `platforms/io-openui-ao/`
- 🏢 **Kompanija SPAJA** — `platforms/kompanija-spaja/`

## SpajaUltraOmegaCore

SpajaUltraOmegaCore je DSL sloj za kontrolisano izvršavanje komandi kroz parser, transpajler i runtime audit model.

Primer:

```txt
MOŽE: pristup_sistemu
ŽELIM: da pokrenem analizu
DO: ECHO Sistem se pokreće...
WAIT: 500
ASSERT: korisnik_ima_pravo == true
PRIV: user
```

## Pokretanje

### Next.js aplikacija

```bash
npm install
npm run dev
```

Otvorite: `http://localhost:3000`

### Standalone HTML prikaz Kompanija SPAJA platforme

Otvorite fajl direktno:

`platforms/kompanija-spaja/src/index.html`

ili kroz lokalni static server po izboru.
