-- Create estimator_services table
CREATE TABLE IF NOT EXISTS public.estimator_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.estimator_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access" ON public.estimator_services
    FOR SELECT TO public USING (true);

-- Allow all operations for client-side admin updates
CREATE POLICY "Allow all operations for client-side admin" ON public.estimator_services
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert default 4 calculator services
INSERT INTO public.estimator_services (key, name, description, price)
VALUES 
    ('pvtLtd', 'Pvt Ltd Incorporation', 'Digital Signature, DIN, MoA/AoA, PAN/TAN', 5999),
    ('gst', 'GST Registration', 'Government GSTIN registration & certificate', 1499),
    ('trademark', 'Trademark Application', 'Brand name, logo & legal class filing', 4999),
    ('audit', 'ROC & Audit Compliance', 'Annual returns calendar & dedicated auditor', 3999)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price;
