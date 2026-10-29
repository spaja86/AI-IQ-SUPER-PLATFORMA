import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
const status = (url,headers) => new Promise((resolve,reject)=>{const req=request(url,{headers},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
import { startServer } from '../../pilot/brouvzer/server.mjs';
test('loopback service serves only assets, rejects hostile origins/hosts and mutations',async()=>{
  const app=await startServer(0);try{
    const r=await fetch(app.origin);assert.equal(r.status,200);assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(r.headers.get('cache-control'),'no-store');
    for(const headers of [{Origin:'https://example.com'},{Host:'evil.example'},{'Sec-Fetch-Site':'cross-site'}]) assert.equal(await status(app.origin,headers),403,JSON.stringify(headers));
    assert.equal((await fetch(app.origin,{method:'POST'})).status,405);
    assert.equal((await fetch(app.origin+'/package-lock.json')).status,404);
    assert.equal((await fetch(app.origin+'/model.mjs')).status,404);
  }finally{await app.close();}
});
