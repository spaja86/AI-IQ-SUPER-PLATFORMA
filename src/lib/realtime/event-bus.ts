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

export function emitRealtimeEvent(event: RealtimeEvent): void {
  bus.emit(event.type, event);
  bus.emit('*', event);
}

export function onRealtimeEvent(type: RealtimeEventType | '*', listener: (event: RealtimeEvent) => void): () => void {
  bus.on(type, listener);
  return () => bus.off(type, listener);
}

export async function emitWithRetry(event: RealtimeEvent, retries = 3, delayMs = 100): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      emitRealtimeEvent(event);
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
