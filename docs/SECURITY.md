# 🔐 SECURITY.md — SpajaUltraOmegaCore -∞Ω+∞

**Bezbednosna Arhitektura — AI IQ SUPER PLATFORMA — Digitalna Industrija**

---

## 📋 Sadržaj

1. [Arhitekturni Pregled](#arhitekturni-pregled)
2. [Autentifikacioni Tok](#autentifikacioni-tok)
3. [Komponente](#komponente)
4. [Konfiguracija](#konfiguracija)
5. [Threat Model](#threat-model)
6. [Incident Response](#incident-response)
7. [Prijavljivanje Ranjivosti](#prijavljivanje-ranjivosti)

---

## 🏗️ Arhitekturni Pregled

```
┌─────────────────────────────────────────────────────┐
│           SpajaUltraOmegaCore -∞Ω+∞                │
│                                                     │
│  Zero Trust │ Kvantno-Otporno │ Deterministično     │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────────┐
│  Omega Security │────▶│   Rate Limiting          │
│  Middleware     │     │   CSRF Protection        │
│                 │     │   Security Headers       │
│                 │     │   IP Reputation          │
└────────┬────────┘     └─────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────────┐
│  ΩAuthProvider  │────▶│   JWT (HMAC-SHA256)      │
│                 │     │   API Key Auth           │
│                 │     │   TOTP/2FA (RFC 6238)    │
│                 │     │   OAuth2 (GitHub/Google) │
└────────┬────────┘     └─────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────────┐
│  ΩPermission    │────▶│   Clearance Levels       │
│  Matrix         │     │   Resource Guards        │
│                 │     │   Double-Check Principle │
└────────┬────────┘     └─────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────────┐
│  ΩAuditLogger   │────▶│   Append-Only Log        │
│                 │     │   Hash Chain (SHA-256)   │
│                 │     │   90-Day Retention       │
└─────────────────┘     └─────────────────────────┘
```

---

## 🔄 Autentifikacioni Tok

### Standardna Prijava (Email/Password + opciono 2FA)

```
Klijent                    API                    Vault/Store
  │                          │                         │
  │  POST /api/auth/login     │                         │
  │  {email, password, totp?} │                         │
  │─────────────────────────▶│                         │
  │                          │  Pronađi identitet      │
  │                          │────────────────────────▶│
  │                          │◀────────────────────────│
  │                          │                         │
  │                          │  Verifikuj lozinku      │
  │                          │  (PBKDF2-SHA512)        │
  │                          │                         │
  │                          │  Verifikuj TOTP (ako    │
  │                          │  je 2FA aktivan)        │
  │                          │                         │
  │                          │  Generiši ACCESS token  │
  │                          │  + REFRESH token        │
  │                          │                         │
  │  {token, refreshToken,    │                         │
  │   identity, expiresAt}   │                         │
  │◀─────────────────────────│                         │
  │                          │                         │
  │  Set-Cookie: omega-       │                         │
  │  refresh (httpOnly)       │                         │
  │◀─────────────────────────│                         │
```

### Token Rotation (Refresh)

```
Klijent                    API
  │                          │
  │  POST /api/auth/refresh   │
  │  Cookie: omega-refresh    │
  │─────────────────────────▶│
  │                          │
  │                          │  Verifikuj refresh token
  │                          │  Odmah opozovi stari
  │                          │  Izdaj nove tokene
  │                          │
  │  {token, refreshToken}    │
  │◀─────────────────────────│
```

---

## 🧩 Komponente

### 1. `src/lib/auth/types.ts`
Definicije svih TypeScript tipova: `ΩToken`, `ΩScope`, `ΩResource`, `ΩSecurityPolicy`, `ΩIdentity`, `ΩKeyPair`, `ΩEncryptedPayload`, `ΩClearanceLevel`, `ΩSession`, `ΩAuditEvent`.

### 2. `src/lib/auth/omega-crypto.ts` — `ΩCryptoEngine`
- **AES-256-GCM** enkriptovanje podataka
- **PBKDF2-SHA512** hashovanje lozinki (310.000 iteracija — OWASP preporuka)
- **Ed25519** generisanje ključeva i potpisi
- **HMAC-SHA256** JWT potpisi
- **TOTP/HOTP** (RFC 6238/4226) za 2FA
- **Timing-safe** poređenje stringova (sprečava timing napade)
- Random IV za svako enkriptovanje (sprečava replay napade)

### 3. `src/lib/auth/omega-identity.ts` — `ΩIdentityVault`
- Enkriptovano čuvanje identiteta (AES-256-GCM)
- DID (Decentralized Identifiers) po `did:omega` metodi
- Singleton vault za globalnu upotrebu

### 4. `src/lib/auth/omega-permissions.ts` — `ΩPermissionMatrix`
**Clearance Nivoi:**
| Nivo | Naziv | Pristup |
|------|-------|---------|
| 0 | VISITOR | Javni endpointi |
| 1 | USER | Dashboard, OMEGA AI |
| 2 | OPERATOR | Auto-repair, operativne operacije |
| 3 | ADMIN | Korisnici, audit logovi |
| 4 | SUPER_ADMIN | Admin operacije |
| 5 | OMEGA_CORE -∞Ω+∞ | Sve — bez ograničenja |

### 5. `src/lib/auth/omega-auth.ts` — `ΩAuthProvider`
- JWT tokeni sa HMAC-SHA256 potpisom
- Token revokacija (immediate)
- Refresh token rotacija
- API ključevi
- Rate limiting integracija
- Zero Trust: uvek verifikuj iz izvora

### 6. `src/middleware/omega-security.ts`
- **Rate limiting**: 100 req/min (anonimni), 1000 req/min (auth)
- **Brute force zaštita**: 5 pokušaja/15 min po IP
- **CSRF**: Double Submit Cookie pattern
- **Security Headers**: HSTS, CSP, X-Frame-Options, Permissions-Policy, Referrer-Policy
- **IP Blokiranje**: Blacklist poznate maliciozne IP adrese

### 7. `src/middleware/omega-audit.ts` — `ΩAuditLogger`
- Append-only nepromenjivi log
- Kriptografski lanac hash-eva (SHA-256)
- 90-dana retencija
- Statistike i verifikacija integriteta

### 8. API Rute (`src/app/api/auth/`)
| Ruta | Metoda | Opis |
|------|--------|------|
| `/api/auth/login` | POST | Prijava (email/password/OAuth) |
| `/api/auth/refresh` | POST | Obnova tokena (rotation) |
| `/api/auth/logout` | POST | Odjava + revokacija svih tokena |
| `/api/auth/verify` | GET | Verifikacija tokena |
| `/api/auth/2fa` | POST | Enable/Verify/Disable 2FA |

### 9. `src/lib/digital-industry/omega-resource-guard.ts` — `ΩResourceGuard`
- Registar svih resursa "Digitalne Industrije"
- Klasifikacije: PUBLIC, INTERNAL, CONFIDENTIAL, TOP_SECRET, OMEGA
- Enkriptovanje u mirovanju (AES-256-GCM)

### 10. `src/lib/digital-industry/omega-session.ts` — `ΩSessionManager`
- Session fixation zaštita (uvek novi ID)
- Concurrent session limit (max 5)
- Automatsko istekanje (1h access, 30d refresh)
- Cleanup expired sesija

---

## ⚙️ Konfiguracija

### Environment Variables

```bash
# JWT tajni ključ (minimum 32 karaktera)
OMEGA_JWT_SECRET=your-super-secret-key-minimum-32-characters

# Vault ključ za enkriptovanje identiteta (64 hex karaktera = 32 bajta)
OMEGA_VAULT_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Node environment
NODE_ENV=production
```

### Security Headers Konfiguracija

Security headeri se automatski primenjuju na sve odgovore:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

### Next.js Middleware Konfiguracija

```typescript
// middleware.ts
export { omegaSecurityMiddleware as middleware } from '@/middleware/omega-security';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🎯 Threat Model

### Pretnje i Mitigacije

| Pretnja | Opis | Mitigacija |
|---------|------|-----------|
| **Brute Force** | Pogađanje lozinki | Rate limiting: 5 pokušaja/15min po IP |
| **Token Theft** | Krađa JWT tokena | Kratko trajanje (1h), httpOnly kolačići, revokacija |
| **CSRF** | Cross-Site Request Forgery | Double Submit Cookie pattern |
| **XSS** | Cross-Site Scripting | CSP strict, httpOnly kolačići |
| **Clickjacking** | Ugrađivanje u iframe | X-Frame-Options: DENY |
| **MITM** | Man-in-the-Middle | HSTS sa preload, max-age=63072000 |
| **Replay Attack** | Ponovna upotreba tokena | Random IV, nonce u JWT, revokacija |
| **Session Fixation** | Fiksiranje ID sesije | Uvek novi session ID pri prijavi |
| **Concurrent Sessions** | Previše sesija | Limit od 5 aktivnih sesija |
| **Log Tampering** | Izmena audit logova | Kriptografski lanac hash-eva |
| **Privilege Escalation** | Neovlašćeno povišenje prava | Clearance matrix, zero trust |
| **Timing Attack** | Merenje vremena odgovora | timingSafeCompare za sve komparacije |
| **Information Leakage** | Curenje podataka u greškama | Generičke poruke o greškama |

### STRIDE Analiza

- **Spoofing**: Ed25519 potpisi, HMAC-SHA256 JWT
- **Tampering**: AES-256-GCM autentifikovano enkriptovanje, audit hash lanac
- **Repudiation**: Nepromenjivi audit log sa kriptografskim lancem
- **Information Disclosure**: Enkriptovanje u mirovanju, HTTPS enforced (HSTS)
- **Denial of Service**: Rate limiting, brute force zaštita
- **Elevation of Privilege**: ΩPermissionMatrix, ΩClearanceLevel

---

## 🚨 Incident Response

### Nivo 1 — Sumnjiva Aktivnost
1. Pregledati audit log: `ΩAuditLogger.getEventsByOutcome('DENIED')`
2. Identifikovati IP adrese sa visokim brojem odbijenih zahteva
3. Dodati IP na BLOCKED_IPS listu u `omega-security.ts`

### Nivo 2 — Kompromitovani Korisnički Nalog
1. Odmah opozvati sve tokene: `ΩAuthProvider.revokeAll(userId)`
2. Ugasiti sve sesije: `ΩSessionManager.terminateAllUserSessions(userId)`
3. Resetovati lozinku i 2FA
4. Pregledati audit log za korisnika: `ΩAuditLogger.getEventsByUser(userId)`

### Nivo 3 — Kompromitovani JWT Secret
1. Odmah promeniti `OMEGA_JWT_SECRET`
2. Svi postojeći tokeni postaju nevažeći automatski
3. Informisati sve korisnike da se ponovo prijave
4. Proveriti audit log za neuobičajene tokene

### Nivo 4 — Curenje Podataka (Data Breach)
1. Odmah isključiti sistem: `NODE_ENV=maintenance`
2. Promeniti sve kriptografske ključeve
3. Analizirati audit log
4. Notifikovati pogođene korisnike
5. Prijaviti nadležnim organima (GDPR rok: 72 sata)

### Nivo 5 — Kompletno Oštećenje Sistema (OMEGA)
1. Izolacija: Isključiti sve mrežne konekcije
2. Forenzička analiza: Sačuvati sve logove pre resetovanja
3. Čist restart sa novim kriptografskim materijalima
4. Full audit sveg izvornog koda

---

## 📧 Prijavljivanje Bezbednosnih Ranjivosti

**MOLIMO NE OTVARAJTE JAVNI ISSUE za bezbednosne ranjivosti.**

Bezbednosne ranjivosti prijavite privatno:

- **Email**: security@kompanija-spaja.rs
- **PGP Ključ**: Dostupan na request
- **Response Time**: 24-72 sata za potvrdu

Kada prijavite ranjivost, molimo uključite:
1. Opis ranjivosti i njen uticaj
2. Koraci za reprodukciju
3. Vaša predložena mitigacija (opciono)

Zahvaljujemo se svim odgovornim istraživačima bezbednosti!

---

*SpajaUltraOmegaCore -∞Ω+∞ | Zero Trust | Kvantno-Otporno | Neviđeno do sada*

*Kompanija SPAJA — Digitalna Industrija*
