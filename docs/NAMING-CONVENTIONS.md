# Naming Conventions

## Canonical rules

1. Use lowercase kebab-case for module slugs and API folders.
2. Use one canonical slug per domain across:
   - `src/lib/<slug>`
   - `src/app/api/<slug>`
   - `docs/<SLUG>.md`
   - validator workflow names
3. Keep compatibility aliases only when migration is active.

## Compatibility policy

- If duplicate domain names exist, one must be marked canonical and one alias.
- Alias routes stay read-compatible during migration and must be removed only after:
  1. all clients migrate,
  2. docs are updated,
  3. tests and workflow labels are aligned.
- Legacy library-name compatibility is allowed only when API slug migration is explicit in docs.

## Formal exceptions to rule 2

- `digit-engine` library surface with `digitron` API slug is an approved compatibility exception.
- Any new exception must be documented in both `docs/NAMING-CONVENTIONS.md` and `docs/API-SURFACE-INVENTORY.md`.

## Current migration target

- Canonical: `konvencionalni-odnosi`
- Compatibility alias: `konvenkcionalni-odnosi`
- Legacy compatibility: `digit-engine` (library) → canonical API slug `digitron`

## New module checklist

1. Reserve canonical slug.
2. Add docs with same slug.
3. Add route + tests with same slug.
4. Register validator/workflow using same slug.
