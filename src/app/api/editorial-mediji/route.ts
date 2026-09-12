import { apiSuccess } from '@/lib/api/response';
import { getEditorialMediji } from '@/lib/editorial-mediji';

export async function GET() {
  return apiSuccess(getEditorialMediji());
}
