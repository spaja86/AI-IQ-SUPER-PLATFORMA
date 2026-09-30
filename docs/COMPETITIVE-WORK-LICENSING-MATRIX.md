# Licencna matrica za kompetitivni i profesionalni rad

## Svrha

Ova matrica mapira postojeće read-only licencne i compliance površine za gaming, AI/IT rad i profesionalni pristup. Ne izdaje licencu, ne naplaćuje, ne rezerviše sredstva i ne pokreće isplatu.

## Izvori

| Izvor | Odgovornost | Javni izlaz |
| --- | --- | --- |
| AI-IQ-SUPER-PLATFORMA — AI IQ WORLD BANK Licencni Registar | Status licenci, gap analiza, nabavka i issuer governance | `/api/aiiq-world-bank-licencni-registar` |
| AI-IQ-SUPER-PLATFORMA — Issuer Licensing | Ovlasćenja za izdavanje softvera, sertifikata, edukacije, API pristupa i partner sublicenci | `/api/issuer-licensing` |
| IO-OPENUI-AO — UNEVERZITET | Obrazovanje, testiranje, sertifikacija, integritet i profesionalni readiness | Read-only data model u `src/data/university.ts` |
| IO-OPENUI-AO — Games Economy | Fun/Test i Professional gaming planovi, telemetry, anti-abuse i payout review posture | Read-only data model u `src/data/gamesEconomy.ts` |

## Radne kategorije

| Kategorija | Dozvoljena početna aktivnost | Potrebni dokazi pre profesionalnog statusa | Finansijska granica |
| --- | --- | --- | --- |
| Fun/Test gaming | Trening, lokalni leaderboard i simulacija | Nalog i platform rules | Bez real-money toka |
| Kompetitivni gaming | Skill-based mečevi, replay/telemetry evidencija i rank | Jasna pravila takmičenja, anti-cheat/anti-collusion review i audit trag | Nema automatske isplate |
| Profesionalni gaming | Licencirani format samo u odobrenoj jurisdikciji | 18+, identitet, KYC/AML gde je zakonski potrebno, region-scope, aktivna licenca, telemetry/replay dokaz i manual review | Payout ostaje `pending` ili `manual-review` dok se svi gate-ovi ne potvrde |
| AI/IT profesionalni rad | Dokumentacija, konsultacije i odobreni AI/IT zadaci | Kompetencija/sertifikacija, identity i policy review, dozvoljena delatnost | Bez automatskog transfera; ugovor i plaćanje van repozitorijuma |
| Partner/enterprise rad | Odobrene B2B aktivnosti | Due diligence, ugovorni scope, owner i compliance review | Custom uslovi van Git-a |

## Statusi licence

- `candidate` / Fun-Test: edukacija i simulacija; bez finansijske aktivacije.
- `verified`: identitet i osnovna pravila potvrđeni; aktivnost ostaje ograničena scope-om.
- `certified`: znanje ili kompetencija potvrđena; nije automatska dozvola za rad ili isplatu.
- `licensed`: važi samo kada je ovlašćenje izdavaoca odobreno, jurisdikcija podržana i svi policy gate-ovi zatvoreni.
- `suspended`, `revoked`, `expired`: profesionalne privilegije i payout readiness ostaju blokirani.

## Obavezni gate-ovi za profesionalni gaming

1. Age-gating i identitet u skladu sa primenljivim pravilima.
2. Jurisdikcija i licencni scope potvrđeni od odgovornog pravnog/compliance vlasnika.
3. Aktivna licenca i odobreni profesionalni status.
4. Telemetry/replay dokaz, fair-play i anti-collusion provera.
5. Manual review, dispute prozor, audit trag i rollback postupak.
6. Finansijska odluka van Git-a, kroz stvarni, odobreni payment/settlement proces.

## Zabranjeno

- Predstavljati Fun/Test režim kao real-money uslugu.
- Automatski prebacivati novac, izdavati licence ili aktivirati payout iz aplikacionog koda.
- Čuvati račune, KYC dokumente, izvode, payment secrets ili podatke kartica u repozitorijumu.
- Tumačiti obrazovanje, sertifikat ili rank kao regulatornu dozvolu za rad u svakoj jurisdikciji.

## Sledeći korak

Pre stvarne licence bira se jedan pilot format. Pilot mora imati vlasnika, ciljnu jurisdikciju, pravni osnov, korisničke uslove, cost limit, success metric, manual-review tok i rollback plan. Bez tih podataka, matrica ostaje read-only plan.
