import { apiClient } from '@/lib/axios';
import { ENV } from '@/constants/env';
import { sleep } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface Message {
  id: number;
  sender_uid: number;
  receiver_uid: number;
  sender_name: string | null;
  sender_username: string | null;
  sender_avatar: string | null;
  receiver_name: string | null;
  receiver_username: string | null;
  body: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'tip_demand';
  media_url: string | null;
  is_paid: boolean;
  price: number;
  is_unlocked: boolean;
  tip_amount: number | null;
  tip_paid: boolean;
  created_at: string;
  read_at: string | null;
}

export interface Conversation {
  other_user_id: number;
  other_user_name: string | null;
  other_user_username: string | null;
  other_user_avatar: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    other_user_id: 2,
    other_user_name: 'Mike Chen',
    other_user_username: 'creator_two',
    other_user_avatar: null,
    last_message: 'Thanks for subscribing!',
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 1,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender_uid: 2,
    receiver_uid: 1,
    sender_name: 'Mike Chen',
    sender_username: 'creator_two',
    sender_avatar: null,
    receiver_name: 'John Doe',
    receiver_username: 'fan_user',
    body: 'Thanks for subscribing!',
    message_type: 'text',
    media_url: null,
    is_paid: false,
    price: 0,
    is_unlocked: true,
    tip_amount: null,
    tip_paid: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    read_at: null,
  },
];

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const messageService = {
  /**
   * Get conversations list
   */
  getConversations: async (): Promise<Conversation[]> => {
    if (ENV.IS_MOCK) {
      await sleep(600);
      return MOCK_CONVERSATIONS;
    }

    const response = await apiClient.get('/api/v1/fan/messages/conversations');
    return response.data.data;
  },

  /**
   * Get message thread with a creator
   */
  getThread: async (creatorId: number): Promise<Message[]> => {
    if (ENV.IS_MOCK) {
      await sleep(700);
      return MOCK_MESSAGES;
    }

    const response = await apiClient.get(`/api/v1/fan/messages/thread/${creatorId}`);
    return response.data.data;
  },

  /**
   * Send text message
   */
  sendMessage: async (creatorId: number, body: string): Promise<Message> => {
    if (ENV.IS_MOCK) {
      await sleep(500);
      return {
        id: Date.now(),
        sender_uid: 1,
        receiver_uid: creatorId,
        sender_name: 'John Doe',
        sender_username: 'fan_user',
        sender_avatar: null,
        receiver_name: 'Creator',
        receiver_username: 'creator',
        body,
        message_type: 'text',
        media_url: null,
        is_paid: false,
        price: 0,
        is_unlocked: true,
        tip_amount: null,
        tip_paid: false,
        created_at: new Date().toISOString(),
        read_at: null,
      };
    }

    const response = await apiClient.post('/api/v1/fan/messages/send', {
      receiver_uid: creatorId,
      body,
    });
    return response.data.data;
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId: number): Promise<void> => {
    if (ENV.IS_MOCK) {
      await sleep(300);
      return;
    }

    await apiClient.post(`/api/v1/common/messages/${messageId}/read`);
  },
};
