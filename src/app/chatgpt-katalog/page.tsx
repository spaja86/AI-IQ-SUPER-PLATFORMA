import type { Metadata } from 'next';
import { ChatGPTKatalogBrowser } from '@/components/chatgpt-katalog';

export const metadata: Metadata = {
  title: 'ChatGPT Katalog | AI IQ SUPER PLATFORMA',
  description: 'Primary ChatGPT discovery and recommendation surface for browsing models, tools, use cases, and comparison flows.',
};

export default function ChatGPTKatalogPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ChatGPTKatalogBrowser />
      </div>
    </main>
  );
}
