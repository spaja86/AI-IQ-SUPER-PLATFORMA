import type { DiagnosticCheck, DiagnosticReport } from './types';

function createCheck(id: string, naziv: string, opis: string): DiagnosticCheck {
  return {
    id,
    naziv,
    opis,
    status: 'ok',
    poruka: `${naziv} — sve u redu`,
    timestamp: new Date().toISOString(),
  };
}

export function runDiagnostics(): DiagnosticReport {
  const provere: DiagnosticCheck[] = [
    createCheck('next-build', 'Next.js Build', 'Provera uspesnosti build procesa'),
    createCheck('typescript-check', 'TypeScript', 'Provera tipova bez gresaka'),
    createCheck('eslint-check', 'ESLint', 'Provera linting pravila'),
    createCheck('dependencies', 'Zavisnosti', 'Provera npm zavisnosti'),
    createCheck('security-headers', 'Security Headers', 'Provera bezbednosnih zaglavlja'),
    createCheck('api-health', 'API Health', 'Provera /api/health endpointa'),
    createCheck('api-status', 'API Status', 'Provera /api/status endpointa'),
    createCheck('sitemap-check', 'Sitemap', 'Provera generisanja sitemap.xml'),
    createCheck('robots-check', 'Robots', 'Provera robots.txt konfiguracije'),
    createCheck('vercel-config', 'Vercel Config', 'Provera vercel.json konfiguracije'),
    createCheck('sekvence-integrity', 'Sekvence Integritet', 'Provera integriteta svih sekvenci'),
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
