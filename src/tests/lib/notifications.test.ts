// Centralized Notifications — Unit Tests
// Kompanija SPAJA — Digitalna Industrija

import {
  buildDefaultNotificationPrefs,
  buildNotification,
  dispatchNotification,
  getNotificationHealthView,
  getNotificationOverview,
  getNotificationPreferencesView,
  isChannelAllowed,
} from '../../lib/notifications';

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
  console.log('\n🔔 [notifications] unit tests\n');

  await test('buildNotification keeps legacy queued contract', () => {
    const notification = buildNotification({
      userId: 'u-1',
      stateCode: 'WA',
      channel: 'email',
      subject: 'Subject',
      body: 'Body',
    });
    assert(notification.status === 'queued', 'notification should start queued');
    assert(notification.channel === 'email', 'channel should match input');
    assert(notification.priority === 'normal', 'priority should default to normal');
  });

  await test('state compliance blocks SMS in CA by default', () => {
    const prefs = buildDefaultNotificationPrefs({ userId: 'u-2', stateCode: 'CA' });
    assert(isChannelAllowed('email', 'CA', prefs), 'email should be allowed');
    assert(!isChannelAllowed('sms', 'CA', prefs), 'sms should be blocked');
  });

  await test('dispatchNotification persists in-app fallback when external transport is missing', async () => {
    const repositoryWrites: Record<string, unknown>[] = [];
    const result = await dispatchNotification(
      {
        userId: 'u-3',
        action: 'subscription.activated',
        category: 'billing',
        templateVars: { planId: 'pro' },
      },
      {
        repository: {
          async insertInboxNotification(entry) {
            repositoryWrites.push(entry);
          },
        },
      },
    );

    assert(result.succeeded.includes('in-app'), 'in-app fallback should succeed');
    assert(result.failed.includes('email'), 'email should fail without transport');
    assert(result.persisted, 'result should be persisted');
    assert(repositoryWrites.length === 1, 'exactly one inbox write expected');
  });

  await test('dispatchNotification respects explicit channel opt-out', async () => {
    const result = await dispatchNotification(
      {
        userId: 'u-4',
        action: 'subscription.updated',
        channels: ['sms'],
        preferences: {
          userId: 'u-4',
          stateCode: 'NY',
          channels: { sms: false },
          doNotDisturb: { enabled: true, startHour: 22, endHour: 8 },
          timezone: 'America/New_York',
        },
      },
      {},
    );

    assert(result.skipped.includes('sms'), 'sms should be skipped');
    assert(result.status === 'skipped', 'status should be skipped');
  });

  await test('overview exposes unified source of truth and route inventory', () => {
    const overview = getNotificationOverview();
    assert(overview.sourceOfTruth === '/src/lib/notifications', 'unexpected source of truth');
    assert(overview.inventory.length >= 4, 'inventory should include reorganized flows');
    assert(overview.templates.total >= 4, 'template registry should not be empty');
  });

  await test('preferences view returns default preview state', () => {
    const view = getNotificationPreferencesView('TX', 'preview');
    assert(view.stateCode === 'TX', 'state code should be normalized');
    assert(view.defaultPreferences.channels.email === true, 'email default should be enabled');
  });

  await test('health view reports centralized observability source', () => {
    const health = getNotificationHealthView();
    assert(health.status === 'ok', 'health should be ok');
    assert(health.observabilitySource === 'central-notification-service', 'unexpected observability source');
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
