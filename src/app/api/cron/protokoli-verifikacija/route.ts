import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';
import { protokolManager } from '@/lib/protokoli/manager';

const INCIDENT_THRESHOLD = 0.5;

export async function GET(request: Request) {
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const results = await protokolManager.verifikujSveAktivne();
  const neuspesni = results.filter((result) => !result.uspesno);
  const failRatio = results.length === 0 ? 0 : neuspesni.length / results.length;

  let incidentUpdated = 0;
  if (failRatio > INCIDENT_THRESHOLD) {
    for (const result of neuspesni) {
      await protokolManager.updateStatus(result.protokolId, 'incident', {
        reqId: `cron-protokoli-verifikacija-${Date.now()}`,
        reason: 'cron-failure-ratio',
      });
      incidentUpdated++;
    }
  }

  return NextResponse.json({
    sistem: 'Cron Protokol Verifikacija',
    verzija: APP_VERSION,
    ukupno: results.length,
    neuspesni: neuspesni.length,
    failRatio,
    incidentUpdated,
    timestamp: new Date().toISOString(),
  });
}
