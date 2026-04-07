import { NextResponse } from 'next/server';
import { deployGrane, proksiGitHubVeze, deployPipeline, proksiGitHubDeploySistem } from '@/lib/proksi-github-deploy';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Deploy Status',
    verzija: APP_VERSION,

    sistem: {
      naziv: proksiGitHubDeploySistem.naziv,
      verzija: proksiGitHubDeploySistem.verzija,
      spektar: proksiGitHubDeploySistem.spektar,
    },

    grane: {
      ukupno: deployGrane.length,
      aktivnih: deployGrane.filter((g) => g.status === 'aktivna').length,
      lista: deployGrane.map((g) => ({
        naziv: g.naziv,
        status: g.status,
        protokol: g.transferProtokol,
      })),
    },

    proksiVeze: {
      ukupno: proksiGitHubVeze.length,
      lista: proksiGitHubVeze.map((v) => ({
        id: v.id,
        naziv: v.naziv,
        status: v.status,
      })),
    },

    pipeline: {
      naziv: deployPipeline.naziv,
      koraka: deployPipeline.koraci.length,
      status: deployPipeline.status,
    },

    timestamp: new Date().toISOString(),
  });
}
