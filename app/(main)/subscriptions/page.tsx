'use client';

import { useMySubscriptions } from '@/hooks/useSubscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading, error } = useMySubscriptions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load subscriptions</p>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You don't have any active subscriptions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Subscriptions</h1>
      <div className="grid gap-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {sub.creator_name?.[0] || 'C'}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{sub.creator_name}</CardTitle>
                  <CardDescription>@{sub.creator_username}</CardDescription>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sub.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}
                >
                  {sub.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Started: {formatDate(sub.started_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expires: {formatDate(sub.expires_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
