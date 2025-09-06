# ALX Polly - Setup Guide

This guide will help you set up the ALX Polly polling application with Supabase as the backend.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))
- Git (for cloning the repository)

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd alx-polly

# Install dependencies
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "alx-polly"
   - Set a database password (save this!)
   - Choose a region close to you
   - Click "Create new project"

2. **Get Your Project Credentials**
   - Go to Settings → API
   - Copy the following values:
     - Project URL
     - Anon (public) key
     - Service role key (secret)

3. **Set Up Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   nano .env.local
   ```

   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 4. Set Up Database Schema

1. **Run the Database Setup Script**
   ```bash
   npm run db:setup
   ```

2. **Apply the Migration**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run the migration

3. **Seed Sample Data (Optional)**
   - In the SQL Editor, copy the contents of `supabase/seed.sql`
   - Paste and run the seed script

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema Overview

The database includes the following main tables:

- **`profiles`** - User profiles (extends Supabase auth)
- **`polls`** - Poll information and settings
- **`poll_options`** - Available options for each poll
- **`votes`** - Individual votes cast by users

### Key Features

- **Row Level Security (RLS)** - Users can only access appropriate data
- **Automatic Profile Creation** - Profiles created when users sign up
- **Poll Status Management** - Automatic expiration handling
- **Vote Constraints** - Prevents duplicate votes (unless allowed)
- **Performance Optimizations** - Comprehensive indexing and views

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL (default: localhost:3000/api) | No |
| `NEXT_PUBLIC_APP_URL` | App URL (default: localhost:3000) | No |

### Supabase Configuration

1. **Authentication Settings**
   - Go to Authentication → Settings
   - Configure your site URL: `http://localhost:3000`
   - Add redirect URLs as needed

2. **Row Level Security**
   - RLS is enabled by default
   - Policies are included in the migration
   - Test thoroughly in development

3. **Storage (Optional)**
   - Create a storage bucket for avatars
   - Set appropriate policies for file uploads

## 🧪 Testing

### Test the Setup

1. **Start the app**: `npm run dev`
2. **Visit the homepage**: Should show the landing page
3. **Try registration**: Create a new account
4. **Try login**: Sign in with your account
5. **Create a poll**: Test poll creation
6. **Vote on polls**: Test the voting functionality

### Database Testing

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check sample data
SELECT * FROM profiles LIMIT 5;
SELECT * FROM polls LIMIT 5;
SELECT * FROM poll_options LIMIT 10;
SELECT * FROM votes LIMIT 10;
```

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your environment variables
   - Ensure you're using the correct keys
   - Verify the Supabase URL is correct

2. **Database connection issues**
   - Check your Supabase project status
   - Verify the migration was applied correctly
   - Check the SQL Editor for any errors

3. **Authentication not working**
   - Check Supabase Auth settings
   - Verify site URL configuration
   - Check browser console for errors

4. **RLS policies blocking access**
   - Check the policies in Supabase dashboard
   - Verify user authentication status
   - Test with different user accounts

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

### Check Logs

- **Supabase Logs**: Dashboard → Logs
- **Browser Console**: F12 → Console
- **Next.js Logs**: Terminal where you ran `npm run dev`

## 📚 Next Steps

Once the basic setup is working:

1. **Customize the UI** - Modify components and styling
2. **Add Features** - Implement additional functionality
3. **Set Up Production** - Deploy to Vercel/Netlify
4. **Configure Domain** - Set up custom domain
5. **Add Monitoring** - Set up error tracking and analytics

## 🆘 Getting Help

- **Documentation**: Check the `README.md` and `supabase/README.md`
- **Issues**: Create an issue in the repository
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 🔄 Updates

To update the database schema:

1. Create a new migration file
2. Test in development first
3. Apply to production carefully
4. Always backup before major changes

## 📝 Notes

- The database uses UUIDs for all primary keys
- All timestamps are in UTC
- RLS policies are strict by default
- Sample data is included for development
- The schema is designed to scale with your application

---

**Happy Polling! 🗳️**
