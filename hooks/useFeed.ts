import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CreatorFilters, feedService } from '@/services/feed';

export function useCreators() {
  return useQuery({
    queryKey: ['creators'],
    queryFn: () => feedService.getCreators(),
  });
}

export function useInfiniteCreators(filters: CreatorFilters) {
  return useInfiniteQuery({
    queryKey: ['creators', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      feedService.getCreatorsPage({
        cursor: (pageParam as number | null) ?? null,
        limit: 40,
        filters,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
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
