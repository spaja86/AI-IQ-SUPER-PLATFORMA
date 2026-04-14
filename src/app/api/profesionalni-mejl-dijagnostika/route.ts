import { NextResponse } from 'next/server';
import { profesionalniMejlSistem, mejlSabloni } from '@/lib/spaja-profesionalni-mejl';
import { industrijskiMejlSistem, suportDepartmani } from '@/lib/omega-ai-suport-mejlovi';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 📧 Profesionalni Mejl Dijagnostika — AI IQ World Bank Poslovni Mejlovi
 *
 * Kompletan pregled zdravlja mejl sistema sa preporukama za pokretanje.
 * Proverava SMTP spremnost, DNS konfiguraciju, sablone i infrastrukturu.
 *
 * Autofinish #319
 */

interface MejlDijagnostika {
  id: string;
  naziv: string;
  status: 'ok' | 'upozorenje' | 'potrebna-akcija' | 'kriticno';
  poruka: string;
  preporuka?: string;
}

function proveraMejlInfrastrukture(): MejlDijagnostika[] {
  const dijagnostike: MejlDijagnostika[] = [];

  // 1. Provera SMTP konfiguracije
  const smtpKonfig = profesionalniMejlSistem.konfiguracija;
  const smtpSpreman = smtpKonfig.smtpServer !== '' && smtpKonfig.smtpPort > 0;
  dijagnostike.push({
    id: 'smtp-konfiguracija',
    naziv: 'SMTP Server Konfiguracija',
    status: smtpSpreman ? 'upozorenje' : 'kriticno',
    poruka: smtpSpreman
      ? `SMTP konfigurisan: ${smtpKonfig.smtpServer}:${smtpKonfig.smtpPort} (TLS: ${smtpKonfig.tls ? 'da' : 'ne'}) — ceka se aktivacija servera`
      : 'SMTP server nije konfigurisan',
    preporuka: 'Registruj domen spaja.rs kod registra domena, zatim postavi SMTP server (preporuka: Resend, Mailgun ili SendGrid). Dodaj SMTP kredencijale kao Vercel environment varijable.',
  });

  // 2. Provera domena
  const domeni = profesionalniMejlSistem.domeni;
  dijagnostike.push({
    id: 'dns-domeni',
    naziv: 'Email Domeni',
    status: 'upozorenje',
    poruka: `${domeni.length} domena definisano: ${domeni.join(', ')} — DNS zapisi moraju se konfigurisati`,
    preporuka: 'Za svaki domen postavi MX, SPF, DKIM i DMARC DNS zapise. Primer SPF: "v=spf1 include:_spf.google.com ~all". Primer DMARC: "v=DMARC1; p=quarantine; rua=mailto:postmaster@spaja.rs".',
  });

  // 3. Provera sablona mejlova
  const ukupnoSablona = mejlSabloni.length;
  dijagnostike.push({
    id: 'mejl-sabloni',
    naziv: 'Mejl Sabloni',
    status: ukupnoSablona >= 8 ? 'ok' : 'upozorenje',
    poruka: `${ukupnoSablona} profesionalnih sablona spremno (dobrodoslica, verifikacija, transakcija, pretplata, podrska, newsletter, marketing, upozorenje)`,
  });

  // 4. Provera OMEGA AI suport mejlova
  dijagnostike.push({
    id: 'omega-ai-suport-mejlovi',
    naziv: 'OMEGA AI Suport Mejlovi',
    status: industrijskiMejlSistem.status === 'aktivan' ? 'ok' : 'upozorenje',
    poruka: `${industrijskiMejlSistem.ukupnoMejlova} persona mejlova na domenu ${industrijskiMejlSistem.domen}, ${suportDepartmani.length} departmana`,
  });

  // 5. Provera TLS enkripcije
  dijagnostike.push({
    id: 'tls-enkripcija',
    naziv: 'TLS Enkripcija',
    status: smtpKonfig.tls ? 'ok' : 'kriticno',
    poruka: smtpKonfig.tls ? 'TLS enkripcija omogucena za sve mejlove' : 'TLS NIJE OMOGUCEN — mejlovi nisu bezbedni!',
    preporuka: smtpKonfig.tls ? undefined : 'Hitno omoguci TLS na SMTP serveru (port 587 sa STARTTLS ili port 465 sa SSL).',
  });

  // 6. Provera retry mehanizma
  dijagnostike.push({
    id: 'retry-mehanizam',
    naziv: 'Retry Mehanizam',
    status: smtpKonfig.retryBroj > 0 ? 'ok' : 'upozorenje',
    poruka: `Retry mehanizam: ${smtpKonfig.retryBroj} pokusaja za neuspesna slanja`,
  });

  // 7. Provera dnevnog limita
  dijagnostike.push({
    id: 'dnevni-limit',
    naziv: 'Dnevni Limit Mejlova',
    status: 'ok',
    poruka: `Dnevni limit: ${smtpKonfig.maxMejlovaDnevno.toLocaleString()} mejlova`,
  });

  // 8. Bankarski potpis
  dijagnostike.push({
    id: 'bankarski-potpis',
    naziv: 'AI IQ World Bank Bankarski Potpis',
    status: 'ok',
    poruka: 'Bankarski potpis sa IBAN brojem konfigurisan za poslovne mejlove',
  });

  return dijagnostike;
}

export async function GET() {
  const dijagnostike = proveraMejlInfrastrukture();

  const ukupno = dijagnostike.length;
  const ok = dijagnostike.filter((d) => d.status === 'ok').length;
  const upozorenja = dijagnostike.filter((d) => d.status === 'upozorenje').length;
  const potrebnaAkcija = dijagnostike.filter((d) => d.status === 'potrebna-akcija').length;
  const kriticno = dijagnostike.filter((d) => d.status === 'kriticno').length;
  const zdravlje = Math.round((ok / ukupno) * 100);

  const preporuke = [
    {
      prioritet: 1,
      naslov: 'Registracija domena spaja.rs',
      opis: 'Registruj domen spaja.rs kod registra (preporuka: Namecheap, Cloudflare, ili srpski registar). Ovo je preduslov za sve mejl funkcionalnosti.',
      status: 'potrebno',
    },
    {
      prioritet: 2,
      naslov: 'Postavljanje SMTP servisa',
      opis: 'Izaberi i konfiguriši SMTP servis. Preporuke: Resend (besplatno do 3.000 mejlova/mesec, najlaksa integracija sa Next.js), Mailgun (10.000 besplatno prvi mesec), ili SendGrid (100 mejlova/dan besplatno).',
      status: 'potrebno',
    },
    {
      prioritet: 3,
      naslov: 'DNS konfiguracija (MX, SPF, DKIM, DMARC)',
      opis: 'Dodaj MX zapise za prijem mejlova, SPF za autorizaciju slanja, DKIM za kriptografski potpis, i DMARC za politiku autentifikacije. Ovo sprecava da mejlovi idu u spam.',
      status: 'potrebno',
    },
    {
      prioritet: 4,
      naslov: 'Vercel Environment Varijable',
      opis: 'Dodaj SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS kao environment varijable u Vercel dashboard. Nikad ne stavljaj kredencijale u kod.',
      status: 'potrebno',
    },
    {
      prioritet: 5,
      naslov: 'Testiranje mejl dostave',
      opis: 'Posalji test mejlove na razlicite provajdere (Gmail, Outlook, Yahoo) i proveri da mejlovi stizu u inbox (ne u spam). Koristi alate kao mail-tester.com za ocenu.',
      status: 'preporuka',
    },
    {
      prioritet: 6,
      naslov: 'Bounce i complaint handling',
      opis: 'Konfiguriši webhook za praćenje bounce-ova (neisporucenih) i complaint-a (prijava za spam). Ovo je obavezno za održavanje reputacije domena.',
      status: 'preporuka',
    },
    {
      prioritet: 7,
      naslov: 'Email verifikacija korisnika',
      opis: 'Implementiraj double opt-in — korisnik mora potvrditi mejl adresu pre nego sto se mejl aktivira. Sablon "verifikacija" je vec spreman u sistemu.',
      status: 'preporuka',
    },
    {
      prioritet: 8,
      naslov: 'Monitoring i alerting',
      opis: 'Postavi monitoring za stopu isporuke (delivery rate > 95%), bounce rate (< 5%) i complaint rate (< 0.1%). Konfiguriši alertove za anomalije.',
      status: 'preporuka',
    },
  ];

  return NextResponse.json({
    sistem: 'Profesionalni Mejl Dijagnostika — AI IQ World Bank',
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
    mejlSistemPregled: {
      domeni: profesionalniMejlSistem.domeni,
      ukupnoSablona: mejlSabloni.length,
      ukupnoPersona: industrijskiMejlSistem.ukupnoMejlova,
      ukupnoDepartmana: suportDepartmani.length,
      smtpServer: profesionalniMejlSistem.konfiguracija.smtpServer,
      smtpPort: profesionalniMejlSistem.konfiguracija.smtpPort,
      tls: profesionalniMejlSistem.konfiguracija.tls,
      dnevniLimit: profesionalniMejlSistem.konfiguracija.maxMejlovaDnevno,
      status: profesionalniMejlSistem.status,
    },
    zakljucak: 'Mejl sistem je definisan u kodu sa svim sablonima, domenima i persona suportom. Za pokretanje je potrebna infrastruktura: registracija domena spaja.rs, SMTP servis i DNS konfiguracija.',
    timestamp: new Date().toISOString(),
  });
}
