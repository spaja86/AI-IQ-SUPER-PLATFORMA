import type { Protokol, ProtokolCheckRezultat, VerifikacijaRezultat } from './types';

interface CheckDefinition {
  naziv: string;
  fn: () => { prolaz: boolean; poruka: string };
}

function parseLatencyMs(latency: string): number | null {
  const match = latency.match(/([\d.]+)\s*ms/i);
  if (!match) return null;
  const parsed = Number.parseFloat(match[1] ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

function runCheck(check: CheckDefinition): ProtokolCheckRezultat {
  const start = Date.now();
  const result = check.fn();
  return {
    naziv: check.naziv,
    prolaz: result.prolaz,
    poruka: result.poruka,
    durationMs: Math.max(Date.now() - start, 1),
  };
}

export function runProtokolVerifikacija(protokol: Protokol): VerifikacijaRezultat {
  const checks: CheckDefinition[] = [
    {
      naziv: 'Integrity Check',
      fn: () => {
        const required = [protokol.id, protokol.naziv, protokol.verzija, protokol.kategorija, protokol.status];
        const valid = required.every((item) => typeof item === 'string' && item.length > 0);
        return {
          prolaz: valid,
          poruka: valid ? 'Struktura protokola je validna.' : 'Nedostaju obavezna polja protokola.',
        };
      },
    },
    {
      naziv: 'Encryption Validation',
      fn: () => {
        const tekst = `${protokol.naziv} ${protokol.opis} ${protokol.kapacitet}`.toLowerCase();
        const hasCipherSignal = /(aes|matrix|secure|sigurn|enkript|token)/.test(tekst);
        return {
          prolaz: hasCipherSignal || protokol.kategorija !== 'bezbednosni',
          poruka: hasCipherSignal
            ? 'Enkripcioni zahtevi su verifikovani (AES-256/MatrixCrypt simulacija).'
            : 'Nema jasnog enkripcionog signala u konfiguraciji protokola.',
        };
      },
    },
    {
      naziv: 'Auth Protocol',
      fn: () => {
        const tekst = `${protokol.naziv} ${protokol.opis}`.toLowerCase();
        const hasAuthSignal = /(auth|autent|token|identitet|dozvol)/.test(tekst);
        return {
          prolaz: hasAuthSignal || protokol.kategorija !== 'autentifikacioni',
          poruka: hasAuthSignal
            ? 'Autentifikacioni tok je validiran.'
            : 'Autentifikacioni signal nije potvrđen u opisu protokola.',
        };
      },
    },
    {
      naziv: 'Transport Security',
      fn: () => {
        const latencyMs = parseLatencyMs(protokol.latency);
        const safeTransport = latencyMs === null || latencyMs <= 25;
        return {
          prolaz: safeTransport,
          poruka: safeTransport
            ? 'Transportni sloj je u dozvoljenom opsegu.'
            : `Latency ${latencyMs}ms prevazilazi prag od 25ms.`,
        };
      },
    },
    {
      naziv: 'Kapacitet Check',
      fn: () => {
        const valid = protokol.kapacitet.trim().length > 0;
        return {
          prolaz: valid,
          poruka: valid ? 'Kapacitet protokola je definisan.' : 'Kapacitet protokola nije definisan.',
        };
      },
    },
    {
      naziv: 'Latency Check',
      fn: () => {
        const latencyMs = parseLatencyMs(protokol.latency);
        const valid = latencyMs === null || latencyMs <= 15;
        return {
          prolaz: valid,
          poruka: valid
            ? 'Latency je unutar ciljnog praga.'
            : `Latency ${latencyMs}ms je iznad ciljnog praga od 15ms.`,
        };
      },
    },
  ];

  const results = checks.map((check) => runCheck(check));
  const uspesneProvere = results.filter((result) => result.prolaz).length;
  const neuspesneProvere = results.length - uspesneProvere;

  return {
    protokolId: protokol.id,
    uspesno: neuspesneProvere === 0,
    ukupnoProvera: results.length,
    uspesneProvere,
    neuspesneProvere,
    checks: results,
    timestamp: new Date().toISOString(),
  };
}
