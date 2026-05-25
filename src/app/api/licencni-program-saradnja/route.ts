import { type NextRequest } from 'next/server';
import { apiInternalError, apiRateLimited, apiSuccess } from '@/lib/api/response';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { APP_VERSION } from '@/lib/constants';
import {
  buildLicencniProgramSaradnje,
  getEksterneBanke,
  getEksterneKompanije,
  getGoNoGoPoVendoru,
  getLicencniProgramKPI,
  getLicencniProgramProcurementQueue,
} from '@/lib/eksterni-partneri-licencni-program';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const allowed = await checkRateLimitGlobal(
      rateLimitKey(ip, '/api/licencni-program-saradnja'),
      90,
      60,
    );
    if (!allowed) return apiRateLimited(60);

    const view = new URL(request.url).searchParams.get('view');

    // Parcijalni pogledi za efikasnost
    if (view === 'kpi') {
      return apiSuccess({
        status: 'aktivan',
        naziv: 'Enterprise KPI — Licencni Program Saradnje',
        verzija: APP_VERSION,
        kpi: getLicencniProgramKPI(),
      });
    }

    if (view === 'gonogo') {
      return apiSuccess({
        status: 'aktivan',
        naziv: 'Go/No-Go Status po Vendoru',
        verzija: APP_VERSION,
        goNoGo: getGoNoGoPoVendoru(),
      });
    }

    if (view === 'queue') {
      return apiSuccess({
        status: 'aktivan',
        naziv: 'Procurement Queue — Aktivne Nabavke',
        verzija: APP_VERSION,
        queue: getLicencniProgramProcurementQueue(),
      });
    }

    if (view === 'banke') {
      return apiSuccess({
        status: 'aktivan',
        naziv: 'Eksterni Payer Partneri — Banke',
        verzija: APP_VERSION,
        banke: getEksterneBanke(),
      });
    }

    if (view === 'kompanije') {
      return apiSuccess({
        status: 'aktivan',
        naziv: 'Eksterni Partneri — Kompanije',
        verzija: APP_VERSION,
        kompanije: getEksterneKompanije(),
      });
    }

    // Puni program
    const program = buildLicencniProgramSaradnje();

    return apiSuccess({
      status: 'aktivan',
      naziv: program.naziv,
      verzija: program.verzija,
      kompanija: program.kompanija,
      jurisdikcija: program.jurisdikcija,
      rezimNabavke: program.rezimNabavke,
      opis:
        'Formalni licencni program za kupovinu svih Vercel, GitHub i OpenAI licenci sa mapiranjem eksternih banaka i kompanija, B2B checklist-to-payment pipeline-om, enterprise KPI signalima i audit tragom.',
      summary: program.summary,
      kpi: program.kpi,
      prosirenjeStatusi: program.prosirenjeStatusi,
      paymentPipelines: program.paymentPipelines,
      stavke: program.stavke,
      eksterniPartneri: program.eksterniPartneri,
      audit: program.audit,
      napomena:
        'Centralni payer: AI IQ World Bank (DIGI-IND-001). Sve licence plaćaju se u skladu sa NBS propisima i regulatornim zahtevima Srbije.',
      timestamp: program.timestamp,
    });
  } catch (error) {
    return apiInternalError('licencni-program-saradnja', error);
  }
}
