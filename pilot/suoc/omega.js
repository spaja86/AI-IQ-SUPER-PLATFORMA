/* Architecture browsing is read-only. Execution remains in the existing pilot.js. */
(() => {
  'use strict';
  const node = (id) => document.getElementById(id);
  const labels = {
    local: '● U KODU',
    partial: '◐ DELIMIČNO',
    planned: '○ PLAN',
  };
  const kindLabels = {
    control: 'kontrola',
    data: 'podaci',
    monitoring: 'praćenje',
  };
  const groups = {
    vision: 'vision',
    games: 'games',
    execution: 'execution-modules',
    domains: 'domains',
    foundation: 'foundation',
    operations: 'operations',
  };
  function element(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  async function load() {
    const response = await fetch('/api/omega', {
      headers: { 'X-SUOC-Pilot': '1' },
    });
    if (!response.ok)
      throw new Error('Registar modula nije dostupan. Osvežite stranicu.');
    const skeleton = await response.json();
    const modules = new Map(skeleton.modules.map((entry) => [entry.id, entry]));
    node('module-count').textContent = skeleton.modules.length;
    node('link-count').textContent = skeleton.links.length;
    node('local-count').textContent = skeleton.links.filter(
      (link) => link.state === 'local'
    ).length;
    function inspect(id) {
      const entry = modules.get(id);
      node('module-title').textContent = entry.title;
      node('module-scope').textContent = `${
        labels[entry.state]
      } · ${entry.items.join(' / ')}`;
      for (const button of document.querySelectorAll('[data-module]'))
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.module === id)
        );
      const connections = skeleton.links.filter(
        (link) => link.from === id || link.to === id
      );
      node('connections').replaceChildren(
        ...connections.map((link) =>
          element(
            'li',
            `${modules.get(link.from).short} → ${
              modules.get(link.to).short
            } / ${kindLabels[link.kind]} / ${
              link.state === 'local' ? 'lokalni pilot' : 'predlog'
            }`,
            link.state
          )
        )
      );
      if (!connections.length)
        node('connections').append(
          element('li', 'Za ovaj modul još nema opisane veze.')
        );
    }
    for (const entry of skeleton.modules) {
      const target = groups[entry.group];
      if (!target) continue; // SCP is the functional supervisor panel above the graph.
      const button = element('button', '', 'module');
      button.type = 'button';
      button.dataset.module = entry.id;
      button.dataset.group = entry.group;
      button.dataset.state = entry.state;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-controls', 'connections');
      const top = element('span', '', 'module-top');
      top.append(
        element('span', entry.short, 'module-code'),
        element('span', labels[entry.state], 'module-state')
      );
      const list = element('span', '', 'module-list');
      for (const item of entry.items)
        list.append(element('span', item, 'module-item'));
      button.append(top, element('span', entry.title, 'module-title'), list);
      button.addEventListener('click', () => inspect(entry.id));
      node(target).append(button);
    }
    for (const link of skeleton.links) {
      const row = element('tr', '');
      for (const value of [
        modules.get(link.from).title,
        modules.get(link.to).title,
        kindLabels[link.kind],
        link.state === 'local' ? 'Lokalni pilot' : 'Predlog',
      ])
        row.append(element('td', value));
      node('link-table').append(row);
    }
    inspect('scp');
  }
  void load().catch((error) => {
    node('catalog-error').textContent = error.message;
    node('catalog-error').hidden = false;
  });
})();
