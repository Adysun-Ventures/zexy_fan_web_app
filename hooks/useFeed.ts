import { useQuery } from '@tanstack/react-query';
import { feedService } from '@/services/feed';

export function useCreators() {
  return useQuery({
    queryKey: ['creators'],
    queryFn: () => feedService.getCreators(),
  });
}

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: () => feedService.getFeed(),
  });
}

export function useCreatorContent(creatorId: number) {
  return useQuery({
    queryKey: ['creator', creatorId, 'content'],
    queryFn: () => feedService.getCreatorContent(creatorId),
    enabled: !!creatorId,
  });
}
