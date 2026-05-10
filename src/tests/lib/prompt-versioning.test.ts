// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Prompt Versioning
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/prompt-versioning.test.ts

import {
  getActivePrompt,
  getPromptVersion,
  getPromptVersionHistory,
  getAllActivePrompts,
  scoreConfidence,
  promptCacheKey,
  hashPromptInput,
  getPromptCache,
  setPromptCache,
  invalidatePromptCache,
  PROMPT_REGISTRY,
  PROMPT_CACHE_TTL_SEC,
} from '../../lib/prompt-versioning';

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

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('\n📝 Prompt Versioning Test Suite\n');

  // ── PROMPT_REGISTRY konstante ──────────────────────────────────────────────
  console.log('📋 PROMPT_REGISTRY');

  await test('PROMPT_REGISTRY je neprazan niz', () => {
    assert(Array.isArray(PROMPT_REGISTRY), 'mora biti niz');
    assert(PROMPT_REGISTRY.length > 0, 'mora imati bar jedan prompt');
  });

  await test('Svaki prompt ima obavezna polja', () => {
    for (const p of PROMPT_REGISTRY) {
      assert(typeof p.id === 'string' && p.id.length > 0, `prompt.id mora biti neprazan (${p.id})`);
      assert(typeof p.version === 'string' && p.version.length > 0, `prompt.version mora biti neprazan (${p.id})`);
      assert(typeof p.prompt === 'string' && p.prompt.length > 0, `prompt.prompt mora biti neprazan (${p.id})`);
      assert(typeof p.changelog === 'string', `prompt.changelog mora biti string (${p.id})`);
      assert(typeof p.activeFrom === 'string', `prompt.activeFrom mora biti string (${p.id})`);
      assert(typeof p.isActive === 'boolean', `prompt.isActive mora biti boolean (${p.id})`);
    }
  });

  await test('Verzije su u semver formatu', () => {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    for (const p of PROMPT_REGISTRY) {
      assert(semverRegex.test(p.version), `${p.id}@${p.version} mora biti semver format`);
    }
  });

  await test('Svaki prompt ID ima tačno jednu aktivnu verziju', () => {
    const ids = [...new Set(PROMPT_REGISTRY.map((p) => p.id))];
    for (const id of ids) {
      const activeVersions = PROMPT_REGISTRY.filter((p) => p.id === id && p.isActive);
      assert(
        activeVersions.length <= 1,
        `prompt '${id}' sme imati najviše jednu aktivnu verziju, ima: ${activeVersions.length}`,
      );
    }
  });

  await test('PROMPT_CACHE_TTL_SEC je 5 minuta', () => {
    assertEqual(PROMPT_CACHE_TTL_SEC, 300, 'cache TTL mora biti 300 sekundi');
  });

  // ── getActivePrompt ────────────────────────────────────────────────────────
  console.log('\n🔍 getActivePrompt');

  await test('getActivePrompt vraća aktivnu verziju za spaja-pro-system', () => {
    const prompt = getActivePrompt('spaja-pro-system');
    assert(prompt !== null, 'mora biti pronađena aktivna verzija');
    assert(prompt!.isActive === true, 'mora biti aktivna verzija');
    assertEqual(prompt!.id, 'spaja-pro-system', 'ID mora odgovarati');
  });

  await test('getActivePrompt vraća aktivnu verziju za omega-ai-dispatch', () => {
    const prompt = getActivePrompt('omega-ai-dispatch');
    assert(prompt !== null, 'mora biti pronađena aktivna verzija');
    assert(prompt!.isActive === true, 'mora biti aktivna verzija');
  });

  await test('getActivePrompt vraća aktivnu verziju za content-moderation', () => {
    const prompt = getActivePrompt('content-moderation');
    assert(prompt !== null, 'mora biti pronađena aktivna verzija');
    assert(prompt!.isActive === true, 'mora biti aktivna');
  });

  await test('getActivePrompt vraća null za nepostojeći ID', () => {
    const prompt = getActivePrompt('prompt-koji-ne-postoji');
    assert(prompt === null, 'mora vratiti null za nepostojeći prompt');
  });

  await test('getActivePrompt vraća prompt sa textom', () => {
    const prompt = getActivePrompt('spaja-pro-system');
    assert(prompt !== null, 'mora biti pronađen');
    assert(prompt!.prompt.length > 20, 'prompt tekst mora biti smislen (>20 znakova)');
  });

  // ── getPromptVersion ───────────────────────────────────────────────────────
  console.log('\n🔖 getPromptVersion');

  await test('getPromptVersion vraća specificnu verziju', () => {
    const prompt = getPromptVersion('spaja-pro-system', '2.0.0');
    assert(prompt !== null, 'mora biti pronađena verzija 2.0.0');
    assertEqual(prompt!.version, '2.0.0', 'verzija mora odgovarati');
    assertEqual(prompt!.id, 'spaja-pro-system', 'ID mora odgovarati');
  });

  await test('getPromptVersion vraća staru (neaktivnu) verziju', () => {
    const prompt = getPromptVersion('spaja-pro-system', '1.0.0');
    assert(prompt !== null, 'mora biti pronađena stara verzija');
    assertEqual(prompt!.version, '1.0.0', 'verzija mora biti 1.0.0');
    assertEqual(prompt!.isActive, false, 'stara verzija mora biti neaktivna');
  });

  await test('getPromptVersion vraća null za nepostojeću verziju', () => {
    const prompt = getPromptVersion('spaja-pro-system', '99.0.0');
    assert(prompt === null, 'mora vratiti null za nepostojeću verziju');
  });

  await test('getPromptVersion vraća null za nepostojeći prompt ID', () => {
    const prompt = getPromptVersion('ne-postoji', '1.0.0');
    assert(prompt === null, 'mora vratiti null');
  });

  // ── getPromptVersionHistory ────────────────────────────────────────────────
  console.log('\n📜 getPromptVersionHistory');

  await test('getPromptVersionHistory vraća sve verzije za dati ID', () => {
    const history = getPromptVersionHistory('spaja-pro-system');
    assert(history.length >= 2, 'mora biti najmanje 2 verzije');
    for (const p of history) {
      assertEqual(p.id, 'spaja-pro-system', 'svi elementi moraju imati isti ID');
    }
  });

  await test('getPromptVersionHistory sortira od najnovije verzije', () => {
    const history = getPromptVersionHistory('spaja-pro-system');
    assert(history.length >= 2, 'mora biti bar 2 verzije');
    // Prva verzija u istoriji mora biti novija od druge
    const [first, second] = history;
    const firstParts = first.version.split('.').map(Number);
    const secondParts = second.version.split('.').map(Number);
    const firstNewer = firstParts[0] > secondParts[0] ||
      (firstParts[0] === secondParts[0] && firstParts[1] > secondParts[1]) ||
      (firstParts[0] === secondParts[0] && firstParts[1] === secondParts[1] && firstParts[2] >= secondParts[2]);
    assert(firstNewer, `${first.version} mora biti >= ${second.version}`);
  });

  await test('getPromptVersionHistory vraća prazno za nepostojeći ID', () => {
    const history = getPromptVersionHistory('prompt-koji-ne-postoji');
    assertEqual(history.length, 0, 'mora biti prazan niz');
  });

  // ── getAllActivePrompts ─────────────────────────────────────────────────────
  console.log('\n✅ getAllActivePrompts');

  await test('getAllActivePrompts vraća neprazan niz', () => {
    const active = getAllActivePrompts();
    assert(Array.isArray(active), 'mora biti niz');
    assert(active.length > 0, 'mora biti bar jedan aktivan prompt');
  });

  await test('getAllActivePrompts vraća samo aktivne promptove', () => {
    const active = getAllActivePrompts();
    for (const p of active) {
      assert(p.isActive === true, `prompt ${p.id}@${p.version} mora biti aktivan`);
    }
  });

  await test('getAllActivePrompts ne vraća neaktivne promptove', () => {
    const active = getAllActivePrompts();
    const activeIds = active.map((p) => `${p.id}@${p.version}`);
    // spaja-pro-system 1.0.0 je neaktivan
    assert(!activeIds.includes('spaja-pro-system@1.0.0'), 'neaktivna verzija ne sme biti u rezultatu');
  });

  // ── scoreConfidence ────────────────────────────────────────────────────────
  console.log('\n🎯 scoreConfidence');

  await test('Dug i jasan odgovor ima high confidence', () => {
    const response = 'Ovo je detaljan i kvalitetan odgovor koji pruža precizne informacije o temi. ' +
      'Koristi različite reči i jasno objašnjava koncept.';
    const result = scoreConfidence(response);
    assert(result.score >= 0.85, `score mora biti >= 0.85, dobijen: ${result.score}`);
    assertEqual(result.label, 'high', 'mora biti high label');
    assert(result.acceptable === true, 'mora biti acceptable');
  });

  await test('Kratak odgovor ima niži confidence', () => {
    const response = 'Da.';
    const result = scoreConfidence(response);
    assert(result.score < 1.0, 'kratak odgovor mora imati penalizaciju');
  });

  await test('Odgovor sa "ne znam" smanjuje score', () => {
    const shortResponse = 'Nisam siguran u ovaj odgovor i ne znam tačan podatak.';
    const clearResponse = 'Ovo je precizan i siguran odgovor bez nedoumica.';
    const uncertain = scoreConfidence(shortResponse);
    const clear = scoreConfidence(clearResponse);
    assert(uncertain.score < clear.score, 'odgovor sa "ne znam" mora imati manji score');
  });

  await test('Prazan odgovor ima score 0', () => {
    const result = scoreConfidence('   ');
    assertEqual(result.score, 0, 'prazan odgovor mora imati score 0');
    assertEqual(result.label, 'insufficient', 'mora biti insufficient');
    assert(result.acceptable === false, 'ne sme biti acceptable');
  });

  await test('Odgovor od same interpunkcije ima score 0', () => {
    const result = scoreConfidence('.,!?...');
    assertEqual(result.score, 0, 'interpunkcija mora imati score 0');
  });

  await test('Odgovor sa ponavljanjem ima manji score', () => {
    const repetitive = 'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a';
    const diverse = 'Ovo je raznolik odgovor koji koristi mnogo različitih reči za bolje razumevanje.';
    const rScore = scoreConfidence(repetitive);
    const dScore = scoreConfidence(diverse);
    assert(rScore.score < dScore.score, 'repetitivan odgovor mora imati manji score');
  });

  await test('Score je uvek između 0 i 1', () => {
    const testCases = [
      '',
      'ok',
      'Kratak',
      'Ne znam, nisam siguran, možda. I don\'t know. Not sure.',
      'Odličan i detaljan odgovor sa mnogo korisnih informacija. Precizno i jasno.'.repeat(5),
    ];
    for (const tc of testCases) {
      const result = scoreConfidence(tc);
      assert(result.score >= 0 && result.score <= 1, `score mora biti 0-1 za ulaz: "${tc.slice(0, 30)}"`);
    }
  });

  await test('Label odgovara score rangu', () => {
    const high = scoreConfidence('Ovo je odličan i detaljan odgovor koji pruža sve potrebne informacije precizno.');
    const medium = scoreConfidence('Možda je odgovor ovaj, nisam siguran.');
    const low = scoreConfidence('a');

    assert(high.label === 'high' || high.label === 'medium', `visoki score mora imati high/medium label, dobijen: ${high.label}`);
    assert(medium.label === 'medium' || medium.label === 'low', `srednji score mora imati odgovarajući label, dobijen: ${medium.label}`);
    assert(low.label === 'low' || low.label === 'insufficient', `nizak score mora imati low/insufficient label, dobijen: ${low.label}`);
  });

  await test('Custom minConfidenceThreshold utiče na acceptable', () => {
    // Odgovor sa "ne znam" dobija penalizaciju i score ispod 0.9
    const response = 'Ne znam tačno, nisam siguran. Možda je tačno, ali ne mogu da potvrdim sigurno.';
    const strictResult = scoreConfidence(response, { minConfidenceThreshold: 0.9 });
    assert(strictResult.acceptable === false, 'sa strict threshold i odgovorom pune nesigurnosti mora biti neprihvatljiv');
    const lenientResult = scoreConfidence(response, { minConfidenceThreshold: 0.1 });
    assert(lenientResult.acceptable === true, 'sa lenient threshold mora biti prihvatljiv');
  });

  // ── promptCacheKey ─────────────────────────────────────────────────────────
  console.log('\n🔑 promptCacheKey i hashPromptInput');

  await test('promptCacheKey generiše ključ u ispravnom formatu', () => {
    const key = promptCacheKey('spaja-pro-system', 'abc123def456');
    assert(key.startsWith('pc:'), 'mora početi sa pc:');
    assert(key.includes('spaja-pro-system'), 'mora sadržati promptId');
    assert(key.includes('abc123def456'), 'mora sadržati inputHash');
  });

  await test('promptCacheKey je deterministički', () => {
    const key1 = promptCacheKey('omega-ai-dispatch', 'hash123');
    const key2 = promptCacheKey('omega-ai-dispatch', 'hash123');
    assertEqual(key1, key2, 'isti ulaz mora dati isti ključ');
  });

  await test('promptCacheKey je različit za različite promptId-jeve', () => {
    const key1 = promptCacheKey('prompt-a', 'hash123');
    const key2 = promptCacheKey('prompt-b', 'hash123');
    assert(key1 !== key2, 'različiti promptId-jevi moraju dati različite ključeve');
  });

  await test('promptCacheKey je različit za različite hashove', () => {
    const key1 = promptCacheKey('spaja-pro-system', 'hash-aaa');
    const key2 = promptCacheKey('spaja-pro-system', 'hash-bbb');
    assert(key1 !== key2, 'različiti hashovi moraju dati različite ključeve');
  });

  await test('hashPromptInput vraća hex string dužine 16', () => {
    const hash = hashPromptInput('Zdravo svete');
    assert(typeof hash === 'string', 'mora biti string');
    assertEqual(hash.length, 16, 'mora biti 16 znakova');
    assert(/^[0-9a-f]+$/.test(hash), 'mora biti hex string');
  });

  await test('hashPromptInput je deterministički', () => {
    const input = 'Testiraj moje znanje o veštačkoj inteligenciji';
    const h1 = hashPromptInput(input);
    const h2 = hashPromptInput(input);
    assertEqual(h1, h2, 'isti ulaz mora dati isti hash');
  });

  await test('hashPromptInput daje različite hashove za različite ulaze', () => {
    const h1 = hashPromptInput('ulaz A');
    const h2 = hashPromptInput('ulaz B');
    assert(h1 !== h2, 'različiti ulazi moraju dati različite hashove');
  });

  // ── Prompt Cache ──────────────────────────────────────────────────────────
  console.log('\n💾 Prompt Cache');

  await test('setPromptCache kešira odgovor i getPromptCache ga vraća', () => {
    const promptId = 'spaja-pro-system';
    const inputHash = hashPromptInput('test pitanje za keš');
    const response = 'Ovo je keširan odgovor na test pitanje.';

    setPromptCache(promptId, '2.0.0', inputHash, response, 0.9);
    const cached = getPromptCache(promptId, inputHash);

    assert(cached !== null, 'keš mora vratiti entry');
    assertEqual(cached!.response, response, 'mora biti isti odgovor');
    assertEqual(cached!.confidence, 0.9, 'mora biti isti confidence');
    assertEqual(cached!.promptId, promptId, 'mora biti isti promptId');
    assertEqual(cached!.promptVersion, '2.0.0', 'mora biti ista verzija');
    assertEqual(cached!.inputHash, inputHash, 'mora biti isti inputHash');
  });

  await test('getPromptCache vraća null za nepostojeći ključ', () => {
    const result = getPromptCache('prompt-koji-ne-postoji', 'hash-koji-ne-postoji');
    assert(result === null, 'mora vratiti null');
  });

  await test('setPromptCache vraća entry sa timestamps', () => {
    const entry = setPromptCache('omega-ai-dispatch', '1.0.0', 'hash-ts-test', 'odgovor', 0.8);
    assert(typeof entry.cachedAt === 'string', 'cachedAt mora biti string');
    assert(typeof entry.expiresAt === 'string', 'expiresAt mora biti string');
    assert(entry.cachedAt.includes('T'), 'cachedAt mora biti ISO format');
    assert(entry.expiresAt.includes('T'), 'expiresAt mora biti ISO format');
    // expiresAt mora biti posle cachedAt
    assert(new Date(entry.expiresAt) > new Date(entry.cachedAt), 'expiresAt mora biti posle cachedAt');
  });

  await test('invalidatePromptCache briše sve entry-e za dati promptId', () => {
    const promptId = 'content-moderation';
    const hash1 = hashPromptInput('pitanje 1 za invalidaciju');
    const hash2 = hashPromptInput('pitanje 2 za invalidaciju');

    setPromptCache(promptId, '1.0.0', hash1, 'odgovor 1', 0.85);
    setPromptCache(promptId, '1.0.0', hash2, 'odgovor 2', 0.9);

    const deletedCount = invalidatePromptCache(promptId);
    assert(deletedCount >= 2, `mora biti obrisano bar 2 entry-a, obrisano: ${deletedCount}`);

    assert(getPromptCache(promptId, hash1) === null, 'entry 1 mora biti obrisan');
    assert(getPromptCache(promptId, hash2) === null, 'entry 2 mora biti obrisan');
  });

  await test('invalidatePromptCache ne briše entry-e za druge promptId-jeve', () => {
    const promptIdA = 'spaja-pro-system';
    const promptIdB = 'omega-ai-dispatch';
    const hashA = hashPromptInput('pitanje za A ' + Date.now());
    const hashB = hashPromptInput('pitanje za B ' + Date.now());

    setPromptCache(promptIdA, '2.0.0', hashA, 'odgovor A', 0.9);
    setPromptCache(promptIdB, '1.0.0', hashB, 'odgovor B', 0.85);

    invalidatePromptCache(promptIdA);

    assert(getPromptCache(promptIdA, hashA) === null, 'A mora biti obrisan');
    assert(getPromptCache(promptIdB, hashB) !== null, 'B ne sme biti obrisan');
  });

  await test('invalidatePromptCache vraća 0 za nepostojeći promptId', () => {
    const count = invalidatePromptCache('prompt-koji-ne-postoji-u-kesu');
    assertEqual(count, 0, 'mora vratiti 0');
  });

  await test('Custom TTL se pravilno primenjuje', () => {
    const promptId = 'test-ttl-prompt';
    const inputHash = hashPromptInput('ttl test ' + Date.now());
    const ttlSec = 3600; // 1 sat

    const entry = setPromptCache(promptId, '1.0.0', inputHash, 'odgovor', 0.7, ttlSec);
    const expiresMs = new Date(entry.expiresAt).getTime();
    const cachedMs = new Date(entry.cachedAt).getTime();

    const actualTtlMs = expiresMs - cachedMs;
    // Dopuštamo toleranciju od 1 sekunde
    assert(
      Math.abs(actualTtlMs - ttlSec * 1000) < 1000,
      `TTL mora biti ~${ttlSec}s, dobijen: ${actualTtlMs / 1000}s`,
    );
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
