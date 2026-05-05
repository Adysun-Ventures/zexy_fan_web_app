'use client';

import { useParams } from 'next/navigation';
import { useCreatorContent } from '@/hooks/useFeed';
import { useCreatorPlans } from '@/hooks/useSubscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/feed/content-card';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CreatorPage() {
  const params = useParams();
  const creatorId = parseInt(params.id as string);

  const { data: content, isLoading: contentLoading } = useCreatorContent(creatorId);
  const { data: plans, isLoading: plansLoading } = useCreatorPlans(creatorId);

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const firstContent = content?.[0];

  return (
    <div className="space-y-6">
      <Link href="/feed">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </Link>

      {/* Creator Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold">
              {firstContent?.creator_name?.[0] || 'C'}
            </div>
            <div className="flex-1">
              <CardTitle>{firstContent?.creator_name || 'Creator'}</CardTitle>
              <p className="text-sm text-muted-foreground">@{firstContent?.creator_username}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Subscription Plans */}
      {plans && plans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Subscription Plans</h2>
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(plan.price)}</p>
                      <p className="text-xs text-muted-foreground">{plan.duration_days} days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Subscribe</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Creator Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Content</h2>
        {content && content.length > 0 ? (
          <div className="grid gap-6">
            {content.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No content available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
