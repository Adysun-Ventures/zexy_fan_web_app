import { apiClient } from '@/lib/axios';
import { ENV } from '@/constants/env';
import { sleep } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface CreateIntentRequest {
  purpose: 'subscription' | 'content' | 'product' | 'message' | 'live_access' | 'tip';
  reference_id: number;
  amount?: number; // Required for tips
  reference_type?: string; // 'creator' for standalone tips
  extra_data?: Record<string, any>;
}

export interface CreateIntentResponse {
  intent_id: number;
  gateway_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface VerifyPaymentRequest {
  gateway_order_id: string;
  gateway_payment_id: string;
  gateway_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  transaction_id: number;
  purpose: string;
  reference_id: number;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const paymentService = {
  /**
   * Create payment intent
   */
  createIntent: async (data: CreateIntentRequest): Promise<CreateIntentResponse> => {
    if (ENV.IS_MOCK) {
      await sleep(800);
      return {
        intent_id: Math.floor(Math.random() * 10000),
        gateway_order_id: 'order_mock_' + Date.now(),
        amount: data.amount || 99,
        currency: 'INR',
        key_id: ENV.RAZORPAY_KEY_ID,
      };
    }

    const response = await apiClient.post('/api/v1/common/payments/create-intent', data);
    return response.data.data;
  },

  /**
   * Verify payment after Razorpay success
   */
  verifyPayment: async (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    if (ENV.IS_MOCK) {
      await sleep(1200);
      return {
        success: true,
        transaction_id: Math.floor(Math.random() * 10000),
        purpose: 'content',
        reference_id: 1,
      };
    }

    const response = await apiClient.post('/api/v1/common/payments/verify', data);
    return response.data.data;
  },
};
