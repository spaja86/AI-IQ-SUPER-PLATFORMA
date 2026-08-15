# KONVENKCIONALNI ODNOSI — Modul Specifikacija

> **Platforma**: AI-IQ-SUPER-PLATFORMA  
> **Verzija**: 1.0.0  
> **Persona**: `konvenkcionalni-odnosi-core` (octave: 1, hipermreza node: 8)  
> **Validator agent**: `konvenkcionalni-odnosi-validator-agent`

---

## Koncept

**KONVENKCIONALNI ODNOSI** je modul koji modeluje i upravlja konvencionalnim (standardnim, formalnim) odnosima između platformskih entiteta — agenata, persona, korisnika, organizacija i sistema.

Modul definiše:
- **Tipove odnosa** (hierarchical, peer, mentorship, sponsorship, collaboration, contractual, affiliation)
- **Životni ciklus** svakog odnosa (DRAFT → ACTIVE → SUSPENDED / ARCHIVED / TERMINATED)
- **Audit log** svih interakcija i promena statusa
- **API** za kreiranje, pregled i upravljanje odnosima

---

## Struktura Modula

```
src/lib/konvenkcionalni-odnosi/
  types.ts              ← TypeScript tipovi i konstante
  registry.ts           ← In-memory store (CRUD)
  relation-engine.ts    ← Biznis logika (createRelation, changeRelationStatus, itd.)
  interaction-tracker.ts← Praćenje interakcija po odnosu/aktoru
  index.ts              ← Javni API

src/app/api/konvenkcionalni-odnosi/
  create/route.ts       ← POST /api/konvenkcionalni-odnosi/create
  list/route.ts         ← GET  /api/konvenkcionalni-odnosi/list
  health/route.ts       ← GET  /api/konvenkcionalni-odnosi/health
  [id]/route.ts         ← GET  /api/konvenkcionalni-odnosi/:id
  [id]/status/route.ts  ← PATCH /api/konvenkcionalni-odnosi/:id/status
  [id]/interact/route.ts← POST /api/konvenkcionalni-odnosi/:id/interact

src/components/konvenkcionalni-odnosi/
  RelationCard.tsx      ← Prikaz jednog odnosa
  RelationList.tsx      ← Lista odnosa sa filterima
  RelationTimeline.tsx  ← Hronološki prikaz interakcija

src/tests/lib/
  konvenkcionalni-odnosi.test.ts ← Unit + edge case testovi
```

---

## Tipovi Odnosa

| Tip | Uloga inicijatora | Uloga primaoca | Opis |
|-----|------------------|----------------|------|
| `hierarchical` | initiator | recipient | Podređeni ↔ nadređeni |
| `peer` | peer | peer | Ravnopravni odnos |
| `mentorship` | mentor | mentee | Mentor ↔ mentee |
| `sponsorship` | sponsor | beneficiary | Sponzor ↔ korisnik |
| `collaboration` | initiator | recipient | Projektna saradnja |
| `contractual` | initiator | recipient | Formalni ugovorni odnos |
| `affiliation` | initiator | recipient | Partnerstvo/afilijacija |

---

## Životni Ciklus

```
DRAFT ──────────────► ACTIVE ───────────► SUSPENDED
  │                     │                     │
  └──► TERMINATED ◄─────┘◄────────────────────┘
                         │
                         └──► ARCHIVED
```

| Status | Dozvoljena tranzicija |
|--------|-----------------------|
| DRAFT | → ACTIVE, TERMINATED |
| ACTIVE | → SUSPENDED, ARCHIVED, TERMINATED |
| SUSPENDED | → ACTIVE, TERMINATED |
| ARCHIVED | (terminal — nema tranzicija) |
| TERMINATED | (terminal — nema tranzicija) |

---

## API Referenca

### POST `/api/konvenkcionalni-odnosi/create`
**Body:**
```json
{
  "type": "mentorship",
  "initiatorId": "persona-1",
  "initiatorEntityType": "persona",
  "recipientId": "user-42",
  "recipientEntityType": "user",
  "description": "Opis saradnje",
  "tags": ["sport", "coaching"]
}
```
**Response:** `201` + `KoResult<Relation>`

---

### GET `/api/konvenkcionalni-odnosi/:id`
**Response:** `200 / 404` + `KoResult<Relation>`

---

### PATCH `/api/konvenkcionalni-odnosi/:id/status`
**Body:**
```json
{ "newStatus": "ACTIVE", "actorId": "persona-1", "reason": "Potvrđeno" }
```
**Response:** `200 / 422` + `KoResult<Relation>`

---

### GET `/api/konvenkcionalni-odnosi/list`
**Query params:** `entityId`, `type`, `status`  
**Response:** `200` + `KoResult<Relation[]>`

---

### POST `/api/konvenkcionalni-odnosi/:id/interact`
**Body:**
```json
{ "actorId": "persona-1", "note": "Komentar", "payload": {} }
```
**Response:** `200 / 422` + `KoResult<Relation>`

---

### GET `/api/konvenkcionalni-odnosi/health`
**Response:** `200` + `RelationHealthReport`

---

## Validacija i Edge Cases

- **Self-relation**: zabranjen (initiatorId === recipientId)
- **Duplikati**: nema dva aktivna odnosa istog tipa između istih entiteta
- **Nevalidne tranzicije**: ARCHIVED i TERMINATED su terminalni stati
- **Interakcija na terminalu**: zabranjena na ARCHIVED/TERMINATED
- **Prazni ID-evi**: odbijeni sa jasnom greškom

---

## KPI Ciljevi

| Metrika | Cilj |
|---------|------|
| Evaluacija odnosa | ≤ 50ms |
| Lookup po ID-u | ≤ 10ms |
| Bulk list (50 stavki) | ≤ 50ms |
| API response | ≤ 200ms |
| Kreiranje odnosa | ≤ 100ms |

---

## Integracije

| Modul | Tip |
|-------|-----|
| `persona-bank` | Entiteti odnosa su persone iz banka |
| `zlatni-racuni` | Sponzorski odnosi donose bodovne beneficije |
| `epekm-denter` | Email notifikacije o promenama odnosa |
| `maksimus` | Orchestrator validira hijerarhijske odnose |
| `extrimli-cuz` | Mentorski odnosi unutar zajednice |
| `dijagnoza` | Wellness odnosi (pacijent–terapeut) |

---

## CI/CD

Workflow: `.github/workflows/konvenkcionalni-odnosi-validator.yml`

Trigger labels:
- `konvenkcionalni-odnosi:logic-change`
- Auto-label: `konvenkcionalni-odnosi:validated` ili `konvenkcionalni-odnosi:needs-review`

---

## Kontakt / Audit

- **Owner**: @spaja86
- **OKRID**: `OKRID-2026-KO-001`
- **Contract version**: `v1`
- **Module version**: `1.0.0`
