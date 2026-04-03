import { NextResponse } from 'next/server';
import {
  proksiGitHubDeploySistem,
  getDeployStatistike,
  deployPipeline,
} from '@/lib/proksi-github-deploy';

export async function GET() {
  const stats = getDeployStatistike();

  return NextResponse.json({
    sistem: proksiGitHubDeploySistem.naziv,
    verzija: proksiGitHubDeploySistem.verzija,
    spektar: proksiGitHubDeploySistem.spektar,
    opis: proksiGitHubDeploySistem.opis,
    baznoDeploySistem: proksiGitHubDeploySistem.baznoDeploySistem,
    proksiIntegracija: proksiGitHubDeploySistem.proksiIntegracija,
    kapacitet: proksiGitHubDeploySistem.ukupniKapacitet,
    statistike: stats,
    pipeline: {
      naziv: deployPipeline.naziv,
      status: deployPipeline.status,
      koraci: deployPipeline.koraci.length,
      ukupnoTrajanje: deployPipeline.ukupnoTrajanjeMs,
    },
    timestamp: new Date().toISOString(),
  });
}
