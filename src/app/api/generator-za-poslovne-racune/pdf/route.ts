import { APP_VERSION } from '@/lib/constants';
import { buildGeneratorZaPoslovneRacune } from '@/lib/generator-za-poslovne-racune';
import { buildPoslovniRacuniPdfDocument } from '@/lib/export-pdf';

export async function GET() {
  const result = buildGeneratorZaPoslovneRacune('public');
  const pdf = buildPoslovniRacuniPdfDocument(result);
  const body = pdf.toString('utf8');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ai-iq-world-bank-poslovni-racuni.pdf"',
      'Cache-Control': 'public, max-age=300',
      'X-App-Version': APP_VERSION,
      'X-Export-Contract-Version': result.exportContract.version,
    },
  });
}
