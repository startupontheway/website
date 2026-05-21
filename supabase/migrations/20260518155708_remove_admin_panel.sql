-- Drop storage.objects policies related to admin or role checks
DROP POLICY IF EXISTS "Admins upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins list blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone reads blog images" ON storage.objects;

-- Restore public read access to blog images (so your front-end blog can display them!)
CREATE POLICY "Anyone reads blog images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'blog-images');

-- Drop table-specific admin policies
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins read all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins manage blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins delete leads" ON public.leads;
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;

-- Simplify the new-user signup trigger (only write to profiles, do not reference user_roles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Clean up tables, functions, and types related to user roles (using CASCADE to handle dependencies)
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role) CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
