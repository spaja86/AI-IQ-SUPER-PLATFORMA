import { NextResponse } from 'next/server';
import {
  vlasnickiVipPlan,
  omegaDispatchProtokoli,
  proksiSuportSmene,
  marketingFondacija,
} from '@/lib/vlasnicki-vip-plan';

/**
 * 👑 Vlasnički VIP Plan — Pregled API
 *
 * Kompletan pregled vlasničkog VIP plana sa svim komponentama:
 * autorizacije, dispatch protokoli, suport smene, marketing fondacija.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'Vlasnički VIP Plan — Kompanija SPAJA',
    verzija: '1.0.0',
    opis: vlasnickiVipPlan.opis,
    ikona: vlasnickiVipPlan.ikona,
    vlasnikEmail: vlasnickiVipPlan.vlasnikEmail,
    status: vlasnickiVipPlan.status,
    komponente: {
      autorizacije: {
        nivo: vlasnickiVipPlan.autorizacije.nivo,
        platformeBroj: vlasnickiVipPlan.autorizacije.platforme.length,
        pristupBroj: vlasnickiVipPlan.autorizacije.pristup.length,
        ekstremneDozvole: vlasnickiVipPlan.autorizacije.ekstremneDozvole.length,
        sesijeBezIsteka: vlasnickiVipPlan.autorizacije.sesijeBezIsteka,
        globalniPristup: vlasnickiVipPlan.autorizacije.globalniPristup,
      },
      dispatchProtokoli: {
        naziv: omegaDispatchProtokoli.naziv,
        protokolaBroj: omegaDispatchProtokoli.protokoli.length,
        mesecniPrihod: `$${omegaDispatchProtokoli.mesecnaNaplata.ukupnoMesecniPrihod.toLocaleString()}/mes`,
        status: omegaDispatchProtokoli.status,
      },
      suportSmene: {
        naziv: proksiSuportSmene.naziv,
        smenaBroj: proksiSuportSmene.smene.length,
        ukupnoAgenata: proksiSuportSmene.ukupnoAgenata,
        pokrivanje: proksiSuportSmene.pokrivanje,
      },
      marketingFondacija: {
        naziv: marketingFondacija.naziv,
        mesecniBudzet: `$${marketingFondacija.mesecniBudzet.toLocaleString()}/mes`,
        godisnjiTarget: `$${marketingFondacija.godisnjiTarget.toLocaleString()}/god`,
        kanalaBroj: marketingFondacija.kanali.length,
      },
    },
    moto: 'Srećan rad! 👑',
    timestamp: new Date().toISOString(),
  });
}
