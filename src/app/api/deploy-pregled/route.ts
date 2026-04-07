import { NextResponse } from 'next/server';
import {
  deployGrane,
  proksiGitHubVeze,
  transferProtokoli,
  deployPipeline,
  proksiGitHubDeploySistem,
  getAktivneGrane,
} from '@/lib/proksi-github-deploy';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivneGrane = getAktivneGrane();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Deploy Pregled — Kompletni Deploy Pipeline',
    verzija: APP_VERSION,

    pregled: {
      ukupnoGrana: deployGrane.length,
      aktivnih: aktivneGrane.length,
      proksiVeza: proksiGitHubVeze.length,
      transferProtokola: transferProtokoli.length,
    },

    sistem: {
      naziv: proksiGitHubDeploySistem.naziv,
      verzija: proksiGitHubDeploySistem.verzija,
    },

    pipeline: {
      naziv: deployPipeline.naziv,
      koraka: deployPipeline.koraci.length,
    },

    grane: deployGrane.map((g) => ({
      id: g.id,
      naziv: g.naziv,
      ikona: g.ikona,
      status: g.status,
    })),

    protokoli: transferProtokoli.map((t) => ({
      protokol: t.protokol,
      brzina: t.brzina,
    })),

    timestamp: new Date().toISOString(),
  });
}
