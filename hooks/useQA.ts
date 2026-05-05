/**
 * React Query hooks for Q&A functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qaService } from '@/services/qa';

/**
 * Hook to fetch Q&A items for a creator
 * 
 * @param creatorId - Creator ID
 * @param limit - Maximum number of items to return
 * @param offset - Offset for pagination
 * @returns React Query result with Q&A items
 * 
 * @example
 * const { data: qaItems, isLoading } = useQAItems(1);
 */
export function useQAItems(
  creatorId: number,
  limit: number = 10,
  offset: number = 0
) {
  return useQuery({
    queryKey: ['creator', 'qa', creatorId, limit, offset],
    queryFn: () => qaService.getQAItems(creatorId, limit, offset),
    enabled: !!creatorId && creatorId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to submit a question to a creator
 * 
 * @param creatorId - Creator ID
 * @returns Mutation function and state
 * 
 * @example
 * const { mutate: submitQuestion, isPending } = useSubmitQuestion(1);
 * submitQuestion('What time do you post new content?');
 */
export function useSubmitQuestion(creatorId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: string) =>
      qaService.submitQuestion(creatorId, question),
    onSuccess: () => {
      // Invalidate Q&A queries for this creator
      queryClient.invalidateQueries({
        queryKey: ['creator', 'qa', creatorId],
      });
    },
  });
}
