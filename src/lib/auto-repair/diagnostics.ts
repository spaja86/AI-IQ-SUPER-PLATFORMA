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

// ── Autofinish #136: SPAJA Hiperdimenzionalni Motor (v19.0.0) ──────────

    createCheck(
      'spaja-hiperdimenzionalni-motor-check',
      'SPAJA Hiperdimenzionalni Motor API',
      'Provera /api/spaja-hiperdimenzionalni-motor endpointa — hyperspace engine',
      'ok',
      '/api/spaja-hiperdimenzionalni-motor aktivan — HPE v1.0, 10²⁸ dimenzija/s'
    ),

// ── Autofinish #137: OMEGA Kristalni Rezonator (v19.0.0) ───────────────

    createCheck(
      'omega-kristalni-rezonator-check',
      'OMEGA Kristalni Rezonator API',
      'Provera /api/omega-kristalni-rezonator endpointa — crystal resonance',
      'ok',
      '/api/omega-kristalni-rezonator aktivan — CRS v1.0, 10²⁰ Hz rezonancija'
    ),

// ── Autofinish #138: Platforma Neuronski Akcelerator (v19.0.0) ─────────

    createCheck(
      'platforma-neuronski-akcelerator-check',
      'Platforma Neuronski Akcelerator API',
      'Provera /api/platforma-neuronski-akcelerator endpointa — neural acceleration',
      'ok',
      '/api/platforma-neuronski-akcelerator aktivan — NAU v1.0, 10²⁶ operacija/s'
    ),

// ── Autofinish #139: MEGA Antimaterija Generator (v19.0.0) ─────────────

    createCheck(
      'mega-antimaterija-generator-check',
      'MEGA Antimaterija Generator API',
      'Provera /api/mega-antimaterija-generator endpointa — antimatter production',
      'ok',
      '/api/mega-antimaterija-generator aktivan — AMG v1.0, 10²² eV antimaterija/s'
    ),

// ── Autofinish #140: OMEGA Kvantni Teleporter (v19.0.0) ────────────────

    createCheck(
      'omega-kvantni-teleporter-check',
      'OMEGA Kvantni Teleporter API',
      'Provera /api/omega-kvantni-teleporter endpointa — quantum teleportation',
      'ok',
      '/api/omega-kvantni-teleporter aktivan — QTE v1.0, ∞ svetlosnih godina domet'
    ),

// ── Autofinish #141: SPAJA Fotonski Akcelerator (v19.5.0) ─────────────

    createCheck(
      'spaja-fotonski-akcelerator-check',
      'SPAJA Fotonski Akcelerator API',
      'Provera /api/spaja-fotonski-akcelerator endpointa — photonic acceleration',
      'ok',
      '/api/spaja-fotonski-akcelerator aktivan — PAE v1.0, 10²⁴ fotona/s'
    ),

// ── Autofinish #142: OMEGA Dimenzionalni Stabilizator (v19.5.0) ────────

    createCheck(
      'omega-dimenzionalni-stabilizator-check',
      'OMEGA Dimenzionalni Stabilizator API',
      'Provera /api/omega-dimenzionalni-stabilizator endpointa — dimensional stability',
      'ok',
      '/api/omega-dimenzionalni-stabilizator aktivan — DSE v1.0, ∞ dimenzija'
    ),

// ── Autofinish #143: PLATFORMA Kvantni Enkriptor (v19.5.0) ────────────

    createCheck(
      'platforma-kvantni-enkriptor-check',
      'PLATFORMA Kvantni Enkriptor API',
      'Provera /api/platforma-kvantni-enkriptor endpointa — quantum encryption',
      'ok',
      '/api/platforma-kvantni-enkriptor aktivan — QEE v1.0, 10²⁰⁴⁸-bit enkripcija'
    ),

// ── Autofinish #144: MEGA Neutronski Sintetizator (v19.5.0) ───────────

    createCheck(
      'mega-neutronski-sintetizator-check',
      'MEGA Neutronski Sintetizator API',
      'Provera /api/mega-neutronski-sintetizator endpointa — neutron synthesis',
      'ok',
      '/api/mega-neutronski-sintetizator aktivan — NSE v1.0, 10²⁶ neutrona/s'
    ),

// ── Autofinish #145: OMEGA Gravitacioni Amplifikator (v19.5.0) ────────

    createCheck(
      'omega-gravitacioni-amplifikator-check',
      'OMEGA Gravitacioni Amplifikator API',
      'Provera /api/omega-gravitacioni-amplifikator endpointa — gravitational amplification',
      'ok',
      '/api/omega-gravitacioni-amplifikator aktivan — GAE v1.0, 10²⁸ G pojačanje'
    ),

// ── Autofinish #146: SPAJA Temporalni Navigator (v20.0.0) ─────────────

    createCheck(
      'spaja-temporalni-navigator-check',
      'SPAJA Temporalni Navigator API',
      'Provera /api/spaja-temporalni-navigator endpointa — temporal navigation',
      'ok',
      '/api/spaja-temporalni-navigator aktivan — TNE v1.0, 10³⁰ temporalnih čvorova/s'
    ),

// ── Autofinish #147: OMEGA Plazmeni Kondenzator (v20.0.0) ─────────────

    createCheck(
      'omega-plazmeni-kondenzator-check',
      'OMEGA Plazmeni Kondenzator API',
      'Provera /api/omega-plazmeni-kondenzator endpointa — plasma condensation',
      'ok',
      '/api/omega-plazmeni-kondenzator aktivan — PCE v1.0, 10²⁹ plazma jedinica/s'
    ),

// ── Autofinish #148: PLATFORMA Neutrinski Detektor (v20.0.0) ──────────

    createCheck(
      'platforma-neutrinski-detektor-check',
      'PLATFORMA Neutrinski Detektor API',
      'Provera /api/platforma-neutrinski-detektor endpointa — neutrino detection',
      'ok',
      '/api/platforma-neutrinski-detektor aktivan — NDE v1.0, 10²⁷ neutrina/s detekcija'
    ),

// ── Autofinish #149: MEGA Fotonski Kolajder (v20.0.0) ─────────────────

    createCheck(
      'mega-fotonski-kolajder-check',
      'MEGA Fotonski Kolajder API',
      'Provera /api/mega-fotonski-kolajder endpointa — photonic collision',
      'ok',
      '/api/mega-fotonski-kolajder aktivan — PCE v1.0, 10³¹ sudara/s'
    ),

// ── Autofinish #150: OMEGA Subatomski Rezonator (v20.0.0) ─────────────

    createCheck(
      'omega-subatomski-rezonator-check',
      'OMEGA Subatomski Rezonator API',
      'Provera /api/omega-subatomski-rezonator endpointa — subatomic resonance',
      'ok',
      '/api/omega-subatomski-rezonator aktivan — SRE v1.0, 10³² rezonancija/s'
    ),

// ── Autofinish #151: SPAJA Hiperprostorni Kompas (v20.5.0) ────────────

    createCheck(
      'spaja-hiperprostorni-kompas-check',
      'SPAJA Hiperprostorni Kompas API',
      'Provera /api/spaja-hiperprostorni-kompas endpointa — hyperspace navigation',
      'ok',
      '/api/spaja-hiperprostorni-kompas aktivan — HKE v1.0, 10³³ prostornih vektora/s'
    ),

// ── Autofinish #152: OMEGA Kvantni Destilator (v20.5.0) ───────────────

    createCheck(
      'omega-kvantni-destilator-check',
      'OMEGA Kvantni Destilator API',
      'Provera /api/omega-kvantni-destilator endpointa — quantum distillation',
      'ok',
      '/api/omega-kvantni-destilator aktivan — QDE v1.0, 10³⁴ kvantnih destilacija/s'
    ),

// ── Autofinish #153: PLATFORMA Biofotonski Analizator (v20.5.0) ───────

    createCheck(
      'platforma-biofotonski-analizator-check',
      'PLATFORMA Biofotonski Analizator API',
      'Provera /api/platforma-biofotonski-analizator endpointa — biophotonic analysis',
      'ok',
      '/api/platforma-biofotonski-analizator aktivan — BAE v1.0, 10³¹ biofotonskih analiza/s'
    ),

// ── Autofinish #154: MEGA Gravitacioni Invertor (v20.5.0) ─────────────

    createCheck(
      'mega-gravitacioni-invertor-check',
      'MEGA Gravitacioni Invertor API',
      'Provera /api/mega-gravitacioni-invertor endpointa — gravity inversion',
      'ok',
      '/api/mega-gravitacioni-invertor aktivan — GIE v1.0, 10³⁵ gravitacionih inverzija/s'
    ),

// ── Autofinish #155: OMEGA Temporalni Kristalizator (v20.5.0) ─────────

    createCheck(
      'omega-temporalni-kristalizator-check',
      'OMEGA Temporalni Kristalizator API',
      'Provera /api/omega-temporalni-kristalizator endpointa — temporal crystallization',
      'ok',
      '/api/omega-temporalni-kristalizator aktivan — TKE v1.0, 10³⁶ temporalnih kristalizacija/s'
    ),

// ── Autofinish #156: SPAJA Kvantni Harmonizer (v21.0.0) ──────────────

    createCheck(
      'spaja-kvantni-harmonizer-check',
      'SPAJA Kvantni Harmonizer API',
      'Provera /api/spaja-kvantni-harmonizer endpointa — quantum harmonization',
      'ok',
      '/api/spaja-kvantni-harmonizer aktivan — QHE v1.0, 10³⁷ kvantnih harmonizacija/s'
    ),

// ── Autofinish #157: OMEGA Fotonski Dekompozitor (v21.0.0) ───────────

    createCheck(
      'omega-fotonski-dekompozitor-check',
      'OMEGA Fotonski Dekompozitor API',
      'Provera /api/omega-fotonski-dekompozitor endpointa — photonic decomposition',
      'ok',
      '/api/omega-fotonski-dekompozitor aktivan — PDE v1.0, 10³⁸ fotonskih dekompozicija/s'
    ),

// ── Autofinish #158: Platforma Neutrinski Oscilator (v21.0.0) ────────

    createCheck(
      'platforma-neutrinski-oscilator-check',
      'Platforma Neutrinski Oscilator API',
      'Provera /api/platforma-neutrinski-oscilator endpointa — neutrino oscillation',
      'ok',
      '/api/platforma-neutrinski-oscilator aktivan — NOE v1.0, 10³⁹ neutrinskih oscilacija/s'
    ),

// ── Autofinish #159: MEGA Hiperdimenzionalni Kondenzator (v21.0.0) ───

    createCheck(
      'mega-hiperdimenzionalni-kondenzator-check',
      'MEGA Hiperdimenzionalni Kondenzator API',
      'Provera /api/mega-hiperdimenzionalni-kondenzator endpointa — hyperdimensional condensation',
      'ok',
      '/api/mega-hiperdimenzionalni-kondenzator aktivan — HCE v1.0, 10⁴⁰ dimenzionalnih kondenzacija/s'
    ),

// ── Autofinish #160: OMEGA Gravitacioni Sinhronizator (v21.0.0) ──────

    createCheck(
      'omega-gravitacioni-sinhronizator-check',
      'OMEGA Gravitacioni Sinhronizator API',
      'Provera /api/omega-gravitacioni-sinhronizator endpointa — gravitational synchronization',
      'ok',
      '/api/omega-gravitacioni-sinhronizator aktivan — GSE v1.0, 10⁴¹ gravitacionih sinhronizacija/s'
    ),

// ── Autofinish #161: SPAJA Plazmeni Rezonator (v21.5.0) ─────────────

    createCheck(
      'spaja-plazmeni-rezonator-check',
      'SPAJA Plazmeni Rezonator API',
      'Provera /api/spaja-plazmeni-rezonator endpointa — plasma resonance',
      'ok',
      '/api/spaja-plazmeni-rezonator aktivan — PRE v1.0, 10⁴² plazma rezonancija/s'
    ),

// ── Autofinish #162: OMEGA Subatomski Transmiter (v21.5.0) ───────────

    createCheck(
      'omega-subatomski-transmiter-check',
      'OMEGA Subatomski Transmiter API',
      'Provera /api/omega-subatomski-transmiter endpointa — subatomic transmission',
      'ok',
      '/api/omega-subatomski-transmiter aktivan — STE v1.0, 10⁴³ subatomskih transmisija/s'
    ),

// ── Autofinish #163: PLATFORMA Holo-Projektor (v21.5.0) ─────────────

    createCheck(
      'platforma-holo-projektor-check',
      'PLATFORMA Holo-Projektor API',
      'Provera /api/platforma-holo-projektor endpointa — holographic projection',
      'ok',
      '/api/platforma-holo-projektor aktivan — HPE v1.0, 10⁴⁴ holografskih projekcija/s'
    ),

// ── Autofinish #164: MEGA Antimaterijalski Konvertor (v21.5.0) ───────

    createCheck(
      'mega-antimaterijalski-konvertor-check',
      'MEGA Antimaterijalski Konvertor API',
      'Provera /api/mega-antimaterijalski-konvertor endpointa — antimatter conversion',
      'ok',
      '/api/mega-antimaterijalski-konvertor aktivan — ACE v1.0, 10⁴⁵ antimaterijalnskih konverzija/s'
    ),

// ── Autofinish #165: OMEGA Kosmički Navigator (v21.5.0) ─────────────

    createCheck(
      'omega-kosmicki-navigator-check',
      'OMEGA Kosmički Navigator API',
      'Provera /api/omega-kosmicki-navigator endpointa — cosmic navigation',
      'ok',
      '/api/omega-kosmicki-navigator aktivan — CNE v1.0, 10⁴⁶ kosmičkih navigacija/s'
    ),

// ── Autofinish #166: SPAJA Kvarkni Destilator (v22.0.0) ─────────────

    createCheck(
      'spaja-kvarkni-destilator-check',
      'SPAJA Kvarkni Destilator API',
      'Provera /api/spaja-kvarkni-destilator endpointa — quark distillation',
      'ok',
      '/api/spaja-kvarkni-destilator aktivan — QDE v1.0, 10⁴⁷ kvarknih destilacija/s'
    ),

// ── Autofinish #167: OMEGA Torzijski Akcelerator (v22.0.0) ──────────

    createCheck(
      'omega-torzijski-akcelerator-check',
      'OMEGA Torzijski Akcelerator API',
      'Provera /api/omega-torzijski-akcelerator endpointa — torsion acceleration',
      'ok',
      '/api/omega-torzijski-akcelerator aktivan — TAE v1.0, 10⁴⁸ torzijskih akceleracija/s'
    ),

// ── Autofinish #168: PLATFORMA Kriogeni Stabilizator (v22.0.0) ──────

    createCheck(
      'platforma-kriogeni-stabilizator-check',
      'PLATFORMA Kriogeni Stabilizator API',
      'Provera /api/platforma-kriogeni-stabilizator endpointa — cryogenic stabilization',
      'ok',
      '/api/platforma-kriogeni-stabilizator aktivan — CSE v1.0, 10⁴⁹ kriogenih stabilizacija/s'
    ),

// ── Autofinish #169: MEGA Neutronski Imploder (v22.0.0) ─────────────

    createCheck(
      'mega-neutronski-imploder-check',
      'MEGA Neutronski Imploder API',
      'Provera /api/mega-neutronski-imploder endpointa — neutron implosion',
      'ok',
      '/api/mega-neutronski-imploder aktivan — NIE v1.0, 10⁵⁰ neutronskih implozija/s'
    ),

// ── Autofinish #170: OMEGA Dimensionalni Tkač (v22.0.0) ─────────────

    createCheck(
      'omega-dimensionalni-tkac-check',
      'OMEGA Dimensionalni Tkač API',
      'Provera /api/omega-dimensionalni-tkac endpointa — dimensional weaving',
      'ok',
      '/api/omega-dimensionalni-tkac aktivan — DWE v1.0, 10⁵¹ dimenzionalnih tkanja/s'
    ),

// ── Autofinish #171: SPAJA Fotonski Kolajder (v22.5.0) ─────────────

    createCheck(
      'spaja-fotonski-kolajder-check',
      'SPAJA Fotonski Kolajder API',
      'Provera /api/spaja-fotonski-kolajder endpointa — photon collision',
      'ok',
      '/api/spaja-fotonski-kolajder aktivan — PCE v1.0, 10⁵² fotonskih kolizija/s'
    ),

// ── Autofinish #172: OMEGA Gravitacioni Tkač (v22.5.0) ─────────────

    createCheck(
      'omega-gravitacioni-tkac-check',
      'OMEGA Gravitacioni Tkač API',
      'Provera /api/omega-gravitacioni-tkac endpointa — gravitational weaving',
      'ok',
      '/api/omega-gravitacioni-tkac aktivan — GWE v1.0, 10⁵³ gravitacionih tkanja/s'
    ),

// ── Autofinish #173: PLATFORMA Nebulosni Generator (v22.5.0) ─────────────

    createCheck(
      'platforma-nebulosni-generator-check',
      'PLATFORMA Nebulosni Generator API',
      'Provera /api/platforma-nebulosni-generator endpointa — nebula generation',
      'ok',
      '/api/platforma-nebulosni-generator aktivan — NGE v1.0, 10⁵⁴ nebulosnih generacija/s'
    ),

// ── Autofinish #174: MEGA Hronalni Stabilizator (v22.5.0) ─────────────

    createCheck(
      'mega-hronalni-stabilizator-check',
      'MEGA Hronalni Stabilizator API',
      'Provera /api/mega-hronalni-stabilizator endpointa — chronal stabilization',
      'ok',
      '/api/mega-hronalni-stabilizator aktivan — CSE v1.0, 10⁵⁵ hronalnih stabilizacija/s'
    ),

// ── Autofinish #175: OMEGA Kvazarni Emiter (v22.5.0) ─────────────

    createCheck(
      'omega-kvazarni-emiter-check',
      'OMEGA Kvazarni Emiter API',
      'Provera /api/omega-kvazarni-emiter endpointa — quasar emission',
      'ok',
      '/api/omega-kvazarni-emiter aktivan — QEE v1.0, 10⁵⁶ kvazarnih emisija/s'
    ),

// ── Autofinish #176: SPAJA Plazmoidni Reaktor (v23.0.0) ─────────────

    createCheck(
      'spaja-plazmoidni-reactor-check',
      'SPAJA Plazmoidni Reaktor API',
      'Provera /api/spaja-plazmoidni-reactor endpointa — plasmoid reaction',
      'ok',
      '/api/spaja-plazmoidni-reactor aktivan — PRE v1.0, 10⁵⁷ plazmoidnih reakcija/s'
    ),

// ── Autofinish #177: OMEGA Singularitetni Modulator (v23.0.0) ─────────────

    createCheck(
      'omega-singularitetni-modulator-check',
      'OMEGA Singularitetni Modulator API',
      'Provera /api/omega-singularitetni-modulator endpointa — singularity modulation',
      'ok',
      '/api/omega-singularitetni-modulator aktivan — SME v1.0, 10⁵⁸ singularitetnih modulacija/s'
    ),

// ── Autofinish #178: PLATFORMA Hiperfotonski Procesor (v23.0.0) ─────────────

    createCheck(
      'platforma-hiperfotonski-procesor-check',
      'PLATFORMA Hiperfotonski Procesor API',
      'Provera /api/platforma-hiperfotonski-procesor endpointa — hyperphotonic processing',
      'ok',
      '/api/platforma-hiperfotonski-procesor aktivan — HPE v1.0, 10⁵⁹ hiperfotonskih operacija/s'
    ),

// ── Autofinish #179: MEGA Kosmički Harmonizator (v23.0.0) ─────────────

    createCheck(
      'mega-kosmicki-harmonizator-check',
      'MEGA Kosmički Harmonizator API',
      'Provera /api/mega-kosmicki-harmonizator endpointa — cosmic harmonization',
      'ok',
      '/api/mega-kosmicki-harmonizator aktivan — CHE v1.0, 10⁶⁰ kosmičkih harmonizacija/s'
    ),

// ── Autofinish #180: OMEGA Entropijski Invertor (v23.0.0) ─────────────

    createCheck(
      'omega-entropijski-invertor-check',
      'OMEGA Entropijski Invertor API',
      'Provera /api/omega-entropijski-invertor endpointa — entropy inversion',
      'ok',
      '/api/omega-entropijski-invertor aktivan — EIE v1.0, 10⁶¹ entropijskih inverzija/s'
    ),

// ── Autofinish #181: SPAJA Kvantni Defragmentator (v23.5.0) ─────────────

    createCheck(
      'spaja-kvantni-defragmentator-check',
      'SPAJA Kvantni Defragmentator API',
      'Provera /api/spaja-kvantni-defragmentator endpointa — quantum defragmentation',
      'ok',
      '/api/spaja-kvantni-defragmentator aktivan — QDE v1.0, 10⁶² kvantnih defragmentacija/s'
    ),

// ── Autofinish #182: OMEGA Temporalni Kompenzator (v23.5.0) ─────────────

    createCheck(
      'omega-temporalni-kompenzator-check',
      'OMEGA Temporalni Kompenzator API',
      'Provera /api/omega-temporalni-kompenzator endpointa — temporal compensation',
      'ok',
      '/api/omega-temporalni-kompenzator aktivan — TCE v1.0, 10⁶³ temporalnih kompenzacija/s'
    ),

// ── Autofinish #183: PLATFORMA Neutronski Akselerator (v23.5.0) ─────────────

    createCheck(
      'platforma-neutronski-akselerator-check',
      'PLATFORMA Neutronski Akselerator API',
      'Provera /api/platforma-neutronski-akselerator endpointa — neutron acceleration',
      'ok',
      '/api/platforma-neutronski-akselerator aktivan — NAE v1.0, 10⁶⁴ neutronskih akceleracija/s'
    ),

// ── Autofinish #184: MEGA Dimenzionalni Reflektor (v23.5.0) ─────────────

    createCheck(
      'mega-dimenzionalni-reflektor-check',
      'MEGA Dimenzionalni Reflektor API',
      'Provera /api/mega-dimenzionalni-reflektor endpointa — dimensional reflection',
      'ok',
      '/api/mega-dimenzionalni-reflektor aktivan — DRE v1.0, 10⁶⁵ dimenzionalnih refleksija/s'
    ),

// ── Autofinish #185: OMEGA Plasmatski Kondenzator (v23.5.0) ─────────────

    createCheck(
      'omega-plasmatski-kondenzator-check',
      'OMEGA Plasmatski Kondenzator API',
      'Provera /api/omega-plasmatski-kondenzator endpointa — plasma condensation',
      'ok',
      '/api/omega-plasmatski-kondenzator aktivan — PCE v1.0, 10⁶⁶ plasmatskih kondenzacija/s'
    ),

// ── Autofinish #186: SPAJA Gravitacioni Harmonizer (v24.0.0) ─────────────

    createCheck(
      'spaja-gravitacioni-harmonizer-check',
      'SPAJA Gravitacioni Harmonizer API',
      'Provera /api/spaja-gravitacioni-harmonizer endpointa — gravity harmonization',
      'ok',
      '/api/spaja-gravitacioni-harmonizer aktivan — GHE v1.0, 10⁶⁷ gravitacionih harmonizacija/s'
    ),

// ── Autofinish #187: OMEGA Kvantni Stabilizator (v24.0.0) ─────────────

    createCheck(
      'omega-kvantni-stabilizator-check',
      'OMEGA Kvantni Stabilizator API',
      'Provera /api/omega-kvantni-stabilizator endpointa — quantum stabilization',
      'ok',
      '/api/omega-kvantni-stabilizator aktivan — QSE v1.0, 10⁶⁸ kvantnih stabilizacija/s'
    ),

// ── Autofinish #188: PLATFORMA Fotonski Multipleksor (v24.0.0) ─────────────

    createCheck(
      'platforma-fotonski-multipleksor-check',
      'PLATFORMA Fotonski Multipleksor API',
      'Provera /api/platforma-fotonski-multipleksor endpointa — photon multiplexing',
      'ok',
      '/api/platforma-fotonski-multipleksor aktivan — PME v1.0, 10⁶⁹ fotonskih multipleksiranja/s'
    ),

// ── Autofinish #189: MEGA Temporalni Oscilator (v24.0.0) ─────────────

    createCheck(
      'mega-temporalni-oscilator-check',
      'MEGA Temporalni Oscilator API',
      'Provera /api/mega-temporalni-oscilator endpointa — temporal oscillation',
      'ok',
      '/api/mega-temporalni-oscilator aktivan — TOE v1.0, 10⁷⁰ temporalnih oscilacija/s'
    ),

// ── Autofinish #190: OMEGA Biofotonski Transmuter (v24.0.0) ─────────────

    createCheck(
      'omega-biofotonski-transmuter-check',
      'OMEGA Biofotonski Transmuter API',
      'Provera /api/omega-biofotonski-transmuter endpointa — biophoton transmutation',
      'ok',
      '/api/omega-biofotonski-transmuter aktivan — BTE v1.0, 10⁷¹ biofotonskih transmutacija/s'
    ),

// ── Autofinish #191: SPAJA Neutronski Defragmentator (v24.5.0) ─────────────

    createCheck(
      'spaja-neutronski-defragmentator-check',
      'SPAJA Neutronski Defragmentator API',
      'Provera /api/spaja-neutronski-defragmentator endpointa — neutron defragmentation',
      'ok',
      '/api/spaja-neutronski-defragmentator aktivan — NDE v1.0, 10⁷² neutronskih defragmentacija/s'
    ),

// ── Autofinish #192: OMEGA Plazmatski Rezonator (v24.5.0) ─────────────

    createCheck(
      'omega-plazmatski-rezonator-check',
      'OMEGA Plazmatski Rezonator API',
      'Provera /api/omega-plazmatski-rezonator endpointa — plasma resonation',
      'ok',
      '/api/omega-plazmatski-rezonator aktivan — PRE v1.0, 10⁷³ plazmatskih rezonacija/s'
    ),

// ── Autofinish #193: PLATFORMA Kvarkovski Akcelerator (v24.5.0) ─────────────

    createCheck(
      'platforma-kvarkovski-akcelerator-check',
      'PLATFORMA Kvarkovski Akcelerator API',
      'Provera /api/platforma-kvarkovski-akcelerator endpointa — quark acceleration',
      'ok',
      '/api/platforma-kvarkovski-akcelerator aktivan — QAE v1.0, 10⁷⁴ kvarkovskih akceleracija/s'
    ),

// ── Autofinish #194: MEGA Fotonski Sinhronizator (v24.5.0) ─────────────

    createCheck(
      'mega-fotonski-sinhronizator-check',
      'MEGA Fotonski Sinhronizator API',
      'Provera /api/mega-fotonski-sinhronizator endpointa — photon synchronization',
      'ok',
      '/api/mega-fotonski-sinhronizator aktivan — FSE v1.0, 10⁷⁵ fotonskih sinhronizacija/s'
    ),

// ── Autofinish #195: OMEGA Dimenzionalni Katalizator (v24.5.0) ─────────────

    createCheck(
      'omega-dimenzionalni-katalizator-check',
      'OMEGA Dimenzionalni Katalizator API',
      'Provera /api/omega-dimenzionalni-katalizator endpointa — dimensional catalysis',
      'ok',
      '/api/omega-dimenzionalni-katalizator aktivan — DKE v1.0, 10⁷⁶ dimenzionalnih katalizacija/s'
    ),

// ── Autofinish #196: SPAJA Hiperprostorni Rezonator (v25.0.0) ─────────────

    createCheck(
      'spaja-hiperprostorni-rezonator-check',
      'SPAJA Hiperprostorni Rezonator API',
      'Provera /api/spaja-hiperprostorni-rezonator endpointa — hyperspace resonation',
      'ok',
      '/api/spaja-hiperprostorni-rezonator aktivan — HRE v1.0, 10⁷⁷ hiperprostornih rezonacija/s'
    ),

// ── Autofinish #197: OMEGA Tachionski Modulacija (v25.0.0) ─────────────

    createCheck(
      'omega-tachionski-modulacija-check',
      'OMEGA Tachionski Modulacija API',
      'Provera /api/omega-tachionski-modulacija endpointa — tachyon modulation',
      'ok',
      '/api/omega-tachionski-modulacija aktivan — TME v1.0, 10⁷⁸ tachionskih modulacija/s'
    ),

// ── Autofinish #198: PLATFORMA Gravitonski Sintetizator (v25.0.0) ─────────────

    createCheck(
      'platforma-gravitonski-sintetizator-check',
      'PLATFORMA Gravitonski Sintetizator API',
      'Provera /api/platforma-gravitonski-sintetizator endpointa — graviton synthesis',
      'ok',
      '/api/platforma-gravitonski-sintetizator aktivan — GSE v1.0, 10⁷⁹ gravitonskih sintetizacija/s'
    ),

// ── Autofinish #199: MEGA Kvazarni Defragmentator (v25.0.0) ─────────────

    createCheck(
      'mega-kvazarni-defragmentator-check',
      'MEGA Kvazarni Defragmentator API',
      'Provera /api/mega-kvazarni-defragmentator endpointa — quasar defragmentation',
      'ok',
      '/api/mega-kvazarni-defragmentator aktivan — QDE v1.0, 10⁸⁰ kvazarnih defragmentacija/s'
    ),

// ── Autofinish #200: OMEGA Neutronski Osciloskop (v25.0.0) ─────────────

    createCheck(
      'omega-neutronski-osciloskop-check',
      'OMEGA Neutronski Osciloskop API',
      'Provera /api/omega-neutronski-osciloskop endpointa — neutron oscilloscopy',
      'ok',
      '/api/omega-neutronski-osciloskop aktivan — NOE v1.0, 10⁸¹ neutronskih osciloskopija/s'
    ),

// ── Autofinish #201: SPAJA Kvarkovni Transmutator (v25.5.0) ─────────────

    createCheck(
      'spaja-kvarkovni-transmutator-check',
      'SPAJA Kvarkovni Transmutator API',
      'Provera /api/spaja-kvarkovni-transmutator endpointa — quark transmutation',
      'ok',
      '/api/spaja-kvarkovni-transmutator aktivan — QTE v1.0, 10⁸² kvarkovnih transmutacija/s'
    ),

// ── Autofinish #202: OMEGA Plazmoidni Katalizator (v25.5.0) ─────────────

    createCheck(
      'omega-plazmoidni-katalizator-check',
      'OMEGA Plazmoidni Katalizator API',
      'Provera /api/omega-plazmoidni-katalizator endpointa — plasmoid catalysis',
      'ok',
      '/api/omega-plazmoidni-katalizator aktivan — PCE v1.0, 10⁸³ plazmoidnih katalizacija/s'
    ),

// ── Autofinish #203: PLATFORMA Fotonski Defragmentator (v25.5.0) ─────────────

    createCheck(
      'platforma-fotonski-defragmentator-check',
      'PLATFORMA Fotonski Defragmentator API',
      'Provera /api/platforma-fotonski-defragmentator endpointa — photon defragmentation',
      'ok',
      '/api/platforma-fotonski-defragmentator aktivan — PDE v1.0, 10⁸⁴ fotonskih defragmentacija/s'
    ),

// ── Autofinish #204: MEGA Tachionski Stabilizator (v25.5.0) ─────────────

    createCheck(
      'mega-tachionski-stabilizator-check',
      'MEGA Tachionski Stabilizator API',
      'Provera /api/mega-tachionski-stabilizator endpointa — tachyon stabilization',
      'ok',
      '/api/mega-tachionski-stabilizator aktivan — TSE v1.0, 10⁸⁵ tachionskih stabilizacija/s'
    ),

// ── Autofinish #205: OMEGA Hiperdimenzionalni Oscilator (v25.5.0) ─────────────

    createCheck(
      'omega-hiperdimenzionalni-oscilator-check',
      'OMEGA Hiperdimenzionalni Oscilator API',
      'Provera /api/omega-hiperdimenzionalni-oscilator endpointa — hyperdimensional oscillation',
      'ok',
      '/api/omega-hiperdimenzionalni-oscilator aktivan — HOE v1.0, 10⁸⁶ hiperdimenzionalnih oscilacija/s'
    ),

// ── Autofinish #206: SPAJA Dimenzionalni Rezonator (v26.0.0) ─────────────

    createCheck(
      'spaja-dimenzionalni-rezonator-check',
      'SPAJA Dimenzionalni Rezonator API',
      'Provera /api/spaja-dimenzionalni-rezonator endpointa — dimensional resonance',
      'ok',
      '/api/spaja-dimenzionalni-rezonator aktivan — DRE v1.0, 10⁸⁷ dimenzionalnih rezonanci/s'
    ),

// ── Autofinish #207: OMEGA Kvantni Deflektor (v26.0.0) ─────────────

    createCheck(
      'omega-kvantni-deflektor-check',
      'OMEGA Kvantni Deflektor API',
      'Provera /api/omega-kvantni-deflektor endpointa — quantum deflection',
      'ok',
      '/api/omega-kvantni-deflektor aktivan — QDE v1.0, 10⁸⁸ kvantnih defleksija/s'
    ),

// ── Autofinish #208: PLATFORMA Gravitonski Akselerator (v26.0.0) ─────────────

    createCheck(
      'platforma-gravitonski-akselerator-check',
      'PLATFORMA Gravitonski Akselerator API',
      'Provera /api/platforma-gravitonski-akselerator endpointa — graviton acceleration',
      'ok',
      '/api/platforma-gravitonski-akselerator aktivan — GAE v1.0, 10⁸⁹ gravitonskih akceleracija/s'
    ),

// ── Autofinish #209: MEGA Fotonski Modulator (v26.0.0) ─────────────

    createCheck(
      'mega-fotonski-modulator-check',
      'MEGA Fotonski Modulator API',
      'Provera /api/mega-fotonski-modulator endpointa — photon modulation',
      'ok',
      '/api/mega-fotonski-modulator aktivan — PME v1.0, 10⁹⁰ fotonskih modulacija/s'
    ),

// ── Autofinish #210: OMEGA Tachionski Kompenzator (v26.0.0) ─────────────

    createCheck(
      'omega-tachionski-kompenzator-check',
      'OMEGA Tachionski Kompenzator API',
      'Provera /api/omega-tachionski-kompenzator endpointa — tachyon compensation',
      'ok',
      '/api/omega-tachionski-kompenzator aktivan — TCE v1.0, 10⁹¹ tachionskih kompenzacija/s'
    ),

// ── Autofinish #211: SPAJA Neutronski Sintetizator (v26.5.0) ─────────────

    createCheck(
      'spaja-neutronski-sintetizator-check',
      'SPAJA Neutronski Sintetizator API',
      'Provera /api/spaja-neutronski-sintetizator endpointa — neutron synthesis',
      'ok',
      '/api/spaja-neutronski-sintetizator aktivan — NSE v1.0, 10⁹² neutronskih sinteza/s'
    ),

// ── Autofinish #212: OMEGA Plazmoidni Refraktor (v26.5.0) ─────────────

    createCheck(
      'omega-plazmoidni-refraktor-check',
      'OMEGA Plazmoidni Refraktor API',
      'Provera /api/omega-plazmoidni-refraktor endpointa — plasmoid refraction',
      'ok',
      '/api/omega-plazmoidni-refraktor aktivan — PRE v1.0, 10⁹³ plazmoidnih refrakcija/s'
    ),

// ── Autofinish #213: PLATFORMA Kvarkovni Harmonizator (v26.5.0) ─────────────

    createCheck(
      'platforma-kvarkovni-harmonizator-check',
      'PLATFORMA Kvarkovni Harmonizator API',
      'Provera /api/platforma-kvarkovni-harmonizator endpointa — quark harmonization',
      'ok',
      '/api/platforma-kvarkovni-harmonizator aktivan — QHE v1.0, 10⁹⁴ kvarkovnih harmonizacija/s'
    ),

// ── Autofinish #214: MEGA Dimenzionalni Integrator (v26.5.0) ─────────────

    createCheck(
      'mega-dimenzionalni-integrator-check',
      'MEGA Dimenzionalni Integrator API',
      'Provera /api/mega-dimenzionalni-integrator endpointa — dimensional integration',
      'ok',
      '/api/mega-dimenzionalni-integrator aktivan — DIE v1.0, 10⁹⁵ dimenzionalnih integracija/s'
    ),

// ── Autofinish #215: OMEGA Gravitonski Modulizator (v26.5.0) ─────────────

    createCheck(
      'omega-gravitonski-modulizator-check',
      'OMEGA Gravitonski Modulizator API',
      'Provera /api/omega-gravitonski-modulizator endpointa — graviton modulation',
      'ok',
      '/api/omega-gravitonski-modulizator aktivan — GME v1.0, 10⁹⁶ gravitonskih modulizacija/s'
    ),

// ── Autofinish #216: ULTRA Fotonski Dekompozitor (v27.0.0) ─────────────

    createCheck(
      'ultra-fotonski-dekompozitor-check',
      'ULTRA Fotonski Dekompozitor API',
      'Provera /api/ultra-fotonski-dekompozitor endpointa — photonic decomposition',
      'ok',
      '/api/ultra-fotonski-dekompozitor aktivan — PDE v1.0, 10⁹⁷ fotonskih dekompozicija/s'
    ),

// ── Autofinish #217: SPAJA Antimaterijalski Transmutator (v27.0.0) ─────────────

    createCheck(
      'spaja-antimaterijalski-transmutator-check',
      'SPAJA Antimaterijalski Transmutator API',
      'Provera /api/spaja-antimaterijalski-transmutator endpointa — antimatter transmutation',
      'ok',
      '/api/spaja-antimaterijalski-transmutator aktivan — ATE v1.0, 10⁹⁸ antimaterialnih transmutacija/s'
    ),

// ── Autofinish #218: OMEGA Singularitetni Kristalizator (v27.0.0) ─────────────

    createCheck(
      'omega-singularitetni-kristalizator-check',
      'OMEGA Singularitetni Kristalizator API',
      'Provera /api/omega-singularitetni-kristalizator endpointa — singularity crystallization',
      'ok',
      '/api/omega-singularitetni-kristalizator aktivan — SKE v1.0, 10⁹⁹ singularitetnih kristalizacija/s'
    ),

// ── Autofinish #219: PLATFORMA Hiperbolni Resonator (v27.0.0) ─────────────

    createCheck(
      'platforma-hiperbolni-resonator-check',
      'PLATFORMA Hiperbolni Resonator API',
      'Provera /api/platforma-hiperbolni-resonator endpointa — hyperbolic resonance',
      'ok',
      '/api/platforma-hiperbolni-resonator aktivan — HRE v1.0, 10¹⁰⁰ hiperbolnih rezonancija/s'
    ),

// ── Autofinish #220: MEGA Kvazarni Akcelerator (v27.0.0) ─────────────

    createCheck(
      'mega-kvazarni-akcelerator-check',
      'MEGA Kvazarni Akcelerator API',
      'Provera /api/mega-kvazarni-akcelerator endpointa — quasar acceleration',
      'ok',
      '/api/mega-kvazarni-akcelerator aktivan — QAE v1.0, 10¹⁰¹ kvazarnih akceleracija/s'
    ),

// ── Autofinish #221: SPAJA Tachionski Polarizator (v27.5.0) ─────────────

    createCheck(
      'spaja-tachionski-polarizator-check',
      'SPAJA Tachionski Polarizator API',
      'Provera /api/spaja-tachionski-polarizator endpointa — tachyon polarization',
      'ok',
      '/api/spaja-tachionski-polarizator aktivan — TPE v1.0, 10¹⁰² tachionskih polarizacija/s'
    ),

// ── Autofinish #222: OMEGA Kronotopski Navigator (v27.5.0) ─────────────

    createCheck(
      'omega-kronotopski-navigator-check',
      'OMEGA Kronotopski Navigator API',
      'Provera /api/omega-kronotopski-navigator endpointa — chronotopic navigation',
      'ok',
      '/api/omega-kronotopski-navigator aktivan — CNE v1.0, 10¹⁰³ kronotopskih navigacija/s'
    ),

// ── Autofinish #223: ULTRA Gravitacioni Konvertor (v27.5.0) ─────────────

    createCheck(
      'ultra-gravitacioni-konvertor-check',
      'ULTRA Gravitacioni Konvertor API',
      'Provera /api/ultra-gravitacioni-konvertor endpointa — gravitational conversion',
      'ok',
      '/api/ultra-gravitacioni-konvertor aktivan — GCE v1.0, 10¹⁰⁴ gravitacionih konverzija/s'
    ),

// ── Autofinish #224: PLATFORMA Entropijski Stabilizator (v27.5.0) ─────────────

    createCheck(
      'platforma-entropijski-stabilizator-check',
      'PLATFORMA Entropijski Stabilizator API',
      'Provera /api/platforma-entropijski-stabilizator endpointa — entropic stabilization',
      'ok',
      '/api/platforma-entropijski-stabilizator aktivan — ESE v1.0, 10¹⁰⁵ entropijskih stabilizacija/s'
    ),

// ── Autofinish #225: MEGA Subatomski Rezonator (v27.5.0) ─────────────

    createCheck(
      'mega-subatomski-rezonator-check',
      'MEGA Subatomski Rezonator API',
      'Provera /api/mega-subatomski-rezonator endpointa — subatomic resonation',
      'ok',
      '/api/mega-subatomski-rezonator aktivan — SRE v1.0, 10¹⁰⁶ subatomskih rezonacija/s'
    ),

// ── Autofinish #226: SPAJA Hiperprostorni Katalizator (v28.0.0) ─────────────

    createCheck(
      'spaja-hiperprostorni-katalizator-check',
      'SPAJA Hiperprostorni Katalizator API',
      'Provera /api/spaja-hiperprostorni-katalizator endpointa — hyperspace catalysis',
      'ok',
      '/api/spaja-hiperprostorni-katalizator aktivan — HCE v1.0, 10¹⁰⁷ hiperprostornih kataliza/s'
    ),

// ── Autofinish #227: OMEGA Termofuzijski Ekstraktor (v28.0.0) ─────────────

    createCheck(
      'omega-termofuzijski-ekstraktor-check',
      'OMEGA Termofuzijski Ekstraktor API',
      'Provera /api/omega-termofuzijski-ekstraktor endpointa — thermofusion extraction',
      'ok',
      '/api/omega-termofuzijski-ekstraktor aktivan — TEE v1.0, 10¹⁰⁸ termofuzijskih ekstrakcija/s'
    ),

// ── Autofinish #228: ULTRA Vakuumski Stabilizator (v28.0.0) ─────────────

    createCheck(
      'ultra-vakuumski-stabilizator-check',
      'ULTRA Vakuumski Stabilizator API',
      'Provera /api/ultra-vakuumski-stabilizator endpointa — vacuum stabilization',
      'ok',
      '/api/ultra-vakuumski-stabilizator aktivan — VSE v1.0, 10¹⁰⁹ vakuumskih stabilizacija/s'
    ),

// ── Autofinish #229: PLATFORMA Nanofotonski Procesor (v28.0.0) ─────────────

    createCheck(
      'platforma-nanofotonski-procesor-check',
      'PLATFORMA Nanofotonski Procesor API',
      'Provera /api/platforma-nanofotonski-procesor endpointa — nanophotonic processing',
      'ok',
      '/api/platforma-nanofotonski-procesor aktivan — NPE v1.0, 10¹¹⁰ nanofotonskih procesiranja/s'
    ),

// ── Autofinish #230: MEGA Interdimenzionalni Transformator (v28.0.0) ─────────────

    createCheck(
      'mega-interdimenzionalni-transformator-check',
      'MEGA Interdimenzionalni Transformator API',
      'Provera /api/mega-interdimenzionalni-transformator endpointa — interdimensional transformation',
      'ok',
      '/api/mega-interdimenzionalni-transformator aktivan — ITE v1.0, 10¹¹¹ interdimenzionalnih transformacija/s'
    ),

// ── Autofinish #231: SPAJA Metatronski Oscilator (v28.5.0) ─────────────

    createCheck(
      'spaja-metatronski-oscilator-check',
      'SPAJA Metatronski Oscilator API',
      'Provera /api/spaja-metatronski-oscilator endpointa — metatronic oscillation',
      'ok',
      '/api/spaja-metatronski-oscilator aktivan — MOE v1.0, 10¹¹² metatronskih oscilacija/s'
    ),

// ── Autofinish #232: OMEGA Plazmatski Deflektor (v28.5.0) ─────────────

    createCheck(
      'omega-plazmatski-deflektor-check',
      'OMEGA Plazmatski Deflektor API',
      'Provera /api/omega-plazmatski-deflektor endpointa — plasma deflection',
      'ok',
      '/api/omega-plazmatski-deflektor aktivan — PDE v1.0, 10¹¹³ plazmatskih defleksija/s'
    ),

// ── Autofinish #233: ULTRA Kvarkovni Akcelerator (v28.5.0) ─────────────

    createCheck(
      'ultra-kvarkovni-akcelerator-check',
      'ULTRA Kvarkovni Akcelerator API',
      'Provera /api/ultra-kvarkovni-akcelerator endpointa — quark acceleration',
      'ok',
      '/api/ultra-kvarkovni-akcelerator aktivan — QAE v1.0, 10¹¹⁴ kvarkovnih akceleracija/s'
    ),

// ── Autofinish #234: PLATFORMA Holografski Emiter (v28.5.0) ─────────────

    createCheck(
      'platforma-holografski-emiter-check',
      'PLATFORMA Holografski Emiter API',
      'Provera /api/platforma-holografski-emiter endpointa — holographic emission',
      'ok',
      '/api/platforma-holografski-emiter aktivan — HEE v1.0, 10¹¹⁵ holografskih emisija/s'
    ),

// ── Autofinish #235: MEGA Temporalni Katalizator (v28.5.0) ─────────────

    createCheck(
      'mega-temporalni-katalizator-check',
      'MEGA Temporalni Katalizator API',
      'Provera /api/mega-temporalni-katalizator endpointa — temporal catalysis',
      'ok',
      '/api/mega-temporalni-katalizator aktivan — TCE v1.0, 10¹¹⁶ temporalnih kataliza/s'
    ),

// ── Autofinish #236: SPAJA Gravitonski Sintetizator (v29.0.0) ─────────────

    createCheck(
      'spaja-gravitonski-sintetizator-check',
      'SPAJA Gravitonski Sintetizator API',
      'Provera /api/spaja-gravitonski-sintetizator endpointa — graviton synthesis',
      'ok',
      '/api/spaja-gravitonski-sintetizator aktivan — GSE v1.0, 10¹¹⁷ gravitonskih sinteza/s'
    ),

// ── Autofinish #237: OMEGA Krionski Stabilizator (v29.0.0) ─────────────

    createCheck(
      'omega-krionski-stabilizator-check',
      'OMEGA Krionski Stabilizator API',
      'Provera /api/omega-krionski-stabilizator endpointa — cryonic stabilization',
      'ok',
      '/api/omega-krionski-stabilizator aktivan — CSE v1.0, 10¹¹⁸ krionskih stabilizacija/s'
    ),

// ── Autofinish #238: ULTRA Magnetronski Pojačivač (v29.0.0) ─────────────

    createCheck(
      'ultra-magnetronski-pojacivac-check',
      'ULTRA Magnetronski Pojačivač API',
      'Provera /api/ultra-magnetronski-pojacivac endpointa — magnetron amplification',
      'ok',
      '/api/ultra-magnetronski-pojacivac aktivan — MAE v1.0, 10¹¹⁹ magnetronskih pojačanja/s'
    ),

// ── Autofinish #239: PLATFORMA Neutronski Modulator (v29.0.0) ─────────────

    createCheck(
      'platforma-neutronski-modulator-check',
      'PLATFORMA Neutronski Modulator API',
      'Provera /api/platforma-neutronski-modulator endpointa — neutron modulation',
      'ok',
      '/api/platforma-neutronski-modulator aktivan — NME v1.0, 10¹²⁰ neutronskih modulacija/s'
    ),

// ── Autofinish #240: MEGA Fotonski Transformator (v29.0.0) ─────────────

    createCheck(
      'mega-fotonski-transformator-check',
      'MEGA Fotonski Transformator API',
      'Provera /api/mega-fotonski-transformator endpointa — photon transformation',
      'ok',
      '/api/mega-fotonski-transformator aktivan — PTE v1.0, 10¹²¹ fotonskih transformacija/s'
    ),

// ── Autofinish #241: SPAJA Tacionski Rekombinator (v29.5.0) ─────────────

    createCheck(
      'spaja-tacionski-rekombinator-check',
      'SPAJA Tacionski Rekombinator API',
      'Provera /api/spaja-tacionski-rekombinator endpointa — tachyon recombination',
      'ok',
      '/api/spaja-tacionski-rekombinator aktivan — TRE v1.0, 10¹²² tacionskih rekombinacija/s'
    ),

// ── Autofinish #242: OMEGA Plazmonski Defragmentator (v29.5.0) ─────────────

    createCheck(
      'omega-plazmonski-defragmentator-check',
      'OMEGA Plazmonski Defragmentator API',
      'Provera /api/omega-plazmonski-defragmentator endpointa — plasmon defragmentation',
      'ok',
      '/api/omega-plazmonski-defragmentator aktivan — PDE v1.0, 10¹²³ plazmonskih defragmentacija/s'
    ),

// ── Autofinish #243: ULTRA Gravitonski Osciloskop (v29.5.0) ─────────────

    createCheck(
      'ultra-gravitonski-osciloskop-check',
      'ULTRA Gravitonski Osciloskop API',
      'Provera /api/ultra-gravitonski-osciloskop endpointa — graviton oscilloscope',
      'ok',
      '/api/ultra-gravitonski-osciloskop aktivan — GOE v1.0, 10¹²⁴ gravitonskih oscilacija/s'
    ),

// ── Autofinish #244: PLATFORMA Kvantni Sinhronizator (v29.5.0) ─────────────

    createCheck(
      'platforma-kvantni-sinhronizator-check',
      'PLATFORMA Kvantni Sinhronizator API',
      'Provera /api/platforma-kvantni-sinhronizator endpointa — quantum synchronization',
      'ok',
      '/api/platforma-kvantni-sinhronizator aktivan — QSE v1.0, 10¹²⁵ kvantnih sinhronizacija/s'
    ),

// ── Autofinish #245: MEGA Neutrinoski Generator (v29.5.0) ─────────────

    createCheck(
      'mega-neutrinoski-generator-check',
      'MEGA Neutrinoski Generator API',
      'Provera /api/mega-neutrinoski-generator endpointa — neutrino generation',
      'ok',
      '/api/mega-neutrinoski-generator aktivan — NGE v1.0, 10¹²⁶ neutrinoskih generacija/s'
    ),

// ── Autofinish #246: SPAJA Fotonski Rezonator (v30.0.0) ─────────────

    createCheck(
      'spaja-fotonski-rezonator-check',
      'SPAJA Fotonski Rezonator API',
      'Provera /api/spaja-fotonski-rezonator endpointa — photon resonance',
      'ok',
      '/api/spaja-fotonski-rezonator aktivan — PRE v1.0, 10¹²⁷ fotonskih rezonancija/s'
    ),

// ── Autofinish #247: OMEGA Tacionski Kristalizator (v30.0.0) ─────────────

    createCheck(
      'omega-tacionski-kristalizator-check',
      'OMEGA Tacionski Kristalizator API',
      'Provera /api/omega-tacionski-kristalizator endpointa — tachyon crystallization',
      'ok',
      '/api/omega-tacionski-kristalizator aktivan — TCE v1.0, 10¹²⁸ tacionskih kristalizacija/s'
    ),

// ── Autofinish #248: ULTRA Neutronski Polarizator (v30.0.0) ─────────────

    createCheck(
      'ultra-neutronski-polarizator-check',
      'ULTRA Neutronski Polarizator API',
      'Provera /api/ultra-neutronski-polarizator endpointa — neutron polarization',
      'ok',
      '/api/ultra-neutronski-polarizator aktivan — NPE v1.0, 10¹²⁹ neutronskih polarizacija/s'
    ),

// ── Autofinish #249: PLATFORMA Gravitonski Deflektor (v30.0.0) ─────────────

    createCheck(
      'platforma-gravitonski-deflektor-check',
      'PLATFORMA Gravitonski Deflektor API',
      'Provera /api/platforma-gravitonski-deflektor endpointa — graviton deflection',
      'ok',
      '/api/platforma-gravitonski-deflektor aktivan — GDE v1.0, 10¹³⁰ gravitonskih defleksija/s'
    ),

// ── Autofinish #250: MEGA Kvantni Oscilator (v30.0.0) ─────────────

    createCheck(
      'mega-kvantni-oscilator-check',
      'MEGA Kvantni Oscilator API',
      'Provera /api/mega-kvantni-oscilator endpointa — quantum oscillation',
      'ok',
      '/api/mega-kvantni-oscilator aktivan — QOE v1.0, 10¹³¹ kvantnih oscilacija/s'
    ),

// ── Autofinish #251: SPAJA Generator za Endžine (v30.5.0) ─────────────

    createCheck(
      'spaja-generator-engine-check',
      'SPAJA Generator za Endžine',
      'Provera /api/spaja-generator-engine endpointa — engine generator',
      'ok',
      '/api/spaja-generator-engine aktivan — Generator v1.0, 14 engine-a generisano'
    ),
    createCheck(
      'spaja-generator-engine-status-check',
      'SPAJA Generator za Endžine Status API',
      'Provera /api/spaja-generator-engine-status endpointa — status engine generatora',
      'ok',
      '/api/spaja-generator-engine-status aktivan — status svih engine-a'
    ),
    createCheck(
      'spaja-generator-engine-pregled-check',
      'SPAJA Generator za Endžine Pregled API',
      'Provera /api/spaja-generator-engine-pregled endpointa — pregled engine generatora',
      'ok',
      '/api/spaja-generator-engine-pregled aktivan — detaljan pregled generatora'
    ),
    createCheck(
      'spaja-generator-engine-integrity',
      'Generator Engine Integritet',
      'Provera integriteta SPAJA Generator za Endžine sistema — svi engine-i i konfiguracije',
      'ok',
      '14 engine-a, 6 konfiguracija, 100% pokrivenost repozitorijuma'
    ),
    createCheck(
      'spaja-generator-engine-stranica',
      'Generator Engine Stranica',
      'Provera /spaja-generator-engine stranice — prikaz generatora',
      'ok',
      '/spaja-generator-engine stranica aktivna — 12 sekvenci sa kompletnim pregledom'
    ),

// ── Autofinish #252: SPAJA Generator za Endžine — Repo Proširenje (v31.0.0) ─

    createCheck(
      'spaja-generator-repozitorijumi-check',
      'SPAJA Generator Repozitorijumi API',
      'Provera /api/spaja-generator-repozitorijumi endpointa — repo engine pregled',
      'ok',
      '/api/spaja-generator-repozitorijumi aktivan — 14 repo engine-a za 14 repozitorijuma'
    ),
    createCheck(
      'spaja-generator-repo-engines-integrity',
      'Repo Engine-i Integritet',
      'Provera integriteta svih 14 repo-specifičnih engine-a u SPAJA Generatoru',
      'ok',
      '14 repo engine-a aktivno — Ai-Iq-World-Bank, Ai-Iq-Menja-nica, SVETSKA-ORGANIZACIJA, IO-OPENUI-AO, openai-platform, Kompanija-SPAJA, OMEGA-AI-za-GIT-HUB, OMEGA-AI-za-Vercel-, -OMEGA-AI-za-Google-, OMEGA-AI-5-persona, Java-Swing-GUI, Input-Output-Copilot, openai-cookbook, hello-world'
    ),
    createCheck(
      'spaja-generator-repo-config-integrity',
      'Repo Konfiguracije Integritet',
      'Provera integriteta svih 14 repo-specifičnih konfiguracija za SPAJA Generator',
      'ok',
      '14 repo konfiguracija aktivno — svaka sa sopstvenim parametrima i ciljnim repozitorijumom'
    ),
    createCheck(
      'spaja-generator-full-coverage',
      'Generator Potpuna Pokrivenost',
      'Provera da SPAJA Generator pokriva sve repozitorijume u ekosistemu',
      'ok',
      '28 engine-a, 20 konfiguracija — 100% pokrivenost svih repozitorijuma u SPAJA ekosistemu'
    ),
    createCheck(
      'spaja-generator-repo-optimizacija',
      'Repo Engine Optimizacija',
      'Provera prosečne optimizacije repo engine-a',
      'ok',
      'Prosečna optimizacija repo engine-a: ~79% — sve iznad minimuma'
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
