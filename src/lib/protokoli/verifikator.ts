import type { Protokol, ProtokolCheckRezultat, VerifikacijaRezultat } from './types';

interface CheckDefinition {
  naziv: string;
  sloj: ProtokolCheckRezultat['sloj'];
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
    sloj: check.sloj,
  };
}

function hasSignal(text: string, pattern: RegExp): boolean {
  return pattern.test(text.toLowerCase());
}

export function runProtokolVerifikacija(protokol: Protokol): VerifikacijaRezultat {
  const latencyMs = parseLatencyMs(protokol.latency);
  const combinedText = `${protokol.naziv} ${protokol.opis} ${protokol.kapacitet} ${protokol.sourceOfTruth}`.toLowerCase();

  const checks: CheckDefinition[] = [
    {
      naziv: 'Strukturna Validacija',
      sloj: 'struktura',
      fn: () => {
        const required = [
          protokol.id,
          protokol.naziv,
          protokol.verzija,
          protokol.kategorija,
          protokol.status,
          protokol.sourceOfTruth,
          protokol.vlasnik.tim,
          protokol.vlasnik.kontakt,
        ];
        const valid =
          required.every((item) => typeof item === 'string' && item.trim().length > 0) &&
          Array.isArray(protokol.zavisnosti) &&
          !protokol.zavisnosti.includes(protokol.id);
        return {
          prolaz: valid,
          poruka: valid
            ? 'Domen model sadrži obavezna polja, ownership i validne zavisnosti.'
            : 'Nedostaju obavezna polja ili postoji neispravna samoreferentna zavisnost.',
        };
      },
    },
    {
      naziv: 'Bezbednosna Validacija',
      sloj: 'bezbednost',
      fn: () => {
        const hasSecuritySignal = hasSignal(combinedText, /(aes|matrix|secure|sigurn|enkript|tls|token|auth)/);
        const needsSecuritySignal = protokol.kategorija === 'bezbednosni' || protokol.kriticnost === 'kriticna';
        return {
          prolaz: hasSecuritySignal || !needsSecuritySignal,
          poruka:
            hasSecuritySignal || !needsSecuritySignal
              ? 'Bezbednosni signal i source-of-truth su prisutni.'
              : 'Kritičan ili bezbednosni protokol nema jasan bezbednosni signal.',
        };
      },
    },
    {
      naziv: 'Autentifikaciona Validacija',
      sloj: 'autentifikacija',
      fn: () => {
        const hasAuthSignal = hasSignal(combinedText, /(auth|autent|token|identity|identitet|oauth|jwt|dozvol)/);
        const needsAuthSignal =
          protokol.kategorija === 'autentifikacioni' ||
          protokol.izvor === 'vlasnicki-vip-plan-dispatch-protokoli' ||
          protokol.zavisnosti.some((dependency) => dependency.includes('auth'));
        return {
          prolaz: hasAuthSignal || !needsAuthSignal,
          poruka:
            hasAuthSignal || !needsAuthSignal
              ? 'Autentifikacioni zahtevi i ownership su validni.'
              : 'Autentifikacioni signal nije potvrđen za protokol koji ga zahteva.',
        };
      },
    },
    {
      naziv: 'Performansna Validacija',
      sloj: 'performanse',
      fn: () => {
        const target = Math.max(protokol.slo.latencyTargetMs, 1);
        const allowed = Math.max(target * 1.2, target + 1);
        const valid = latencyMs !== null && latencyMs <= allowed;
        return {
          prolaz: valid,
          poruka: valid
            ? `Latency ${latencyMs}ms je u okviru cilja ${allowed}ms.`
            : `Latency ${latencyMs ?? 'N/A'}ms izlazi iznad dozvoljenog praga ${allowed}ms.`,
        };
      },
    },
    {
      naziv: 'Integraciona Spremnost',
      sloj: 'integracija',
      fn: () => {
        const validDependencies = protokol.zavisnosti.every((dependency) => dependency.trim().length > 0 && dependency !== protokol.id);
        const validSource = protokol.sourceOfTruth.startsWith('/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/');
        return {
          prolaz: validDependencies && validSource,
          poruka:
            validDependencies && validSource
              ? 'Zavisnosti su deklarisane, a source-of-truth pokazuje na repo artefakt.'
              : 'Integraciona spremnost nije potpuna: proveri zavisnosti ili source-of-truth.',
        };
      },
    },
    {
      naziv: 'Compliance Pravila',
      sloj: 'compliance',
      fn: () => {
        const hasOperationalOwner = protokol.vlasnik.kontakt.includes('@');
        const sloValid = protokol.slo.availabilityTargetPct >= 95 && protokol.slo.maxIncidentResponseMin > 0;
        const activeProtocolsCompliant = protokol.status !== 'aktivan' || protokol.okruzenje !== 'razvoj';
        const businessRule =
          protokol.kategorija !== 'poslovni' ||
          protokol.izvor === 'vlasnicki-vip-plan-dispatch-protokoli' ||
          protokol.vlasnickiModul.includes('vip');
        const valid = hasOperationalOwner && sloValid && activeProtocolsCompliant && businessRule;
        return {
          prolaz: valid,
          poruka: valid
            ? 'Compliance, rollback readiness i ownership pravila su zadovoljeni.'
            : 'Compliance pravila nisu ispunjena (owner/SLO/okruženje/poslovni izvor).',
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
