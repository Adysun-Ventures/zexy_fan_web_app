'use client';

import { useAuthContext } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Settings } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold overflow-hidden">
              {user.avatar ? (
                <img
                  src={getMediaUrl(user.avatar) || ''}
                  alt={user.name || user.username || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.[0] || user.username?.[0] || 'F'
              )}
            </div>
            <div>
              <CardTitle>{user.name || 'Fan User'}</CardTitle>
              {user.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
              <p className="text-sm text-muted-foreground">{user.mobile}</p>
              <p className="text-sm text-muted-foreground">Fan</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Plan</span>
            <span className="text-sm font-semibold">Free</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-zinc-500" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Onboarding</span>
            <span className="text-sm font-semibold">
              {user.has_completed_onboarding ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
