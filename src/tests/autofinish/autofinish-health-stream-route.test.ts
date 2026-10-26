import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET } from '../../app/api/autofinish-health-stream/route';
import { APP_VERSION, AUTOFINISH_COUNT } from '../../lib/constants';

test('SSE sends a health event and releases the stream on reader cancellation', async () => {
  const response = await GET(new NextRequest('http://localhost/api/autofinish-health-stream', {
    headers: { 'x-forwarded-for': '192.0.2.201' },
  }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/event-stream');
  assert.equal(response.headers.get('X-App-Version'), APP_VERSION);
  const reader = response.body!.getReader();
  try {
    const first = await reader.read();
    assert.equal(first.done, false);
    const event = new TextDecoder().decode(first.value);
    assert.match(event, /^event: zdravlje\ndata: /);
    const data = JSON.parse(event.split('data: ')[1].trim());
    assert.equal(data.verzija, APP_VERSION);
    assert.equal(data.autofinishIteracija, AUTOFINISH_COUNT);
    assert.equal(data.iteracija, 1);
    assert.equal(data.podsistemi.length, 9);
  } finally { await reader.cancel(); }
});

test('request abort closes SSE immediately', async () => {
  const controller = new AbortController();
  const response = await GET(new NextRequest('http://localhost/api/autofinish-health-stream', {
    headers: { 'x-forwarded-for': '192.0.2.202' }, signal: controller.signal,
  }));
  const reader = response.body!.getReader();
  await reader.read();
  controller.abort();
  assert.equal((await reader.read()).done, true);
});
