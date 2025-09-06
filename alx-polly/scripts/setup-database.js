#!/usr/bin/env node

/**
 * Database setup script for ALX Polly
 * This script helps set up the Supabase database with the required schema
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('🚀 Setting up ALX Polly database...\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Read seed file
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log('📄 Seed file loaded');

    // Note: In a real implementation, you would use the Supabase client
    // to execute these SQL commands. For now, we'll just display instructions.
    
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the migration SQL:');
    console.log(`   File: ${migrationPath}`);
    console.log('4. Run the migration');
    console.log('5. (Optional) Copy and paste the seed SQL:');
    console.log(`   File: ${seedPath}`);
    console.log('6. Run the seed script');

    console.log('\n✅ Database setup instructions generated!');
    console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
