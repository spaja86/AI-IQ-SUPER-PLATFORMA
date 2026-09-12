import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { appendMessage, createConversation, listConversations, setSpajaDrustvenaMrezaHeaders } from '@/lib/spaja-drustvena-mreza';
import type { SocialAudience, SocialVisibility } from '@/lib/spaja-drustvena-mreza';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get('participantId') ?? undefined;
    const audience = searchParams.get('audience') as SocialAudience | null;
    const threads = listConversations({ participantId, audience: audience ?? undefined });
    const response = apiSuccess({ threads, count: threads.length }, 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/messages GET', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('BAD_REQUEST', 'Invalid JSON body');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return apiError('BAD_REQUEST', 'Body must be a JSON object');
    }

    const candidate = body as Record<string, unknown>;
    const action = typeof candidate.action === 'string' ? candidate.action : 'create';

    const result = action === 'reply'
      ? appendMessage(String(candidate.threadId ?? ''), String(candidate.authorId ?? ''), String(candidate.content ?? ''))
      : (() => {
          if (!Array.isArray(candidate.participantIds)) return { ok: false, code: 'BAD_REQUEST' as const, message: 'participantIds is required (array)' };
          if (typeof candidate.audience !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'audience is required (string)' };
          if (typeof candidate.visibility !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'visibility is required (string)' };
          if (typeof candidate.subject !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'subject is required (string)' };
          if (typeof candidate.content !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'content is required (string)' };
          if (typeof candidate.authorId !== 'string') return { ok: false, code: 'BAD_REQUEST' as const, message: 'authorId is required (string)' };
          return createConversation({
            participantIds: candidate.participantIds as string[],
            audience: candidate.audience as SocialAudience,
            visibility: candidate.visibility as SocialVisibility,
            subject: candidate.subject,
            content: candidate.content,
            authorId: candidate.authorId,
          });
        })();

    if (!result.ok) return apiError(result.code ?? 'UNPROCESSABLE_ENTITY', result.message);

    const response = apiSuccess(result.data, action === 'create' ? 201 : 200);
    setSpajaDrustvenaMrezaHeaders(response);
    return response;
  } catch (error) {
    return apiInternalError('spaja-drustvena-mreza/messages POST', error);
  }
}
