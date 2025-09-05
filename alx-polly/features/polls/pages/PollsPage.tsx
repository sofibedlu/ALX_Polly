'use client';

import { useState, useEffect } from 'react';
import { PollList } from '../components/PollList';
import { Poll } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual API calls
const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'What should we have for lunch?',
    description: 'Team lunch decision for this Friday',
    options: [
      { id: '1', text: 'Pizza', votes: 5, pollId: '1' },
      { id: '2', text: 'Sushi', votes: 3, pollId: '1' },
      { id: '3', text: 'Burgers', votes: 7, pollId: '1' },
    ],
    author: {
      id: '1',
      email: 'john@example.com',
      username: 'johndoe',
      name: 'John Doe',
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isActive: true,
    isPublic: true,
    allowMultipleVotes: false,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(),
    totalVotes: 15,
  },
  {
    id: '2',
    title: 'Best programming language for web development?',
    description: 'What do you think is the best language for building web applications?',
    options: [
      { id: '4', text: 'JavaScript/TypeScript', votes: 12, pollId: '2' },
      { id: '5', text: 'Python', votes: 8, pollId: '2' },
      { id: '6', text: 'Java', votes: 4, pollId: '2' },
      { id: '7', text: 'Go', votes: 6, pollId: '2' },
    ],
    author: {
      id: '2',
      email: 'jane@example.com',
      username: 'janesmith',
      name: 'Jane Smith',
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isActive: true,
    isPublic: true,
    allowMultipleVotes: true,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(),
    totalVotes: 30,
  },
];

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'recent'>('newest');

  useEffect(() => {
    // Simulate API call
    const loadPolls = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPolls(mockPolls);
      setIsLoading(false);
    };

    loadPolls();
  }, []);

  const filteredPolls = polls.filter(poll =>
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.totalVotes - a.totalVotes;
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });

  const handlePollClick = (pollId: string) => {
    // TODO: Navigate to poll detail page
    console.log('Navigate to poll:', pollId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
              <p className="text-gray-600">Discover and participate in community polls</p>
            </div>
            <Button>
              Create New Poll
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Showing {sortedPolls.length} polls</span>
            <Badge variant="secondary">
              {polls.filter(p => p.isPublic).length} Public
            </Badge>
            <Badge variant="outline">
              {polls.filter(p => p.isActive).length} Active
            </Badge>
          </div>
        </div>

        <PollList
          polls={sortedPolls}
          isLoading={isLoading}
          onPollClick={handlePollClick}
        />
      </div>
    </div>
  );
}
