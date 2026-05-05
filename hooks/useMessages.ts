import { useQuery, useMutation } from '@tanstack/react-query';
import { messageService } from '@/services/messages';
import { queryClient } from '@/lib/queryClient';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  });
}

export function useMessageThread(creatorId: number) {
  return useQuery({
    queryKey: ['messages', 'thread', creatorId],
    queryFn: () => messageService.getThread(creatorId),
    enabled: !!creatorId,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: ({ creatorId, body }: { creatorId: number; body: string }) =>
      messageService.sendMessage(creatorId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'thread', variables.creatorId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: (messageId: number) => messageService.markAsRead(messageId),
  });
}
