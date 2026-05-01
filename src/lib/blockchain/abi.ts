/**
 * 🔗 Blockchain — ABI pametnog ugovora AI IQ World Bank
 *
 * ABI (Application Binary Interface) definiše kako da komuniciramo
 * sa pametnim ugovorom na Polygon mreži.
 *
 * Ugovor: AIIQWorldBank.sol
 * Mreža: Polygon mainnet (chainId: 137)
 * Explorer: https://polygonscan.com
 */

export const AIIQ_WORLD_BANK_ABI = [
  // ─── Read funkcije ──────────────────────────────────────
  {
    inputs: [],
    name: 'vlasnik',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'naziv',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'kompanija',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ukupnoTransakcija',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ukupnoPotroseno',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
    name: 'dohvatiTransakciju',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'naziv', type: 'string' },
          { internalType: 'string', name: 'opis', type: 'string' },
          { internalType: 'uint256', name: 'iznos', type: 'uint256' },
          { internalType: 'uint8', name: 'valuta', type: 'uint8' },
          { internalType: 'string', name: 'izvor', type: 'string' },
          { internalType: 'string', name: 'destinacija', type: 'string' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'uint256', name: 'datumBlok', type: 'uint256' },
          { internalType: 'address', name: 'inicijator', type: 'address' },
        ],
        internalType: 'struct AIIQWorldBank.Transakcija',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dohvatiSveTransakcijeIds',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dohvatiSveRacune',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_brojRacuna', type: 'string' }],
    name: 'dohvatiStanjeRacuna',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_adresa', type: 'address' }],
    name: 'jeVlasnik',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'listaTransakcijaIds',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'racuni',
    outputs: [
      { internalType: 'string', name: 'brojRacuna', type: 'string' },
      { internalType: 'string', name: 'naziv', type: 'string' },
      { internalType: 'uint8', name: 'valuta', type: 'uint8' },
      { internalType: 'uint256', name: 'stanje', type: 'uint256' },
      { internalType: 'bool', name: 'aktivan', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'transakcije',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'string', name: 'naziv', type: 'string' },
      { internalType: 'string', name: 'opis', type: 'string' },
      { internalType: 'uint256', name: 'iznos', type: 'uint256' },
      { internalType: 'uint8', name: 'valuta', type: 'uint8' },
      { internalType: 'string', name: 'izvor', type: 'string' },
      { internalType: 'string', name: 'destinacija', type: 'string' },
      { internalType: 'uint8', name: 'status', type: 'uint8' },
      { internalType: 'uint256', name: 'datumBlok', type: 'uint256' },
      { internalType: 'address', name: 'inicijator', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  // ─── Write funkcije (samo vlasnik) ──────────────────────
  {
    inputs: [
      { internalType: 'string', name: '_naziv', type: 'string' },
      { internalType: 'string', name: '_opis', type: 'string' },
      { internalType: 'uint256', name: '_iznos', type: 'uint256' },
      { internalType: 'uint8', name: '_valuta', type: 'uint8' },
      { internalType: 'string', name: '_izvor', type: 'string' },
      { internalType: 'string', name: '_destinacija', type: 'string' },
    ],
    name: 'upisTransakciju',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_brojRacuna', type: 'string' },
      { internalType: 'uint256', name: '_iznos', type: 'uint256' },
    ],
    name: 'deponujSredstva',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_noviVlasnik', type: 'address' }],
    name: 'prenesiVlasnistvo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // ─── Događaji (Events) ──────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'naziv', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'iznos', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'valuta', type: 'uint8' },
      { indexed: false, internalType: 'string', name: 'izvor', type: 'string' },
      { indexed: false, internalType: 'string', name: 'destinacija', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'datum', type: 'uint256' },
    ],
    name: 'TransakcijaUpisana',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'brojRacuna', type: 'string' },
      { indexed: false, internalType: 'string', name: 'naziv', type: 'string' },
      { indexed: false, internalType: 'uint8', name: 'valuta', type: 'uint8' },
    ],
    name: 'RacunDodan',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'brojRacuna', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'iznos', type: 'uint256' },
      { indexed: false, internalType: 'uint8', name: 'valuta', type: 'uint8' },
    ],
    name: 'SredstvaDeponovana',
    type: 'event',
  },
] as const;

export type AIIQWorldBankABI = typeof AIIQ_WORLD_BANK_ABI;
