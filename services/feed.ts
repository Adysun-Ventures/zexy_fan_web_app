import { apiClient } from '@/lib/axios';
import { ENV } from '@/constants/env';
import { sleep } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface Creator {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
  niche: string | null;
  subscriber_count: number;
  is_subscribed: boolean;
}

export interface Content {
  id: number;
  creator_uid: number;
  creator_username: string;
  creator_name: string;
  creator_avatar: string | null;
  type: 'image' | 'video' | 'audio';
  title: string;
  description: string | null;
  url: string | null; // null if locked
  thumbnail_url: string | null;
  preview_url: string | null;
  is_paid: boolean;
  price: number;
  visibility: 'public' | 'membership' | 'private';
  is_locked: boolean; // Computed: true if paid and not unlocked
  created_at: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CREATORS: Creator[] = [
  {
    id: 1,
    username: 'creator_one',
    name: 'Sarah Johnson',
    avatar: null,
    niche: 'Fitness',
    subscriber_count: 1250,
    is_subscribed: false,
  },
  {
    id: 2,
    username: 'creator_two',
    name: 'Mike Chen',
    avatar: null,
    niche: 'Cooking',
    subscriber_count: 3400,
    is_subscribed: true,
  },
  {
    id: 3,
    username: 'creator_three',
    name: 'Priya Sharma',
    avatar: null,
    niche: 'Dance',
    subscriber_count: 890,
    is_subscribed: false,
  },
];

const MOCK_CONTENT: Content[] = [
  // Creator 1 (Sarah Johnson - Fitness)
  {
    id: 1,
    creator_uid: 1,
    creator_username: 'creator_one',
    creator_name: 'Sarah Johnson',
    creator_avatar: null,
    type: 'video',
    title: 'Morning Yoga Routine',
    description: 'Start your day with this energizing 15-minute yoga flow',
    url: 'https://example.com/video1.mp4',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    creator_uid: 1,
    creator_username: 'creator_one',
    creator_name: 'Sarah Johnson',
    creator_avatar: null,
    type: 'video',
    title: 'Full Body Workout',
    description: 'Intense 30-minute workout to build strength',
    url: 'https://example.com/video4.mp4',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 5,
    creator_uid: 1,
    creator_username: 'creator_one',
    creator_name: 'Sarah Johnson',
    creator_avatar: null,
    type: 'video',
    title: 'Advanced Core Training',
    description: 'Premium workout for advanced fitness enthusiasts',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: 'https://example.com/preview5.mp4',
    is_paid: true,
    price: 149,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 6,
    creator_uid: 1,
    creator_username: 'creator_one',
    creator_name: 'Sarah Johnson',
    creator_avatar: null,
    type: 'image',
    title: 'Nutrition Guide',
    description: 'Complete meal plan for fitness goals',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 99,
    visibility: 'membership',
    is_locked: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },

  // Creator 2 (Mike Chen - Cooking)
  {
    id: 2,
    creator_uid: 2,
    creator_username: 'creator_two',
    creator_name: 'Mike Chen',
    creator_avatar: null,
    type: 'video',
    title: 'Premium Pasta Recipe',
    description: 'Learn my secret technique for perfect pasta',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: 'https://example.com/preview2.mp4',
    is_paid: true,
    price: 99,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 7,
    creator_uid: 2,
    creator_username: 'creator_two',
    creator_name: 'Mike Chen',
    creator_avatar: null,
    type: 'video',
    title: 'Quick Stir Fry Tutorial',
    description: 'Easy 10-minute stir fry recipe',
    url: 'https://example.com/video7.mp4',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 8,
    creator_uid: 2,
    creator_username: 'creator_two',
    creator_name: 'Mike Chen',
    creator_avatar: null,
    type: 'video',
    title: 'Sushi Masterclass',
    description: 'Professional sushi making techniques',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 199,
    visibility: 'membership',
    is_locked: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },

  // Creator 3 (Priya Sharma - Dance)
  {
    id: 3,
    creator_uid: 3,
    creator_username: 'creator_three',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'image',
    title: 'Kathak Performance',
    description: 'Behind the scenes of my latest performance',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 49,
    visibility: 'membership',
    is_locked: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 9,
    creator_uid: 3,
    creator_username: 'creator_three',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'video',
    title: 'Basic Dance Steps',
    description: 'Learn fundamental dance movements',
    url: 'https://example.com/video9.mp4',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 10,
    creator_uid: 3,
    creator_username: 'creator_three',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'video',
    title: 'Advanced Choreography',
    description: 'Complex dance routine for experienced dancers',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 129,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const feedService = {
  /**
   * Get list of creators
   */
  getCreators: async (): Promise<Creator[]> => {
    if (ENV.IS_MOCK) {
      await sleep(600);
      return MOCK_CREATORS;
    }

    const response = await apiClient.get('/api/v1/fan/creators');
    return response.data.data;
  },

  /**
   * Get feed content (all creators)
   */
  getFeed: async (): Promise<Content[]> => {
    if (ENV.IS_MOCK) {
      await sleep(800);
      return MOCK_CONTENT;
    }

    const response = await apiClient.get('/api/v1/fan/feed');
    return response.data.data;
  },

  /**
   * Get content by specific creator (by ID)
   */
  getCreatorContent: async (creatorId: number): Promise<Content[]> => {
    if (ENV.IS_MOCK) {
      await sleep(700);
      return MOCK_CONTENT.filter((c) => c.creator_uid === creatorId);
    }

    const response = await apiClient.get(`/api/v1/fan/content/${creatorId}`);
    return response.data.data;
  },

  /**
   * Get creator by username
   */
  getCreatorByUsername: async (username: string): Promise<Creator> => {
    if (ENV.IS_MOCK) {
      await sleep(600);
      const creator = MOCK_CREATORS.find((c) => c.username === username);
      if (!creator) {
        throw new Error('Creator not found');
      }
      return creator;
    }

    const response = await apiClient.get(`/api/v1/fan/creators/${username}`);
    return response.data.data;
  },

  /**
   * Get content by creator username
   */
  getCreatorContentByUsername: async (username: string): Promise<Content[]> => {
    if (ENV.IS_MOCK) {
      await sleep(700);
      return MOCK_CONTENT.filter((c) => c.creator_username === username);
    }

    const response = await apiClient.get(`/api/v1/fan/creators/${username}/content`);
    return response.data.data;
  },
};
