import type { NextRequest } from 'next/server';
import { GET } from '../../app/api/generator-za-poslovne-racune/pdf/route';

async function run() {
  const response = await GET({} as NextRequest);
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
  if (response.headers.get('Content-Type') !== 'application/pdf') throw new Error('Expected PDF content type');
  const content = Buffer.from(await response.arrayBuffer()).toString('utf8');
  if (!content.startsWith('%PDF-1.4')) throw new Error('Expected PDF header');
  if (!content.includes('public-demo@ai-iq-super-platforma.com')) throw new Error('Expected redacted public demo identity');
  console.log('✅ generator-za-poslovne-racune pdf route');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
