import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { platforme } from '@/lib/platforme';
import { sajtovi } from '@/lib/sajtovi';

export async function GET() {
  const sajtAnaliza = platforme.map((p) => ({
    id: p.id,
    naziv: p.naziv,
    url: p.url,
    status: p.status,
    progres: p.progres,
    deploy: p.deploy.status,
    kategorija: p.kategorija,
    funkcionalnost: p.progres >= 90 ? 'potpuno-funkcionalan' : p.progres >= 70 ? 'delimicno-funkcionalan' : 'u-razvoju',
    promptPotreba: true,
    promptOpis: getPromptOpis(p.id),
  }));

  return NextResponse.json({
    sistem: 'Sajt Funkcionalnost Analiza — Masovna Analiza Svih Sajtova',
    appVerzija: APP_VERSION,
    ukupnoPlatformi: platforme.length,
    ukupnoSajtova: sajtovi.length,
    analiza: {
      potpunoFunkcionalni: sajtAnaliza.filter((s) => s.funkcionalnost === 'potpuno-funkcionalan').length,
      delimicnoFunkcionalni: sajtAnaliza.filter((s) => s.funkcionalnost === 'delimicno-funkcionalan').length,
      uRazvoju: sajtAnaliza.filter((s) => s.funkcionalnost === 'u-razvoju').length,
    },
    promptAnaliza: {
      saPromptovima: sajtAnaliza.filter((s) => s.promptPotreba).length,
      opis: 'Svi sajtovi trebaju Promptove da bi korisnicima objasnili sta sve treba i kako da se uradi',
    },
    finansijskiSajtovi: {
      banka: {
        naziv: 'AI IQ World Bank',
        kamatnaStopaPrompt: '40% pozitivna kamatna stopa mesecno',
        primer: 'Ulozite 1.000 RSD → za mesec dana 1.400 RSD',
        status: 'aktivan',
        analiza: 'Ekstremno jaka — sve se moze proveriti i analizirati',
      },
      menjacnica: {
        naziv: 'AI IQ Menjacnica',
        spajaBtc: 'SPAJA BTC — mnogo skuplji od obicnog BTC-a ($892,500 vs $67,450)',
        kriptoValute: '150+ kripto valuta ukljucujuci SPAJA BTC',
        fiatValute: '30+ fiat valuta',
        status: 'aktivan',
        analiza: 'Ekstremno jaka svetska menjacnica — drzi kurseve svega',
      },
    },
    gamingPlatforma: {
      naziv: 'IO/OPENUI/AO Gaming Platforma',
      igrice: 95,
      kategorije: 18,
      endzin: 'SPAJA Univerzalni Endzin prevucen preko svih igrica',
      dimenzije: '360D-5760D',
      status: 'aktivan',
      zahtevi: ['Digitalni Kompjuter', 'Digitalni Brauzer'],
    },
    sajtovi: sajtAnaliza,
    preporuke: [
      'Svi sajtovi trebaju maksimalnu funkcionalnost — bez 404/500 gresaka',
      'Svi sajtovi koji su na 200 trebaju da budu produktivni',
      'Promptovi su potrebni na svim sajtovima za objasnjenje korisnicima',
      'AI IQ World Bank: Istaci 40% kamatnu stopu i primere (1.000→1.400 RSD)',
      'AI IQ Menjacnica: Istaci SPAJA BTC i svetsku kursnu listu',
      'IO/OPENUI/AO: Deplojovati igrice i proveriti funkcionalnost',
    ],
    timestamp: new Date().toISOString(),
  });
}

function getPromptOpis(platformaId: string): string {
  const opisi: Record<string, string> = {
    'ai-iq-super-platforma': 'Centralna platforma — Prompt za navigaciju i upravljanje celim ekosistemom',
    'io-openui-ao': 'Gaming platforma — Prompt za 95 igrica, dimenzije, IT proizvode i laboratoriju',
    'ai-iq-menjacnica': 'Svetska menjacnica — Prompt za BTC, SPAJA BTC, kripto/fiat kurseve i trgovanje',
    'ai-iq-world-bank': 'Digitalna banka — Prompt za 40% kamatnu stopu, stedne racune, kredite i investicije',
    'svetska-organizacija': 'Globalna organizacija — Prompt za koordinaciju projekata i timova',
    'omega-ai-github': 'OMEGA AI za GitHub — Prompt za code review, PR automatizaciju i CI/CD',
    'omega-ai-vercel': 'OMEGA AI za Vercel — Prompt za auto deploy, monitoring i error tracking',
    'omega-ai-google': 'OMEGA AI za Google — Prompt za SEO, Analytics i Cloud funkcije',
    'omega-ai-5-persona': 'OMEGA AI 5 Persona — Prompt za Facebook, Instagram, TikTok, Threads, YouTube',
    'spajapro-platforma': 'SpajaPro Engine — Prompt za 10 verzija (6-15) i univerzalni Prompt sistem',
    'input-output-copilot': 'I/O za Copilot — Prompt za aktivnu komunikaciju sa korisnicima',
    'openai-platforma': 'OpenAI Platforma — Prompt za SpajaPro v6-15 integraciju sa OpenAI API',
    'omega-ai-sistem': 'OMEGA AI Sistem — Prompt za 40.000.562 persona i autonomnu evoluciju',
  };
  return opisi[platformaId] ?? 'Potreban Prompt za objasnjenje funkcionalnosti korisnicima';
}
