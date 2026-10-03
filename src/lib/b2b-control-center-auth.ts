import type { User } from '@supabase/supabase-js';
import { ΩClearanceLevel } from '@/lib/auth/types';

/** Minimum server-side authorization for read-only B2B Control Center data. */
export function canReadB2BControlCenter(user: User): boolean {
  const clearance = user.app_metadata?.clearanceLevel;
  return typeof clearance === 'number' && Number.isFinite(clearance) && Number.isInteger(clearance) && clearance >= ΩClearanceLevel.USER;
}
