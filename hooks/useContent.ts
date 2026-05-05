import { useQuery, useMutation } from '@tanstack/react-query';
import { contentService } from '@/services/content';
import { queryClient } from '@/lib/queryClient';

export function useContentDetail(contentId: number) {
  return useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentService.getContentDetail(contentId),
    enabled: !!contentId,
  });
}

export function useUnlockContent() {
  return useMutation({
    mutationFn: (contentId: number) => contentService.unlockContent(contentId),
    onSuccess: (data) => {
      // Update content detail cache
      queryClient.setQueryData(['content', data.id], data);
      
      // Invalidate feed to show unlocked content
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['creator', data.creator_uid, 'content'] });
    },
  });
}
