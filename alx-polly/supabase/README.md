# Supabase Database Schema

This directory contains the database schema and migrations for the ALX Polly polling application.

## 📁 Files

- `migrations/001_initial_schema.sql` - Complete database schema with tables, views, functions, and policies
- `seed.sql` - Sample data for development and testing
- `README.md` - This documentation file

## 🗄️ Database Schema

### Tables

#### `profiles`
Extends Supabase's `auth.users` table with additional user information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, references `auth.users(id)` |
| `username` | VARCHAR(20) | Unique username |
| `name` | VARCHAR(100) | User's full name |
| `avatar_url` | TEXT | URL to user's avatar image |
| `created_at` | TIMESTAMP | When profile was created |
| `updated_at` | TIMESTAMP | When profile was last updated |

#### `polls`
Stores poll information and settings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | VARCHAR(200) | Poll title (3-200 characters) |
| `description` | TEXT | Optional poll description (max 1000 chars) |
| `author_id` | UUID | References `profiles(id)` |
| `status` | ENUM | 'active', 'expired', or 'draft' |
| `is_public` | BOOLEAN | Whether poll is visible to all users |
| `allow_multiple_votes` | BOOLEAN | Whether users can vote multiple times |
| `expires_at` | TIMESTAMP | Optional expiration date |
| `created_at` | TIMESTAMP | When poll was created |
| `updated_at` | TIMESTAMP | When poll was last updated |

#### `poll_options`
Stores the available options for each poll.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | References `polls(id)` |
| `text` | VARCHAR(100) | Option text (1-100 characters) |
| `order_index` | INTEGER | Display order within poll |
| `created_at` | TIMESTAMP | When option was created |

#### `votes`
Stores individual votes cast by users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | References `polls(id)` |
| `option_id` | UUID | References `poll_options(id)` |
| `voter_id` | UUID | References `profiles(id)` |
| `created_at` | TIMESTAMP | When vote was cast |

### Views

#### `poll_stats`
Aggregated statistics for polls including vote counts and computed status.

#### `option_stats`
Vote statistics for each poll option including count and percentage.

### Functions

#### `get_poll_with_stats(poll_uuid)`
Returns a poll with all its options and vote statistics in a single query.

## 🔐 Row Level Security (RLS)

The database uses Row Level Security to ensure users can only access appropriate data:

- **Profiles**: Users can view all profiles but only update their own
- **Polls**: Users can view public polls and their own polls, create polls, and manage their own polls
- **Poll Options**: Users can view options for public polls and their own polls, manage options for their own polls
- **Votes**: Users can view votes for public polls and their own polls, vote on public active polls, and delete their own votes

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `migrations/001_initial_schema.sql`
3. Run the migration

### 3. Seed Data (Optional)

1. In the SQL Editor, copy and paste the contents of `seed.sql`
2. Run the seed script to add sample data

### 4. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🔧 Database Features

### Automatic Profile Creation
When a user signs up via Supabase Auth, a profile is automatically created using the `handle_new_user()` trigger function.

### Poll Status Management
Polls can be automatically marked as expired based on their `expires_at` timestamp. A scheduled job can be set up to run this check periodically.

### Vote Constraints
- Users can only vote once per option (unless `allow_multiple_votes` is true)
- Users can only vote on active, public polls
- Users can only vote on polls that haven't expired

### Performance Optimizations
- Comprehensive indexing on frequently queried columns
- Materialized views for complex aggregations
- Optimized queries for poll statistics

## 📊 Sample Queries

### Get all public polls with vote counts
```sql
SELECT * FROM poll_stats WHERE is_public = true ORDER BY created_at DESC;
```

### Get a specific poll with all options and statistics
```sql
SELECT * FROM get_poll_with_stats('poll-uuid-here');
```

### Get user's polls
```sql
SELECT * FROM polls WHERE author_id = 'user-uuid-here' ORDER BY created_at DESC;
```

### Get poll options with vote counts
```sql
SELECT * FROM option_stats WHERE poll_id = 'poll-uuid-here' ORDER BY order_index;
```

## 🛠️ Maintenance

### Updating Poll Status
To mark expired polls as inactive, run:
```sql
UPDATE polls 
SET status = 'expired' 
WHERE expires_at IS NOT NULL 
  AND expires_at <= NOW() 
  AND status = 'active';
```

### Cleanup Old Data
To remove old expired polls (older than 1 year):
```sql
DELETE FROM polls 
WHERE status = 'expired' 
  AND created_at < NOW() - INTERVAL '1 year';
```

## 🔍 Monitoring

### Check Database Health
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY tablename, attname;
```

### Monitor Vote Activity
```sql
-- Recent vote activity
SELECT 
  p.title,
  COUNT(v.id) as votes_today
FROM polls p
LEFT JOIN votes v ON p.id = v.poll_id 
  AND v.created_at >= CURRENT_DATE
GROUP BY p.id, p.title
ORDER BY votes_today DESC;
```

## 🚨 Important Notes

1. **Backup**: Always backup your database before running migrations
2. **Testing**: Test migrations on a staging environment first
3. **Indexes**: Monitor query performance and add indexes as needed
4. **RLS**: Test RLS policies thoroughly to ensure proper access control
5. **Cleanup**: Regularly clean up old data to maintain performance

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
