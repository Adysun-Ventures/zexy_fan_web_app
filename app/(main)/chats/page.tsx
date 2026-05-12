'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface LocalChat {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

const LOCAL_CHATS: LocalChat[] = [
  {
    id: 21,
    name: 'Vikas Mehra',
    username: 'vikasfitzone',
    avatar: null,
    lastMessage: 'Thanks for subscribing!',
    lastMessageAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 22,
    name: 'Amar',
    username: 'amar',
    avatar: null,
    lastMessage: 'New exclusive post is live',
    lastMessageAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
  },
];

function formatChatTimestamp(value: string) {
  const date = new Date(value);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  return formatDate(value);
}

export default function ChatsPage() {
  if (LOCAL_CHATS.length === 0) {
    return (
      <div className="space-y-6">
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
    <div>
      <div>
        {LOCAL_CHATS.map((chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="block cursor-pointer px-2 py-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                {chat.name?.[0] || chat.username?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold truncate">{chat.username}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatChatTimestamp(chat.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 flex-shrink-0 bg-primary text-primary-foreground text-xs font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

