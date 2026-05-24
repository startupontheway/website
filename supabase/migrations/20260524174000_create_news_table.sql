-- Create news table
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow select for everyone" ON public.news
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow all for admin" ON public.news
    FOR ALL TO public USING (true) WITH CHECK (true);
