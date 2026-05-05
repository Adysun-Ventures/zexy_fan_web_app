import { useMutation } from '@tanstack/react-query';
import { paymentService, type CreateIntentRequest, type VerifyPaymentRequest } from '@/services/payment';

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (data: CreateIntentRequest) => paymentService.createIntent(data),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => paymentService.verifyPayment(data),
  });
}
