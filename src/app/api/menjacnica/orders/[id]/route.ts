// SpajaUltraOmegaCore -∞Ω+∞ — Menjačnica Order Detail API
// Kompanija SPAJA — Digitalna Industrija
//
// GET    /api/menjacnica/orders/[id]   — detalji ordrea
// DELETE /api/menjacnica/orders/[id]   — otkaži order

import { type NextRequest } from 'next/server';
import { apiSuccess, apiError, apiInternalError } from '@/lib/api/response';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';
import { isExchangeFlagEnabled } from '@/lib/menjacnica/feature-flags';

type RouteContext = { params: Promise<{ id: string }> };

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

    // Dohvati i trade records ako postoje
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
      .select('id, status, user_id')
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

    const { data: updated, error: updateError } = await supabase
      .from('exchange_orders')
      .update({ status: 'cancelled' })
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
