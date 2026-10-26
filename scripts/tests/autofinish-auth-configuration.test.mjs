import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

for (const configured of [false, true]) {
    test(`all triggers: ${configured ? 'configured triggers require authentication' : 'missing configuration fails closed'}`, () => {
      const env = { PATH: process.env.PATH, HOME: process.env.HOME, CI: 'true' };
      if (configured) env.AUTOFINISH_TRIGGER_TOKEN = 'offline-test-trigger-token';
      const code = `
        const assert = require('node:assert/strict');
        const { NextRequest } = require('next/server');
        let calls = 0;
        global.fetch = async () => { calls++; throw new Error('Network is forbidden'); };
        (async () => {
          for (const route of ['autofinish-trigger', 'autofinish-svega', 'autofinish-analiza-svega']) {
            const { POST } = require('./src/app/api/' + route + '/route.ts');
          for (const authorization of ['', 'Bearer wrong-token']) {
            const response = await POST(new NextRequest('http://localhost/api/' + route, {
              method: 'POST', headers: { authorization, 'content-type': 'application/json' }, body: '{',
            }));
            assert.equal(response.status, ${configured ? 401 : 503});
            assert.equal((await response.json()).error, '${configured ? 'Unauthorized' : 'SERVICE_UNAVAILABLE'}');
          }
          }
          assert.equal(calls, 0);
        })().catch(error => { console.error(error); process.exitCode = 1; });
      `;
      const result = spawnSync(process.execPath, ['--import', 'tsx', '-e', code], { env, encoding: 'utf8', timeout: 30000 });
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stdout + result.stderr);
    });
}
