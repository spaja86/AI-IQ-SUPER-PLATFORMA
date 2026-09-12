import { apiSuccess } from '@/lib/api/response';
import { getGoLiveDigitalnaIndustrija } from '@/lib/go-live-digitalna-industrija';

export async function GET() {
  return apiSuccess(getGoLiveDigitalnaIndustrija());
}
