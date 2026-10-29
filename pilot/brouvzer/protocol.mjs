import { DOCUMENT, MAX_STATE } from './model.mjs';
export const MAX_FRAME = 100000;
export const MAX_BUFFER = 256 * 1024;
export const LOW_BUFFER = 64 * 1024;
export function to64(bytes) { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s); }
export function from64(s) {
  if (typeof s !== 'string' || s.length > 90000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw Error('Neispravan sadržaj poruke.');
  const bytes = Uint8Array.from(atob(s), c => c.charCodeAt(0));
  if (bytes.length > MAX_STATE) throw Error('Prevelik sadržaj.'); return bytes;
}
export function validateSignal(value, type) {
  if (!value || value.v !== 1 || value.document !== DOCUMENT || value.type !== type || !/^[a-f0-9-]{36}$/.test(value.session) || typeof value.sdp !== 'string' || value.sdp.length > 50000) throw Error('Neispravan signal.');
  const media = value.sdp.split(/\r?\n/).filter(s => s.startsWith('m='));
  if (media.length !== 1 || !media[0].startsWith('m=application ') || !/a=fingerprint:sha-256 (?:[A-Fa-f0-9]{2}:){31}[A-Fa-f0-9]{2}(?:\r?\n|$)/.test(value.sdp)) throw Error('Očekuje se jedan DTLS DataChannel sa SHA-256 otiskom.');
  return { v: 1, document: DOCUMENT, session: value.session, type, sdp: value.sdp };
}
export async function pairingCode(offer, answer) {
  validateSignal(offer, 'offer'); validateSignal(answer, 'answer');
  if (offer.session !== answer.session) throw Error('Sesija se ne podudara.');
  const data = JSON.stringify([1, DOCUMENT, offer.session, offer.sdp, answer.sdp]);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data)));
  return [...hash].map(b => b.toString(16).padStart(2, '0')).join('');
}
/** Reliable ordered channel: application replay protection is per fresh DTLS session. */
export class SessionGate {
  constructor(session, role, code) { this.session = session; this.role = role; this.code = code; this.confirmed = false; this.revoked = false; this.sent = 0; this.received = 0; }
  confirm(peerCode) {
    if (this.revoked || typeof peerCode !== 'string' || peerCode.trim() !== this.code) throw Error('Otisci se ne podudaraju. Prekinite vezu.');
    this.confirmed = true;
  }
  revoke() { this.revoked = true; this.confirmed = false; }
  encode(type, payload = '') {
    if (!this.confirmed || this.revoked) throw Error('Identitet nije potvrđen.');
    return JSON.stringify({ v: 1, document: DOCUMENT, session: this.session, from: this.role, seq: ++this.sent, type, payload });
  }
  decode(raw) {
    if (!this.confirmed || this.revoked) throw Error('Sesija nije odobrena.');
    if (typeof raw !== 'string' || raw.length > MAX_FRAME) throw Error('Neispravna dužina poruke.');
    const f = JSON.parse(raw);
    if (f.v !== 1 || f.document !== DOCUMENT || f.session !== this.session || f.from !== (this.role === 'offer' ? 'answer' : 'offer') || !Number.isSafeInteger(f.seq) || f.seq !== this.received + 1 || !['ready', 'vector', 'update'].includes(f.type)) throw Error('Pogrešna sesija, učesnik ili ponovljena poruka.');
    if (f.type === 'ready') { if (f.payload !== '') throw Error('Neispravan ready.'); }
    else from64(f.payload);
    this.received = f.seq; return f;
  }
}
