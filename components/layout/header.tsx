'use client';

import { useAuthContext, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user } = useAuthContext();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Zexy
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user.name || user.username || 'Fan'}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
