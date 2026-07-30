/**
 * 🗄️ Supabase Engine — Engine Wrapper
 *
 * Wraps: src/lib/supabase/ (client.ts, server.ts, types.ts)
 */

import { registerEngine } from '../engine-registry';

registerEngine({
  id: 'engine-supabase',
  naziv: 'Supabase Database Engine',
  opis: 'Supabase backend engine — client/server konekcija, real-time subscriptions, Row Level Security, database types za celu platformu',
  ikona: '🗄️',
  tip: 'deploy',
  status: 'aktivan',
  verzija: '2.0.0',
  optimizacija: 100,
  izvor: 'Supabase modul (src/lib/supabase/)',
  izvoriFajlovi: [
    'src/lib/supabase/client.ts',
    'src/lib/supabase/server.ts',
    'src/lib/supabase/types.ts',
  ],
  registrovanDatum: '2025-01-15',
  tagovi: ['supabase', 'database', 'real-time', 'rls', 'backend'],
});
