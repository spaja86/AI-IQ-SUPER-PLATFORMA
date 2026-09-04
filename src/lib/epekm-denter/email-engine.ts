// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Email Engine
// Kompanija SPAJA — Digitalna Industrija
//
// Core logic for composing, routing, and dispatching email messages.
// Supports plain text, JSON payloads, and agent-to-agent handoff messages.
// Idempotent send via messageId deduplication.

import type { EpekmMessage, EpekmSendInput, EpekmSendResult } from './types';
import { resolveAlias } from './routing-engine';
import { initDelivery, markSent, markDelivered, getDeliveryStatus } from './delivery-tracker';

// In-memory message store (keyed by messageId)
const _messageStore = new Map<string, EpekmMessage>();

/**
 * Generates a unique messageId.
 */
export function generateMessageId(fromAlias: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `msg-${fromAlias.toLowerCase().replace(/[^a-z0-9]/g, '')}-${ts}-${rand}`;
}

/**
 * Composes and dispatches an email message.
 * Idempotent: if a message with the same messageId already exists, returns existing result.
 * Throws if sender or recipient aliases cannot be resolved.
 */
export function sendMessage(input: EpekmSendInput): EpekmSendResult {
  if (!input.fromAlias || input.fromAlias.trim() === '') {
    throw new Error('fromAlias must not be empty');
  }
  if (!input.toAlias || input.toAlias.trim() === '') {
    throw new Error('toAlias must not be empty');
  }
  if (!input.payload || input.payload.trim() === '') {
    throw new Error('payload must not be empty');
  }
  if (!['plain-text', 'json', 'agent-handoff'].includes(input.payloadType)) {
    throw new Error(`Invalid payloadType: ${input.payloadType}`);
  }

  const fromAlias = input.fromAlias.toLowerCase().trim();
  const toAlias = input.toAlias.toLowerCase().trim();

  // Resolve canonical addresses (validates both aliases exist and are active)
  const fromAddress = resolveAlias(fromAlias);
  if (!fromAddress) {
    throw new Error(`Cannot resolve sender alias: ${fromAlias}`);
  }

  const toAddress = resolveAlias(toAlias);
  if (!toAddress) {
    throw new Error(`Cannot resolve recipient alias: ${toAlias}`);
  }

  // Use provided messageId or generate a new one
  const messageId = input.messageId?.trim()
    ? input.messageId.trim()
    : generateMessageId(fromAlias);

  // Idempotent: return actual delivery state if already processed
  const existing = _messageStore.get(messageId);
  if (existing) {
    const deliveryRecord = getDeliveryStatus(messageId);
    return {
      messageId: existing.messageId,
      status: deliveryRecord?.status ?? 'delivered',
      fromAlias: existing.fromAlias,
      toAlias: existing.toAlias,
      sentAt: existing.createdAt,
      retryCount: deliveryRecord?.retryCount ?? 0,
    };
  }

  const now = new Date().toISOString();
  const message: EpekmMessage = {
    messageId,
    fromAlias,
    toAlias,
    payloadType: input.payloadType,
    payload: input.payload,
    createdAt: now,
  };

  _messageStore.set(messageId, message);

  // Delivery tracking
  initDelivery(messageId);
  markSent(messageId);
  markDelivered(messageId);

  return {
    messageId,
    status: 'delivered',
    fromAlias,
    toAlias,
    sentAt: now,
    retryCount: 0,
  };
}

/**
 * Retrieves a message by its messageId.
 */
export function getMessageById(messageId: string): EpekmMessage | undefined {
  return _messageStore.get(messageId);
}

/**
 * Returns total number of messages.
 */
export function getMessageCount(): number {
  return _messageStore.size;
}

/** Clears the message store — for testing only */
export function _clearMessageStoreForTest(): void {
  _messageStore.clear();
}
