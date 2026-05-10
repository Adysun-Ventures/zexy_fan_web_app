/**
 * Mobile Creator Profile
 * 
 * Main component for mobile-only creator profiles with customizable UI/UX.
 */

'use client';

import { useCreatorByUsername, useCreatorContentByUsername } from '@/hooks/useFeed';
import { useCreatorProfileConfig } from '@/hooks/useCreatorProfile';
import { useCreatorPlans } from '@/hooks/useSubscriptions';
import { useQAItems } from '@/hooks/useQA';
import { ProfileThemeProvider } from '@/components/profile-theme-provider';
import { CreatorIntroSection } from '@/components/creator-intro-section';
import { ActionButtonsSection } from '@/components/action-buttons-section';
import { FanConnectQASection } from '@/components/fan-connect-qa-section';
import { ExclusivesGridSection } from '@/components/exclusives-grid-section';
import { MembershipCardSection } from '@/components/membership-card-section';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getDefaultTheme } from '@/lib/validation/profile-config';

interface MobileCreatorProfileProps {
  username: string;
}

/**
 * Mobile creator profile component
 * 
 * @param username - Creator username
 */
export function MobileCreatorProfile({ username }: MobileCreatorProfileProps) {
  const { data: creator, isLoading: creatorLoading, error: creatorError } = useCreatorByUsername(username);
  const { data: config, isLoading: configLoading } = useCreatorProfileConfig(username);
  const { data: content, isLoading: contentLoading } = useCreatorContentByUsername(username);
  const { data: plans } = useCreatorPlans(creator?.id || 0);
  const { data: qaItems } = useQAItems(creator?.id || 0);
  
  // Loading state
  if (creatorLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Error state
  if (creatorError || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Creator not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Use default theme if config not available
  const theme = config?.theme || getDefaultTheme();
  const sections = config?.sections || [];
  const bottomNav = config?.bottomNav || [];
  
  // Sort and filter enabled sections
  const enabledSections = sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);
  
  return (
    <ProfileThemeProvider theme={theme}>
      <div className="min-h-screen pb-20">
        <div className="min-h-screen bg-background/95 backdrop-blur-sm">
          {/* Render sections in order */}
          {enabledSections.map((section) => {
            switch (section.type) {
              case 'intro':
                return config?.intro ? (
                  <CreatorIntroSection
                    key={section.id}
                    creator={creator}
                    config={config.intro}
                  />
                ) : null;
              
              case 'actions':
                return config?.actionButtons && config.actionButtons.length > 0 ? (
                  <ActionButtonsSection
                    key={section.id}
                    buttons={config.actionButtons}
                    creatorId={creator.id}
                    isSubscribed={creator.is_subscribed}
                  />
                ) : (
                  /* Config can omit action section; still show Message when subscribed */
                  creator.is_subscribed ? (
                    <ActionButtonsSection
                      key={`${section.id}-subscribed-chat`}
                      buttons={[]}
                      creatorId={creator.id}
                      isSubscribed
                    />
                  ) : null
                );
              
              case 'qa':
                return qaItems ? (
                  <FanConnectQASection
                    key={section.id}
                    items={qaItems}
                    showAddQuestion={section.config?.showAddQuestion || false}
                  />
                ) : null;
              
              case 'exclusives':
                return content ? (
                  <ExclusivesGridSection
                    key={section.id}
                    content={content}
                  />
                ) : null;
              
              case 'membership':
                return plans ? (
                  <MembershipCardSection
                    key={section.id}
                    plans={plans}
                    isSubscribed={creator.is_subscribed}
                    creatorName={creator.name || creator.username}
                  />
                ) : null;
              
              default:
                return null;
            }
          })}
          
          {/* Loading state for content */}
          {contentLoading && (
            <div className="px-4 py-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Bottom Navigation */}
        {bottomNav.length > 0 && (
          <BottomNavigation items={bottomNav} />
        )}
      </div>
    </ProfileThemeProvider>
  );
}
