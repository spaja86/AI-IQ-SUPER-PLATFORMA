// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D: MAKSIM Denter Orchestrator
// Kompanija SPAJA — Digitalna Industrija
//
// Coordinates all EPEKM-D sub-modules: identity-registry → routing-engine
// → email-engine → delivery-tracker. Provides the main DenterRequest/Response API.

import type {
  DenterRequest,
  DenterResponse,
  EpekmHealthReport,
  EpekmRegistrationInput,
  EpekmRegistrationResult,
  EpekmSendInput,
  EpekmSendResult,
  EpekmDeliveryRecord,
} from './types';
import { registerIdentity, getIdentityCount, getActiveIdentityCount } from './identity-registry';
import { resolveAlias, getRouteEntry } from './routing-engine';
import { sendMessage } from './email-engine';
import { getDeliveryStatus, getTotalMessageCount, getPendingDeliveryCount } from './delivery-tracker';

export const EPEKM_CONTRACT_VERSION = 'v1';
export const EPEKM_MODULE_VERSION = '1.0.0';
export const EPEKM_PERSONA_ID = 'epekm-denter-core';
export const EPEKM_OCTAVE = 11;
export const EPEKM_HIPERMREZA_NODE = 88;
export const EPEKM_PERFORMANCE_MAX_MS = 50;
export const EPEKM_API_RESPONSE_MAX_MS = 200;
export const EPEKM_DELIVERY_ACK_MAX_MS = 500;
export const EPEKM_DEGRADED_PENDING_THRESHOLD = 1000;

/**
 * Main orchestrator entry point.
 * Accepts a DenterRequest and returns a DenterResponse.
 */
export async function executeDenterRequest<T = unknown>(
  request: DenterRequest,
): Promise<DenterResponse<T>> {
  const start = Date.now();

  try {
    let data: unknown = null;

    switch (request.action) {
      case 'register': {
        const input = request.payload as EpekmRegistrationInput;
        data = registerIdentity(input);
        break;
      }
      case 'resolve': {
        const { alias } = request.payload as { alias: string };
        const entry = getRouteEntry(alias);
        if (!entry) throw new Error(`Alias not found or not active: ${alias}`);
        data = entry;
        break;
      }
      case 'send': {
        const input = request.payload as EpekmSendInput;
        data = sendMessage(input);
        break;
      }
      case 'status': {
        const { messageId } = request.payload as { messageId: string };
        const record = getDeliveryStatus(messageId);
        if (!record) throw new Error(`Delivery record not found: ${messageId}`);
        data = record;
        break;
      }
      case 'health': {
        data = buildHealthReport();
        break;
      }
      default: {
        throw new Error(`Unknown action: ${String(request.action)}`);
      }
    }

    return {
      requestId: request.requestId,
      action: request.action,
      success: true,
      data: data as T,
      error: null,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      requestId: request.requestId,
      action: request.action,
      success: false,
      data: null,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Builds a health report from current module state.
 */
export function buildHealthReport(): EpekmHealthReport {
  const totalMessages = getTotalMessageCount();
  const pendingDeliveries = getPendingDeliveryCount();
  const registeredIdentities = getIdentityCount();
  const activeIdentities = getActiveIdentityCount();

  return {
    status: pendingDeliveries > EPEKM_DEGRADED_PENDING_THRESHOLD ? 'degraded' : 'ok',
    registeredIdentities,
    activeIdentities,
    totalMessages,
    pendingDeliveries,
    contractVersion: EPEKM_CONTRACT_VERSION,
    moduleVersion: EPEKM_MODULE_VERSION,
    persona: EPEKM_PERSONA_ID,
    octave: EPEKM_OCTAVE,
    hipermrezaNode: EPEKM_HIPERMREZA_NODE,
    timestamp: new Date().toISOString(),
  };
}

// Named convenience wrappers (used by API routes)

export function registerEmailIdentity(
  input: EpekmRegistrationInput,
): EpekmRegistrationResult {
  return registerIdentity(input);
}

export function resolveEmailAlias(alias: string): string | null {
  return resolveAlias(alias);
}

export function sendEmailMessage(input: EpekmSendInput): EpekmSendResult {
  return sendMessage(input);
}

export function getEmailDeliveryStatus(messageId: string): EpekmDeliveryRecord | undefined {
  return getDeliveryStatus(messageId);
}
