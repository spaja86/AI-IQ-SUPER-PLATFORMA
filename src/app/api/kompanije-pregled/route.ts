import { NextResponse } from 'next/server';
import { companies, getActiveCompanies, getSubsidiaries } from '@/lib/companies';
import { organizations, getActiveOrganizations } from '@/lib/organizations';
import { products, getActiveProducts } from '@/lib/products';
import { APP_VERSION } from '@/lib/constants';

export async function GET() {
  const aktivneKompanije = getActiveCompanies();
  const subsidiaries = getSubsidiaries();
  const aktivneOrganizacije = getActiveOrganizations();
  const aktivniProizvodi = getActiveProducts();

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'Kompanije Pregled — Kompanije, Organizacije, Proizvodi',
    verzija: APP_VERSION,

    pregled: {
      kompanije: companies.length,
      aktivneKompanije: aktivneKompanije.length,
      subsidiaries: subsidiaries.length,
      organizacije: organizations.length,
      aktivneOrganizacije: aktivneOrganizacije.length,
      proizvodi: products.length,
      aktivniProizvodi: aktivniProizvodi.length,
    },

    kompanije: companies.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      status: c.status,
      icon: c.icon,
      industry: c.industry,
    })),

    organizacije: organizations.slice(0, 10).map((o) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      status: o.status,
      icon: o.icon,
    })),

    proizvodiKategorije: [...new Set(products.map((p) => p.category))].map((cat) => ({
      kategorija: cat,
      broj: products.filter((p) => p.category === cat).length,
    })),

    timestamp: new Date().toISOString(),
  });
}
