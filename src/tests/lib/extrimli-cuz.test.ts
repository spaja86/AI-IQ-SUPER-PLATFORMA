// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  // Crew
  createCrew, getCrew, listCrews, joinCrew, leaveCrew, acceptMember, transferCaptaincy, _resetCrewStore,
  // Mentor
  registerMentor, getMentor, listMentors, matchMentor, submitMentorFeedback, _resetMentorStore,
  // Feed
  createPost, getPost, listPosts, likePost, unlikePost, flagPost, _resetFeedStore,
  // Reputation
  submitRating, getReputationScore, _resetRatingStore,
  // Health
  getCuzHealthReport,
  // Constants
  CUZ_CONTRACT_VERSION, CUZ_MODULE_VERSION, CUZ_PERSONA_ID, CUZ_PERFORMANCE_MAX_MS, CUZ_API_RESPONSE_MAX_MS,
} from '../../lib/extrimli-cuz';

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

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function assertThrows(fn: () => unknown, expectedSubstring?: string): void {
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
    if (expectedSubstring) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes(expectedSubstring)) {
        throw new Error(`Expected error containing "${expectedSubstring}", got: "${msg}"`);
      }
    }
  }
  if (!threw) throw new Error('Expected a throw but none occurred');
}

function reset(): void {
  _resetCrewStore();
  _resetMentorStore();
  _resetFeedStore();
  _resetRatingStore();
}

async function runTests(): Promise<void> {

  // ─── Constants ─────────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] constants');

  await test('contract version is v1', () => {
    assert(CUZ_CONTRACT_VERSION === 'v1', `expected v1, got ${CUZ_CONTRACT_VERSION}`);
  });

  await test('module version is 1.0.0', () => {
    assert(CUZ_MODULE_VERSION === '1.0.0', `expected 1.0.0, got ${CUZ_MODULE_VERSION}`);
  });

  await test('persona id is extrimli-cuz-social', () => {
    assert(CUZ_PERSONA_ID === 'extrimli-cuz-social', `unexpected: ${CUZ_PERSONA_ID}`);
  });

  await test('performance max is 50ms', () => {
    assert(CUZ_PERFORMANCE_MAX_MS === 50, `expected 50, got ${CUZ_PERFORMANCE_MAX_MS}`);
  });

  await test('api response max is 200ms', () => {
    assert(CUZ_API_RESPONSE_MAX_MS === 200, `expected 200, got ${CUZ_API_RESPONSE_MAX_MS}`);
  });

  // ─── Crew Engine ─────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] crew-engine');
  reset();

  await test('creates a public crew with captain as first member', () => {
    const crew = createCrew({ name: 'Shred Squad', captainId: 'alice', sportIds: ['snowboarding'], region: 'Alps' });
    assert(crew.id.startsWith('crew-'), 'id should start with crew-');
    assert(crew.name === 'Shred Squad', 'name mismatch');
    assert(crew.captainId === 'alice', 'captain mismatch');
    assert(crew.memberIds.includes('alice'), 'captain should be first member');
    assert(crew.isPublic === true, 'should be public by default');
    reset();
  });

  await test('throws if name is empty', () => {
    assertThrows(() => createCrew({ name: '', captainId: 'alice', sportIds: ['bmx'], region: 'NYC' }), 'name is required');
  });

  await test('throws if captainId is empty', () => {
    assertThrows(() => createCrew({ name: 'X', captainId: '', sportIds: ['bmx'], region: 'NYC' }), 'captainId is required');
  });

  await test('throws if sportIds is empty', () => {
    assertThrows(() => createCrew({ name: 'X', captainId: 'alice', sportIds: [], region: 'NYC' }), 'sportIds must be a non-empty array');
  });

  await test('throws if region is empty', () => {
    assertThrows(() => createCrew({ name: 'X', captainId: 'alice', sportIds: ['bmx'], region: '' }), 'region is required');
  });

  await test('getCrew returns undefined for missing crew', () => {
    assert(getCrew('no-such-crew') === undefined, 'should return undefined');
  });

  await test('listCrews filters by sportId', () => {
    reset();
    createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['snowboarding'], region: 'Alps' });
    createCrew({ name: 'Surf Tribe', captainId: 'b', sportIds: ['surfing'], region: 'Hawaii' });
    const result = listCrews({ sportId: 'surfing' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    assert(result[0].name === 'Surf Tribe', 'wrong crew returned');
    reset();
  });

  await test('listCrews filters by region', () => {
    reset();
    createCrew({ name: 'A', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    createCrew({ name: 'B', captainId: 'b', sportIds: ['bmx'], region: 'Berlin' });
    const result = listCrews({ region: 'NYC' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    reset();
  });

  await test('join public crew adds member immediately', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    const result = joinCrew(crew.id, 'bob');
    assert(result.success, `expected success, got: ${result.message}`);
    assert(result.message === 'joined crew', `unexpected message: ${result.message}`);
    const updated = getCrew(crew.id)!;
    assert(updated.memberIds.includes('bob'), 'bob should be a member');
    reset();
  });

  await test('join private crew creates pending request', () => {
    reset();
    const crew = createCrew({ name: 'Elites', captainId: 'a', sportIds: ['bmx'], region: 'NYC', isPublic: false });
    const result = joinCrew(crew.id, 'charlie');
    assert(result.success, `expected success, got: ${result.message}`);
    assert(result.message.includes('awaiting') || result.message.includes('pending'), `should mention pending/awaiting: ${result.message}`);
    assert(!getCrew(crew.id)!.memberIds.includes('charlie'), 'charlie should NOT be a member yet');
    reset();
  });

  await test('acceptMember adds to members for private crew', () => {
    reset();
    const crew = createCrew({ name: 'Elites', captainId: 'a', sportIds: ['bmx'], region: 'NYC', isPublic: false });
    joinCrew(crew.id, 'charlie');
    const result = acceptMember(crew.id, 'a', 'charlie');
    assert(result.success, `expected success, got: ${result.message}`);
    assert(getCrew(crew.id)!.memberIds.includes('charlie'), 'charlie should be a member after accept');
    reset();
  });

  await test('acceptMember rejects non-captain', () => {
    reset();
    const crew = createCrew({ name: 'Elites', captainId: 'a', sportIds: ['bmx'], region: 'NYC', isPublic: false });
    joinCrew(crew.id, 'charlie');
    const result = acceptMember(crew.id, 'stranger', 'charlie');
    assert(!result.success, 'non-captain should not be able to accept');
    reset();
  });

  await test('leaveCrew removes member', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    joinCrew(crew.id, 'bob');
    const result = leaveCrew(crew.id, 'bob');
    assert(result.success, `expected success, got: ${result.message}`);
    assert(!getCrew(crew.id)!.memberIds.includes('bob'), 'bob should no longer be a member');
    reset();
  });

  await test('captain cannot leave without transferring captaincy', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    const result = leaveCrew(crew.id, 'a');
    assert(!result.success, 'captain should not be able to leave');
    assert(result.message.includes('captain'), `message should mention captain: ${result.message}`);
    reset();
  });

  await test('transferCaptaincy changes captain to existing member', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    joinCrew(crew.id, 'bob');
    const updated = transferCaptaincy(crew.id, 'a', 'bob');
    assert(updated.captainId === 'bob', `expected bob, got ${updated.captainId}`);
    reset();
  });

  await test('transferCaptaincy throws for non-member new captain', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    assertThrows(() => transferCaptaincy(crew.id, 'a', 'outsider'), 'must already be a member');
    reset();
  });

  await test('joinCrew returns error for missing crew', () => {
    const result = joinCrew('ghost', 'bob');
    assert(!result.success, 'should fail for missing crew');
    assert(result.message.includes('not found'), `unexpected message: ${result.message}`);
  });

  await test('joinCrew rejects already-a-member', () => {
    reset();
    const crew = createCrew({ name: 'Shredders', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    joinCrew(crew.id, 'bob');
    const again = joinCrew(crew.id, 'bob');
    assert(!again.success, 'second join should fail');
    assert(again.message.includes('already a member'), `unexpected message: ${again.message}`);
    reset();
  });

  await test('joinCrew rejects duplicate pending request', () => {
    reset();
    const crew = createCrew({ name: 'Elites', captainId: 'a', sportIds: ['bmx'], region: 'NYC', isPublic: false });
    joinCrew(crew.id, 'charlie');
    const again = joinCrew(crew.id, 'charlie');
    assert(!again.success, 'second pending request should fail');
    reset();
  });

  // ─── Mentor Engine ────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] mentor-engine');
  reset();

  await test('registers a mentor profile', () => {
    reset();
    const m = registerMentor({ athleteId: 'coach-1', sportIds: ['snowboarding'], experienceLevel: 9, availability: 'available', bio: 'Pro rider.' });
    assert(m.athleteId === 'coach-1', 'athleteId mismatch');
    assert(m.rating === 0, 'initial rating should be 0');
    assert(m.totalSessions === 0, 'initial sessions should be 0');
    reset();
  });

  await test('throws on invalid experienceLevel (>10)', () => {
    assertThrows(() => registerMentor({ athleteId: 'x', sportIds: ['bmx'], experienceLevel: 11, availability: 'available', bio: 'bio' }),
      'experienceLevel must be in [0, 10]');
  });

  await test('throws on NaN experienceLevel', () => {
    assertThrows(() => registerMentor({ athleteId: 'x', sportIds: ['bmx'], experienceLevel: NaN, availability: 'available', bio: 'bio' }),
      'experienceLevel must be in [0, 10]');
  });

  await test('throws on Infinity experienceLevel', () => {
    assertThrows(() => registerMentor({ athleteId: 'x', sportIds: ['bmx'], experienceLevel: Infinity, availability: 'available', bio: 'bio' }),
      'experienceLevel must be in [0, 10]');
  });

  await test('throws if bio is empty', () => {
    assertThrows(() => registerMentor({ athleteId: 'x', sportIds: ['bmx'], experienceLevel: 5, availability: 'available', bio: '' }),
      'bio is required');
  });

  await test('throws if sportIds is empty array', () => {
    assertThrows(() => registerMentor({ athleteId: 'x', sportIds: [], experienceLevel: 5, availability: 'available', bio: 'bio' }),
      'sportIds must be a non-empty array');
  });

  await test('getMentor returns undefined for unknown', () => {
    assert(getMentor('ghost') === undefined, 'should be undefined');
  });

  await test('listMentors filters by sport', () => {
    reset();
    registerMentor({ athleteId: 'm1', sportIds: ['snowboarding'], experienceLevel: 8, availability: 'available', bio: 'x' });
    registerMentor({ athleteId: 'm2', sportIds: ['surfing'],      experienceLevel: 7, availability: 'available', bio: 'y' });
    const result = listMentors({ sportId: 'snowboarding' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    assert(result[0].athleteId === 'm1', 'wrong mentor returned');
    reset();
  });

  await test('listMentors filters by availability', () => {
    reset();
    registerMentor({ athleteId: 'm1', sportIds: ['bmx'], experienceLevel: 8, availability: 'available',   bio: 'x' });
    registerMentor({ athleteId: 'm2', sportIds: ['bmx'], experienceLevel: 9, availability: 'unavailable', bio: 'y' });
    const result = listMentors({ availability: 'available' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    reset();
  });

  await test('matchMentor finds best available mentor', () => {
    reset();
    registerMentor({ athleteId: 'expert', sportIds: ['bmx'], experienceLevel: 8, availability: 'available', bio: 'x' });
    registerMentor({ athleteId: 'busy',   sportIds: ['bmx'], experienceLevel: 9, availability: 'busy',      bio: 'y' });
    const match = matchMentor({ menteeAthleteId: 'newbie', sportId: 'bmx', menteeExperienceLevel: 3 });
    assert(match !== null, 'should find a match');
    assert(match!.mentorAthleteId === 'expert', `expected expert, got ${match!.mentorAthleteId}`);
    assert(match!.experienceGap === 5, `expected gap 5, got ${match!.experienceGap}`);
    assert(match!.matchScore > 0, 'matchScore should be positive');
    reset();
  });

  await test('matchMentor returns null when no mentor registered', () => {
    reset();
    const match = matchMentor({ menteeAthleteId: 'newbie', sportId: 'bmx', menteeExperienceLevel: 3 });
    assert(match === null, 'should return null');
  });

  await test('matchMentor returns null if mentee level >= mentor level', () => {
    reset();
    registerMentor({ athleteId: 'junior', sportIds: ['bmx'], experienceLevel: 2, availability: 'available', bio: 'x' });
    const match = matchMentor({ menteeAthleteId: 'pro', sportId: 'bmx', menteeExperienceLevel: 5 });
    assert(match === null, 'mentor must have higher experience than mentee');
    reset();
  });

  await test('matchMentor returns null for invalid menteeExperienceLevel', () => {
    const match = matchMentor({ menteeAthleteId: 'x', sportId: 'bmx', menteeExperienceLevel: NaN });
    assert(match === null, 'should return null on invalid input');
  });

  await test('submitMentorFeedback updates rating and session count', () => {
    reset();
    registerMentor({ athleteId: 'coach', sportIds: ['bmx'], experienceLevel: 9, availability: 'available', bio: 'x' });
    submitMentorFeedback({ mentorAthleteId: 'coach', menteeAthleteId: 'newbie1', rating: 5, comment: 'Great!' });
    submitMentorFeedback({ mentorAthleteId: 'coach', menteeAthleteId: 'newbie2', rating: 3, comment: 'OK' });
    const updated = getMentor('coach')!;
    assert(updated.rating === 4, `expected rating 4, got ${updated.rating}`);
    assert(updated.totalSessions === 2, `expected 2 sessions, got ${updated.totalSessions}`);
    reset();
  });

  await test('submitMentorFeedback throws on self-rate', () => {
    reset();
    registerMentor({ athleteId: 'coach', sportIds: ['bmx'], experienceLevel: 9, availability: 'available', bio: 'x' });
    assertThrows(
      () => submitMentorFeedback({ mentorAthleteId: 'coach', menteeAthleteId: 'coach', rating: 5, comment: '' }),
      'mentor and mentee cannot be the same athlete'
    );
    reset();
  });

  await test('submitMentorFeedback throws on rating > 5', () => {
    reset();
    registerMentor({ athleteId: 'coach', sportIds: ['bmx'], experienceLevel: 9, availability: 'available', bio: 'x' });
    assertThrows(
      () => submitMentorFeedback({ mentorAthleteId: 'coach', menteeAthleteId: 'x', rating: 6, comment: '' }),
      'rating must be in [1, 5]'
    );
    reset();
  });

  await test('submitMentorFeedback throws on rating < 1', () => {
    reset();
    registerMentor({ athleteId: 'coach', sportIds: ['bmx'], experienceLevel: 9, availability: 'available', bio: 'x' });
    assertThrows(
      () => submitMentorFeedback({ mentorAthleteId: 'coach', menteeAthleteId: 'x', rating: 0, comment: '' }),
      'rating must be in [1, 5]'
    );
    reset();
  });

  await test('submitMentorFeedback throws for unknown mentor', () => {
    assertThrows(
      () => submitMentorFeedback({ mentorAthleteId: 'ghost', menteeAthleteId: 'x', rating: 4, comment: '' }),
      'mentor not found'
    );
  });

  // ─── Feed Engine ──────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] feed-engine');
  reset();

  await test('creates a feed post', () => {
    reset();
    const result = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'Landed a 360!' });
    assert(result.valid, `expected valid, got: ${result.message}`);
    assert(result.post.id.startsWith('post-'), 'id prefix mismatch');
    assert(result.post.likes.length === 0, 'new post should have no likes');
    assert(!result.post.flagged, 'new post should not be flagged');
    reset();
  });

  await test('createPost fails if content is empty', () => {
    const result = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'general', content: '' });
    assert(!result.valid, 'should be invalid');
    assert(result.message.includes('content'), `message should mention content: ${result.message}`);
  });

  await test('createPost fails if athleteId is empty', () => {
    const result = createPost({ athleteId: '', sportId: 'bmx', type: 'general', content: 'x' });
    assert(!result.valid, 'should be invalid');
  });

  await test('createPost fails if sportId is empty', () => {
    const result = createPost({ athleteId: 'alice', sportId: '', type: 'general', content: 'x' });
    assert(!result.valid, 'should be invalid');
  });

  await test('createPost fails on invalid type', () => {
    const result = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'unknown' as never, content: 'x' });
    assert(!result.valid, 'should be invalid');
  });

  await test('getPost returns undefined for missing id', () => {
    assert(getPost('ghost') === undefined, 'should be undefined');
  });

  await test('listPosts filters by sportId', () => {
    reset();
    createPost({ athleteId: 'alice', sportId: 'bmx',     type: 'session', content: 'a' });
    createPost({ athleteId: 'bob',   sportId: 'surfing',  type: 'general', content: 'b' });
    const result = listPosts({ sportId: 'bmx' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    reset();
  });

  await test('listPosts filters by athleteId', () => {
    reset();
    createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session',  content: 'a' });
    createPost({ athleteId: 'alice', sportId: 'bmx', type: 'general',  content: 'b' });
    createPost({ athleteId: 'bob',   sportId: 'bmx', type: 'general',  content: 'c' });
    const result = listPosts({ athleteId: 'alice' });
    assert(result.length === 2, `expected 2, got ${result.length}`);
    reset();
  });

  await test('listPosts filters by type', () => {
    reset();
    createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session',     content: 'a' });
    createPost({ athleteId: 'bob',   sportId: 'bmx', type: 'gear-review', content: 'b' });
    const result = listPosts({ type: 'gear-review' });
    assert(result.length === 1, `expected 1, got ${result.length}`);
    reset();
  });

  await test('likePost adds like', () => {
    reset();
    const { post } = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'x' });
    likePost(post.id, 'bob');
    const updated = getPost(post.id)!;
    assert(updated.likes.includes('bob'), 'bob should be in likes');
    reset();
  });

  await test('likePost is idempotent', () => {
    reset();
    const { post } = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'x' });
    likePost(post.id, 'bob');
    likePost(post.id, 'bob');
    assert(getPost(post.id)!.likes.length === 1, 'duplicate like should not be counted');
    reset();
  });

  await test('unlikePost removes like', () => {
    reset();
    const { post } = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'x' });
    likePost(post.id, 'bob');
    unlikePost(post.id, 'bob');
    assert(getPost(post.id)!.likes.length === 0, 'like should be removed');
    reset();
  });

  await test('flagPost marks post as flagged', () => {
    reset();
    const { post } = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'x' });
    flagPost(post.id);
    assert(getPost(post.id)!.flagged === true, 'should be flagged');
    reset();
  });

  await test('listPosts filters by flagged', () => {
    reset();
    const { post } = createPost({ athleteId: 'alice', sportId: 'bmx', type: 'session', content: 'a' });
    createPost({ athleteId: 'alice', sportId: 'bmx', type: 'general', content: 'b' });
    flagPost(post.id);
    const result = listPosts({ flagged: true });
    assert(result.length === 1, `expected 1 flagged post, got ${result.length}`);
    reset();
  });

  await test('likePost throws for unknown post', () => {
    assertThrows(() => likePost('ghost', 'bob'), 'post not found');
  });

  await test('flagPost throws for unknown post', () => {
    assertThrows(() => flagPost('ghost'), 'post not found');
  });

  // ─── Reputation Engine ────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] reputation-engine');
  reset();

  await test('returns Bronze with no ratings', () => {
    reset();
    const score = getReputationScore('unknown');
    assert(score.tier === 'Bronze', `expected Bronze, got ${score.tier}`);
    assert(score.totalRatings === 0, `expected 0, got ${score.totalRatings}`);
    assert(score.overallScore === 0, `expected 0, got ${score.overallScore}`);
  });

  await test('returns Diamond for perfect (all 5) ratings', () => {
    reset();
    submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 5, skill: 5, reliability: 5 });
    const score = getReputationScore('alice');
    assert(score.overallScore === 100, `expected 100, got ${score.overallScore}`);
    assert(score.tier === 'Diamond', `expected Diamond, got ${score.tier}`);
    reset();
  });

  await test('returns correct score for avg rating 3 (Silver)', () => {
    reset();
    submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 3, skill: 3, reliability: 3 });
    const score = getReputationScore('alice');
    // (3-1)/4 * 100 = 50 → Silver (Gold threshold is ≥ 55)
    assert(score.overallScore === 50, `expected 50, got ${score.overallScore}`);
    assert(score.tier === 'Silver', `expected Silver, got ${score.tier}`);
    reset();
  });

  await test('returns Bronze for lowest (all 1) ratings', () => {
    reset();
    submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 1, skill: 1, reliability: 1 });
    const score = getReputationScore('alice');
    assert(score.overallScore === 0, `expected 0, got ${score.overallScore}`);
    assert(score.tier === 'Bronze', `expected Bronze, got ${score.tier}`);
    reset();
  });

  await test('aggregates multiple raters correctly', () => {
    reset();
    submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 5, skill: 5, reliability: 5 });
    submitRating({ raterId: 'r2', athleteId: 'alice', sportsmanship: 1, skill: 1, reliability: 1 });
    const score = getReputationScore('alice');
    // avg = 3 across all dimensions → 50
    assert(score.overallScore === 50, `expected 50, got ${score.overallScore}`);
    assert(score.totalRatings === 2, `expected 2, got ${score.totalRatings}`);
    reset();
  });

  await test('throws on self-rating', () => {
    assertThrows(
      () => submitRating({ raterId: 'alice', athleteId: 'alice', sportsmanship: 5, skill: 5, reliability: 5 }),
      'athletes cannot rate themselves'
    );
  });

  await test('throws on duplicate rating from same rater', () => {
    reset();
    submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 4, skill: 4, reliability: 4 });
    assertThrows(
      () => submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 2, skill: 2, reliability: 2 }),
      'already rated'
    );
    reset();
  });

  await test('throws on sportsmanship < 1', () => {
    assertThrows(
      () => submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 0, skill: 3, reliability: 3 }),
      'sportsmanship must be in [1, 5]'
    );
  });

  await test('throws on skill > 5', () => {
    assertThrows(
      () => submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 3, skill: 6, reliability: 3 }),
      'skill must be in [1, 5]'
    );
  });

  await test('throws on reliability = NaN', () => {
    assertThrows(
      () => submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 3, skill: 3, reliability: NaN }),
      'reliability must be in [1, 5]'
    );
  });

  await test('throws on reliability = Infinity', () => {
    assertThrows(
      () => submitRating({ raterId: 'r1', athleteId: 'alice', sportsmanship: 3, skill: 3, reliability: Infinity }),
      'reliability must be in [1, 5]'
    );
  });

  // ─── Health Report ─────────────────────────────────────────────────────────
  console.log('\n🔎 [extrimli-cuz] health');
  reset();

  await test('getCuzHealthReport returns correct shape', () => {
    reset();
    const report = getCuzHealthReport();
    assert(report.personaId === 'extrimli-cuz-social', `unexpected personaId: ${report.personaId}`);
    assert(report.contractVersion === 'v1', `unexpected contractVersion: ${report.contractVersion}`);
    assert(report.moduleVersion === '1.0.0', `unexpected moduleVersion: ${report.moduleVersion}`);
    assert(report.performanceMaxMs === 50, `unexpected performanceMaxMs: ${report.performanceMaxMs}`);
    assert(report.apiResponseMaxMs === 200, `unexpected apiResponseMaxMs: ${report.apiResponseMaxMs}`);
  });

  await test('getCuzHealthReport counts are live', () => {
    reset();
    createCrew({ name: 'X', captainId: 'a', sportIds: ['bmx'], region: 'NYC' });
    registerMentor({ athleteId: 'm', sportIds: ['bmx'], experienceLevel: 8, availability: 'available', bio: 'bio' });
    createPost({ athleteId: 'a', sportId: 'bmx', type: 'general', content: 'hello' });
    const report = getCuzHealthReport();
    assert(report.activeCrews    === 1, `expected 1 crew, got ${report.activeCrews}`);
    assert(report.mentorProfiles === 1, `expected 1 mentor, got ${report.mentorProfiles}`);
    assert(report.feedPosts      === 1, `expected 1 post, got ${report.feedPosts}`);
    reset();
  });

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  if (failures.length > 0) {
    console.error('\nFailures:');
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
