/** Local prototype. No network, rewards, persistence or geographic terrain data. */
export const TRANSFORMERS_ID = 'igrica-transformers-1350';
export const SECTOR = {
  name: 'Smederevo — probni sektor', latitude: 44.66, longitude: 20.93,
  size: 100, metresPerUnit: 20,
  obstacles: [{ x: 40, z: 35, w: 12, d: 10 }, { x: 58, z: 62, w: 14, d: 8 }],
} as const;
export const CAMERAS = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  name: ['Taktički pogled odozgo', 'Praćenje jedinice', 'Orbitalni pregled', 'Pregled duela'][index] ?? `Planirani pogled ${index + 1}`,
  implemented: index < 4,
}));
export type Form = 'robot' | 'vehicle';
export interface Unit {
  id: 'player' | 'bot'; x: number; z: number; hp: number; form: Form;
  transition: number; cooldown: number; flash: number;
  route?: Point[]; routeGoal?: string;
}
export interface Point { x: number; z: number }
export interface Duel {
  phase: 'ready' | 'active' | 'finished';
  units: [Unit, Unit]; remaining: number; elapsed: number;
  result: 'win' | 'loss' | 'draw' | null;
  camera: number; orbit: number; paused: boolean;
}
export type Action =
  | { type: 'start' | 'reset' | 'transform' | 'fire' | 'pause' }
  | { type: 'camera'; id: number }
  | { type: 'orbit'; delta: number }
  | { type: 'tick'; dt: number; x: number; z: number }
  | { type: 'advance'; dt: number; x: number; z: number; fire: boolean };

export function createDuel(): Duel {
  const unit = (id: Unit['id'], x: number, z: number): Unit => ({
    id, x, z, hp: 100, form: 'robot', transition: 0, cooldown: 0, flash: 0,
  });
  return { phase: 'ready', units: [unit('player', 20, 50), unit('bot', 80, 50)],
    remaining: 90, elapsed: 0, result: null, camera: 1, orbit: 0, paused: false };
}
const finite = (n: number) => Number.isFinite(n) ? n : 0;
export function canStand(x: number, z: number): boolean {
  const radius = 2;
  return Number.isFinite(x) && Number.isFinite(z)
    && x >= radius && z >= radius && x <= SECTOR.size - radius && z <= SECTOR.size - radius
    && !SECTOR.obstacles.some(o => x + radius > o.x && x - radius < o.x + o.w
      && z + radius > o.z && z - radius < o.z + o.d);
}
function move(unit: Unit, x: number, z: number, dt: number) {
  const length = Math.max(1, Math.hypot(x, z));
  const speed = unit.form === 'vehicle' ? 18 : 10;
  const nx = unit.x + x / length * speed * dt;
  const nz = unit.z + z / length * speed * dt;
  if (canStand(nx, unit.z)) unit.x = nx;
  if (canStand(unit.x, nz)) unit.z = nz;
}

/** Segment vs expanded AABBs: robot/vehicle clearance, including corner grazing. */
export function pathClear(a: Point, b: Point): boolean {
  if (!canStand(a.x,a.z) || !canStand(b.x,b.z)) return false;
  return !SECTOR.obstacles.some(o => {
    let lo=0, hi=1;
    for (const [start, delta, min, max] of [
      [a.x,b.x-a.x,o.x-2,o.x+o.w+2], [a.z,b.z-a.z,o.z-2,o.z+o.d+2],
    ]) {
      if (Math.abs(delta)<1e-9) { if (start<min || start>max) return false; }
      else {
        const t1=(min-start)/delta, t2=(max-start)/delta;
        lo=Math.max(lo,Math.min(t1,t2)); hi=Math.min(hi,Math.max(t1,t2));
        if (lo>hi) return false;
      }
    }
    return true;
  });
}

/** Bounded visibility graph (at most 10 vertices for this sector), no external pathfinder. */
export function findRoute(start: Point, target: Point): Point[] {
  if (!canStand(start.x,start.z) || !canStand(target.x,target.z)) return [];
  const vertices: Point[]=[start,target];
  for (const o of SECTOR.obstacles) for (const x of [o.x-2.25,o.x+o.w+2.25])
    for (const z of [o.z-2.25,o.z+o.d+2.25]) if(canStand(x,z)) vertices.push({x,z});
  const distances=vertices.map(()=>Infinity), previous=vertices.map(()=>-1), visited=new Set<number>();
  distances[0]=0;
  for(let step=0;step<vertices.length;step++) {
    let current=-1;
    for(let i=0;i<vertices.length;i++) if(!visited.has(i) && (current<0 || distances[i]<distances[current])) current=i;
    if(current<0 || !Number.isFinite(distances[current])) return [];
    if(current===1) {
      const route:Point[]=[];
      for(let i=1;i!==0;i=previous[i]) { if(i<0 || route.length>vertices.length) return []; route.unshift({...vertices[i]}); }
      return route;
    }
    visited.add(current);
    for(let i=0;i<vertices.length;i++) if(!visited.has(i) && pathClear(vertices[current],vertices[i])) {
      const d=distances[current]+Math.hypot(vertices[i].x-vertices[current].x,vertices[i].z-vertices[current].z);
      if(d<distances[i]) {distances[i]=d;previous[i]=current;}
    }
  }
  return [];
}
function fire(attacker: Unit, target: Unit) {
  if (attacker.form !== 'robot' || attacker.transition > 0 || attacker.cooldown > 0 || attacker.hp <= 0) return;
  attacker.cooldown = 0.8;
  attacker.flash = 0.15;
  const distance = Math.hypot(attacker.x - target.x, attacker.z - target.z);
  // Sample the short shot segment so solid obstacles block attacks as well as movement.
  const blocked = SECTOR.obstacles.some(o => {
    for (let i = 0; i <= 40; i++) {
      const x = attacker.x + (target.x - attacker.x) * i / 40;
      const z = attacker.z + (target.z - attacker.z) * i / 40;
      if (x >= o.x && x <= o.x + o.w && z >= o.z && z <= o.z + o.d) return true;
    }
    return false;
  });
  if (distance <= 26 && !blocked) target.hp = Math.max(0, target.hp - 10);
}
function finish(state: Duel): Duel {
  const [player, bot] = state.units;
  if (player.hp > 0 && bot.hp > 0 && state.remaining > 0) return state;
  state.phase = 'finished';
  state.result = player.hp <= 0 && bot.hp <= 0 ? 'draw'
    : player.hp <= 0 ? 'loss' : bot.hp <= 0 ? 'win' : 'draw';
  return state;
}
export function duelReducer(state: Duel, action: Action): Duel {
  if (action.type === 'reset') return createDuel();
  if (action.type === 'start') return state.phase === 'ready' ? { ...state, phase: 'active' } : state;
  if (action.type === 'camera') return CAMERAS.some(c => c.id === action.id && c.implemented)
    ? { ...state, camera: action.id } : state;
  if (action.type === 'orbit') return { ...state, orbit: state.orbit + finite(action.delta) };
  if (action.type === 'pause') return state.phase === 'active' ? { ...state, paused: !state.paused } : state;
  if (state.phase !== 'active' || state.paused) return state;
  if (action.type === 'advance') {
    const elapsed=Math.max(0,finite(action.dt));
    if(elapsed===0) return state;
    // Preserve real active match time; bound catch-up physics to 2 seconds (40 substeps).
    const duration=Math.min(elapsed,state.remaining);
    const simulated=Math.min(duration,2);
    let next=state;
    for(let remaining=simulated;remaining>1e-9 && next.phase==='active';) {
      const dt=Math.min(0.05,remaining);
      next=duelReducer(next,{type:'tick',dt,x:action.x,z:action.z});
      if(action.fire) next=duelReducer(next,{type:'fire'});
      remaining-=dt;
    }
    if(next.phase==='finished') return next;
    return finish({...next,elapsed:state.elapsed+duration,remaining:Math.max(0,state.remaining-duration)});
  }
  const next: Duel = { ...state, units: [{ ...state.units[0] }, { ...state.units[1] }] };
  const [player, bot] = next.units;
  if (action.type === 'transform') {
    if (player.transition === 0) player.transition = 0.6;
  } else if (action.type === 'fire') {
    fire(player, bot);
  } else if (action.type === 'tick') {
    const dt = Math.max(0, Math.min(0.05, finite(action.dt)));
    if (dt === 0) return state;
    next.elapsed += dt;
    next.remaining = Math.max(0, next.remaining - dt);
    for (const unit of next.units) {
      const previous = unit.transition;
      unit.transition = Math.max(0, unit.transition - dt);
      if (previous > 0 && unit.transition === 0) unit.form = unit.form === 'robot' ? 'vehicle' : 'robot';
      unit.cooldown = Math.max(0, unit.cooldown - dt);
      unit.flash = Math.max(0, unit.flash - dt);
    }
    if (player.transition === 0) move(player, finite(action.x), finite(action.z), dt);
    const dx = player.x - bot.x, dz = player.z - bot.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 19 || !pathClear(bot,player)) {
      const goal=`${Math.floor(player.x/4)},${Math.floor(player.z/4)}`;
      if(!bot.route?.length || bot.routeGoal!==goal || !pathClear(bot,bot.route[0])) {
        bot.route=findRoute(bot,player); bot.routeGoal=goal;
      }
      const waypoint=bot.route?.[0];
      if(waypoint) {
        const wx=waypoint.x-bot.x,wz=waypoint.z-bot.z,d=Math.hypot(wx,wz);
        const speed=bot.form==='vehicle'?18:10;
        const travel=Math.min(dt,d/speed);
        move(bot,wx/Math.max(1e-9,d),wz/Math.max(1e-9,d),travel);
        if(d<=speed*dt+1e-8) bot.route=bot.route!.slice(1);
      }
    }
    // Bot is deliberately slower to shoot than the player: a transparent local sparring partner.
    if (bot.cooldown === 0 && next.remaining > 0) { fire(bot, player); bot.cooldown = 1.2; }
  }
  return finish(next);
}

/** Orthographic 2.5D projection; all views use the same world and unit identity. */
export function project(x: number, z: number, height: number, state: Duel): [number, number] {
  const tracked = state.camera === 2;
  const duel = state.camera === 4;
  const cx = tracked ? state.units[0].x : duel ? (state.units[0].x+state.units[1].x)/2 : 50;
  const cz = tracked ? state.units[0].z : duel ? (state.units[0].z+state.units[1].z)/2 : 50;
  const angle = state.camera === 1 ? 0 : state.camera === 2 ? Math.PI / 4 : state.camera === 3 ? state.orbit : 0;
  const pitch = state.camera === 1 ? 1 : 0.55;
  const spanX=Math.abs(state.units[0].x-state.units[1].x)+12;
  const spanZ=Math.abs(state.units[0].z-state.units[1].z)+12;
  const scale = tracked ? 7 : duel ? Math.max(2.5,Math.min(7,660/spanX,330/(spanZ*0.55+10))) : 4.3;
  const dx = x - cx, dz = z - cz;
  return [400 + (dx * Math.cos(angle) - dz * Math.sin(angle)) * scale,
    260 + (dx * Math.sin(angle) + dz * Math.cos(angle)) * scale * pitch - height * scale];
}
