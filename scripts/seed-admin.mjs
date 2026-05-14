// Run with: node scripts/seed-admin.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://naysnsxwazrvxfbtmrbn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aYEAYkzTtU9dt58ZEPetNw_n5cB3P9G';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEMO_ACCOUNTS = [
  { email: 'student@demo.com',    password: '123456', name: 'Demo Student',  role: 'student' },
  { email: 'teacher@demo.com',    password: '123456', name: 'Teacher Admin', role: 'admin'   },
  { email: 'superadmin@demo.com', password: '123456', name: 'Super Admin',   role: 'admin'   },
];

async function seedAccount({ email, password, name, role }) {
  console.log(`\n→ Processing ${email}...`);

  // Try sign-in first (already exists)
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
  if (!signInErr && signInData?.user) {
    console.log(`  ✓ Already exists and confirmed — user id: ${signInData.user.id}`);
    await ensureProfile(signInData.user.id, name, email, role);
    await supabase.auth.signOut();
    return;
  }

  console.log(`  Sign-in failed (${signInErr?.message}), trying sign-up...`);

  // Sign up
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (signUpErr) {
    console.error(`  ✗ Sign-up error: ${signUpErr.message}`);
    return;
  }

  if (signUpData?.user) {
    console.log(`  ✓ Account created — user id: ${signUpData.user.id}`);
    if (signUpData.session) {
      console.log('  ✓ Auto-confirmed (no email confirmation required)');
      await ensureProfile(signUpData.user.id, name, email, role);
      await supabase.auth.signOut();
    } else {
      console.log('  ⚠ Email confirmation required — run the SQL in Supabase dashboard to confirm');
    }
  }
}

async function ensureProfile(userId, name, email, role) {
  // Upsert profile
  const { error: profileErr } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, name, email }, { onConflict: 'user_id' });
  if (profileErr) console.error(`  Profile error: ${profileErr.message}`);
  else console.log(`  ✓ Profile set`);

  // Assign role
  if (role === 'admin') {
    const { error: roleErr } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
    if (roleErr) console.error(`  Role error: ${roleErr.message}`);
    else console.log(`  ✓ Admin role assigned`);
  }
}

console.log('=== UPSC Nadiya — Demo Account Seeder ===');
for (const account of DEMO_ACCOUNTS) {
  await seedAccount(account);
}
console.log('\n=== Done ===');
