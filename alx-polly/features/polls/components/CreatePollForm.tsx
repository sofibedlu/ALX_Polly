'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createPoll } from '@/lib/api/polls';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const createPollSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  isPublic: z.boolean(),
  allowMultipleVotes: z.boolean(),
  expiresAt: z.string().optional(),
});

interface CreatePollFormProps {
  onSuccess?: (pollId: string) => void;
}

export function CreatePollForm({ onSuccess }: CreatePollFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePollFormType>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', ''],
      isPublic: true,
      allowMultipleVotes: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');

  const addOption = () => {
    if (fields.length < 10) {
      append('');
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const onSubmit = async (data: z.infer<typeof createPollSchema>) => {
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createPoll(data, user.id);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data.poll.id);
        } else {
          router.push(`/polls/${result.data.poll.id}`);
        }
      } else {
        setError(result.error || 'Failed to create poll');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error creating poll:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a poll to gather opinions and make decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="What should we have for lunch?"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more context about your poll..."
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={fields.length >= 10 || isLoading}
              >
                Add Option
              </Button>
            </div>
            
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    {...register(`options.${index}` as const)}
                    disabled={isLoading}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.options && (
              <p className="text-sm text-red-500">{errors.options.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                {...register('isPublic')}
                disabled={isLoading}
                className="rounded"
              />
              <Label htmlFor="isPublic">Make this poll public</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowMultipleVotes"
                {...register('allowMultipleVotes')}
                disabled={isLoading}
                className="rounded"
              />
              <Label htmlFor="allowMultipleVotes">Allow multiple votes per user</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              {...register('expiresAt')}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
