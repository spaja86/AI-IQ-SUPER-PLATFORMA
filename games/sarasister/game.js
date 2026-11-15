const SaraSister = (() => {
    const recipes = {
        Koplje: { wood: 2, crystal: 0, damage: 3, reach: 2.8 },
        "Kristalni mač": { wood: 1, crystal: 2, damage: 5, reach: 2.1 }
    };
    const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function create() {
        return {
            sara: { x: 0, z: 1, hp: 10, cooldown: 0, guard: 0, swing: 0 },
            wood: 0, crystal: 0, weapon: "Štap", phase: "play",
            message: "Sakupi materijal u šumi i pronađi Laru.",
            items: [
                [-2, 3, "wood"], [2, 4, "wood"], [-4, 8, "wood"],
                [5, 11, "crystal"], [-5, 14, "crystal"]
            ].map(([x, z, type]) => ({ x, z, type })),
            foes: [
                [-2, 7, 2, "Senkovuk"], [3, 10, 3, "Močvarni div"],
                [-4, 16, 4, "Kameni čuvar"], [-2, 22, 6, "Dadilja Trn"],
                [2, 24, 7, "Dadilja Magla"]
            ].map(([x, z, hp, name]) => ({ x, z, hp, name, homeX: x, homeZ: z })),
            lara: { x: 0, z: 28 }
        };
    }

    function craft(game, name) {
        if (game.phase !== "play") return false;
        const recipe = recipes[name];
        if (!recipe || game.weapon === name) return false;
        if (game.wood < recipe.wood || game.crystal < recipe.crystal) {
            game.message = "Nedostaje materijal za izradu.";
            return false;
        }
        game.wood -= recipe.wood;
        game.crystal -= recipe.crystal;
        game.weapon = name;
        game.message = "Oružje spremno — " + name;
        return true;
    }

    function attack(game) {
        const sara = game.sara;
        if (game.phase !== "play" || sara.cooldown > 0) return false;
        sara.cooldown = 0.43;
        sara.swing = 0.21;
        const weapon = recipes[game.weapon] || { damage: 1, reach: 1.8 };
        const target = game.foes.filter(foe => foe.hp > 0 && distance(sara, foe) <= weapon.reach)
            .sort((a, b) => distance(sara, a) - distance(sara, b))[0];
        if (!target) return false;
        target.hp = Math.max(0, target.hp - weapon.damage);
        game.message = target.hp ? "Pogodak — " + target.name : "Poražen protivnik — " + target.name;
        return true;
    }

    function step(game, dx, dz, dt) {
        if (game.phase !== "play") return;
        const sara = game.sara;
        sara.cooldown = Math.max(0, sara.cooldown - dt);
        sara.guard = Math.max(0, sara.guard - dt);
        sara.swing = Math.max(0, sara.swing - dt);
        const length = Math.max(1, Math.hypot(dx, dz));
        sara.x = clamp(sara.x + dx / length * dt * 6, -7.5, 7.5);
        sara.z = clamp(sara.z + dz / length * dt * 6, 0, 30);
        game.items = game.items.filter(item => {
            if (distance(sara, item) > 1) return true;
            game[item.type]++;
            game.message = item.type === "wood" ? "Sakupljeno drvo." : "Sakupljen kristal.";
            return false;
        });

        for (const foe of game.foes) {
            if (foe.hp <= 0) continue;
            const gap = distance(sara, foe);
            if (gap > 0.95 && gap < 5.5) {
                foe.x += (sara.x - foe.x) / gap * dt * 1.7;
                foe.z += (sara.z - foe.z) / gap * dt * 1.7;
            }
            if (gap <= 1.05 && sara.guard === 0) {
                sara.hp--;
                sara.guard = 0.9;
                game.message = "Sara je pogođena. Odmakni se i napadni.";
            }
        }

        if (sara.hp <= 0) {
            game.phase = "lost";
            game.message = "Sara je pala. Pokušaj ponovo.";
        } else if (distance(sara, game.lara) < 1.7) {
            if (game.foes.some(foe => foe.homeZ >= 22 && foe.hp > 0)) {
                game.message = "Pobedi obe dadilje da oslobodiš Laru.";
            } else {
                game.phase = "won";
                game.message = "Lara je slobodna. Mama je stigla!";
            }
        }
    }

    return { create, craft, attack, step };
})();
if (typeof module !== "undefined") module.exports = SaraSister;

