-- Rename blogs to vlogs
ALTER TABLE IF EXISTS public.blogs RENAME TO vlogs;

-- Add video columns to vlogs
ALTER TABLE public.vlogs ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.vlogs ADD COLUMN IF NOT EXISTS video_type TEXT CHECK (video_type IN ('youtube', 'upload'));

-- Enable Row Level Security
ALTER TABLE public.vlogs ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Anyone reads published blogs" ON public.vlogs;
DROP POLICY IF EXISTS "Anyone reads published vlogs" ON public.vlogs;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.vlogs;
DROP POLICY IF EXISTS "Allow all operations for client-side admin" ON public.vlogs;

-- Create clean policies for vlogs (public read and full admin write)
CREATE POLICY "Allow select for everyone" ON public.vlogs
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow all operations for client-side admin" ON public.vlogs
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Recreate trigger for updated_at with the new name
DROP TRIGGER IF EXISTS blogs_updated_at ON public.vlogs;
CREATE TRIGGER vlogs_updated_at BEFORE UPDATE ON public.vlogs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
