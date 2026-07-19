/**
 * Joke API Tests
 */

import {
  DEFAULT_JOKE_FLAGS,
  getRandomJoke,
  getMultipleJokes,
  formatJoke,
  validateFilters,
  type Joke,
  type JokeFilters,
} from '@/lib/jokes/joke-api';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${String(e)}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assert failed: ${message}`);
}

async function runTests(): Promise<void> {
  console.log('\n🎭 Joke API Test Suite\n');

  // ── getRandomJoke ────────────────────────────────────────────────────────

  console.log('📦 1. getRandomJoke');

  await test('Dohvata random šalu bez filtera', async () => {
    const joke = await getRandomJoke();
    assert(joke !== null, 'joke debe biti non-null');
    assert(joke.id !== undefined, 'joke.id mora biti definisan');
    assert(joke.category !== undefined, 'joke.category mora biti definisan');
  });

  await test('Dohvata šalu sa category filtrom', async () => {
    const joke = await getRandomJoke({ category: 'programming' });
    assert(joke !== null, 'joke ne sme biti null');
    assert(
      joke.category?.toLowerCase().includes('programming') ||
        joke.category?.toLowerCase().includes('general'),
      'Šala treba biti iz programming kategorije',
    );
  });

  await test('Dohvata single type šalu', async () => {
    const joke = await getRandomJoke({ type: 'single' });
    assert(joke !== null, 'joke ne sme biti null');
    assert(joke.type === 'single', 'tip must be single');
    assert(joke.joke !== undefined, 'single joke must have joke field');
  });

  await test('Dohvata safe šalu kada je safe=true', async () => {
    const joke = await getRandomJoke({ safe: true });
    assert(joke !== null, 'joke ne sme biti null');
    assert(joke.safe === true, 'safe mode mora biti true');
  });

  // ── formatJoke ────────────────────────────────────────────────────────────

  console.log('\n📦 2. formatJoke');

  const singleJoke: Joke = {
    id: 1,
    category: 'General',
    type: 'single',
    joke: 'Why did the chicken cross the road?',
    flags: DEFAULT_JOKE_FLAGS,
    safe: true,
    lang: 'en',
  };

  const twoPartJoke: Joke = {
    id: 2,
    category: 'General',
    type: 'twopart',
    setup: 'Why did the chicken cross the road?',
    delivery: 'To get to the other side!',
    flags: DEFAULT_JOKE_FLAGS,
    safe: true,
    lang: 'en',
  };

  await test('Formatira single-type šalu', () => {
    const formatted = formatJoke(singleJoke);
    assert(formatted === singleJoke.joke, 'formatted mora biti ista kao original');
  });

  await test('Formatira two-part šalu', () => {
    const formatted = formatJoke(twoPartJoke);
    assert(
      formatted.includes('Why did the chicken cross the road?'),
      'formatted mora sadržati setup',
    );
    assert(
      formatted.includes('To get to the other side!'),
      'formatted mora sadržati delivery',
    );
  });

  // ── validateFilters ────────────────────────────────────────────────────────

  console.log('\n📦 3. validateFilters');

  await test('Validira validne filtere', () => {
    const valid = validateFilters({ category: 'programming', type: 'single' });
    assert(valid === true, 'valid filters');
  });

  await test('Odbija nevalidne kategorije', () => {
    const valid = validateFilters({ category: 'invalid' as any });
    assert(valid === false, 'invalid category');
  });

  await test('Odbija nevalidne tipove', () => {
    const valid = validateFilters({ type: 'invalid' as any });
    assert(valid === false, 'invalid type');
  });

  await test('Prihvata undefined filtere', () => {
    const valid = validateFilters(undefined);
    assert(valid === true, 'undefined filters');
  });

  // ── getMultipleJokes ──────────────────────────────────────────────────────

  console.log('\n📦 4. getMultipleJokes');

  await test('Dohvata više šala', async () => {
    const jokes = await getMultipleJokes(3);
    assert(jokes.length > 0, 'minimum 1 šala');
    assert(jokes.length <= 3, 'maksimalno 3 šale');
    jokes.forEach((joke) => {
      assert(joke.id !== undefined, 'svaka šala mora imati id');
    });
  });

  // ── Summary ────────────────────────────────────────────────────────────────

  console.log(`\n🎭 Rezultat: ${passed} prošlo, ${failed} palo\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
