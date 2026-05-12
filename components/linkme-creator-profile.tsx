/**
 * LinkMe-style public creator profile view (mobile-first).
 *
 * Target UI:
 * - Full-bleed cover photo at top
 * - Cover fades/collapses while scrolling
 * - Sticky header appears with name/@username + social icons
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCreatorByUsername, useCreatorContentByUsername } from '@/hooks/useFeed';
import { useCreatorProfileConfig } from '@/hooks/useCreatorProfile';
import { useCreatorPlans } from '@/hooks/useSubscriptions';
import { useAuthContext } from '@/hooks/useAuth';
import { getMediaUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useActionButton } from '@/hooks/useActionButton';
import { SignupModal } from '@/components/auth/signup-modal';
import { SubscriptionModal } from '@/components/subscription-modal';
import type { ActionButton } from '@/types/creator-profile';
import { Instagram, Facebook, Youtube, Loader2, ExternalLink, Menu, X, Home, Users, CreditCard, MessageCircle, User } from 'lucide-react';
import type { Content } from '@/services/feed';
import { toast } from 'sonner';

interface LinkMeCreatorProfileProps {
  username: string;
}

type SocialKind = 'instagram' | 'facebook' | 'x' | 'youtube' | 'link' | 'zexy';

function inferSocialKind(url: string): SocialKind | null {
  const u = url.toLowerCase();
  if (u.includes('instagram.com') || u.includes('instagr.am')) return 'instagram';
  if (u.includes('facebook.com') || u.includes('fb.com')) return 'facebook';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'x';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.startsWith('http://') || u.startsWith('https://')) return 'link';
  return null;
}

function SocialIcon({ kind }: { kind: SocialKind }) {
  switch (kind) {
    case 'instagram':
      return <Instagram className="h-5 w-5 text-[#E1306C]" />;
    case 'facebook':
      return <Facebook className="h-5 w-5 text-[#1877F2]" />;
    case 'x':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-black">
          <path d="M18.901 1.153h3.68l-8.039 9.189L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.493h2.039L6.486 3.24H4.298L17.611 20.646Z" />
        </svg>
      );
    case 'youtube':
      return <Youtube className="h-5 w-5 text-[#FF0000]" />;
    case 'link':
      return <ExternalLink className="h-5 w-5 text-black" />;
    case 'zexy':
      return (
        <Image
          src="/zexy_z_letter_logo_nobg.png"
          alt="Zexy"
          width={20}
          height={20}
          className="h-5 w-5 object-contain"
        />
      );
  }
}

type SocialEntry = {
  kind: SocialKind;
  button?: ActionButton;
};

function buildFixedSocialRow(actionButtons: ActionButton[] | undefined): SocialEntry[] {
  const links =
    actionButtons?.filter((b) => b.type === 'custom_link' && typeof b.action === 'string') ?? [];

  const pick = (kind: Exclude<SocialKind, 'zexy'>) =>
    links.find((b) => inferSocialKind(b.action) === kind);

  // Render a fixed order like the screenshot, even if some are missing.
  return [
    { kind: 'instagram', button: pick('instagram') },
    { kind: 'facebook', button: pick('facebook') },
    { kind: 'x', button: pick('x') },
    { kind: 'youtube', button: pick('youtube') },
    // Zexy icon always present (we'll route internally)
    { kind: 'zexy' },
  ];
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

const drawerNavItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/creators', label: 'Creators', icon: Users },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/profile', label: 'Profile', icon: User },
];

export function LinkMeCreatorProfile({ username }: LinkMeCreatorProfileProps) {
  const { data: creator, isLoading: creatorLoading, error: creatorError } = useCreatorByUsername(username);
  const { data: config, isLoading: configLoading } = useCreatorProfileConfig(username);
  const { data: content, isLoading: contentLoading } = useCreatorContentByUsername(username);
  const { handleButtonClick } = useActionButton();
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { data: plans } = useCreatorPlans(creator?.id || 0);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [scrollY, setScrollY] = useState(0);

  const handleContentClick = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (!plans || plans.length === 0) {
      toast.message('No membership plans available yet.');
      return;
    }

    setIsMembershipOpen(true);
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY || 0));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const displayName = creator?.name || creator?.username || username;
  const handle = creator?.username || username;
  const bio = config?.intro?.bio?.trim() || '';

  const coverUrl = useMemo(() => {
    // No dedicated "cover photo" in current backend contract; use avatar as best available.
    return getMediaUrl(creator?.avatar) || null;
  }, [creator?.avatar]);

  const social = useMemo(() => buildFixedSocialRow(config?.actionButtons), [config?.actionButtons]);

  if (creatorLoading || configLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (creatorError || !creator) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-black text-white">
        <Card className="max-w-md w-full bg-zinc-950 text-white border-white/10">
          <CardContent className="pt-6 text-center">
            <p className="text-zinc-400">Creator not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cover animation
  const fadeDistance = 220;
  const fade = 1 - clamp01(scrollY / fadeDistance);
  const coverTranslate = Math.min(scrollY * 0.2, 60);
  // Show the sticky profile bar only after the hero is fully gone.
  const showStickyProfileBar = scrollY >= fadeDistance;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Always-visible sidebar/menu button */}
      <button
        type="button"
        aria-label="Open menu"
        className="fixed right-4 top-4 z-[60] grid h-10 w-10 place-items-center rounded-md bg-black/30 text-white backdrop-blur hover:bg-black/45"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={[
          'fixed inset-0 z-[70] bg-black/50 transition-opacity',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setIsDrawerOpen(false)}
      />

      <aside
        className={[
          'fixed right-0 top-0 z-[80] h-full w-72 max-w-[85vw] border-l border-white/10 bg-black shadow-xl transition-transform duration-300',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!isDrawerOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/zexy_z_letter_logo_nobg.png"
              alt="Zexy logo"
              width={22}
              height={22}
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-semibold tracking-[0.15em]">ZEXY</span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-2 py-3">
          {drawerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Profile bar overlay (hidden until hero fully disappears) */}
      <div
        className={[
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          showStickyProfileBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <div className="bg-black/85 backdrop-blur border-b border-white/10">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-white/10">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{displayName}</div>
                <div className="truncate text-xs text-zinc-400">@{handle}</div>
              </div>
            </div>
            <div className="h-9 w-9" />
          </div>
        </div>
      </div>

      {/* Cover hero */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          height: 'min(64vh, 520px)',
        }}
        onClick={handleContentClick}
      >
        {/* Only the IMAGE layer fades/collapses on scroll */}
        <div
          className="absolute inset-0"
          style={{
            opacity: fade,
            transform: `translateY(-${coverTranslate}px)`,
            willChange: 'opacity, transform',
          }}
        >
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={displayName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black" />
          )}

          {/* Dark gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10" />
        </div>

        {/* Center content */}
        <div className="absolute inset-x-0 bottom-10 px-4">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-4xl font-semibold tracking-tight drop-shadow-sm">{displayName}</h1>
            <p className="mt-1 text-sm text-zinc-300">@{handle}</p>

            {/* Social icons row */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {social.map(({ button, kind }, idx) => {
                const isZexy = kind === 'zexy';
                const isEnabled = isZexy || Boolean(button);
                return (
                  <button
                    key={(button?.id || kind) + idx}
                    type="button"
                    aria-label={isZexy ? 'Zexy' : button?.label || kind}
                    className={[
                      'h-11 w-11 rounded-full bg-white grid place-items-center shadow-md shadow-black/40',
                      'hover:bg-zinc-100',
                      !isEnabled ? 'opacity-50 pointer-events-none' : '',
                    ].join(' ')}
                    onClick={
                      isZexy
                        ? (e) => {
                            e.stopPropagation();
                            router.push('/creators');
                          }
                        : button
                          ? (e) => {
                              e.stopPropagation();
                              handleButtonClick(button);
                            }
                          : undefined
                    }
                  >
                    <SocialIcon kind={kind} />
                  </button>
                );
              })}
            </div>

            {bio ? <p className="mt-5 text-base text-zinc-100">{bio}</p> : null}
          </div>
        </div>
      </section>

      {/* Below-the-fold content */}
      <div className="mx-auto max-w-md px-4 pb-10">
        {/* Spacer so content doesn't get covered when bar appears */}
        <div className={showStickyProfileBar ? 'pt-14' : 'pt-0'} />
        {/* Exclusive (big) + Public grid */}
        <div className="pt-6 space-y-4">
          {contentLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : (
            <CreatorMediaBlocks
              content={content || []}
              creatorCoverUrl={coverUrl}
              onCardClick={handleContentClick}
            />
          )}
        </div>
      </div>

      <SignupModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {isMembershipOpen && plans && plans.length > 0 && (
        <SubscriptionModal
          creatorName={displayName}
          plans={plans}
          onClose={() => setIsMembershipOpen(false)}
        />
      )}
    </div>
  );
}

function CreatorMediaBlocks({
  content,
  creatorCoverUrl,
  onCardClick,
}: {
  content: Content[];
  creatorCoverUrl: string | null;
  onCardClick: () => void;
}) {
  const exclusives = content.filter((c) => c.is_locked || c.is_paid);
  const publicItems = content.filter((c) => c.visibility === 'public' && !c.is_locked && !c.is_paid);

  const featured = exclusives[0] || null;

  return (
    <>
      {featured ? (
        <button
          type="button"
          onClick={onCardClick}
          className="relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left"
        >
          <div className="absolute left-3 top-3 z-10 h-9 w-9 rounded-full bg-black/50 backdrop-blur grid place-items-center">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>

          {creatorCoverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creatorCoverUrl}
              alt={featured.title}
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="h-56 w-full bg-gradient-to-br from-zinc-700 to-black" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            <div className="text-lg font-semibold leading-snug">{featured.title}</div>
          </div>
        </button>
      ) : null}

      {publicItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {publicItems.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={onCardClick}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left"
            >
              <div className="absolute left-2 top-2 z-10 h-8 w-8 rounded-full bg-black/50 backdrop-blur grid place-items-center">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>

              {creatorCoverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creatorCoverUrl}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-zinc-700 to-black" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-sm font-medium">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={onCardClick}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center"
        >
          <div className="text-xl font-semibold">No posts yet</div>
          <div className="mt-2 text-sm text-zinc-400">Public posts will appear here.</div>
        </button>
      )}
    </>
  );
}

