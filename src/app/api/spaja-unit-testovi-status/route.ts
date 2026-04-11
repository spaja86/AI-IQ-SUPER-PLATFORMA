import { NextResponse } from 'next/server';
import { spajaUnitTestovi } from '@/lib/spaja-unit-testovi';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    sistem: 'SPAJA Unit Testovi — Status',
    verzija: APP_VERSION,
    status: spajaUnitTestovi.status,
    ukupnoSuita: spajaUnitTestovi.suite.length,
    izvestaj: spajaUnitTestovi.izvestaj,
    timestamp: new Date().toISOString(),
  });
}
