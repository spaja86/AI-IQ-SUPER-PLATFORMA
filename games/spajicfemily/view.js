const statusLine = document.querySelector("#status");
const stats = document.querySelector("#stats");
const ctx = document.querySelector("canvas").getContext("2d");
const keys = new Set();
const movement = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
const saveKey = "spajicfemily-construction-v1";
let savedAt = 0;
function loadGame() {
    try {
        const saved = JSON.parse(localStorage.getItem(saveKey));
        if (saved && saved.hero && Array.isArray(saved.foes) && Array.isArray(saved.items)) return saved;
    } catch {}
    return Family.create();
}
function saveGame() {
    savedAt = Date.now();
    try { localStorage.setItem(saveKey, JSON.stringify(game)); } catch {}
}
let game = loadGame();
window.addEventListener("pagehide", saveGame);
let cameraZ = 0;
let cameraX = 0;

function project(x, z, height = 0) {
    const depth = z - cameraZ + 9;
    if (depth < 1) return null;
    const scale = 555 / depth;
    return [480 + (x - cameraX) * scale, 125 + (6.4 - height) * scale, scale];
}

function ground(x, z, width, depth, color) {
    const near = Math.max(cameraZ - 7.9, z);
    if (z + depth <= near) return;
    const points = [project(x, near), project(x + width, near),
        project(x + width, z + depth), project(x, z + depth)];
    ctx.beginPath();
    points.forEach(([px, py], index) => index ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function oval(x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
}

function scenery(x, y, s) {
    ctx.fillStyle = "#533b31";
    ctx.fillRect(x - 0.15 * s, y - 2.4 * s, 0.3 * s, 2.4 * s);
    oval(x, y - 2.6 * s, 0.85 * s, 1.45 * s, "#294c42");
    oval(x - 0.15 * s, y - 3 * s, 0.5 * s, 0.8 * s, "#3c6552");
}

function actor(x, y, s, color, label, swing) {
    oval(x, y, .42 * s, .12 * s, "#142120bb");
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, .13 * s);
    ctx.beginPath();
    ctx.moveTo(x - .19 * s, y);
    ctx.lineTo(x, y - .62 * s);
    ctx.lineTo(x + .19 * s, y);
    ctx.stroke();
    oval(x, y - .79 * s, .3 * s, .45 * s, color);
    oval(x, y - 1.26 * s, .22 * s, .25 * s, "#f2c49a");
    if (swing) {
        ctx.strokeStyle = "#ffebad";
        ctx.beginPath();
        ctx.arc(x, y - .63 * s, .88 * s, -.85, 1.05);
        ctx.stroke();
    }
    ctx.fillStyle = "#fff4dd";
    ctx.font = "bold " + Math.max(12, .22 * s) + "px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 1.69 * s);
}

const trees = Array.from({length: 32}, (_, i) => ({
    x: (i % 2 ? -1 : 1) * (8.5 + i % 4 * 1.2), z: i * 1.17, kind: "drvo"
}));
const ui = Object.fromEntries(["construction","lesson","answer0","answer1"].map(id => [id, document.getElementById(id)]));
const relatives = [{x:-3,z:1,name:"Nikola"},{x:-4,z:3,name:"Sara"},{x:3,z:1,name:"Darko"},{x:4,z:3,name:"Lara"}];

function face(points, color) {
    const projected = points.map(([x,z,y]) => project(x,z,y));
    if (projected.some(point => !point)) return;
    ctx.beginPath();
    projected.forEach(([x,y],index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function beginConstruction() { if (Family.build(game, Date.now())) { last = performance.now(); saveGame(); } }

function partialStage(stage, fraction) {
    const frames = [
        null,
        [[-4,23,0],[0,23,0],[0,28,0],[-4,28,0]],
        [[-4,28,0],[4,28,0],[4,28,1.4],[-4,28,1.4]],
        [[-4.4,28,3],[0,28,4.9],[0,25.8,4.9],[-4.4,25.8,3]],
        [[-2.8,25,0],[-.3,25,0],[-.3,25,.48],[-2.8,25,.48]],
        [[.8,24,.6],[3,24,.6],[3,25.4,.6],[.8,25.4,.6]]
    ];
    const origin = frames[stage][0];
    const points = frames[stage].map(point => point.map((value,index) => origin[index] + fraction * (value - origin[index])));
    face(points, ["", "#a88a65", "#ac6e4c", "#913f36", "#8b583f", "#8fd1bc"][stage]);
}

function house(progress) {
    const stage = game.stage;
    ground(-4,23,8,5,stage ? "#a88a65" : "#b4a169");
    if (stage >= 2) {
        face([[-4,28,0],[4,28,0],[4,28,3],[-4,28,3]],"#ac6e4c");
        face([[-4,23,0],[-4,28,0],[-4,28,3],[-4,23,3]],"#d69b68");
        face([[4,23,0],[4,28,0],[4,28,3],[4,23,3]],"#945b45");
    }
    if (stage >= 3) {
        face([[-4.4,28,3],[0,28,4.9],[0,25.8,4.9],[-4.4,25.8,3]],"#913f36");
        face([[4.4,28,3],[0,28,4.9],[0,25.8,4.9],[4.4,25.8,3]],"#b65a43");
    }
    if (stage >= 4) {
        face([[-2.8,25,.75],[-.3,25,.75],[-.3,26.5,.75],[-2.8,26.5,.75]],"#f4ce80");
        face([[-2.8,25,0],[-.3,25,0],[-.3,25,.75],[-2.8,25,.75]],"#8b583f");
    }
    if (stage >= 5) {
        face([[.8,24,.6],[3,24,.6],[3,25.4,.6],[.8,25.4,.6]],"#8fd1bc");
        face([[.8,24,0],[3,24,0],[3,24,.6],[.8,24,.6]],"#518b77");
        face([[1.5,26,.8],[3.4,26,.8],[3.4,27,.8],[1.5,27,.8]],"#e1bf82");
    }
    if (progress && progress.gameMs > 0) partialStage(stage + 1, Math.min(1,(progress.intervals + (progress.second ? .5 : 0)) / 6000));
}

function bindActions() {
    const actions = {
        attack: () => Family.attack(game), switch: () => Family.switchLeader(game),
        spear: () => Family.craft(game,"Drveno koplje"), hammer: () => Family.craft(game,"Kameni čekić"),
        power: () => Family.develop(game), build: beginConstruction,
        wood: () => Family.work(game,"stolarija"), stone: () => Family.work(game,"kamen"),
        answer0: () => Family.teach(game,0), answer1: () => Family.teach(game,1),
        restart: () => { game = Family.create(); saveGame(); keys.clear(); }
    };
    for (const [id,action] of Object.entries(actions)) document.getElementById(id).onclick = action;
}
bindActions();

const atmosphereImages = ["ambience-old", "ambience-new"].map(id => document.getElementById(id));
let atmosphereKey = "";
function renderAtmosphere(progress) {
    const stage = Math.min(game.stage,4);
    const {previous,next,mix} = Atmosphere.transition(progress?.gameMs ?? (game.stage === 5 ? 18_000_000 : 0));
    const key = [stage,previous,next].join("/");
    if (key !== atmosphereKey) {
        atmosphereKey = key;
        for (const [i,index] of [previous,next].entries()) {
            atmosphereImages[i].src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Atmosphere.composite(stage,index));
        }
    }
    atmosphereImages[0].style.opacity = String(1-mix);
    atmosphereImages[1].style.opacity = String(mix);
}

function render(progress) {
    renderAtmosphere(progress);
    cameraZ = game.hero.z - 3;
    cameraX = game.hero.x * .65;
    const sky = ctx.createLinearGradient(0,0,0,350);
    sky.addColorStop(0,"#394c46"); sky.addColorStop(1,"#c9ab69");
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,960,540);
    oval(750,91,36,36,"#f4cd89");
    for (let z=58;z>=-12;z-=2) {
        ground(-42,z,84,2,z%4 ? "#4c623c" : "#526948");
        ground(-1.5,z,3,2,"#998366");
    }
    const actors = [...trees,...relatives,...game.items,...game.foes.filter(foe => foe.hp),
        {x:0,z:23,house:true},game.hero].sort((a,b)=>b.z-a.z);
    for (const item of actors) {
        const point = project(item.x,item.z);
        if (!point) continue;
        const [x,y,s] = point;
        if (item.house) house(progress);
        else if (item.kind) scenery(x,y,s);
        else if (item.type) oval(x,y-.15*s,.17*s,.22*s,item.type==="wood" ? "#f2ad66" : "#d9e8e6");
        else if (item === game.hero) actor(x,y,s,"#ef9953",game.leader,item.swing);
        else actor(x,y,s,item.hp ? "#a5b66b" : "#74cbd9",item.name + (item.hp ? " · " + item.hp : ""));
    }
    const line = "Život " + game.hero.hp + "/14 · Drvo " + game.wood + " · Kamen " + game.stone +
        " · Bodovi " + game.points + " · " + game.weapon + (game.strength ? " · Snaga" : "");
    const plan = Family.plans[game.stage];
    const buildStatus = progress ? plan.name + " · " + progress.intervals + "/6000 intervala · " + Math.floor(progress.realMs / 1000) + "/18000 s stvarno · " + Math.floor(progress.gameMs / 1000) + "/18000 s u igri · " + ["Kadar", "Pomak", "Zastoj"][progress.second] : plan ? "Gradnja " + game.stage + "/5 · Sledeće: " + plan.name +
        " (" + plan.wood + " drvo, " + plan.stone + " kamen)" : "Gradnja 5/5 · Dom je opremljen";
    document.getElementById("build").disabled = Boolean(progress) || game.phase !== "play";
    const lesson = Family.lessons[game.workshop];
    const prompt = lesson ? lesson.name + " · " + lesson.field + " — " + lesson.question : "Sve četiri radionice su završene.";
    for (const [element,value] of [[statusLine,progress ? "Gradnja je u toku." : game.message],[stats,line],[ui.construction,buildStatus],[ui.lesson,prompt]]) {
        if (element.textContent !== value) element.textContent = value;
    }
    [ui.answer0,ui.answer1].forEach((button,index) => {
        button.hidden = !lesson;
        if (lesson && button.textContent !== lesson.choices[index]) button.textContent = lesson.choices[index];
    });
}

window.addEventListener("keydown", e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const onButton = e.target instanceof HTMLButtonElement;
    if (movement.includes(key) || (key === " " && !onButton)) e.preventDefault();
    if (movement.includes(key)) keys.add(key);
    if (key === " " && !onButton) keys.add(key);
});
window.addEventListener("keyup", e => keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key));
window.addEventListener("blur", () => keys.clear());
for (const button of document.querySelectorAll("[data-key]")) {
    button.onpointerdown = e => {
        button.setPointerCapture(e.pointerId);
        keys.add(button.dataset.key);
    };
    button.onpointerup = button.onpointercancel = button.onlostpointercapture = () => keys.delete(button.dataset.key);
}
const down = (arrow, letter) => Number(keys.has(arrow) || keys.has(letter));
let last = performance.now();
function frame(now) {
    const wallNow = Date.now();
    const elapsed = now - last;
    if (Family.advanceConstruction(game, wallNow, elapsed) ||
        (game.construction && wallNow - savedAt >= 3000)) saveGame();
    const progress = Family.progress(game, wallNow);
    if (!progress) Family.step(game, down("ArrowRight", "d") - down("ArrowLeft", "a"),
        down("ArrowUp", "w") - down("ArrowDown", "s"), Math.max(0, Math.min(.04, elapsed / 1000)));
    if (!progress && keys.has(" ")) Family.attack(game);
    last = now;
    render(progress);
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);






