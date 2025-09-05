'use client';

import { PollListProps } from '@/types';
import { PollCard } from './PollCard';
import { Card, CardContent } from '@/components/ui/card';

export function PollList({ polls, isLoading = false, onPollClick }: PollListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No polls found</h3>
            <p className="text-muted-foreground">
              There are no polls available at the moment. Check back later or create a new poll!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div
          key={poll.id}
          onClick={() => onPollClick?.(poll.id)}
          className="cursor-pointer"
        >
          <PollCard
            poll={poll}
            onVote={(pollId, optionId) => {
              // TODO: Implement vote handling
              console.log('Vote:', { pollId, optionId });
            }}
            onEdit={(pollId) => {
              // TODO: Implement edit handling
              console.log('Edit poll:', pollId);
            }}
            onDelete={(pollId) => {
              // TODO: Implement delete handling
              console.log('Delete poll:', pollId);
            }}
          />
        </div>
      ))}
    </div>
  );
}
