import { NextResponse } from 'next/server';
import { navigation } from '@/lib/navigation';
import { APP_VERSION, TOTAL_PAGES, TOTAL_ROUTES } from '@/lib/constants';

export async function GET() {
  const kategorije = {
    glavne: navigation.filter((_, i) => i < 4),
    ekosistem: navigation.filter((n) => ['/platforme', '/ekosistem', '/deploy', '/industrija'].includes(n.href)),
    ai: navigation.filter((n) => ['/omega-ai', '/spaja-pro', '/prompt', '/ai-platforma', '/spaja-univerzalni-prompt'].includes(n.href)),
    infrastruktura: navigation.filter((n) => ['/proksi', '/mobilna-mreza', '/proksi-github-deploy', '/proksi-wifi-antena'].includes(n.href)),
    finansije: navigation.filter((n) => ['/banka', '/menjacnica'].includes(n.href)),
    entiteti: navigation.filter((n) => ['/kompanije', '/organizacije', '/proizvodi', '/kompanija', '/organizacija'].includes(n.href)),
  };

  return NextResponse.json({
    verzija: APP_VERSION,
    ukupnoLinkova: navigation.length,
    ukupnoStranica: TOTAL_PAGES,
    ukupnoRuta: TOTAL_ROUTES,

    kategorije: Object.entries(kategorije).map(([naziv, linkovi]) => ({
      naziv,
      brojLinkova: linkovi.length,
      linkovi: linkovi.map((l) => ({ label: l.label, href: l.href, icon: l.icon })),
    })),

    sviLinkovi: navigation.map((n) => ({
      label: n.label,
      href: n.href,
      icon: n.icon,
      description: n.description,
    })),

    timestamp: new Date().toISOString(),
  });
}
