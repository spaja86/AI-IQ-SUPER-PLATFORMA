import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { storyOfLifeSekvence } from '@/lib/sekvence/story-of-life-page';

export const metadata: Metadata = {
  title: 'STORY OF LIFE',
  description: 'Narativni prikaz evolucije i životnog ciklusa AI IQ SUPER PLATFORMA ekosistema',
};

export default function StoryOfLifePage() {
  return <StranicaRenderer sekvence={storyOfLifeSekvence} />;
}
