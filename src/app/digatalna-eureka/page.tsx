import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digatalnaEurekaSekvence } from '@/lib/sekvence/digatalna-eureka-page';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'DIGATALNA EUREKA',
  description: `Ektridonalna eksinometrijska ekstaza u ekvivalentu epicentričnog eklubriona — ${KOMPANIJA}`,
};

export default function DigatalnaEureka() {
  return (
    <AuthGuard stranica="DIGATALNA EUREKA">
      <StranicaRenderer sekvence={digatalnaEurekaSekvence} />
    </AuthGuard>
  );
}
