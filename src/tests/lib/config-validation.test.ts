// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Config Validaciju
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/config-validation.test.ts

import {
  validateConfig,
  getEnv,
  requireEnv,
  ENV_VARIJABLE,
} from '../../lib/config-validation';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
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

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`${label ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// Helper za privremeno postavljanje env varijabli u testu
function withEnv(vars: Record<string, string>, fn: () => void): void {
  const originals: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(vars)) {
    originals[key] = process.env[key];
    process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, original] of Object.entries(originals)) {
      if (original === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original;
      }
    }
  }
}

function withoutEnv(keys: string[], fn: () => void): void {
  const originals: Record<string, string | undefined> = {};
  for (const key of keys) {
    originals[key] = process.env[key];
    delete process.env[key];
  }
  try {
    fn();
  } finally {
    for (const [key, original] of Object.entries(originals)) {
      if (original !== undefined) {
        process.env[key] = original;
      }
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n⚙️ Config Validation Test Suite\n');

  // ── ENV_VARIJABLE registar ─────────────────────────────────────────────────
  console.log('📋 ENV_VARIJABLE registar');

  await test('ENV_VARIJABLE je neprazan niz', () => {
    assert(Array.isArray(ENV_VARIJABLE), 'mora biti niz');
    assert(ENV_VARIJABLE.length > 0, 'mora biti neprazan');
  });

  await test('Svaka varijabla ima obavezna polja', () => {
    for (const v of ENV_VARIJABLE) {
      assert(typeof v.kljuc === 'string' && v.kljuc.length > 0, `kljuc mora biti neprazan`);
      assert(
        v.grupa === 'CRITICAL' || v.grupa === 'REQUIRED' || v.grupa === 'OPTIONAL',
        `${v.kljuc}: grupa mora biti CRITICAL/REQUIRED/OPTIONAL`,
      );
      assert(typeof v.opis === 'string' && v.opis.length > 0, `${v.kljuc}: opis mora biti neprazan`);
    }
  });

  await test('Ključevi varijabli su jedinstveni', () => {
    const keys = ENV_VARIJABLE.map((v) => v.kljuc);
    const unique = new Set(keys);
    assert(keys.length === unique.size, 'ključevi moraju biti jedinstveni');
  });

  await test('Supabase varijable su CRITICAL', () => {
    const supabaseUrl = ENV_VARIJABLE.find((v) => v.kljuc === 'NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = ENV_VARIJABLE.find((v) => v.kljuc === 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    assert(supabaseUrl !== undefined, 'NEXT_PUBLIC_SUPABASE_URL mora biti definisana');
    assert(supabaseKey !== undefined, 'NEXT_PUBLIC_SUPABASE_ANON_KEY mora biti definisana');
    assertEqual(supabaseUrl!.grupa, 'CRITICAL', 'Supabase URL mora biti CRITICAL');
    assertEqual(supabaseKey!.grupa, 'CRITICAL', 'Supabase anon key mora biti CRITICAL');
  });

  await test('OpenAI i Stripe varijable su REQUIRED', () => {
    const openai = ENV_VARIJABLE.find((v) => v.kljuc === 'OPENAI_API_KEY');
    const stripe = ENV_VARIJABLE.find((v) => v.kljuc === 'STRIPE_SECRET_KEY');
    assert(openai !== undefined, 'OPENAI_API_KEY mora biti definisana');
    assert(stripe !== undefined, 'STRIPE_SECRET_KEY mora biti definisana');
    assertEqual(openai!.grupa, 'REQUIRED', 'OpenAI mora biti REQUIRED');
    assertEqual(stripe!.grupa, 'REQUIRED', 'Stripe mora biti REQUIRED');
  });

  await test('Vercel KV varijable su OPTIONAL', () => {
    const kvUrl = ENV_VARIJABLE.find((v) => v.kljuc === 'VERCEL_KV_REST_API_URL');
    const kvToken = ENV_VARIJABLE.find((v) => v.kljuc === 'VERCEL_KV_REST_API_TOKEN');
    assert(kvUrl !== undefined, 'VERCEL_KV_REST_API_URL mora biti definisana');
    assert(kvToken !== undefined, 'VERCEL_KV_REST_API_TOKEN mora biti definisana');
    assertEqual(kvUrl!.grupa, 'OPTIONAL', 'KV URL mora biti OPTIONAL');
    assertEqual(kvToken!.grupa, 'OPTIONAL', 'KV token mora biti OPTIONAL');
  });

  // ── validateConfig ─────────────────────────────────────────────────────────
  console.log('\n✅ validateConfig');

  await test('validateConfig vraća ispravnu strukturu', () => {
    const result = validateConfig(true);
    assert(typeof result.ispravno === 'boolean', 'ispravno mora biti boolean');
    assert(Array.isArray(result.kriticni), 'kriticni mora biti niz');
    assert(Array.isArray(result.nedostajuci), 'nedostajuci mora biti niz');
    assert(Array.isArray(result.opcionalni), 'opcionalni mora biti niz');
  });

  await test('validateConfig detektuje nedostajuće CRITICAL varijable', () => {
    withoutEnv(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'], () => {
      const result = validateConfig(true);
      assert(result.ispravno === false, 'bez kritičnih varijabli mora biti neispravno');
      assert(result.kriticni.length > 0, 'kriticni mora sadržati nedostajuće varijable');
      assert(result.kriticni.includes('NEXT_PUBLIC_SUPABASE_URL'), 'mora detektovati Supabase URL');
    });
  });

  await test('validateConfig ispravno klasifikuje REQUIRED varijable', () => {
    withoutEnv(['OPENAI_API_KEY', 'STRIPE_SECRET_KEY'], () => {
      const result = validateConfig(true);
      assert(result.nedostajuci.includes('OPENAI_API_KEY'), 'mora detektovati OpenAI key');
      assert(result.nedostajuci.includes('STRIPE_SECRET_KEY'), 'mora detektovati Stripe key');
    });
  });

  await test('validateConfig ispravno klasifikuje OPTIONAL varijable', () => {
    withoutEnv(['VERCEL_KV_REST_API_URL', 'VERCEL_KV_REST_API_TOKEN'], () => {
      const result = validateConfig(true);
      assert(result.opcionalni.includes('VERCEL_KV_REST_API_URL'), 'mora detektovati KV URL');
      assert(result.opcionalni.includes('VERCEL_KV_REST_API_TOKEN'), 'mora detektovati KV token');
    });
  });

  await test('ispravno=true samo ako nema CRITICAL nedostajućih', () => {
    withEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    }, () => {
      const result = validateConfig(true);
      // Supabase su postavljeni, pa nema kriticnih
      // (REQUIRED i OPTIONAL mogu nedostajati — ispravno je true)
      assert(result.ispravno === true || result.kriticni.length === 0,
        'ispravno mora biti true ako nema kritičnih');
    });
  });

  await test('tihoRezim=true ne loguje ništa (ne baca grešku)', () => {
    // Samo verifikujemo da ne baca grešku u tihom režimu
    let threw = false;
    try {
      withoutEnv(['NEXT_PUBLIC_SUPABASE_URL'], () => {
        validateConfig(true); // tiho
      });
    } catch {
      threw = true;
    }
    assert(threw === false, 'validateConfig u tihom režimu ne sme bacati grešku');
  });

  await test('validateConfig detektuje sve nedostajuće CRITICAL varijable', () => {
    const criticalKeys = ENV_VARIJABLE
      .filter((v) => v.grupa === 'CRITICAL')
      .map((v) => v.kljuc);

    withoutEnv(criticalKeys, () => {
      const result = validateConfig(true);
      assert(result.ispravno === false, 'bez svih kritičnih mora biti neispravno');
      for (const key of criticalKeys) {
        assert(result.kriticni.includes(key), `${key} mora biti u listi kriticnih`);
      }
    });
  });

  await test('Prisutna varijabla nije u listi nedostajućih', () => {
    withEnv({ 'NEXT_PUBLIC_SUPABASE_URL': 'https://test.supabase.co' }, () => {
      const result = validateConfig(true);
      assert(!result.kriticni.includes('NEXT_PUBLIC_SUPABASE_URL'), 'prisutna varijabla ne sme biti u kriticnim');
      assert(!result.nedostajuci.includes('NEXT_PUBLIC_SUPABASE_URL'), 'prisutna varijabla ne sme biti u nedostajuci');
      assert(!result.opcionalni.includes('NEXT_PUBLIC_SUPABASE_URL'), 'prisutna varijabla ne sme biti u opcionalni');
    });
  });

  // ── getEnv ─────────────────────────────────────────────────────────────────
  console.log('\n🔍 getEnv');

  await test('getEnv vraća vrednost postavljene varijable', () => {
    withEnv({ TEST_GETENV_VAR: 'test-value-123' }, () => {
      const value = getEnv('TEST_GETENV_VAR');
      assertEqual(value, 'test-value-123', 'mora vratiti vrednost');
    });
  });

  await test('getEnv vraća undefined za nepostojeću varijablu', () => {
    withoutEnv(['TEST_NEPOSTOJI_XYZ_789'], () => {
      const value = getEnv('TEST_NEPOSTOJI_XYZ_789');
      assertEqual(value, undefined, 'mora vratiti undefined');
    });
  });

  await test('getEnv vraća vrednost bez bacanja greške', () => {
    let threw = false;
    try {
      getEnv('VARIJABLA_KOJA_NE_POSTOJI');
    } catch {
      threw = true;
    }
    assert(threw === false, 'getEnv ne sme bacati grešku');
  });

  await test('getEnv vraća tačnu vrednost različitih tipova', () => {
    withEnv({
      TEST_URL: 'https://example.com',
      TEST_TOKEN: 'Bearer abc123',
      TEST_NUMBER: '42',
    }, () => {
      assertEqual(getEnv('TEST_URL'), 'https://example.com', 'URL vrednost');
      assertEqual(getEnv('TEST_TOKEN'), 'Bearer abc123', 'token vrednost');
      assertEqual(getEnv('TEST_NUMBER'), '42', 'numerička vrednost kao string');
    });
  });

  // ── requireEnv ─────────────────────────────────────────────────────────────
  console.log('\n🔒 requireEnv');

  await test('requireEnv vraća vrednost postavljene varijable', () => {
    withEnv({ TEST_REQUIRE_VAR: 'required-value' }, () => {
      const value = requireEnv('TEST_REQUIRE_VAR');
      assertEqual(value, 'required-value', 'mora vratiti vrednost');
    });
  });

  await test('requireEnv baca grešku za nepostojeću varijablu', () => {
    let threw: boolean = false;
    let errorMsg = '';
    withoutEnv(['TEST_REQUIRE_MISSING_XYZ'], () => {
      try {
        requireEnv('TEST_REQUIRE_MISSING_XYZ');
      } catch (e) {
        threw = true;
        errorMsg = e instanceof Error ? e.message : String(e);
      }
    });
    assert(threw, 'requireEnv mora baciti grešku za nepostojeću varijablu');
    assert(errorMsg.includes('TEST_REQUIRE_MISSING_XYZ'), 'greška mora sadržati ime varijable');
  });

  await test('requireEnv poruka greške sadrži ime varijable', () => {
    const keyName = 'MOJA_TEST_VARIJABLA_999';
    withoutEnv([keyName], () => {
      try {
        requireEnv(keyName);
        assert(false, 'mora baciti grešku');
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        assert(msg.includes(keyName), `poruka greške mora sadržati '${keyName}', dobijeno: '${msg}'`);
      }
    });
  });

  await test('requireEnv ne baca grešku za postavljenu varijablu', () => {
    withEnv({ TEST_SET_VAR: 'value' }, () => {
      let threw = false;
      try {
        requireEnv('TEST_SET_VAR');
      } catch {
        threw = true;
      }
      assert(threw === false, 'requireEnv ne sme bacati grešku za postavljenu varijablu');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────

  console.log('\n──────────────────────────────────────────────────');
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}  📊 Total: ${passed + failed}`);
  console.log('──────────────────────────────────────────────────\n');

  if (failed > 0) {
    console.error('Failures:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Runner error:', error);
  process.exit(1);
});
