import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    naziv: 'AI IQ Menjacnica - Trading Platforma',
    verzija: APP_VERSION,
    status: 'aktivan',
    tradingParovi: [
      { par: 'BTC/USD', cena: '$67,420', promena24h: '+2.3%', volumen24h: '$24.3B', high24h: '$68,100', low24h: '$66,500' },
      { par: 'ETH/USD', cena: '$3,820', promena24h: '+1.8%', volumen24h: '$12.1B', high24h: '$3,890', low24h: '$3,750' },
      { par: 'SOL/USD', cena: '$185', promena24h: '+5.1%', volumen24h: '$3.2B', high24h: '$192', low24h: '$178' },
      { par: 'BNB/USD', cena: '$612', promena24h: '+1.2%', volumen24h: '$1.8B', high24h: '$620', low24h: '$605' },
    ],
    tipoveNarudzbi: ['Limit', 'Market', 'Stop'],
    naknada: '0.2%',
    funkcije: [
      'Order Book sa asks/bids prikazom',
      'Canvas Price Chart sa vremenskim okvirima (1m, 5m, 15m, 1h, 4h, 1d)',
      'Buy/Sell forma sa Limit, Market i Stop narudzbinama',
      'P&L Kalkulator za izracun profita/gubitka',
      'Trade History u realnom vremenu',
      'CoinGecko API integracija za realne cene (EUR/RSD)',
    ],
    aiPredikcija: {
      predikcija1h: { smer: 'up', procenat: '+0.8%', sigurnost: '74%' },
      predikcija4h: { smer: 'up', procenat: '+2.1%', sigurnost: '68%' },
      predikcija24h: { smer: 'up', procenat: '+4.5%', sigurnost: '61%' },
      sentiment: { bullish: '65%', neutral: '22%', bearish: '13%' },
    },
    timestamp: new Date().toISOString(),
  });
}
