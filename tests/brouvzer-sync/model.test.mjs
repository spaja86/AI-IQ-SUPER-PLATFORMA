import test from 'node:test';
import assert from 'node:assert/strict';
import * as Y from '../../pilot/brouvzer/node_modules/yjs/dist/yjs.mjs';
import { BookmarkModel, MAX_STATE } from '../../pilot/brouvzer/model.mjs';
const value = title => ({ title, url: 'https://example.com/' });
test('two offline replicas converge with duplicate/reversed snapshots and remove wins', async () => {
  for (let seed = 1; seed <= 20; seed++) {
    const a = new BookmarkModel(), b = new BookmarkModel();
    await a.put('shared', value('base')); await b.apply(a.snapshot());
    const messages = [];
    for (let n = 0; n < 12; n++) {
      await a.put('shared', value(`A-${seed}-${n}`)); messages.push(a.snapshot());
      await b.put('shared', value(`B-${seed}-${n}`)); messages.push(b.snapshot());
    }
    await a.put('a', value('A')); await b.put('b', value('B'));
    await a.remove('shared'); await b.put('shared', value('concurrent edit'));
    messages.push(a.snapshot(), b.snapshot());
    let random = seed;
    const shuffled = messages.map(bytes => { random = (random * 1664525 + 1013904223) >>> 0; return { key: random, bytes }; }).sort((a,b) => a.key-b.key);
    for (const {bytes} of shuffled) { await a.apply(bytes); await b.apply(bytes); await a.apply(bytes); }
    await a.apply(b.snapshot()); await b.apply(a.snapshot());
    assert.deepEqual(a.rows(), b.rows()); assert.deepEqual(a.rows().map(x=>x.id), ['a','b']);
    await assert.rejects(a.put('shared', value('resurrect')), /Obrisani/);
  }
});
test('concurrent writes of one bookmark have deterministic Yjs winner', async()=>{
  const a = new BookmarkModel(), b = new BookmarkModel(); await a.put('x', value('base')); await b.apply(a.snapshot());
  await a.put('x', value('A')); await b.put('x', value('B'));
  const x=a.snapshot(),y=b.snapshot(); await a.apply(y); await b.apply(x);
  assert.deepEqual(a.rows(),b.rows()); assert.ok(['A','B'].includes(a.rows()[0].title));
});
test('commit persistence precedes visible success and survives model restart', async()=>{
  let saved; const storage={load:async()=>saved,save:async bytes=>{saved=bytes.slice();}};
  const a=await new BookmarkModel({storage}).init(); await Promise.all([a.put('a',value('A')),a.put('b',value('B'))]);
  const restored=await new BookmarkModel({storage}).init(); assert.deepEqual(restored.rows(),a.rows());
});
test('failed durable write leaves old visible state unchanged', async()=>{
  const a=new BookmarkModel({storage:{save:async()=>{throw Error('quota');}}});
  await assert.rejects(a.put('x',value('X')),/quota/); assert.deepEqual(a.rows(),[]);
});
test('incognito never reads or writes persistent storage',async()=>{
  const blocked={load:()=>{throw Error('read');},save:()=>{throw Error('write');}};
  const a=await new BookmarkModel({incognito:true,storage:blocked}).init(); await a.put('x',value('X')); assert.equal(a.rows().length,1);
});
test('hostile state, oversized payload and invalid bookmark rejected atomically',async()=>{
  const a=new BookmarkModel(); await a.put('safe',value('Safe')); const previous=a.rows();
  const doc=new Y.Doc(); doc.getMap('bookmarks').set('bad',{title:'bad',url:'javascript:alert(1)'});
  await assert.rejects(a.apply(Y.encodeStateAsUpdate(doc))); assert.deepEqual(a.rows(),previous);
  await assert.rejects(a.apply(new Uint8Array(MAX_STATE+1)));
  assert.throws(()=>a.put('x',{title:'x',url:'https://user:password@example.com/'}));
});
test('100 record bound rejects 101st without mutation', async()=>{
  const a=new BookmarkModel(); for(let i=0;i<100;i++) await a.put(`x-${i}`,value('x'));
  await assert.rejects(a.put('overflow',value('x')),/Limit/); assert.equal(a.rows().length,100);
});
