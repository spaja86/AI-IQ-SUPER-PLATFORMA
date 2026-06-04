import { emitWithRetry, onRealtimeEvent, type RealtimeEvent } from './event-bus';

const subscribers = new Map<string, (event: RealtimeEvent) => void>();

export function subscribePlatform(platformId: string, handler: (event: RealtimeEvent) => void): () => void {
  subscribers.set(platformId, handler);
  const unsubscribe = onRealtimeEvent('*', (event) => {
    if (!event.targetPlatform || event.targetPlatform === platformId) {
      handler(event);
    }
  });

  return () => {
    unsubscribe();
    subscribers.delete(platformId);
  };
}

export async function broadcastToPlatforms(event: RealtimeEvent): Promise<void> {
  await emitWithRetry(event, 3, 150);
}

export function getBroadcasterStatus() {
  return {
    activeSubscribers: subscribers.size,
    platforms: Array.from(subscribers.keys()),
  };
}
