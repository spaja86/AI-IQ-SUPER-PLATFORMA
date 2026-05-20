export interface CronAuthResult {
  authorized: boolean;
  reason?: 'missing-secret' | 'missing-header' | 'invalid-secret';
}

export function validateCronAuth(request: Request, secret = process.env.CRON_SECRET): CronAuthResult {
  if (!secret) {
    return { authorized: true, reason: 'missing-secret' };
  }

  const authHeader = request.headers.get('authorization');
  const headerSecret = request.headers.get('x-cron-secret');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
  const providedSecret = bearer ?? headerSecret;

  if (!providedSecret) {
    return { authorized: false, reason: 'missing-header' };
  }

  if (providedSecret !== secret) {
    return { authorized: false, reason: 'invalid-secret' };
  }

  return { authorized: true };
}
