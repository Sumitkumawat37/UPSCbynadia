-- Assign all courses to Shivam Sir
UPDATE courses 
SET instructor = 'Shivam Sir' 
WHERE instructor IS NULL OR instructor = 'Teacher Admin' OR instructor = 'Rajesh Kumar';
