import { apiSuccess } from '@/lib/api/response';

type ExtrimliSurface = 'extrimli' | 'extrimli-3' | 'extrimli-cuz' | 'extrimli-extendol' | 'extrimli-koron' | 'extrimli-extrondend' | 'extrimli-extrondol';

interface HeaderOptions {
  surface: ExtrimliSurface;
  contractVersion: string;
  moduleVersion: string;
  degraded?: boolean;
  degradedSources?: string[];
}

export function setExtrimliSurfaceHeaders(res: Response, options: HeaderOptions): void {
  const degraded = options.degraded ?? false;
  const degradedSources = options.degradedSources ?? [];

  if (options.surface === 'extrimli') {
    res.headers.set('X-Extrimli-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli-Module-Version', options.moduleVersion);
  }
  if (options.surface === 'extrimli-3') {
    res.headers.set('X-Extrimli3-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli3-Module-Version', options.moduleVersion);
  }
  if (options.surface === 'extrimli-cuz') {
    res.headers.set('X-ExtrimliCuz-Contract-Version', options.contractVersion);
    res.headers.set('X-ExtrimliCuz-Module-Version', options.moduleVersion);
  }
  if (options.surface === 'extrimli-extendol') {
    res.headers.set('X-Extrimli-Extendol-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli-Extendol-Module-Version', options.moduleVersion);
  }
  if (options.surface === 'extrimli-koron') {
    res.headers.set('X-Extrimli-Koron-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli-Koron-Module-Version', options.moduleVersion);
  }

  if (options.surface === 'extrimli-extrondend') {
    res.headers.set('X-Extrimli-Extrondend-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli-Extrondend-Module-Version', options.moduleVersion);
  }
  if (options.surface === 'extrimli-extrondol') {
    res.headers.set('X-Extrimli-Extrondol-Contract-Version', options.contractVersion);
    res.headers.set('X-Extrimli-Extrondol-Module-Version', options.moduleVersion);
  }

  res.headers.set('X-Extrimli-Surface', options.surface);
  res.headers.set('X-Extrimli-Degraded', String(degraded));
  res.headers.set('X-Extrimli-Degraded-Mode', 'partial-payload-no-500');
  res.headers.set('X-Extrimli-Degraded-Sources-Count', String(degradedSources.length));
  if (degradedSources.length > 0) {
    res.headers.set('X-Extrimli-Degraded-Sources', degradedSources.join(','));
  }
}

export function apiExtrimliDegradedResponse(
  context: string,
  options: HeaderOptions & { error?: unknown },
): Response {
  console.error(`[API DEGRADED] ${context}:`, options.error);
  const response = apiSuccess(
    {
      degraded: true,
      degradedMode: 'partial-payload-no-500',
      surface: options.surface,
      source: context,
      warnings: ['fallback response returned instead of 500'],
    },
    200,
  );
  setExtrimliSurfaceHeaders(response, {
    ...options,
    degraded: true,
    degradedSources: options.degradedSources ?? [context],
  });
  return response;
}
