(async () => {
const { test } = await import('node:test');
const { default: assert } = await import('node:assert/strict');
const fs = await import('node:fs');
const { proposeSync } = await import('../omega-sync.cjs');

function fixture({ ahead = 1, existing = [], branches = ['main', 'master', 'feature/a', 'copilot/a'], fail } = {}) {
  const calls = [];
  const listBranches = Symbol('branches');
  const github = {
    rest: {
      repos: { listBranches, compareCommits: async args => {
        calls.push(['compare', args]);
        if (fail) throw new Error('API unavailable');
        return { data: { ahead_by: ahead } };
      } },
      pulls: {
        list: async args => { calls.push(['list', args]); return { data: existing }; },
        create: async args => { calls.push(['create', args]); return { data: { html_url: 'https://github.com/example/pull/1' } }; },
      },
    },
    paginate: async method => { assert.equal(method, listBranches); return branches.map(name => ({ name })); },
  };
  const core = { summary: { addHeading() { return this; }, addRaw() { return this; }, async write() {} } };
  const context = { repo: { owner: 'owner', repo: 'repo' }, ref: 'refs/heads/main', eventName: 'schedule' };
  return { github, core, context, calls };
}

test('incoming changes become draft PRs; API capability has no merge or ref writes', async () => {
  const f = fixture();
  await proposeSync({ ...f, direction: 'into-main' });
  const prs = f.calls.filter(([op]) => op === 'create').map(([, args]) => args);
  assert.deepEqual(prs.map(pr => [pr.head, pr.base, pr.draft]), [['feature/a', 'main', true], ['copilot/a', 'main', true]]);
});
test('main-to-branch sync is restricted to copilot branches and also uses draft PRs', async () => {
  const f = fixture();
  await proposeSync({ ...f, direction: 'from-main' });
  const prs = f.calls.filter(([op]) => op === 'create').map(([, args]) => args);
  assert.deepEqual(prs.map(pr => [pr.head, pr.base, pr.draft]), [['main', 'copilot/a', true]]);
});
test('up-to-date branches are neither changed nor deleted', async () => {
  const f = fixture({ ahead: 0 });
  await proposeSync({ ...f, direction: 'into-main' });
  assert.equal(f.calls.filter(([op]) => op === 'create').length, 0);
});
test('existing PR including a draft is reused without editing it or its reviews', async () => {
  const f = fixture({ existing: [{ html_url: 'https://github.com/example/pull/2' }] });
  await proposeSync({ ...f, direction: 'into-main' });
  assert.equal(f.calls.filter(([op]) => op === 'create').length, 0);
});
test('API failures fail closed instead of reporting success', async () => {
  const f = fixture({ fail: true });
  await assert.rejects(proposeSync({ ...f, direction: 'into-main' }), /API unavailable/);
  assert.equal(f.calls.filter(([op]) => op === 'create').length, 0);
});
for (const [eventName, ref] of [['push', 'refs/heads/main'], ['workflow_dispatch', 'refs/heads/copilot/a'], ['pull_request', 'refs/heads/main']]) {
  test(`rejects untrusted invocation ${eventName} ${ref}`, async () => {
    const f = fixture();
    Object.assign(f.context, { eventName, ref });
    await assert.rejects(proposeSync({ ...f, direction: 'into-main' }), /trusted main/);
    assert.equal(f.calls.length, 0);
  });
}
test('invalid direction cannot accidentally propose a different merge', async () => {
  await assert.rejects(proposeSync({ ...fixture(), direction: 'typo' }), /direction/);
});
test('branch names are passed as API data without shell interpolation', async () => {
  const branch = 'copilot/$(touch-pwned)';
  const f = fixture({ branches: [branch] });
  await proposeSync({ ...f, direction: 'into-main' });
  assert.equal(f.calls.find(([op]) => op === 'create')[1].head, branch);
});
test('workflow permissions and trusted execution remain restrictive', () => {
  for (const name of ['omega-mega-merge', 'omega-branch-sync']) {
    const source = fs.readFileSync(`.github/workflows/${name}.yml`, 'utf8');
    assert.match(source, /contents: read/);
    assert.doesNotMatch(source, /contents: write|secrets\.|pull_request_target|\n  push:/);
    assert.match(source, /pull-requests: write/);
    assert.match(source, /github.ref == 'refs\/heads\/main'/);
    assert.match(source, /persist-credentials: false/);
    assert.match(source, /ref: main/);
    assert.match(source, /node --test scripts\/tests\/omega-sync.test.cjs/);
    assert.doesNotMatch(source, /git (push|merge)|pulls\.merge|deleteRef|enablePullRequestAutoMerge/);
  }
  const legacy = fs.readFileSync('.github/workflows/omega-auto-merge.yml', 'utf8');
  assert.doesNotMatch(legacy, /contents: write|pulls\.merge|deleteRef/);
  const ci = fs.readFileSync('.github/workflows/omega-sync-safety.yml', 'utf8');
  assert.match(ci, /pull_request:/);
  assert.match(ci, /node --test scripts\/tests\/omega-sync.test.cjs/);
});
})().catch((error) => { console.error(error); process.exitCode = 1; });
