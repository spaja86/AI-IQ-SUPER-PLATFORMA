import { randomUUID } from 'node:crypto';
import type { PlatformId } from '@/lib/api-contracts/platforms';
import { IoOpenUiUserCreateSchema } from '@/lib/api-contracts/io-openui';
import { MenjaNicaWalletCreateSchema, MenjaNicaTradeSchema } from '@/lib/api-contracts/menja-nica';
import { WorldBankAccountCreateSchema, WorldBankTransactionCreateSchema } from '@/lib/api-contracts/world-bank';

export interface PlatformRouteRequest {
  platformId: PlatformId;
  method: 'GET' | 'POST';
  path: string[];
  body: unknown;
  userId: string;
}

export interface PlatformRouteResult {
  status: number;
  payload: Record<string, unknown>;
}

type StoredEntity = Record<string, unknown>;

const ioUsers = new Map<string, StoredEntity>();
const menjaWallets = new Map<string, StoredEntity>();
const menjaTrades = new Map<string, StoredEntity>();
const worldAccounts = new Map<string, StoredEntity>();
const worldTransactions = new Map<string, StoredEntity>();

function buildEntity(base: Record<string, unknown>): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    ...base,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

export function routePlatformRequest(request: PlatformRouteRequest): PlatformRouteResult {
  const [resource, id] = request.path;
  const method = request.method;

  if (!resource) return { status: 404, payload: { error: 'Resource nije naveden.' } };

  if (request.platformId === 'io-openui-ao') {
    if (method === 'POST' && resource === 'users') {
      const parsed = IoOpenUiUserCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Nevalidan user payload.', details: parsed.error.flatten() } };
      const entity = buildEntity(parsed.data);
      ioUsers.set(entity.id as string, entity);
      return { status: 201, payload: { user: entity } };
    }

    if (method === 'GET' && resource === 'users' && id) {
      const user = ioUsers.get(id);
      if (!user) return { status: 404, payload: { error: `User '${id}' nije pronađen.` } };
      return { status: 200, payload: { user } };
    }
  }

  if (request.platformId === 'menja-nica') {
    if (method === 'POST' && resource === 'wallets') {
      const parsed = MenjaNicaWalletCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Nevalidan wallet payload.', details: parsed.error.flatten() } };
      const entity = buildEntity({ ...parsed.data, status: 'active' });
      menjaWallets.set(entity.id as string, entity);

      const trade = {
        id: randomUUID(),
        userId: parsed.data.userId,
        fromCurrency: parsed.data.cryptocurrency,
        toCurrency: 'USD',
        fromAmount: 1,
        toAmount: 1,
        status: 'executed' as const,
        txHash: `trade-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      if (MenjaNicaTradeSchema.safeParse(trade).success) {
        menjaTrades.set(trade.id, trade);
      }

      return { status: 201, payload: { wallet: entity } };
    }

    if (method === 'GET' && resource === 'wallets' && id) {
      const wallet = menjaWallets.get(id);
      if (!wallet) return { status: 404, payload: { error: `Wallet '${id}' nije pronađen.` } };
      return { status: 200, payload: { wallet } };
    }

    if (method === 'GET' && resource === 'trades' && id) {
      const trade = menjaTrades.get(id);
      if (!trade) return { status: 404, payload: { error: `Trade '${id}' nije pronađen.` } };
      return { status: 200, payload: { trade } };
    }
  }

  if (request.platformId === 'world-bank') {
    if (method === 'POST' && resource === 'accounts') {
      const parsed = WorldBankAccountCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Nevalidan account payload.', details: parsed.error.flatten() } };
      const entity = buildEntity({
        ...parsed.data,
        status: 'active',
        balance: parsed.data.initialBalance,
      });
      worldAccounts.set(entity.id as string, entity);
      return { status: 201, payload: { account: entity } };
    }

    if (method === 'GET' && resource === 'accounts' && id) {
      const account = worldAccounts.get(id);
      if (!account) return { status: 404, payload: { error: `Account '${id}' nije pronađen.` } };
      return { status: 200, payload: { account } };
    }

    if (method === 'POST' && resource === 'transactions') {
      const parsed = WorldBankTransactionCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Nevalidan transaction payload.', details: parsed.error.flatten() } };

      if (!worldAccounts.has(parsed.data.fromAccountId) || !worldAccounts.has(parsed.data.toAccountId)) {
        return { status: 404, payload: { error: 'Izvorni ili odredišni račun ne postoji.' } };
      }

      const entity = buildEntity({
        ...parsed.data,
        status: 'completed',
      });
      worldTransactions.set(entity.id as string, entity);
      return { status: 201, payload: { transaction: entity } };
    }
  }

  return { status: 404, payload: { error: 'Ruta nije podržana.' } };
}

export function getPlatformGatewaySnapshot() {
  return {
    ioOpenUiUsers: ioUsers.size,
    menjaNicaWallets: menjaWallets.size,
    menjaNicaTrades: menjaTrades.size,
    worldBankAccounts: worldAccounts.size,
    worldBankTransactions: worldTransactions.size,
  };
}
