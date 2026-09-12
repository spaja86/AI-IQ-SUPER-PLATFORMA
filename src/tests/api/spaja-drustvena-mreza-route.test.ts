import type { NextRequest } from 'next/server';
import { GET as getHealth } from '../../app/api/spaja-drustvena-mreza/health/route';
import { GET as getPregled } from '../../app/api/spaja-drustvena-mreza/pregled/route';
import { GET as getProfiles, POST as postProfiles } from '../../app/api/spaja-drustvena-mreza/profiles/route';
import { GET as getFeed, POST as postFeed } from '../../app/api/spaja-drustvena-mreza/feed/route';
import { GET as getGroups, POST as postGroups } from '../../app/api/spaja-drustvena-mreza/groups/route';
import { GET as getMessages, POST as postMessages } from '../../app/api/spaja-drustvena-mreza/messages/route';
import { GET as getEvents, POST as postEvents } from '../../app/api/spaja-drustvena-mreza/events/route';
import { GET as getNotifications, POST as postNotifications } from '../../app/api/spaja-drustvena-mreza/notifikacije/route';
import {
  _resetSpajaDrustvenaMrezaState,
  SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS,
  SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
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

function makeRequest(url: string, method = 'GET', body?: unknown, headers?: Record<string, string>): NextRequest {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function runTests(): Promise<void> {
  _resetSpajaDrustvenaMrezaState();

  console.log('\n🔗 [spaja-drustvena-mreza] route tests\n');

  await test('GET /health returns headers and readiness', async () => {
    const start = performance.now();
    const response = await getHealth();
    const elapsed = performance.now() - start;
    assert(response.status === 200, `expected 200, got ${response.status}`);
    assert(response.headers.get('X-Spaja-Drustvena-Mreza-Contract-Version') === SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION, 'missing contract version header');
    assert(response.headers.get('X-Spaja-Drustvena-Mreza-Readiness') !== null, 'missing readiness header');
    assert(elapsed <= SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS, `health exceeded ${SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS}ms`);
  });

  await test('GET /pregled returns multi-repo none', async () => {
    const response = await getPregled();
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { multiRepo: { linkedRepoImpact: string } } };
    assert(body.data.multiRepo.linkedRepoImpact === 'none', 'expected linkedRepoImpact none');
  });

  await test('POST /profiles creates a profile', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await postProfiles(makeRequest('http://localhost/api/spaja-drustvena-mreza/profiles', 'POST', {
      handle: 'route.profile',
      displayName: 'Route Profile',
      audience: 'public',
      role: 'customer',
      visibility: 'public',
      bio: 'Created through route',
      interests: ['feed'],
      verified: true,
    }));
    assert(response.status === 201, `expected 201, got ${response.status}`);
    const body = await response.json() as { data: { verified: boolean } };
    assert(body.data.verified === false, 'public profile create should not honor verified=true');
  });

  await test('GET /profiles filters by audience', async () => {
    const response = await getProfiles(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/profiles?audience=internal&viewerId=profile-internal-core',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { profiles: Array<{ audience: string }> } };
    assert(body.data.profiles.every((profile) => profile.audience === 'internal'), 'audience filter failed');
  });

  await test('GET /profiles stays public-only without viewerId', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await getProfiles(makeRequest('http://localhost/api/spaja-drustvena-mreza/profiles'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { profiles: Array<{ id: string }> } };
    assert(body.data.profiles.length === 1 && body.data.profiles[0].id === 'profile-public-builder', 'default profile read should only expose public profile');
  });

  await test('GET /profiles rejects invalid audience filter', async () => {
    const response = await getProfiles(makeRequest('http://localhost/api/spaja-drustvena-mreza/profiles?audience=unknown'));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('GET /profiles rejects unknown viewerId', async () => {
    const response = await getProfiles(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/profiles?viewerId=missing-profile',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'missing-profile' },
    ));
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /feed creates post then rejects self-reaction', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      {
        authorId: 'profile-public-builder',
        audience: 'public',
        visibility: 'public',
        content: 'Route post',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const selfReact = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      {
        action: 'react',
        postId: body.data.id,
        actorId: 'profile-public-builder',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(selfReact.status === 409, `expected 409, got ${selfReact.status}`);
  });

  await test('GET /feed returns count wrapper', async () => {
    const response = await getFeed(makeRequest('http://localhost/api/spaja-drustvena-mreza/feed?audience=public'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { count: number } };
    assert(typeof body.data.count === 'number', 'count should be number');
  });

  await test('GET /feed stays public-only without viewer context', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await getFeed(makeRequest('http://localhost/api/spaja-drustvena-mreza/feed'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { count: number } };
    assert(body.data.count === 0, 'default feed read should not expose restricted seed post');
  });

  await test('GET /feed allows scoped read with viewerId', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await getFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed?viewerId=profile-internal-core',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { posts: Array<{ id: string }> } };
    assert(body.data.posts.some((post) => post.id === 'post-seed-0001'), 'viewerId should expose internal/network-capable feed');
  });

  await test('GET /feed rejects unknown viewerId', async () => {
    const response = await getFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed?viewerId=missing-profile',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'missing-profile' },
    ));
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('GET /feed rejects invalid visibility filter', async () => {
    const response = await getFeed(makeRequest('http://localhost/api/spaja-drustvena-mreza/feed?visibility=secret'));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /feed rejects malformed react payload', async () => {
    const response = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      { action: 'react' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /feed rejects unknown action', async () => {
    const response = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      { action: 'delete' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /feed flag action succeeds', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      {
        authorId: 'profile-public-builder',
        audience: 'public',
        visibility: 'public',
        content: 'Flag me',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const flagged = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      {
        action: 'flag',
        postId: body.data.id,
        actorId: 'profile-partner-ioopenui',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(flagged.status === 200, `expected 200, got ${flagged.status}`);
  });

  await test('POST /feed rejects missing actor header', async () => {
    const response = await postFeed(makeRequest('http://localhost/api/spaja-drustvena-mreza/feed', 'POST', {
      authorId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      content: 'Missing actor',
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /feed rejects actor mismatch', async () => {
    const response = await postFeed(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/feed',
      'POST',
      {
        authorId: 'profile-public-builder',
        audience: 'public',
        visibility: 'public',
        content: 'Actor mismatch',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('POST /groups creates group and join path works', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      {
        name: 'Route Group',
        description: 'A route-created group',
        audience: 'partner',
        visibility: 'network',
        ownerId: 'profile-partner-ioopenui',
        joinMode: 'approval',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const joined = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      {
        action: 'join',
        groupId: body.data.id,
        profileId: 'profile-internal-core',
      },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(joined.status === 200, `expected 200, got ${joined.status}`);
  });

  await test('POST /groups blocks join outside partner scope', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      {
        name: 'Partner restricted',
        description: 'Restricted join path',
        audience: 'partner',
        visibility: 'network',
        ownerId: 'profile-partner-ioopenui',
        joinMode: 'approval',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const joined = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      {
        action: 'join',
        groupId: body.data.id,
        profileId: 'profile-public-builder',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(joined.status === 409, `expected 409, got ${joined.status}`);
  });

  await test('GET /groups returns groups list', async () => {
    const response = await getGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups?viewerId=profile-partner-ioopenui',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 200, `expected 200, got ${response.status}`);
  });

  await test('GET /groups stays public-only without viewerId', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await getGroups(makeRequest('http://localhost/api/spaja-drustvena-mreza/groups'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { count: number } };
    assert(body.data.count === 0, 'default groups read should hide partner seed group');
  });

  await test('GET /groups rejects unknown viewerId', async () => {
    const response = await getGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups?viewerId=missing-profile',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'missing-profile' },
    ));
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /groups rejects malformed join payload', async () => {
    const response = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      { action: 'join' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /groups rejects unknown action', async () => {
    const response = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      { action: 'archive' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /groups rejects missing actor header', async () => {
    const response = await postGroups(makeRequest('http://localhost/api/spaja-drustvena-mreza/groups', 'POST', {
      name: 'No actor group',
      description: 'Missing actor',
      audience: 'public',
      visibility: 'public',
      ownerId: 'profile-public-builder',
      joinMode: 'open',
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /groups rejects owner/profile mismatch', async () => {
    const response = await postGroups(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/groups',
      'POST',
      {
        name: 'Mismatch group',
        description: 'Mismatch actor',
        audience: 'public',
        visibility: 'public',
        ownerId: 'profile-public-builder',
        joinMode: 'open',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('POST /messages creates and replies to conversation', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      {
        participantIds: ['profile-internal-core', 'profile-partner-ioopenui'],
        audience: 'partner',
        visibility: 'network',
        subject: 'Route thread',
        content: 'First',
        authorId: 'profile-internal-core',
      },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const reply = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      {
        action: 'reply',
        threadId: body.data.id,
        authorId: 'profile-partner-ioopenui',
        content: 'Reply',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(reply.status === 200, `expected 200, got ${reply.status}`);
  });

  await test('POST /messages rejects participants outside requested scope', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      {
        participantIds: ['profile-internal-core', 'profile-public-builder'],
        audience: 'partner',
        visibility: 'network',
        subject: 'Partner-only route thread',
        content: 'Blocked',
        authorId: 'profile-internal-core',
      },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('GET /messages returns participant-filtered threads', async () => {
    const response = await getMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages?participantId=profile-internal-core',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 200, `expected 200, got ${response.status}`);
  });

  await test('GET /messages requires participantId', async () => {
    const response = await getMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('GET /messages rejects unknown participantId', async () => {
    const response = await getMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages?participantId=missing-profile',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'missing-profile' },
    ));
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('GET /messages does not expose another participant thread', async () => {
    _resetSpajaDrustvenaMrezaState();
    const response = await getMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages?participantId=profile-public-builder',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 200, `expected 200, got ${response.status}`);
    const body = await response.json() as { data: { count: number } };
    assert(body.data.count === 0, 'non-participant should not enumerate seeded thread');
  });

  await test('GET /messages rejects actor mismatch', async () => {
    const response = await getMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages?participantId=profile-internal-core',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('POST /messages rejects malformed reply payload', async () => {
    const response = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      { action: 'reply' },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /messages rejects unknown action', async () => {
    const response = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      { action: 'close' },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /messages rejects missing actor header', async () => {
    const response = await postMessages(makeRequest('http://localhost/api/spaja-drustvena-mreza/messages', 'POST', {
      participantIds: ['profile-internal-core', 'profile-partner-ioopenui'],
      audience: 'partner',
      visibility: 'network',
      subject: 'No actor',
      content: 'Missing header',
      authorId: 'profile-internal-core',
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /messages rejects author mismatch', async () => {
    const response = await postMessages(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/messages',
      'POST',
      {
        participantIds: ['profile-internal-core', 'profile-partner-ioopenui'],
        audience: 'partner',
        visibility: 'network',
        subject: 'Mismatch',
        content: 'Mismatch author',
        authorId: 'profile-public-builder',
      },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('POST /events creates event and waitlist path works', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        title: 'Route Event',
        description: 'Small event',
        hostId: 'profile-internal-core',
        audience: 'public',
        visibility: 'public',
        scheduledAt: Date.UTC(2026, 8, 20, 13, 0, 0),
        capacity: 2,
      },
      { 'x-spaja-profile-id': 'profile-internal-core' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const attending = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        action: 'rsvp',
        eventId: body.data.id,
        profileId: 'profile-partner-ioopenui',
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(attending.status === 200, `expected 200, got ${attending.status}`);
    const waitlist = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        action: 'rsvp',
        eventId: body.data.id,
        profileId: 'profile-public-builder',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(waitlist.status === 200, `expected 200, got ${waitlist.status}`);
    const waitlistBody = await waitlist.json() as { data: { waitlistIds: string[] } };
    assert(waitlistBody.data.waitlistIds.includes('profile-public-builder'), 'expected waitlist membership');
  });

  await test('POST /events blocks RSVP outside partner scope', async () => {
    _resetSpajaDrustvenaMrezaState();
    const created = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        title: 'Partner Route Event',
        description: 'Restricted RSVP',
        hostId: 'profile-partner-ioopenui',
        audience: 'partner',
        visibility: 'network',
        scheduledAt: Date.UTC(2026, 8, 20, 15, 0, 0),
        capacity: 4,
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(created.status === 201, `expected 201, got ${created.status}`);
    const body = await created.json() as { data: { id: string } };
    const joined = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        action: 'rsvp',
        eventId: body.data.id,
        profileId: 'profile-public-builder',
      },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(joined.status === 409, `expected 409, got ${joined.status}`);
  });

  await test('GET /events returns events list', async () => {
    const response = await getEvents(makeRequest('http://localhost/api/spaja-drustvena-mreza/events'));
    assert(response.status === 200, `expected 200, got ${response.status}`);
  });

  await test('GET /events allows scoped read with viewerId and stays public-only by default', async () => {
    _resetSpajaDrustvenaMrezaState();
    const defaultResponse = await getEvents(makeRequest('http://localhost/api/spaja-drustvena-mreza/events'));
    assert(defaultResponse.status === 200, `expected 200, got ${defaultResponse.status}`);
    const defaultBody = await defaultResponse.json() as { data: { events: Array<{ id: string }> } };
    assert(defaultBody.data.events.length === 1 && defaultBody.data.events[0].id === 'event-seed-0001', 'default event read should only expose the public seed event');

    const viewerResponse = await getEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events?viewerId=profile-partner-ioopenui&audience=partner',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(viewerResponse.status === 200, `expected 200, got ${viewerResponse.status}`);
  });

  await test('GET /events rejects unknown viewerId', async () => {
    const response = await getEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events?viewerId=missing-profile',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'missing-profile' },
    ));
    assert(response.status === 404, `expected 404, got ${response.status}`);
  });

  await test('POST /events rejects malformed RSVP payload', async () => {
    const response = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      { action: 'rsvp' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /events rejects unknown action', async () => {
    const response = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      { action: 'cancel' },
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /events rejects missing actor header', async () => {
    const response = await postEvents(makeRequest('http://localhost/api/spaja-drustvena-mreza/events', 'POST', {
      title: 'Missing actor event',
      description: 'Missing actor',
      hostId: 'profile-public-builder',
      audience: 'public',
      visibility: 'public',
      scheduledAt: Date.UTC(2026, 8, 20, 16, 0, 0),
      capacity: 10,
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /events rejects host/profile mismatch', async () => {
    const response = await postEvents(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/events',
      'POST',
      {
        title: 'Mismatch actor event',
        description: 'Mismatch actor',
        hostId: 'profile-public-builder',
        audience: 'public',
        visibility: 'public',
        scheduledAt: Date.UTC(2026, 8, 20, 17, 0, 0),
        capacity: 10,
      },
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('GET /notifikacije and POST mark-read work together', async () => {
    _resetSpajaDrustvenaMrezaState();
    const listed = await getNotifications(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/notifikacije?recipientId=profile-public-builder&unreadOnly=true',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(listed.status === 200, `expected 200, got ${listed.status}`);
    const body = await listed.json() as { data: { notifications: Array<{ id: string }> } };
    assert(body.data.notifications.length > 0, 'expected unread notifications');
    const updated = await postNotifications(makeRequest('http://localhost/api/spaja-drustvena-mreza/notifikacije', 'POST', {
      notificationId: body.data.notifications[0].id,
    }, { 'x-spaja-profile-id': 'profile-public-builder' }));
    assert(updated.status === 200, `expected 200, got ${updated.status}`);
  });

  await test('GET /notifikacije requires recipientId query param', async () => {
    const response = await getNotifications(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/notifikacije',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('POST /notifikacije rejects wrong recipient for notification', async () => {
    _resetSpajaDrustvenaMrezaState();
    const listed = await getNotifications(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/notifikacije?recipientId=profile-public-builder&unreadOnly=true',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    assert(listed.status === 200, `expected 200, got ${listed.status}`);
    const body = await listed.json() as { data: { notifications: Array<{ id: string }> } };
    assert(body.data.notifications.length > 0, 'expected unread notifications');
    const updated = await postNotifications(makeRequest('http://localhost/api/spaja-drustvena-mreza/notifikacije', 'POST', {
      notificationId: body.data.notifications[0].id,
      recipientId: 'profile-partner-ioopenui',
    }, { 'x-spaja-profile-id': 'profile-public-builder' }));
    assert(updated.status === 409, `expected 409, got ${updated.status}`);
  });

  await test('GET /notifikacije rejects missing actor header', async () => {
    const response = await getNotifications(makeRequest('http://localhost/api/spaja-drustvena-mreza/notifikacije?recipientId=profile-public-builder'));
    assert(response.status === 400, `expected 400, got ${response.status}`);
  });

  await test('GET /notifikacije rejects recipient/header mismatch', async () => {
    const response = await getNotifications(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/notifikacije?recipientId=profile-public-builder',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-partner-ioopenui' },
    ));
    assert(response.status === 409, `expected 409, got ${response.status}`);
  });

  await test('POST /notifikacije rejects missing actor header', async () => {
    _resetSpajaDrustvenaMrezaState();
    const listed = await getNotifications(makeRequest(
      'http://localhost/api/spaja-drustvena-mreza/notifikacije?recipientId=profile-public-builder&unreadOnly=true',
      'GET',
      undefined,
      { 'x-spaja-profile-id': 'profile-public-builder' },
    ));
    const body = await listed.json() as { data: { notifications: Array<{ id: string }> } };
    const response = await postNotifications(makeRequest('http://localhost/api/spaja-drustvena-mreza/notifikacije', 'POST', {
      notificationId: body.data.notifications[0].id,
    }));
    assert(response.status === 400, `expected 400, got ${response.status}`);
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
