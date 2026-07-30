/**
 * 📦 Engine Registry — All Engines Barrel
 *
 * Importuje sve engine wrapper-e da bi ih registrovao u centralni registry.
 * Ovaj fajl je JEDINI koji se menja kada se dodaje novi engine:
 *  1. Kreirajte novi wrapper u src/lib/engines/
 *  2. Dodajte import ovde
 *  3. Novi engine se automatski pojavljuje u Glavnom Endžinu
 *
 * DO NOT import from glavni-endzin-digitalne-industrije.ts (circular dep)
 *
 * Autofinish #332+
 */

// ── AI & Analitika ────────────────────────────────────────────────────────────
import './engines/ai-iq-world-bank-engine';
import './engines/analiza-svega-engine';
import './engines/agregator-svega-engine';
import './engines/ai-trading-engine-wrapper';

// ── Digitalna Industrija ──────────────────────────────────────────────────────
import './engines/digitalna-industrija-rizici-engine';
import './engines/digitalna-industrija-finansije-engine';

// ── Signal & Procesiranje ─────────────────────────────────────────────────────
import './engines/laureatski-engine';
import './engines/modulacija-engine';

// ── SpajaPro Evolucija ────────────────────────────────────────────────────────
import './engines/spaja-pro-13-engine';
import './engines/spaja-pro-14-engine';
import './engines/spaja-pro-15-engine';
import './engines/spaja-pro-prompt-engine-wrapper';
import './engines/spaja-ultra-omega-engine';

// ── Omega & Evolucija ─────────────────────────────────────────────────────────
import './engines/omega-evolution-engine';

// ── Poslovni & Finansijski ────────────────────────────────────────────────────
import './engines/enterprise-engine';
import './engines/b2b-procurement-engine';
import './engines/licencni-engine';
import './engines/generator-racuna-engine';

// ── Gaming & Igrice ───────────────────────────────────────────────────────────
import './engines/gejming-industrija-engine';
import './engines/poker-engine';
import './engines/gaming-session-engine';

// ── Digitalni Prozori & Medija ────────────────────────────────────────────────
import './engines/digitalni-prozor-engine';
import './engines/digitalni-vorteks-engine';
import './engines/digitalna-eureka-engine';

// ── Identitet & Auth ──────────────────────────────────────────────────────────
import './engines/auth-engine';
import './engines/platform-auth-engine';
import './engines/platform-gateway-engine';

// ── Infrastruktura & Deploy ───────────────────────────────────────────────────
import './engines/deploy-diagnostics-engine';
import './engines/auto-repair-engine';
import './engines/blockchain-engine';
import './engines/supabase-engine';

// ── Analitika & Statistika ────────────────────────────────────────────────────
import './engines/statistika-engine';
import './engines/sve-od-svega-engine';
import './engines/potencijal-svega-engine';

// ── Napredni Moduli ───────────────────────────────────────────────────────────
import './engines/maksimus-engine';
import './engines/procesuiranje-engine';
import './engines/distribucija-engine';
import './engines/harmonizacija-engine';
import './engines/ekslatacija-engine';
import './engines/spaja-baza-knowledge-engine';

// Re-export registry API for convenience
export {
  getAllEngines,
  getEnginesByTip,
  getEnginesByStatus,
  getEngineById,
  getRegistryCount,
  getRegistryStatistika,
  toSpojeniEndzinFormat,
  registerEngine,
} from './engine-registry';
export type { EngineRegistryEntry, EngineRegistryStatus } from './engine-registry';
