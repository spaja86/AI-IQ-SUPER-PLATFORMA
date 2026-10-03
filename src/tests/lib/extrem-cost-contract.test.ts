import assert from 'node:assert/strict';
import { buildVercelCostGovernancePackage } from '../../lib/vercel-billing-governance';
import type { ExtrimliExtremProfilerReport } from '../../lib/extrimli-extrem/types';
import { DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK } from '../../lib/extrimli/developer-create-vrh-ekviladenta-contract';
type Reflection = ExtrimliExtremProfilerReport['dokDikDakDukConsistencyHealth']['developerAndCreateRepoWideReflection'];
// Assign the canonical package to the EXTREM consumer contract (compile-time regression).
type FindPackage<T> = T extends { vercelCostGovernance: infer P } ? P : never;
type Package = FindPackage<Reflection['saradnjaReadyPackage']>;
const value: Package = buildVercelCostGovernancePackage();
assert.equal(value.pretplataExtension, DEVELOPER_CREATE_SARADNJA_READY_POSLOVNA_PONUDA_PRETPLATA_SCOPE_LOCK);
console.log('EXTREM Vercel cost contract regression passed.');
