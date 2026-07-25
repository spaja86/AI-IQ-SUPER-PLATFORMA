import { APP_VERSION } from './constants';
import { generatePlatformBarKod } from './bar-kod';
import { platforme } from './platforme';

export type MikrofileTip =
  | 'faktura'
  | 'licenca'
  | 'ugovor'
  | 'izvestaj'
  | 'akt'
  | 'barkod'
  | 'ostalo';

export type MikrofileStatus = 'aktivan' | 'arhiviran' | 'obrisan' | 'na_cekanju';

export interface MikrofileStavka {
  id: string;
  naziv: string;
  tip: MikrofileTip;
  status: MikrofileStatus;
  velicina: number;
  putanja: string;
  vlasnik: string;
  timestamp: string;
  metapodaci: Record<string, unknown>;
}

interface MikrofileKpi {
  ukupnoFajlova: number;
  ukupnaVelicina: number;
  poTipu: Record<MikrofileTip, number>;
  poStatusu: Record<MikrofileStatus, number>;
}

export interface MikrofileRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  izvor: string;
  stavke: MikrofileStavka[];
  kpi: MikrofileKpi;
}

const MIKROFILE_ID_MOD = 1_000_000_000_000n; // 12-cifreni numerički prostor za stabilan mf-ID prefiks.
const VELICINA_MOD = 120_000n; // Gornja granica za determinističku simulaciju veličine fajla u bajtima.

const TIPOVI: MikrofileTip[] = ['faktura', 'licenca', 'ugovor', 'izvestaj', 'akt', 'barkod', 'ostalo'];
const STATUSI: MikrofileStatus[] = ['aktivan', 'arhiviran', 'na_cekanju', 'obrisan'];

const TIP_META: Record<MikrofileTip, { putanja: string; prefiks: string }> = {
  faktura: { putanja: '/digitalna-industrija-izvoz-faktura', prefiks: 'Faktura' },
  licenca: { putanja: '/issuer-license-control-center', prefiks: 'Licenca' },
  ugovor: { putanja: '/banka', prefiks: 'Ugovor' },
  izvestaj: { putanja: '/analiza-svega', prefiks: 'Izvestaj' },
  akt: { putanja: '/organizacija', prefiks: 'Akt' },
  barkod: { putanja: '/bar-kod', prefiks: 'BarKod' },
  ostalo: { putanja: '/ekosistem', prefiks: 'Dokument' },
};

function hashValue(input: string): bigint {
  let h = 0n;
  for (let i = 0; i < input.length; i++) {
    h = (h * 131n + BigInt(input.charCodeAt(i))) % MIKROFILE_ID_MOD;
  }
  return h;
}

function generateMikrofileId(input: string): string {
  const idNumeric = hashValue(input) % MIKROFILE_ID_MOD;
  return `mf-${idNumeric.toString().padStart(12, '0')}`;
}

function generateVelicina(input: string): number {
  return Number((hashValue(input) % VELICINA_MOD) + 1024n);
}

function initPoTipu(): Record<MikrofileTip, number> {
  return {
    faktura: 0,
    licenca: 0,
    ugovor: 0,
    izvestaj: 0,
    akt: 0,
    barkod: 0,
    ostalo: 0,
  };
}

function initPoStatusu(): Record<MikrofileStatus, number> {
  return {
    aktivan: 0,
    arhiviran: 0,
    obrisan: 0,
    na_cekanju: 0,
  };
}

export function buildMikrofile(userId: string): MikrofileRezultat {
  const now = Date.now();
  const timestamp = new Date(now).toISOString();
  const barKodCache = new Map<string, number>();

  const getBarKod = (platformaId: string): number => {
    const cached = barKodCache.get(platformaId);
    if (cached !== undefined) return cached;
    const generated = generatePlatformBarKod(platformaId);
    barKodCache.set(platformaId, generated);
    return generated;
  };

  const stavke: MikrofileStavka[] = platforme.map((platforma, index) => {
    const tip = TIPOVI[index % TIPOVI.length];
    const status = STATUSI[index % STATUSI.length];
    const meta = TIP_META[tip];
    const ts = new Date(now - index * 60_000).toISOString();
    const seed = `${platforma.id}:${tip}:${index + 1}`;
    const barKod = getBarKod(platforma.id);

    return {
      id: generateMikrofileId(seed),
      naziv: `${meta.prefiks} ${platforma.naziv}`,
      tip,
      status,
      velicina: generateVelicina(seed),
      putanja: meta.putanja,
      vlasnik: platforma.naziv,
      timestamp: ts,
      metapodaci: {
        platformaId: platforma.id,
        kategorija: platforma.kategorija,
        barKod,
        modulRef: `${meta.putanja}/api`,
      },
    };
  });

  const poTipu = initPoTipu();
  const poStatusu = initPoStatusu();
  let ukupnaVelicina = 0;

  for (const stavka of stavke) {
    poTipu[stavka.tip]++;
    poStatusu[stavka.status]++;
    ukupnaVelicina += stavka.velicina;
  }

  return {
    status: 'aktivan',
    userId,
    timestamp,
    verzija: APP_VERSION,
    izvor: 'MIKROFILE Registar Digitalne Industrije',
    stavke,
    kpi: {
      ukupnoFajlova: stavke.length,
      ukupnaVelicina,
      poTipu,
      poStatusu,
    },
  };
}
