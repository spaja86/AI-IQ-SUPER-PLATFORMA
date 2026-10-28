import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { SPAJA_NETWORK_ID, buildNetworkMapping, defaultNetworkInput, publicNetworkMapping } from '../../src/lib/deploy/spaja-network.ts';
export { publicDomain } from '../../src/lib/deploy/spaja-network.ts';
export const NETWORK_NAME = SPAJA_NETWORK_ID;

/** Generates configuration only. Does not edit DNS, start services, or authorize a release. */
export function createNetworkConfig(options = {}) {
  const mode = options.mode ?? 'local';
  if (!['local', 'public'].includes(mode)) throw new Error('Mode must be local or public');
  if (options.serveApps !== undefined && typeof options.serveApps !== 'boolean') throw new Error('serveApps must be boolean');
  const legacyKeys = ['domain', 'listenPort', 'platformPort', 'deployPort', 'superPort'];
  if (options.mapping !== undefined && legacyKeys.some(key => options[key] !== undefined)) throw new Error('Use mapping or legacy domain/port options, not both');
  const input = options.mapping ?? defaultNetworkInput();
  if (options.mapping === undefined) {
    input.publicDomain = options.domain ?? null;
    input.listenPort = options.listenPort ?? input.listenPort;
    input.applications = input.applications.map(app => ({ ...app, port: options[`${app.appId}Port`] ?? app.port }));
  }
  const mapping = buildNetworkMapping(input);
  if (mode === 'public' && !mapping.publicDomain.candidate) throw new Error('Public mode requires an explicit domain candidate');
  const listenPort = mapping.listenPort;
  const serving = mode === 'local' || options.serveApps === true;
  const services = mapping.applications.map(app => ({
    id: app.appId, name: app.name, spajaId: app.spajaId,
    host: mode === 'local' ? app.localHost : app.publicHost,
    origin: mode === 'local' ? app.localOrigin : app.publicOrigin,
    upstream: app.proxy.upstream,
    tls: mode === 'local' ? { status: 'disabled', checkedAt: null } : app.tls,
  }));
  const manifest = {
    schemaVersion: 2, networkName: NETWORK_NAME, mode, mapping,
    configurationOnly: true, publicDnsVerified: false, upstreamAvailabilityVerified: false,
    applicationTraffic: serving ? 'configured' : 'maintenance',
    services,
    dns: mode === 'public' ? services.map(({ host }) => ({ name: host, type: 'A', value: 'SERVER_PUBLIC_IPV4_REQUIRED' })) : [],
  };
  const directory = JSON.stringify({ networkName: NETWORK_NAME, mode, applicationTraffic: manifest.applicationTraffic,
    mapping: publicNetworkMapping(mapping),
    services: services.map(({ id, name, spajaId, origin, tls }) => ({ id, name, spajaId, origin, tls })),
    note: 'Gateway configuration is not evidence of upstream availability or public DNS.' });
  const html = `<!doctype html><html lang="sr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPAJA Network</title><style>body{font:18px system-ui;margin:0;background:#101827;color:#e6edf8}main{max-width:900px;margin:auto;padding:48px 24px}h1{font-size:clamp(28px,6vw,52px)}a{display:block;color:#82d6ff;padding:20px;border:1px solid #49627e;border-radius:12px;margin:16px 0;text-decoration:none}small{color:#b6c4d8}code{overflow-wrap:anywhere}</style><main><small>SPAJA DEPLOY · NETWORK</small><h1>${NETWORK_NAME}</h1><p>${mode === 'local' ? 'Lokalni proksi. Ova adresa radi samo na računaru koji pokreće servise.' : serving ? 'Proksi je konfigurisan. Dostupnost aplikacija proverava se zasebno.' : 'Održavanje: aplikacioni saobraćaj je isključen.'}</p>${services.map(s => `<a href="${s.origin}">${s.name}<br><small>${s.origin}</small></a>`).join('')}<p>Naziv mreže je logička oznaka. Povezivanje koristi navedene HTTP/HTTPS adrese.</p></main></html>`;
  const publicHeader = mode === 'public' ? 'strict_sni_host on' : '';
  const global = `{
  admin ${mode === 'local' ? 'off' : '127.0.0.1:2019'}
  ${mode === 'local' ? 'auto_https off' : ''}
  servers {
    ${publicHeader}
    max_header_size 64KB
    timeouts {
      read_header 10s
      read_body 30s
      idle 2m
    }
  }
}
`;
  const blocks = services.map(service => `${service.origin} {
  ${mode === 'local' ? 'bind 127.0.0.1' : ''}
  header {
    -Server
    X-Content-Type-Options nosniff
    X-Spaja-Network "${NETWORK_NAME}"
    X-Request-Id {http.request.uuid}
  }
  route {
    @blockedMethods method CONNECT TRACE
    respond @blockedMethods 405
    @privateFiles path /.env /.env.* /.git /.git/* /node_modules/*
    respond @privateFiles 404
    handle /_spaja/health {
      header Content-Type application/json
      header Cache-Control no-store
      respond ${JSON.stringify('{"status":"edge-up","upstream":"not-measured"}')} 200
    }
    handle /_spaja/network {
      header Content-Type application/json
      header Cache-Control no-store
      respond ${JSON.stringify(directory)} 200
    }
    handle /_spaja/ {
      header Content-Type "text/html; charset=utf-8"
      header Cache-Control no-store
      header Content-Security-Policy "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
      respond ${JSON.stringify(html)} 200
    }
    handle {
      ${serving ? `request_body {
        max_size 8MiB
      }
      ${['Forwarded', 'X-Forwarded-*', 'X-Real-IP', 'True-Client-IP', 'CF-Connecting-IP', 'OAI-Authenticated-*', 'OAI-Sites-Authorization', 'X-Auth-Request-*', 'X-Remote-User', 'X-Request-Id'].map(name => `request_header -${name}`).join('\n      ')}
      reverse_proxy ${service.upstream} {
        header_up X-Request-Id {http.request.uuid}
        transport http {
          dial_timeout 3s
          response_header_timeout 30s
        }
      }` : 'respond "SPAJA network: maintenance; applications are not enabled." 503'}
    }
  }
  handle_errors {
    header Cache-Control no-store
    respond "SPAJA gateway: request could not be completed." {err.status_code}
  }
}
`);
  if (mode === 'local') blocks.push(`http://:${listenPort} {
  bind 127.0.0.1
  respond "Unknown SPAJA host" 421
}
`);
  return { caddyfile: global + '\n' + blocks.join('\n'), manifest };
}

export async function main(args = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: {
    mapping: { type: 'string' }, out: { type: 'string' }, domain: { type: 'string' }, 'serve-apps': { type: 'boolean' },
    'listen-port': { type: 'string' }, 'platform-port': { type: 'string' }, 'deploy-port': { type: 'string' }, 'super-port': { type: 'string' },
  } });
  if (positionals.length !== 1 || !values.out) throw new Error('Usage: node network.mjs local|public --out NEW_DIRECTORY [--mapping FILE | --domain HOST] [--serve-apps] [--platform-port 3000 --deploy-port 3100 --super-port 3200]');
  const options = { mode: positionals[0], domain: values.domain, serveApps: values['serve-apps'] };
  for (const [flag, key] of [['listen-port', 'listenPort'], ['platform-port', 'platformPort'], ['deploy-port', 'deployPort'], ['super-port', 'superPort']]) {
    if (values[flag] !== undefined) options[key] = /^\d+$/.test(values[flag]) ? Number(values[flag]) : NaN;
  }
  if (values.mapping) options.mapping = JSON.parse(await readFile(resolve(values.mapping), 'utf8'));
  const { caddyfile, manifest } = createNetworkConfig(options);
  const output = resolve(values.out);
  // Require a new directory: never overwrite a running configuration or its rollback copy.
  await mkdir(output, { mode: 0o700 });
  await writeFile(resolve(output, 'Caddyfile'), caddyfile, { mode: 0o600, flag: 'wx' });
  await writeFile(resolve(output, 'network.json'), JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  process.stdout.write(JSON.stringify({ output, applicationTraffic: manifest.applicationTraffic, deployed: false }) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
}
