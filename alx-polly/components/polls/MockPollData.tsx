import { PollWithStatsAndOptions } from '@/lib/supabase/types';

// Mock poll data for testing and demonstration
export const mockPollData: PollWithStatsAndOptions = {
  id: 'mock-poll-1',
  title: 'What is your favorite programming language?',
  description: 'Help us understand the community preferences for programming languages in 2024.',
  author: {
    id: 'mock-author-1',
    name: 'John Doe',
    username: 'johndoe',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  status: 'active',
  is_public: true,
  allow_multiple_votes: false,
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  total_votes: 127,
  options: [
    {
      id: 'option-1',
      text: 'JavaScript/TypeScript',
      order_index: 1,
      vote_count: 45,
      vote_percentage: 35.4,
    },
    {
      id: 'option-2',
      text: 'Python',
      order_index: 2,
      vote_count: 38,
      vote_percentage: 29.9,
    },
    {
      id: 'option-3',
      text: 'Rust',
      order_index: 3,
      vote_count: 22,
      vote_percentage: 17.3,
    },
    {
      id: 'option-4',
      text: 'Go',
      order_index: 4,
      vote_count: 15,
      vote_percentage: 11.8,
    },
    {
      id: 'option-5',
      text: 'Other',
      order_index: 5,
      vote_count: 7,
      vote_percentage: 5.5,
    },
  ],
};

export const mockPollData2: PollWithStatsAndOptions = {
  id: 'mock-poll-2',
  title: 'What should we have for lunch today?',
  description: 'Team lunch decision for this Friday. Please vote for your preference!',
  author: {
    id: 'mock-author-2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  status: 'active',
  is_public: true,
  allow_multiple_votes: true,
  expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
  created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  total_votes: 23,
  options: [
    {
      id: 'option-6',
      text: 'Pizza',
      order_index: 1,
      vote_count: 12,
      vote_percentage: 52.2,
    },
    {
      id: 'option-7',
      text: 'Sushi',
      order_index: 2,
      vote_count: 6,
      vote_percentage: 26.1,
    },
    {
      id: 'option-8',
      text: 'Burgers',
      order_index: 3,
      vote_count: 5,
      vote_percentage: 21.7,
    },
  ],
};

export const mockPollData3: PollWithStatsAndOptions = {
  id: 'mock-poll-3',
  title: 'Should we extend the project deadline?',
  description: 'The current deadline is tight. Should we ask for a one-week extension?',
  author: {
    id: 'mock-author-3',
    name: 'Mike Johnson',
    username: 'mikejohnson',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  status: 'expired',
  is_public: true,
  allow_multiple_votes: false,
  expires_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (expired)
  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  total_votes: 89,
  options: [
    {
      id: 'option-9',
      text: 'Yes, extend by one week',
      order_index: 1,
      vote_count: 67,
      vote_percentage: 75.3,
    },
    {
      id: 'option-10',
      text: 'No, keep current deadline',
      order_index: 2,
      vote_count: 22,
      vote_percentage: 24.7,
    },
  ],
};
