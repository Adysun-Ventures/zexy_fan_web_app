'use client';

import { useFeed } from '@/hooks/useFeed';
import { ContentCard } from '@/components/feed/content-card';
import { SubscribedLatest } from '@/components/feed/subscribed-latest';
import { Loader2 } from 'lucide-react';

export default function FeedPage() {
  const { data: content, isLoading, error } = useFeed();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load feed</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feed</h1>
      
      {/* Subscribed Creators Latest Posts */}
      <SubscribedLatest />

      {!content || content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content available</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}
    </div>
  );
}
