const NikolaBroher = (() => {
    const recipes = {
        Koplje: { wood: 2, crystal: 0, damage: 3, reach: 2.8 },
        "Kristalni mač": { wood: 1, crystal: 2, damage: 5, reach: 2.2 }
    };
    const skills = {
        Snaga: { description: "+2 štete pri napadu" },
        Izdržljivost: { description: "+4 maksimalnog života i oporavak" }
    };
    const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function create() {
        return {
            hero: { x: 0, z: 1, hp: 12, maxHp: 12, cooldown: 0, guard: 0, swing: 0 },
            wood: 0, crystal: 0, weapon: "Štap", phase: "play", xp: 0, points: 0,
            skills: {}, message: "Sakupi drvo, napravi oružje i pronađi Saru.",
            items: [[-2,3,"wood"], [2,4,"wood"], [-4,8,"wood"], [4,11,"crystal"], [-5,14,"crystal"]]
                .map(([x,z,type]) => ({ x,z,type })),
            foes: [
                [-2, 7, 3, "Senkovuk"], [3, 10, 4, "Močvarni div"], [-4, 15, 5, "Kameni čuvar"],
                [-2, 20, 8, "Profesor Trn", "Sara"], [2, 26, 10, "Profesorka Magla", "Lara"]
            ].map(([x,z,hp,name,prisoner]) => ({ x,z,hp,name,prisoner })),
            prisoners: [{ x:0,z:22,name:"Sara",free:false }, { x:0,z:29,name:"Lara",free:false }]
        };
    }

    function craft(game, name) {
        const recipe = Object.hasOwn(recipes, name) ? recipes[name] : null;
        if (game.phase !== "play" || !recipe || game.weapon === name) return false;
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

    function develop(game, name) {
        if (game.phase !== "play" || !Object.hasOwn(skills, name) || game.skills[name]) return false;
        if (!game.points) {
            game.message = "Pobedi protivnika da dobiješ bod veštine.";
            return false;
        }
        game.points--;
        game.skills[name] = true;
        if (name === "Izdržljivost") {
            game.hero.maxHp += 4;
            game.hero.hp = Math.min(game.hero.maxHp, game.hero.hp + 6);
        }
        game.message = name + " — " + skills[name].description;
        return true;
    }

    function attack(game) {
        const hero = game.hero;
        if (game.phase !== "play" || hero.cooldown > 0) return false;
        hero.cooldown = 0.43;
        hero.swing = 0.21;
        const weapon = recipes[game.weapon] || { damage: 1, reach: 1.8 };
        const target = game.foes.filter(foe => foe.hp > 0 && distance(hero, foe) <= weapon.reach)
            .sort((a,b) => distance(hero,a) - distance(hero,b))[0];
        if (!target) return false;
        target.hp = Math.max(0, target.hp - weapon.damage - (game.skills.Snaga ? 2 : 0));
        game.message = "Pogodak — " + target.name;
        if (!target.hp) {
            game.xp += 100;
            game.points++;
            game.message = "Poražen protivnik — " + target.name + " · +1 bod veštine";
        }
        return true;
    }

    function step(game, dx, dz, dt) {
        if (game.phase !== "play") return;
        const hero = game.hero;
        for (const timer of ["cooldown", "guard", "swing"]) hero[timer] = Math.max(0, hero[timer] - dt);
        const length = Math.max(1, Math.hypot(dx,dz));
        hero.x = clamp(hero.x + dx / length * dt * 6, -7.5, 7.5);
        hero.z = clamp(hero.z + dz / length * dt * 6, 0, 31);
        game.items = game.items.filter(item => {
            if (distance(hero,item) > 1) return true;
            game[item.type]++;
            game.message = item.type === "wood" ? "Sakupljeno drvo." : "Sakupljen kristal.";
            return false;
        });
        for (const foe of game.foes) {
            if (!foe.hp) continue;
            const gap = distance(hero,foe);
            if (gap > 0.95 && gap < 4.5) {
                foe.x += (hero.x-foe.x) / gap * dt * 1.6;
                foe.z += (hero.z-foe.z) / gap * dt * 1.6;
            }
            if (gap <= 1.05 && hero.guard === 0) {
                hero.hp--;
                hero.guard = 0.9;
                game.message = "Nikola je pogođen. Odmakni se i napadni.";
            }
        }
        if (hero.hp <= 0) {
            game.phase = "lost";
            game.message = "Nikola je pao. Pokušaj ponovo.";
            return;
        }
        for (const prisoner of game.prisoners) {
            if (prisoner.free || distance(hero,prisoner) >= 1.7) continue;
            const guard = game.foes.find(foe => foe.prisoner === prisoner.name);
            if (guard.hp) {
                game.message = "Pobedi čuvara — " + guard.name;
            } else {
                prisoner.free = true;
                game.message = prisoner.name + " je slobodna! Pronađi i drugu.";
            }
        }
        if (game.prisoners.every(prisoner => prisoner.free)) {
            game.phase = "won";
            game.message = "Sara i Lara su slobodne. Misija je završena!";
        }
    }

    return { create, craft, develop, attack, step };
})();
if (typeof module !== "undefined") module.exports = NikolaBroher;

