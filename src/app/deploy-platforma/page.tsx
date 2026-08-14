import type { Metadata } from 'next';
import DeployPlatformSkeletonSurface from '@/components/deploy/DeployPlatformSkeletonSurface';

export const metadata: Metadata = {
  title: 'Deploy Platforma Skeleton UI/UX',
  description: 'Skeleton-first kontrolna površina za deploy status, trigger, history i health tokove',
};

export default function DeployPlatforma() {
  return <DeployPlatformSkeletonSurface />;
}
