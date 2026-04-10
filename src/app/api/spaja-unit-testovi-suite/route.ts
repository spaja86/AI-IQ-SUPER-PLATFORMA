import { NextResponse } from 'next/server';
import { spajaUnitTestovi } from '@/lib/spaja-unit-testovi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Unit Testovi — Suite',
    verzija: APP_VERSION,
    ukupnoSuita: spajaUnitTestovi.suite.length,
    suite: spajaUnitTestovi.suite,
    timestamp: new Date().toISOString(),
  });
}
