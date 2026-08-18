// SpajaUltraOmegaCore -∞Ω+∞ — CHATGPT KATALOG Registry
// Kompanija SPAJA — Digitalna Industrija

import type { GPTModel, GPTTool, GPTUseCase } from './types';

// ─── GPT Models ───────────────────────────────────────────────────────────────

export const GPT_MODELS: GPTModel[] = [
  {
    type: 'model',
    id: 'gpt-4o',
    name: 'GPT-4o',
    version: '4o',
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'function-calling', 'json-mode', 'structured-outputs', 'audio'],
    pricing: { inputPer1kTokens: 0.005, outputPer1kTokens: 0.015, currency: 'USD' },
    releaseDate: '2024-05-13',
    status: 'active',
    speedTier: 'fast',
    description: 'OpenAI flagship multimodal model — text, vision, audio, and function calling in one.',
    tags: ['multimodal', 'flagship', 'vision', 'audio', 'fast'],
  },
  {
    type: 'model',
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    version: '4o-mini',
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'function-calling', 'json-mode', 'structured-outputs'],
    pricing: { inputPer1kTokens: 0.00015, outputPer1kTokens: 0.0006, currency: 'USD' },
    releaseDate: '2024-07-18',
    status: 'active',
    speedTier: 'fast',
    description: 'Small, affordable, fast model for lightweight tasks. Best price/performance ratio.',
    tags: ['budget', 'fast', 'lightweight', 'vision'],
  },
  {
    type: 'model',
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    version: '4-turbo',
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'function-calling', 'json-mode'],
    pricing: { inputPer1kTokens: 0.01, outputPer1kTokens: 0.03, currency: 'USD' },
    releaseDate: '2024-04-09',
    status: 'active',
    speedTier: 'medium',
    description: 'High-capability model with 128k context, vision support, and function calling.',
    tags: ['powerful', 'vision', 'large-context'],
  },
  {
    type: 'model',
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    version: '3.5-turbo',
    contextWindow: 16385,
    capabilities: ['text', 'function-calling', 'json-mode'],
    pricing: { inputPer1kTokens: 0.0005, outputPer1kTokens: 0.0015, currency: 'USD' },
    releaseDate: '2022-11-30',
    status: 'legacy',
    speedTier: 'fast',
    description: 'Classic fast model for simple text tasks. Lower cost, legacy status.',
    tags: ['legacy', 'budget', 'fast'],
  },
  {
    type: 'model',
    id: 'o1',
    name: 'o1',
    version: 'o1',
    contextWindow: 200000,
    capabilities: ['text', 'reasoning', 'structured-outputs', 'function-calling'],
    pricing: { inputPer1kTokens: 0.015, outputPer1kTokens: 0.06, currency: 'USD' },
    releaseDate: '2024-12-17',
    status: 'active',
    speedTier: 'slow',
    description: 'Advanced reasoning model — excels at complex math, code, and science tasks.',
    tags: ['reasoning', 'math', 'science', 'code', 'large-context'],
  },
  {
    type: 'model',
    id: 'o1-mini',
    name: 'o1-mini',
    version: 'o1-mini',
    contextWindow: 128000,
    capabilities: ['text', 'reasoning'],
    pricing: { inputPer1kTokens: 0.003, outputPer1kTokens: 0.012, currency: 'USD' },
    releaseDate: '2024-09-12',
    status: 'active',
    speedTier: 'medium',
    description: 'Compact reasoning model. Faster and cheaper than o1 for simpler reasoning tasks.',
    tags: ['reasoning', 'budget', 'code'],
  },
  {
    type: 'model',
    id: 'o3-mini',
    name: 'o3-mini',
    version: 'o3-mini',
    contextWindow: 200000,
    capabilities: ['text', 'reasoning', 'function-calling', 'structured-outputs'],
    pricing: { inputPer1kTokens: 0.0011, outputPer1kTokens: 0.0044, currency: 'USD' },
    releaseDate: '2025-01-31',
    status: 'active',
    speedTier: 'fast',
    description: 'Next-generation compact reasoning model. High performance at low cost.',
    tags: ['reasoning', 'fast', 'budget', 'large-context'],
  },
  {
    type: 'model',
    id: 'gpt-4',
    name: 'GPT-4',
    version: '4',
    contextWindow: 8192,
    capabilities: ['text', 'function-calling'],
    pricing: { inputPer1kTokens: 0.03, outputPer1kTokens: 0.06, currency: 'USD' },
    releaseDate: '2023-03-14',
    status: 'deprecated',
    speedTier: 'slow',
    description: 'Original GPT-4. Superseded by GPT-4 Turbo and GPT-4o.',
    tags: ['deprecated', 'original'],
  },
];

// ─── GPT Tools ────────────────────────────────────────────────────────────────

export const GPT_TOOLS: GPTTool[] = [
  {
    type: 'tool',
    id: 'dalle-3',
    name: 'DALL·E 3',
    category: 'image-generation',
    description: 'Generate high-quality images from text prompts. Supports HD quality and multiple styles.',
    apiEndpoint: 'POST /v1/images/generations',
    integrationGuide: 'Pass model="dall-e-3", prompt, size (1024x1024, 1024x1792, 1792x1024), quality (standard/hd), n=1.',
    tags: ['image', 'generation', 'creative', 'multimodal'],
  },
  {
    type: 'tool',
    id: 'whisper-1',
    name: 'Whisper',
    category: 'audio-transcription',
    description: 'Automatic speech recognition — transcribes or translates audio into text.',
    apiEndpoint: 'POST /v1/audio/transcriptions',
    integrationGuide: 'Send audio file (mp3, mp4, wav, webm, etc.) up to 25MB. Supports language detection and translation.',
    tags: ['audio', 'transcription', 'speech', 'multilingual'],
  },
  {
    type: 'tool',
    id: 'tts-1',
    name: 'TTS (Text-to-Speech)',
    category: 'audio-synthesis',
    description: 'Convert text to natural-sounding speech. Multiple voices available.',
    apiEndpoint: 'POST /v1/audio/speech',
    integrationGuide: 'Specify model (tts-1 or tts-1-hd), voice (alloy, echo, fable, onyx, nova, shimmer), and input text.',
    tags: ['audio', 'speech', 'synthesis', 'voice'],
  },
  {
    type: 'tool',
    id: 'embeddings-3-small',
    name: 'Embeddings (text-embedding-3-small)',
    category: 'embeddings',
    description: 'Convert text to numerical vector representations for semantic search, clustering, and classification.',
    apiEndpoint: 'POST /v1/embeddings',
    integrationGuide: 'Pass input text or array of texts. Returns 1536-dimension float vectors. Use for vector similarity search.',
    tags: ['embeddings', 'semantic-search', 'nlp', 'vector'],
  },
  {
    type: 'tool',
    id: 'embeddings-3-large',
    name: 'Embeddings (text-embedding-3-large)',
    category: 'embeddings',
    description: 'Higher-quality embeddings (3072 dimensions) for precision-critical applications.',
    apiEndpoint: 'POST /v1/embeddings',
    integrationGuide: 'Use model="text-embedding-3-large". Supports dimension reduction with dimensions parameter.',
    tags: ['embeddings', 'high-quality', 'semantic-search', 'vector'],
  },
  {
    type: 'tool',
    id: 'fine-tuning',
    name: 'Fine-Tuning',
    category: 'model-customization',
    description: 'Customize GPT-3.5 Turbo or GPT-4o-mini on your own dataset for specific use cases.',
    apiEndpoint: 'POST /v1/fine_tuning/jobs',
    integrationGuide: 'Upload JSONL training file, create fine-tuning job, monitor with GET /v1/fine_tuning/jobs/{id}.',
    tags: ['fine-tuning', 'customization', 'training', 'enterprise'],
  },
  {
    type: 'tool',
    id: 'moderation',
    name: 'Moderation',
    category: 'safety',
    description: 'Classify text for harmful content — hate, self-harm, violence, sexual content.',
    apiEndpoint: 'POST /v1/moderations',
    integrationGuide: 'Free to use. Returns category flags and scores. Use before storing or displaying user content.',
    tags: ['safety', 'moderation', 'content-policy', 'free'],
  },
  {
    type: 'tool',
    id: 'assistants-api',
    name: 'Assistants API',
    category: 'agents',
    description: 'Build AI assistants with persistent threads, code interpreter, file search, and function calling.',
    apiEndpoint: 'POST /v1/assistants',
    integrationGuide: 'Create assistant with instructions and tools. Use threads for persistent conversations.',
    tags: ['agents', 'assistants', 'code-interpreter', 'file-search', 'threads'],
  },
];

// ─── GPT Use Cases ────────────────────────────────────────────────────────────

export const GPT_USE_CASES: GPTUseCase[] = [
  {
    type: 'use-case',
    id: 'uc-customer-support',
    title: 'Customer Support Chatbot',
    domain: 'customer-service',
    prompt: 'You are a helpful customer support agent for {company}. Answer user questions based on the provided knowledge base. Be concise, professional, and empathetic.',
    expectedOutput: 'Accurate, empathetic responses to customer queries with appropriate escalation suggestions.',
    difficulty: 'beginner',
    tags: ['chatbot', 'support', 'customer-service'],
    recommendedModelId: 'gpt-4o-mini',
  },
  {
    type: 'use-case',
    id: 'uc-code-review',
    title: 'Automated Code Review',
    domain: 'software-development',
    prompt: 'Review the following code for bugs, security vulnerabilities, and performance issues. Provide specific line-by-line feedback with suggested fixes:\n\n{code}',
    expectedOutput: 'Structured code review with severity ratings, specific line references, and corrected code snippets.',
    difficulty: 'intermediate',
    tags: ['code', 'review', 'security', 'development'],
    recommendedModelId: 'gpt-4o',
  },
  {
    type: 'use-case',
    id: 'uc-data-analysis',
    title: 'Structured Data Analysis',
    domain: 'analytics',
    prompt: 'Analyze the following dataset and provide: 1) key trends, 2) anomalies, 3) actionable insights. Return results as JSON.\n\nData: {data}',
    expectedOutput: 'JSON object with trends array, anomalies array, and recommendations array.',
    difficulty: 'intermediate',
    tags: ['analytics', 'data', 'json', 'structured-output'],
    recommendedModelId: 'gpt-4o',
  },
  {
    type: 'use-case',
    id: 'uc-math-reasoning',
    title: 'Advanced Math & Science Reasoning',
    domain: 'education',
    prompt: 'Solve the following problem step by step, showing all work and explaining each step:\n\n{problem}',
    expectedOutput: 'Step-by-step solution with clear explanations and final verified answer.',
    difficulty: 'advanced',
    tags: ['math', 'science', 'reasoning', 'education'],
    recommendedModelId: 'o1',
  },
  {
    type: 'use-case',
    id: 'uc-document-summarization',
    title: 'Long Document Summarization',
    domain: 'productivity',
    prompt: 'Summarize the following document in 3 levels: 1) one-sentence TL;DR, 2) paragraph summary, 3) key bullet points. Document:\n\n{document}',
    expectedOutput: 'Three-level summary: TL;DR, paragraph, and 5-7 bullet points.',
    difficulty: 'beginner',
    tags: ['summarization', 'productivity', 'documents', 'long-context'],
    recommendedModelId: 'gpt-4o',
  },
  {
    type: 'use-case',
    id: 'uc-image-analysis',
    title: 'Image Analysis & Description',
    domain: 'media',
    prompt: 'Analyze this image and provide: 1) detailed description, 2) objects detected, 3) text extracted (if any), 4) suggested metadata tags.',
    expectedOutput: 'Structured image analysis with description, object list, OCR text, and tags array.',
    difficulty: 'beginner',
    tags: ['vision', 'image', 'analysis', 'ocr', 'multimodal'],
    recommendedModelId: 'gpt-4o',
  },
  {
    type: 'use-case',
    id: 'uc-semantic-search',
    title: 'Semantic Search System',
    domain: 'search',
    prompt: 'Use embeddings to find the most relevant documents to a user query. Query: {query}\n\nReturn top-5 matches with similarity scores.',
    expectedOutput: 'Ranked list of matching documents with cosine similarity scores.',
    difficulty: 'advanced',
    tags: ['embeddings', 'search', 'vector', 'rag'],
    recommendedModelId: undefined,
  },
  {
    type: 'use-case',
    id: 'uc-content-moderation',
    title: 'Content Safety Moderation Pipeline',
    domain: 'safety',
    prompt: 'Screen the following user-generated content for policy violations before publishing. Flag severity (low/medium/high) and category.',
    expectedOutput: 'Safety report with violation flags, severity, category, and allow/block decision.',
    difficulty: 'intermediate',
    tags: ['safety', 'moderation', 'content-policy'],
    recommendedModelId: undefined,
  },
];

// ─── Registry Lookup ──────────────────────────────────────────────────────────

export function getModelById(id: string): GPTModel | undefined {
  return GPT_MODELS.find((m) => m.id === id);
}

export function getToolById(id: string): GPTTool | undefined {
  return GPT_TOOLS.find((t) => t.id === id);
}

export function getUseCaseById(id: string): GPTUseCase | undefined {
  return GPT_USE_CASES.find((u) => u.id === id);
}

export function getEntryById(id: string): GPTModel | GPTTool | GPTUseCase | undefined {
  return getModelById(id) ?? getToolById(id) ?? getUseCaseById(id);
}

export function getAllEntries(): Array<GPTModel | GPTTool | GPTUseCase> {
  return [...GPT_MODELS, ...GPT_TOOLS, ...GPT_USE_CASES];
}
