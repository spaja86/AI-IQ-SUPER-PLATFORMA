import type { Sekvenca } from '@/lib/types';
import SekvencaRenderer from './SekvencaRenderer';

interface Props {
  sekvence: Sekvenca[];
  naslov?: string;
}

export default function StranicaRenderer({ sekvence }: Props) {
  const sortirane = [...sekvence].sort((a, b) => a.redosled - b.redosled);

  return (
    <main>
      {sortirane.map((s) => (
        <SekvencaRenderer key={s.id} sekvenca={s} />
      ))}
    </main>
  );
}
