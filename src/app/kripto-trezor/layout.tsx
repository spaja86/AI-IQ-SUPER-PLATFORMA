import AuthGuard from '@/components/AuthGuard';

export default function KriptoTrezorLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard stranica="Kripto Trezor">{children}</AuthGuard>;
}
