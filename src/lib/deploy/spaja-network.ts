/** Shared by SPAJA Deploy and the offline Caddy generator. No I/O or activation. */
export const SPAJA_NETWORK_ID = 'spaja.nivo*spaja';
export const EVIDENCE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const BLOCKED_TLDS = new Set(['localhost', 'local', 'test', 'invalid', 'example', 'internal', 'onion', 'nivo-spaja']);
const APPS = {
  platform: { name: 'Centralna SPAJA platforma', subdomain: '', port: 3000 },
  deploy: { name: 'SPAJA Deploy platforma', subdomain: 'deploy', port: 3100 },
  super: { name: 'SUPEROMEGATRAJEKTORIJUM', subdomain: 'super', port: 3200 },
} as const;
export type NetworkAppId = keyof typeof APPS;
export interface NetworkInput {
  schemaVersion: 1;
  networkId: typeof SPAJA_NETWORK_ID;
  publicDomain: string | null;
  listenPort: number;
  applications: { appId: NetworkAppId; spajaId: string; subdomain: string; port: number }[];
}
export interface TlsObservation {
  host: string;
  source: 'tls-probe';
  chainVerified: boolean;
  hostnameVerified: boolean;
  checkedAt: string;
  validFrom: string;
  validTo: string;
  fingerprintSha256: string;
}
/** Only trusted server/operator observations belong here, never request/config JSON. */
export interface NetworkEvidence {
  domain?: { name: string; registeredDomain: string; registered: boolean; ownershipVerified: boolean; checkedAt: string; evidenceRef: string };
  tls?: TlsObservation[];
}
export type TlsStatus = 'unconfigured' | 'unverified' | 'active' | 'expired' | 'stale' | 'failed';

function object(value: unknown, keys: string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid ${label}`);
  if (Object.keys(value).some(key => !keys.includes(key))) throw new Error(`Unknown ${label} field`);
  return value as Record<string, unknown>;
}

/** Syntax/known-invalid check only. Does not prove TLD delegation, registration or ownership. */
export function publicDomain(value: unknown): string {
  if (typeof value !== 'string' || value !== value.toLowerCase() || value.length > 235) throw new Error('Invalid public domain');
  const labels = value.split('.');
  if (labels.length < 2 || labels.some(label => !LABEL.test(label))) throw new Error('Use an ASCII hostname without scheme, wildcard, port or path');
  if (/^\d+$/.test(labels.at(-1)!) || BLOCKED_TLDS.has(labels.at(-1)!)) throw new Error('A registered public domain is required');
  return value;
}

function port(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1024 || value > 65535 || value === 2019) throw new Error('Invalid port (1024–65535; admin port excluded)');
  return value;
}

function logicalId(appId: NetworkAppId): string {
  return appId === 'platform' ? SPAJA_NETWORK_ID : `${SPAJA_NETWORK_ID}/${appId}`;
}

export function defaultNetworkInput(): NetworkInput {
  return {
    schemaVersion: 1, networkId: SPAJA_NETWORK_ID, publicDomain: null, listenPort: 8080,
    applications: (Object.keys(APPS) as NetworkAppId[]).map(appId => ({
      appId, spajaId: logicalId(appId), subdomain: APPS[appId].subdomain, port: APPS[appId].port,
    })),
  };
}

function timestamp(value: unknown): number {
  return typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(value) ? Date.parse(value) : NaN;
}
function fresh(value: unknown, now: number): boolean {
  const checked = timestamp(value);
  return Number.isFinite(checked) && checked <= now && now - checked <= EVIDENCE_MAX_AGE_MS;
}

function tlsState(host: string | null, observation: TlsObservation | undefined, now: number) {
  let status: TlsStatus = host ? 'unverified' : 'unconfigured';
  if (host && observation) {
    const start = timestamp(observation.validFrom), end = timestamp(observation.validTo);
    if (observation.host !== host || observation.source !== 'tls-probe' || observation.chainVerified !== true ||
        observation.hostnameVerified !== true || !/^[a-f0-9]{64}$/i.test(observation.fingerprintSha256) ||
        !Number.isFinite(start) || !Number.isFinite(end) || start >= end || start > now ||
        !Number.isFinite(timestamp(observation.checkedAt)) || timestamp(observation.checkedAt) > now ||
        timestamp(observation.checkedAt) < start) status = 'failed';
    else if (end <= now) status = 'expired';
    else if (!fresh(observation.checkedAt, now)) status = 'stale';
    else status = 'active';
  }
  // Never propagate arbitrary strings/evidence references into the public directory.
  return { status, checkedAt: observation && Number.isFinite(timestamp(observation.checkedAt)) ? observation.checkedAt : null };
}

export function buildNetworkMapping(input: unknown = defaultNetworkInput(), evidence: NetworkEvidence = {}, now = Date.now()) {
  if (!Number.isFinite(now)) throw new Error('Invalid observation clock');
  const config = object(input, ['schemaVersion', 'networkId', 'publicDomain', 'listenPort', 'applications'], 'network');
  if (config.schemaVersion !== 1 || config.networkId !== SPAJA_NETWORK_ID) throw new Error('Unsupported SPAJA network identifier/version');
  const candidate = config.publicDomain === null ? null : publicDomain(config.publicDomain);
  const listenPort = port(config.listenPort);
  if (!Array.isArray(config.applications) || config.applications.length !== 3) throw new Error('Exactly three fixed applications are required');
  const ids = new Set(), logicalIds = new Set(), hosts = new Set(), ports = new Set();
  const tls = new Map<string, TlsObservation>();
  for (const observation of evidence.tls ?? []) {
    if (!observation || typeof observation.host !== 'string' || tls.has(observation.host)) throw new Error('Conflicting TLS observations');
    tls.set(observation.host, observation);
  }
  const applications = config.applications.map(raw => {
    const app = object(raw, ['appId', 'spajaId', 'subdomain', 'port'], 'application');
    if (typeof app.appId !== 'string' || !Object.hasOwn(APPS, app.appId)) throw new Error('Unknown application');
    const appId = app.appId as NetworkAppId;
    if (ids.has(appId) || logicalIds.has(app.spajaId)) throw new Error('Conflicting application or SPAJA ID');
    if (app.spajaId !== logicalId(appId)) throw new Error('SPAJA ID does not match application');
    if (typeof app.subdomain !== 'string' || (app.subdomain !== '' && !LABEL.test(app.subdomain))) throw new Error('Invalid subdomain');
    if (hosts.has(app.subdomain)) throw new Error('Conflicting host mapping');
    const upstreamPort = port(app.port);
    if (upstreamPort === listenPort || ports.has(upstreamPort)) throw new Error('Conflicting upstream port');
    ids.add(appId); logicalIds.add(app.spajaId); hosts.add(app.subdomain); ports.add(upstreamPort);
    const prefix = app.subdomain ? `${app.subdomain}.` : '';
    const publicHost = candidate ? `${prefix}${candidate}` : null;
    if (publicHost && publicHost.length > 253) throw new Error('Public host exceeds DNS length limit');
    const localHost = `${prefix}spaja.localhost`;
    return {
      appId, name: APPS[appId].name, spajaId: logicalId(appId), subdomain: app.subdomain,
      publicHost, publicOrigin: publicHost ? `https://${publicHost}` : null,
      localHost, localOrigin: `http://${localHost}:${listenPort}`,
      proxy: { path: '/', preservePath: true, upstream: `127.0.0.1:${upstreamPort}`, port: upstreamPort },
      tls: tlsState(publicHost, publicHost ? tls.get(publicHost) : undefined, now),
    };
  });
  const domain = evidence.domain;
  let registeredDomain: string | null = null;
  if (domain) {
    try { registeredDomain = publicDomain(domain.registeredDomain); } catch { /* Invalid evidence cannot verify registration. */ }
  }
  const reviewed = !!candidate && domain?.name === candidate && typeof domain.evidenceRef === 'string' &&
    domain.evidenceRef.trim().length > 0 && fresh(domain.checkedAt, now) && !!registeredDomain &&
    (candidate === registeredDomain || candidate.endsWith(`.${registeredDomain}`));
  const registered = reviewed && domain?.registered === true;
  const owned = registered && domain?.ownershipVerified === true;
  return {
    schemaVersion: 1, networkId: SPAJA_NETWORK_ID, provider: 'self-hosted-caddy', configurationOnly: true,
    publicDomain: { candidate, registeredDomain: registered ? registeredDomain : null,
      registration: registered ? 'verified' : 'unverified', ownership: owned ? 'verified' : 'unverified' },
    listenPort, applications,
    publicDnsStatus: 'unverified', upstreamAvailability: 'not-measured',
    // Mapping/TLS observations do not authorize deployment, even with verified ownership.
    publicActivationAllowed: false,
  };
}

export type NetworkMapping = ReturnType<typeof buildNetworkMapping>;

export function resolveSpajaId(mapping: NetworkMapping, id: string) {
  const application = mapping.applications.find(app => app.spajaId === id);
  if (!application) throw new Error('Unknown SPAJA ID');
  return application;
}

/** Safe API/UI projection: do not expose internal ports or operator evidence. */
export function publicNetworkMapping(mapping: NetworkMapping) {
  const { listenPort: _port, ...summary } = mapping;
  return { ...summary, applications: mapping.applications.map(({ proxy: _proxy, localHost: _host, localOrigin: _origin, ...app }) => app) };
}
