import { aiPagePrompts } from '@/lib/ai-page-prompts';
import AiAsistentWidget from './AiAsistentWidget';

/**
 * Server wrapper — prosleđuje konfigurisane AI promptove ka klijent widgetu.
 * Renderuje se u layout.tsx tako da je dostupan na svakoj stranici.
 */
export default function AiAsistentWrapper() {
  // Serialize data for client component — samo potrebni podaci
  const prompts = aiPagePrompts.map((p) => ({
    putanja: p.putanja,
    naslov: p.naslov,
    opis: p.opis,
    kontekst: p.kontekst,
    promptovi: p.promptovi.map((pr) => ({
      pitanje: pr.pitanje,
      ikona: pr.ikona,
      kategorija: pr.kategorija,
    })),
  }));

  return <AiAsistentWidget pagePrompts={prompts} />;
}
