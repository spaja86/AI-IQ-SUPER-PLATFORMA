import { NextResponse } from 'next/server';
import { spajaUnitTestovi } from '@/lib/spaja-unit-testovi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Unit Testovi',
    verzija: APP_VERSION,
    unitTestovi: spajaUnitTestovi,
    timestamp: new Date().toISOString(),
  });
}
