import { EventEmitter } from 'node:events';

export type RealtimeEventType = 'wallet.updated' | 'trade.executed' | 'presence.changed' | 'sync.triggered';

export interface RealtimeEvent<T = Record<string, unknown>> {
  type: RealtimeEventType;
  sourcePlatform: string;
  targetPlatform?: string;
  payload: T;
  createdAt: string;
}

const bus = new EventEmitter();
bus.setMaxListeners(100);
const asyncListeners = new Map<RealtimeEventType | '*', Set<(event: RealtimeEvent) => void | Promise<void>>>();

export async function emitRealtimeEvent(event: RealtimeEvent): Promise<void> {
  bus.emit(event.type, event);
  bus.emit('*', event);

  const listeners = [
    ...(asyncListeners.get(event.type) ?? new Set()),
    ...(asyncListeners.get('*') ?? new Set()),
  ];
  if (listeners.length === 0) return;

  const results = await Promise.allSettled(listeners.map((listener) => Promise.resolve(listener(event))));
  const firstError = results.find((result) => result.status === 'rejected');
  if (firstError && firstError.status === 'rejected') {
    throw firstError.reason;
  }
}

export function onRealtimeEvent(type: RealtimeEventType | '*', listener: (event: RealtimeEvent) => void | Promise<void>): () => void {
  bus.on(type, listener);
  const typed = asyncListeners.get(type) ?? new Set<(event: RealtimeEvent) => void | Promise<void>>();
  typed.add(listener);
  asyncListeners.set(type, typed);

  return () => {
    bus.off(type, listener);
    const current = asyncListeners.get(type);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) asyncListeners.delete(type);
  };
}

export async function emitWithRetry(event: RealtimeEvent, retries = 3, delayMs = 100): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await emitRealtimeEvent(event);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Realtime emit retry exhausted');
}
