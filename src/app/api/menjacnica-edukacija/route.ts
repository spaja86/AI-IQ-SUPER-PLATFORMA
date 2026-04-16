import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ Menjacnica - Kripto Edukacija',
    verzija: APP_VERSION,
    status: 'aktivan',
    teme: [
      {
        id: 'bitcoin',
        naslov: 'Sta je Bitcoin?',
        ikona: '₿',
        opis: 'Prva decentralizovana digitalna valuta — Satoshi Nakamoto, 2009.',
        kljucneTacke: ['21 milion BTC max', 'Peer-to-peer mreza', 'Blockchain', 'Digitalno zlato', 'Globalan 24/7'],
      },
      {
        id: 'ethereum',
        naslov: 'Sta je Ethereum?',
        ikona: '🔷',
        opis: 'Programibilni blockchain za pametne ugovore — Vitalik Buterin, 2015.',
        kljucneTacke: ['Pametni ugovori', 'DeFi ekosistem', 'NFT', 'DAOs', 'Proof of Stake'],
      },
      {
        id: 'blockchain',
        naslov: 'Kako radi Blockchain?',
        ikona: '🏗️',
        opis: 'Distribuirana baza podataka — blokovi povezani kriptografski u lanac.',
        kljucneTacke: ['Transakcija', 'Broadcast', 'Validacija', 'Konsenzus (PoW/PoS)', 'Nepromenjivost'],
      },
      {
        id: 'defi',
        naslov: 'Sta je DeFi?',
        ikona: '🏦',
        opis: 'Decentralizovane finansije bez tradicionalnih posrednika.',
        kljucneTacke: ['DEX (Uniswap)', 'Lending (Aave)', 'Yield Farming', 'Staking', 'Stablecoins'],
      },
      {
        id: 'ai-kripto',
        naslov: 'AI u Kriptu',
        ikona: '🤖',
        opis: 'Vestacka inteligencija za naprednu kripto analitiku i trading.',
        kljucneTacke: ['Prediktivna analiza', 'Automatski rebalansing', 'Sentiment analiza', 'Fraud detekcija', 'Smart DCA Bot'],
      },
      {
        id: 'sigurnost',
        naslov: 'Sigurnost Novcanika',
        ikona: '🔐',
        opis: 'Kljucni saveti za zastitu kripto sredstava.',
        kljucneTacke: ['Privatni kljuc', 'Seed phrase (12/24)', 'Hardware wallet', '2FA', 'Anti-phishing'],
      },
    ],
    kviz: {
      status: 'aktivan',
      brojPitanja: 8,
      opis: 'Interaktivni kviz o kriptovalutama sa instant feedbackom',
    },
    ukupnoTema: 6,
    timestamp: new Date().toISOString(),
  });
}
