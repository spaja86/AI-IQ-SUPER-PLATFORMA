import assert from 'node:assert/strict';
import test from 'node:test';
import { CAMERAS, SECTOR, canStand, createDuel, duelReducer, project, type Duel } from '../../lib/transformers/engine';
import { igrice } from '../../lib/igrice';
import { getRunnerKompatibilnostZaIgricu } from '../../lib/gaming-endzin';

function active(): Duel { return duelReducer(createDuel(), { type: 'start' }); }
function tick(state: Duel, count = 1, x = 0, z = 0) {
  for (let i = 0; i < count; i++) state = duelReducer(state, {type:'tick',dt:0.05,x,z});
  return state;
}
test('catalog and gaming resolver select the dedicated beta prototype', () => {
  const game = igrice.find(g => g.id === 'igrica-transformers-1350');
  assert.ok(game);
  assert.equal(game.status, 'beta');
  assert.equal(game.link, '/transformers');
  assert.deepEqual(getRunnerKompatibilnostZaIgricu(game), {
    igricaId: game.id, kategorija:'akcija', runnerTip:'transformers', status:'existing-runner',
  });
});
test('twenty transformation round trips preserve identity, position and health; repeated commands are ignored', () => {
  let state = active();
  state.units[1].cooldown = 9999;
  const original = {...state.units[0]};
  for (let i=0; i<40; i++) {
    state = duelReducer(state, {type:'transform'});
    state = tick(state, 4);
    const remaining = state.units[0].transition;
    state = duelReducer(state, {type:'transform'});
    assert.equal(state.units[0].transition, remaining);
    state = tick(state, 9);
    assert.equal(state.units[0].form, i%2 === 0 ? 'vehicle' : 'robot');
  }
  assert.equal(state.units.length, 2);
  assert.equal(state.units[0].id, original.id);
  assert.equal(state.units[0].hp, original.hp);
  assert.equal(state.units[0].x, original.x);
  assert.equal(state.units[0].z, original.z);
});
test('input state is immutable, including when firing', () => {
  const state = active(); state.units[1].x = 40;
  const snapshot = structuredClone(state);
  const next = duelReducer(state, {type:'fire'});
  assert.deepEqual(state, snapshot);
  assert.equal(next.units[1].hp, 90);
});
test('movement is normalized, stops without input and respects sector boundary', () => {
  let state = active(); state.units[1].cooldown=9999;
  const straight = tick(state,1,1,0), diagonal = tick(state,1,1,1);
  assert.ok(Math.abs(Math.hypot(diagonal.units[0].x-20,diagonal.units[0].z-50) - (straight.units[0].x-20)) < 1e-8);
  const stopped = tick(straight,10);
  assert.equal(stopped.units[0].x, straight.units[0].x);
  state = tick(state,500,-1,0);
  assert.ok(state.units[0].x >= 2);
  assert.ok(canStand(state.units[0].x,state.units[0].z));
});
test('both forms stop at solid obstacles', () => {
  for (const form of ['robot','vehicle'] as const) {
    let state = active(); state.units[0] = {...state.units[0], x:30,z:40,form};
    state.units[1].cooldown=9999;
    state = tick(state,100,1,0);
    assert.ok(state.units[0].x <= 38);
    assert.ok(canStand(state.units[0].x,state.units[0].z));
  }
});
test('vehicle travels faster but cannot shoot; movement is locked during transition', () => {
  const state = active(); state.units[1].x=40;
  const robot = tick(state,1,1,0);
  const vehicle = structuredClone(state); vehicle.units[0].form='vehicle';
  assert.ok(tick(vehicle,1,1,0).units[0].x > robot.units[0].x);
  assert.equal(duelReducer(vehicle,{type:'fire'}).units[1].hp,100);
  const transitioning = duelReducer(state,{type:'transform'});
  assert.equal(tick(transitioning,1,1,0).units[0].x,20);
  assert.equal(duelReducer(transitioning,{type:'fire'}).units[1].hp,100);
});
test('range, cooldown and line of sight constrain attacks', () => {
  const far = active();
  assert.equal(duelReducer(far,{type:'fire'}).units[1].hp,100);
  const near = active(); near.units[1].x=40;
  const hit = duelReducer(near,{type:'fire'});
  assert.equal(hit.units[1].hp,90);
  assert.equal(duelReducer(hit,{type:'fire'}).units[1].hp,90);
  const blocked = active(); blocked.units[0].x=35; blocked.units[0].z=40;
  blocked.units[1].x=57; blocked.units[1].z=40;
  assert.equal(duelReducer(blocked,{type:'fire'}).units[1].hp,100);
});
test('pause freezes health, movement, transformation and clock', () => {
  let state = duelReducer(active(),{type:'transform'});
  state = duelReducer(state,{type:'pause'});
  const before = structuredClone(state);
  assert.deepEqual(tick(state,100,1,1),before);
  assert.deepEqual(duelReducer(state,{type:'fire'}),before);
  assert.ok(tick(duelReducer(state,{type:'pause'})).remaining < state.remaining);
});
test('winner is final and repeated attacks/ticks cannot change the result', () => {
  const state = active(); state.units[1].x=40; state.units[1].hp=10;
  const win = duelReducer(state,{type:'fire'});
  assert.equal(win.result,'win'); assert.equal(win.phase,'finished');
  assert.deepEqual(tick(duelReducer(win,{type:'fire'}),100,1,0),win);
});
test('bot can defeat the player and time expiry produces a draw', () => {
  const state = active(); state.units[0].hp=10; state.units[1].x=40;
  assert.equal(tick(state).result,'loss');
  const timeout = active(); timeout.remaining=0.01; timeout.units[1].cooldown=9999;
  assert.equal(tick(timeout).result,'draw');
});
test('five resets restore all initial state without carrying a result or pause', () => {
  let state = active();
  for (let i=0; i<5; i++) {
    state.units[0].hp=10; state.units[1].x=40;
    state=tick(state); assert.equal(state.result,'loss');
    state=duelReducer(state,{type:'reset'});
    assert.deepEqual(state,createDuel()); state=duelReducer(state,{type:'start'});
  }
});
test('only four of 23 unique cameras activate; camera changes preserve world state', () => {
  assert.equal(CAMERAS.length,23); assert.equal(new Set(CAMERAS.map(c=>c.id)).size,23);
  assert.equal(CAMERAS.filter(c=>c.implemented).length,4);
  const state=active();
  for (const id of [1,2,3,4]) {
    const view=duelReducer(state,{type:'camera',id});
    assert.equal(view.camera,id); assert.deepEqual(view.units,state.units);
    assert.ok(project(20,50,0,view).every(Number.isFinite));
  }
  for (const id of [0,5,23,24,NaN]) assert.equal(duelReducer(state,{type:'camera',id}),state);
  const tracked=duelReducer(state,{type:'camera',id:2});
  assert.deepEqual(project(20,50,0,tracked),[400,260]);
});
test('invalid time/movement never corrupts positions; world dimensions remain fixed', () => {
  const next=duelReducer(active(),{type:'tick',dt:NaN,x:Infinity,z:NaN});
  assert.equal(next.elapsed,0); assert.equal(next.units[0].x,20);
  assert.equal(canStand(NaN,50),false);
  assert.equal(SECTOR.size * SECTOR.metresPerUnit,2000);
});
