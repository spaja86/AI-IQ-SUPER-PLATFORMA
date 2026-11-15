const statusLine = document.querySelector("#status");
const stats = document.querySelector("#stats");
const ctx = document.querySelector("canvas").getContext("2d");
const keys = new Set();
const movement = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
let game = SaraSister.create();
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

function scenery(x, y, s, kind) {
    if (kind === "toranj") {
        ctx.fillStyle = "#443f54";
        ctx.fillRect(x - 1.4 * s, y - 5 * s, 2.8 * s, 5 * s);
        ctx.fillStyle = "#edab64";
        ctx.fillRect(x - 0.18 * s, y - 4 * s, 0.36 * s, 0.75 * s);
        return;
    }
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
const sceneryItems = [...trees, { x: -5, z: 30, kind: "toranj" }, { x: 5, z: 30, kind: "toranj" }];

function render() {
    cameraZ = game.sara.z - 3;
    cameraX = game.sara.x * .65;
    const sky = ctx.createLinearGradient(0, 0, 0, 350);
    sky.addColorStop(0, "#142b37");
    sky.addColorStop(1, "#7d7761");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 960, 540);
    oval(750, 91, 36, 36, "#f4cd89");
    for (let z = 58; z >= -12; z -= 2) {
        ground(-42, z, 84, 2, z % 4 ? "#3c5442" : "#405a46");
        ground(-1.5, z, 3, 2, z >= 20 ? "#777064" : "#6d6550");
    }
    const actors = [
        ...sceneryItems, ...game.items, ...game.foes.filter(foe => foe.hp > 0),
        game.sara, game.lara
    ].sort((a, b) => b.z - a.z);
    for (const item of actors) {
        const point = project(item.x, item.z);
        if (!point) continue;
        const [x, y, s] = point;
        if (item.kind) scenery(x, y, s, item.kind);
        else if (item.type) oval(x, y - .15 * s, .17 * s, .22 * s, item.type === "wood" ? "#f2ad66" : "#8af4ed");
        else if (item === game.sara) actor(x, y, s, "#e98149", "Sara", item.swing);
        else if (item === game.lara) actor(x, y, s, "#74cbd9", "Lara");
        else actor(x, y, s, item.homeZ >= 22 ? "#b96391" : "#8d9d57", item.name + " · " + item.hp);
    }
    if (statusLine.textContent !== game.message) statusLine.textContent = game.message;
    const line = "Život " + game.sara.hp + "/10 · Drvo " + game.wood + " · Kristali " + game.crystal + " · " + game.weapon;
    if (stats.textContent !== line) stats.textContent = line;
}

window.addEventListener("keydown", e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const onButton = e.target instanceof HTMLButtonElement;
    if (movement.includes(key) || (key === " " && !onButton)) e.preventDefault();
    if (movement.includes(key)) keys.add(key);
    if (key === " " && !onButton) keys.add(key);
    if (key === "1") SaraSister.craft(game, "Koplje");
    if (key === "2") SaraSister.craft(game, "Kristalni mač");
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
document.querySelector("#attack").onclick = () => SaraSister.attack(game);
document.querySelector("#spear").onclick = () => SaraSister.craft(game, "Koplje");
document.querySelector("#sword").onclick = () => SaraSister.craft(game, "Kristalni mač");
document.querySelector("#restart").onclick = () => { game = SaraSister.create(); keys.clear(); };
const down = (arrow, letter) => Number(keys.has(arrow) || keys.has(letter));
let last = performance.now();
function frame(now) {
    SaraSister.step(game, down("ArrowRight", "d") - down("ArrowLeft", "a"),
        down("ArrowUp", "w") - down("ArrowDown", "s"), Math.min(.04, (now - last) / 1000));
    if (keys.has(" ")) SaraSister.attack(game);
    last = now;
    render();
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);


