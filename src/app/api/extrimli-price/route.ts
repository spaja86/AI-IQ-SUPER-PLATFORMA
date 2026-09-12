import { apiSuccess } from '@/lib/api/response';
import { getExtrimliPriceCatalog } from '@/lib/extrimli-price';

export async function GET() {
  return apiSuccess(getExtrimliPriceCatalog());
}
