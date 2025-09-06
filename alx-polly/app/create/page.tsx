'use client';

import { CreatePollForm } from '@/features/polls/components/CreatePollForm';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function CreatePollPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
            <p className="text-gray-600">Share your question with the community and gather opinions</p>
          </div>
          
          <CreatePollForm 
            onSuccess={(pollId) => {
              router.push(`/polls/${pollId}`);
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
