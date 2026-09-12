# SPAJA Društvena Mreža

## Purpose

SPAJA Društvena Mreža uvodi zasebnu platformsku površinu za društvene tokove unutar SPAJA ekosistema. V1 je namerno repo-local, deterministički i API-first kako bi se proizvodni obuhvat, moderacija, KPI-jevi i validator quality gate stabilizovali pre bilo kakve spoljne runtime integracije.

## Product scope

- **Interni korisnici**: operativa, moderacija, produkt i launch timovi
- **Partneri**: linked-repo saradnici, B2B koordinatori, community partneri
- **Javni korisnici**: buildersi, beta korisnici, promotori i community članovi

V1 jasno razdvaja te tri zone i uvodi audience/visibility pravila umesto implicitnog mešanja svih korisnika u isti sloj.

## Main flows

- **Profili** — registracija, audience segmentacija, visibility nivo, interesovanja i verified status
- **Feed** — determinističke objave, tagovi, reakcije i moderacioni flag
- **Grupe** — open ili approval join model, topic tags i ownership pravila
- **Poruke** — repo-local conversation threads i odgovor učesnika bez eksternog message brokera
- **Događaji** — create + RSVP + waitlist pravila, pri čemu `capacity` predstavlja ukupan broj mesta uključujući host nalog
- **Notifikacije** — agregat za profile, objave, grupe, poruke, događaje i moderaciju

## Scope boundaries

- **In scope**: `src/lib/spaja-drustvena-mreza/**`, `src/app/api/spaja-drustvena-mreza/**`, `/spaja-drustvena-mreza`, tests, docs, validator workflow, persona/agent registration
- **Out of scope**: privatni deploy hook-ovi, produkcioni kredencijali, real-time websocket infrastruktura, cross-repo runtime coupling, private DMs van repo-local modela, file uploads, ads, payment flows
- **Linked repo impact**: `none` za v1; follow-up only ako `spaja86/IO-OPENUI-AO` uvede runtime potrošača

## Contracts

| Field | Value |
|---|---|
| Display name | `SPAJA Društvena Mreža` |
| Canonical slug | `spaja-drustvena-mreza` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `spaja-drustvena-mreza-core` |
| Octave / hipermreza node | `8 / 67` |
| Routes | `/api/spaja-drustvena-mreza/profiles`, `/feed`, `/groups`, `/messages`, `/events`, `/notifikacije`, `/pregled`, `/health` |
| Linked-repo impact | `none` |

## Visibility and moderation rules

1. `internal` sadržaj ostaje za interne tokove
2. `network` vidljivost pokriva interne + partnerske aktere
3. `public` sadržaj je otvoren za javni community sloj
4. Self-reaction nije dozvoljen
5. Duplikat objava i duplikat reakcija se odbijaju
6. Jedan autor može kreirati najviše 5 objava po satu
7. Flagged sadržaj mora generisati moderacioni signal/notifikaciju
8. V1 ne koristi privatne tajne, deploy hook-ove ni produkcione kredencijale

## KPI targets

| KPI | Target |
|---|---|
| Engine/domain operation | ≤ 50ms |
| API response | ≤ 200ms |
| Audience coverage | internal + partner + public |
| Security scan coverage | 100% |
| Linked-repo runtime dependency | 0 for v1 |

## Rollout plan

1. **Faza 1** — specifikacija, platform entry, stranica i health/pregled
2. **Faza 2** — profiles + feed
3. **Faza 3** — groups + events
4. **Faza 4** — messages + notifications
5. **Faza 5** — validator, agent, governance i eventualni cross-repo sync

## Rollback plan

- Sakriti rutu iz navigacije ako validator gates padnu
- Zadržati health/pregled-only surface kao fallback
- Ostaviti linked-repo status na `none` dok ne postoji stvarni downstream consumer

## Audit requirements

- Human review je obavezan za config/workflow promene
- Validator workflow mora proći lint, typecheck, tests i security scan
- PR opis za governance/config promene mora imati rollout, rollback, KPI impact i downstream reference
- `docs/MULTI-REPO-LINKS.md` mora eksplicitno beležiti da v1 nema obaveznu downstream izmenu

## Nova Generacija alignment

SPAJA Društvena Mreža prati Nova Generacija principe kroz:

- jasno definisan API-first ugovor
- deterministic repo-local surface pre širenja
- readiness/health agregat
- validator workflow i audit trag
- mogućnost kasnijeg staged rollout-a bez uvođenja tajni u Git

## Exit criteria

- Dokumentacija, stranica i health/pregled rute su dostupne
- Profiles/feed/groups/messages/events/notifikacije rade kroz stabilan API-first ugovor
- Validator workflow prolazi
- Secret i security gates prolaze
- Navigacija, platform katalog, persona-bank i agent-config su usklađeni
- Rollout i audit pravila su dokumentovani pre pune produkcione ekspanzije
