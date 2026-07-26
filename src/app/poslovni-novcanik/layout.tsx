import AuthGuard from '@/components/AuthGuard';

export default function PoslovniNovcanikLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard stranica="Poslovni Novčanik">{children}</AuthGuard>;
}
