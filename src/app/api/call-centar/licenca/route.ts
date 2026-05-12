import { NextResponse, type NextRequest } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  dodeliPaketUsluga,
  posaljiEmailSaInstalacionimBrojem,
  callCentarPaketi,
  type PaketTip,
} from '@/lib/call-centar';

interface LicencaZahtev {
  emailKorisnika?: string;
  tipPaketa?: PaketTip;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LicencaZahtev;
    const emailKorisnika = body.emailKorisnika?.trim() ?? '';
    const tipPaketa = body.tipPaketa;

    if (!emailKorisnika || !tipPaketa) {
      return NextResponse.json(
        {
          error: 'Email korisnika i tip paketa su obavezni.',
          verzija: APP_VERSION,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      );
    }

    const licenca = dodeliPaketUsluga(emailKorisnika, tipPaketa);
    const paket = callCentarPaketi.find((p) => p.tip === tipPaketa);

    const emailInfo = posaljiEmailSaInstalacionimBrojem(
      licenca.emailKorisnika,
      licenca.instalacioniBroj,
      paket?.naziv ?? licenca.naziv,
    );

    return NextResponse.json({
      status: 'uspesno',
      verzija: APP_VERSION,
      licenca,
      email: emailInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const poruka = error instanceof Error ? error.message : 'Neuspešna dodela licence.';
    const status = poruka.includes('Neispravna') || poruka.includes('Nepoznat') ? 400 : 500;

    return NextResponse.json(
      {
        error: poruka,
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status },
    );
  }
}
