import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const versions = ["2025-11-25","2025-06-18","2025-03-26"];
const mimeType = "text/html;profile=mcp-app";
const definitions = [
    { id:"sarasister", title:"SARAsister", description:"Sara izrađuje oružje i spasava Laru." },
    { id:"nikolabroher", title:"NikolaBroher", description:"Nikola razvija veštine i spasava Saru i Laru." },
    { id:"arkada", title:"SPAJA Arkada", description:"Izaberi jedan od 30 izazova ili pokreni nasumičnu igru." },
    { id:"spajicfemily", title:"SPAJIĆfemily", description:"Porodične radionice, šumska avantura i gradnja kuće." }
];

async function loadGame(definition) {
    const { id,title,description } = definition;
    const read = name => readFile(new URL("./games/"+id+"/"+name,import.meta.url),"utf8");
    const scripts = ["game.js",...(id === "spajicfemily" ? ["atmosphere.js"] : []),"view.js","bridge.js"];
    const assets = new Map(await Promise.all(["index.html",...scripts].map(async name => [name,await read(name)])));
    const page = assets.get("index.html");
    let widget = page;
    for (const name of scripts.slice(0,-1)) {
        const source = assets.get(name).replace(/<\/script/gi,"<\\/script");
        widget = widget.replace('<script src="'+name+'"></script>',() => "<script>"+source+"</script>");
    }
    widget += "<script>"+assets.get("bridge.js")+"</script>";
    const uri = "ui://spaja-igre/"+id+".html";
    const tool = {
        name:"pokreni_"+id, title:"Pokreni "+title, description:"Pokreni igru "+title+". "+description,
        inputSchema:{type:"object",properties:{},additionalProperties:false},
        annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false},
        _meta:{ui:{resourceUri:uri}}
    };
    return { id,title,assets,tool,uri,widget };
}
const games = await Promise.all(definitions.map(loadGame));
const landing = '<!doctype html><html lang="sr-Latn"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>SPAJA Igre</title><style>body{max-width:650px;margin:48px auto;padding:0 20px;background:#131d1c;color:#fff1d3;font:18px system-ui}a{color:#ffcf7f}li{margin:24px 0}</style><h1>SPAJA Igre</h1><ul>' +
    games.map(game => '<li><a href="/igre/'+game.id+'/">'+game.title+'</a></li>').join("") + '</ul></html>';

function dispatch(method,params) {
    switch (method) {
        case "initialize":
            return { protocolVersion:versions.includes(params?.protocolVersion) ? params.protocolVersion : versions[0],
                capabilities:{tools:{},resources:{}},serverInfo:{name:"spaja-igre",version:"1.0.0"} };
        case "ping": return {};
        case "tools/list": return {tools:games.map(game => game.tool)};
        case "resources/list": return {resources:games.map(game => ({uri:game.uri,name:game.title,mimeType}))};
        case "resources/templates/list": return {resourceTemplates:[]};
        case "resources/read": {
            const game = games.find(item => item.uri === params?.uri);
            if (!game) throw {code:-32002,message:"Resource not found"};
            return {contents:[{uri:game.uri,mimeType,text:game.widget}]};
        }
        case "tools/call": {
            const game = games.find(item => item.tool.name === params?.name);
            const args = params?.arguments;
            if (!game || (args != null && (typeof args !== "object" || Array.isArray(args) || Object.keys(args).length))) {
                throw {code:-32602,message:"Invalid tool or arguments"};
            }
            return {content:[{type:"text",text:game.title+" je spremna za igranje u prikazu."}]};
        }
        default: throw {code:-32601,message:"Method not found"};
    }
}

function servePage(request,response) {
    if (request.method !== "GET") return false;
    if (request.url === "/") {
        response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}).end(landing);
        return true;
    }
    const match = /^\/igre\/([a-z]+)\/([a-z.]+)?$/.exec(request.url);
    const game = match && games.find(item => item.id === match[1]);
    const file = match?.[2] || "index.html";
    if (!game?.assets.has(file)) return false;
    response.writeHead(200,{"Content-Type":file.endsWith(".js") ?
        "text/javascript; charset=utf-8" : "text/html; charset=utf-8"}).end(game.assets.get(file));
    return true;
}

export function serve({ allowedOrigin = process.env.MCP_ALLOWED_ORIGIN } = {}) {
    return createServer(async (request, response) => {
        const json = (status, value) => {
            response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(value));
        };
        if (request.url === "/health" && request.method === "GET") return json(200, { ok: true });
        if (servePage(request,response)) return;
        if (request.url !== "/mcp") return json(404, { error: "Not found" });
        if (request.headers.origin && request.headers.origin !== allowedOrigin)
            return json(403, { error: "Unexpected origin" });
        if (request.method !== "POST") {
            response.writeHead(405, { Allow: "POST" }).end();
            return;
        }
        let id = null;
        try {
            let raw = "";
            for await (const chunk of request.setEncoding("utf8")) {
                raw += chunk;
                if (Buffer.byteLength(raw) > 65536) return json(413, { error: "Request too large" });
            }
            let requestBody;
            try { requestBody = JSON.parse(raw); }
            catch { throw { code: -32700, message: "Parse error" }; }
            if (requestBody?.jsonrpc !== "2.0" || typeof requestBody.method !== "string")
                throw { code: -32600, message: "Invalid request" };
            if (requestBody.id === undefined) return response.writeHead(202).end();
            id = requestBody.id;
            return json(200, { jsonrpc: "2.0", id, result: dispatch(requestBody.method, requestBody.params) });
        } catch (error) {
            return json(200, { jsonrpc: "2.0", id, error: { code: error.code ?? -32603,
                message: error.code ? error.message : "Internal error" } });
        }
    });
}







