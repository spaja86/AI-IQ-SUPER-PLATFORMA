# DIGITALNA INDUSTRIJA

> **Kompanija SPAJA — Digitalna Industrija**  
> Kanonski scope, operativna pravila i agregatni pregled za umbrella i specijalizovane Digitalna Industrija module.

## 1. Kanonski scope

Digitalna Industrija je podeljena na dva nivoa:

- **Umbrella nivo**
  - `/industrija`
  - `/api/industrija`
  - `/api/industrija-pregled`
  - `/api/digitalna-industrija-pregled`
  - `/api/glavni-endzin-digitalne-industrije`
  - `/api/autofinish-digitalna-industrija-pregled`
- **Specijalizovani moduli**
  - finansije i FX
  - rizici
  - compliance
  - licensing
  - kadrovi i benefiti
  - operativa

Umbrella nivo ostaje rukovodni i agregatni sloj. Specijalizovani moduli ostaju read-only poslovne površine sa sopstvenim API izlazima i sekvencama.

## 2. Poslovni tokovi

Kanonski grupisani tokovi su:

1. **Rukovodni pregled** — scope, Glavni Endžin, autofinish dijagnostika
2. **Finansijski tok** — devizni saldo, prilivi/odlivi, kursne liste, inflacije
3. **Rizici i usklađenost** — valutni, kreditni, kamatni, likvidnosni, pravni, poreski, ESG, sajber
4. **Licensing i operativa** — licencni portfolio, vendor status, procurement queue, regulatorni rokovi
5. **Kadrovi i people ops** — plate, pozicije, beneficije, nagrade

## 3. Ownership model

- **Operativa / billing:** `billing@spaja.rs`
- **Tehnički owner:** `tech@spaja.rs`
- **Biznis owner:** `business@spaja.rs`
- **Compliance / sales:** `sales@spaja.rs`

Svaki Digitalna Industrija modul mora imati bar jedan jasan ownership kanal i definisane KPI-jeve u agregatnom modelu.

## 4. Quality gate i governance

Obavezni quality gate za promene u ovom domenu:

1. `lint`
2. `test`
3. `smoke`
4. `predeploy`
5. `security`

Dodatna pravila:

- human review je obavezan pre merge-a
- config/deploy promene moraju imati audit-ready summary
- rollout, rollback i KPI impact moraju biti dokumentovani za veće promene

## 5. Rollout / rollback

### Rollout

- prvo ažurirati kanonski domen model
- zatim povezati umbrella API preglede
- potom ažurirati korisničke sekvence `/industrija`
- na kraju dopuniti testove i autofinish dijagnostiku

### Rollback

- vratiti agregatni domen model i umbrella API ugovore na prethodnu verziju
- zadržati postojeće specijalizovane module netaknute
- proveriti da `industrija`, `industrija-pregled` i `autofinish-digitalna-industrija-pregled` ponovo vraćaju konzistentnu verziju

## 6. KPI impact

Agregatni pregled prati:

- broj kanonskih površina
- broj specijalizovanih modula
- licencne blokatore legalnog rada i blokatore platformi
- broj verifikovanih licenci
- ukupni licencni budžet
- kritičnu FX izloženost
- neto devizni saldo u EUR
- Glavni Endžin spojenost

## 7. Downstream reference

- Ako promena utiče na linked repo ponašanje, opis mora biti dodat u `docs/MULTI-REPO-LINKS.md`.
- Ova konsolidacija uvodi **repo-local** kanonski model i ne zahteva novu downstream sinhronizaciju.

## 8. Secrets boundary

Sledeće nikada ne ulazi u Digitalna Industrija seed/dokumentacioni sloj:

- GitHub Secrets vrednosti
- Vercel secrets
- deploy hook URL-ovi
- privatni ključevi
- `.env` fajlovi i produkcioni kredencijali
