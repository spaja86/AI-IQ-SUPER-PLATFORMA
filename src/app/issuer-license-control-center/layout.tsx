import AuthGuard from '@/components/AuthGuard';

export default function IssuerLicenseControlCenterLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard stranica="Issuer License Control Center">{children}</AuthGuard>;
}
