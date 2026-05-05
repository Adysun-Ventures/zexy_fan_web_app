import { apiClient } from '@/lib/axios';
import { ENV } from '@/constants/env';
import { sleep } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface SubscriptionPlan {
  id: number;
  creator_uid: number;
  name: string;
  price: number;
  duration_days: number;
  description: string | null;
  is_active: boolean;
}

export interface ActiveSubscription {
  id: number;
  fan_uid: number;
  creator_uid: number;
  creator_username: string;
  creator_name: string;
  subscription_id: number;
  plan_name: string;
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expires_at: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    creator_uid: 1,
    name: 'Monthly Access',
    price: 299,
    duration_days: 30,
    description: 'Full access to all exclusive content for 30 days',
    is_active: true,
  },
  {
    id: 2,
    creator_uid: 1,
    name: 'Quarterly Access',
    price: 799,
    duration_days: 90,
    description: 'Save 10% with quarterly subscription',
    is_active: true,
  },
];

const MOCK_ACTIVE_SUBSCRIPTIONS: ActiveSubscription[] = [
  {
    id: 1,
    fan_uid: 1,
    creator_uid: 2,
    creator_username: 'creator_two',
    creator_name: 'Mike Chen',
    subscription_id: 3,
    plan_name: 'Monthly Access',
    status: 'active',
    started_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 20).toISOString(),
  },
];

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const subscriptionService = {
  /**
   * Get creator's subscription plans
   */
  getCreatorPlans: async (creatorId: number): Promise<SubscriptionPlan[]> => {
    if (ENV.IS_MOCK) {
      await sleep(600);
      return MOCK_PLANS.map((p) => ({ ...p, creator_uid: creatorId }));
    }

    const response = await apiClient.get(`/api/v1/fan/creators/${creatorId}/subscriptions`);
    return response.data.data;
  },

  /**
   * Get fan's active subscriptions
   */
  getMySubscriptions: async (): Promise<ActiveSubscription[]> => {
    if (ENV.IS_MOCK) {
      await sleep(500);
      return MOCK_ACTIVE_SUBSCRIPTIONS;
    }

    const response = await apiClient.get('/api/v1/fan/subscriptions');
    return response.data.data;
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (subscriptionId: number): Promise<void> => {
    if (ENV.IS_MOCK) {
      await sleep(700);
      return;
    }

    await apiClient.post(`/api/v1/fan/subscriptions/${subscriptionId}/cancel`);
  },
};
