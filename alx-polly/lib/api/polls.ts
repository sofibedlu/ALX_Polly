import { supabase } from '@/lib/supabase/client'
import { ensureUserProfile } from './profiles'
import { 
  Poll, 
  PollInsert, 
  PollOptionInsert, 
  PollWithStatsAndOptions,
  PollWithAuthor,
  CreatePollForm as CreatePollFormType 
} from '@/lib/supabase/types'

// Create a new poll with options
export async function createPoll(pollData: CreatePollFormType, userId: string) {
  try {
    // First, ensure the user profile exists
    const profileResult = await ensureUserProfile(userId)
    if (!profileResult.success) {
      throw new Error(profileResult.error || 'Failed to ensure user profile')
    }

    // Now create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description || null,
        author_id: userId,
        is_public: pollData.isPublic,
        allow_multiple_votes: pollData.allowMultipleVotes,
        expires_at: pollData.expiresAt ? new Date(pollData.expiresAt).toISOString() : null,
      })
      .select()
      .single()

    if (pollError) {
      throw new Error(`Failed to create poll: ${pollError.message}`)
    }

    // Then, create the poll options
    const optionsData: PollOptionInsert[] = pollData.options.map((optionText, index) => ({
      poll_id: poll.id,
      text: optionText,
      order_index: index + 1,
    }))

    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData)
      .select()

    if (optionsError) {
      // If options creation fails, clean up the poll
      await supabase.from('polls').delete().eq('id', poll.id)
      throw new Error(`Failed to create poll options: ${optionsError.message}`)
    }

    return {
      success: true,
      data: {
        poll,
        options,
      },
    }
  } catch (error) {
    console.error('Error creating poll:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create poll',
    }
  }
}

// Get all public polls with author information
export async function getPublicPolls(limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        author:profiles(id, username, name, avatar_url)
      `)
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch polls: ${error.message}`)
    }

    return {
      success: true,
      data: data as PollWithAuthor[],
    }
  } catch (error) {
    console.error('Error fetching polls:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch polls',
      data: [],
    }
  }
}

// Get a specific poll with all options and statistics
export async function getPollWithStats(pollId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_poll_with_stats', { poll_uuid: pollId })

    if (error) {
      throw new Error(`Failed to fetch poll: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Poll not found',
        data: null,
      }
    }

    // Transform the data into a more usable format
    const pollData = data[0]
    const poll = {
      id: pollData.poll_id,
      title: pollData.title,
      description: pollData.description,
      author: {
        id: pollData.author_id,
        name: pollData.author_name,
        username: pollData.author_username,
      },
      status: pollData.status,
      is_public: pollData.is_public,
      allow_multiple_votes: pollData.allow_multiple_votes,
      expires_at: pollData.expires_at,
      created_at: pollData.created_at,
      updated_at: pollData.updated_at,
      total_votes: pollData.total_votes,
    }

    const options = data.map(row => ({
      id: row.option_id,
      text: row.option_text,
      order_index: row.option_order,
      vote_count: row.option_votes,
      vote_percentage: row.option_percentage,
    }))

    return {
      success: true,
      data: {
        ...poll,
        options,
      } as PollWithStatsAndOptions,
    }
  } catch (error) {
    console.error('Error fetching poll with stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch poll',
      data: null,
    }
  }
}

// Get polls created by a specific user
export async function getUserPolls(userId: string, limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        author:profiles(id, username, name, avatar_url)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch user polls: ${error.message}`)
    }

    return {
      success: true,
      data: data as PollWithAuthor[],
    }
  } catch (error) {
    console.error('Error fetching user polls:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user polls',
      data: [],
    }
  }
}

// Vote on a poll
export async function voteOnPoll(pollId: string, optionId: string, userId: string) {
  try {
    // First, check if the poll allows multiple votes
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('allow_multiple_votes, status, is_public')
      .eq('id', pollId)
      .single()

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`)
    }

    if (poll.status !== 'active') {
      throw new Error('Poll is not active')
    }

    if (!poll.is_public) {
      throw new Error('Poll is not public')
    }

    // Check if user has already voted on this option (if multiple votes not allowed)
    if (!poll.allow_multiple_votes) {
      const { data: existingVote, error: voteCheckError } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('voter_id', userId)
        .eq('option_id', optionId)
        .single()

      if (existingVote) {
        throw new Error('You have already voted on this poll')
      }
    }

    // Create the vote
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        voter_id: userId,
      })
      .select()
      .single()

    if (voteError) {
      throw new Error(`Failed to vote: ${voteError.message}`)
    }

    return {
      success: true,
      data: vote,
    }
  } catch (error) {
    console.error('Error voting on poll:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to vote on poll',
    }
  }
}

// Delete a poll (only by author)
export async function deletePoll(pollId: string, userId: string) {
  try {
    // First, verify the user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('author_id')
      .eq('id', pollId)
      .single()

    if (pollError) {
      throw new Error(`Failed to fetch poll: ${pollError.message}`)
    }

    if (poll.author_id !== userId) {
      throw new Error('You can only delete your own polls')
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      throw new Error(`Failed to delete poll: ${deleteError.message}`)
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting poll:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete poll',
    }
  }
}

// Search polls by title or description
export async function searchPolls(query: string, limit = 20, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        author:profiles(id, username, name, avatar_url)
      `)
      .eq('is_public', true)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to search polls: ${error.message}`)
    }

    return {
      success: true,
      data: data as PollWithAuthor[],
    }
  } catch (error) {
    console.error('Error searching polls:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search polls',
      data: [],
    }
  }
}
