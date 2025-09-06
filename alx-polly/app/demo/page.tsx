'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockPollData, mockPollData2, mockPollData3 } from '@/components/polls/MockPollData';
import { CheckCircle, BarChart3, Users, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';

export default function DemoPage() {
  const [selectedPoll, setSelectedPoll] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const polls = [mockPollData, mockPollData2, mockPollData3];
  const poll = polls[selectedPoll];

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
      setVoteSubmitted(true);
      setShowResults(true);
    }
  };

  const handleSubmitVote = (e: React.FormEvent) => {
    e.preventDefault();
    handleVote();
  };

  const getVotePercentage = (votes: number) => {
    if (poll?.total_votes === 0) return 0;
    return Math.round((votes / poll.total_votes) * 100);
  };

  const isExpired = poll?.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Poll Detail Demo</h1>
            <p className="text-gray-600 mb-6">
              Interactive demonstration of the poll detail page with voting functionality.
            </p>
            
            {/* Poll Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {polls.map((p, index) => (
                <Button
                  key={p.id}
                  variant={selectedPoll === index ? "default" : "outline"}
                  onClick={() => {
                    setSelectedPoll(index);
                    setHasVoted(false);
                    setSelectedOption('');
                    setShowResults(false);
                    setVoteSubmitted(false);
                  }}
                  className="text-sm"
                >
                  {p.title}
                </Button>
              ))}
            </div>
          </div>

          <Card className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{poll.title}</CardTitle>
                  {poll.description && (
                    <CardDescription className="text-base">
                      {poll.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isExpired && <Badge variant="destructive">Expired</Badge>}
                  {!poll.is_public && <Badge variant="secondary">Private</Badge>}
                  {poll.allow_multiple_votes && <Badge variant="outline">Multiple votes</Badge>}
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
                <span>{poll.total_votes} votes</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Poll Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{poll.total_votes}</p>
                    <p className="text-xs text-gray-500">Total Votes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{poll.options.length}</p>
                    <p className="text-xs text-gray-500">Options</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {poll.expires_at ? formatRelativeTime(poll.expires_at) : 'No expiry'}
                    </p>
                    <p className="text-xs text-gray-500">Expires</p>
                  </div>
                </div>
              </div>

              {/* Voting Form or Results */}
              {!hasVoted && !isExpired ? (
                <form onSubmit={handleSubmitVote} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Choose your answer:</Label>
                    <RadioGroup
                      value={selectedOption}
                      onValueChange={setSelectedOption}
                      className="space-y-3"
                    >
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label 
                            htmlFor={option.id} 
                            className="flex-1 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={!selectedOption}
                    className="w-full"
                  >
                    Submit Vote
                  </Button>
                </form>
              ) : voteSubmitted ? (
                <div className="text-center space-y-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Thank you for voting!</h3>
                    <p className="text-green-700">Your vote has been recorded successfully.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResults(!showResults)}
                    className="mt-2"
                  >
                    {showResults ? 'Hide Results' : 'View Results'}
                  </Button>
                </div>
              ) : isExpired ? (
                <div className="text-center space-y-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Poll Expired</h3>
                    <p className="text-gray-600">This poll is no longer accepting votes.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowResults(!showResults)}
                    className="mt-2"
                  >
                    {showResults ? 'Hide Results' : 'View Results'}
                  </Button>
                </div>
              ) : null}

              {/* Results Display */}
              {(showResults || hasVoted || isExpired) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <Badge variant="outline">{poll.total_votes} votes</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const percentage = getVotePercentage(option.vote_count);
                      const isSelected = selectedOption === option.id;
                      
                      return (
                        <div key={option.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                              {option.text}
                              {isSelected && <span className="ml-2 text-blue-600">✓</span>}
                            </span>
                            <span className="text-sm font-medium text-gray-600">
                              {option.vote_count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                isSelected ? 'bg-blue-600' : 'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
