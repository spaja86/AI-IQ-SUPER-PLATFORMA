export interface CronAuthResult {
  authorized: boolean;
  reason?: 'missing-secret' | 'missing-header' | 'invalid-secret';
}

const BEARER_PREFIX = 'Bearer ';

export function validateCronAuth(request: Request, secret = process.env.CRON_SECRET): CronAuthResult {
  if (!secret) {
    return { authorized: false, reason: 'missing-secret' };
  }

  const authHeader = request.headers.get('authorization');
  const headerSecret = request.headers.get('x-cron-secret');
  const bearer = authHeader?.startsWith(BEARER_PREFIX) ? authHeader.slice(BEARER_PREFIX.length) : null;
  const providedSecret = bearer ?? headerSecret;

  if (!providedSecret) {
    return { authorized: false, reason: 'missing-header' };
  }

  if (providedSecret !== secret) {
    return { authorized: false, reason: 'invalid-secret' };
  }

  return { authorized: true };
}
