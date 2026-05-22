import { supabase } from "@/integrations/supabase/client";

export async function fixDemoAccounts() {
  try {
    console.log("Fetching all users...");
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error fetching users:", listError);
      return { success: false, error: listError };
    }

    const demoAccounts = [
      { email: "teacher@demo.com", role: "admin" as const, name: "Shivam Sir" },
      { email: "superadmin@demo.com", role: "admin" as const, name: "Super Admin" },
      { email: "student@demo.com", role: "student" as const, name: "Demo Student" },
    ];

    let fixedCount = 0;

    for (const demo of demoAccounts) {
      const user = users?.find((u: any) => u.email === demo.email);
      
      if (user) {
        console.log(`Found user: ${demo.email} (${user.id})`);
        
        // Check if role exists
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (!existingRole) {
          console.log(`Assigning role ${demo.role} to ${demo.email}`);
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: user.id, role: demo.role });
          
          if (roleError) {
            console.error(`Error assigning role to ${demo.email}:`, roleError);
          } else {
            console.log(`✓ Assigned role to ${demo.email}`);
            fixedCount++;
          }
        } else {
          console.log(`${demo.email} already has role: ${existingRole.role}`);
        }

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", user.id)
          .single();

        if (!existingProfile) {
          console.log(`Creating profile for ${demo.email}`);
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({ user_id: user.id, name: demo.name });
          
          if (profileError) {
            console.error(`Error creating profile for ${demo.email}:`, profileError);
          } else {
            console.log(`✓ Created profile for ${demo.email}`);
          }
        }
      }
    }

    console.log(`Done! Fixed ${fixedCount} accounts.`);
    return { success: true, fixedCount };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
}
