'use strict';
const $ = id => document.getElementById(id);
const status = { paused: ['🟡 Čeka pokretanje / pauzirano', 'wait'], queued: ['🔵 U redu za izvršavanje', 'active'], running: ['🔵 Izvršavanje u toku', 'active'], succeeded: ['🟢 Potvrđeno završeno', 'done'], failed: ['🔴 Neuspešno', 'blocked'], interrupted: ['🔴 Prekinuto — proverite pa ponovite', 'blocked'], canceled: ['🟡 Otkazano', 'wait'] };
let selected = '', refreshing = false, lastList = '', refreshAgain = false;
let viewVersion = 0, visibleRun = null, actionBusy = false, refreshError = false;
async function api(path, method = 'GET', value) {
  const response = await fetch(path, { method, headers: { 'X-SUOC-Pilot': '1', ...(value === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(value === undefined ? {} : { body: JSON.stringify(value) }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Zahtev nije uspeo.');
  return data;
}
function showError(error) { $('error').textContent = error.message; $('error').hidden = false; }
function updateControls() {
  $('create').disabled = actionBusy; $('example').disabled = actionBusy;
  for (const button of $('controls').querySelectorAll('button')) {
    const run = visibleRun?.id === selected ? visibleRun : null;
    const allowed = run && (button.dataset.action === 'retry' ? ['failed', 'interrupted'].includes(run.status) : ['paused', 'queued'].includes(run.status));
    button.disabled = actionBusy || !allowed;
  }
}
function invalidateDetail() { visibleRun = null; $('detail').hidden = true; if ($('command-target')) $('command-target').textContent = 'Izabrani zadatak još nije potvrđen.'; updateControls(); }
function selectRun(id) { selected = id; viewVersion++; invalidateDetail(); void refresh(); }
async function action(fn) {
  if (actionBusy) return;
  actionBusy = true; viewVersion++; invalidateDetail(); $('error').hidden = true; refreshError = false;
  try { await fn(); } catch (error) { showError(error); }
  finally { await refresh(); actionBusy = false; updateControls(); }
}
function badge(node, value) { const item = status[value] || [value, 'wait']; node.textContent = item[0]; node.className = `badge ${item[1]}`; }
async function refresh() {
  if (refreshing) { refreshAgain = true; return; }
  refreshing = true;
  const version = viewVersion;
  try {
    await api('/api/status');
    const runs = await api('/api/runs');
    if (!selected && runs.length) selected = runs[0].id;
    const requestedId = selected;
    const data = requestedId ? await api(`/api/runs/${requestedId}`) : null;
    // A delayed response must never render a different run from the command target.
    if (version !== viewVersion || requestedId !== selected) { refreshAgain = true; return; }
    $('health').textContent = '🟢 Lokalni servis je dostupan';
    if (refreshError) { $('error').hidden = true; refreshError = false; }
    const list = $('runs'), signature = JSON.stringify(runs);
    if (signature !== lastList) {
      list.replaceChildren(); lastList = signature;
      if (!runs.length) list.textContent = 'Još nema sačuvanih zadataka.';
      for (const run of runs) {
        const button = document.createElement('button'); button.className = 'run';
        const name = document.createElement('strong'); name.textContent = run.name;
        const state = document.createElement('span'); badge(state, run.status);
        button.append(name, state); button.onclick = () => selectRun(run.id); list.append(button);
      }
    }
    if (data) {
      const run = data.run;
      visibleRun = run;
      if ($('command-target')) $('command-target').textContent = `Izabrani zadatak: ${run.name}`;
      $('detail').hidden = false; $('detail-title').textContent = run.name; badge($('run-status'), run.status);
      const done = run.steps.filter(step => step.status === 'succeeded').length;
      $('progress').textContent = `${done}/${run.steps.length} uspešnih koraka = ${Math.round(done / run.steps.length * 100)}% ovog zadatka.`;
      const steps = $('steps'); steps.replaceChildren();
      for (const step of run.steps) {
        const card = document.createElement('article'), title = document.createElement('h3'), state = document.createElement('p'), detail = document.createElement('p');
        title.textContent = `${step.id} · ${step.request.name}`; badge(state, step.status);
        detail.textContent = `Pokušaji: ${step.attempts}/3. Zavisnosti: ${step.dependsOn.join(', ') || 'nema'}.${step.result ? ` Rezultat: ${step.result.output}.` : ''}${step.error ? ` ${step.error}` : ''}`;
        card.append(title, state, detail); steps.append(card);
      }
      updateControls();
      $('json').textContent = JSON.stringify(data, null, 2);
    } else invalidateDetail();
  } catch (error) {
    if (version !== viewVersion) { refreshAgain = true; return; }
    $('health').textContent = '🔴 Servis ili radnik nije dostupan — proverite poruku';
    invalidateDetail(); $('runs').textContent = 'Stanje zadataka trenutno nije potvrđeno. Osvežite posle oporavka servisa.'; lastList = '';
    refreshError = true; showError(error);
  } finally { refreshing = false; if (refreshAgain) { refreshAgain = false; void refresh(); } }
}
$('example').onclick = () => action(async () => { $('plan').value = JSON.stringify(await api('/api/example'), null, 2); });
$('create').onclick = () => action(async () => { const run = await api('/api/runs', 'POST', JSON.parse($('plan').value)); selected = run.id; viewVersion++; });
$('refresh').onclick = () => void refresh();
for (const button of $('controls').querySelectorAll('button')) button.onclick = () => {
  const id = visibleRun?.id;
  if (!id || id !== selected || actionBusy) return;
  return action(() => api(`/api/runs/${id}/${button.dataset.action}`, 'POST'));
};
void action(async () => { $('plan').value = JSON.stringify(await api('/api/example'), null, 2); });
setInterval(() => void refresh(), 1500);
