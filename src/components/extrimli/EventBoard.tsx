// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { ExtrimliEvent } from '@/lib/extrimli';

interface EventBoardProps {
  events: ExtrimliEvent[];
  onRegister?: (eventId: string) => void;
}

const STATUS_BADGE: Record<string, string> = {
  upcoming:  'bg-blue-100 text-blue-800',
  ongoing:   'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-700',
};

export function EventBoard({ events, onRegister }: EventBoardProps) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No events found.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const spotsLeft = event.capacity - event.registrations.length;
        const date      = new Date(event.date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        });

        return (
          <div key={event.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-800">{event.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[event.status] ?? 'bg-gray-100'}`}>
                {event.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">📍 {event.location} · 🗓 {date}</p>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full — join waitlist'}</span>
              {event.prizePool > 0 && <span>🏆 €{event.prizePool.toLocaleString()}</span>}
            </div>
            {event.status === 'upcoming' && onRegister && (
              <button
                onClick={() => onRegister(event.id)}
                className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 transition"
              >
                {spotsLeft > 0 ? 'Register' : 'Join Waitlist'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
