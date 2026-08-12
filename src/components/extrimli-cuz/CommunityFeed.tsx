// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { CommunityFeedPost } from '@/lib/extrimli-cuz';
import { FeedPostCard } from './FeedPostCard';

interface CommunityFeedProps {
  posts: CommunityFeedPost[];
  currentAthleteId?: string;
  onLike?: (postId: string) => void;
}

export function CommunityFeed({ posts, currentAthleteId, onLike }: CommunityFeedProps) {
  if (posts.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No posts yet. Be the first to share!</p>;
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          currentAthleteId={currentAthleteId}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
