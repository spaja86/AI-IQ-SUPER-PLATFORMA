import { authenticatePilot } from '@/lib/spaja-ai/auth';
import { executePilot, PilotError, PilotLedger, readPilotConfig } from '@/lib/spaja-ai/pilot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  let ledger: PilotLedger | undefined;
  try {
    const config = readPilotConfig();
    const userId = await authenticatePilot(request.headers.get('authorization'));
    if (!config.allowedUsers.has(userId)) throw new PilotError(403, 'NOT_ALLOWED', 'Nalog nema pristup AI pilotu.');
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      throw new PilotError(415, 'CONTENT_TYPE', 'Potreban je JSON zahtev.');
    }
    // Bound bytes before parsing; Content-Length alone is not trusted.
    const reader = request.body?.getReader();
    if (!reader) throw new PilotError(400, 'INVALID_INPUT', 'Prazan zahtev.');
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        total += chunk.value.byteLength;
        if (total > 100000) {
          await reader.cancel();
          throw new PilotError(413, 'INPUT_TOO_LARGE', 'Zahtev je prevelik.');
        }
        chunks.push(chunk.value);
      }
    } finally { reader.releaseLock(); }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new PilotError(400, 'INVALID_JSON', 'Neispravan JSON format.'); }
    ledger = new PilotLedger(config.dbPath);
    return Response.json(await executePilot(config, ledger, userId, body, request.signal), { headers });
  } catch (error) {
    if (error instanceof PilotError) return Response.json({ error: error.message, code: error.code }, { status: error.status, headers });
    return Response.json({ error: 'AI pilot trenutno nije dostupan.', code: 'PILOT_UNAVAILABLE' }, { status: 503, headers });
  } finally { ledger?.close(); }
}
