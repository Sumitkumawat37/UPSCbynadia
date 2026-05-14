
-- ============================================================
-- Seed superadmin@demo.com as a fully confirmed admin account
-- ============================================================

-- 1. Update handle_new_user trigger to assign admin role for superadmin@demo.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Assign roles based on email
  IF NEW.email = 'teacher@demo.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF NEW.email = 'superadmin@demo.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Confirm emails for ALL three demo accounts so they can always sign in
UPDATE auth.users
SET
  email_confirmed_at  = COALESCE(email_confirmed_at, now()),
  confirmation_token  = '',
  updated_at          = now()
WHERE email IN ('student@demo.com', 'teacher@demo.com', 'superadmin@demo.com');

-- 3. If superadmin@demo.com already exists but has no admin role, add it now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'superadmin@demo.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Remove any accidental 'student' role from superadmin@demo.com
DELETE FROM public.user_roles
WHERE role = 'student'
  AND user_id = (SELECT id FROM auth.users WHERE email = 'superadmin@demo.com');

-- 5. Ensure the profile row exists for superadmin@demo.com
INSERT INTO public.profiles (user_id, name, email)
SELECT id, 'Super Admin', 'superadmin@demo.com'
FROM auth.users
WHERE email = 'superadmin@demo.com'
ON CONFLICT (user_id) DO UPDATE
  SET name       = 'Super Admin',
      email      = 'superadmin@demo.com',
      updated_at = now();
