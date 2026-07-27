import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { getSnupiSekvence } from '@/lib/sekvence/snupi-page';

export const metadata: Metadata = {
  title: 'SNUPI — Sistemska Napredna Unifikacija Procesnih Tokova',
  description: `Cross-domain unifikacioni engine kroz 6 operativnih domena za ${KOMPANIJA}.`,
};

export default function SnupiPage() {
  const sekvence = getSnupiSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
