'use client';

import { useState } from 'react';
import { CreatePollForm } from '../components/CreatePollForm';
import { CreatePollForm as CreatePollFormType } from '@/types';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreatePoll = async (data: CreatePollFormType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual poll creation logic
      console.log('Create poll data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just redirect to polls page
      router.push('/polls');
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
          <p className="text-gray-600">Share your question with the community and gather opinions</p>
        </div>
        
        <CreatePollForm 
          onSubmit={handleCreatePoll}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}
