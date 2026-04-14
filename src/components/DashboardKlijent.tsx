'use client';

// SpajaUltraOmegaCore -∞Ω+∞ — Dashboard Klijent
// Kompanija SPAJA — Digitalna Industrija
// Realni dashboard sa Supabase podacima

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface ProfileData {
  plan: string;
  chat_messages_used: number;
  chat_messages_limit: number;
  subscription_status: string | null;
  created_at: string;
}

interface UsageStat {
  action: string;
  total_tokens: number;
  total_cost: number;
  count: number;
}

export default function DashboardKlijent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  const loadData = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setEmail(session.user.email ?? '');

      // Dohvati profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan, chat_messages_used, chat_messages_limit, subscription_status, created_at')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as ProfileData);
      }

      // Dohvati usage statistiku za poslednji mesec
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const { data: usageData } = await supabase
        .from('usage_logs')
        .select('action, tokens_used, cost_eur')
        .eq('user_id', session.user.id)
        .gte('created_at', monthAgo.toISOString());

      if (usageData && usageData.length > 0) {
        const grouped: Record<string, UsageStat> = {};
        for (const log of usageData) {
          if (!grouped[log.action]) {
            grouped[log.action] = { action: log.action, total_tokens: 0, total_cost: 0, count: 0 };
          }
          grouped[log.action].total_tokens += log.tokens_used;
          grouped[log.action].total_cost += Number(log.cost_eur);
          grouped[log.action].count += 1;
        }
        setUsageStats(Object.values(grouped));
      }
    } catch {
      // Greska pri ucitavanju
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProfile(null);
  }

  async function handlePortal() {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Greska
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-pulse text-2xl text-gray-400">Ucitavanje...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">📊 Dashboard</h2>
          <p className="mb-8 text-gray-400">
            Prijavite se da biste videli svoj dashboard sa realnim podacima.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/pricing"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Prijavi se
            </a>
            <a
              href="/registracija"
              className="rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              Registruj se
            </a>
          </div>
        </div>
      </div>
    );
  }

  const planColors: Record<string, string> = {
    starter: 'text-gray-300',
    basic: 'text-blue-400',
    pro: 'text-purple-400',
    enterprise: 'text-yellow-400',
    unlimited: 'text-green-400',
  };

  const chatPercent = profile && profile.chat_messages_limit > 0
    ? Math.min(100, (profile.chat_messages_used / profile.chat_messages_limit) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">📊 Dashboard</h2>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500 hover:text-red-400"
          >
            Odjavi se
          </button>
        </div>

        {/* Kartice */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Plan</div>
            <div className={`text-2xl font-bold ${planColors[profile?.plan ?? 'starter'] ?? 'text-white'}`}>
              {(profile?.plan ?? 'starter').toUpperCase()}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Status pretplate</div>
            <div className={`text-2xl font-bold ${profile?.subscription_status === 'active' ? 'text-green-400' : 'text-gray-300'}`}>
              {profile?.subscription_status === 'active' ? 'Aktivna' : 'Neaktivna'}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Chat poruke</div>
            <div className="text-2xl font-bold text-white">
              {profile?.chat_messages_used ?? 0} / {profile?.chat_messages_limit ?? 10}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <div className="mb-1 text-sm text-gray-400">Clan od</div>
            <div className="text-lg font-bold text-white">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('sr-Latn') : '-'}
            </div>
          </div>
        </div>

        {/* Chat Usage Bar */}
        <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">SpajaPro AI Koriscenje</h3>
            <span className="text-sm text-gray-400">{Math.round(chatPercent)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-700">
            <div
              className={`h-full rounded-full transition-all ${
                chatPercent > 80 ? 'bg-red-500' : chatPercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${chatPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-400">
            <span>{profile?.chat_messages_used ?? 0} poruka iskorisceno</span>
            <span>{(profile?.chat_messages_limit ?? 10) - (profile?.chat_messages_used ?? 0)} preostalo</span>
          </div>
        </div>

        {/* Usage Stats */}
        {usageStats.length > 0 && (
          <div className="mb-8 rounded-2xl border border-gray-700/50 bg-gray-800/60 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">📈 Koriscenje (poslednjih 30 dana)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-gray-400">
                    <th className="pb-2">Akcija</th>
                    <th className="pb-2">Pozivi</th>
                    <th className="pb-2">Tokeni</th>
                    <th className="pb-2">Trosak</th>
                  </tr>
                </thead>
                <tbody>
                  {usageStats.map((stat) => (
                    <tr key={stat.action} className="border-b border-gray-800 text-gray-300">
                      <td className="py-2">{stat.action}</td>
                      <td className="py-2">{stat.count}</td>
                      <td className="py-2">{stat.total_tokens.toLocaleString()}</td>
                      <td className="py-2">{stat.total_cost.toFixed(4)} EUR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Akcije */}
        <div className="flex flex-wrap gap-4">
          <a
            href="/spaja-pro"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            🤖 SpajaPro AI Chat
          </a>
          {profile?.plan !== 'unlimited' && (
            <a
              href="/pricing"
              className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              ⬆️ Nadogradi plan
            </a>
          )}
          {profile?.subscription_status === 'active' && (
            <button
              onClick={handlePortal}
              className="rounded-lg border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white"
            >
              💳 Upravljaj pretplatom
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
