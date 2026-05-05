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

export function useCreatorByUsername(username: string) {
  return useQuery({
    queryKey: ['creator', 'username', username],
    queryFn: () => feedService.getCreatorByUsername(username),
    enabled: !!username,
  });
}

export function useCreatorContentByUsername(username: string) {
  return useQuery({
    queryKey: ['creator', 'username', username, 'content'],
    queryFn: () => feedService.getCreatorContentByUsername(username),
    enabled: !!username,
  });
}
