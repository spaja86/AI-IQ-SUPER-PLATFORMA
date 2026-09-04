// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: Delivery Tracker
// Kompanija SPAJA — Digitalna Industrija
//
// Tracks email delivery status with retry logic (exponential backoff, max 3 retries).
// Performance KPI: delivery acknowledgement ≤ 500ms.

import type { EpekmDeliveryRecord, EpekmDeliveryStatus } from './types';

export const EPEKM_MAX_RETRIES = 3;
export const EPEKM_DELIVERY_MAX_MS = 500;
export const EPEKM_RETRY_BASE_DELAY_MS = 100;

// In-memory delivery store
const _deliveryStore = new Map<string, EpekmDeliveryRecord>();

/**
 * Initializes a delivery record for a new message.
 */
export function initDelivery(messageId: string): EpekmDeliveryRecord {
  if (!messageId || messageId.trim() === '') {
    throw new Error('messageId must not be empty');
  }
  const now = new Date().toISOString();
  const record: EpekmDeliveryRecord = {
    messageId,
    status: 'queued',
    retryCount: 0,
    lastAttemptAt: now,
    deliveredAt: null,
    error: null,
  };
  _deliveryStore.set(messageId, record);
  return record;
}

/**
 * Marks a delivery as sent.
 */
export function markSent(messageId: string): EpekmDeliveryRecord {
  const record = _getOrThrow(messageId);
  record.status = 'sent';
  record.lastAttemptAt = new Date().toISOString();
  record.error = null;
  return record;
}

/**
 * Marks a delivery as delivered.
 */
export function markDelivered(messageId: string): EpekmDeliveryRecord {
  const record = _getOrThrow(messageId);
  const now = new Date().toISOString();
  record.status = 'delivered';
  record.deliveredAt = now;
  record.lastAttemptAt = now;
  record.error = null;
  return record;
}

/**
 * Marks a delivery attempt as failed and increments retry counter.
 * If max retries are exceeded, status becomes 'bounced'.
 */
export function markFailed(messageId: string, errorMessage: string): EpekmDeliveryRecord {
  const record = _getOrThrow(messageId);
  record.retryCount += 1;
  record.lastAttemptAt = new Date().toISOString();
  record.error = errorMessage;
  record.status = record.retryCount >= EPEKM_MAX_RETRIES ? 'bounced' : 'queued';
  return record;
}

/**
 * Archives a delivery record.
 */
export function archiveDelivery(messageId: string): EpekmDeliveryRecord {
  const record = _getOrThrow(messageId);
  record.status = 'archived';
  record.lastAttemptAt = new Date().toISOString();
  return record;
}

/**
 * Retrieves a delivery record by messageId.
 */
export function getDeliveryStatus(messageId: string): EpekmDeliveryRecord | undefined {
  return _deliveryStore.get(messageId);
}

/**
 * Returns the count of records with a specific status.
 */
export function countByStatus(status: EpekmDeliveryStatus): number {
  let count = 0;
  for (const record of _deliveryStore.values()) {
    if (record.status === status) count++;
  }
  return count;
}

/**
 * Returns total message count.
 */
export function getTotalMessageCount(): number {
  return _deliveryStore.size;
}

/**
 * Returns count of pending (queued + sent) deliveries.
 */
export function getPendingDeliveryCount(): number {
  return countByStatus('queued') + countByStatus('sent');
}

/**
 * Calculates exponential backoff delay for a given retry count.
 */
export function calcBackoffDelay(retryCount: number): number {
  return EPEKM_RETRY_BASE_DELAY_MS * Math.pow(2, retryCount);
}

function _getOrThrow(messageId: string): EpekmDeliveryRecord {
  const record = _deliveryStore.get(messageId);
  if (!record) throw new Error(`Delivery record not found: ${messageId}`);
  return record;
}

/** Clears the delivery store — for testing only */
export function _clearDeliveryStoreForTest(): void {
  _deliveryStore.clear();
}
