import { JokeGenerator } from '@/components/jokes/joke-generator';

export const metadata = {
  title: 'Joke Generator',
  description: 'Get random jokes powered by JokeAPI.dev',
};

export default function JokesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <JokeGenerator autoLoad={true} showCategories={true} showStats={true} />
      </div>
    </div>
  );
}
