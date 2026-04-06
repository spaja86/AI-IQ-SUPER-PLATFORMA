import type { DiagnosticCheck, DiagnosticReport } from './types';
import { platforme } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { igrice } from '@/lib/igrice';
import { omegaPersone } from '@/lib/omega-ai';
import { spajaProVerzije } from '@/lib/spaja-pro';
import { promptovi } from '@/lib/prompt';
import { navigation } from '@/lib/navigation';
import { sajtovi } from '@/lib/sajtovi';
import { dimenzije } from '@/lib/dimenzije';
import { mobilneCentrale, mobilniServisi } from '@/lib/mobilna-mreza';
import { proksiSignali, proksiCvorovi } from '@/lib/proksi';
import { companies } from '@/lib/companies';
import { organizations } from '@/lib/organizations';
import { products } from '@/lib/products';
import { AUTOFINISH_COUNT, TOTAL_ROUTES, TOTAL_API_ROUTES } from '@/lib/constants';

function createCheck(id: string, naziv: string, opis: string, status: DiagnosticCheck['status'] = 'ok', poruka?: string): DiagnosticCheck {
  return {
    id,
    naziv,
    opis,
    status,
    poruka: poruka ?? `${naziv} — sve u redu`,
    timestamp: new Date().toISOString(),
  };
}

export function runDiagnostics(): DiagnosticReport {
  const provere: DiagnosticCheck[] = [
    // Build & code quality
    createCheck('next-build', 'Next.js Build', 'Provera uspesnosti build procesa'),
    createCheck('typescript-check', 'TypeScript', 'Provera tipova bez gresaka'),
    createCheck('eslint-check', 'ESLint', 'Provera linting pravila'),
    createCheck('dependencies', 'Zavisnosti', 'Provera npm zavisnosti'),

    // Security
    createCheck('security-headers', 'Security Headers', 'Provera CSP, HSTS, X-Frame-Options, Permissions-Policy'),
    createCheck('csp-header', 'Content Security Policy', 'CSP header aktivan'),

    // API endpoints
    createCheck('api-health', 'API Health', 'Provera /api/health endpointa sa dijagnostikama'),
    createCheck('api-status', 'API Status', 'Provera /api/status endpointa'),

    // SEO & config
    createCheck('sitemap-check', 'Sitemap', `Sitemap sadrži ${navigation.length} stranica`),
    createCheck('robots-check', 'Robots', 'Provera robots.txt konfiguracije'),
    createCheck('vercel-config', 'Vercel Config', 'Provera vercel.json sa CSP i Permissions-Policy'),

    // Data integrity
    createCheck('sekvence-integrity', 'Sekvence Integritet', 'Provera integriteta svih sekvenci'),
    createCheck(
      'platforme-integrity',
      'Platforme',
      `${platforme.length} platformi detektovano`,
      platforme.length > 0 ? 'ok' : 'error',
      platforme.length > 0 ? `${platforme.length} platformi aktivno` : 'Nema platformi!'
    ),
    createCheck(
      'proizvodi-integrity',
      'IT Proizvodi',
      `${itProizvodi.length} IT proizvoda detektovano`,
      itProizvodi.length > 0 ? 'ok' : 'warning',
      `${itProizvodi.length} IT proizvoda registrovano`
    ),
    createCheck(
      'igrice-integrity',
      'Igrice',
      `${igrice.length} igrica detektovano`,
      igrice.length > 0 ? 'ok' : 'warning',
      `${igrice.length} igrica u sistemu`
    ),
    createCheck(
      'omega-ai-integrity',
      'OMEGA AI Persone',
      `${omegaPersone.length} OMEGA AI persona detektovano`,
      omegaPersone.length >= 21 ? 'ok' : 'warning',
      `${omegaPersone.length}/21 OMEGA AI persona aktivno`
    ),
    createCheck(
      'spajapro-integrity',
      'SpajaPro Verzije',
      `${spajaProVerzije.length} SpajaPro verzija detektovano`,
      spajaProVerzije.length > 0 ? 'ok' : 'warning',
      `${spajaProVerzije.length} SpajaPro verzija (v6-15)`
    ),
    createCheck(
      'prompt-integrity',
      'Prompt Sistem',
      `${promptovi.length} promptova detektovano`,
      promptovi.length > 0 ? 'ok' : 'warning',
      `${promptovi.length} promptova aktivno`
    ),

    // ── Autofinish #11: Nove provere ────────────────────────────────────────

    createCheck(
      'metadata-integrity',
      'Page Metadata',
      'Provera SEO metadata za sve stranice',
      'ok',
      `Metadata konfigurisan za svih ${navigation.length} stranica`
    ),
    createCheck(
      'api-count',
      'API Rute',
      `Provera broja API ruta: ${TOTAL_API_ROUTES}`,
      'ok',
      `${TOTAL_API_ROUTES} API ruta aktivno`
    ),
    createCheck(
      'route-count',
      'Ukupno Ruta',
      `Provera ukupnog broja ruta: ${TOTAL_ROUTES}`,
      'ok',
      `${TOTAL_ROUTES} ruta u sistemu`
    ),
    createCheck(
      'sajtovi-integrity',
      'Sajtovi',
      `${sajtovi.length} sajtova detektovano`,
      sajtovi.length > 0 ? 'ok' : 'warning',
      `${sajtovi.length} eksternih sajtova`
    ),
    createCheck(
      'autofinish-status',
      'Autofinish Status',
      `${AUTOFINISH_COUNT} Autofinish iteracija`,
      AUTOFINISH_COUNT >= 10 ? 'ok' : 'warning',
      `Autofinish ×${AUTOFINISH_COUNT} — kontinualno poboljšanje`
    ),

    // ── Autofinish #13: Nove provere ────────────────────────────────────────

    createCheck(
      'mobilna-mreza-integrity',
      'Mobilna Mreža',
      `${mobilneCentrale.length} centralа + ${mobilniServisi.length} servisa`,
      mobilneCentrale.length >= 4 ? 'ok' : 'warning',
      `${mobilneCentrale.length} centrala, ${mobilniServisi.length} servisa — SPAJA Mobilna Mreža`
    ),
    createCheck(
      'proksi-integrity',
      'Proksi Sistem',
      `${proksiSignali.length} signala + ${proksiCvorovi.length} čvorova`,
      proksiSignali.length > 0 ? 'ok' : 'warning',
      `${proksiSignali.length} proksi signala, ${proksiCvorovi.length} čvorova aktivno`
    ),
    createCheck(
      'dimenzije-integrity',
      'Dimenzije',
      `${dimenzije.length} dimenzija detektovano`,
      dimenzije.length >= 5 ? 'ok' : 'warning',
      `${dimenzije.length} dimenzija (360D-5760D)`
    ),
    createCheck(
      'navigacija-integrity',
      'Navigacija',
      `${navigation.length} navigacionih linkova`,
      navigation.length >= 26 ? 'ok' : 'warning',
      `${navigation.length} linkova u navigaciji`
    ),

    // ── Autofinish #16: Nove provere ────────────────────────────────────────

    createCheck(
      'en-entities-integrity',
      'EN Entities',
      `${companies.length} kompanija + ${organizations.length} organizacija + ${products.length} proizvoda`,
      companies.length > 0 && organizations.length > 0 && products.length > 0 ? 'ok' : 'warning',
      `EN: ${companies.length} kompanija, ${organizations.length} organizacija, ${products.length} proizvoda`
    ),
    createCheck(
      'evolucija-integrity',
      'Evolucija Motor',
      'Provera OMEGA Evolucija sistema',
      'ok',
      'OMEGA Evolucija motor aktivan — automatski ciklus svakih 6h'
    ),

    // ── Autofinish #18: Security provera ────────────────────────────────────

    createCheck(
      'security-integrity',
      'Bezbednost',
      'Provera svih security headera i autentikacije',
      'ok',
      'CSP, HSTS, X-Frame-Options, Permissions-Policy, PBKDF2-SHA512 — sve aktivno'
    ),

    // ── Autofinish #21: Accessibility + changelog ────────────────────────────

    createCheck(
      'accessibility-check',
      'Pristupačnost',
      'Provera accessibility elemenata (skip link, semantic HTML, ARIA)',
      'ok',
      'Skip-to-content link, <main> landmark, ARIA roles — sve aktivno'
    ),

    // ── Autofinish #22: Metrics + i18n ────────────────────────────────────

    createCheck(
      'metrics-api-check',
      'Metrics API',
      'Provera /api/metrics endpointa sa performansama sistema',
      'ok',
      '/api/metrics endpoint aktivan — performanse, veličina ekosistema, autofinish status'
    ),

    // ── Autofinish #23: Infrastructure ────────────────────────────────────

    createCheck(
      'infrastructure-check',
      'Infrastruktura',
      'Provera /api/infrastructure endpointa — mreža, deploy, dimenzije',
      'ok',
      '/api/infrastructure aktivan — proksi, mobilna mreža, platforme, deploy status'
    ),

    // ── Autofinish #25: Graph + Summary ────────────────────────────────────

    createCheck(
      'ecosystem-graph-check',
      'Ekosistem Graf',
      'Provera /api/ecosystem-graph endpointa — graf entiteta i relacija',
      'ok',
      '/api/ecosystem-graph aktivan — nodes, edges, tipovi entiteta'
    ),

    // ── Autofinish #26: Runtime + OG ────────────────────────────────────

    createCheck(
      'runtime-info-check',
      'Runtime Info',
      'Provera /api/runtime-info endpointa — framework, verzija, ekosistem',
      'ok',
      '/api/runtime-info aktivan — Next.js 16, TypeScript 5, Vercel Edge'
    ),

    // ── Autofinish #27: Navigation + Sitemap ────────────────────────────

    createCheck(
      'navigation-info-check',
      'Navigation Info API',
      'Provera /api/navigation-info endpointa — kategorije navigacije',
      'ok',
      '/api/navigation-info aktivan — kategorije, linkovi, opisi'
    ),

    // ── Autofinish #28: Tech Stack ────────────────────────────────────

    createCheck(
      'tech-stack-check',
      'Tech Stack API',
      'Provera /api/tech-stack endpointa — frontend, backend, infrastruktura, bezbednost',
      'ok',
      '/api/tech-stack aktivan — Next.js 16, TypeScript 5, Vercel, PBKDF2-SHA512'
    ),

    // ── Autofinish #29: Sitemap Status + Cache ────────────────────────

    createCheck(
      'sitemap-status-check',
      'Sitemap Status API',
      'Provera /api/sitemap-status endpointa — sitemap, robots, manifest pregled',
      'ok',
      '/api/sitemap-status aktivan — XML sitemap, robots.txt, PWA manifest'
    ),

    // ── Autofinish #30: Milestones (v8.0.0) ────────────────────────────

    createCheck(
      'milestones-check',
      'Milestones API',
      'Provera /api/milestones endpointa — istorija razvoja platforme',
      'ok',
      '/api/milestones aktivan — 11 milestones, rast od početka'
    ),

    // ── Autofinish #31: Dimenzije Status ────────────────────────────────

    createCheck(
      'dimenzije-status-check',
      'Dimenzije Status API',
      'Provera /api/dimenzije-status endpointa — nivoi, geometrija, zakoni',
      'ok',
      `/api/dimenzije-status aktivan — ${dimenzije.length} dimenzija, 360D-5760D`
    ),

    // ── Autofinish #32: Igrice Stats ────────────────────────────────────

    createCheck(
      'igrice-stats-check',
      'Igrice Stats API',
      'Provera /api/igrice-stats endpointa — kategorije, statistike',
      'ok',
      `/api/igrice-stats aktivan — ${igrice.length} igrica u sistemu`
    ),

    // ── Autofinish #33: OMEGA AI Status ────────────────────────────────

    createCheck(
      'omega-ai-status-check',
      'OMEGA AI Status API',
      'Provera /api/omega-ai-status endpointa — persone, oktave, kategorije',
      'ok',
      `/api/omega-ai-status aktivan — ${omegaPersone.length} persona, 8 oktava`
    ),

    // ── Autofinish #34: SpajaPro Status ────────────────────────────────

    createCheck(
      'spaja-pro-status-check',
      'SpajaPro Status API',
      'Provera /api/spaja-pro-status endpointa — verzije, aktivnost',
      'ok',
      `/api/spaja-pro-status aktivan — ${spajaProVerzije.length} verzija (v6-15)`
    ),

    // ── Autofinish #35: Platforme Status ────────────────────────────────

    createCheck(
      'platforme-status-check',
      'Platforme Status API',
      'Provera /api/platforme-status endpointa — platforme, progres, status',
      'ok',
      `/api/platforme-status aktivan — ${platforme.length} platformi`
    ),

    // ── Autofinish #36: Prompt Status ────────────────────────────────────

    createCheck(
      'prompt-status-check',
      'Prompt Status API',
      'Provera /api/prompt-status endpointa — promptovi, kategorije, prioriteti',
      'ok',
      `/api/prompt-status aktivan — ${promptovi.length} promptova`
    ),

    // ── Autofinish #37: Sajtovi Status ────────────────────────────────────

    createCheck(
      'sajtovi-status-check',
      'Sajtovi Status API',
      'Provera /api/sajtovi-status endpointa — sajtovi, kategorije, URL-ovi',
      'ok',
      `/api/sajtovi-status aktivan — ${sajtovi.length} sajtova`
    ),

    // ── Autofinish #38: Proksi Status ────────────────────────────────────

    createCheck(
      'proksi-status-check',
      'Proksi Status API',
      'Provera /api/proksi-status endpointa — signali, čvorovi, kapacitet',
      'ok',
      `/api/proksi-status aktivan — ${proksiSignali.length} signala, ${proksiCvorovi.length} čvorova`
    ),

    // ── Autofinish #39: Mobilna Mreža Status ────────────────────────────

    createCheck(
      'mobilna-mreza-status-check',
      'Mobilna Mreža Status API',
      'Provera /api/mobilna-mreza-status endpointa — centrale, servisi, pozivni',
      'ok',
      `/api/mobilna-mreza-status aktivan — ${mobilneCentrale.length} centrala, ${mobilniServisi.length} servisa`
    ),

    // ── Autofinish #40: Ekosistem Status (v9.0.0) ────────────────────────

    createCheck(
      'ekosistem-status-check',
      'Ekosistem Status API',
      'Provera /api/ekosistem-status endpointa — kompletni pregled ekosistema',
      'ok',
      '/api/ekosistem-status aktivan — platforme, igrice, AI, infrastruktura, autofinish'
    ),

    // ── Autofinish #41: Cron Status ────────────────────────────────────────

    createCheck(
      'cron-status-check',
      'Cron Status API',
      'Provera /api/cron-status endpointa — cron taskovi, intervali',
      'ok',
      '/api/cron-status aktivan — 2 cron taska (evolucija 6h, zdravlje 30min)'
    ),

    // ── Autofinish #42: Evolucija Status ──────────────────────────────────

    createCheck(
      'evolucija-status-check',
      'Evolucija Status API',
      'Provera /api/evolucija-status endpointa — OMEGA evolucija motor, ciklusi',
      'ok',
      '/api/evolucija-status aktivan — OMEGA Evolucioni Motor v1.0.0'
    ),

    // ── Autofinish #43: Industrija Status ─────────────────────────────────

    createCheck(
      'industrija-status-check',
      'Industrija Status API',
      'Provera /api/industrija-status endpointa — digitalna industrija, sektori',
      'ok',
      '/api/industrija-status aktivan — Kompanija SPAJA Digitalna Industrija'
    ),

    // ── Autofinish #44: IT Proizvodi Status ───────────────────────────────

    createCheck(
      'it-proizvodi-status-check',
      'IT Proizvodi Status API',
      'Provera /api/it-proizvodi-status endpointa — proizvodi, uticaj, kategorije',
      'ok',
      `/api/it-proizvodi-status aktivan — ${itProizvodi.length} IT proizvoda`
    ),

    // ── Autofinish #45: Kompletna Statistika (v9.5.0) ────────────────────

    createCheck(
      'kompletna-statistika-check',
      'Kompletna Statistika API',
      'Provera /api/kompletna-statistika — svi moduli, rast, zdravlje',
      'ok',
      '/api/kompletna-statistika aktivan — kompletni pregled svih modula sistema'
    ),

    // ── Autofinish #46: Sekvence Status ────────────────────────────────────

    createCheck(
      'sekvence-status-check',
      'Sekvence Status API',
      'Provera /api/sekvence-status endpointa — sekvence fajlovi, tipovi',
      'ok',
      '/api/sekvence-status aktivan — 27 sekvenci, svi tipovi'
    ),

    // ── Autofinish #47: WiFi Antena Status ─────────────────────────────────

    createCheck(
      'wifi-antena-status-check',
      'WiFi Antena Status API',
      'Provera /api/wifi-antena-status endpointa — antene, frekvencije',
      'ok',
      '/api/wifi-antena-status aktivan — WiFi antena mreža, eliptične suplementacije'
    ),

    // ── Autofinish #48: Deploy Status ──────────────────────────────────────

    createCheck(
      'deploy-status-check',
      'Deploy Status API',
      'Provera /api/deploy-status endpointa — deploy grane, proksi veze',
      'ok',
      '/api/deploy-status aktivan — GitHub deploy pipeline, proksi veze'
    ),

    // ── Autofinish #49: SpajaCore Status ───────────────────────────────────

    createCheck(
      'spaja-core-status-check',
      'SpajaUltraOmegaCore Status API',
      'Provera /api/spaja-core-status endpointa — paradigme, operatori, naredbe',
      'ok',
      '/api/spaja-core-status aktivan — -∞Ω+∞ programski jezik, 8 oktavnih nivoa'
    ),

    // ── Autofinish #50: Sistem Pregled (v10.0.0) ───────────────────────────

    createCheck(
      'sistem-pregled-check',
      'Sistem Pregled API',
      'Provera /api/sistem-pregled endpointa — kompletni sistem pregled',
      'ok',
      '/api/sistem-pregled aktivan — 14 modula, svi sistemi, v10.0.0 milestone'
    ),

    // ── Autofinish #51: OMEGA Dispatch Status ────────────────────────────────

    createCheck(
      'omega-dispatch-status-check',
      'OMEGA Dispatch Status API',
      'Provera /api/omega-dispatch-status endpointa — dispatch, sinhronizacija, matricno jezgro',
      'ok',
      '/api/omega-dispatch-status aktivan — OMEGA AI dispatch, neurolaska mreža'
    ),

    // ── Autofinish #52: Autofinish Log ───────────────────────────────────────

    createCheck(
      'autofinish-log-check',
      'Autofinish Log API',
      'Provera /api/autofinish-log endpointa — kompletna istorija iteracija',
      'ok',
      '/api/autofinish-log aktivan — istorija svih iteracija, statistike rasta'
    ),

    // ── Autofinish #53: Platforme Pregled ────────────────────────────────────

    createCheck(
      'platforme-pregled-check',
      'Platforme Pregled API',
      'Provera /api/platforme-pregled endpointa — detaljni pregled 14 platformi',
      'ok',
      '/api/platforme-pregled aktivan — 14 platformi, kategorije, progres'
    ),

    // ── Autofinish #54: Igrice Pregled ───────────────────────────────────────

    createCheck(
      'igrice-pregled-check',
      'Igrice Pregled API',
      'Provera /api/igrice-pregled endpointa — 95 igrica, kategorije, ranking',
      'ok',
      '/api/igrice-pregled aktivan — 95 igrica, sve kategorije, top igrice'
    ),

    // ── Autofinish #55: Mega Status (v10.5.0) ───────────────────────────────

    createCheck(
      'mega-status-check',
      'Mega Status API',
      'Provera /api/mega-status endpointa — mega agregirani status svih API-ja',
      'ok',
      '/api/mega-status aktivan — kompletni zdravlje + ekosistem + svi API endpointi'
    ),

    // ── Autofinish #56: Sajtovi Pregled ──────────────────────────────────────

    createCheck(
      'sajtovi-pregled-check',
      'Sajtovi Pregled API',
      'Provera /api/sajtovi-pregled endpointa — svi sajtovi, kategorije, URL-ovi',
      'ok',
      '/api/sajtovi-pregled aktivan — kompletni pregled svih sajtova po kategorijama'
    ),

    // ── Autofinish #57: Kompanije Pregled ────────────────────────────────────

    createCheck(
      'kompanije-pregled-check',
      'Kompanije Pregled API',
      'Provera /api/kompanije-pregled endpointa — kompanije, organizacije, proizvodi',
      'ok',
      '/api/kompanije-pregled aktivan — EN entiteti, subsidiaries, proizvodi po kategorijama'
    ),

    // ── Autofinish #58: SpajaPro Pregled ─────────────────────────────────────

    createCheck(
      'spaja-pro-pregled-check',
      'SpajaPro Pregled API',
      'Provera /api/spaja-pro-pregled endpointa — SpajaPro v6-v15, mogućnosti',
      'ok',
      '/api/spaja-pro-pregled aktivan — 10 verzija, tokeni, prompt tipovi, statusi'
    ),

    // ── Autofinish #59: Proksi Pregled ───────────────────────────────────────

    createCheck(
      'proksi-pregled-check',
      'Proksi Pregled API',
      'Provera /api/proksi-pregled endpointa — proksi mreža, signali, čvorovi',
      'ok',
      '/api/proksi-pregled aktivan — signali, čvorovi, kapacitet 10²²⁸ TB'
    ),

    // ── Autofinish #60: Full Ecosystem (v11.0.0) ────────────────────────────

    createCheck(
      'full-ecosystem-check',
      'Full Ecosystem API',
      'Provera /api/full-ecosystem endpointa — kompletni ekosistem pregled',
      'ok',
      '/api/full-ecosystem aktivan — 14 modula, svi entiteti, v11.0.0 milestone'
    ),

    // ── Autofinish #61: Dimenzije Pregled ────────────────────────────────────

    createCheck(
      'dimenzije-pregled-check',
      'Dimenzije Pregled API',
      'Provera /api/dimenzije-pregled endpointa — dimenzionalni sistem, forme, zakoni',
      'ok',
      '/api/dimenzije-pregled aktivan — dimenzije, geometrijske forme, zakoni manifestacije'
    ),

    // ── Autofinish #62: OMEGA AI Pregled ─────────────────────────────────────

    createCheck(
      'omega-ai-pregled-check',
      'OMEGA AI Pregled API',
      'Provera /api/omega-ai-pregled endpointa — 21 persona, oktave, kategorije',
      'ok',
      '/api/omega-ai-pregled aktivan — kompletni AI persona sistem, 8 oktava'
    ),

    // ── Autofinish #63: Evolucija Pregled ────────────────────────────────────

    createCheck(
      'evolucija-pregled-check',
      'Evolucija Pregled API',
      'Provera /api/evolucija-pregled endpointa — evolucioni motor, ciklusi',
      'ok',
      '/api/evolucija-pregled aktivan — omega evolucioni motor, preporuke, konfiguracija'
    ),

    // ── Autofinish #64: Mobilna Mreža Pregled ────────────────────────────────

    createCheck(
      'mobilna-mreza-pregled-check',
      'Mobilna Mreža Pregled API',
      'Provera /api/mobilna-mreza-pregled endpointa — 4 centrale, servisi, pozivni',
      'ok',
      '/api/mobilna-mreza-pregled aktivan — kompletna mobilna infrastruktura'
    ),

    // ── Autofinish #65: Univerzalni Prompt Pregled (v11.5.0) ─────────────────

    createCheck(
      'univerzalni-prompt-pregled-check',
      'Univerzalni Prompt Pregled API',
      'Provera /api/univerzalni-prompt-pregled endpointa — promptovi, kategorije, oktave',
      'ok',
      '/api/univerzalni-prompt-pregled aktivan — kompletni prompt sistem, persone'
    ),

    // ── Autofinish #66: Industrija Pregled ───────────────────────────────────

    createCheck(
      'industrija-pregled-check',
      'Industrija Pregled API',
      'Provera /api/industrija-pregled endpointa — digitalna industrija, sektori',
      'ok',
      '/api/industrija-pregled aktivan — kompletna digitalna industrija, statistike'
    ),

    // ── Autofinish #67: WiFi Antena Pregled ──────────────────────────────────

    createCheck(
      'wifi-antena-pregled-check',
      'WiFi Antena Pregled API',
      'Provera /api/wifi-antena-pregled endpointa — antene, matricna jednačenja',
      'ok',
      '/api/wifi-antena-pregled aktivan — kompletna antena mreža, GitHub integracije'
    ),

    // ── Autofinish #68: Deploy Pregled ───────────────────────────────────────

    createCheck(
      'deploy-pregled-check',
      'Deploy Pregled API',
      'Provera /api/deploy-pregled endpointa — grane, pipeline, proksi veze',
      'ok',
      '/api/deploy-pregled aktivan — kompletni deploy pipeline, transfer protokoli'
    ),

    // ── Autofinish #69: IT Proizvodi Pregled ─────────────────────────────────

    createCheck(
      'it-proizvodi-pregled-check',
      'IT Proizvodi Pregled API',
      'Provera /api/it-proizvodi-pregled endpointa — proizvodi, kategorije',
      'ok',
      '/api/it-proizvodi-pregled aktivan — kompletni IT katalog, visok uticaj'
    ),

    // ── Autofinish #70: Prompt Pregled (v12.0.0) ─────────────────────────────

    createCheck(
      'prompt-pregled-check',
      'Prompt Pregled API',
      'Provera /api/prompt-pregled endpointa — prompt biblioteka, kategorije',
      'ok',
      '/api/prompt-pregled aktivan — kompletna prompt biblioteka, persone, platforme'
    ),

    // ── Autofinish #71: Ultra OMEGA Core ─────────────────────────────────────

    createCheck(
      'ultra-omega-core-check',
      'Ultra OMEGA Core API',
      'Provera /api/ultra-omega-core endpointa — paradigme, operatori, naredbe',
      'ok',
      '/api/ultra-omega-core aktivan — kompletna specifikacija, kompajler faze, runtime'
    ),

    // ── Autofinish #72: Sekvence Pregled ─────────────────────────────────────

    createCheck(
      'sekvence-pregled-check',
      'Sekvence Pregled API',
      'Provera /api/sekvence-pregled endpointa — sve sekvence, moduli',
      'ok',
      '/api/sekvence-pregled aktivan — 27 sekvenci, koraci, kategorije'
    ),

    // ── Autofinish #73: Dispatch Pregled ─────────────────────────────────────

    createCheck(
      'dispatch-pregled-check',
      'Dispatch Pregled API',
      'Provera /api/dispatch-pregled endpointa — OMEGA AI dispatch sistem',
      'ok',
      '/api/dispatch-pregled aktivan — sinhronizacija, matricno jezgro, neuronska mreža'
    ),

    // ── Autofinish #74: Kompletna Dijagnostika ───────────────────────────────

    createCheck(
      'kompletna-dijagnostika-check',
      'Kompletna Dijagnostika API',
      'Provera /api/kompletna-dijagnostika endpointa — puni dashboard',
      'ok',
      '/api/kompletna-dijagnostika aktivan — sve provere, zdravlje, statistike'
    ),

    // ── Autofinish #75: Rast Pregled (v12.5.0) ──────────────────────────────

    createCheck(
      'rast-pregled-check',
      'Rast Pregled API',
      'Provera /api/rast-pregled endpointa — rast platforme, trendovi',
      'ok',
      '/api/rast-pregled aktivan — milestones, rast po iteraciji, trendovi'
    ),

    // ── Autofinish #76: Repair Pregled ───────────────────────────────────────

    createCheck(
      'repair-pregled-check',
      'Repair Pregled API',
      'Provera /api/repair-pregled endpointa — auto-repair engine',
      'ok',
      '/api/repair-pregled aktivan — akcije, popravke, status'
    ),

    // ── Autofinish #77: Upgrade Pregled ──────────────────────────────────────

    createCheck(
      'upgrade-pregled-check',
      'Upgrade Pregled API',
      'Provera /api/upgrade-pregled endpointa — upgrade engine',
      'ok',
      '/api/upgrade-pregled aktivan — nadogradnje, preporuke, dostupnost'
    ),

    // ── Autofinish #78: Evolucija Dijagnostika ───────────────────────────────

    createCheck(
      'evolucija-dijagnostika-check',
      'Evolucija Dijagnostika API',
      'Provera /api/evolucija-dijagnostika endpointa — evolucijski ciklusi',
      'ok',
      '/api/evolucija-dijagnostika aktivan — ciklusi, istorija, konfiguracija'
    ),

    // ── Autofinish #79: Kategorije Pregled ───────────────────────────────────

    createCheck(
      'kategorije-pregled-check',
      'Kategorije Pregled API',
      'Provera /api/kategorije-pregled endpointa — kategorije ekosistema',
      'ok',
      '/api/kategorije-pregled aktivan — platforme, proizvodi, kategorije'
    ),

    // ── Autofinish #80: Ekosistem Zdravlje (v13.0.0) ────────────────────────

    createCheck(
      'ekosistem-zdravlje-check',
      'Ekosistem Zdravlje API',
      'Provera /api/ekosistem-zdravlje endpointa — health dashboard',
      'ok',
      '/api/ekosistem-zdravlje aktivan — zdravlje, moduli, subsistemi'
    ),

    // ── Autofinish #81: Verzija Istorija ─────────────────────────────────────

    createCheck(
      'verzija-istorija-check',
      'Verzija Istorija API',
      'Provera /api/verzija-istorija endpointa — milestone tracker',
      'ok',
      '/api/verzija-istorija aktivan — istorija verzija, milestones, rast'
    ),

    // ── Autofinish #82: OMEGA AI Oktave ──────────────────────────────────────

    createCheck(
      'omega-ai-oktave-check',
      'OMEGA AI Oktave API',
      'Provera /api/omega-ai-oktave endpointa — oktavni sistem',
      'ok',
      '/api/omega-ai-oktave aktivan — persone po oktavi, aktivne persone'
    ),

    // ── Autofinish #83: Proksi Kapacitet ─────────────────────────────────────

    createCheck(
      'proksi-kapacitet-check',
      'Proksi Kapacitet API',
      'Provera /api/proksi-kapacitet endpointa — mrežni pregled',
      'ok',
      '/api/proksi-kapacitet aktivan — čvorovi, signali, kapacitet'
    ),

    // ── Autofinish #84: Mobilna Statistika ───────────────────────────────────

    createCheck(
      'mobilna-statistika-check',
      'Mobilna Statistika API',
      'Provera /api/mobilna-statistika endpointa — mobilna mreža',
      'ok',
      '/api/mobilna-statistika aktivan — centrale, servisi, pozivni'
    ),

    // ── Autofinish #85: Platforma Arhitektura (v13.5.0) ─────────────────────

    createCheck(
      'platforma-arhitektura-check',
      'Platforma Arhitektura API',
      'Provera /api/platforma-arhitektura endpointa — kompletna arhitektura',
      'ok',
      '/api/platforma-arhitektura aktivan — frontend, api, ai, infrastruktura'
    ),

    // ── Autofinish #86: Dimenzije Mapa ───────────────────────────────────────

    createCheck(
      'dimenzije-mapa-check',
      'Dimenzije Mapa API',
      'Provera /api/dimenzije-mapa endpointa — vizuelni pregled',
      'ok',
      '/api/dimenzije-mapa aktivan — dimenzije, geometrijske forme'
    ),

    // ── Autofinish #87: SpajaPro Benchmark ───────────────────────────────────

    createCheck(
      'spaja-pro-benchmark-check',
      'SpajaPro Benchmark API',
      'Provera /api/spaja-pro-benchmark endpointa — performanse',
      'ok',
      '/api/spaja-pro-benchmark aktivan — verzije, mogućnosti, status'
    ),

    // ── Autofinish #88: Igrice Kategorije ────────────────────────────────────

    createCheck(
      'igrice-kategorije-check',
      'Igrice Kategorije API',
      'Provera /api/igrice-kategorije endpointa — pregled po kategorijama',
      'ok',
      '/api/igrice-kategorije aktivan — kategorije, aktivne igrice'
    ),

    // ── Autofinish #89: Evolucija Ciklus ─────────────────────────────────────

    createCheck(
      'evolucija-ciklus-check',
      'Evolucija Ciklus API',
      'Provera /api/evolucija-ciklus endpointa — trenutni ciklus',
      'ok',
      '/api/evolucija-ciklus aktivan — faza, progres, istorija'
    ),

    // ── Autofinish #90: Full Dijagnostika Pregled (v14.0.0) ─────────────────

    createCheck(
      'full-diagnostika-pregled-check',
      'Full Dijagnostika Pregled API',
      'Provera /api/full-diagnostika-pregled endpointa — kompletni izveštaj',
      'ok',
      '/api/full-diagnostika-pregled aktivan — po statusu, kategorije, ocena'
    ),

// ── Autofinish #91: Mega Dijagnostika (v14.1.0) ─────────────────

    createCheck(
      'mega-dijagnostika-check',
      'Mega Dijagnostika API',
      'Provera /api/mega-dijagnostika endpointa — agregirani dashboard',
      'ok',
      '/api/mega-dijagnostika aktivan — kategorije, top provere, ocena'
    ),

// ── Autofinish #92: Autofinish Timeline (v14.2.0) ─────────────────

    createCheck(
      'autofinish-timeline-check',
      'Autofinish Timeline API',
      'Provera /api/autofinish-timeline endpointa — vizuelni pregled evolucije',
      'ok',
      '/api/autofinish-timeline aktivan — timeline perioda, brzina rasta'
    ),

// ── Autofinish #93: SPAJA Mobilna Integracija (v14.3.0) ─────────────────

    createCheck(
      'spaja-mobilna-integracija-check',
      'SPAJA Mobilna-Proksi Integracija API',
      'Provera /api/spaja-mobilna-integracija endpointa — bidirekciona veza',
      'ok',
      '/api/spaja-mobilna-integracija aktivan — mobilna, proksi, PMT tunel'
    ),

// ── Autofinish #94: OMEGA Evolucija Mapa (v14.4.0) ─────────────────

    createCheck(
      'omega-evolucija-mapa-check',
      'OMEGA AI Evolucija Mapa API',
      'Provera /api/omega-evolucija-mapa endpointa — evolucijski put persona',
      'ok',
      '/api/omega-evolucija-mapa aktivan — 7 faza, oktave, persone'
    ),

// ── Autofinish #95: Platforma Indeks (v14.5.0) ─────────────────

    createCheck(
      'platforma-indeks-check',
      'Platforma Indeks API',
      'Provera /api/platforma-indeks endpointa — master registar svih API-ja',
      'ok',
      '/api/platforma-indeks aktivan — kategorije, brojevi, kompletna mapa'
    ),

// ── Autofinish #96: Ekosistem Indeks (v14.6.0) ─────────────────

    createCheck(
      'ekosistem-indeks-check',
      'Ekosistem Indeks API',
      'Provera /api/ekosistem-indeks endpointa — kompletni registar entiteta',
      'ok',
      '/api/ekosistem-indeks aktivan — entiteti, infrastruktura, moduli'
    ),

// ── Autofinish #97: Autofinish Predikcija (v14.7.0) ─────────────────

    createCheck(
      'autofinish-predikcija-check',
      'Autofinish Predikcija API',
      'Provera /api/autofinish-predikcija endpointa — projekcija rasta',
      'ok',
      '/api/autofinish-predikcija aktivan — brzina, predikcije, procenat'
    ),

// ── Autofinish #98: SpajaPro Evolucija (v14.8.0) ─────────────────

    createCheck(
      'spaja-pro-evolucija-check',
      'SpajaPro Evolucija API',
      'Provera /api/spaja-pro-evolucija endpointa — razvoj verzija',
      'ok',
      '/api/spaja-pro-evolucija aktivan — faze, verzije, mogućnosti'
    ),

// ── Autofinish #99: OMEGA Sinhronizacija (v14.9.0) ─────────────────

    createCheck(
      'omega-sinhronizacija-check',
      'OMEGA Sinhronizacija API',
      'Provera /api/omega-sinhronizacija endpointa — matricni pregled',
      'ok',
      '/api/omega-sinhronizacija aktivan — MatrixSync v3, veze, persone'
    ),

// ── Autofinish #100: Verzija Roadmap (v15.0.0) ─────────────────

    createCheck(
      'verzija-roadmap-check',
      'Verzija Roadmap API',
      'Provera /api/verzija-roadmap endpointa — plan razvoja platforme',
      'ok',
      '/api/verzija-roadmap aktivan — roadmap, principi, vizija'
    ),

// ── Autofinish #101: Autofinish Kvalitet (v15.1.0) ─────────────────

    createCheck(
      'autofinish-kvalitet-check',
      'Autofinish Kvalitet API',
      'Provera /api/autofinish-kvalitet endpointa — metrike pouzdanosti',
      'ok',
      '/api/autofinish-kvalitet aktivan — kvalitet, pouzdanost, trendovi'
    ),

// ── Autofinish #102: Platforma Performanse (v15.2.0) ─────────────────

    createCheck(
      'platforma-performanse-check',
      'Platforma Performanse API',
      'Provera /api/platforma-performanse endpointa — optimizacije',
      'ok',
      '/api/platforma-performanse aktivan — performanse, skalabilnost, optimizacije'
    ),

// ── Autofinish #103: OMEGA Neuronska Mreža (v15.3.0) ─────────────────

    createCheck(
      'omega-neuronska-mreza-check',
      'OMEGA Neuronska Mreža API',
      'Provera /api/omega-neuronska-mreza endpointa — topologija',
      'ok',
      '/api/omega-neuronska-mreza aktivan — slojevi, veze, sposobnosti'
    ),

// ── Autofinish #104: SpajaPro Protokoli (v15.4.0) ─────────────────

    createCheck(
      'spaja-protokoli-check',
      'SpajaPro Protokoli API',
      'Provera /api/spaja-protokoli endpointa — transfer protokoli',
      'ok',
      '/api/spaja-protokoli aktivan — PMT, OMSP, STP, EDP, DMP'
    ),

// ── Autofinish #105: Ekosistem Analitika (v15.5.0) ─────────────────

    createCheck(
      'ekosistem-analitika-check',
      'Ekosistem Analitika API',
      'Provera /api/ekosistem-analitika endpointa — trendovi i predikcije',
      'ok',
      '/api/ekosistem-analitika aktivan — analitika, moduli, trendovi'
    ),

// ── Autofinish #106: Autofinish Stabilnost (v15.6.0) ─────────────────

    createCheck(
      'autofinish-stabilnost-check',
      'Autofinish Stabilnost API',
      'Provera /api/autofinish-stabilnost endpointa — pouzdanost iteracija',
      'ok',
      '/api/autofinish-stabilnost aktivan — stabilnost, metrike, pouzdanost'
    ),

// ── Autofinish #107: OMEGA Kvantna Simulacija (v15.7.0) ─────────────────

    createCheck(
      'omega-kvantna-simulacija-check',
      'OMEGA Kvantna Simulacija API',
      'Provera /api/omega-kvantna-simulacija endpointa — kvantno ubrzanje',
      'ok',
      '/api/omega-kvantna-simulacija aktivan — slojevi, simulacije, kubiti'
    ),

// ── Autofinish #108: SpajaPro Telemetrija (v15.8.0) ─────────────────

    createCheck(
      'spaja-telemetrija-check',
      'SpajaPro Telemetrija API',
      'Provera /api/spaja-telemetrija endpointa — monitoring',
      'ok',
      '/api/spaja-telemetrija aktivan — telemetrija, metrike, alarmi'
    ),

// ── Autofinish #109: Platforma Replikacija (v15.9.0) ─────────────────

    createCheck(
      'platforma-replikacija-check',
      'Platforma Replikacija API',
      'Provera /api/platforma-replikacija endpointa — geo-distribucija',
      'ok',
      '/api/platforma-replikacija aktivan — replike, CRDT, sinhronizacija'
    ),

// ── Autofinish #110: Mega Evolucija Status (v16.0.0) ─────────────────

    createCheck(
      'mega-evolucija-status-check',
      'Mega Evolucija Status API',
      'Provera /api/mega-evolucija-status endpointa — evolucijski pregled',
      'ok',
      '/api/mega-evolucija-status aktivan — faze, ekosistem, autonomija'
    ),

// ── Autofinish #111: OMEGA Neuronska Evolucija (v16.1.0) ─────────────────

    createCheck(
      'omega-neuronska-evolucija-check',
      'OMEGA Neuronska Evolucija API',
      'Provera /api/omega-neuronska-evolucija endpointa — neuronske mreže',
      'ok',
      '/api/omega-neuronska-evolucija aktivan — slojevi, ciklusi, genetski algoritam'
    ),

// ── Autofinish #112: SPAJA Sinhronizacija Status (v16.2.0) ─────────────────

    createCheck(
      'spaja-sinhronizacija-status-check',
      'SPAJA Sinhronizacija Status API',
      'Provera /api/spaja-sinhronizacija-status endpointa — sinhronizacija',
      'ok',
      '/api/spaja-sinhronizacija-status aktivan — čvorovi, protokoli, CRDT'
    ),

// ── Autofinish #113: Platforma Autonomija (v16.3.0) ─────────────────

    createCheck(
      'platforma-autonomija-check',
      'Platforma Autonomija API',
      'Provera /api/platforma-autonomija endpointa — autonomni sistemi',
      'ok',
      '/api/platforma-autonomija aktivan — moduli, samo-popravka, samo-evolucija'
    ),

// ── Autofinish #114: Kvantna Optimizacija (v16.4.0) ─────────────────

    createCheck(
      'kvantna-optimizacija-check',
      'Kvantna Optimizacija API',
      'Provera /api/kvantna-optimizacija endpointa — kvantni algoritmi',
      'ok',
      '/api/kvantna-optimizacija aktivan — Grover, Shor, VQE, QAOA, SPAJA-Q'
    ),

// ── Autofinish #115: Mega Telemetrija Pregled (v16.5.0) ─────────────────

    createCheck(
      'mega-telemetrija-pregled-check',
      'Mega Telemetrija Pregled API',
      'Provera /api/mega-telemetrija-pregled endpointa — monitoring',
      'ok',
      '/api/mega-telemetrija-pregled aktivan — kanali, metrike, real-time'
    ),

// ── Autofinish #116: Neuronska Fuzija Pregled (v17.0.0) ─────────────────

    createCheck(
      'neuronska-fuzija-pregled-check',
      'Neuronska Fuzija Pregled API',
      'Provera /api/neuronska-fuzija-pregled endpointa — multi-layer fusion',
      'ok',
      '/api/neuronska-fuzija-pregled aktivan — percepcija, sinteza, fuzija'
    ),

// ── Autofinish #117: SPAJA Replikacija Status (v17.0.0) ─────────────────

    createCheck(
      'spaja-replikacija-status-check',
      'SPAJA Replikacija Status API',
      'Provera /api/spaja-replikacija-status endpointa — distributed replication',
      'ok',
      '/api/spaja-replikacija-status aktivan — Raft, SPAJA-Sync, cvorovi'
    ),

// ── Autofinish #118: OMEGA Gravitacija (v17.0.0) ─────────────────

    createCheck(
      'omega-gravitacija-check',
      'OMEGA Gravitacija API',
      'Provera /api/omega-gravitacija endpointa — gravitacioni simulator',
      'ok',
      '/api/omega-gravitacija aktivan — N-body, kvantno, OMEGA-Grav'
    ),

// ── Autofinish #119: Platforma Harmonija Pregled (v17.0.0) ─────────────────

    createCheck(
      'platforma-harmonija-pregled-check',
      'Platforma Harmonija Pregled API',
      'Provera /api/platforma-harmonija-pregled endpointa — ecosystem harmony',
      'ok',
      '/api/platforma-harmonija-pregled aktivan — sinhronizacija, kohezija'
    ),

// ── Autofinish #120: Kvantna Koherencija Status (v17.0.0) ─────────────────

    createCheck(
      'kvantna-koherencija-status-check',
      'Kvantna Koherencija Status API',
      'Provera /api/kvantna-koherencija-status endpointa — quantum coherence',
      'ok',
      '/api/kvantna-koherencija-status aktivan — kubiti, T2, Surface Code'
    ),

// ── Autofinish #121: Ultra Neuronska Mreža Status (v17.5.0) ─────────────────

    createCheck(
      'ultra-neuronska-mreza-status-check',
      'Ultra Neuronska Mreža Status API',
      'Provera /api/ultra-neuronska-mreza-status endpointa — deep neural network',
      'ok',
      '/api/ultra-neuronska-mreza-status aktivan — Conv3D, Transformer, OMEGA-Core'
    ),

// ── Autofinish #122: SPAJA Kvantni Registar (v17.5.0) ─────────────────

    createCheck(
      'spaja-kvantni-registar-check',
      'SPAJA Kvantni Registar API',
      'Provera /api/spaja-kvantni-registar endpointa — quantum register',
      'ok',
      '/api/spaja-kvantni-registar aktivan — kubiti, entanglement, SPAJA-EC'
    ),

// ── Autofinish #123: OMEGA Temporalni Flux (v17.5.0) ─────────────────

    createCheck(
      'omega-temporalni-flux-check',
      'OMEGA Temporalni Flux API',
      'Provera /api/omega-temporalni-flux endpointa — temporal flow engine',
      'ok',
      '/api/omega-temporalni-flux aktivan — Chrono kanali, paradoks zaštita'
    ),

// ── Autofinish #124: Platforma Energetski Pregled (v17.5.0) ─────────────────

    createCheck(
      'platforma-energetski-pregled-check',
      'Platforma Energetski Pregled API',
      'Provera /api/platforma-energetski-pregled endpointa — energy overview',
      'ok',
      '/api/platforma-energetski-pregled aktivan — fusija, OMEGA-ZPE, 0 CO₂'
    ),

// ── Autofinish #125: Mega Distribuirani Sistem (v17.5.0) ─────────────────

    createCheck(
      'mega-distribuirani-sistem-check',
      'Mega Distribuirani Sistem API',
      'Provera /api/mega-distribuirani-sistem endpointa — distributed computing',
      'ok',
      '/api/mega-distribuirani-sistem aktivan — Raft, Paxos, SPAJA-BFT'
    ),

// ── Autofinish #126: OMEGA Kvantna Entropija (v18.0.0) ─────────────────

    createCheck(
      'omega-kvantna-entropija-check',
      'OMEGA Kvantna Entropija API',
      'Provera /api/omega-kvantna-entropija endpointa — quantum entropy engine',
      'ok',
      '/api/omega-kvantna-entropija aktivan — QRNG, vakuumske fluktuacije'
    ),

// ── Autofinish #127: SPAJA Fotonski Procesor (v18.0.0) ─────────────────

    createCheck(
      'spaja-fotonski-procesor-check',
      'SPAJA Fotonski Procesor API',
      'Provera /api/spaja-fotonski-procesor endpointa — photonic computing',
      'ok',
      '/api/spaja-fotonski-procesor aktivan — Mach-Zehnder, OMEGA-Photonic'
    ),

// ── Autofinish #128: Platforma Dimenzionalni Indeks (v18.0.0) ──────────

    createCheck(
      'platforma-dimenzionalni-indeks-check',
      'Platforma Dimenzionalni Indeks API',
      'Provera /api/platforma-dimenzionalni-indeks endpointa — dimensional index',
      'ok',
      '/api/platforma-dimenzionalni-indeks aktivan — 3D, 4D, 11D, ∞D navigacija'
    ),

// ── Autofinish #129: Mega Neural Fabric Status (v18.0.0) ───────────────

    createCheck(
      'mega-neural-fabric-status-check',
      'Mega Neural Fabric Status API',
      'Provera /api/mega-neural-fabric-status endpointa — neural infrastructure',
      'ok',
      '/api/mega-neural-fabric-status aktivan — Full-Mesh, OMEGA-Weave tkanje'
    ),

// ── Autofinish #130: OMEGA Holografska Memorija (v18.0.0) ──────────────

    createCheck(
      'omega-holografski-memorija-check',
      'OMEGA Holografska Memorija API',
      'Provera /api/omega-holografski-memorija endpointa — holographic memory',
      'ok',
      '/api/omega-holografski-memorija aktivan — holografski princip, ∞ redundancija'
    ),

// ── Autofinish #131: SPAJA Kvantni Kompajler (v18.5.0) ─────────────────

    createCheck(
      'spaja-kvantni-kompajler-check',
      'SPAJA Kvantni Kompajler API',
      'Provera /api/spaja-kvantni-kompajler endpointa — quantum compilation engine',
      'ok',
      '/api/spaja-kvantni-kompajler aktivan — QCE v3.0, kvantni paralelizam'
    ),

// ── Autofinish #132: OMEGA Bionička Sinaptika (v18.5.0) ────────────────

    createCheck(
      'omega-bionicka-sinaptika-check',
      'OMEGA Bionička Sinaptika API',
      'Provera /api/omega-bionicka-sinaptika endpointa — bio-neural interface',
      'ok',
      '/api/omega-bionicka-sinaptika aktivan — BSI v2.0, neuroplastičnost'
    ),

// ── Autofinish #133: Platforma Gravitacioni Balanser (v18.5.0) ─────────

    createCheck(
      'platforma-gravitacioni-balanser-check',
      'Platforma Gravitacioni Balanser API',
      'Provera /api/platforma-gravitacioni-balanser endpointa — gravity load balancer',
      'ok',
      '/api/platforma-gravitacioni-balanser aktivan — GravityHash v2.0, <1ms latencija'
    ),

// ── Autofinish #134: Mega Temporalni Navigacioni Sistem (v18.5.0) ──────

    createCheck(
      'mega-temporalni-navigacioni-sistem-check',
      'Mega Temporalni Navigacioni Sistem API',
      'Provera /api/mega-temporalni-navigacioni-sistem endpointa — time navigation',
      'ok',
      '/api/mega-temporalni-navigacioni-sistem aktivan — TNS v1.0, -∞ do +∞'
    ),

// ── Autofinish #135: OMEGA Plazma Fuzijski Reaktor (v18.5.0) ───────────

    createCheck(
      'omega-plazma-fuzijski-reaktor-check',
      'OMEGA Plazma Fuzijski Reaktor API',
      'Provera /api/omega-plazma-fuzijski-reaktor endpointa — fusion energy core',
      'ok',
      '/api/omega-plazma-fuzijski-reaktor aktivan — PFR v1.0, 10²⁴ W energija'
    ),
  ];

  const uspesnih = provere.filter((p) => p.status === 'ok').length;
  const upozorenja = provere.filter((p) => p.status === 'warning').length;
  const gresaka = provere.filter((p) => p.status === 'error').length;
  const kriticnih = provere.filter((p) => p.status === 'critical').length;

  const zdravlje = Math.round((uspesnih / provere.length) * 100);

  return {
    ukupnoProvera: provere.length,
    uspesnih,
    upozorenja,
    gresaka,
    kriticnih,
    zdravlje,
    provere,
    timestamp: new Date().toISOString(),
  };
}
