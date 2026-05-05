/**
 * Exclusives Grid Section
 * 
 * Displays exclusive content in a responsive grid layout.
 */

'use client';

import { Content } from '@/services/feed';
import { ExclusiveContentCard } from '@/components/exclusive-content-card';
import { Lock } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ExclusivesGridSectionProps {
  content: Content[];
}

/**
 * Exclusives grid section component
 * 
 * @param content - Array of content items (filtered to locked/premium only)
 */
export function ExclusivesGridSection({ content }: ExclusivesGridSectionProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  
  // Filter to only locked/premium content
  const exclusiveContent = content.filter(item => item.is_locked || item.is_paid);
  
  if (exclusiveContent.length === 0) {
    return null;
  }
  
  const handleUnlock = (contentId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Navigate to content page which will handle payment
    router.push(`/content/${contentId}`);
  };
  
  return (
    <div className="px-4 py-6 space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5" style={{ color: 'var(--profile-primary)' }} />
        <h2 className="text-xl font-bold">Exclusives</h2>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-3">
        {exclusiveContent.map((item) => (
          <ExclusiveContentCard
            key={item.id}
            content={{
              id: item.id,
              thumbnailUrl: item.thumbnail_url,
              title: item.title,
              isLocked: item.is_locked,
              price: item.price,
              type: item.type,
            }}
            onUnlock={handleUnlock}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
}
