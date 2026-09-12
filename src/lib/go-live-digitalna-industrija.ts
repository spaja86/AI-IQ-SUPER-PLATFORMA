import { APP_VERSION } from './constants';

export function getGoLiveDigitalnaIndustrija() {
  return {
    naziv: 'Go-Live Digitalna Industrija',
    verzija: APP_VERSION,
    faze: [
      'branding',
      'pretplate',
      'pdf dokumenti',
      'template',
      'kampanje',
      'javni start',
    ],
    kanali: ['sajt', 'partnerstva', 'društvene mreže', 'B2B outreach', 'media assets'],
    kpi: [
      { naziv: 'Posete', cilj: '25k / mesec' },
      { naziv: 'Prijave', cilj: '2k+' },
      { naziv: 'Aktivacije pretplata', cilj: '300+' },
      { naziv: 'Partner leadovi', cilj: '80+' },
      { naziv: 'PDF preuzimanja', cilj: '1k+' },
    ],
    materijali: [
      'hero vizuali',
      'partner pitch',
      'planovi i CTA stranice',
      'promo tekstovi',
      'share preview i brand asset paket',
    ],
  };
}
