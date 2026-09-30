import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';
import AiiqProgramskiJezikWorkspace from '@/components/AiiqProgramskiJezikWorkspace';

export const metadata: Metadata = {
  title: 'AI IQ Programski Jezik | SPAJA',
  description: 'Zaštićen, read-only radni prostor za AI IQ Programski Jezik evaluaciju i kompajliranje.',
};

export default function AiiqProgramskiJezikPage() {
  return (
    <AuthGuard stranica="AI IQ Programski Jezik radnom prostoru">
      <AiiqProgramskiJezikWorkspace />
    </AuthGuard>
  );
}
