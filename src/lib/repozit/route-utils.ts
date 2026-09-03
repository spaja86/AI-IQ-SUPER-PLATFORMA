import type { NextResponse } from 'next/server';
import {
  REPOZIT_CONTRACT_VERSION,
  REPOZIT_DISPLAY_NAME,
  REPOZIT_MODULE_VERSION,
  REPOZIT_PERSONA_ID,
} from './types';

export function setRepozitHeaders(response: NextResponse): void {
  response.headers.set('X-Repozit-Contract-Version', REPOZIT_CONTRACT_VERSION);
  response.headers.set('X-Repozit-Module-Version', REPOZIT_MODULE_VERSION);
  response.headers.set('X-Repozit-Persona-Id', REPOZIT_PERSONA_ID);
  response.headers.set('X-Repozit-Display-Name', REPOZIT_DISPLAY_NAME);
}
