import type { NextResponse } from 'next/server';
import {
  BASE_CONTRACT_VERSION,
  BASE_DISPLAY_NAME,
  BASE_MODULE_VERSION,
  BASE_PERSONA_ID,
} from './types';

export function setBaseHeaders(response: NextResponse): void {
  response.headers.set('X-Base-Contract-Version', BASE_CONTRACT_VERSION);
  response.headers.set('X-Base-Module-Version', BASE_MODULE_VERSION);
  response.headers.set('X-Base-Persona-Id', BASE_PERSONA_ID);
  response.headers.set('X-Base-Display-Name', BASE_DISPLAY_NAME);
}
