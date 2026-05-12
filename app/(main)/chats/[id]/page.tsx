'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mic, MoreVertical, Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatUser {
  id: number;
  name: string;
  username: string;
}

interface ChatMessage {
  id: number;
  sender: 'me' | 'creator';
  body: string;
  createdAt: string;
}

const LOCAL_USERS: ChatUser[] = [
  { id: 21, name: 'Vikas Mehra', username: 'vikasfitzone' },
  { id: 22, name: 'Amar', username: 'amar' },
];

const LOCAL_THREADS: Record<number, ChatMessage[]> = {
  21: [
    {
      id: 1,
      sender: 'creator',
      body: 'Hey! Thanks for joining my page.',
      createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    },
    {
      id: 2,
      sender: 'me',
      body: 'Happy to be here 🙌',
      createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    },
    {
      id: 3,
      sender: 'creator',
      body: 'I just posted a new workout set. Check it out!',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
  ],
  22: [
    {
      id: 1,
      sender: 'creator',
      body: 'New exclusive post is live.',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 2,
      sender: 'me',
      body: 'Awesome, opening now.',
      createdAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    },
  ],
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const chatUser = useMemo(() => LOCAL_USERS.find((u) => u.id === id), [id]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => LOCAL_THREADS[id] || []);
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMessages(LOCAL_THREADS[id] || []);
  }, [id]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        body: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft('');
  };

  const handleAddEmoji = () => {
    setDraft((prev) => `${prev}😊`);
  };

  const handleDeleteChat = () => {
    setMessages([]);
    setMenuOpen(false);
  };

  if (!chatUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
        Chat not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-background overflow-hidden">
      {/* WhatsApp-like top bar */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 px-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/chats')} aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
            {chatUser.name[0]}
          </div>

          <div className="min-w-0">
            <p className="font-semibold leading-tight truncate">{chatUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{chatUser.username}</p>
          </div>

          <div className="ml-auto relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Chat options"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-30 min-w-[140px] rounded-md border bg-popover p-1 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-sm px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
                  onClick={handleDeleteChat}
                >
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="h-[calc(100vh-260px)] min-h-[420px] overflow-y-auto bg-muted/20 p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={[
                  'max-w-[80%] rounded-2xl px-3 py-2 shadow-sm',
                  isMe
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card text-card-foreground border rounded-bl-md',
                ].join(' ')}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                <p className={`mt-1 text-[11px] ${isMe ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom input bar */}
      <div className="border-t bg-background p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Emoji" onClick={handleAddEmoji}>
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message"
            className="flex-1"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button variant="ghost" size="icon" aria-label="Voice note">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" aria-label="Send" onClick={handleSend} disabled={!draft.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

