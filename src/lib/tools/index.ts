// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Tool Calling System
// Kompanija SPAJA — Digitalna Industrija
// OpenAI Function Calling sa internim alatima

import type OpenAI from 'openai';

// ─── Tool Definitions ───────────────────────────────────────────────────

export const SPAJA_TOOLS: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_datetime',
      description: 'Dohvata trenutni datum i vreme u razlicitim formatima i vremenskim zonama',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'IANA timezone (npr. Europe/Belgrade, America/New_York). Podrazumevano: Europe/Belgrade',
          },
          format: {
            type: 'string',
            enum: ['full', 'date', 'time', 'iso'],
            description: 'Format datuma: full, date, time ili iso',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Izvršava matematičke proračune. Podržava osnovne operacije, trigonometriju, logaritme, korenovanje itd.',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Matematički izraz za izračunavanje (npr. "2 + 2", "sqrt(16)", "sin(PI/2)", "log(100)")',
          },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Pretraga interneta za aktuelne informacije. Koristi kada korisnik pita o novostima, aktuelnim događajima, ili nečemu što zahteva ažurne informacije.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Upit za pretragu',
          },
          num_results: {
            type: 'number',
            description: 'Broj rezultata (1-5). Podrazumevano: 3',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_image',
      description: 'Generiše sliku na osnovu tekstualnog opisa koristeći DALL-E 3. Koristi kada korisnik traži da se napravi, nacrta ili generiše slika.',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'Detaljan opis slike koja treba da se generiše (na engleskom za najbolje rezultate)',
          },
          size: {
            type: 'string',
            enum: ['1024x1024', '1792x1024', '1024x1792'],
            description: 'Dimenzije slike. Podrazumevano: 1024x1024',
          },
          quality: {
            type: 'string',
            enum: ['standard', 'hd'],
            description: 'Kvalitet slike. HD za detaljnije slike.',
          },
        },
        required: ['prompt'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convert_currency',
      description: 'Konvertuje valutu iz jedne u drugu. Podržava RSD, EUR, USD, GBP, CHF i druge.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'Iznos za konverziju',
          },
          from: {
            type: 'string',
            description: 'Izvorna valuta (npr. EUR, USD, RSD)',
          },
          to: {
            type: 'string',
            description: 'Ciljna valuta (npr. RSD, EUR, USD)',
          },
        },
        required: ['amount', 'from', 'to'],
      },
    },
  },
];

// ─── Tool Execution ─────────────────────────────────────────────────────

// Safe math evaluator - only allows math operations via a whitelist approach
const ALLOWED_MATH_METHODS = new Set([
  'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'log', 'log10', 'log2', 'abs', 'ceil', 'floor', 'round', 'pow',
  'min', 'max', 'exp', 'sign', 'trunc',
]);

function safeEval(expression: string): number {
  // Step 1: Replace common aliases
  let sanitized = expression
    .replace(/\bln\b/g, 'log')
    .replace(/\bPI\b/gi, 'Math.PI')
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\bE\b/g, 'Math.E');

  // Step 2: Replace whitelisted math function names with Math.xxx
  for (const method of ALLOWED_MATH_METHODS) {
    const regex = new RegExp(`\\b${method}\\b`, 'g');
    sanitized = sanitized.replace(regex, `Math.${method}`);
  }

  // Step 3: Validate the sanitized expression only contains safe characters
  // Allow: digits, whitespace, operators, parentheses, dots, commas, and "Math." prefix
  if (!/^[\d\s+\-*/().,%^Math]+$/.test(sanitized)) {
    throw new Error('Nedozvoljeni karakter u izrazu');
  }

  // Step 4: Ensure no property access beyond Math methods
  const mathAccessPattern = /Math\.(\w+)/g;
  let match;
  while ((match = mathAccessPattern.exec(sanitized)) !== null) {
    if (!ALLOWED_MATH_METHODS.has(match[1]) && match[1] !== 'PI' && match[1] !== 'E') {
      throw new Error(`Nedozvoljena Math metoda: ${match[1]}`);
    }
  }

  // Step 5: Replace ^ with ** for exponentiation
  sanitized = sanitized.replace(/\^/g, '**');

  // Step 6: Use Function constructor for evaluation (no access to outer scope)
  const fn = new Function(`"use strict"; return (${sanitized})`);
  const result = fn() as number;

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Rezultat nije validan broj');
  }

  return result;
}

// Approximate exchange rates (EUR as base)
// NOTE: Static rates for demonstration. In production, integrate a real-time
// exchange rate API (e.g., exchangeratesapi.io or frankfurter.app).
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  CHF: 0.96,
  RSD: 117.2,
  BAM: 1.96,
  HRK: 7.53,
  JPY: 163.5,
  CNY: 7.82,
  AUD: 1.67,
  CAD: 1.48,
  PLN: 4.32,
};

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  switch (name) {
    case 'get_current_datetime': {
      const tz = (args.timezone as string) || 'Europe/Belgrade';
      const format = (args.format as string) || 'full';
      const now = new Date();

      try {
        const opts: Intl.DateTimeFormatOptions = { timeZone: tz };
        let result: string;

        switch (format) {
          case 'date':
            opts.dateStyle = 'full';
            result = now.toLocaleDateString('sr-Latn', opts);
            break;
          case 'time':
            opts.timeStyle = 'long';
            result = now.toLocaleTimeString('sr-Latn', opts);
            break;
          case 'iso':
            result = now.toISOString();
            break;
          default:
            opts.dateStyle = 'full';
            opts.timeStyle = 'long';
            result = now.toLocaleString('sr-Latn', opts);
        }

        return JSON.stringify({ datetime: result, timezone: tz, format });
      } catch {
        return JSON.stringify({ error: `Nepoznata timezone: ${tz}` });
      }
    }

    case 'calculate': {
      const expression = args.expression as string;
      try {
        const result = safeEval(expression);
        return JSON.stringify({ expression, result });
      } catch (err) {
        return JSON.stringify({ error: `Greška u izrazu: ${(err as Error).message}` });
      }
    }

    case 'web_search': {
      const query = args.query as string;
      const numResults = Math.min(Math.max((args.num_results as number) || 3, 1), 5);

      // Tavily Search API integration
      const tavilyKey = process.env.TAVILY_API_KEY;
      if (tavilyKey) {
        try {
          const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: tavilyKey,
              query,
              max_results: numResults,
              include_answer: true,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            return JSON.stringify({
              query,
              answer: data.answer ?? null,
              results: (data.results ?? []).slice(0, numResults).map((r: { title: string; url: string; content: string }) => ({
                title: r.title,
                url: r.url,
                snippet: r.content?.slice(0, 300),
              })),
            });
          }
        } catch {
          // Fallback to mock
        }
      }

      // Fallback: no search API key configured
      return JSON.stringify({
        query,
        info: 'Web pretraga nije dostupna u ovom trenutku. TAVILY_API_KEY nije konfigurisan.',
        suggestion: 'Pokušaću da odgovorim na osnovu svog znanja.',
      });
    }

    case 'generate_image': {
      const prompt = args.prompt as string;
      const size = (args.size as string) || '1024x1024';
      const quality = (args.quality as string) || 'standard';

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return JSON.stringify({ error: 'OpenAI API ključ nije konfigurisan.' });
      }

      try {
        const { getOpenAI } = await import('@/lib/openai/client');
        const openai = getOpenAI();
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: size as '1024x1024' | '1792x1024' | '1024x1792',
          quality: quality as 'standard' | 'hd',
        });

        const imageUrl = response.data?.[0]?.url;
        const revisedPrompt = response.data?.[0]?.revised_prompt;

        return JSON.stringify({
          success: true,
          imageUrl,
          revisedPrompt,
          size,
          quality,
        });
      } catch (err) {
        return JSON.stringify({ error: `Greška pri generisanju slike: ${(err as Error).message}` });
      }
    }

    case 'convert_currency': {
      const amount = args.amount as number;
      const from = (args.from as string).toUpperCase();
      const to = (args.to as string).toUpperCase();

      const fromRate = EXCHANGE_RATES[from];
      const toRate = EXCHANGE_RATES[to];

      if (!fromRate || !toRate) {
        return JSON.stringify({ error: `Nepoznata valuta: ${!fromRate ? from : to}` });
      }

      // Convert through EUR as base
      const eurAmount = amount / fromRate;
      const result = eurAmount * toRate;

      return JSON.stringify({
        amount,
        from,
        to,
        result: Math.round(result * 100) / 100,
        rate: Math.round((toRate / fromRate) * 10000) / 10000,
        note: 'Kursevi su aproksimativni.',
      });
    }

    default:
      return JSON.stringify({ error: `Nepoznat alat: ${name}` });
  }
}

// ─── Tool-aware chat completion ─────────────────────────────────────────

export async function chatWithTools(
  openai: OpenAI,
  model: string,
  messages: OpenAI.ChatCompletionMessageParam[],
  maxTokens: number,
  temperature: number,
): Promise<{ reply: string; toolResults: string[]; totalTokens: number }> {
  const toolResults: string[] = [];
  let totalTokens = 0;
  const conversationMessages = [...messages];

  // Allow up to 5 tool call rounds
  for (let round = 0; round < 5; round++) {
    const completion = await openai.chat.completions.create({
      model,
      messages: conversationMessages,
      max_tokens: maxTokens,
      temperature,
      tools: SPAJA_TOOLS,
      tool_choice: 'auto',
    });

    totalTokens += completion.usage?.total_tokens ?? 0;
    const choice = completion.choices[0];

    if (!choice) {
      return { reply: 'Nema odgovora.', toolResults, totalTokens };
    }

    // If no tool calls, return the text response
    if (choice.finish_reason !== 'tool_calls' || !choice.message.tool_calls?.length) {
      return {
        reply: choice.message.content ?? 'Nema odgovora.',
        toolResults,
        totalTokens,
      };
    }

    // Execute tool calls
    conversationMessages.push(choice.message);

    for (const toolCall of choice.message.tool_calls) {
      if (toolCall.type !== 'function') continue;
      const funcCall = toolCall as { type: 'function'; id: string; function: { name: string; arguments: string } };
      const toolArgs = JSON.parse(funcCall.function.arguments) as Record<string, unknown>;
      const result = await executeTool(funcCall.function.name, toolArgs);
      toolResults.push(`${funcCall.function.name}: ${result}`);

      conversationMessages.push({
        role: 'tool',
        tool_call_id: funcCall.id,
        content: result,
      });
    }
  }

  // If we exhausted all rounds, get a final response without tools
  const finalCompletion = await openai.chat.completions.create({
    model,
    messages: conversationMessages,
    max_tokens: maxTokens,
    temperature,
  });

  totalTokens += finalCompletion.usage?.total_tokens ?? 0;
  return {
    reply: finalCompletion.choices[0]?.message?.content ?? 'Nema odgovora.',
    toolResults,
    totalTokens,
  };
}
