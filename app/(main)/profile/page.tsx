'use client';

import { useAuthContext } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

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
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{user.mobile}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{user.role}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Status</CardTitle>
        </CardHeader>
        <CardContent>
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
