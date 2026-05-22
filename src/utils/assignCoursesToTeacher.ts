import { supabase } from "@/integrations/supabase/client";

export async function assignAllCoursesToTeacher() {
  try {
    console.log("Fetching all courses...");
    const { data: courses, error } = await supabase
      .from("courses")
      .select("id, instructor");

    if (error) {
      console.error("Error fetching courses:", error);
      return { success: false, error };
    }

    console.log(`Found ${courses.length} courses`);

    let updatedCount = 0;
    for (const course of courses) {
      if (course.instructor !== "Shivam Sir") {
        console.log(`Updating course ${course.id}: ${course.instructor} -> Shivam Sir`);
        const { error: updateError } = await supabase
          .from("courses")
          .update({ instructor: "Shivam Sir" })
          .eq("id", course.id);

        if (updateError) {
          console.error(`Error updating course ${course.id}:`, updateError);
        } else {
          console.log(`✓ Updated course ${course.id}`);
          updatedCount++;
        }
      } else {
        console.log(`Course ${course.id} already assigned to Shivam Sir`);
      }
    }

    console.log(`Done! Updated ${updatedCount} courses.`);
    return { success: true, updatedCount };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error };
  }
}
