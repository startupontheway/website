-- Since the admin panel relies on a custom hardcoded login (not Supabase Auth),
-- we need to grant public access for inserts and updates for the admin to work.

DROP POLICY IF EXISTS "Allow authenticated full access to faqs" ON public.faqs;

CREATE POLICY "Allow public full access to faqs" 
    ON public.faqs FOR ALL 
    USING (true);
