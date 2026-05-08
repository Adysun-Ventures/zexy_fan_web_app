/**
 * Subscription Modal
 *
 * Handles the full subscribe → pay → activate flow for a creator's subscription plans.
 */

'use client';

import { useState } from 'react';
import { useCreateSubscriptionIntent, useActivateSubscription } from '@/hooks/useSubscriptions';
import { useVerifyPayment } from '@/hooks/usePayment';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, CheckCircle2, Crown, Loader2, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import type { SubscriptionPlan } from '@/services/subscriptions';

interface SubscriptionModalProps {
  creatorName: string;
  plans: SubscriptionPlan[];
  onClose: () => void;
  onSuccess?: () => void;
}

type Status = 'select' | 'processing' | 'success' | 'error';

export function SubscriptionModal({
  creatorName,
  plans,
  onClose,
  onSuccess,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plans[0]);
  const [status, setStatus] = useState<Status>('select');

  const createIntent = useCreateSubscriptionIntent();
  const verifyPayment = useVerifyPayment();
  const activateSubscription = useActivateSubscription();

  const handleSubscribe = async () => {
    setStatus('processing');
    try {
      // Step 1: Create payment intent
      const intent = await createIntent.mutateAsync(selectedPlan.id);

      // Step 2: Simulate Razorpay (in real app, open Razorpay modal here)
      await new Promise((r) => setTimeout(r, 1500));

      // Step 3: Verify payment
      await verifyPayment.mutateAsync({
        gateway_order_id: intent.gateway_order_id,
        gateway_payment_id: 'pay_mock_' + Date.now(),
        gateway_signature: 'sig_mock_' + Date.now(),
      });

      // Step 4: Activate subscription
      await activateSubscription.mutateAsync({
        planId: selectedPlan.id,
        gatewayOrderId: intent.gateway_order_id,
      });

      setStatus('success');
      toast.success(`Subscribed to ${creatorName}!`);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      toast.error(err.response?.data?.error?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <CardTitle>Subscribe to {creatorName}</CardTitle>
          <CardDescription>Choose a plan to get exclusive access</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'select' && (
            <>
              {/* Plan Picker */}
              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      selectedPlan.id === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{plan.name}</p>
                        {plan.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{plan.duration_days} days access</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xl font-bold">{formatCurrency(plan.price)}</p>
                        {selectedPlan.id === plan.id && (
                          <Check className="h-4 w-4 text-primary ml-auto mt-1" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Benefits */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What you get</p>
                {[
                  'Access to all exclusive content',
                  'Direct messaging with creator',
                  'Early access to new content',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing your subscription…</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-semibold">You're subscribed!</p>
              <p className="text-sm text-muted-foreground">Enjoy exclusive access to {creatorName}'s content.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="font-semibold text-destructive">Something went wrong</p>
              <p className="text-sm text-muted-foreground">Please try again.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-0">
          {(status === 'select' || status === 'error') && (
            <>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={status === 'error' ? () => setStatus('select') : handleSubscribe}
                style={{
                  background: 'linear-gradient(to right, var(--profile-gradient-start, #9333ea), var(--profile-gradient-end, #ec4899))',
                }}
              >
                {status === 'error' ? 'Try Again' : `Subscribe · ${formatCurrency(selectedPlan.price)}`}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
