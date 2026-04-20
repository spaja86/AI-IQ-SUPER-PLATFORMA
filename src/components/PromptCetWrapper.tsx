import { promptovi } from '@/lib/prompt';
import PromptCetSviPromptovi from './PromptCetSviPromptovi';

/**
 * Server-side wrapper za PromptČet komponentu.
 * Prosleđuje sve Prompt-ove klijentskoj komponenti.
 *
 * Svaki Prompt ima Čet sa:
 * - 💬 Chat za razgovor u kontekstu Prompt-a
 * - 📋 Povratne informacije za klijente
 * - 🔨 Gradnje za programiranje
 */
export default function PromptCetWrapper() {
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
    tagovi: p.tagovi,
    prioritet: p.prioritet,
    importi: p.importi,
    exporti: p.exporti,
  }));

  return <PromptCetSviPromptovi promptovi={promptData} />;
}
