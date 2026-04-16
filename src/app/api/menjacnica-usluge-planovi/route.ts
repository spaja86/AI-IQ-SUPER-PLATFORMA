import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ Menjacnica - Usluge i Planovi',
    verzija: APP_VERSION,
    status: 'aktivan',
    usluge: [
      { id: 'kripto-trading', naziv: 'Kripto Trading', opis: '500+ kriptovaluta sa naprednom platformom', cena: '0.2% naknada', ikona: '💱' },
      { id: 'ai-inteligencija', naziv: 'AI Inteligencija', opis: 'AI-powered uvidi i automatizovane strategije', cena: 'Premium plan', ikona: '🤖' },
      { id: 'enterprise-security', naziv: 'Enterprise Security', opis: '2FA, E2E enkripcija, cold storage', cena: 'Besplatno', ikona: '🔒' },
      { id: 'novcanik', naziv: 'Siguran Novcanik', opis: 'Multi-valutni portfolio sa pracenjem', cena: 'Besplatno', ikona: '💼' },
      { id: 'market-analiza', naziv: 'Market Analiza', opis: 'AI analiza sa prediktivnim modelima', cena: 'Premium plan', ikona: '📊' },
      { id: 'ai-konsalting', naziv: 'AI Konsalting', opis: 'Strucne smernice za AI implementaciju', cena: 'Kontaktirajte nas', ikona: '🤖' },
      { id: 'razmena-valuta', naziv: 'Razmena Valuta', opis: 'Kripto i fiat razmena (EUR/RSD/USD)', cena: 'Od 0.5%', ikona: '💱' },
      { id: 'copy-trading', naziv: 'Copy Trading', opis: 'Kopirajte trejdove uspesnih tradere', cena: 'Premium plan', ikona: '📈' },
      { id: 'edukacija', naziv: 'Edukacija', opis: 'Kompletni resursi o kriptu i AI', cena: 'Besplatno', ikona: '🎓' },
    ],
    planovi: [
      {
        id: 'starter',
        naziv: 'Starter',
        cena: '$0/mesec',
        ikona: '🆓',
        naknada: '0.2%',
        funkcije: ['Trading platforma', 'Sigurni novcanik', '0.2% naknada', 'Basic analitika', 'Edukacija'],
        nedostupno: ['AI prediktivna analiza', 'Copy Trading'],
      },
      {
        id: 'pro',
        naziv: 'Pro',
        cena: '$29/mesec',
        ikona: '💎',
        naknada: '0.1% (50% popust)',
        najpopularniji: true,
        funkcije: ['Sve iz Starter plana', '0.1% naknada', 'AI prediktivna analiza', 'Smart DCA Bot', 'Napredna analitika', 'Copy Trading'],
        nedostupno: ['AI Konsalting sesije'],
      },
      {
        id: 'enterprise',
        naziv: 'Enterprise',
        cena: 'Custom',
        ikona: '🏆',
        naknada: '0%',
        funkcije: ['Sve iz Pro plana', '0% naknada', 'Dedicated account manager', 'AI Konsalting sesije', 'Custom API integracija', 'White-label resenja', '24/7 prioritetna podrska'],
        nedostupno: [],
      },
    ],
    ukupnoUsluga: 9,
    ukupnoPlanova: 3,
    timestamp: new Date().toISOString(),
  });
}
