import { promptovi, getPromptKategorije } from '@/lib/prompt';
import { spajaProVerzije } from '@/lib/spaja-pro';
import SpajaProPromptApp from './SpajaProPromptApp';

/**
 * Server-side wrapper for the SpajaPro Prompt Application.
 * Passes prompt data and SpajaPro versions to the interactive client app.
 * SpajaPro 6-15 is the engine — this is the full Prompt App UI.
 */
export default function SpajaProPromptAppWrapper() {
  const kategorije = getPromptKategorije();

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
    <SpajaProPromptApp
      promptovi={promptData}
      verzije={verzijeData}
      kategorije={kategorije}
    />
  );
}
