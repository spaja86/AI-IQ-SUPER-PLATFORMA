import { randomUUID } from 'node:crypto';
import type { PlatformId } from '@/lib/api-contracts/platforms';
import { IoOpenUiUserCreateSchema } from '@/lib/api-contracts/io-openui';
import { MenjaNicaWalletCreateSchema } from '@/lib/api-contracts/menja-nica';
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

// NOTE: in-memory stores are used for integration scaffolding/testing. Persist in Supabase for production.
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

  if (!resource) return { status: 404, payload: { error: 'Resource is required.' } };

  if (request.platformId === 'io-openui-ao') {
    if (method === 'POST' && resource === 'users') {
      const parsed = IoOpenUiUserCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Invalid user payload.', details: parsed.error.flatten() } };
      const entity = buildEntity(parsed.data);
      ioUsers.set(entity.id as string, entity);
      return { status: 201, payload: { user: entity } };
    }

    if (method === 'GET' && resource === 'users' && id) {
      const user = ioUsers.get(id);
      if (!user) return { status: 404, payload: { error: `User '${id}' was not found.` } };
      return { status: 200, payload: { user } };
    }
  }

  if (request.platformId === 'menja-nica') {
    if (method === 'POST' && resource === 'wallets') {
      const parsed = MenjaNicaWalletCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Invalid wallet payload.', details: parsed.error.flatten() } };
      const entity = buildEntity({ ...parsed.data, status: 'active' });
      menjaWallets.set(entity.id as string, entity);

      return { status: 201, payload: { wallet: entity } };
    }

    if (method === 'GET' && resource === 'wallets' && id) {
      const wallet = menjaWallets.get(id);
      if (!wallet) return { status: 404, payload: { error: `Wallet '${id}' was not found.` } };
      return { status: 200, payload: { wallet } };
    }

    if (method === 'GET' && resource === 'trades' && id) {
      const trade = menjaTrades.get(id);
      if (!trade) return { status: 404, payload: { error: `Trade '${id}' was not found.` } };
      return { status: 200, payload: { trade } };
    }
  }

  if (request.platformId === 'world-bank') {
    if (method === 'POST' && resource === 'accounts') {
      const parsed = WorldBankAccountCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Invalid account payload.', details: parsed.error.flatten() } };
      const { initialBalance, ...accountInput } = parsed.data;
      const entity = buildEntity({
        ...accountInput,
        status: 'active',
        balance: initialBalance,
      });
      worldAccounts.set(entity.id as string, entity);
      return { status: 201, payload: { account: entity } };
    }

    if (method === 'GET' && resource === 'accounts' && id) {
      const account = worldAccounts.get(id);
      if (!account) return { status: 404, payload: { error: `Account '${id}' was not found.` } };
      return { status: 200, payload: { account } };
    }

    if (method === 'POST' && resource === 'transactions') {
      const parsed = WorldBankTransactionCreateSchema.safeParse(request.body);
      if (!parsed.success) return { status: 400, payload: { error: 'Invalid transaction payload.', details: parsed.error.flatten() } };

      if (!worldAccounts.has(parsed.data.fromAccountId) || !worldAccounts.has(parsed.data.toAccountId)) {
        return { status: 404, payload: { error: 'Source or destination account does not exist.' } };
      }

      const entity = buildEntity({
        ...parsed.data,
        status: 'completed',
      });
      worldTransactions.set(entity.id as string, entity);
      return { status: 201, payload: { transaction: entity } };
    }
  }

  return { status: 404, payload: { error: 'Route is not supported.' } };
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
