'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PollCardProps } from '@/types';
import { formatDistanceToNow } from 'date-fns';

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
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

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
            <AvatarImage src={poll.author.avatar} alt={poll.author.name} />
            <AvatarFallback>{poll.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>by {poll.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}</span>
          <span>•</span>
          <span>{poll.totalVotes} votes</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = getVotePercentage(option.votes);
            const isSelected = selectedOption === option.id;
            
            return (
              <div key={option.id} className="space-y-1">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleVote(option.id)}
                  disabled={isExpired || (hasVoted && !poll.allowMultipleVotes)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-left">{option.text}</span>
                    <span className="text-sm font-medium">
                      {option.votes} ({percentage}%)
                    </span>
                  </div>
                </Button>
                
                {hasVoted && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
