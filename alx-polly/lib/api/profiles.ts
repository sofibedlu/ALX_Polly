import { supabase } from '@/lib/supabase/client'

// Ensure user profile exists, create if it doesn't
export async function ensureUserProfile(userId: string) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, username, name')
      .eq('id', userId)
      .single()

    if (existingProfile) {
      return {
        success: true,
        data: existingProfile,
      }
    }

    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData.user) {
        throw new Error('User not found')
      }

      const profileData = {
        id: userId,
        username: userData.user.user_metadata?.username || `user_${userId.substring(0, 8)}`,
        name: userData.user.user_metadata?.name || 'User',
        avatar_url: userData.user.user_metadata?.avatar_url || null,
      }

      const { data: newProfile, error: profileCreateError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (profileCreateError) {
        throw new Error(`Failed to create profile: ${profileCreateError.message}`)
      }

      return {
        success: true,
        data: newProfile,
      }
    } else if (profileCheckError) {
      throw new Error(`Failed to check profile: ${profileCheckError.message}`)
    }

    return {
      success: false,
      error: 'Unknown error checking profile',
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to ensure user profile',
    }
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, try to create it
        return await ensureUserProfile(userId)
      }
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user profile',
    }
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: {
  username?: string
  name?: string
  avatar_url?: string | null
}) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user profile',
    }
  }
}
