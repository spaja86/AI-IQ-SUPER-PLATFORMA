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

## Current migration target

- Canonical: `konvencionalni-odnosi`
- Compatibility alias: `konvenkcionalni-odnosi`

## New module checklist

1. Reserve canonical slug.
2. Add docs with same slug.
3. Add route + tests with same slug.
4. Register validator/workflow using same slug.
