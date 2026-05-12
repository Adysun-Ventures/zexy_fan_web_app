'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Send, Smile, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TipModal } from '@/components/tip-modal';

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

interface TipRequest {
  amount: number;
  message: string;
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

const LOCAL_TIP_REQUESTS: Record<number, TipRequest | null> = {
  21: {
    amount: 149,
    message: 'Creator asked for ₹149 tip',
  },
  22: null,
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
  const [tipOpen, setTipOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(49);
  const [lockTipAmount, setLockTipAmount] = useState(false);
  const [tipTitle, setTipTitle] = useState('Tip amount');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  /** When true, tip modal owns focus — do not steal it back into the composer. */
  const tipBlocksInputFocusRef = useRef(false);

  const focusMessageInput = () => {
    requestAnimationFrame(() => {
      messageInputRef.current?.focus({ preventScroll: true });
    });
  };

  const handleMessageInputBlur = () => {
    window.setTimeout(() => {
      if (tipBlocksInputFocusRef.current) return;
      messageInputRef.current?.focus({ preventScroll: true });
    }, 0);
  };
  const [creatorTipBannerVisible, setCreatorTipBannerVisible] = useState(true);

  useEffect(() => {
    setMessages(LOCAL_THREADS[id] || []);
  }, [id]);

  useEffect(() => {
    if (!LOCAL_TIP_REQUESTS[id]) {
      setCreatorTipBannerVisible(false);
      return;
    }
    setCreatorTipBannerVisible(true);
    const timer = window.setTimeout(() => setCreatorTipBannerVisible(false), 15_000);
    return () => window.clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const node = menuContainerRef.current;
      if (node && !node.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [menuOpen]);

  const creatorTipRequest = useMemo(() => LOCAL_TIP_REQUESTS[id] || null, [id]);

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
    focusMessageInput();
  };

  const handleAddEmoji = () => {
    setDraft((prev) => `${prev}😊`);
    focusMessageInput();
  };

  const handleDeleteChat = () => {
    setMessages([]);
    setMenuOpen(false);
  };

  const handleSendTip = (amount: number) => {
    // Local-only for now; add real payment later.
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        body: `Sent a tip of ₹${amount}`,
        createdAt: new Date().toISOString(),
      },
    ]);
    tipBlocksInputFocusRef.current = false;
    setTipOpen(false);
    setLockTipAmount(false);
    setTipTitle('Tip amount');
    focusMessageInput();
  };

  const openFreeTipPopup = () => {
    tipBlocksInputFocusRef.current = true;
    setLockTipAmount(false);
    setTipTitle('Tip amount');
    setTipAmount(49);
    setTipOpen(true);
  };

  const openRequestedTipPopup = () => {
    if (!creatorTipRequest) return;
    tipBlocksInputFocusRef.current = true;
    setTipAmount(creatorTipRequest.amount);
    setLockTipAmount(true);
    setTipTitle('Creator requested amount');
    setTipOpen(true);
  };

  if (!chatUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-zinc-400 bg-black">
        Chat not found
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] h-dvh bg-black flex flex-col overflow-hidden text-white">
      {/* WhatsApp-like top bar */}
      <div className="border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-3 px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/chats')}
            aria-label="Back"
            className="shrink-0 text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <button
            type="button"
            onClick={() => router.push(`/creator/${encodeURIComponent(chatUser.username)}`)}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-1 text-left transition-colors hover:bg-zinc-900/90 active:bg-zinc-800 sm:-ml-1 sm:px-1"
            aria-label={`Open ${chatUser.name}'s profile`}
          >
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
              {chatUser.name[0]}
            </div>

            <div className="min-w-0">
              <p className="font-semibold leading-tight truncate text-white">{chatUser.name}</p>
              <p className="text-xs text-zinc-400 truncate">@{chatUser.username}</p>
            </div>
          </button>

          <div className="relative shrink-0" ref={menuContainerRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Chat options"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-white hover:bg-zinc-800"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-30 min-w-[160px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
                  onClick={handleDeleteChat}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-black p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={[
                  'max-w-[80%] rounded-2xl px-3 py-2',
                  isMe
                    ? 'bg-zinc-500 text-black rounded-br-md'
                    : 'bg-zinc-700 text-white rounded-bl-md',
                ].join(' ')}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                <p
                  className={`mt-1 text-[11px] ${isMe ? 'text-black/70' : 'text-white/55'}`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom input bar */}
      <div className="shrink-0 border-t border-zinc-800 bg-black p-2">
        <div
          className={`mb-2 flex w-full items-center gap-2 ${
            creatorTipRequest && creatorTipBannerVisible ? 'justify-between' : 'justify-end'
          }`}
        >
          {creatorTipRequest && creatorTipBannerVisible && (
            <button
              type="button"
              onClick={openRequestedTipPopup}
              className="min-w-0 max-w-[13.5rem] shrink rounded-xl border border-amber-500/40 bg-amber-500/15 px-2.5 py-2 text-left text-xs font-medium leading-snug text-amber-200 sm:max-w-[15rem] sm:px-3 sm:text-sm"
            >
              {creatorTipRequest.message}
              <span className="text-amber-200/80"> · Tap to pay</span>
            </button>
          )}
          <button
            type="button"
            onClick={openFreeTipPopup}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-600 text-base font-bold text-white shadow-md hover:bg-pink-500"
            aria-label="Send tip"
          >
            ₹
          </button>
        </div>

        <div className="relative flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Emoji"
            onClick={handleAddEmoji}
            className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            ref={messageInputRef}
            placeholder="Type a message"
            autoFocus
            spellCheck={false}
            className="flex-1 border-zinc-700 bg-zinc-900 text-white caret-white placeholder:text-zinc-500 selection:bg-pink-500/40"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleMessageInputBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            aria-label="Send"
            onClick={handleSend}
            disabled={!draft.trim()}
            className="bg-zinc-600 text-white hover:bg-zinc-500 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TipModal
        open={tipOpen}
        amount={tipAmount}
        onAmountChange={setTipAmount}
        onClose={() => {
          tipBlocksInputFocusRef.current = false;
          setTipOpen(false);
          setLockTipAmount(false);
          setTipTitle('Tip amount');
          focusMessageInput();
        }}
        onSend={handleSendTip}
        lockAmount={lockTipAmount}
        title={tipTitle}
      />
    </div>
  );
}

