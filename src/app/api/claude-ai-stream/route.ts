import { streamText } from 'ai';

export async function POST(request: Request) {
  let prompt: string;

  try {
    const body = await request.json();
    prompt = body.prompt;
  } catch {
    return new Response(JSON.stringify({ error: 'Neispravan JSON format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Prompt je obavezan.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = streamText({
    model: 'anthropic/claude-opus-4.6',
    prompt,
    providerOptions: {
      anthropic: {
        thinkingBudget: 0.001,
      },
      gateway: {
        order: ['vertex'],
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
