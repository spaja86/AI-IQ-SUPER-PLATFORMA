'use client';

/**
 * 🔗 BlockchainTransakcije — prikazuje transakcije sa Polygon blockchain-a
 *
 * Čita podatke direktno sa pametnog ugovora — bez posrednika.
 * Svaka transakcija ima blockchain hash koji je javno proverljiv
 * na https://polygonscan.com
 */

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  useUkupnoTransakcija,
  useUkupnoPotroseno,
  useVlasnikUgovora,
  usePrveTransakcije,
  CONTRACT_ADDRESS,
  IS_CONTRACT_DEPLOYED,
  ACTIVE_CHAIN,
  VALUTA_NAZIV,
  TRANSAKCIJA_STATUS_NAZIV,
  EXPLORER_ADDRESS_URL,
  EXPLORER_CONTRACT_URL,
} from '@/lib/blockchain';
import type { ValutaEnum, TransakcijaStatusEnum } from '@/lib/blockchain';

const IS_TESTNET = process.env.NEXT_PUBLIC_BLOCKCHAIN_TESTNET === 'true';

export default function BlockchainTransakcije() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: ukupnoTrx, isLoading: loadingTrx } = useUkupnoTransakcija();
  const { data: ukupnoPotroseno, isLoading: loadingPotroseno } = useUkupnoPotroseno();
  const { data: vlasnikAdresa } = useVlasnikUgovora();
  const { data: transakcije, isLoading: loadingTransakcije } = usePrveTransakcije(
    IS_CONTRACT_DEPLOYED ? 50 : 0
  );

  const explorerAdresa = IS_CONTRACT_DEPLOYED
    ? EXPLORER_ADDRESS_URL(CONTRACT_ADDRESS, IS_TESTNET)
    : null;
  const explorerKod = IS_CONTRACT_DEPLOYED
    ? EXPLORER_CONTRACT_URL(CONTRACT_ADDRESS, IS_TESTNET)
    : null;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ─── Header ─────────────────────────────────────── */}
        <div className="text-center">
          <div className="mb-3 text-5xl">🔗</div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            AI IQ World Bank — Blockchain
          </h1>
          <p className="text-gray-400">
            Svaka transakcija je upisana na{' '}
            <span className="font-semibold text-purple-400">Polygon</span> mrežu.
            Javno proverljivo — niko ne može menjati ni brisati podatke.
          </p>
        </div>

        {/* ─── Upozorenje ako ugovor nije deployovan ──────── */}
        {!IS_CONTRACT_DEPLOYED && (
          <div className="rounded-xl border border-yellow-600/40 bg-yellow-900/20 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-300">Ugovor još nije deployovan na mainnet</p>
                <p className="mt-1 text-sm text-yellow-200/70">
                  Pametni ugovor <code className="text-yellow-400">AIIQWorldBank.sol</code> je spreman.
                  Da biste ga deployovali na Polygon mrežu, postavite{' '}
                  <code className="text-yellow-400">NEXT_PUBLIC_CONTRACT_ADDRESS</code> environment
                  varijablu sa adresom deployovanog ugovora.
                </p>
                <div className="mt-3 space-y-1 text-sm text-yellow-200/60">
                  <p>📋 <strong>Opcija 1:</strong> Remix IDE → remix.ethereum.org → uvezite contracts/AIIQWorldBank.sol → Deploy na Polygon</p>
                  <p>📋 <strong>Opcija 2:</strong> Hardhat → npx hardhat run scripts/deploy.ts --network polygon</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Info o ugovoru ─────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoKartica
            ikona="🌐"
            naslov="Mreža"
            vrednost={IS_TESTNET ? 'Polygon Amoy Testnet' : 'Polygon Mainnet'}
            boja="purple"
          />
          <InfoKartica
            ikona="📜"
            naslov="Adresa Ugovora"
            vrednost={
              IS_CONTRACT_DEPLOYED
                ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`
                : 'Nije deployovan'
            }
            boja={IS_CONTRACT_DEPLOYED ? 'green' : 'gray'}
            link={explorerAdresa ?? undefined}
          />
          <InfoKartica
            ikona="📊"
            naslov="Ukupno Transakcija"
            vrednost={
              loadingTrx
                ? '...'
                : IS_CONTRACT_DEPLOYED && ukupnoTrx !== undefined
                  ? ukupnoTrx.toString()
                  : '50 (lokalno)'
            }
            boja="blue"
          />
          <InfoKartica
            ikona="💰"
            naslov="Ukupno Potrošeno"
            vrednost={
              loadingPotroseno
                ? '...'
                : IS_CONTRACT_DEPLOYED && ukupnoPotroseno !== undefined
                  ? `$${ukupnoPotroseno.toLocaleString()}`
                  : '$880,000'
            }
            boja="yellow"
          />
        </div>

        {/* ─── Wallet konekcija ────────────────────────────── */}
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-300">MetaMask / Wallet konekcija</p>
              <p className="text-xs text-gray-500">
                Povežite wallet da biste videli da li ste vlasnik ugovora
              </p>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Povezano</p>
                  <p className="font-mono text-xs text-green-400">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  {vlasnikAdresa && address?.toLowerCase() === vlasnikAdresa.toLowerCase() && (
                    <p className="text-xs font-semibold text-yellow-400">👑 Vlasnik ugovora</p>
                  )}
                </div>
                <button
                  onClick={() => disconnect()}
                  className="rounded-lg bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-900/60"
                >
                  Odspoji
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: injected() })}
                className="rounded-lg bg-purple-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-600"
              >
                🦊 Poveži MetaMask
              </button>
            )}
          </div>
        </div>

        {/* ─── Explorer linkovi ────────────────────────────── */}
        {IS_CONTRACT_DEPLOYED && (
          <div className="flex flex-wrap gap-3">
            <a
              href={explorerAdresa ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-purple-700/50 bg-purple-900/20 px-4 py-2 text-sm text-purple-300 transition hover:bg-purple-900/40"
            >
              🔍 Pogledaj na Polygonscan
            </a>
            <a
              href={explorerKod ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-green-700/50 bg-green-900/20 px-4 py-2 text-sm text-green-300 transition hover:bg-green-900/40"
            >
              📋 Verifikovan kod ugovora
            </a>
          </div>
        )}

        {/* ─── Tabela transakcija ──────────────────────────── */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            📋 Transakcije {IS_CONTRACT_DEPLOYED ? '(sa Polygon blockchain-a)' : '(lokalni podaci — čeka deploy)'}
          </h2>

          {IS_CONTRACT_DEPLOYED && loadingTransakcije ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <div className="text-center">
                <div className="mb-4 flex justify-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-purple-300" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm">Čitanje sa Polygon blockchain-a...</p>
              </div>
            </div>
          ) : IS_CONTRACT_DEPLOYED && transakcije && transakcije.length > 0 ? (
            <TabelaTransakcija transakcije={transakcije} testnet={IS_TESTNET} />
          ) : (
            <LokalneTransakcije />
          )}
        </div>

        {/* ─── Kako proveriti ─────────────────────────────── */}
        <div className="rounded-xl border border-gray-700/40 bg-gray-900/30 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">🔍 Kako proveriti transakcije?</h3>
          <ol className="space-y-3 text-sm text-gray-300">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-800 text-xs font-bold">1</span>
              <span>Idite na <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">polygonscan.com</a></span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-800 text-xs font-bold">2</span>
              <span>Unesite adresu ugovora: <code className="rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-green-400">{CONTRACT_ADDRESS}</code></span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-800 text-xs font-bold">3</span>
              <span>Videćete sve transakcije sa hashevima — nepromenjive, javne, proverljive</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-800 text-xs font-bold">4</span>
              <span>Kliknite na bilo koji hash da vidite detalje transakcije, blok, gas i podatke</span>
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
}

// ─── Pomoćne komponente ──────────────────────────────────

function InfoKartica({
  ikona,
  naslov,
  vrednost,
  boja,
  link,
}: {
  ikona: string;
  naslov: string;
  vrednost: string;
  boja: 'purple' | 'green' | 'blue' | 'yellow' | 'gray';
  link?: string;
}) {
  const bojaKlasa = {
    purple: 'border-purple-700/40 bg-purple-900/20',
    green: 'border-green-700/40 bg-green-900/20',
    blue: 'border-blue-700/40 bg-blue-900/20',
    yellow: 'border-yellow-700/40 bg-yellow-900/20',
    gray: 'border-gray-700/40 bg-gray-900/20',
  }[boja];

  const sadrzaj = (
    <div className={`rounded-xl border p-4 ${bojaKlasa}`}>
      <div className="mb-1 text-2xl">{ikona}</div>
      <p className="text-xs text-gray-400">{naslov}</p>
      <p className="mt-1 font-semibold text-white">{vrednost}</p>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block transition hover:opacity-80">
        {sadrzaj}
      </a>
    );
  }
  return sadrzaj;
}

function TabelaTransakcija({
  transakcije,
  testnet,
}: {
  transakcije: Array<{
    id: bigint;
    naziv: string;
    opis: string;
    iznos: bigint;
    valuta: ValutaEnum;
    izvor: string;
    destinacija: string;
    status: TransakcijaStatusEnum;
    datumBlok: bigint;
    inicijator: `0x${string}`;
  }>;
  testnet: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/40">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/60 text-xs uppercase text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Naziv</th>
            <th className="px-4 py-3 text-right">Iznos</th>
            <th className="px-4 py-3 text-left">Valuta</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Datum</th>
            <th className="px-4 py-3 text-left">Inicijator</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/40">
          {transakcije.map((trx) => (
            <tr key={trx.id.toString()} className="bg-gray-900/30 transition hover:bg-gray-800/30">
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                #{trx.id.toString().padStart(3, '0')}
              </td>
              <td className="px-4 py-3 text-white">{trx.naziv}</td>
              <td className="px-4 py-3 text-right font-semibold text-green-400">
                {trx.iznos.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {VALUTA_NAZIV[trx.valuta as ValutaEnum] ?? '?'}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-green-900/40 px-2 py-0.5 text-xs text-green-400">
                  {TRANSAKCIJA_STATUS_NAZIV[trx.status as TransakcijaStatusEnum] ?? 'Nepoznato'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(Number(trx.datumBlok) * 1000).toLocaleDateString('sr-Latn')}
              </td>
              <td className="px-4 py-3">
                <a
                  href={EXPLORER_ADDRESS_URL(trx.inicijator, testnet)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-purple-400 hover:underline"
                >
                  {trx.inicijator.slice(0, 6)}...{trx.inicijator.slice(-4)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LokalneTransakcije() {
  const nabavke = [
    { id: '001', naziv: 'Biskop Digitalni', iznos: 20_000, valuta: 'USD', opis: 'Strateško-digitalna figura' },
    { id: '002', naziv: 'Top Digitalni', iznos: 18_000, valuta: 'USD', opis: 'Komandna komunikacija' },
    { id: '003', naziv: 'Konj Digitalni', iznos: 15_000, valuta: 'USD', opis: 'Agilan razvoj' },
    { id: '004', naziv: 'Kraljica Digitalna', iznos: 30_000, valuta: 'USD', opis: 'Vrhunski AI sistem' },
    { id: '005', naziv: 'Radio Digitalni', iznos: 12_000, valuta: 'USD', opis: 'Streaming platforma' },
    { id: '006', naziv: 'Akademija Digitalna', iznos: 25_000, valuta: 'USD', opis: 'E-learning platforma' },
    { id: '007', naziv: 'CRM Sistem', iznos: 22_000, valuta: 'USD', opis: 'Customer relationship' },
    { id: '008', naziv: 'ERP Sistem', iznos: 35_000, valuta: 'USD', opis: 'Enterprise resource planning' },
    { id: '009', naziv: 'Firewall Sistem', iznos: 18_000, valuta: 'USD', opis: 'Zaštita mreže' },
    { id: '010', naziv: 'VPN Mreža', iznos: 8_000, valuta: 'USD', opis: 'Privatna virtualna mreža' },
  ];

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-gray-500">
        Prikazano prvih 10 od 50 transakcija — podaci su lokalni dok se ugovor ne deploya na Polygon
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-700/40">
        <table className="w-full text-sm">
          <thead className="bg-gray-800/60 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Naziv</th>
              <th className="px-4 py-3 text-left">Opis</th>
              <th className="px-4 py-3 text-right">Iznos</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {nabavke.map((n) => (
              <tr key={n.id} className="bg-gray-900/30 transition hover:bg-gray-800/30">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">#{n.id}</td>
                <td className="px-4 py-3 text-white">{n.naziv}</td>
                <td className="px-4 py-3 text-gray-400">{n.opis}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-400">
                  ${n.iznos.toLocaleString()} {n.valuta}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-yellow-900/40 px-2 py-0.5 text-xs text-yellow-400">
                    ⏳ Čeka deploy
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
