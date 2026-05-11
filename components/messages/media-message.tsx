'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Message } from '@/services/messages';
import { messageService } from '@/services/messages';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';

interface MediaMessageProps {
  message: Message;
  mine: boolean;
  apiBaseUrl: string;
}

function resolveDirectUrl(apiBaseUrl: string, mediaUrl: string): string {
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) return mediaUrl;
  return `${apiBaseUrl}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`;
}

export function MediaMessage({ message: m, mine, apiBaseUrl }: MediaMessageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const mediaUrl = m.media_url || '';
  const needsSigned = useMemo(() => mediaUrl.startsWith('/media/protected/'), [mediaUrl]);
  const directUrl = useMemo(
    () => (mediaUrl ? resolveDirectUrl(apiBaseUrl, mediaUrl) : ''),
    [apiBaseUrl, mediaUrl]
  );

  useEffect(() => {
    let alive = true;
    if (!mediaUrl) return;
    if (!needsSigned) {
      setSignedUrl(null);
      setFailed(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    void messageService
      .getSignedMediaUrl(m.id)
      .then((res) => {
        if (!alive) return;
        setSignedUrl(res.url);
      })
      .catch(() => {
        if (!alive) return;
        setFailed(true);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [m.id, mediaUrl, needsSigned]);

  const urlToUse = needsSigned ? signedUrl || '' : directUrl;

  return (
    <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          mine
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md border border-border/50'
        )}
      >
        {loading ? (
          <div className="flex items-center gap-2 py-6 px-10 opacity-90">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading…</span>
          </div>
        ) : failed ? (
          <p className="text-xs text-destructive">Could not load media</p>
        ) : m.message_type === 'image' ? (
          <>
            {/* Use img for simplicity (Next Image requires domain config). */}
            <button
              type="button"
              className="block"
              onClick={() => setViewerOpen(true)}
              aria-label="Open image viewer"
            >
              <img
                src={urlToUse}
                alt={m.body || 'Image'}
                className="rounded-xl max-h-[320px] w-auto object-contain"
                loading="lazy"
              />
            </button>
            {viewerOpen && urlToUse ? (
              <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setViewerOpen(false)}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="relative max-w-[min(1100px,95vw)] max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-background/90 border border-border shadow flex items-center justify-center"
                    onClick={() => setViewerOpen(false)}
                    aria-label="Close image viewer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <img
                    src={urlToUse}
                    alt={m.body || 'Image'}
                    className="rounded-xl max-h-[90vh] w-auto object-contain select-none"
                  />
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <a
                      href={urlToUse}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white/90 underline underline-offset-4"
                    >
                      Open in new tab
                    </a>
                    <a
                      href={urlToUse}
                      download
                      className="text-xs text-white/90 underline underline-offset-4"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : m.message_type === 'video' ? (
          <video
            src={urlToUse}
            controls
            playsInline
            className="rounded-xl max-h-[360px] w-full"
          />
        ) : (
          <audio src={urlToUse} controls className="w-full" />
        )}

        {m.body?.trim() ? (
          <p className={cn('mt-2 whitespace-pre-wrap break-words', mine ? 'text-white/95' : '')}>
            {m.body}
          </p>
        ) : null}

        <p
          className={cn(
            'text-[10px] mt-1 opacity-80',
            mine ? 'text-right text-white/90' : 'text-left text-muted-foreground'
          )}
        >
          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

