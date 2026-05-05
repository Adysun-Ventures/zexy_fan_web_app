import { useQuery, useMutation } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptions';
import { queryClient } from '@/lib/queryClient';

export function useCreatorPlans(creatorId: number) {
  return useQuery({
    queryKey: ['creator', creatorId, 'plans'],
    queryFn: () => subscriptionService.getCreatorPlans(creatorId),
    enabled: !!creatorId,
  });
}

export function useMySubscriptions() {
  return useQuery({
    queryKey: ['subscriptions', 'my'],
    queryFn: () => subscriptionService.getMySubscriptions(),
  });
}

export function useCancelSubscription() {
  return useMutation({
    mutationFn: (subscriptionId: number) => subscriptionService.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'my'] });
    },
  });
}
