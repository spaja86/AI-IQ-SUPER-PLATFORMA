import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { proksiGitHubDeploySekvence } from '@/lib/sekvence/proksi-github-deploy-page';

export const metadata: Metadata = {
  title: 'Proksi GitHub Deploy',
  description: 'Proksi GitHub Deploy sistem',
};

export default function ProksiGitHubDeploy() {
  return <StranicaRenderer sekvence={proksiGitHubDeploySekvence} />;
}
