// Database types generated from Supabase schema
// These types match the database schema exactly

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          author_id: string
          status: 'active' | 'expired' | 'draft'
          is_public: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          author_id: string
          status?: 'active' | 'expired' | 'draft'
          is_public?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          author_id?: string
          status?: 'active' | 'expired' | 'draft'
          is_public?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          voter_id: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          voter_id: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          voter_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      poll_stats: {
        Row: {
          id: string
          title: string
          description: string | null
          author_id: string
          status: 'active' | 'expired' | 'draft'
          is_public: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
          total_votes: number
          option_count: number
          computed_status: string
        }
        Relationships: []
      }
      option_stats: {
        Row: {
          id: string
          poll_id: string
          text: string
          order_index: number
          created_at: string
          vote_count: number
          vote_percentage: number
        }
        Relationships: []
      }
    }
    Functions: {
      get_poll_with_stats: {
        Args: {
          poll_uuid: string
        }
        Returns: {
          poll_id: string
          title: string
          description: string | null
          author_id: string
          author_name: string
          author_username: string
          status: 'active' | 'expired' | 'draft'
          is_public: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
          total_votes: number
          option_id: string
          option_text: string
          option_order: number
          option_votes: number
          option_percentage: number
        }[]
      }
    }
    Enums: {
      poll_status: 'active' | 'expired' | 'draft'
      vote_type: 'single' | 'multiple'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific table types
export type Profile = Tables<'profiles'>
export type Poll = Tables<'polls'>
export type PollOption = Tables<'poll_options'>
export type Vote = Tables<'votes'>

// View types
export type PollStats = Database['public']['Views']['poll_stats']['Row']
export type OptionStats = Database['public']['Views']['option_stats']['Row']

// Function return types
export type PollWithStats = Database['public']['Functions']['get_poll_with_stats']['Returns'][0]

// Enum types
export type PollStatus = Enums<'poll_status'>
export type VoteType = Enums<'vote_type'>

// Extended types with relationships
export type PollWithAuthor = Poll & {
  author: Profile
}

export type PollWithOptions = Poll & {
  options: PollOption[]
}

export type PollWithStatsAndOptions = Poll & {
  author: Profile
  options: (PollOption & {
    vote_count: number
    vote_percentage: number
  })[]
  total_votes: number
}

export type PollOptionWithStats = PollOption & {
  vote_count: number
  vote_percentage: number
}

// Insert types
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

// Update types
export type PollUpdate = Database['public']['Tables']['polls']['Update']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
