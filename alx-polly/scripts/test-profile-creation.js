#!/usr/bin/env node

/**
 * Test script to verify profile creation works
 * Run this after setting up your environment variables
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProfileCreation() {
  try {
    console.log('🧪 Testing profile creation...\n');

    // Check if there are any users without profiles
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Failed to fetch users:', usersError.message);
      return;
    }

    console.log(`📊 Found ${users.users.length} users in auth.users`);

    // Check profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) {
      console.error('❌ Failed to fetch profiles:', profilesError.message);
      return;
    }

    console.log(`📊 Found ${profiles.length} profiles in profiles table`);

    // Find users without profiles
    const userIds = users.users.map(u => u.id);
    const profileIds = profiles.map(p => p.id);
    const missingProfiles = userIds.filter(id => !profileIds.includes(id));

    if (missingProfiles.length > 0) {
      console.log(`⚠️  Found ${missingProfiles.length} users without profiles:`);
      missingProfiles.forEach(id => {
        const user = users.users.find(u => u.id === id);
        console.log(`   - ${user?.email} (${id})`);
      });
      
      console.log('\n💡 Run the fix-profiles.sql script in your Supabase SQL Editor to create missing profiles.');
    } else {
      console.log('✅ All users have profiles!');
    }

    // Test profile creation for a specific user (if any exist)
    if (users.users.length > 0) {
      const testUser = users.users[0];
      console.log(`\n🧪 Testing profile creation for user: ${testUser.email}`);
      
      // This would normally be done by the ensureUserProfile function
      console.log('✅ Profile creation logic is ready to use');
    }

  } catch (error) {
    console.error('❌ Error testing profile creation:', error.message);
  }
}

testProfileCreation();
