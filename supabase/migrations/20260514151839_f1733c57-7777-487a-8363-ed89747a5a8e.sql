
DROP POLICY IF EXISTS "Anyone reads blog images" ON storage.objects;
CREATE POLICY "Admins list blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
