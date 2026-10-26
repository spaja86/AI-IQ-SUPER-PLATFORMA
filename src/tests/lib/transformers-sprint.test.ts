import assert from 'node:assert/strict';
import test from 'node:test';
import { canStand, createDuel, duelReducer, findRoute, pathClear, project, type Duel } from '../../lib/transformers/engine';

function active(): Duel {
  const state=duelReducer(createDuel(),{type:'start'});
  state.units[0].cooldown=9999; state.units[1].cooldown=9999;
  return state;
}
function advance(state:Duel,dt:number) {
  return duelReducer(state,{type:'advance',dt,x:0,z:0,fire:false});
}
test('90 real active seconds expire equally with regular and delayed callbacks',()=>{
  for(const interval of [0.05,0.2,0.7,2]) {
    let state=active(); let elapsed=0;
    while(elapsed<90-1e-8) { const dt=Math.min(interval,90-elapsed);state=advance(state,dt);elapsed+=dt; }
    // Floating-point residue must not add a visible extra second.
    state=advance(state,1e-8);
    assert.equal(state.phase,'finished');assert.equal(state.result,'draw');
    assert.ok(Math.abs(state.elapsed-90)<1e-6);
  }
});
test('long stalls update clock without unbounded movement or processing',()=>{
  const state=active();state.units[0].x=5;state.units[0].z=5;
  const next=duelReducer(state,{type:'advance',dt:30,x:1,z:0,fire:false});
  assert.equal(next.remaining,60);assert.equal(next.elapsed,30);
  assert.ok(next.units[0].x<=25.000001);
  assert.equal(advance(state,Infinity),state);assert.equal(advance(state,-1),state);
});
test('paused time is excluded; reset restores the complete initial state',()=>{
  let state=advance(active(),1.5);state=duelReducer(state,{type:'pause'});
  assert.equal(advance(state,30),state);
  state=advance(duelReducer(state,{type:'pause'}),0.5);
  assert.equal(state.elapsed,2);assert.equal(state.remaining,88);
  assert.deepEqual(duelReducer(state,{type:'reset'}),createDuel());
});
test('bot navigates three obstructed layouts without crossing walls or sector bounds',()=>{
  for(const [bx,bz,px,pz] of [[30,40,60,40],[55,66,80,66],[30,30,80,80]]) {
    let state=active(); Object.assign(state.units[1],{x:bx,z:bz});Object.assign(state.units[0],{x:px,z:pz});
    let arrived=false;
    for(let i=0;i<1200;i++) {
      const before=state.units[1];state=duelReducer(state,{type:'tick',dt:0.05,x:0,z:0});
      const bot=state.units[1],player=state.units[0];
      assert.ok(canStand(bot.x,bot.z)); assert.ok(pathClear(before,bot));
      if(Math.hypot(bot.x-player.x,bot.z-player.z)<=19.01 && pathClear(bot,player)) {arrived=true;break;}
    }
    assert.ok(arrived,`bot did not arrive from ${bx},${bz}`);
  }
});
test('routing is deterministic and rejects unreachable or invalid endpoints',()=>{
  const start={x:30,z:40},target={x:60,z:40};
  const path=findRoute(start,target);
  assert.ok(path.length>1);assert.deepEqual(findRoute(start,target),path);
  let previous=start;for(const waypoint of path){assert.ok(pathClear(previous,waypoint));previous=waypoint;}
  assert.deepEqual(findRoute(start,{x:45,z:40}),[]);
  assert.deepEqual(findRoute(start,{x:101,z:40}),[]);
  assert.deepEqual(findRoute(start,{x:NaN,z:40}),[]);
});
test('fourth camera frames both robot and vehicle at opposite sector corners',()=>{
  for(const [ax,az,bx,bz] of [[2,2,98,98],[2,98,98,2],[50,50,51,51]]) {
    const state=active();Object.assign(state.units[0],{x:ax,z:az});Object.assign(state.units[1],{x:bx,z:bz});
    const snapshot=structuredClone(state.units);
    const view=duelReducer(state,{type:'camera',id:4});
    assert.equal(view.camera,4);assert.deepEqual(view.units,snapshot);
    for(const unit of view.units) for(const height of [0,7,10]) {
      const [x,y]=project(unit.x,unit.z,height,view);
      assert.ok(x>=40 && x<=760 && y>=30 && y<=490,`outside frame ${x},${y}`);
    }
    const orbited=duelReducer(view,{type:'orbit',delta:2});
    assert.deepEqual(project(ax,az,0,view),project(ax,az,0,orbited));
  }
});
