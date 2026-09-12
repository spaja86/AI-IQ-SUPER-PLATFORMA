import { apiSuccess } from '@/lib/api/response';
import { getStartPretplateData } from '@/lib/start-pretplate';

export async function GET() {
  return apiSuccess(getStartPretplateData());
}
