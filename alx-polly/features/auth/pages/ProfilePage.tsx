'use client';

import { useState } from 'react';
import { UserProfile } from '../components/UserProfile';
import { AuthUser } from '@/types';

// Mock user data - replace with actual user from context/state
const mockUser: AuthUser = {
  id: '1',
  email: 'user@example.com',
  username: 'johndoe',
  name: 'John Doe',
  avatar: undefined,
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (data: Partial<AuthUser>) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual profile update logic
      console.log('Update profile data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user state/context here
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement actual logout logic
      console.log('Logging out...');
      
      // Clear user session, redirect to login, etc.
      // router.push('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <UserProfile
          user={mockUser}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
