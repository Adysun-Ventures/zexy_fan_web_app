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
    username: 'priya_sharma',
    name: 'Priya Sharma',
    avatar: null,
    niche: 'Fashion & Lifestyle',
    subscriber_count: 125000,
    is_subscribed: false,
  },
  {
    id: 2,
    username: 'arjun_fitness',
    name: 'Arjun Kumar',
    avatar: null,
    niche: 'Fitness Coach',
    subscriber_count: 89000,
    is_subscribed: false,
  },
  {
    id: 3,
    username: 'neha_music',
    name: 'Neha Patel',
    avatar: null,
    niche: 'Singer & Musician',
    subscriber_count: 210000,
    is_subscribed: true,
  },
];

const MOCK_CONTENT: Content[] = [
  // Creator 1 (Priya Sharma - Fashion & Lifestyle)
  {
    id: 1,
    creator_uid: 1,
    creator_username: 'priya_sharma',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'image',
    title: 'Summer Fashion Lookbook',
    description: 'My favorite summer outfits and styling tips',
    url: 'https://example.com/image1.jpg',
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
    creator_username: 'priya_sharma',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'video',
    title: 'Makeup Tutorial: Evening Glam',
    description: 'Step-by-step evening makeup look',
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
    creator_username: 'priya_sharma',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'video',
    title: 'Exclusive: Behind My Photoshoot',
    description: 'Premium behind-the-scenes content from my latest shoot',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: 'https://example.com/preview5.mp4',
    is_paid: true,
    price: 199,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 6,
    creator_uid: 1,
    creator_username: 'priya_sharma',
    creator_name: 'Priya Sharma',
    creator_avatar: null,
    type: 'image',
    title: 'Personal Style Guide',
    description: 'Complete guide to finding your personal style',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 149,
    visibility: 'membership',
    is_locked: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },

  // Creator 2 (Arjun Kumar - Fitness Coach)
  {
    id: 2,
    creator_uid: 2,
    creator_username: 'arjun_fitness',
    creator_name: 'Arjun Kumar',
    creator_avatar: null,
    type: 'video',
    title: 'Morning Workout Routine',
    description: 'Start your day with this energizing 20-minute workout',
    url: 'https://example.com/video2.mp4',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 7,
    creator_uid: 2,
    creator_username: 'arjun_fitness',
    creator_name: 'Arjun Kumar',
    creator_avatar: null,
    type: 'video',
    title: 'Advanced Strength Training',
    description: 'Premium workout program for muscle building',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: 'https://example.com/preview7.mp4',
    is_paid: true,
    price: 299,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 8,
    creator_uid: 2,
    creator_username: 'arjun_fitness',
    creator_name: 'Arjun Kumar',
    creator_avatar: null,
    type: 'image',
    title: 'Nutrition Plan',
    description: 'Complete meal plan for fitness goals',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 199,
    visibility: 'membership',
    is_locked: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },

  // Creator 3 (Neha Patel - Singer & Musician)
  {
    id: 3,
    creator_uid: 3,
    creator_username: 'neha_music',
    creator_name: 'Neha Patel',
    creator_avatar: null,
    type: 'audio',
    title: 'New Single: Dil Ki Baat',
    description: 'My latest single - listen now!',
    url: 'https://example.com/audio3.mp3',
    thumbnail_url: null,
    preview_url: null,
    is_paid: false,
    price: 0,
    visibility: 'public',
    is_locked: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 9,
    creator_uid: 3,
    creator_username: 'neha_music',
    creator_name: 'Neha Patel',
    creator_avatar: null,
    type: 'video',
    title: 'Live Concert Recording',
    description: 'Exclusive recording from my Mumbai concert',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: 'https://example.com/preview9.mp4',
    is_paid: true,
    price: 249,
    visibility: 'public',
    is_locked: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 10,
    creator_uid: 3,
    creator_username: 'neha_music',
    creator_name: 'Neha Patel',
    creator_avatar: null,
    type: 'video',
    title: 'Singing Masterclass',
    description: 'Learn vocal techniques from a professional',
    url: null, // Locked
    thumbnail_url: null,
    preview_url: null,
    is_paid: true,
    price: 399,
    visibility: 'membership',
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
    return response.data.data.data;
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
    return response.data.data.data;
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
