'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCreators } from '@/hooks/useFeed';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function CreatorPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = parseInt(params.id as string);

  const { data: creators, isLoading } = useCreators();

  useEffect(() => {
    if (creators && creatorId) {
      const creator = creators.find((c) => c.id === creatorId);
      if (creator) {
        // Redirect to username-based route
        router.replace(`/creator/${creator.username}`);
      }
    }
  }, [creators, creatorId, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
