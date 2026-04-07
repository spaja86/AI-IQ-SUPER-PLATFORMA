import { NextResponse } from 'next/server';
import { industrijskiMejlSistem, getSviDepartmanskiMejlovi } from '@/lib/omega-ai-suport-mejlovi';

/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi — Kontakt API
 *
 * Kontakt informacije za korisnike koji žele da se dopisuju sa OMEGA AI suportom.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Suport — Kontakt za Korisnike',
    poruka: 'Pišite nam na bilo koji od navedenih mejlova. OMEGA AI persona će vam odgovoriti u kontekstu vašeg pitanja — platforma, industrija, menjačnica, banka, IT proizvodi, kompanije ili korporacije.',
    domen: industrijskiMejlSistem.domen,
    radnoVreme: industrijskiMejlSistem.radnoVreme,
    prosecnoVremeOdgovora: industrijskiMejlSistem.prosecnoVremeOdgovora,
    kontaktDepartmani: getSviDepartmanskiMejlovi().map((mejl) => {
      const dep = industrijskiMejlSistem.departmani.find((d) => d.glavniMejl === mejl);
      return {
        mejl,
        departman: dep?.naziv ?? mejl,
        ikona: dep?.ikona ?? '📧',
        opis: dep?.opis ?? '',
      };
    }),
    brziKontakti: {
      opstiSuport: 'suport@omega-ai.spaja.rs',
      tehnickaPodrska: 'tehnicka-podrska@omega-ai.spaja.rs',
      banka: 'banka@omega-ai.spaja.rs',
      menjacnica: 'menjacnica@omega-ai.spaja.rs',
      platforma: 'platforma@omega-ai.spaja.rs',
      korporacije: 'korporacije@omega-ai.spaja.rs',
    },
    napomena: 'Svaka OMEGA AI persona odgovara u kontekstu svog domena — objašnjava stvari vezane za rad na platformi, industriji, menjačnici, banci, IT proizvodima, kompanijama i korporacijama.',
    timestamp: new Date().toISOString(),
  });
}
