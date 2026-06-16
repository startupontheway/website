-- Create FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to faqs" 
    ON public.faqs FOR SELECT 
    USING (true);

-- Allow all operations for authenticated users (the admin)
-- You can restrict this to specific roles if needed, but standard authenticated access usually works for Supabase admin panels.
CREATE POLICY "Allow authenticated full access to faqs" 
    ON public.faqs FOR ALL 
    TO authenticated 
    USING (true);

-- Insert some default dummy FAQs
INSERT INTO public.faqs (question, answer, order_index) VALUES
('What is the process to register a Private Limited Company?', 'The process typically involves obtaining Digital Signature Certificates (DSC), Director Identification Numbers (DIN), name approval from ROC, and filing the incorporation documents (SPICe+). We handle the entire end-to-end process for you.', 1),
('How long does it take to get a GST registration?', 'Once all required documents are submitted and verified, GST registration usually takes 3 to 7 working days, depending on the government processing time.', 2),
('Are there any hidden charges in your pricing?', 'No, our pricing is completely transparent. The fees displayed cover all standard professional charges and government fees for the outlined scope. Any extra statutory fees will be communicated upfront.', 3);
