import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';

/**
 * GET /api/blockchain-transakcije
 *
 * Vraća informacije o pametnom ugovoru i uputstvo za verifikaciju transakcija
 * na Polygon blockchain-u.
 *
 * U produkciji — frontend direktno čita sa blockchain-a putem wagmi/viem.
 * Ova API ruta služi za server-side informacije i status ugovora.
 */
export async function GET() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const isDeployed = !!(
    contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000'
  );
  const isTestnet = process.env.NEXT_PUBLIC_BLOCKCHAIN_TESTNET === 'true';

  const explorerBase = isTestnet
    ? 'https://amoy.polygonscan.com'
    : 'https://polygonscan.com';

  return NextResponse.json({
    sistem: 'AI IQ World Bank — Blockchain Pametni Ugovor',
    appVerzija: APP_VERSION,
    status: isDeployed ? 'deployovan' : 'ceka-deploy',
    blockchain: {
      ugovor: 'AIIQWorldBank',
      jezik: 'Solidity ^0.8.24',
      mreza: isTestnet ? 'Polygon Amoy Testnet' : 'Polygon Mainnet',
      chainId: isTestnet ? 80002 : 137,
      adresaUgovora: contractAddress ?? '0x0000000000000000000000000000000000000000',
      deployovan: isDeployed,
      explorerUrl: isDeployed
        ? `${explorerBase}/address/${contractAddress}`
        : null,
      sourceCodeUrl: isDeployed
        ? `${explorerBase}/address/${contractAddress}#code`
        : null,
    },
    ugovorFunkcije: {
      citanje: [
        'ukupnoTransakcija() → uint256',
        'ukupnoPotroseno() → uint256',
        'vlasnik() → address',
        'dohvatiTransakciju(id) → Transakcija',
        'dohvatiSveTransakcijeIds() → uint256[]',
        'dohvatiSveRacune() → string[]',
        'dohvatiStanjeRacuna(brojRacuna) → uint256',
      ],
      pisanje: [
        'upisTransakciju(naziv, opis, iznos, valuta, izvor, destinacija) → uint256',
        'deponujSredstva(brojRacuna, iznos)',
        'prenesiVlasnistvo(novaAdresa)',
      ],
      dogadjaji: [
        'TransakcijaUpisana(id, naziv, iznos, valuta, izvor, destinacija, datum)',
        'RacunDodan(brojRacuna, naziv, valuta)',
        'SredstvaDeponovana(brojRacuna, iznos, valuta)',
      ],
    },
    nabavkeInfo: {
      ukupnoStavki: 50,
      ukupnoUSD: 880_000,
      opis: '50 digitalnih varijacija upisanih u konstruktoru — Biskop, Top, Konj, Kraljica, Radio, Akademija, CRM, ERP, Firewall, VPN i mnogo više',
      verifikacija:
        'Sve nabavke su upisane u konstruktoru pametnog ugovora — vidljive na blockchain-u od momenta deploya',
    },
    racuni: [
      {
        brojRacuna: 'DIGI-IND-001',
        naziv: 'Digitalna Industrija — Dinarski',
        valuta: 'RSD',
        tip: 'blockchain-digitalni',
      },
      {
        brojRacuna: 'DIGI-IND-002-EUR',
        naziv: 'Digitalna Industrija — Devizni EUR',
        valuta: 'EUR',
        tip: 'blockchain-digitalni',
      },
    ],
    korakZaDeploy: isDeployed
      ? null
      : {
          korak1: 'Otvorite https://remix.ethereum.org',
          korak2: 'Uvezite contracts/AIIQWorldBank.sol',
          korak3: 'Kompajlirajte sa Solidity ^0.8.24',
          korak4: 'Postavite Environment na "Injected Provider — MetaMask"',
          korak5: 'Izaberite Polygon mrežu u MetaMask-u (chainId: 137)',
          korak6: 'Kliknite Deploy',
          korak7: 'Kopirajte adresu deployovanog ugovora',
          korak8:
            'Postavite NEXT_PUBLIC_CONTRACT_ADDRESS=0x... u Vercel environment varijable',
        },
    frontend: {
      tehnologije: ['wagmi v2', 'viem v2', '@tanstack/react-query v5'],
      stranica: '/blockchain',
      opis: 'Frontend čita podatke direktno sa Polygon blockchain-a — bez posrednika',
    },
    timestamp: new Date().toISOString(),
  });
}
