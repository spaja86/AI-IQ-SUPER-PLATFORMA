import { APP_VERSION } from '@/lib/constants';
import { buildGeneratorZaPoslovneRacune } from '@/lib/generator-za-poslovne-racune';
import { buildPoslovniRacuniPdfDocument } from '@/lib/export-pdf';

export async function GET() {
  const result = buildGeneratorZaPoslovneRacune('public');
  const publicResult = {
    ...result,
    userId: 'public-demo',
    subjekt: {
      ...result.subjekt,
      naziv: 'Javni demo subjekt',
      pib: 'DEMO-PIB',
      maticniBroj: 'DEMO-MB',
      email: 'public-demo@ai-iq-super-platforma.com',
    },
    racuni: result.racuni.map((racun, index) => ({
      ...racun,
      id: `demo-racun-${index + 1}`,
      brojRacuna: `DEMO-${String(index + 1).padStart(4, '0')}`,
      ibanLike: `RS35AIIQDEMO${String(index + 1).padStart(10, '0')}`,
      metadata: {
        ...racun.metadata,
        vlasnik: 'Javni demo subjekt',
      },
    })),
  };
  const pdf = buildPoslovniRacuniPdfDocument(publicResult);
  const body = Uint8Array.from(pdf);

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
