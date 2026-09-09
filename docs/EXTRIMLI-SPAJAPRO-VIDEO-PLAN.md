# EXTRIMLI EXTRONDOL EXTREM — VIDEO za SPAJAPRO

## 1) Cilj videa

Cilj videa je da prikaže jednu koherentnu SPAJAPRO priču koja povezuje:
- EXTRIMLI runtime domen,
- EXTREM profiler (`/api/extrimli/extrem`),
- EXTRONDOL WAWE governance (`/api/extrimli/extrondol`).

Narativ mora jasno pokazati kako tehnički signali i governance gate-ovi zajedno vode odluku: **promotion** ili **freeze**.

## 2) Zaključani narativni blokovi (redosled)

1. **Uvod** — šta je SPAJAPRO i zašto EXTRIMLI domen
   - Pozicioniranje EXTRIMLI kao domena za readiness/risk/governance signal.
   - Kratko objašnjenje zašto je domen bitan za Digitalna Industrija kontekst.

2. **EXTREM blok** — DISKVIT konflikt profil i freeze/promotion signal
   - DISKVIT kao browser-graphics bottleneck sloj.
   - Konflikt intenzitet i resolution readiness (REZOLUCIJA, EKODOR, REKULITI PO RAULETU, DISCAN in KIBEN).
   - Kada EXTREM signal zahteva freeze.

3. **EXTRONDOL blok** — WAWE-1 do WAWE-5, promotionFreeze i B2B hard gate
   - Deterministički WAWE tok: WAWE-1 → WAWE-5.
   - promotionFreeze logika kada postoje blocker-i, degradacija ili nekompletna governance evidence.
   - B2B hard gate: human review, onboarding, downstream sync, audit trail, payment verification.

4. **Završnica** — releaseAuditSummary + human review + rollback
   - releaseAuditSummary kao obavezni audit artefakt.
   - Human review kao obavezna kontrola pre publish/promocije.
   - Rollback spremnost kao release uslov.

## 3) Kreativna mapa scena

Fraza **"RIKEL KAGER DEKOR NUTER DIKSAZ KIPOR"** koristi se kao zaključani raspored sekcija:

- **RIKEL** — identitet i vision intro
  - Vizuel: SPAJAPRO title frame + EXTRIMLI positioning.
  - Poruka: "Jedna platforma, jedan governance jezik, determinističke odluke."

- **KAGER** — tehnički backbone (API surfaces)
  - Vizuel: endpoint mapa i source-of-truth frame.
  - Poruka: "EXTREM i EXTRONDOL su aktivni, verzionisani i audit-ready surface-ovi."

- **DEKOR** — governance vizueli (WAWE + gate flow)
  - Vizuel: WAWE progresija + freeze branch.
  - Poruka: "Napredovanje je dozvoljeno samo kada su gate-ovi zeleni."

- **NUTER** — operativna spremnost (KPI + payment/compliance)
  - Vizuel: KPI panel + compliance panel.
  - Poruka: "Performanse i governance evidence moraju biti istovremeno validni."

- **DIKSAZ** — rizici, freeze i degradirani režim
  - Vizuel: degraded posture i blocker tok.
  - Poruka: "Partial payload bez 500 štiti kontinuitet, ali freeze ostaje aktivan dok rizik traje."

- **KIPOR** — final release, audit i downstream sync
  - Vizuel: release checklist + downstream reference (`spaja86/IO-OPENUI-AO`).
  - Poruka: "Release je validan tek kada postoji audit trag i potvrđen downstream alignment."

## 4) Obavezne poruke (contract lock)

U videu moraju eksplicitno postojati sledeće poruke:

- Source-of-truth endpointi:
  - `/api/extrimli/extrem`
  - `/api/extrimli/extrondol`
- KPI ciljevi:
  - evaluacija ≤ 50ms
  - API response ≤ 200ms
  - build ≤ 3 min
- Degraded policy:
  - `partial-payload-no-500`
- Governance hard rule:
  - promotion se blokira bez kompletne governance evidence i human review potvrde.

## 5) Assets i output paketi

### A) Storyboard paket
- Scene-by-scene tabela za RIKEL → KIPOR.
- Za svaku scenu: cilj poruke, vizuelni fokus, ulaz/izlaz u sledeći blok.

### B) Voiceover skripta
- Biznis sloj: vrednost i governance razlog.
- Tehnički sloj: EXTREM signal, EXTRONDOL WAWE odluke, freeze kriterijumi.
- Finalni CTA: publish samo uz audit i human review gate.

### C) Vizuelni overlay set
- WAWE mapa (1→5) sa promotion/freeze grananjem.
- Freeze trigger overlay (KPI breach, degraded, missing evidence, payment/compliance blockers).
- Readiness snapshot overlay (EXTREM + EXTRONDOL signal summary).

### D) Finalni output
- **Final cut**: puna SPAJAPRO narativna verzija.
- **Audit short cut**: kratka verzija za PR/release kontekst sa ključnim governance dokazima.

## 6) Validacija pre objave

Pre objave proveriti sledeće:

1. **Terminology lock**
   - EXTRIMLI/EXTREM/EXTRONDOL nazivi su dosledni i bez alias varijanti.

2. **Multi-repo usklađenost**
   - Poruka o downstream referenci prema `spaja86/IO-OPENUI-AO` je uključena i jasna.

3. **Human-review gate**
   - Finalni publish ide tek nakon human-review checkpoint-a.

4. **Governance poruke bez odstupanja**
   - Endpointi, KPI granice, degraded policy i promotion freeze pravilo prikazani su eksplicitno.
