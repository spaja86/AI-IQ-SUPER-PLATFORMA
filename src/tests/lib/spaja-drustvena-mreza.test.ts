import {
  _resetSpajaDrustvenaMrezaState,
  createConversation,
  createEvent,
  createGroup,
  createPost,
  createProfile,
  getSpajaDrustvenaMrezaHealthReport,
  getSpajaDrustvenaMrezaPregled,
  joinGroup,
  listNotifications,
  listPosts,
  markNotificationRead,
  reactToPost,
  rsvpEvent,
  SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
  SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
  SPAJA_DRUSTVENA_MREZA_PERSONA_ID,
  SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR,
} from '../../lib/spaja-drustvena-mreza';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${name}`);
    console.error(`     ${message}`);
    failed++;
    failures.push(`${name}: ${message}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTests(): Promise<void> {
  _resetSpajaDrustvenaMrezaState();

  console.log('\n🔎 [spaja-drustvena-mreza] constants\n');

  await test('contract version is v1', () => {
    assert(SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION === 'v1', 'contract version should be v1');
  });

  await test('persona id is stable', () => {
    assert(SPAJA_DRUSTVENA_MREZA_PERSONA_ID === 'spaja-drustvena-mreza-core', 'persona id mismatch');
  });

  await test('linked repo impact is none', () => {
    assert(SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT === 'none', 'linked repo impact should be none');
  });

  console.log('\n🔎 [spaja-drustvena-mreza] health + overview\n');

  await test('seed health report covers all three audience segments', () => {
    _resetSpajaDrustvenaMrezaState();
    const health = getSpajaDrustvenaMrezaHealthReport();
    assert(health.activeProfiles >= 3, 'expected at least 3 seed profiles');
    assert(health.audienceSplit.internal === 1, 'internal seed split mismatch');
    assert(health.audienceSplit.partner === 1, 'partner seed split mismatch');
    assert(health.audienceSplit.public === 1, 'public seed split mismatch');
  });

  await test('overview declares repo-local multi-repo policy', () => {
    const pregled = getSpajaDrustvenaMrezaPregled();
    assert(pregled.multiRepo.linkedRepoImpact === 'none', 'overview should mark linked repo impact as none');
    assert(pregled.rolloutPhases.length === 5, 'expected 5 rollout phases');
  });

  console.log('\n🔎 [spaja-drustvena-mreza] profiles + feed\n');

  await test('creates a profile successfully', () => {
    _resetSpajaDrustvenaMrezaState();
    const result = createProfile({
      handle: 'community.alpha',
      displayName: 'Community Alpha',
      audience: 'public',
      role: 'customer',
      visibility: 'public',
      bio: 'Beta tester.',
      interests: ['events', 'launch'],
    });
    assert(result.ok, `profile create failed: ${result.message}`);
    assert(result.data?.handle === 'community.alpha', 'unexpected profile handle');
  });

  await test('rejects duplicate profile handle', () => {
    _resetSpajaDrustvenaMrezaState();
    const first = createProfile({
      handle: 'unique.handle',
      displayName: 'One',
      audience: 'public',
      role: 'customer',
      visibility: 'public',
      bio: 'One.',
    });
    assert(first.ok, 'first profile should succeed');
    const second = createProfile({
      handle: 'unique.handle',
      displayName: 'Two',
      audience: 'public',
      role: 'customer',
      visibility: 'public',
      bio: 'Two.',
    });
    assert(!second.ok && second.code === 'CONFLICT', 'second profile should be a conflict');
  });

  await test('rejects duplicate post content by the same author', () => {
    _resetSpajaDrustvenaMrezaState();
    const first = createPost({
      authorId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      content: 'Nova ista objava',
    });
    assert(first.ok, 'first post should succeed');
    const second = createPost({
      authorId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      content: 'Nova ista objava',
    });
    assert(!second.ok && second.code === 'CONFLICT', 'duplicate post should be conflict');
  });

  await test('enforces hourly post abuse limit', () => {
    _resetSpajaDrustvenaMrezaState();
    for (let i = 0; i < SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR; i += 1) {
      const result = createPost({
        authorId: 'profile-public-builder',
        audience: 'public',
        visibility: 'public',
        content: `Objava ${i}`,
      });
      assert(result.ok, `post ${i} should succeed`);
    }
    const blocked = createPost({
      authorId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      content: 'Objava 6',
    });
    assert(!blocked.ok && blocked.code === 'TOO_MANY_REQUESTS', 'expected rate limit block');
  });

  await test('rejects self-reaction on feed post', () => {
    _resetSpajaDrustvenaMrezaState();
    const created = createPost({
      authorId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      content: 'Bez self reaction',
    });
    assert(created.ok && created.data, 'post create failed');
    const reaction = reactToPost(created.data.id, 'profile-public-builder');
    assert(!reaction.ok && reaction.code === 'CONFLICT', 'self-reaction should fail');
  });

  console.log('\n🔎 [spaja-drustvena-mreza] groups + messages + events\n');

  await test('approval group stores pending members', () => {
    _resetSpajaDrustvenaMrezaState();
    const group = createGroup({
      name: 'Partner group',
      description: 'Approval join group',
      audience: 'partner',
      visibility: 'network',
      ownerId: 'profile-partner-ioopenui',
      joinMode: 'approval',
    });
    assert(group.ok && group.data, 'group create failed');
    const joined = joinGroup(group.data.id, 'profile-public-builder');
    assert(joined.ok && joined.data?.pendingMemberIds.includes('profile-public-builder'), 'expected pending member');
  });

  await test('conversation create rejects duplicate thread fingerprint', () => {
    _resetSpajaDrustvenaMrezaState();
    const created = createConversation({
      participantIds: ['profile-internal-core', 'profile-public-builder'],
      audience: 'public',
      visibility: 'network',
      subject: 'Sync',
      content: 'Prva poruka',
      authorId: 'profile-internal-core',
    });
    assert(created.ok, 'conversation create failed');
    const duplicate = createConversation({
      participantIds: ['profile-public-builder', 'profile-internal-core'],
      audience: 'public',
      visibility: 'network',
      subject: 'Sync',
      content: 'Druga poruka',
      authorId: 'profile-public-builder',
    });
    assert(!duplicate.ok && duplicate.code === 'CONFLICT', 'duplicate conversation should be blocked');
  });

  await test('event RSVP uses waitlist when capacity is full', () => {
    _resetSpajaDrustvenaMrezaState();
    const created = createEvent({
      title: 'Tiny event',
      description: 'Two seats only',
      hostId: 'profile-internal-core',
      audience: 'public',
      visibility: 'public',
      scheduledAt: Date.UTC(2026, 8, 20, 12, 0, 0),
      capacity: 2,
    });
    assert(created.ok && created.data, 'event create failed');
    const first = rsvpEvent(created.data.id, 'profile-partner-ioopenui');
    assert(first.ok && first.data?.attendeeIds.includes('profile-partner-ioopenui'), 'first RSVP should occupy the last attendee slot');
    assert(first.data?.attendeeIds.length === 2, 'host should count toward total attendee capacity');
    const second = rsvpEvent(created.data.id, 'profile-public-builder');
    assert(second.ok && second.message === 'waitlisted', 'second RSVP should be waitlisted');
    assert(second.data?.waitlistIds.includes('profile-public-builder'), 'second RSVP should land on the waitlist');
  });

  console.log('\n🔎 [spaja-drustvena-mreza] notifications\n');

  await test('notifications can be marked as read', () => {
    _resetSpajaDrustvenaMrezaState();
    const notifications = listNotifications({ recipientId: 'profile-public-builder', unreadOnly: true });
    assert(notifications.length > 0, 'expected unread notifications');
    const result = markNotificationRead(notifications[0].id, 'profile-public-builder');
    assert(result.ok && result.data?.read === true, 'notification should be marked as read');
  });

  await test('feed listing remains deterministic after mutations', () => {
    _resetSpajaDrustvenaMrezaState();
    const before = listPosts().length;
    createPost({
      authorId: 'profile-partner-ioopenui',
      audience: 'partner',
      visibility: 'network',
      content: 'Partner update',
    });
    const after = listPosts().length;
    assert(after === before + 1, 'post count should increment by one');
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
