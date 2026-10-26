import { BookmarkModel, indexedStorage } from './model.mjs';
import { PeerSync } from './transport.mjs';
const $ = id => document.getElementById(id);
const incognito = new URL(location.href).searchParams.get('inkognito') === '1';
let model, peer, busy = false;
function error(e) { $('error').textContent = e.message || String(e); $('error').hidden = false; }
function status(s) { $('status').textContent = s; }
function render() {
  $('rows').replaceChildren();
  for (const row of model.rows()) {
    const li = document.createElement('li'), text = document.createElement('span');
    text.textContent = `${row.title} — ${row.url}`; li.append(text);
    const rename = document.createElement('button'); rename.textContent = 'Preimenuj';
    rename.onclick = () => { const title = prompt('Novi naziv', row.title); if (title !== null) run(() => model.put(row.id, { title, url: row.url })); };
    const remove = document.createElement('button'); remove.textContent = 'Obriši';
    remove.onclick = () => run(() => model.remove(row.id)); li.append(rename, remove); $('rows').append(li);
  }
  $('storage').textContent = incognito ? 'Inkognito: samo memorija. Čuvanje i mrežna razmena su isključeni.' : 'Stanje probne kolekcije je potvrđeno u lokalnoj bazi.';
}
function controls() {
  $('save').disabled = !model || busy;
  for (const id of ['invite', 'accept']) $(id).disabled = !peer || !!peer.pc || busy;
  $('finish').disabled = !peer?.offer || !!peer?.answer || busy;
  $('confirm').disabled = !peer?.gate || peer.gate.confirmed || busy;
  $('revoke').disabled = !peer?.pc || busy;
  $('code').textContent = peer?.gate?.code || 'Otisak još nije dostupan.';
}
async function run(fn) {
  if (busy) return; busy = true; $('error').hidden = true; controls();
  try { await fn(); } catch (e) { error(e); }
  finally { busy = false; controls(); }
}
try {
  const candidate = new BookmarkModel({ incognito, storage: incognito ? null : indexedStorage(indexedDB) });
  await candidate.init(); model = candidate;
  model.onChange(render); render();
  if (!incognito) peer = new PeerSync(model, { onStatus: s => { status(s); controls(); }, onError: error, onDiagnostics: d => { $('network').textContent = `Mreža: ${d.connection}; ICE: ${d.ice}; kanal: ${d.channel}; kandidati: ${d.candidates.total} (direktni ${d.candidates.host}, preko relay-a ${d.candidates.relay}).`; } });
  status(incognito ? 'Inkognito pilot: bez skladišta i bez mreže.' : 'Lokalna kolekcija spremna. Veza još nije uparena.');
  $('mode').textContent = incognito ? 'Vrati se u probnu trajnu kolekciju' : 'Otvori inkognito pilot';
  $('mode').href = incognito ? '/' : '/?inkognito=1'; controls();
} catch (e) { error(e); status('Baza nije dostupna. Rad je zaustavljen.'); }
$('bookmark').onsubmit = e => { e.preventDefault(); run(async () => { await model.put(crypto.randomUUID(), { title: $('title').value, url: $('url').value }); }); };
const input = () => { if ($('incoming').value.length > 60000) throw Error('Signal je prevelik.'); return JSON.parse($('incoming').value); };
$('invite').onclick = () => run(async () => { try { $('outgoing').value = JSON.stringify(await peer.invite()); } catch(e) { peer.close(); throw e; } });
$('accept').onclick = () => run(async () => { try { $('outgoing').value = JSON.stringify(await peer.accept(input())); } catch(e) { peer.close(); throw e; } });
$('finish').onclick = () => run(async () => { try { await peer.finish(input()); } catch(e) { peer.close(); throw e; } });
$('confirm').onclick = () => run(() => { try { peer.confirm($('peerCode').value); status('Vaša potvrda je prihvaćena. Čeka se potvrda drugog uređaja.'); } catch(e) { peer.close(); throw e; } });
$('revoke').onclick = () => run(() => { peer.close(); $('incoming').value = ''; $('outgoing').value = ''; $('peerCode').value = ''; $('code').textContent = 'Potrebno je novo uparivanje.'; });
window.addEventListener('pagehide', () => peer?.destroy());
