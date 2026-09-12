import { APP_VERSION } from '@/lib/constants';
import { buildDigitalnaIndustrijaIzvozFaktura } from '@/lib/digitalna-industrija-izvoz-faktura';
import { buildIzvozFakturaPdfDocument } from '@/lib/export-pdf';

export async function GET() {
  const result = buildDigitalnaIndustrijaIzvozFaktura('public');
  const publicResult = { ...result, userId: 'public-demo' };
  const pdf = buildIzvozFakturaPdfDocument(publicResult);
  const body = Uint8Array.from(pdf);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="digitalna-industrija-izvoz-faktura.pdf"',
      'Cache-Control': 'private, no-store, max-age=0',
      'X-App-Version': APP_VERSION,
      'X-Export-Contract-Version': publicResult.exportContract.version,
    },
  });
}
