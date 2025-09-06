'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PollWithAuthor } from '@/lib/supabase/types';
import { formatRelativeTime } from '@/lib/utils/format';

interface PollCardProps {
  poll: PollWithAuthor;
  onVote?: (pollId: string, optionId: string) => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
}

export function PollCard({ poll, onVote, onEdit, onDelete }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId: string) => {
    if (hasVoted && !poll.allowMultipleVotes) return;
    
    setSelectedOption(optionId);
    if (onVote) {
      onVote(poll.id, optionId);
    }
    setHasVoted(true);
  };

  const getVotePercentage = (votes: number) => {
    // For now, we don't have vote counts in the basic poll query
    // This would need to be updated when we add vote statistics
    return 0;
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription>{poll.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isExpired && <Badge variant="destructive">Expired</Badge>}
            {!poll.isPublic && <Badge variant="secondary">Private</Badge>}
            {poll.allowMultipleVotes && <Badge variant="outline">Multiple votes</Badge>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={poll.author.avatar_url || undefined} alt={poll.author.name} />
            <AvatarFallback>{poll.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>by {poll.author.name}</span>
          <span>•</span>
          <span>{formatRelativeTime(poll.created_at)}</span>
          <span>•</span>
          <span>0 votes</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <p className="text-gray-600">
            Click to view poll details and vote
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex justify-end space-x-2 pt-2 border-t">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(poll.id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(poll.id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
