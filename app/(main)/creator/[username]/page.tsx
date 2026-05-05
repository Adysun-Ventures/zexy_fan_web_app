'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCreatorByUsername, useCreatorContentByUsername } from '@/hooks/useFeed';
import { useCreatorPlans } from '@/hooks/useSubscriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Lock, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { PaymentModal } from '@/components/content/payment-modal';

export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const { data: creator, isLoading: creatorLoading, error: creatorError } = useCreatorByUsername(username);
  const { data: content, isLoading: contentLoading } = useCreatorContentByUsername(username);
  const { data: plans, isLoading: plansLoading } = useCreatorPlans(creator?.id || 0);

  const [selectedContent, setSelectedContent] = useState<{ id: number; amount: number; title: string } | null>(null);

  if (creatorLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (creatorError || !creator) {
    return (
      <div className="space-y-6">
        <Link href="/feed">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Creator not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter out premium/membership content (hide it completely)
  const publicContent = content?.filter((item) => item.visibility === 'public') || [];

  return (
    <div className="space-y-6">
      <Link href="/feed">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Button>
      </Link>

      {/* Creator Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-semibold">
              {creator.name[0]}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{creator.name}</CardTitle>
              <p className="text-sm text-muted-foreground">@{creator.username}</p>
              {creator.niche && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {creator.niche}
                  </span>
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{creator.subscriber_count.toLocaleString()} subscribers</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Subscription Plans */}
      {plans && plans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Subscription Plans</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.id} className="border-primary/20">
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
                  <Button className="w-full">Subscribe Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Creator Content (Public Only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Posts</h2>
          <p className="text-sm text-muted-foreground">
            {publicContent.length} {publicContent.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {contentLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : publicContent.length > 0 ? (
          <div className="grid gap-6">
            {publicContent.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.is_locked && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Lock className="h-3 w-3" />
                        {formatCurrency(item.price)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.is_locked ? (
                    <div className="relative">
                      {/* Blurred Preview */}
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-xl">
                        <div className="text-center space-y-4">
                          <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
                            <p className="font-semibold">Premium Content</p>
                            <p className="text-sm text-muted-foreground">Unlock to view</p>
                          </div>
                          <Button
                            onClick={() =>
                              setSelectedContent({
                                id: item.id,
                                amount: item.price,
                                title: item.title,
                              })
                            }
                          >
                            Unlock for {formatCurrency(item.price)}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Free Content Preview */}
                      <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Content Preview</p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`/content/${item.id}`)}
                      >
                        View Full Content
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{item.type}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No public posts available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Modal */}
      {selectedContent && (
        <PaymentModal
          contentId={selectedContent.id}
          amount={selectedContent.amount}
          title={selectedContent.title}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
}
