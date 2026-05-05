/**
 * Membership Card Section
 * 
 * Displays membership subscription card with benefits.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthContext } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  description?: string | null;
}

interface MembershipCardSectionProps {
  plans: MembershipPlan[];
  isSubscribed: boolean;
}

/**
 * Membership card section component
 * 
 * @param plans - Array of membership plans
 * @param isSubscribed - Whether user is currently subscribed
 */
export function MembershipCardSection({ 
  plans, 
  isSubscribed 
}: MembershipCardSectionProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  
  if (!plans || plans.length === 0) {
    return null;
  }
  
  // Show first plan (primary plan)
  const plan = plans[0];
  
  const handleSubscribe = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Navigate to subscriptions page
    router.push('/subscriptions');
  };
  
  return (
    <div className="px-4 py-6">
      <Card
        className="border-2 overflow-hidden"
        style={{
          borderColor: 'var(--profile-primary)',
        }}
      >
        <div
          className="h-2"
          style={{
            background: 'linear-gradient(to right, var(--profile-gradient-start), var(--profile-gradient-end))',
          }}
        />
        
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" style={{ color: 'var(--profile-primary)' }} />
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
          </div>
          {plan.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {plan.description}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{ color: 'var(--profile-primary)' }}>
              {formatCurrency(plan.price)}
            </span>
            <span className="text-muted-foreground">
              / {plan.duration_days} days
            </span>
          </div>
          
          {/* Benefits */}
          <div className="space-y-2">
            <p className="font-semibold text-sm">What you get:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--profile-primary)' }} />
                <span>Access to all exclusive content</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--profile-primary)' }} />
                <span>Direct messaging with creator</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--profile-primary)' }} />
                <span>Early access to new content</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--profile-primary)' }} />
                <span>Exclusive community access</span>
              </li>
            </ul>
          </div>
          
          {/* Subscribe Button */}
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleSubscribe}
            disabled={isSubscribed}
            style={{
              background: isSubscribed 
                ? undefined 
                : 'linear-gradient(to right, var(--profile-gradient-start), var(--profile-gradient-end))',
            }}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
