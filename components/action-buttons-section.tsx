/**
 * Action Buttons Section
 * 
 * Displays customizable action buttons (Brand Enquiry, Chat Now, etc.)
 */

'use client';

import { ActionButton } from '@/types/creator-profile';
import { Button } from '@/components/ui/button';
import { useActionButton } from '@/hooks/useActionButton';
import { Mail, MessageCircle, ExternalLink, Send } from 'lucide-react';

interface ActionButtonsSectionProps {
  buttons: ActionButton[];
}

/**
 * Get icon component by name
 */
function getIcon(iconName?: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Mail,
    MessageCircle,
    ExternalLink,
    Send,
  };
  
  return icons[iconName || 'ExternalLink'] || ExternalLink;
}

/**
 * Action buttons section component
 * 
 * @param buttons - Array of action button configurations
 */
export function ActionButtonsSection({ buttons }: ActionButtonsSectionProps) {
  const { handleButtonClick } = useActionButton();
  
  if (!buttons || buttons.length === 0) {
    return null;
  }
  
  return (
    <div className="px-4 py-6 space-y-3">
      {buttons.map((button) => {
        const Icon = getIcon(button.icon);
        const variant = button.style === 'primary' ? 'default' : 
                       button.style === 'secondary' ? 'secondary' : 
                       'outline';
        
        return (
          <Button
            key={button.id}
            variant={variant}
            className="w-full h-12 text-base"
            onClick={() => handleButtonClick(button)}
            style={{
              background: button.style === 'primary' 
                ? 'linear-gradient(to right, var(--profile-gradient-start), var(--profile-gradient-end))'
                : undefined,
            }}
          >
            <Icon className="mr-2 h-5 w-5" />
            {button.label}
          </Button>
        );
      })}
    </div>
  );
}
