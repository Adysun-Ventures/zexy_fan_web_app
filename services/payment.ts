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
  mock_checkout_url?: string | null;
  payment_gateway?: string | null;
}

export type CheckoutSimOutcome = 'success' | 'failure' | 'cancel';

export interface StartCheckoutParams {
  intent: CreateIntentResponse;
  /** When omitted: success if ENV.IS_MOCK, else success (no real SDK yet). */
  simulate?: CheckoutSimOutcome;
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

    const response = await apiClient.post('/api/v1/fan/payments/create-intent', data);
    return response.data.data || response.data;
  },

  /**
   * Client-side checkout simulation (no gateway SDK). Use verifyPayload with verifyPayment when outcome is success.
   */
  startCheckout: async (
    params: StartCheckoutParams
  ): Promise<{
    outcome: CheckoutSimOutcome;
    verifyPayload?: VerifyPaymentRequest;
    errorMessage?: string;
  }> => {
    const intent = params.intent;
    
    // If we have a mock checkout URL, we should ideally show the simulation UI.
    // For now, we simulate the delay and return the success payload.
    const simulate: CheckoutSimOutcome =
      params.simulate ?? (ENV.IS_MOCK ? 'success' : 'success');

    await sleep(simulate === 'cancel' ? 150 : 400);

    if (simulate === 'cancel') {
      return { outcome: 'cancel' };
    }
    if (simulate === 'failure') {
      return { outcome: 'failure', errorMessage: 'Checkout failed (simulated)' };
    }

    const verifyPayload: VerifyPaymentRequest = {
      gateway_order_id: intent.gateway_order_id,
      gateway_payment_id: 'pay_mock_' + Date.now(),
      gateway_signature: 'sig_mock_' + Date.now(),
    };
    return { outcome: 'success', verifyPayload };
  },

  /**
   * Verify payment after gateway success
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

    const response = await apiClient.post('/api/v1/fan/payments/verify', data);
    return response.data.data || response.data;
  },
};
