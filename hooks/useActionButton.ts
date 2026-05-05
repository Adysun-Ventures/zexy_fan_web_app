/**
 * Action Button Handler Hook
 * 
 * Handles clicks on action buttons with authentication checks.
 */

'use client';

import { useAuthContext } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/types/creator-profile';
import { toast } from 'sonner';

/**
 * Hook for handling action button clicks
 * 
 * @returns Handler function for action buttons
 * 
 * @example
 * const { handleButtonClick } = useActionButton();
 * <button onClick={() => handleButtonClick(button)}>Click</button>
 */
export function useActionButton() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  const handleButtonClick = (button: ActionButton) => {
    // Check authentication for protected actions
    if (button.type === 'chat' && !isAuthenticated) {
      router.push('/login');
      return;
    }

    switch (button.type) {
      case 'brand_enquiry':
      case 'email':
        // Open email client
        window.location.href = `mailto:${button.action}`;
        break;

      case 'chat':
        // Navigate to chat
        router.push(button.action);
        break;

      case 'custom_link':
        // Open external link in new tab
        window.open(button.action, '_blank', 'noopener,noreferrer');
        break;

      default:
        console.warn('Unknown button type:', button.type);
        toast.error('Action not supported');
    }
  };

  return { handleButtonClick };
}
