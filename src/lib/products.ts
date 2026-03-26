import { Product } from './types';

export const products: Product[] = [
  // Banking products
  { id: 'ai-smart-cards', name: 'AI Pametne Kartice', description: 'Debit and credit cards with AI real-time fraud protection', descriptionSr: 'Debitne i kreditne kartice sa AI zaštitom od prevara u realnom vremenu', category: 'banking', icon: '💳', status: 'active' },
  { id: 'international-transfers', name: 'Međunarodni Transferi', description: 'Instant SWIFT and SEPA transfers with lowest fees', descriptionSr: 'Instant SWIFT i SEPA transferi sa najnižim provizijama na svetu', category: 'banking', icon: '🌐', status: 'active' },
  { id: 'ai-investment', name: 'AI Investicioni Portfolio', description: 'Automated investment management through AI algorithms', descriptionSr: 'Automatizovano upravljanje investicijama kroz AI algoritme', category: 'banking', icon: '📈', status: 'active' },
  // Trading products
  { id: 'spot-trading', name: 'Spot Trading', description: 'Instant buy/sell of crypto and fiat at market price', descriptionSr: 'Instant kupovina i prodaja kripto i fiat valuta po tržišnoj ceni', category: 'trading', icon: '💹', status: 'active' },
  { id: 'limit-orders', name: 'Limit Orderi', description: 'Set target price and wait for market', descriptionSr: 'Postavi svoju ciljnu cenu i sačekaj da tržište dođe k tebi', category: 'trading', icon: '📉', status: 'active' },
  { id: 'portfolio-tracker', name: 'Portfolio Tracker', description: 'Track portfolio value in real-time', descriptionSr: 'Prati vrednost svojih sredstava u realnom vremenu', category: 'trading', icon: '💼', status: 'active' },
  // AI products
  { id: 'webrtc-voice', name: 'WebRTC Glasovni Chat', description: 'Real-time voice conversation with AI assistant', descriptionSr: 'Real-time glasovni razgovor sa AI asistentom koristeći WebRTC', category: 'ai', icon: '🎙️', status: 'active' },
  { id: 'socketio-chat', name: 'Socket.IO Chat', description: 'Real-time text chat for team collaboration', descriptionSr: 'Real-time tekstualni chat sa Socket.IO za timsku saradnju', category: 'communication', icon: '💬', status: 'active' },
  { id: 'ai-financial-assistant', name: 'AI Finansijski Asistent', description: 'Personal financial advisor available 24/7', descriptionSr: 'Vaš lični finansijski savetnik dostupan 24/7, powered by OpenAI', category: 'ai', icon: '🤖', status: 'active' },
  // Security
  { id: 'fraud-detection', name: 'Fraud Detection', description: 'AI detects suspicious transactions with 99.99% accuracy', descriptionSr: 'AI detektuje sumnjive transakcije sa 99.99% preciznosti', category: 'security', icon: '🛡️', status: 'active' },
  { id: 'e2e-encryption', name: 'End-to-End Enkripcija', description: 'Encryption of all communications on the platform', descriptionSr: 'End-to-end enkripcija svih komunikacija na platformi', category: 'security', icon: '🔒', status: 'active' },
  { id: '2fa-auth', name: '2FA Autentifikacija', description: 'Two-factor authentication for maximum security', descriptionSr: 'Dvofaktorska autentifikacija za maksimalnu sigurnost', category: 'security', icon: '🔐', status: 'active' },
  // Deployment
  { id: 'vercel-deploy', name: 'Vercel CDN Deploy', description: 'Global distribution via Vercel for minimum latency', descriptionSr: 'Globalna distribucija za minimalnu latenciju svuda u svetu', category: 'deployment', icon: '▲', status: 'active' },
  // Integration
  { id: 'coingecko-api', name: 'CoinGecko Integracija', description: 'Live crypto market data from CoinGecko', descriptionSr: 'Live kripto tržišni podaci sa CoinGecko API', category: 'integration', icon: '🦎', status: 'active' },
  { id: 'openai-integration', name: 'OpenAI Integracija', description: 'Integration with OpenAI Realtime API', descriptionSr: 'Integracija sa OpenAI Realtime API za AI funkcionalnosti', category: 'integration', icon: '🧠', status: 'active' },
  // Monitoring
  { id: 'notification-system', name: 'Multi-Channel Notifikacije', description: 'Notifications via GitHub Issues, Email, Discord, Telegram, Slack', descriptionSr: 'Notifikacije preko GitHub Issues, Email, Discord, Telegram, Slack', category: 'monitoring', icon: '🔔', status: 'active' },
  { id: 'ai-market-analysis', name: 'AI Analiza Tržišta', description: 'AI-powered market analysis and trading insights', descriptionSr: 'AI analiza tržišta i uvid u trgovanje u realnom vremenu', category: 'data', icon: '📊', status: 'active' },
];

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(p => p.category === category);
}
