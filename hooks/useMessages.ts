import { useQuery, useMutation } from '@tanstack/react-query';
import { messageService } from '@/services/messages';
import { paymentService } from '@/services/payment';
import { queryClient } from '@/lib/queryClient';
import { useAuthContext } from '@/hooks/useAuth';
import { mapMessageToConversationPreview } from '@/lib/message-conversations';
import { ENV } from '@/constants/env';

export function useConversations() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      const rows = await messageService.getConversations();
      if (!user) return [];
      return rows.map((m) => mapMessageToConversationPreview(m, user.id));
    },
    enabled: !!user,
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

/** Pay a chat tip demand: create intent → verify (Razorpay step simulated like other fan modals until checkout is wired). */
export function usePayTipDemand(creatorId: number) {
  return useMutation({
    mutationFn: async (messageId: number) => {
      const intent = await messageService.createTipDemandIntent(messageId);
      await new Promise((r) => setTimeout(r, ENV.IS_MOCK ? 800 : 1200));
      return paymentService.verifyPayment({
        gateway_order_id: intent.gateway_order_id,
        gateway_payment_id: 'pay_web_' + Date.now(),
        gateway_signature: 'sig_web_' + Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'thread', creatorId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
