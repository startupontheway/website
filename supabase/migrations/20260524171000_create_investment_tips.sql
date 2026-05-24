-- Create investment_tips table
CREATE TABLE IF NOT EXISTS public.investment_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investment_tips ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Allow select for everyone" ON public.investment_tips;
DROP POLICY IF EXISTS "Allow all operations for client-side admin" ON public.investment_tips;

-- Create policies
CREATE POLICY "Allow select for everyone" ON public.investment_tips
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow all operations for client-side admin" ON public.investment_tips
    FOR ALL TO public USING (true) WITH CHECK (true);
