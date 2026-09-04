// Egzistencija "Priliv / Odliv" Pravilnik — Unit Testovi
// Kompanija SPAJA — AI IQ SUPER PLATFORMA
//
// Pokretanje: npx tsx src/tests/lib/egzistencija-pravilnik.test.ts

import {
  validateTransition,
  applyTransition,
  validatePriliv,
  klasifikujIzvor,
  validateOdliv,
  izracunajCoolingOff,
  izracunajBalans,
  reconcile,
  detektujAnomalije,
  buildEgzistencijaPravilnikIzvestaj,
  buildEgzistencijaPrilivIzvestaj,
  buildEgzistencijaOdlivIzvestaj,
  INFLOW_LIMITI,
  OUTFLOW_LIMITI,
  EGZISTENCIJA_LIMITI,
  RATE_LIMIT_TRANSAKCIJA_PO_SATU,
  KYC_PRAG_EUR,
  type Entitet,
} from '../../lib/egzistencija-pravilnik';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void): Promise<void> {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertThrows(fn: () => unknown, expectedMsg?: string): void {
  try {
    fn();
    throw new Error('Očekivana greška nije bačena.');
  } catch (e) {
    if (e instanceof Error && e.message === 'Očekivana greška nije bačena.') throw e;
    if (expectedMsg) {
      const actual = e instanceof Error ? e.message : String(e);
      if (!actual.includes(expectedMsg)) {
        throw new Error(`Greška treba da sadrži '${expectedMsg}', ali sadrži '${actual}'`);
      }
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n⚖️  Egzistencija Pravilnik — Test Suite\n');

  // ─── Lifecycle State Machine ─────────────────────────────────────────────

  await test('validateTransition — dozvoljeni prelazi prolaze', () => {
    assert(validateTransition('PENDING', 'ACTIVE') === true, 'PENDING → ACTIVE');
    assert(validateTransition('ACTIVE', 'SUSPENDED') === true, 'ACTIVE → SUSPENDED');
    assert(validateTransition('ACTIVE', 'FROZEN') === true, 'ACTIVE → FROZEN');
    assert(validateTransition('ACTIVE', 'CLOSED') === true, 'ACTIVE → CLOSED');
    assert(validateTransition('DORMANT', 'ACTIVE') === true, 'DORMANT → ACTIVE');
  });

  await test('validateTransition — nedozvoljeni prelazi ne prolaze', () => {
    assert(validateTransition('CLOSED', 'ACTIVE') === false, 'CLOSED → ACTIVE nije dozvoljeno');
    assert(validateTransition('PENDING', 'FROZEN') === false, 'PENDING → FROZEN nije dozvoljeno');
    assert(validateTransition('CLOSED', 'PENDING') === false, 'CLOSED → PENDING nije dozvoljeno');
  });

  await test('applyTransition — validan prelaz menja status', () => {
    const entitet: Entitet = {
      id: 'e-001',
      tip: 'PLAYER_ACCOUNT',
      status: 'PENDING',
      kreiran: new Date().toISOString(),
      azuriran: new Date().toISOString(),
      kycVerifikovan: false,
      transitions: [],
    };
    const result = applyTransition(entitet, 'ACTIVE', 'KYC odobren', 'admin-001');
    assert(result.status === 'ACTIVE', 'status treba biti ACTIVE');
    assert(result.transitions.length === 1, 'treba biti 1 transition');
    assert(result.transitions[0].iz === 'PENDING', 'iz treba biti PENDING');
    assert(result.transitions[0].u === 'ACTIVE', 'u treba biti ACTIVE');
  });

  await test('applyTransition — nevalidan prelaz baca grešku', () => {
    const entitet: Entitet = {
      id: 'e-002',
      tip: 'WALLET',
      status: 'CLOSED',
      kreiran: new Date().toISOString(),
      azuriran: new Date().toISOString(),
      kycVerifikovan: true,
      transitions: [],
    };
    assertThrows(
      () => applyTransition(entitet, 'ACTIVE', 'pokušaj reaktivacije', 'admin'),
      'Nevalidan prelaz',
    );
  });

  await test('applyTransition — čuva audit trail kroz više prelaza', () => {
    let entitet: Entitet = {
      id: 'e-003',
      tip: 'PLAYER_ACCOUNT',
      status: 'PENDING',
      kreiran: new Date().toISOString(),
      azuriran: new Date().toISOString(),
      kycVerifikovan: false,
      transitions: [],
    };
    entitet = applyTransition(entitet, 'ACTIVE', 'aktivacija', 'system');
    entitet = applyTransition(entitet, 'SUSPENDED', 'sumnjiva aktivnost', 'security');
    entitet = applyTransition(entitet, 'ACTIVE', 'provera završena', 'admin');
    assert(entitet.transitions.length === 3, '3 tranzicije u audit trail-u');
    assert(entitet.status === 'ACTIVE', 'finalni status ACTIVE');
  });

  // ─── Inflow Validation ────────────────────────────────────────────────────

  await test('validatePriliv — validan deposit prolazi', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: 100, currency: 'EUR', referenceId: 'ref-001', kycRequired: false },
      new Set(),
      0,
    );
    assert(r.valid === true, 'validan deposit treba da prođe');
    assert(r.greske.length === 0, 'nema grešaka');
  });

  await test('validatePriliv — iznos ispod minimuma greška', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: 0.5, currency: 'EUR', referenceId: 'ref-002', kycRequired: false },
      new Set(),
      0,
    );
    assert(r.valid === false, 'iznos ispod minimuma treba da ne prođe');
    assert(r.greske.some((g) => g.includes('minimalnog limita')), 'greška o minimumu');
  });

  await test('validatePriliv — iznos iznad maksimuma greška', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: 20_000, currency: 'EUR', referenceId: 'ref-003', kycRequired: false },
      new Set(),
      0,
    );
    assert(r.valid === false, 'iznos iznad maksimuma treba da ne prođe');
    assert(r.greske.some((g) => g.includes('maksimalni limit')), 'greška o maksimumu');
  });

  await test('validatePriliv — duplikat referenceId greška', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: 100, currency: 'EUR', referenceId: 'dup-001', kycRequired: false },
      new Set(['dup-001']),
      0,
    );
    assert(r.valid === false, 'duplikat treba da ne prođe');
    assert(r.greske.some((g) => g.includes('Duplikat')), 'greška o duplikatu');
  });

  await test('validatePriliv — rate limit greška', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: 100, currency: 'EUR', referenceId: 'ref-004', kycRequired: false },
      new Set(),
      RATE_LIMIT_TRANSAKCIJA_PO_SATU,
    );
    assert(r.valid === false, 'rate limit treba da ne prođe');
    assert(r.greske.some((g) => g.includes('Rate limit')), 'greška o rate limitu');
  });

  await test('validatePriliv — KYC prag greška za neoznačene', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: KYC_PRAG_EUR + 1, currency: 'EUR', referenceId: 'ref-005', kycRequired: false },
      new Set(),
      0,
    );
    assert(r.valid === false, 'iznos iznad KYC praga bez kycRequired treba da ne prođe');
    assert(r.greske.some((g) => g.includes('KYC')), 'greška o KYC-u');
  });

  await test('validatePriliv — KYC prag prolazi za kycRequired=true', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: KYC_PRAG_EUR + 1, currency: 'EUR', referenceId: 'ref-006', kycRequired: true },
      new Set(),
      0,
    );
    assert(r.valid === true, 'kycRequired=true treba da prođe iznad praga');
  });

  await test('validatePriliv — NaN iznos greška', () => {
    const r = validatePriliv(
      { tip: 'DEPOSIT', amount: NaN, currency: 'EUR', referenceId: 'ref-007', kycRequired: false },
      new Set(),
      0,
    );
    assert(r.valid === false, 'NaN treba da ne prođe');
  });

  await test('klasifikujIzvor — trusted izvori su prepoznati', () => {
    assert(klasifikujIzvor('stripe_card') === 'trusted', 'stripe');
    assert(klasifikujIzvor('paypal_account') === 'trusted', 'paypal');
    assert(klasifikujIzvor('sepa_transfer') === 'trusted', 'sepa');
  });

  await test('klasifikujIzvor — nepoznat izvor je unverified', () => {
    assert(klasifikujIzvor('crypto_exchange') === 'unverified', 'crypto');
    assert(klasifikujIzvor('gift_card') === 'unverified', 'gift card');
  });

  // ─── Outflow Validation ───────────────────────────────────────────────────

  await test('validateOdliv — validan withdrawal prolazi', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: 100, currency: 'EUR' },
      {
        currentBalance: 500,
        wageringRequirementMet: true,
        kycVerifikovan: true,
        dnevniOdlivUkupno: 0,
        suspiciousActivityDetected: false,
      },
    );
    assert(r.valid === true, 'validan withdrawal treba da prođe');
  });

  await test('validateOdliv — insufficient funds greška', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: 1_000, currency: 'EUR' },
      {
        currentBalance: 50,
        wageringRequirementMet: true,
        kycVerifikovan: true,
        dnevniOdlivUkupno: 0,
        suspiciousActivityDetected: false,
      },
    );
    assert(r.valid === false, 'insufficient funds treba da ne prođe');
    assert(r.greske.some((g) => g.includes('Insufficient funds')), 'greška o fondovima');
  });

  await test('validateOdliv — dnevni limit prekoračen greška', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: 3_000, currency: 'EUR' },
      {
        currentBalance: 10_000,
        wageringRequirementMet: true,
        kycVerifikovan: true,
        dnevniOdlivUkupno: 4_000,
        suspiciousActivityDetected: false,
      },
    );
    assert(r.valid === false, 'dnevni limit treba da blokira');
    assert(r.greske.some((g) => g.includes('Dnevni limit')), 'greška o dnevnom limitu');
  });

  await test('validateOdliv — wagering requirement nije ispunjen greška', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: 50, currency: 'EUR' },
      {
        currentBalance: 500,
        wageringRequirementMet: false,
        kycVerifikovan: true,
        dnevniOdlivUkupno: 0,
        suspiciousActivityDetected: false,
      },
    );
    assert(r.valid === false, 'wagering requirement treba da blokira');
    assert(r.greske.some((g) => g.includes('Wagering')), 'greška o wagering');
  });

  await test('validateOdliv — AML check za neVerifikovane iznad praga', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: OUTFLOW_LIMITI.AML_PRAG_EUR + 1, currency: 'EUR' },
      {
        currentBalance: 10_000,
        wageringRequirementMet: true,
        kycVerifikovan: false,
        dnevniOdlivUkupno: 0,
        suspiciousActivityDetected: false,
      },
    );
    assert(r.valid === false, 'AML check treba da blokira');
    assert(r.greske.some((g) => g.includes('AML')), 'greška o AML');
  });

  await test('validateOdliv — fraud detection automatski hold', () => {
    const r = validateOdliv(
      { tip: 'WITHDRAWAL', amount: 100, currency: 'EUR' },
      {
        currentBalance: 500,
        wageringRequirementMet: true,
        kycVerifikovan: true,
        dnevniOdlivUkupno: 0,
        suspiciousActivityDetected: true,
      },
    );
    assert(r.valid === false, 'sumnjiva aktivnost treba da blokira');
    assert(r.greske.some((g) => g.includes('hold')), 'greška o holdu');
  });

  await test('izracunajCoolingOff — verifikovani 24h', () => {
    const od = new Date('2026-01-01T12:00:00Z');
    const result = izracunajCoolingOff(true, od);
    const diffH = (result.getTime() - od.getTime()) / 3_600_000;
    assert(diffH === 24, `Verifikovani treba 24h, dobijeno: ${diffH}`);
  });

  await test('izracunajCoolingOff — neverifikovani 72h', () => {
    const od = new Date('2026-01-01T12:00:00Z');
    const result = izracunajCoolingOff(false, od);
    const diffH = (result.getTime() - od.getTime()) / 3_600_000;
    assert(diffH === 72, `Neverifikovani treba 72h, dobijeno: ${diffH}`);
  });

  // ─── Balance & Reconciliation ─────────────────────────────────────────────

  await test('izracunajBalans — prazan niz vraća 0', () => {
    assert(izracunajBalans([]) === 0, 'prazan niz');
  });

  await test('izracunajBalans — BALANCE = Σ(INFLOW) − Σ(OUTFLOW)', () => {
    const result = izracunajBalans([
      { direction: 'credit', amount: 1000 },
      { direction: 'credit', amount: 500 },
      { direction: 'debit', amount: 300 },
      { direction: 'debit', amount: 100 },
    ]);
    assert(result === 1100, `Očekivano 1100, dobijeno: ${result}`);
  });

  await test('reconcile — usklađen saldo nema alert', () => {
    const r = reconcile(700, [
      { direction: 'credit', amount: 1000 },
      { direction: 'debit', amount: 300 },
    ]);
    assert(r.uskladjen === true, 'treba biti usklađen');
    assert(r.alert === false, 'bez alert-a');
    assert(r.discrepancy < 0.000001, 'discrepancy blizu nule');
  });

  await test('reconcile — neusklađen saldo postavlja alert', () => {
    const r = reconcile(600, [
      { direction: 'credit', amount: 1000 },
      { direction: 'debit', amount: 300 },
    ]);
    assert(r.uskladjen === false, 'treba biti neusklađen');
    assert(r.alert === true, 'alert treba biti postavljen');
    assert(r.discrepancy === 100, `Discrepancy treba biti 100, dobijeno: ${r.discrepancy}`);
  });

  // ─── Anomaly Detection ────────────────────────────────────────────────────

  await test('detektujAnomalije — negativan saldo detektuje NEGATIVE_BALANCE', () => {
    const reconcRezultat = reconcile(-50, [{ direction: 'debit', amount: 50 }]);
    const anomalije = detektujAnomalije('acc-001', -50, reconcRezultat);
    assert(
      anomalije.some((a) => a.tip === 'NEGATIVE_BALANCE'),
      'Negativan saldo treba da detektuje anomaliju',
    );
    assert(
      anomalije.some((a) => a.akcija === 'FREEZE_ACCOUNT'),
      'Akcija treba biti FREEZE_ACCOUNT',
    );
  });

  await test('detektujAnomalije — neslaganje salda detektuje BALANCE_DISCREPANCY', () => {
    const reconcRezultat = reconcile(500, [{ direction: 'credit', amount: 700 }]);
    const anomalije = detektujAnomalije('acc-002', 500, reconcRezultat);
    assert(
      anomalije.some((a) => a.tip === 'BALANCE_DISCREPANCY'),
      'Neslaganje treba da detektuje anomaliju',
    );
  });

  await test('detektujAnomalije — usklađen pozitivan saldo nema anomalija', () => {
    const reconcRezultat = reconcile(700, [
      { direction: 'credit', amount: 1000 },
      { direction: 'debit', amount: 300 },
    ]);
    const anomalije = detektujAnomalije('acc-003', 700, reconcRezultat);
    assert(anomalije.length === 0, 'Nema anomalija za čist saldo');
  });

  // ─── Builder Functions ────────────────────────────────────────────────────

  await test('buildEgzistencijaPravilnikIzvestaj — vraća validan izveštaj', () => {
    const r = buildEgzistencijaPravilnikIzvestaj('test-user');
    assert(r.status === 'aktivan', 'status aktivan');
    assert(r.pravilnikVerzija === '1.0.0', 'pravilnik verzija');
    assert(r.kpi.ukupnoPrilivTipova === 5, '5 tipova prililva');
    assert(r.kpi.ukupnoOdlivTipova === 6, '6 tipova odliva');
    assert(r.kpi.maxDepositEUR === EGZISTENCIJA_LIMITI.DEPOSIT_MAX_EUR, 'max deposit');
    assert(r.kpi.dormantPeriodMeseci === 12, 'dormant 12 meseci');
    assert(r.kpi.accountClosureHoldDana === 30, 'closure hold 30 dana');
  });

  await test('buildEgzistencijaPrilivIzvestaj — vraća validan izveštaj', () => {
    const r = buildEgzistencijaPrilivIzvestaj('test-user');
    assert(r.status === 'aktivan', 'status aktivan');
    assert(r.kpi.ukupnoTipova === 5, '5 tipova prililva');
    assert(r.kpi.maxDepositEUR === INFLOW_LIMITI.DEPOSIT.max, 'max deposit');
    assert(r.kpi.kycPragEUR === KYC_PRAG_EUR, 'KYC prag');
    assert(r.pravila.antiDuplication === true, 'anti-duplication uključen');
  });

  await test('buildEgzistencijaOdlivIzvestaj — vraća validan izveštaj', () => {
    const r = buildEgzistencijaOdlivIzvestaj('test-user');
    assert(r.status === 'aktivan', 'status aktivan');
    assert(r.kpi.ukupnoTipova === 6, '6 tipova odliva');
    assert(r.kpi.minWithdrawalEUR === OUTFLOW_LIMITI.WITHDRAWAL_MIN_EUR, 'min withdrawal');
    assert(r.kpi.maxDnevnoWithdrawalEUR === OUTFLOW_LIMITI.WITHDRAWAL_MAX_DAILY_EUR, 'max dnevno');
    assert(r.pravila.wageringRequirementCheck === true, 'wagering check uključen');
    assert(r.pravila.autoHoldOnFraud === true, 'auto hold uključen');
  });

  // ─── Rezultat ────────────────────────────────────────────────────────────

  console.log(`\n📊 Rezultat: ${passed} prošlo, ${failed} palo\n`);
  if (failures.length > 0) {
    console.error('Neuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatalna greška u test suite:', e);
  process.exit(1);
});
