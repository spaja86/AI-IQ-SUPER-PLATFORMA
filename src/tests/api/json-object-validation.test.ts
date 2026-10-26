import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST as post0 } from '../../app/api/ai-asistent/route';
import { POST as post1 } from '../../app/api/analiza-svega-config/route';
import { POST as post2 } from '../../app/api/owner-phone-auth/request-otp/route';
import { POST as post3 } from '../../app/api/owner-phone-auth/verify-otp/route';
import { POST as post4 } from '../../app/api/spaja-pro-multifunkcionalni-endzin-baza/route';
import { POST as post5 } from '../../app/api/spaja-pro-multifunkcionalni-endzin-sesija/route';
import { POST as post6 } from '../../app/api/spaja-pro-multifunkcionalni-endzin-smernice/route';
import { POST as post7 } from '../../app/api/spaja-pro-prompt-execute/route';
import { POST as post8 } from '../../app/api/spaja-pro-zasebni-endzin-konverzacija/route';
import { POST as post9 } from '../../app/api/spaja-pro-zasebni-endzin-analiza/route';

const handlers = [post0, post1, post2, post3, post4, post5, post6, post7, post8, post9];
for (const [index, handler] of handlers.entries()) {
  test(`JSON object validation for route ${index}`, async () => {
    for (const [caseIndex, body] of ['{', 'null', '[]', '"text"', 'true', '42'].entries()) {
      const response = await handler(new NextRequest('http://localhost/api/validation', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${index * 10 + caseIndex + 1}` }, body,
      }));
      assert.equal(response.status, 400, `route ${index}: ${body}`);
      assert.ok(await response.json());
    }
  });
}
