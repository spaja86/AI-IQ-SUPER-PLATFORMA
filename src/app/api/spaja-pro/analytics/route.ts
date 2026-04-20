// SpajaUltraOmegaCore -∞Ω+∞ — Analytics API
// GET /api/spaja-pro/analytics — statistika korišćenja za korisnika

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken, getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    // Dohvati profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, chat_messages_used, chat_messages_limit, created_at')
      .eq('id', user.id)
      .single();

    // Dohvati ukupne statistike iz usage_logs
    const { data: usageLogs } = await supabase
      .from('usage_logs')
      .select('tokens_used, cost_eur, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    // Dohvati broj threadova
    const { count: threadCount } = await supabase
      .from('chat_threads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Dohvati broj poruka
    const { count: messageCount } = await supabase
      .from('chat_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Kalkuliši statistike
    const logs = usageLogs ?? [];
    const totalTokens = logs.reduce((sum, l) => sum + (l.tokens_used ?? 0), 0);
    const totalCost = logs.reduce((sum, l) => sum + (l.cost_eur ?? 0), 0);

    // Dnevna potrošnja (poslednjih 7 dana)
    const dailyUsage: Record<string, { tokens: number; messages: number; cost: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyUsage[key] = { tokens: 0, messages: 0, cost: 0 };
    }

    for (const log of logs) {
      const day = log.created_at?.slice(0, 10);
      if (day && dailyUsage[day]) {
        dailyUsage[day].tokens += log.tokens_used ?? 0;
        dailyUsage[day].messages += 1;
        dailyUsage[day].cost += log.cost_eur ?? 0;
      }
    }

    return NextResponse.json({
      profile: {
        plan: profile?.plan ?? 'starter',
        messagesUsed: profile?.chat_messages_used ?? 0,
        messagesLimit: profile?.chat_messages_limit ?? 10,
        memberSince: profile?.created_at,
      },
      totals: {
        threads: threadCount ?? 0,
        messages: messageCount ?? 0,
        tokens: totalTokens,
        costEur: Math.round(totalCost * 100) / 100,
      },
      dailyUsage: Object.entries(dailyUsage).map(([date, data]) => ({
        date,
        ...data,
      })),
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Greska servera.' }, { status: 500 });
  }
}
