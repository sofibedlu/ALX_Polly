'use client';

import { useState, useEffect } from 'react';
import { PollList } from '@/features/polls/components/PollList';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getPublicPolls, searchPolls } from '@/lib/api/polls';
import { PollWithAuthor } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PollsPage() {
  const [polls, setPolls] = useState<PollWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'recent'>('newest');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadPolls = async (searchQuery?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      if (searchQuery && searchQuery.trim()) {
        result = await searchPolls(searchQuery.trim());
      } else {
        result = await getPublicPolls();
      }

      if (result.success) {
        setPolls(result.data);
      } else {
        setError(result.error || 'Failed to load polls');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading polls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPolls(searchTerm);
  };

  const handlePollClick = (pollId: string) => {
    router.push(`/polls/${pollId}`);
  };

  const sortedPolls = [...polls].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        // For now, sort by created_at since we don't have vote counts in the basic query
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'recent':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
                <p className="text-gray-600">Discover and participate in community polls</p>
              </div>
              <Button asChild>
                <Link href="/create">Create New Poll</Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input
                  placeholder="Search polls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline">
                  Search
                </Button>
              </form>
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
                {polls.filter(p => p.is_public).length} Public
              </Badge>
              <Badge variant="outline">
                {polls.filter(p => p.status === 'active').length} Active
              </Badge>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadPolls()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          <PollList
            polls={sortedPolls}
            isLoading={isLoading}
            onPollClick={handlePollClick}
          />
        </div>
      </div>
    </Layout>
  );
}
