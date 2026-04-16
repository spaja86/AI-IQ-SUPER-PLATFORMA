import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ World Bank — Omega AI Tehnologija',
    verzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Omega AI pokrece sve AI funkcije AI IQ World Bank',
    funkcije: [
      { id: 'ai-scoring', naziv: 'AI Scoring sistem', opis: 'Analiza kreditne sposobnosti korisnika u realnom vremenu sa 97% tacnosti', tacnost: '97%' },
      { id: 'ai-fraud', naziv: 'AI Fraud detekcija', opis: 'Automatska detekcija sumnjivih transakcija pomocu Omega AI modela', status: 'aktivan' },
      { id: 'ai-investicije', naziv: 'AI Investicioni savetnik', opis: 'Pametne preporuke za investiranje u akcije, kripto i fondove', kategorije: ['akcije', 'kripto', 'fondovi'] },
      { id: 'ai-predikcija', naziv: 'AI Predikcija trzista', opis: 'Predvidjanje kretanja trzista na osnovu analize velikih podataka', izvor: 'Big Data' },
      { id: 'ai-optimizacija', naziv: 'AI Optimizacija transakcija', opis: 'Automatska optimizacija rutiranja transakcija za najnize provizije', tip: 'automatska' },
      { id: 'ai-podrska', naziv: 'AI Korisnicka podrska', opis: '24/7 chatbot za korisnicku podrsku i resavanje problema', dostupnost: '24/7' },
    ],
    ukupnoFunkcija: 6,
    timestamp: new Date().toISOString(),
  });
}
