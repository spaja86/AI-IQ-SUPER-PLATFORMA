// SpajaUltraOmegaCore -∞Ω+∞ — Poslovni Novčanik Domain Types
// Kompanija SPAJA — Digitalna Industrija

export type LedgerEntryType =
  | 'deposit'
  | 'withdrawal'
  | 'trade_debit'
  | 'trade_credit'
  | 'fee'
  | 'transfer_out'
  | 'transfer_in'
  | 'adjustment';

export type LedgerDirection = 'credit' | 'debit';

export type DepositStatus = 'pending' | 'confirming' | 'credited' | 'failed' | 'rejected';
export type WithdrawalStatus =
  | 'pending'
  | 'review'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'rejected';

export interface NovcanikAccount {
  id: string;
  userId: string;
  assetId: string;
  available: number;
  reserved: number;
  total: number;
  kycTier: 'basic' | 'verified' | 'enterprise';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  userId: string;
  assetId: string;
  entryType: LedgerEntryType;
  amount: number;
  direction: LedgerDirection;
  balanceAfter: number;
  referenceId?: string;
  referenceType?: string;
  idempotencyKey?: string;
  description?: string;
  createdAt: string;
}

export interface Deposit {
  id: string;
  idempotencyKey: string;
  userId: string;
  assetId: string;
  amount: number;
  status: DepositStatus;
  network?: string;
  txHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  sourceAddress?: string;
  destinationAddress?: string;
  amlScore?: number;
  amlFlags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Withdrawal {
  id: string;
  idempotencyKey: string;
  userId: string;
  assetId: string;
  amount: number;
  fee: number;
  amountNet: number;
  status: WithdrawalStatus;
  network?: string;
  txHash?: string;
  destinationAddress: string;
  kycTierRequired: string;
  amlScore?: number;
  amlFlags: string[];
  reviewReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  assetId: string;
  amount: number;
  network?: string;
  sourceAddress?: string;
  destinationAddress?: string;
}

export interface WithdrawalRequest {
  assetId: string;
  amount: number;
  destinationAddress: string;
  network?: string;
}

export interface TransferRequest {
  fromAssetId: string;
  toAssetId: string;
  amount: number;
}
