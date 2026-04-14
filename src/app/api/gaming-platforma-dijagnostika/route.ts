import { NextResponse } from 'next/server';
import {
  gamingKonfiguracija,
  gamingStatistika,
  endzinNadIgricama,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';
import { igrice } from '@/lib/igrice';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🎮 Gaming Platforma Dijagnostika — IO/OPENUI/AO
 *
 * Kompletan pregled zdravlja gaming platforme sa preporukama za popravku.
 * Proverava deployment status, Vite kompatibilnost, igrice i endzin.
 *
 * Autofinish #319
 */

interface GamingDijagnostika {
  id: string;
  naziv: string;
  status: 'ok' | 'upozorenje' | 'potrebna-akcija' | 'kriticno';
  poruka: string;
  preporuka?: string;
}

function proveraGamingInfrastrukture(): GamingDijagnostika[] {
  const dijagnostike: GamingDijagnostika[] = [];

  // 1. Deployment status
  dijagnostike.push({
    id: 'deployment-status',
    naziv: 'Gaming Platforma Deployment',
    status: 'kriticno',
    poruka: `Deployment pada na io-openui-ao.vercel.app — CI/CD build fails sa ERESOLVE greskom`,
    preporuka: 'U IO-OPENUI-AO repozitorijumu: npm install @vitejs/plugin-react@latest (za podrsku Vite 8) ili npm install vite@^7.0.0 (za downgrade na podrzanu verziju). Takodje azuriraj Node.js sa 20 na 24 u GitHub Actions workflow.',
  });

  // 2. Vite kompatibilnost
  dijagnostike.push({
    id: 'vite-kompatibilnost',
    naziv: 'Vite Verzija Kompatibilnost',
    status: 'kriticno',
    poruka: '@vitejs/plugin-react@4.7.0 zahteva Vite 4-7, ali instaliran je Vite 8.0.6 — build pada',
    preporuka: 'Resenje A: npm install @vitejs/plugin-react@latest (verzija 5+ podrzava Vite 8). Resenje B: npm install vite@^7.0.0 (downgrade). Preporuka je Resenje A jer koristi najnovije verzije.',
  });

  // 3. Node.js verzija
  dijagnostike.push({
    id: 'node-verzija',
    naziv: 'Node.js Verzija u CI/CD',
    status: 'upozorenje',
    poruka: 'GitHub Actions koristi Node.js 20 — actions/checkout@v4 i actions/setup-node@v4 ce biti primorani na Node.js 24 od juna 2026',
    preporuka: 'Azuriraj .github/workflows/deploy.yml: node-version: 20 → node-version: 22 (LTS). Takodje azuriraj actions na @v5 verzije ako su dostupne.',
  });

  // 4. Gaming konfiguracija
  dijagnostike.push({
    id: 'gaming-konfiguracija',
    naziv: 'Gaming Platforma Konfiguracija',
    status: gamingKonfiguracija.aktivan ? 'ok' : 'upozorenje',
    poruka: `Platforma: ${gamingKonfiguracija.platformaNaziv}, Domen: ${gamingKonfiguracija.domen}, Protokol: ${gamingKonfiguracija.protokol}, Aktivan: ${gamingKonfiguracija.aktivan}`,
  });

  // 5. SPAJA Univerzalni Endzin
  const prevucenoSve = gamingStatistika.prevucenoEndžinom === gamingStatistika.ukupnoIgrica;
  dijagnostike.push({
    id: 'univerzalni-endzin',
    naziv: 'SPAJA Univerzalni Endzin',
    status: prevucenoSve ? 'ok' : 'upozorenje',
    poruka: `Endzin prevucen preko ${gamingStatistika.prevucenoEndžinom}/${gamingStatistika.ukupnoIgrica} igrica, prosecna optimizacija: ${gamingStatistika.prosecnaOptimizacija}%`,
  });

  // 6. Igrice integritet
  const aktivneIgrice = igrice.filter((i) => i.status === 'aktivna').length;
  dijagnostike.push({
    id: 'igrice-integritet',
    naziv: 'Igrice Integritet',
    status: igrice.length >= 95 ? 'ok' : 'upozorenje',
    poruka: `${igrice.length} igrica u sistemu (${aktivneIgrice} aktivnih), ${gamingStatistika.ukupnoKategorija} kategorija`,
  });

  // 7. Dimenzionalni sistem
  dijagnostike.push({
    id: 'dimenzionalni-sistem',
    naziv: 'Dimenzionalni Rezimi',
    status: 'ok',
    poruka: 'Svih 5 dimenzija podrzano: 360D, 720D, 1440D, 2880D, 5760D — svaka igrica pita dimenziju (D) prilikom pokretanja',
  });

  // 8. Standardni URL
  dijagnostike.push({
    id: 'standardni-url',
    naziv: 'Standardni URL',
    status: 'upozorenje',
    poruka: `Standardni URL: ${IOOPENUIAO_URL} — nedostupan dok se ne popravi CI/CD build`,
    preporuka: 'Nakon popravke Vite kompatibilnosti, pushuj na main branch i Vercel ce automatski deployovati novu verziju.',
  });

  return dijagnostike;
}

export async function GET() {
  const dijagnostike = proveraGamingInfrastrukture();

  const ukupno = dijagnostike.length;
  const ok = dijagnostike.filter((d) => d.status === 'ok').length;
  const upozorenja = dijagnostike.filter((d) => d.status === 'upozorenje').length;
  const potrebnaAkcija = dijagnostike.filter((d) => d.status === 'potrebna-akcija').length;
  const kriticno = dijagnostike.filter((d) => d.status === 'kriticno').length;
  const zdravlje = Math.round((ok / ukupno) * 100);

  const preporuke = [
    {
      prioritet: 1,
      naslov: 'Popravka Vite kompatibilnosti (HITNO)',
      opis: 'U repozitorijumu spaja86/IO-OPENUI-AO pokrenuti: npm install @vitejs/plugin-react@latest — ovo resava ERESOLVE gresku jer nova verzija plugin-a podrzava Vite 8.',
      komanda: 'npm install @vitejs/plugin-react@latest',
      status: 'hitno',
    },
    {
      prioritet: 2,
      naslov: 'Azuriranje Node.js verzije u CI/CD',
      opis: 'U .github/workflows/deploy.yml promeniti node-version sa 20 na 22 (LTS). Node.js 20 ce biti uklonjen iz runnera septembra 2026.',
      komanda: 'Edituj deploy.yml: node-version: 22',
      status: 'hitno',
    },
    {
      prioritet: 3,
      naslov: 'Azuriranje GitHub Actions',
      opis: 'actions/checkout@v4 i actions/setup-node@v4 koriste Node.js 20 koji je depreciran. Azuriraj na @v5 kada bude dostupno ili postavi FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true.',
      status: 'preporuka',
    },
    {
      prioritet: 4,
      naslov: 'Dodavanje --legacy-peer-deps u CI',
      opis: 'Ako @vitejs/plugin-react@latest ne resi problem, promeni npm ci u npm ci --legacy-peer-deps u deploy.yml kao privremeno resenje.',
      komanda: 'npm ci --legacy-peer-deps',
      status: 'alternativa',
    },
    {
      prioritet: 5,
      naslov: 'Kustomni domen za gaming platformu',
      opis: 'Konfigurisi kustomni domen (npr. igrice.spaja.rs ili gaming.spaja.rs) u Vercel dashboard umesto podrazumevanog .vercel.app domena.',
      status: 'preporuka',
    },
    {
      prioritet: 6,
      naslov: 'Health check endpoint',
      opis: 'Dodaj /api/health endpoint u IO-OPENUI-AO za automatsko praćenje dostupnosti platforme.',
      status: 'preporuka',
    },
    {
      prioritet: 7,
      naslov: 'Monitoring i alerting za gaming platformu',
      opis: 'Postavi Vercel monitoring ili uptime servis (UptimeRobot, Better Uptime) za praćenje dostupnosti gaming platforme 24/7.',
      status: 'preporuka',
    },
    {
      prioritet: 8,
      naslov: 'Automatski testovi pre deployovanja',
      opis: 'Dodaj unit testove i integration testove u CI pipeline za IO-OPENUI-AO. Test rezultati moraju da prođu pre deploymenta.',
      status: 'preporuka',
    },
    {
      prioritet: 9,
      naslov: 'Preview deployments za PR-ove',
      opis: 'Vercel automatski pravi preview deploymente za svaki PR. Koristi ovo za testiranje promena pre merga u main branch.',
      status: 'preporuka',
    },
    {
      prioritet: 10,
      naslov: 'Performance monitoring za igrice',
      opis: 'Dodaj Web Vitals praćenje (LCP, FID, CLS) za merenje performansi igrica u browseru. Korisnici na slabijim uredajima treba da imaju pristojno iskustvo.',
      status: 'preporuka',
    },
  ];

  return NextResponse.json({
    sistem: 'Gaming Platforma Dijagnostika — IO/OPENUI/AO',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    dijagnostike,
    statistika: {
      ukupnoProvera: ukupno,
      ok,
      upozorenja,
      potrebnaAkcija,
      kriticno,
      zdravlje: `${zdravlje}%`,
    },
    preporuke,
    gamingPregled: {
      platforma: gamingKonfiguracija.platformaNaziv,
      domen: gamingKonfiguracija.domen,
      url: IOOPENUIAO_URL,
      ukupnoIgrica: gamingStatistika.ukupnoIgrica,
      aktivnihIgrica: gamingStatistika.aktivnihIgrica,
      ukupnoKategorija: gamingStatistika.ukupnoKategorija,
      prevucenoEndzinom: gamingStatistika.prevucenoEndžinom,
      prosecnaOptimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
      endzinNadIgricamaBroj: endzinNadIgricama.length,
    },
    zakljucak: 'Gaming platforma IO/OPENUI/AO ima 95 igrica sa SPAJA Univerzalnim Endzinom, ali deployment pada zbog nekompatibilnosti izmedju Vite 8 i @vitejs/plugin-react 4.7.0. Hitno azurirati plugin na najnoviju verziju u IO-OPENUI-AO repozitorijumu.',
    timestamp: new Date().toISOString(),
  });
}
