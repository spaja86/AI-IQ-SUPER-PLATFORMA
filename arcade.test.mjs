import { test } from "node:test";
import assert from "node:assert/strict";
import Arcade from "./games/arkada/game.js";

for (const spec of Arcade.catalog) {
    const [id,title,mode] = spec;
    test(title+" has playable winning and losing routes", () => {
        const initial = Arcade.create(id);
        const pending = [initial];
        const seen = new Set();
        const outcomes = new Set();
        while (pending.length && outcomes.size < 2) {
            const game = pending.pop();
            if (game.phase !== "play") { outcomes.add(game.phase); continue; }
            const key = [game.turn,game.score,game.risk].join("/");
            if (seen.has(key)) continue;
            seen.add(key);
            for (const [index] of Arcade.prompt(game).choices.entries()) {
                const next = {...game};
                assert.equal(Arcade.move(next,index),true);
                pending.push(next);
            }
        }
        assert.equal(Arcade.move(initial,-1),false);
        assert.equal(initial.turn,0);
        assert.ok(outcomes.has("won"),mode+" has a path to victory");
        assert.ok(outcomes.has("lost"),mode+" has a path to defeat");
    });
}
test("Random pick can reach all 30 games and skips the current one",()=>{
    assert.equal(Arcade.catalog.length,30);
    const choices = Array.from({length:30},(_,i)=>Arcade.random(null,()=> (i+.5)/30));
    assert.equal(new Set(choices).size,30);
    for (const id of choices) assert.notEqual(Arcade.random(id,()=>0),id);
});

