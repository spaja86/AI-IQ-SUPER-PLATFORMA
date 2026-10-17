import { getSpajaInfrastructureHealth } from './spaja-infrastructure';

/** Presence-only metadata; does not probe provider health or provision capacity. */
export function getSpajaServerControlPlane() {
  const health = getSpajaInfrastructureHealth();
  return {
    name: 'SPAJA SERVER', runtime: health.runtime, role: 'application-control-plane',
    configurationStatus: health.readiness,
    configurationScope: 'presence-only',
    availability: { status: 'not-measured', checkedAt: null, source: null },
    availabilityVerified: false,
    execution: { status: 'not-verified', verifiedAt: null, source: null },
    providesJdk: false, buildWorkerImplemented: false, executionEnabled: false,
    adapters: health.adapters.map(adapter => ({ id: adapter.id, role: adapter.role, configured: adapter.configured })),
    boundaries: ['Configuration presence is not a service availability check', 'Local test evidence does not authorize server execution', 'Java toolchain and isolated build workers require separate reviewed infrastructure'],
  };
}
