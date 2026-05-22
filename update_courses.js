// Read environment variables from the project
const fs = require('fs');
const path = require('path');

// Try to find .env file
const envPaths = ['.env', '.env.local', '.env.example'];
let supabaseUrl, supabaseKey;

for (const envPath of envPaths) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
    const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.+)/);
    
    if (urlMatch && keyMatch) {
      supabaseUrl = urlMatch[1].trim();
      supabaseKey = keyMatch[1].trim();
      console.log(`Found credentials in ${envPath}`);
      break;
    }
  } catch (e) {
    // File doesn't exist, continue
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Could not find Supabase credentials. Please manually update courses in the Supabase dashboard.');
  console.log('SQL to run: UPDATE courses SET instructor = "Teacher Admin" WHERE instructor IS NULL OR instructor = "Rajesh Kumar";');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('To update all courses, run this SQL in your Supabase dashboard:');
console.log('');
console.log("UPDATE courses SET instructor = 'Teacher Admin' WHERE instructor IS NULL OR instructor = 'Rajesh Kumar';");
console.log('');
console.log('Or use the Supabase CLI: npx supabase db execute --sql "UPDATE courses SET instructor = \'Teacher Admin\' WHERE instructor IS NULL OR instructor = \'Rajesh Kumar\'"');
