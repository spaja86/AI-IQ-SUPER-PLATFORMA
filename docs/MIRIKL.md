# MIRIKL — GitHub i Vercel operativni plan

## Scope i ownership

- **Track type**: governance/release track (nije runtime product modul)
- **Owner area**: Platform Ops + Automation + Release Engineering
- **Tracking issue**: `https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/issues/920`
- **OKRID**: `OKRID-2026-MIRIKL-001`

## GitHub priprema

- MIRIKL koristi label set: `mirikl`, `mirikl:review`, `mirikl:validated`, `mirikl:needs-review`, `mirikl:logic-change`.
- MIRIKL quality gate model prati standard repozitorijuma:
  - `build`
  - `lint`
  - `test`
  - `smoke`
  - `predeploy`
  - `security`
- Ako se menjaju workflow/config/deploy surface-i, obavezan je `agent:config-change` proces i audit-ready PR opis.

## Vercel priprema

- Runtime split ostaje isti:
  - **Vercel**: frontend/SSR/lightweight API
  - **GitHub Actions**: governance, quality gates, audit
- Environment separation: `dev`, `staging`, `production`.
- Operativne tajne ostaju van repoa (GitHub Secrets / Vercel secrets).

## GitHub ↔ Vercel integracija

- Primarni source of truth za deploy je **Vercel Git integracija**.
- `vercel-deploy.yml` ostaje ručni fallback (workflow_dispatch + optional health-check + rollback hook).
- MIRIKL validacija koristi governance gate surface i audit summary evidenciju.

## Multi-repo i downstream

- Linked repo procena: `spaja86/IO-OPENUI-AO` je **Follow-up required** za label/config kompatibilnost.
- Cross-repo reference se vode u `docs/MULTI-REPO-LINKS.md`.

## Release gate i validacija

MIRIKL promena je spremna za release/promociju tek kada su green sledeće provere:

- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:smoke`
- `npm run predeploy:check`
- `npm audit --audit-level=high`

Human review je obavezan pre merge-a.
