/**
 * Q&A Service
 * 
 * Handles API calls for creator Q&A functionality.
 * Includes mock data for development.
 */

import { apiClient } from '@/lib/axios';
import { ENV } from '@/constants/env';
import { sleep } from '@/lib/utils';
import { QAItem } from '@/types/creator-profile';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_QA_ITEMS: Record<number, QAItem[]> = {
  1: [ // creator_one (Sarah Johnson - Fitness)
    {
      id: 1,
      question: 'What time do you usually post new workouts?',
      answer: 'I post new workouts every Monday, Wednesday, and Friday at 6 AM EST. Premium members get early access 24 hours before!',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 2,
      question: 'Do you offer personalized meal plans?',
      answer: 'Yes! Premium members can request personalized meal plans based on their fitness goals. Just send me a message with your requirements.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 3,
      question: 'Can beginners follow your workouts?',
      answer: 'Absolutely! I provide modifications for all fitness levels. Start with the beginner-friendly workouts and progress at your own pace.',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ],
  2: [ // creator_two (Mike Chen - Cooking)
    {
      id: 4,
      question: 'What kitchen equipment do I need?',
      answer: 'Most of my recipes use basic equipment: a good knife, cutting board, pots, and pans. I always mention if special equipment is needed!',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 5,
      question: 'Do you have vegetarian recipes?',
      answer: 'Yes! I have a growing collection of vegetarian and vegan recipes. Check the "Vegetarian" tag in my content library.',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ],
  3: [ // creator_three (Priya Sharma - Dance)
    {
      id: 6,
      question: 'How long does it take to learn Kathak?',
      answer: 'Kathak is a lifelong journey! But you can learn basic steps in a few weeks. I offer beginner courses that cover fundamentals in 8 weeks.',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 7,
      question: 'Do I need prior dance experience?',
      answer: 'Not at all! My beginner courses are designed for complete beginners. I break down every movement step by step.',
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
  ],
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const qaService = {
  /**
   * Get Q&A items for a creator
   * 
   * @param creatorId - Creator ID
   * @param limit - Maximum number of items to return
   * @param offset - Offset for pagination
   * @returns Array of Q&A items
   */
  getQAItems: async (
    creatorId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<QAItem[]> => {
    if (ENV.IS_MOCK) {
      await sleep(500);
      
      const items = MOCK_QA_ITEMS[creatorId] || [];
      return items.slice(offset, offset + limit);
    }

    const response = await apiClient.get(
      `/api/v1/fan/creators/${creatorId}/qa`,
      {
        params: { limit, offset },
      }
    );
    return response.data.data.data;
  },

  /**
   * Submit a question to a creator
   * 
   * @param creatorId - Creator ID
   * @param question - Question text
   * @returns Created Q&A item (without answer yet)
   */
  submitQuestion: async (
    creatorId: number,
    question: string
  ): Promise<QAItem> => {
    if (ENV.IS_MOCK) {
      await sleep(700);
      
      const newItem: QAItem = {
        id: Date.now(),
        question,
        answer: '', // Not answered yet
        createdAt: new Date().toISOString(),
      };
      
      return newItem;
    }

    const response = await apiClient.post(
      `/api/v1/fan/creators/${creatorId}/qa`,
      { question }
    );
    return response.data.data;
  },
};
