-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    process TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access for services" ON public.services
    FOR SELECT TO public USING (true);

-- Allow all operations for client-side admin updates
CREATE POLICY "Allow all operations for services admin" ON public.services
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert initial services from lib/services.ts
INSERT INTO public.services (slug, name, short, description, process)
VALUES
  ('private-limited-registration', 'Private Limited Registration', 'Incorporate a Pvt Ltd company end-to-end.', 'From name reservation to certificate of incorporation — we manage the entire MCA process so you can focus on building.', ARRAY['Name reservation (RUN)', 'DSC & DIN', 'MoA & AoA drafting', 'SPICe+ filing', 'Incorporation certificate']),
  ('llp-registration', 'LLP Registration', 'Limited Liability Partnership setup.', 'A flexible structure with the protection of limited liability — ideal for service-led founding teams.', ARRAY['Name approval', 'DPIN allotment', 'LLP agreement drafting', 'MCA filing', 'PAN & TAN']),
  ('gst-registration', 'GST Registration', 'Get your GSTIN issued in days.', 'End-to-end GST registration with compliance review and ongoing filing support.', ARRAY['Eligibility review', 'Document collation', 'ARN generation', 'Officer follow-up', 'GSTIN issued']),
  ('trademark-registration', 'Trademark Registration', 'Protect your brand identity.', 'Comprehensive search, class advisory, and filing with the trademark registry.', ARRAY['Brand search', 'Class selection', 'TM-A filing', 'Examination response', 'Registration']),
  ('fssai-licence', 'FSSAI Licence', 'Food business compliance.', 'Basic, State, or Central — we identify the right licence and handle filing.', ARRAY['Category review', 'Form selection', 'Documentation', 'Application filing', 'Licence issued']),
  ('roc-compliance', 'ROC Compliance', 'Annual filings, board minutes, registers.', 'Stay compliant with the Companies Act — we handle annual returns, board resolutions, and statutory registers.', ARRAY['Compliance calendar', 'Board minutes', 'Annual return', 'Financial statements', 'Director KYC']),
  ('startup-india-registration', 'Startup India Registration', 'DPIIT recognition + tax benefits.', 'Unlock tax exemptions, IPR fast-tracks, and government tenders with DPIIT recognition.', ARRAY['Eligibility check', 'Pitch deck prep', 'DPIIT application', 'Recognition certificate', 'Tax exemption (80-IAC)']),
  ('accounting-taxation', 'Accounting & Taxation', 'Bookkeeping, returns, advisory.', 'Founder-friendly accounting that scales — monthly books, GST returns, and tax planning.', ARRAY['Monthly bookkeeping', 'GST returns', 'TDS filings', 'Income tax', 'Advisory calls']),
  ('legal-documentation', 'Legal Documentation', 'Contracts, NDAs, founders'' agreements.', 'Production-ready contracts drafted by lawyers — founders'' agreements, NDAs, employment, vendor contracts.', ARRAY['Requirement intake', 'Drafting', 'Review cycles', 'Final execution', 'Repository setup'])
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short = EXCLUDED.short,
  description = EXCLUDED.description,
  process = EXCLUDED.process;

-- ==========================================
-- STORAGE BUCKETS & POLICIES FOR UPLOADING IMAGES
-- ==========================================

-- 1. Ensure the "blog-images" bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create policy to allow public reads from "blog-images"
CREATE POLICY "Public Read blog-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'blog-images');

-- 3. Create policy to allow public uploads into "blog-images"
CREATE POLICY "Public Insert blog-images" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'blog-images');

-- 4. Create policy to allow public updates inside "blog-images"
CREATE POLICY "Public Update blog-images" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id = 'blog-images');

-- 5. Create policy to allow public deletions from "blog-images"
CREATE POLICY "Public Delete blog-images" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id = 'blog-images');

