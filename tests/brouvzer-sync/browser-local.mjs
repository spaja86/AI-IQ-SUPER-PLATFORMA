import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startServer } from '../../pilot/brouvzer/server.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const alt=process.env.CHROMIUM_MODULE?require(process.env.CHROMIUM_MODULE):null;
const options={headless:true,...(alt?{executablePath:process.env.CHROMIUM_EXECUTABLE || await alt.executablePath(),args:alt.args.filter(s=>s!=='--single-process')}: {})};
const app=await startServer(0),profile=await mkdtemp(join(tmpdir(),'spaja-brouvzer-test-'));
let context;const results=[];
const ready=page=>page.waitForFunction(()=>!document.querySelector('#save').disabled);
try{
  context=await chromium.launchPersistentContext(profile,options);let page=await context.newPage();await page.goto(app.origin);await ready(page);
  await page.locator('#title').fill('Sintetički bookmark');await page.locator('#save').click();await page.waitForFunction(()=>document.querySelectorAll('#rows li').length===1);results.push('local bookmark durable commit');
  page.once('dialog',dialog=>dialog.accept('Preimenovan'));await page.getByRole('button',{name:'Preimenuj',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#rows').textContent.includes('Preimenovan'));results.push('rename through UI');
  await page.reload();await ready(page);assert.equal(await page.locator('#rows li').count(),1);results.push('IndexedDB reload');
  await context.close();context=await chromium.launchPersistentContext(profile,options);page=await context.newPage();await page.goto(app.origin);await ready(page);assert.match(await page.locator('#rows').textContent(),/Preimenovan/);results.push('IndexedDB survives browser/profile restart');
  await page.goto(app.origin+'/?inkognito=1');await ready(page);assert.equal(await page.locator('#rows li').count(),0);assert.equal(await page.locator('#invite').isDisabled(),true);
  await page.locator('#save').click();await page.waitForFunction(()=>document.querySelectorAll('#rows li').length===1);await page.reload();await ready(page);assert.equal(await page.locator('#rows li').count(),0);results.push('incognito no read, no persistence, pairing disabled');
  await page.goto(app.origin);await ready(page);assert.equal(await page.locator('#rows li').count(),1);await page.getByRole('button',{name:'Obriši',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('#rows li').length===0);await page.reload();await ready(page);assert.equal(await page.locator('#rows li').count(),0);results.push('deletion survives reload');
  for(const width of [390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}results.push('390/768/1440px no horizontal overflow');
  if(process.env.QA_SCREENSHOT)await page.screenshot({path:process.env.QA_SCREENSHOT,fullPage:true});
  await context.close();context=await chromium.launchPersistentContext(profile,options);await context.addInitScript(()=>{Object.defineProperty(window,'indexedDB',{get(){throw Error('test unavailable storage');}});});
  page=await context.newPage();await page.goto(app.origin);await page.locator('#error').waitFor({state:'visible'});assert.equal(await page.locator('#save').isDisabled(),true);assert.equal(await page.locator('#invite').isDisabled(),true);results.push('unavailable IndexedDB blocks edits and pairing');
  console.log(JSON.stringify({browser:context.browser()?.version()||'Chromium',results,tests:results.length,pass:results.length,rtc:'not exercised by local UI suite'},null,2));
}finally{await context?.close();await app.close();await rm(profile,{recursive:true,force:true});}
