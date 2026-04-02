import { StranicaRenderer } from '@/components/sekvence';
import { proksiGitHubDeploySekvence } from '@/lib/sekvence/proksi-github-deploy-page';

export default function ProksiGitHubDeploy() {
  return <StranicaRenderer sekvence={proksiGitHubDeploySekvence} />;
}
