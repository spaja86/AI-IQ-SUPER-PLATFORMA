# AI IQ WORLD BANK — AI Identity + Finance Governance

> Contract mode: additive-only  
> Source-of-truth routes remain locked to `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod`  
> Public boundary: audit-safe summary only

## Purpose

Ovaj dokument zaključava kanonski paket:

- `AI LIČNA KARTA`
- `AI BANKARSKI RAČUN`
- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == AI PLATE`

kao identity/governance/audit model za sve seedovane AI persone u repozitorijumu.

## Scope lock

- nema novih runtime source-of-truth ruta
- nema promene ownership split-a
- nema stvarnih bankarskih podataka u Git-u
- nema KYC, brojeva računa, neredigovanih izvoda ni sekreta u javnom repozitorijumu

Ownership ostaje zaključan:

- `EXTREM` — tehnički signal i bounded readiness score
- `EXTRONDOL` — approval/freeze/promote, payment verification, audit i downstream sync
- `SPAJA KOD` — audit-safe summary only

## PRIVREDNI AKT governance boundary

- `PRIVREDNI AKT` je additive-only governance signal u okviru `KRALJEVSKI EKONOMSKI UNEVERZITET` + `AI IQ WORLD BANK` modela.
- Segmenti korisnika su zaključani na `poljoprivrednici-sa-gostoprimstvom` i `poljoprivrednici`.
- Kvartalni signal `cene privrednika po kvartalu` je audit-safe snapshot (`Q1..Q4`) koji utiče na readiness/payout status bez novog finansijskog engine-a.
- “Plata od Kraljevstva pod pokroviteljstvom AI IQ WORLD BANK” može biti samo governance payout posture (`passed | certified | eligible-for-payout | blocked-for-review`) i nikada ne nosi stvarne bankarske/KYC podatke u Git-u.
- Obavezni gate-ovi pre payout-a: `human review`, `compliance review`, `payment verification`, `anti-abuse review`, `audit trail`, `rollback plan`, `downstream sync`.

## AI lična karta

Svaki seedovani AI mora imati audit-safe identitet u `persona-bank` sa sledećim javno dozvoljenim poljima:

- `personaId`
- `name`
- `domain`
- `octave`
- `hipermrezaNode`
- `linkedAgents`
- `lifecycleStatus`
- `readinessStatus`
- `governanceStatus`

Aktivacija mora ostati auditabilna kroz `persona-bank.auditLog` i `EXTRONDOL` human-review signal.

## AI bankarski račun

`AI BANKARSKI RAČUN` je governance model, nikada realni bankarski zapis u Git-u.

Dozvoljeno je čuvati samo:

- approval status
- compliance status
- payment verification status
- human review status
- downstream sync status
- payout/compensation režim

Zabranjeno je čuvati:

- stvarne brojeve računa
- neredigovane izvode
- payment secrets
- KYC dokumentaciju
- operativne pristupne podatke

## AI IQ WORLD BANK prepiska

- `AI IQ WORLD BANK PREPISKA` ostaje documentation-only governance evidence i nikada ne postaje novi runtime source-of-truth.
- Dozvoljena korespondencija je audit-safe i bounded samo na: `approval status`, `compliance status`, `payment verification status`, `human review status`, `downstream sync status` i `payout/compensation režim`.
- `BEZPOVRATNE SUBVENCIJE` ostaju governance-only payout režim i smeju koristiti samo audit-safe evidence/status sloj: `approval`, `payment verification status`, `audit evidence`, `payout readiness`.
- Zabranjeno je unositi ili prenositi stvarne brojeve računa, KYC dokumente, neredigovane izvode, payment secrets ili operativne kredencijale.
- `EXTREM` sme da nosi samo bounded identity/finance readiness signal, `EXTRONDOL` sme da nosi samo governance mirror, a `SPAJA KOD` sme da objavi samo audit-safe summary ove prepiske.
- Downstream sync prema `spaja86/IO-OPENUI-AO` ostaje audit-safe snapshot only.

## Compensation lock

- `12000 EUR weekly` ostaje `business-finops-target-only`
- `premium-rollout-regime` ostaje dozvoljeni payout/compensation režim
- master billing ciklus ostaje `monthly-or-annual`

Hard gate-ovi:

- contract approval
- compliance review
- payment verification
- human review
- rollback plan
- FinOps guardrails

Bez svih gate-ova status mora ostati `WATCH` ili `BLOCKED`.

## Standardized rollout

Rollout ostaje zaključan na:

1. referentni obrazac `extrimli-core`
2. isti identity + governance + payout shape za sve ostale seedovane AI persone
3. downstream sync samo preko audit-safe summary-ja prema `spaja86/IO-OPENUI-AO`

## Acceptance lock

Implementacija je validna samo kada su istovremeno tačni sledeći uslovi:

- svaki seedovani AI ima audit-safe ličnu kartu
- svaki seedovani AI ima governance-bounded bankarski/payout profil
- `12000 EUR weekly` nije tretiran kao automatska isplata
- nema novih source-of-truth ruta
- docs, types, routes, tests i workflows ostaju drift-zero poravnati
