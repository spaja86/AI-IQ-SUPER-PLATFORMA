import type { Sekvenca, SekvencaTip } from '@/lib/types';
import SekvencaRenderer from './SekvencaRenderer';
import SekvencaSkeleton from './SekvencaSkeleton';

interface Props {
  sekvence: Sekvenca[];
  naslov?: string;
  skeleton?: boolean;
}

export default function StranicaRenderer({ sekvence, skeleton }: Props) {
  const sortirane = [...sekvence].sort((a, b) => a.redosled - b.redosled);

  if (skeleton) {
    return (
      <main>
        {sortirane.map((s) => (
          <section key={s.id} id={s.id} aria-label={s.naslov ?? s.tip} aria-busy="true">
            <SekvencaSkeleton tip={s.tip as SekvencaTip} />
          </section>
        ))}
      </main>
    );
  }

  return (
    <main>
      {sortirane.map((s) => (
        <SekvencaRenderer key={s.id} sekvenca={s} />
      ))}
    </main>
  );
}
