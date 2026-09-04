// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

import type { ExtrimliEvent, EventRegistrationResult, EventStatus } from './types';

const EVENT_STORE: Map<string, ExtrimliEvent> = new Map();

function generateId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function resolveStatus(event: ExtrimliEvent): EventStatus {
  const now = Date.now();
  if (event.status === 'cancelled') return 'cancelled';
  if (now > event.date + 86_400_000) return 'completed';
  if (now >= event.date) return 'ongoing';
  return 'upcoming';
}

function validateEvent(event: Omit<ExtrimliEvent, 'id' | 'registrations' | 'waitlist' | 'status'>): string | null {
  if (!event.name || typeof event.name !== 'string') return 'name is required';
  if (!event.location || typeof event.location !== 'string') return 'location is required';
  if (!event.sportId || typeof event.sportId !== 'string') return 'sportId is required';
  if (typeof event.date !== 'number' || !Number.isFinite(event.date) || event.date < 0) return 'date must be a valid unix timestamp';
  if (typeof event.capacity !== 'number' || event.capacity < 1) return 'capacity must be >= 1';
  if (typeof event.prizePool !== 'number' || event.prizePool < 0) return 'prizePool must be >= 0';
  if (typeof event.minExperienceLevel !== 'number' || event.minExperienceLevel < 0 || event.minExperienceLevel > 10) return 'minExperienceLevel must be in [0, 10]';
  if (typeof event.minAge !== 'number' || event.minAge < 0) return 'minAge must be >= 0';
  return null;
}

export function createEvent(
  data: Omit<ExtrimliEvent, 'id' | 'registrations' | 'waitlist' | 'status'>
): ExtrimliEvent {
  const err = validateEvent(data);
  if (err) throw new Error(err);

  const event: ExtrimliEvent = {
    ...data,
    id: generateId(),
    registrations: [],
    waitlist: [],
    status: 'upcoming',
  };

  EVENT_STORE.set(event.id, event);
  return { ...event };
}

export function getEvent(id: string): ExtrimliEvent | undefined {
  const event = EVENT_STORE.get(id);
  if (!event) return undefined;
  return { ...event, status: resolveStatus(event) };
}

export function listEvents(filter?: { sportId?: string; status?: EventStatus }): ExtrimliEvent[] {
  return Array.from(EVENT_STORE.values())
    .map((e) => ({ ...e, status: resolveStatus(e) }))
    .filter((e) => {
      if (filter?.sportId && e.sportId !== filter.sportId) return false;
      if (filter?.status  && e.status  !== filter.status)  return false;
      return true;
    });
}

export interface RegistrationInput {
  eventId: string;
  athleteId: string;
  athleteExperienceLevel: number;
  athleteAge: number;
  ownedGearCategories: string[];
}

export function registerForEvent(input: RegistrationInput): EventRegistrationResult {
  const event = EVENT_STORE.get(input.eventId);

  if (!event) {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: false, message: 'event not found' };
  }

  const status = resolveStatus(event);
  if (status !== 'upcoming') {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: false, message: `event is ${status}` };
  }

  if (event.registrations.includes(input.athleteId)) {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: true, waitlisted: false, message: 'already registered' };
  }

  if (input.athleteExperienceLevel < event.minExperienceLevel) {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: false, message: `experience level ${input.athleteExperienceLevel} below minimum ${event.minExperienceLevel}` };
  }

  if (input.athleteAge < event.minAge) {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: false, message: `age ${input.athleteAge} below minimum ${event.minAge}` };
  }

  const missingGear = event.requiredGearCategories.filter((cat) => !input.ownedGearCategories.includes(cat));
  if (missingGear.length > 0) {
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: false, message: `missing required gear: ${missingGear.join(', ')}` };
  }

  if (event.registrations.length >= event.capacity) {
    event.waitlist.push(input.athleteId);
    EVENT_STORE.set(event.id, event);
    return { eventId: input.eventId, athleteId: input.athleteId, registered: false, waitlisted: true, message: 'event full — added to waitlist' };
  }

  event.registrations.push(input.athleteId);
  EVENT_STORE.set(event.id, event);
  return { eventId: input.eventId, athleteId: input.athleteId, registered: true, waitlisted: false, message: 'registered successfully' };
}

export function cancelEvent(id: string): void {
  const event = EVENT_STORE.get(id);
  if (!event) throw new Error(`event not found: ${id}`);
  EVENT_STORE.set(id, { ...event, status: 'cancelled' });
}

export function _resetEventStore(): void {
  EVENT_STORE.clear();
}
