'use client';

import Link from 'next/link';
import { useConversations } from '@/hooks/useMessages';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function MessagesPage() {
  const { data: conversations, isLoading, error } = useConversations();

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
        <p className="text-destructive">Failed to load messages</p>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No conversations yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <div className="grid gap-2">
        {conversations.map((conv) => (
          <Link key={conv.other_user_id} href={`/messages/${conv.other_user_id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {conv.other_user_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{conv.other_user_name || conv.other_user_username}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatDate(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                      {conv.unread_count > 0 && (
                        <span className="ml-2 flex-shrink-0 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
