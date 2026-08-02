import type { Sekvenca } from '@/lib/types';
import { getGigatronKatalogMetrike, getGigatronKategorije, getGigatronBrandovi } from '@/lib/gigatron/gigatron-catalog';
import { getInventoryMetrike } from '@/lib/gigatron/gigatron-inventory';

export function getGigatronSekvence(): Sekvenca[] {
  const katalogMetrike = getGigatronKatalogMetrike();
  const inventoryMetrike = getInventoryMetrike();
  const kategorije = getGigatronKategorije();
  const brendovi = getGigatronBrandovi();

  return [
    {
      id: 'gigatron-hero',
      tip: 'hero',
      naslov: '🛒 GIGATRON — IT & Elektronika Procurement',
      podnaslov: 'v1.0.0 · B2B Nabavka · Affiliate Program · Upravljanje Zalihama',
      ikona: '🛒',
      redosled: 1,
      podaci: {
        opis: 'GIGATRON je integraciona tačka za IT/elektroniku procurement, affiliate/partner prodaju i B2B supply chain. Kompanija SPAJA koristi GIGATRON kao primarni kanal za IT opremu i periferiju — od laptopova i mobilnih telefona do mrežne opreme i gaming uređaja.',
        dugmad: [
          { tekst: 'Katalog proizvoda', href: '/gigatron/katalog' },
          { tekst: 'B2B Nabavka', href: '/gigatron/nabavka', stil: 'sekundarno' },
          { tekst: 'API: Health check', href: '/api/gigatron/health', stil: 'sekundarno' },
        ],
      },
      stil: 'gradijent',
    },
    {
      id: 'gigatron-metrike',
      tip: 'statistika',
      naslov: '📊 Pregled Kataloga',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupno proizvoda', vrednost: katalogMetrike.ukupnoProizvoda, ikona: '📦' },
          { naziv: 'Na stanju', vrednost: inventoryMetrike.naStanju, ikona: '✅' },
          { naziv: 'Kategorija', vrednost: kategorije.length, ikona: '🗂️' },
          { naziv: 'Brand-ova', vrednost: brendovi.length, ikona: '🏷️' },
          { naziv: 'Ukupno dostupno', vrednost: inventoryMetrike.ukupnoDostupno, ikona: '🏪' },
          { naziv: 'Prosečna cena (EUR)', vrednost: `€${katalogMetrike.prosecnaCenaEUR}`, ikona: '💶' },
        ],
      },
    },
    {
      id: 'gigatron-usluge',
      tip: 'lista',
      naslov: '🔧 Usluge Platforme',
      redosled: 3,
      podaci: {
        stavke: [
          {
            naslov: 'IT & Elektronika Katalog',
            opis: 'Pretraga i filtriranje kataloga po kategoriji, brand-u, ceni i dostupnosti. Puni detalji proizvoda sa tehničkim karakteristikama i SKU brojevima.',
            ikona: '🔍',
          },
          {
            naslov: 'B2B Procurement',
            opis: 'Kreiranje i praćenje B2B narudžbina — stavke, adrese isporuke, PDV kalkulacija, status praćenje i procenjeni rokovi isporuke.',
            ikona: '📦',
          },
          {
            naslov: 'Affiliate / Partner Program',
            opis: 'Tracking affiliate događaja (klik, pregled, kupovina) i automatska kalkulacija provizija. Kumulativno praćenje i mesečni izveštaji.',
            ikona: '🤝',
          },
          {
            naslov: 'Upravljanje Zalihama',
            opis: 'Praćenje zaliha u realnom vremenu — dostupnost, rezervacije, alerti za niske zalihe i sync sa centralnim katalogom.',
            ikona: '📊',
          },
        ],
      },
    },
    {
      id: 'gigatron-api',
      tip: 'tabela',
      naslov: '🌐 API Endpoints',
      redosled: 4,
      podaci: {
        zaglavlje: ['Endpoint', 'Metoda', 'Opis'],
        redovi: [
          ['/api/gigatron/health', 'GET', 'Health check za CI smoke test'],
          ['/api/gigatron/catalog', 'GET', 'Pretraga i filtriranje kataloga'],
          ['/api/gigatron/order', 'POST', 'Kreiranje B2B narudžbine'],
          ['/api/gigatron/order/[id]', 'GET', 'Status narudžbine'],
          ['/api/gigatron/affiliate/track', 'POST', 'Affiliate event tracking'],
          ['/api/gigatron/inventory', 'GET', 'Stanje zaliha u realnom vremenu'],
        ],
      },
    },
    {
      id: 'gigatron-kpis',
      tip: 'tabela',
      naslov: '📈 KPI Ciljevi',
      redosled: 5,
      podaci: {
        zaglavlje: ['KPI', 'Ciljna vrednost'],
        redovi: [
          ['API response (catalog/order)', '≤ 200ms'],
          ['Catalog availability', '99.9%'],
          ['Order processing success rate', '≥ 99%'],
          ['Affiliate tracking accuracy', '100%'],
          ['Build duration', '≤ 3 min'],
          ['Security scan coverage', '100%'],
          ['Feature flag rollout', '10% → 50% → 100%'],
        ],
      },
    },
    {
      id: 'gigatron-cta',
      tip: 'cta',
      naslov: '🚀 Počnite sa GIGATRON Integracijom',
      redosled: 6,
      podaci: {
        opis: 'Pristupite IT i elektronika katalogu, pokrenite B2B narudžbinu ili se prijavite za affiliate program.',
        dugmad: [
          { tekst: 'Otvorite katalog', href: '/gigatron/katalog' },
          { tekst: 'B2B nabavka', href: '/gigatron/nabavka', stil: 'sekundarno' },
          { tekst: 'API dokumentacija', href: '/api/gigatron/health', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
