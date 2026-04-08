import { promptovi, getPromptKategorije } from '@/lib/prompt';
import { spajaProVerzije } from '@/lib/spaja-pro';
import SpajaProPromptKonzola from './SpajaProPromptKonzola';

/**
 * Server-side wrapper that passes prompt data to the interactive client component.
 * SpajaPro 6-15 is the engine/motor for prompts — this is the UI structure.
 */
export default function SpajaProPromptKonzolaWrapper() {
  const kategorije = getPromptKategorije();

  // Serialize data for client component
  const promptData = promptovi.map((p) => ({
    id: p.id,
    naziv: p.naziv,
    opis: p.opis,
    ikona: p.ikona,
    kategorija: p.kategorija,
    sadrzaj: p.sadrzaj,
    spajaProVerzija: p.spajaProVerzija,
    ciljnaPersona: p.ciljnaPersona,
    ciljnaPlatforma: p.ciljnaPlatforma,
    parametri: p.parametri,
    tagovi: p.tagovi,
    prioritet: p.prioritet,
  }));

  const verzijeData = spajaProVerzije.map((v) => ({
    verzija: v.verzija,
    naziv: v.naziv,
    kodnoIme: v.kodnoIme,
    ikona: v.ikona,
    status: v.status,
  }));

  return (
    <SpajaProPromptKonzola
      promptovi={promptData}
      verzije={verzijeData}
      kategorije={kategorije}
    />
  );
}
