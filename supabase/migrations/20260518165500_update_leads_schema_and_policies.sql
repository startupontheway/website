-- Recreate leads table if it does not exist, or alter it
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    source TEXT DEFAULT 'contact',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Drop constraint and apply the updated status check check
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (status IN ('new', 'contacted', 'converted', 'lost', 'closed'));

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone submits leads" ON public.leads;
DROP POLICY IF EXISTS "Admins view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins delete leads" ON public.leads;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.leads;
DROP POLICY IF EXISTS "Allow all operations for client-side admin" ON public.leads;

-- Recreate simplified client-side RLS policies
CREATE POLICY "Anyone submits leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for everyone" ON public.leads
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow all operations for client-side admin" ON public.leads
    FOR ALL TO public USING (true) WITH CHECK (true);
