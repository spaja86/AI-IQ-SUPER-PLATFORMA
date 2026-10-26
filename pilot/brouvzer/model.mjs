import * as Y from 'yjs';
export const MAX_STATE = 65536;
export const MAX_ITEMS = 100;
export const DOCUMENT = 'spaja-probni-bookmarkovi-v1';
export function validateBookmark(value) {
  if (!value || Object.keys(value).sort().join(',') !== 'title,url' || typeof value.title !== 'string' || value.title.length > 120 || typeof value.url !== 'string' || value.url.length > 2048) throw Error('Neispravan bookmark.');
  const u = new URL(value.url);
  if (u.protocol !== 'https:' || u.username || u.password) throw Error('Dozvoljen je samo HTTPS URL bez pristupnih podataka.');
}
function inspect(doc) {
  const roots = [...doc.share.keys()].sort();
  if (roots.some(k => !['bookmarks', 'deleted'].includes(k))) throw Error('Nepoznat deo dokumenta.');
  const map = doc.getMap('bookmarks'), deleted = doc.getMap('deleted');
  if (map.size > MAX_ITEMS || deleted.size > MAX_ITEMS) throw Error('Limit je 100 probnih zapisa; reset zahteva brisanje probne baze.');
  for (const [id, v] of map) { checkId(id); validateBookmark(v); }
  for (const [id, v] of deleted) { checkId(id); if (v !== true) throw Error('Neispravno brisanje.'); }
  if (Y.encodeStateAsUpdate(doc).byteLength > MAX_STATE) throw Error('Dokument prelazi 64 KiB.');
}
function checkId(id) { if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,64}$/.test(id)) throw Error('Neispravan ID.'); }
export class BookmarkModel {
  constructor({ storage = null, incognito = false } = {}) {
    this.doc = new Y.Doc(); this.incognito = incognito; this.storage = incognito ? null : storage;
    this.tail = Promise.resolve(); this.listeners = new Set();
  }
  async init() {
    const bytes = await this.storage?.load();
    if (bytes) await this.apply(bytes, 'restore');
    return this;
  }
  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  snapshot() { return Y.encodeStateAsUpdate(this.doc); }
  vector() { return Y.encodeStateVector(this.doc); }
  diff(vector) { if (vector.byteLength > MAX_STATE) throw Error('Prevelik vektor.'); return Y.encodeStateAsUpdate(this.doc, vector); }
  rows() { return [...this.doc.getMap('bookmarks')].filter(([id]) => !this.doc.getMap('deleted').has(id)).sort(([a], [b]) => a.localeCompare(b)).map(([id, value]) => ({ id, ...value })); }
  enqueue(fn) { const op = this.tail.then(fn); this.tail = op.catch(() => {}); return op; }
  async commit(stage, origin) {
    try {
      inspect(stage);
      const bytes = Y.encodeStateAsUpdate(stage);
      if (origin !== 'restore') await this.storage?.save(bytes);
      Y.applyUpdate(this.doc, bytes, origin);
      for (const fn of this.listeners) fn(origin);
    } finally { stage.destroy(); }
  }
  apply(bytes, origin = 'remote') {
    if (!(bytes instanceof Uint8Array) || bytes.length > MAX_STATE) return Promise.reject(Error('Prevelika ili neispravna izmena.'));
    return this.enqueue(async () => {
      const stage = new Y.Doc();
      try { Y.applyUpdate(stage, this.snapshot()); Y.applyUpdate(stage, bytes); }
      catch (e) { stage.destroy(); throw e; }
      await this.commit(stage, origin);
    });
  }
  put(id, value) {
    checkId(id); validateBookmark(value);
    return this.enqueue(async () => {
      if (this.doc.getMap('deleted').has(id)) throw Error('Obrisani ID se ne koristi ponovo.');
      const stage = new Y.Doc(); Y.applyUpdate(stage, this.snapshot());
      stage.getMap('bookmarks').set(id, { url: value.url, title: value.title });
      await this.commit(stage, 'local');
    });
  }
  remove(id) {
    checkId(id);
    return this.enqueue(async () => {
      const stage = new Y.Doc(); Y.applyUpdate(stage, this.snapshot());
      stage.getMap('deleted').set(id, true); await this.commit(stage, 'local');
    });
  }
}
export function indexedStorage(indexedDB, name = 'spaja-brouvzer-probni-sync-v1') {
  let opening;
  const open = () => opening ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(name, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('state');
    req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
    req.onblocked = () => reject(Error('Probna baza je blokirana.'));
  });
  return {
    async load() {
      const db = await open(); return new Promise((resolve, reject) => {
        const tx = db.transaction('state', 'readonly'), req = tx.objectStore('state').get(DOCUMENT);
        let value; req.onsuccess = () => { value = req.result; };
        tx.oncomplete = () => resolve(value ? new Uint8Array(value) : null);
        tx.onerror = tx.onabort = () => reject(tx.error || Error('Čitanje nije uspelo.'));
      });
    },
    async save(bytes) {
      const db = await open(); return new Promise((resolve, reject) => {
        const tx = db.transaction('state', 'readwrite');
        tx.objectStore('state').put(bytes.slice().buffer, DOCUMENT);
        tx.oncomplete = () => resolve(); tx.onerror = tx.onabort = () => reject(tx.error || Error('Upis nije potvrđen.'));
      });
    },
  };
}
