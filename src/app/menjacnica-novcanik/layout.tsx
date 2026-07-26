import AuthGuard from '@/components/AuthGuard';

export default function MenjacnicaNovcanikLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard stranica="Menjačnica Novčanik">{children}</AuthGuard>;
}
