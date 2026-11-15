import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { serve } from "./server.mjs";

test("All three launch tools match the corresponding in-chat and web games",async t => {
    const server = serve().listen(0,"127.0.0.1");
    t.after(() => new Promise(resolve => server.close(resolve)));
    await once(server,"listening");
    const base = "http://127.0.0.1:"+server.address().port;
    let id = 0;
    const rpc = async (method,params) => {
        const reply = await fetch(base+"/mcp",{method:"POST",headers:{"Content-Type":"application/json",
            Accept:"application/json, text/event-stream"},body:JSON.stringify({jsonrpc:"2.0",id:++id,method,params})});
        assert.ok(reply.ok);
        return reply.json();
    };
    assert.equal((await rpc("initialize",{protocolVersion:"2025-11-25"})).result.serverInfo.name,"spaja-igre");
    const {tools} = (await rpc("tools/list")).result;
    assert.deepEqual(tools.map(tool => tool.name),["pokreni_sarasister","pokreni_nikolabroher","pokreni_arkada","pokreni_spajicfemily"]);
    const {resources} = (await rpc("resources/list")).result;
    assert.equal(new Set(resources.map(resource => resource.uri)).size,4);
    const web = await (await fetch(base)).text();
    for (const [i,tool] of tools.entries()) {
        const slug = tool.name.replace("pokreni_","");
        assert.ok(web.includes("/igre/"+slug+"/"));
        const uri = tool._meta.ui.resourceUri;
        assert.equal(resources[i].uri,uri);
        const call = await rpc("tools/call",{name:tool.name,arguments:{}});
        assert.ok(call.result.content[0].text.includes(resources[i].name));
        const result = await rpc("resources/read",{uri});
        const {text,mimeType} = result.result.contents[0];
        assert.equal(mimeType,"text/html;profile=mcp-app");
        assert.ok(text.includes(slug === "arkada" ? 'id="actions"' : "<canvas"));
        assert.ok(text.includes("ui/initialize"));
        assert.ok(!text.includes("<script src="));
        const response = await fetch(base+"/igre/"+slug+"/");
        assert.equal(response.status,200);
        assert.ok((await response.text()).includes(slug === "arkada" ? 'id="actions"' : "<canvas"));
        const source = await (await fetch(base+"/igre/"+slug+"/game.js")).text();
        assert.ok(source.length > 1000 && text.includes(source));
        if (slug === "spajicfemily") assert.ok(text.includes('id="ambience-new"') && text.includes("18_000_000"));
    }
    assert.equal((await rpc("tools/call",{name:"missing"})).error.code,-32602);
    assert.equal((await rpc("resources/read",{uri:"ui://missing"})).error.code,-32002);
    assert.equal((await fetch(base+"/igre/missing/")).status,404);
});


