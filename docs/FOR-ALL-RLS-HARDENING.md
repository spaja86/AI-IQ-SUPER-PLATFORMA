# FOR ALL RLS Hardening — Inventory, Risk, and Rollout

## Scope

This hardening pass treats `FOR ALL` strictly as PostgreSQL RLS policy usage in Supabase migrations under:

- `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/supabase/migrations/`

## Inventory and ownership map

| Migration | Table | Current intent | Linked module/surface |
|---|---|---|---|
| `001_initial_schema.sql` | `public.profiles` | service-role full access | auth, profile, subscription linkage |
| `002_threads_models_settings.sql` | `public.chat_threads` | service-role full access | chat/thread model |
| `002_threads_models_settings.sql` | `public.chat_history` | service-role full access | chat history |
| `002_threads_models_settings.sql` | `public.usage_logs` | service-role full access | usage and billing telemetry |
| `003_audit_evolution.sql` | `public.evolution_cycles` | service-role full access | evolution orchestration |
| `003_audit_evolution.sql` | `public.evolution_recommendations` | service-role full access | evolution recommendations |
| `003_audit_evolution.sql` | `public.health_snapshots` | service-role full access | health monitoring snapshots |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_sources` | service-role full access | knowledge ingestion |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_documents` | service-role full access | knowledge ingestion/retrieval |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_chunks` | service-role full access | retrieval indexing |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_crawl_jobs` | service-role full access | crawl orchestration |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_dead_letters` | service-role full access | ingest failure handling |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_citations` | service-role full access | retrieval citations |
| `004_spaja_baza_knowledge.sql` | `public.knowledge_retrieval_metrics` | service-role full access | retrieval metrics |
| `012_spaja_baza_indeksiranje.sql` | `public.knowledge_index_jobs` | service-role full access | indexing pipeline |
| `019_depon_us_states_platform.sql` | `public.platform_users` | user-scoped (`auth.uid == user_id`) | DEPON identity |
| `019_depon_us_states_platform.sql` | `public.platform_sessions` | user-scoped (`auth.uid == user_id`) | DEPON sessions |
| `019_depon_us_states_platform.sql` | `public.platform_payments` | user-scoped (`auth.uid == user_id`) | DEPON payments |
| `020_deploy_audit_log.sql` | `public.deploy_platform_registry` | service-role write/read policy split | deploy control plane |
| `021_indeksiranje_svakog_stupnja.sql` | `public.knowledge_index_stage_log` | service-role write + authenticated read | staged indexing audit |
| `022_indeksiranje_750.sql` | `public.knowledge_index_750_audit` | service-role write + authenticated read | indeksiranje-750 audit |

## Policy standards

### When `FOR ALL` is allowed

- Only when exactly one principal should own all operations for the table (for example `service_role` automation tables).
- User-facing tables should prefer operation-specific policies (`SELECT/INSERT/UPDATE/DELETE`) unless there is a strong, documented reason not to.

### Required guardrails

1. Explicit target role boundary (`TO service_role` or `TO authenticated`).
2. Explicit `USING` clause for row visibility.
3. Explicit `WITH CHECK` clause for mutation safety.
4. Least privilege by default; no open-ended write policy.
5. If a policy is user-scoped and mutable, split into operation-specific policies.

## Risk ranking and prioritization

| Risk | Tables | Rationale | Priority |
|---|---|---|---|
| High | `platform_users`, `platform_sessions`, `platform_payments` | Multi-tenant user-facing records; prior `FOR ALL` was broad even if condition-scoped | Immediate |
| Medium | `profiles`, `chat_*`, `usage_logs`, `knowledge_*`, `knowledge_index_jobs`, `evolution_*`, `health_snapshots` | Service-role-only policies missing explicit `WITH CHECK` / role target hardening | Immediate |
| Low | `deploy_platform_registry`, `knowledge_index_stage_log`, `knowledge_index_750_audit` | Already include explicit role scoping and `WITH CHECK` | Monitor |

## Migration update and rollback plan

### Ordered rollout

1. Apply `023_for_all_rls_hardening.sql`:
   - Recreate service-role `FOR ALL` policies with explicit `TO service_role`, `USING`, and `WITH CHECK`.
   - Replace DEPON user-scoped `FOR ALL` policies with operation-specific policies.
2. Validate policy inventory and role behavior in staging.
3. Promote after staging validation and human review.

### Backward compatibility

- Existing policy names for service-role tables are preserved to avoid downstream operational drift.
- DEPON policies move to operation-specific names but preserve the original ownership condition (`auth.uid()::text = user_id::text`).

### Rollback strategy

- Revert migration by dropping newly created operation-specific DEPON policies and reintroducing former single `FOR ALL` policies.
- Restore any prior service-role policies if runtime behavior diverges.
- Rollback scope is isolated to RLS metadata and does not alter table schemas or row data.

## Validation gates (staging)

Run these checks before promotion:

1. **Policy inventory check**: verify all targeted tables have expected policy set after migration.
2. **Service role behavior**: confirm write/read paths succeed for automation tables.
3. **Authenticated behavior**: confirm `platform_users`, `platform_sessions`, and `platform_payments` only permit same-user access and writes.
4. **Anonymous behavior**: confirm no unintended access is granted.
5. **Regression**: verify chat, knowledge ingestion/indexing, deploy registry, and DEPON flows still work.

## Audit summary

- Hardened unsafe `FOR ALL` policies through explicit role boundaries and mutation checks.
- Reduced policy ambiguity on multi-tenant DEPON tables by splitting broad rules into operation-specific rules.
- Downstream note: linked-repo consumers should align any RLS assumptions/documentation references with this hardening wave.
