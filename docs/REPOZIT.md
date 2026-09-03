# REPOZIT — Repository Management Module

## Purpose

REPOZIT is the repo-management module for standardized repository registry access in `AI-IQ-SUPER-PLATFORMA`.

## MVP scope

- **Overview**: unified listing of repositories with pagination and filters.
- **Search**: query by id/name/fullName/description/technologies/features.
- **Status**: lifecycle filtering (`active`, `skeleton`, `concept`) and health reporting.
- **Sync**: explicit sync classification (`linked`, `local-only`, `concept-only`) with downstream governance context.

## API contract

- `GET /api/repozit`
  - Query params: `query`, `status`, `category`, `syncStatus`, `page`, `pageSize`
  - Returns standardized `apiSuccess` payload with `items`, `total`, `mvp`, `filters`, `audit`.
- `GET /api/repozit/[id]`
  - Returns one repository record enriched with metadata.
  - Returns `NOT_FOUND` if repository id is unknown.
- `GET /api/repozit/health`
  - Returns validation and readiness summary (`status`, allowed enums, invalid record count, mvp capabilities).

Shared response headers:

- `X-Repozit-Contract-Version`
- `X-Repozit-Module-Version`
- `X-Repozit-Persona-Id`
- `X-Repozit-Display-Name`

## Data standardization

REPOZIT aligns with `src/lib/types.ts` through shared lifecycle/category definitions and metadata model:

- `RepositoryStatus`, `RepositoryCategory`
- `RepositoryMetadata`
- `RepozitMvpCapability`, `RepozitSyncStatus`

Validation rules:

- non-empty `id`
- `fullName` must follow `owner/repo`
- URL must begin with `https://github.com/`
- status/category must be in allowed enums
- repository IDs must be unique

## Governance and downstream notes

- Primary linked repository remains `spaja86/IO-OPENUI-AO`.
- REPOZIT keeps downstream references audit-friendly via `audit.linkedRepo`.
- Current rollout is repo-local for runtime behavior; linked-repo runtime coupling requires explicit follow-up issue/PR.
- This module follows existing multi-repo governance from `docs/MULTI-REPO-LINKS.md` and agent rules in `AGENTS.md`.

## Testing

- Library tests: `src/tests/lib/repozit.test.ts`
- API tests: `src/tests/api/repozit-route.test.ts`
- Existing generator route coverage continues through `src/tests/autofinish/spaja-generator-repozitorijumi-route.test.ts`.
