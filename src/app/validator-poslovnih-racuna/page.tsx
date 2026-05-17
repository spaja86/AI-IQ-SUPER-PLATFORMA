import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { validatorPoslovnihRacunaSekvence } from '@/lib/sekvence/validator-poslovnih-racuna-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Validator Poslovnih Računa',
  description: `AI IQ World Bank validator poslovnih računa (format/compliance/operativa) — ${KOMPANIJA}`,
};

export default function ValidatorPoslovnihRacunaPage() {
  return <StranicaRenderer sekvence={validatorPoslovnihRacunaSekvence} />;
}
