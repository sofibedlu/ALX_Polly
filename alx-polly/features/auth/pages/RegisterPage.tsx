'use client';

import { useState } from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { RegisterForm as RegisterFormType } from '@/types';
import Link from 'next/link';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterFormType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual registration logic
      console.log('Register data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just redirect or show success
      // router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
        
        <RegisterForm 
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}
