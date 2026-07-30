// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Order Detail API
// Kompanija SPAJA — Digitalna Industrija
//
// GET    /api/menjacnica/orders/[id]   — detalji ordrea
// DELETE /api/menjacnica/orders/[id]   — otkaži order

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';
import { roundLedger } from '@/lib/novcanik/ledger';
import type { Database } from '@/lib/supabase/types';

type RouteContext = { params: Promise<{ id: string }> };
type OrderRow = Database['public']['Tables']['exchange_orders']['Row'];

interface WalletMetadata {
  wallet?: {
    reservation?: {
      assetId?: string;
      amount?: number;
    };
  };
}

async function releaseReservation(
  userId: string,
  order: Pick<OrderRow, 'metadata'>,
) {
  const wallet = (order.metadata as WalletMetadata | null)?.wallet;
  const assetId = wallet?.reservation?.assetId?.toUpperCase();
  const amount = wallet?.reservation?.amount;

  if (!assetId || typeof amount !== 'number' || amount <= 0) return;

  const supabase = getSupabaseServerClient();
  const { data: account, error } = await supabase
    .from('novcanik_accounts')
    .select('id, available, reserved')
    .eq('user_id', userId)
    .eq('asset_id', assetId)
    .maybeSingle();

  if (error) throw error;
  if (!account) return;

  const { error: updateError } = await supabase
    .from('novcanik_accounts')
    .update({
      available: roundLedger(account.available + amount),
      reserved: roundLedger(Math.max(0, account.reserved - amount)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', account.id);

  if (updateError) throw updateError;
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    if (!isExchangeFlagEnabled('exchange-orders')) {
      return apiError('SERVICE_UNAVAILABLE', 'Orders modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const { id } = await context.params;
    const supabase = getSupabaseServerClient();

    const { data: order, error } = await supabase
      .from('exchange_orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) return apiInternalError('menjacnica-order-get', error);
    if (!order) return apiError('NOT_FOUND', `Order '${id}' nije pronađen.`);

    const { data: trades } = await supabase
      .from('exchange_trades')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false });

    return apiSuccess({ order, trades: trades ?? [] });
  } catch (error) {
    return apiInternalError('menjacnica-order-detail', error);
  }
}

// ─── DELETE — otkaži order ────────────────────────────────────────────────────

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    if (!isExchangeFlagEnabled('exchange-orders')) {
      return apiError('SERVICE_UNAVAILABLE', 'Orders modul je trenutno nedostupan.');
    }

    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) return apiError('UNAUTHORIZED', 'Niste prijavljeni.');

    const { id } = await context.params;
    const supabase = getSupabaseServerClient();

    const { data: order, error: fetchError } = await supabase
      .from('exchange_orders')
      .select('id, status, user_id, metadata')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) return apiInternalError('menjacnica-order-cancel-fetch', fetchError);
    if (!order) return apiError('NOT_FOUND', `Order '${id}' nije pronađen.`);

    const cancellableStatuses = ['pending', 'open', 'partially_filled'];
    if (!cancellableStatuses.includes(order.status)) {
      return apiError(
        'UNPROCESSABLE_ENTITY',
        `Order sa statusom '${order.status}' se ne može otkazati.`,
      );
    }

    await releaseReservation(user.id, order);

    const { data: updated, error: updateError } = await supabase
      .from('exchange_orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) return apiInternalError('menjacnica-order-cancel-update', updateError);

    return apiSuccess({ order: updated, otkazano: true });
  } catch (error) {
    return apiInternalError('menjacnica-order-cancel', error);
  }
}
