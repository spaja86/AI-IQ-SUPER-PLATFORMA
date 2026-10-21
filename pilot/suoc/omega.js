/* Read-only architecture explorer. Execution remains exclusively in pilot.js. */
(() => {
  'use strict';
  const node = (id) => document.getElementById(id);
  const labels = {
    local: '● U KODU',
    partial: '◐ DELIMIČNO',
    planned: '○ PLAN',
  };
  const states = {
    implemented: '● Implementirano lokalno',
    partial: '◐ Delimično',
    planned: '○ Planirano · predlog',
  };
  const kinds = { control: 'kontrola', data: 'podaci', monitoring: 'praćenje' };
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
    const catalog = await response.json();
    if (
      catalog.version !== 'omega-relationships-v2' ||
      !Array.isArray(catalog.modules) ||
      !Array.isArray(catalog.links)
    )
      throw new Error(
        'Nepodržana verzija kataloga. Osvežite servis i stranicu.'
      );
    const modules = new Map(catalog.modules.map((entry) => [entry.id, entry]));
    if (
      !modules.has('scp') ||
      catalog.links.some(
        (link) =>
          !modules.has(link.from) ||
          !modules.has(link.to) ||
          !Object.hasOwn(states, link.state) ||
          !Object.hasOwn(kinds, link.kind)
      )
    )
      throw new Error('Neispravne reference ili statusi kataloga.');
    const { links } = catalog;
    let selectedModule = 'scp',
      selectedRelation;
    node('module-count').textContent = modules.size;
    node('link-count').textContent = links.length;
    node('local-count').textContent = links.filter(
      (link) => link.state === 'implemented'
    ).length;
    node('partial-count').textContent = links.filter(
      (link) => link.state === 'partial'
    ).length;
    node('planned-count').textContent = links.filter(
      (link) => link.state === 'planned'
    ).length;
    node('target-count').textContent = catalog.referenceConnectionTarget;
    node('catalog-progress').textContent = `${
      links.length
    } opisanih odnosa / cilj ${
      catalog.referenceConnectionTarget
    }. Još ${Math.max(
      0,
      catalog.referenceConnectionTarget - links.length
    )} odnosa treba razraditi. Broj odnosa nije broj aktivnih integracija.`;

    function detail(link, focus = false) {
      selectedRelation = link?.id;
      node('relation-detail').hidden = !link;
      for (const button of document.querySelectorAll('[data-relation]'))
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.relation === selectedRelation)
        );
      if (!link) return;
      node('relation-title').textContent = `${modules.get(link.from).short} → ${
        modules.get(link.to).short
      } / ${kinds[link.kind]}`;
      node('relation-state').textContent = `${states[link.state]} · ${link.id}`;
      node('relation-detail').dataset.state = link.state;
      node('relation-purpose').textContent = link.purpose;
      node('relation-contract').replaceChildren();
      for (const [key, label] of [
        ['trigger', 'Okidač'],
        ['payload', 'Podaci / ulaz'],
        ['result', 'Očekivani izlaz'],
        ['failure', 'Ponašanje pri grešci'],
      ])
        node('relation-contract').append(
          element('dt', label),
          element('dd', link.contract[key])
        );
      node('evidence-scope').textContent = link.evidence.scope;
      node('relation-evidence').replaceChildren(
        ...[
          ...link.evidence.code.map((path) => `Kod: ${path}`),
          ...link.evidence.tests.map((path) => `Regresioni test: ${path}`),
        ].map((text) => element('li', text))
      );
      if (!link.evidence.code.length)
        node('relation-evidence').append(
          element(
            'li',
            'Nema potvrđenog adaptera ni integracionog testa za ovaj odnos.'
          )
        );
      node('activation-missing').replaceChildren(
        ...(link.activation.missing.length
          ? link.activation.missing
          : [
              'Nema nedostajućih delova unutar navedenog lokalnog obima. Pokrenut servis i provera dostupnosti potrebni su za rad.',
            ]
        ).map((text) => element('li', text))
      );
      node('activation-acceptance').textContent = link.activation.acceptance;
      if (focus) node('relation-title').focus();
    }
    function relationButton(link) {
      const button = element('button', '', `relation-button ${link.state}`);
      button.type = 'button';
      button.dataset.relation = link.id;
      button.setAttribute('aria-controls', 'relation-detail');
      button.append(
        element(
          'strong',
          `${modules.get(link.from).short} → ${modules.get(link.to).short}`
        ),
        element('span', `${kinds[link.kind]} / ${states[link.state]}`),
        element('span', link.purpose)
      );
      button.addEventListener('click', () => detail(link, true));
      return button;
    }
    function render() {
      const moduleFilter = node('module-filter').value;
      const state = node('state-filter').value,
        kind = node('kind-filter').value;
      const query = node('relation-search')
        .value.trim()
        .toLocaleLowerCase('sr');
      const visible = links.filter(
        (link) =>
          (moduleFilter === 'all' ||
            link.from === moduleFilter ||
            link.to === moduleFilter) &&
          (state === 'all' || link.state === state) &&
          (kind === 'all' || link.kind === kind) &&
          [
            link.id,
            link.purpose,
            link.contract.payload,
            modules.get(link.from).title,
            modules.get(link.to).title,
            modules.get(link.from).short,
            modules.get(link.to).short,
          ]
            .join(' ')
            .toLocaleLowerCase('sr')
            .includes(query)
      );
      const entry = modules.get(selectedModule);
      node('module-title').textContent = entry.title;
      node('focus-title').textContent = entry.title;
      node('module-scope').textContent = `${
        labels[entry.state]
      } · ${entry.items.join(' / ')}`;
      node(
        'filter-count'
      ).textContent = `${visible.length} / ${links.length} odnosa odgovara filterima.`;
      const connections = visible.filter(
        (link) => link.from === selectedModule || link.to === selectedModule
      );
      for (const button of document.querySelectorAll('[data-module]')) {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.module === selectedModule)
        );
        button.dataset.connected = String(
          connections.some(
            (link) =>
              link.from === button.dataset.module ||
              link.to === button.dataset.module
          )
        );
      }
      for (const [id, direction] of [
        ['incoming-links', 'to'],
        ['outgoing-links', 'from'],
      ]) {
        const subset = connections.filter(
          (link) => link[direction] === selectedModule
        );
        node(id).replaceChildren(...subset.map(relationButton));
        if (!subset.length)
          node(id).append(
            element('p', 'Nema veza za ove filtere.', 'scope-note')
          );
      }
      node('connections').replaceChildren(
        ...connections.map((link) =>
          element(
            'li',
            `${modules.get(link.from).short} → ${
              modules.get(link.to).short
            } / ${kinds[link.kind]} / ${states[link.state]}`,
            link.state
          )
        )
      );
      if (!connections.length)
        node('connections').append(element('li', 'Nema veza za ove filtere.'));
      node('link-table').replaceChildren(
        ...visible.map((link) => {
          const row = element('tr', '');
          const cell = element('td', '');
          cell.append(relationButton(link));
          row.append(cell);
          for (const value of [
            modules.get(link.from).title,
            modules.get(link.to).title,
            kinds[link.kind],
            states[link.state],
          ])
            row.append(element('td', value));
          return row;
        })
      );
      if (!visible.length) {
        const row = element('tr', '');
        const cell = element('td', 'Nema odnosa za izabrane filtere.');
        cell.colSpan = 5;
        row.append(cell);
        node('link-table').append(row);
      }
      detail(
        visible.find((link) => link.id === selectedRelation) ||
          connections[0] ||
          visible[0]
      );
    }
    function inspect(id) {
      selectedModule = id;
      node('module-filter').value = id;
      selectedRelation = undefined;
      render();
    }
    for (const entry of catalog.modules) {
      const option = element('option', entry.title);
      option.value = entry.id;
      node('module-filter').append(option);
      const target = groups[entry.group];
      if (!target) continue;
      const button = element('button', '', 'module');
      button.type = 'button';
      button.dataset.module = entry.id;
      button.dataset.group = entry.group;
      button.dataset.state = entry.state;
      button.setAttribute('aria-controls', 'connections');
      const top = element('span', '', 'module-top');
      top.append(
        element('span', entry.short, 'module-code'),
        element('span', labels[entry.state], 'module-state')
      );
      const list = element('span', '', 'module-list');
      for (const item of entry.items)
        list.append(element('span', item, 'module-item'));
      button.append(
        top,
        element('span', entry.title, 'module-title'),
        list,
        element(
          'span',
          `${links.filter((link) => link.to === entry.id).length} ulaznih / ${
            links.filter((link) => link.from === entry.id).length
          } izlaznih`,
          'module-degree'
        )
      );
      button.addEventListener('click', () => inspect(entry.id));
      node(target).append(button);
    }
    node('module-filter').addEventListener('change', () => {
      selectedModule =
        node('module-filter').value === 'all'
          ? 'scp'
          : node('module-filter').value;
      selectedRelation = undefined;
      render();
    });
    for (const id of ['state-filter', 'kind-filter'])
      node(id).addEventListener('change', render);
    node('relation-search').addEventListener('input', render);
    node('inspect-scp').addEventListener('click', () => inspect('scp'));
    node('reset-filters').addEventListener('click', () => {
      for (const id of ['module-filter', 'state-filter', 'kind-filter'])
        node(id).value = 'all';
      node('relation-search').value = '';
      selectedModule = 'scp';
      selectedRelation = undefined;
      render();
    });
    render();
  }
  void load().catch((error) => {
    node('catalog-error').textContent = error.message;
    node('catalog-error').hidden = false;
  });
})();
