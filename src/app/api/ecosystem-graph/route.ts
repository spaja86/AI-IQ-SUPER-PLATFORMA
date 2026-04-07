import { NextResponse } from 'next/server';
import { platforme } from '@/lib/platforme';
import { itProizvodi } from '@/lib/it-proizvodi';
import { omegaPersone } from '@/lib/omega-ai';
import { companies } from '@/lib/companies';
import { organizations } from '@/lib/organizations';
import { products } from '@/lib/products';
import { APP_VERSION } from '@/lib/constants';

interface GraphNode {
  id: string;
  label: string;
  type: 'platforma' | 'proizvod' | 'persona' | 'kompanija' | 'organizacija' | 'product';
  icon: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export async function GET() {
  const nodes: GraphNode[] = [
    ...platforme.map((p) => ({ id: `p-${p.id}`, label: p.naziv, type: 'platforma' as const, icon: p.ikona })),
    ...itProizvodi.slice(0, 10).map((p) => ({ id: `ip-${p.id}`, label: p.naziv, type: 'proizvod' as const, icon: p.ikona })),
    ...omegaPersone.map((p) => ({ id: `ai-${p.uloga}`, label: p.uloga, type: 'persona' as const, icon: '🧠' })),
    ...companies.map((c) => ({ id: `c-${c.id}`, label: c.name, type: 'kompanija' as const, icon: c.icon })),
    ...organizations.slice(0, 8).map((o) => ({ id: `o-${o.id}`, label: o.name, type: 'organizacija' as const, icon: o.icon })),
    ...products.slice(0, 8).map((p) => ({ id: `pr-${p.id}`, label: p.name, type: 'product' as const, icon: p.icon })),
  ];

  const edges: GraphEdge[] = [
    // Connect platforme to IT proizvodi
    ...itProizvodi.slice(0, 10).flatMap((p) =>
      p.ciljnePlatforme.slice(0, 2).map((cp) => ({
        source: `ip-${p.id}`,
        target: `p-${cp}`,
        relation: 'koristi',
      }))
    ),
    // Connect companies to their platforms
    ...companies.flatMap((c) =>
      c.platformIds.slice(0, 2).map((pid) => ({
        source: `c-${c.id}`,
        target: `p-${pid}`,
        relation: 'upravlja',
      }))
    ),
  ];

  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    verzija: APP_VERSION,
    graph: {
      nodes: nodes.length,
      edges: edges.length,
      nodeTypes: ['platforma', 'proizvod', 'persona', 'kompanija', 'organizacija', 'product'],
    },
    nodes,
    edges,
    timestamp: new Date().toISOString(),
  });
}
