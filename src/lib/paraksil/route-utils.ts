import {
  PARAKSIL_CONTRACT_VERSION,
  PARAKSIL_MODULE_VERSION,
} from './types';

export function setParaksilHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set('X-Paraksil-Contract-Version', PARAKSIL_CONTRACT_VERSION);
  headers.set('X-Paraksil-Module-Version', PARAKSIL_MODULE_VERSION);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
