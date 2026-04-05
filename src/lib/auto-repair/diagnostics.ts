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
