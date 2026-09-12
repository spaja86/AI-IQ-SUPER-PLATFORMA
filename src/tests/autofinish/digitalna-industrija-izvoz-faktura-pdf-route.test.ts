import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/digitalna-industrija-izvoz-faktura/pdf/route';

async function run() {
  const response = await GET({} as NextRequest);
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  if (response.headers.get('Content-Type') !== 'application/pdf') throw new Error('Expected PDF content type');
  if (response.headers.get('Content-Disposition') !== 'attachment; filename=\"digitalna-industrija-izvoz-faktura.pdf\"') {
    throw new Error('Expected attachment content disposition');
  }
  if (response.headers.get('Cache-Control') !== 'no-store') throw new Error('Expected no-store cache policy');
  if (response.headers.get('X-Export-Contract-Version') !== 'pdf-export-v1') throw new Error('Expected export contract header');
  const text = Buffer.from(await response.arrayBuffer()).toString('utf8', 0, 8);
  if (!text.startsWith('%PDF-1.4')) throw new Error('Expected PDF header');
  console.log('✅ digitalna-industrija-izvoz-faktura pdf route');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
