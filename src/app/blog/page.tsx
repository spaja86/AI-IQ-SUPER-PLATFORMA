import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { blogFaqSekvence } from '@/lib/sekvence/blog-faq-page';

export const metadata: Metadata = {
  title: 'SPAJA Blog & FAQ',
  description: 'SPAJA Blog & FAQ — Clanci, vodiči i odgovori na pitanja',
};

export default function BlogPage() {
  return <StranicaRenderer sekvence={blogFaqSekvence} />;
}
