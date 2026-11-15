const Family = (() => {
    const plans = [
        { name:"Temelj", wood:0, stone:3 },
        { name:"Zidovi", wood:2, stone:3 },
        { name:"Krov", wood:3, stone:1 },
        { name:"Kuhinja i sto", wood:2, stone:1 },
        { name:"Kreveti i radni kutak", wood:3, stone:0 }
    ];
    const lessons = [
        { name:"Nikola", field:"Škola i zanat", question:"Kako bezbedno naučiti novi zanat?", choices:["Pogledaj uputstvo i vežbaj uz nadzor.","Preskoči probu i uzmi alat."], answer:0 },
        { name:"Sara", field:"Psihologija", question:"Kako razgovarati sa detetom koje se uznemirilo?", choices:["Prekini razgovor.","Saslušaj ga i pitaj kako se oseća."], answer:1 },
        { name:"Darko", field:"Rad i saradnja", question:"Kako da porodica planira gradnju?", choices:["Dogovorite budžet, mere i uloge.","Počnite svi od istog zadatka."], answer:0 },
        { name:"Lara", field:"Pedagogija", question:"Šta pomaže kada je zadatak težak?", choices:["Odustani čim pogrešiš.","Podeli ga na korake i traži pomoć."], answer:1 }
    ];
    const weapons = {
        "Drveno koplje": { wood:2, stone:0, damage:3, reach:2.8 },
        "Kameni čekić": { wood:1, stone:2, damage:5, reach:2.2 }
    };
    const distance = (a,b) => Math.hypot(a.x-b.x,a.z-b.z);
    const camp = { x:0,z:2 };
    const home = { x:0,z:23 };
    const clamp = (x,min,max) => Math.max(min,Math.min(max,x));
    const playing = game => game.phase === "play";

    function create() {
        return {
            hero:{ x:0,z:2,hp:14,guard:0,cooldown:0,swing:0 }, leader:"Lepa Goca",
            wood:0,stone:0,weapon:"Štap",points:0,strength:false,workshop:0,stage:0,phase:"play",
            message:"Pokupi drvo i kamen. U radionici možeš da učiš i zaradiš materijal.",
            items:[[-2,3,"wood"],[2,3,"wood"],[-3,6,"wood"],[4,7,"stone"],[2,9,"stone"],[-3,13,"stone"]]
                .map(([x,z,type])=>({x,z,type})),
            foes:[[-2,8,3,"Senkovuk"],[3,12,5,"Močvarni div"],[-3,17,7,"Kameni čuvar"]]
                .map(([x,z,hp,name])=>({x,z,hp,name}))
        };
    }

    function switchLeader(game) {
        if (!playing(game)) return;
        game.leader = game.leader === "Lepa Goca" ? "Otac Milenk" : "Lepa Goca";
        game.message = game.leader + " vodi porodicu.";
    }

    function spend(game, recipe) {
        if (game.wood < recipe.wood || game.stone < recipe.stone) {
            game.message = "Nedostaje materijal.";
            return false;
        }
        game.wood -= recipe.wood;
        game.stone -= recipe.stone;
        return true;
    }

    function craft(game,name) {
        if (!playing(game) || !Object.hasOwn(weapons,name) || game.weapon === name) return false;
        if (!spend(game,weapons[name])) return false;
        game.weapon = name;
        game.message = "Izrađeno oružje — " + name;
        return true;
    }

    function develop(game) {
        if (!playing(game) || game.strength) return false;
        if (!game.points) {
            game.message = "Pobedi stvorenje da zaradiš bod veštine.";
            return false;
        }
        game.points--;
        game.strength = true;
        game.message = "Razvijena Snaga · +2 štete pri napadu.";
        return true;
    }

    function atCamp(game) {
        if (distance(game.hero,camp) < 2.4) return true;
        game.message = "Vrati se u radionicu, na početak staze.";
        return false;
    }

    function teach(game, choice) {
        if (!playing(game) || !lessons[game.workshop] || !atCamp(game)) return false;
        if (choice !== lessons[game.workshop].answer) {
            game.message = "Razgovarajte o odgovoru i pokušajte ponovo.";
            return false;
        }
        game.message = "Završena radionica — " + lessons[game.workshop++].name;
        return true;
    }

    function work(game, job) {
        if (!playing(game) || !["stolarija","kamen"].includes(job) || !atCamp(game)) return false;
        game[job === "stolarija" ? "wood" : "stone"] += 2;
        game.message = job === "stolarija" ? "Stolarija · +2 drveta." : "Kamenorez · +2 kamena.";
        return true;
    }

    function build(game, wallNow) {
        if (!playing(game)) return false;
        if (game.construction) return false;
        if (distance(game.hero,home) >= 3) {
            game.message = "Priđi gradilištu na kraju staze.";
            return false;
        }
        if (game.foes.some(foe => foe.hp)) {
            game.message = "Pobedi sva stvorenja da otvoriš gradilište.";
            return false;
        }
        if (game.workshop < lessons.length) {
            game.message = "Završi sve porodične radionice pre gradnje.";
            return false;
        }
        const plan = plans[game.stage];
        if (!spend(game,plan)) return false;
        game.construction = { startedAt: wallNow, gameMs: 0 };
        game.message = "Započeto — " + plan.name;
        return true;
    }

    const minimumMs = 18_000_000;
    const intervalMs = 3_000;

    function progress(game, wallNow) {
        const job = game.construction;
        if (!job) return null;
        const realMs = Math.min(minimumMs, Math.max(0, wallNow - job.startedAt));
        const gameMs = job.gameMs;
        return { realMs, gameMs, intervals: Math.floor(gameMs / intervalMs),
            second: Math.floor(gameMs / 1000) % 3 };
    }

    function advanceConstruction(game, wallNow, elapsedGameMs) {
        if (!game.construction) return false;
        game.construction.gameMs = Math.min(minimumMs,
            game.construction.gameMs + Math.max(0, elapsedGameMs));
        const { realMs, gameMs } = progress(game, wallNow);
        if (realMs < minimumMs || gameMs < minimumMs) return false;
        game.construction = null;

        const plan = plans[game.stage];
        game.stage++;
        game.message = "Završeno — " + plan.name;
        if (game.stage === plans.length) {
            game.phase = "won";
            game.message = "Porodica Spajić je završila kuću i opremila sve prostorije!";
        }
        return true;
    }

    function attack(game) {
        const hero = game.hero;
        if (!playing(game) || hero.cooldown > 0) return false;
        hero.cooldown = .43;
        hero.swing = .21;
        const weapon = weapons[game.weapon] || {damage:1,reach:1.8};
        const target = game.foes.filter(foe => foe.hp && distance(hero,foe) <= weapon.reach)
            .sort((a,b) => distance(hero,a)-distance(hero,b))[0];
        if (!target) return false;
        target.hp = Math.max(0,target.hp-weapon.damage-(game.strength ? 2 : 0));
        game.message = "Pogodak — " + target.name;
        if (!target.hp) {
            game.points++;
            game.message = "Poraženo stvorenje — " + target.name + " · +1 bod veštine.";
        }
        return true;
    }

    function step(game,dx,dz,dt) {
        if (!playing(game)) return;
        const hero = game.hero;
        for (const timer of ["cooldown","guard","swing"]) hero[timer] = Math.max(0,hero[timer]-dt);
        const length = Math.max(1,Math.hypot(dx,dz));
        hero.x = clamp(hero.x + dx/length*dt*6,-7.5,7.5);
        hero.z = clamp(hero.z + dz/length*dt*6,0,28);
        game.items = game.items.filter(item => {
            if (distance(hero,item) > 1) return true;
            game[item.type]++;
            game.message = item.type === "wood" ? "Sakupljeno drvo." : "Sakupljen kamen.";
            return false;
        });
        for (const foe of game.foes) {
            if (!foe.hp) continue;
            const gap = distance(hero,foe);
            if (gap > .95 && gap < 4.2) {
                foe.x += (hero.x-foe.x)/gap*dt*1.55;
                foe.z += (hero.z-foe.z)/gap*dt*1.55;
            }
            if (gap <= 1.05 && hero.guard === 0) {
                hero.hp--;
                hero.guard = .9;
                game.message = "Pogodilo te je stvorenje. Odmakni se i napadni.";
            }
        }
        if (hero.hp <= 0) {
            game.phase = "lost";
            game.message = "Porodica se povukla. Pokreni novu igru.";
        }
    }
    return { create, switchLeader, craft, develop, teach, work, build, advanceConstruction, progress, attack, step, plans, lessons, home, minimumMs, intervalMs };
})();
if (typeof module !== "undefined") module.exports = Family;


