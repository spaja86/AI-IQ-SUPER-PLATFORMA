// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { CommunityFeedPost } from '@/lib/extrimli-cuz';

interface FeedPostCardProps {
  post: CommunityFeedPost;
  currentAthleteId?: string;
  onLike?: (postId: string) => void;
}

const TYPE_ICON: Record<string, string> = {
  'session':       '🏃',
  'gear-review':   '🛒',
  'event-callout': '📅',
  'general':       '💬',
};

export function FeedPostCard({ post, currentAthleteId, onLike }: FeedPostCardProps) {
  const liked     = currentAthleteId ? post.likes.includes(currentAthleteId) : false;
  const dateStr   = new Date(post.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${post.flagged ? 'border-red-200 opacity-60' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
        <span>{TYPE_ICON[post.type] ?? '💬'}</span>
        <span className="font-medium text-gray-700">{post.athleteId}</span>
        <span>·</span>
        <span className="capitalize">{post.sportId}</span>
        <span>·</span>
        <span>{dateStr}</span>
        {post.flagged && <span className="ml-auto text-red-500 font-medium">⚑ Flagged</span>}
      </div>

      <p className="text-sm text-gray-800 mb-3">{post.content}</p>

      <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
        {post.sessionId && <span>🏋 Session: {post.sessionId}</span>}
        {post.eventId   && <span>📅 Event: {post.eventId}</span>}
        {post.gearSku   && <span>🛒 Gear: {post.gearSku}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onLike?.(post.id)}
          className={`text-xs rounded-lg px-3 py-1 transition ${
            liked
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          👍 {post.likes.length}
        </button>
        <a
          href={`/extrimli-cuz/feed/${post.id}`}
          className="text-xs text-blue-500 hover:underline"
        >
          Share
        </a>
      </div>
    </div>
  );
}
