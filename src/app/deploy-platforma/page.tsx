import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { deployPlatformaSekvence } from '@/lib/sekvence/deploy-platforma-page';

export const metadata: Metadata = {
  title: 'Deploy Platforma',
  description: 'Centralni hub za upravljanje deploymentima svih platformi u ekosistemu',
};

export default function DeployPlatforma() {
  return <StranicaRenderer sekvence={deployPlatformaSekvence} />;
}
