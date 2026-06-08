-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS to service_categories
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure the script can be run multiple times without errors
DROP POLICY IF EXISTS "Allow public read access on service_categories" ON public.service_categories;
DROP POLICY IF EXISTS "Allow full access to service_categories for authenticated users" ON public.service_categories;
DROP POLICY IF EXISTS "Allow full access to service_categories" ON public.service_categories;

CREATE POLICY "Allow full access to service_categories" 
ON public.service_categories FOR ALL 
TO public 
USING (true) WITH CHECK (true);

-- 2. Add category_id to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL;

-- 3. Insert specific categories from the screenshot
INSERT INTO public.service_categories (name, slug, order_index) VALUES
('Company Registration', 'company-registration', 1),
('Government Registration', 'government-registration', 2),
('FSSAI Registration', 'fssai-registration', 3),
('Trade License', 'trade-license', 4),
('Business Certifications', 'business-certifications', 5),
('Business License', 'business-license', 6),
('BIS Registration', 'bis-registration', 7),
('NGO', 'ngo', 8),
('International Business Setup', 'international-business-setup', 9),
('Labor Law', 'labor-law', 10),
('Other Services', 'other-services', 11),
('Income Tax', 'income-tax', 12),
('Good & Service Tax', 'good-service-tax', 13)
ON CONFLICT (slug) DO NOTHING;

-- 4. Helper function or raw inserts for subservices
DO $$
DECLARE
    v_company_id UUID;
    v_govt_id UUID;
    v_cert_id UUID;
    v_lic_id UUID;
    v_ngo_id UUID;
    v_other_id UUID;
    v_income_tax_id UUID;
    v_gst_id UUID;
BEGIN
    SELECT id INTO v_company_id FROM public.service_categories WHERE slug = 'company-registration';
    SELECT id INTO v_govt_id FROM public.service_categories WHERE slug = 'government-registration';
    SELECT id INTO v_cert_id FROM public.service_categories WHERE slug = 'business-certifications';
    SELECT id INTO v_lic_id FROM public.service_categories WHERE slug = 'business-license';
    SELECT id INTO v_ngo_id FROM public.service_categories WHERE slug = 'ngo';
    SELECT id INTO v_other_id FROM public.service_categories WHERE slug = 'other-services';
    SELECT id INTO v_income_tax_id FROM public.service_categories WHERE slug = 'income-tax';
    SELECT id INTO v_gst_id FROM public.service_categories WHERE slug = 'good-service-tax';

    -- Insert Company Registration Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('Company Registration', 'company-registration-service', 'Expert assistance for Company Registration', 'Comprehensive services for Company Registration.', v_company_id, ARRAY[]::text[]),
    ('Public Limited Company Registration', 'public-limited-company', 'Expert assistance for Public Limited Company Registration', 'Comprehensive services for Public Limited Company Registration.', v_company_id, ARRAY[]::text[]),
    ('Trust Registration', 'trust-registration', 'Expert assistance for Trust Registration', 'Comprehensive services for Trust Registration.', v_company_id, ARRAY[]::text[]),
    ('Society Registration', 'society-registration', 'Expert assistance for Society Registration', 'Comprehensive services for Society Registration.', v_company_id, ARRAY[]::text[]),
    ('Virtual Office', 'virtual-office', 'Expert assistance for Virtual Office', 'Comprehensive services for Virtual Office.', v_company_id, ARRAY[]::text[]),
    ('Producer Company Registration', 'producer-company', 'Expert assistance for Producer Company Registration', 'Comprehensive services for Producer Company Registration.', v_company_id, ARRAY[]::text[]),
    ('IEC Registration/import export code registration', 'iec-registration', 'Expert assistance for IEC Registration', 'Comprehensive services for IEC Registration.', v_company_id, ARRAY[]::text[]),
    ('Private Limited Company Registration', 'private-limited-company', 'Expert assistance for Private Limited Company Registration', 'Comprehensive services for Private Limited Company Registration.', v_company_id, ARRAY[]::text[]),
    ('Partnership Firm Registration', 'partnership-firm', 'Expert assistance for Partnership Firm Registration', 'Comprehensive services for Partnership Firm Registration.', v_company_id, ARRAY[]::text[]),
    ('Sole Proprietorship Registration', 'sole-proprietorship', 'Expert assistance for Sole Proprietorship Registration', 'Comprehensive services for Sole Proprietorship Registration.', v_company_id, ARRAY[]::text[]),
    ('Startup India Registration', 'startup-india', 'Expert assistance for Startup India Registration', 'Comprehensive services for Startup India Registration.', v_company_id, ARRAY[]::text[]),
    ('Nidhi Company Registration', 'nidhi-company', 'Expert assistance for Nidhi Company Registration', 'Comprehensive services for Nidhi Company Registration.', v_company_id, ARRAY[]::text[]),
    ('Wordmark Registration', 'wordmark-registration', 'Expert assistance for Wordmark Registration', 'Comprehensive services for Wordmark Registration.', v_company_id, ARRAY[]::text[]),
    ('Digital Signature Certificate', 'dsc', 'Expert assistance for Digital Signature Certificate', 'Comprehensive services for Digital Signature Certificate.', v_company_id, ARRAY[]::text[]),
    ('LLP registration', 'llp-registration', 'Expert assistance for LLP registration', 'Comprehensive services for LLP registration.', v_company_id, ARRAY[]::text[]),
    ('NGO Registration', 'ngo-registration', 'Expert assistance for NGO Registration', 'Comprehensive services for NGO Registration.', v_company_id, ARRAY[]::text[]),
    ('One Person Company Registration', 'opc-registration', 'Expert assistance for One Person Company Registration', 'Comprehensive services for One Person Company Registration.', v_company_id, ARRAY[]::text[]),
    ('Startup Registration', 'startup-registration', 'Expert assistance for Startup Registration', 'Comprehensive services for Startup Registration.', v_company_id, ARRAY[]::text[]),
    ('Microfinance Company Registration', 'microfinance-company', 'Expert assistance for Microfinance Company Registration', 'Comprehensive services for Microfinance Company Registration.', v_company_id, ARRAY[]::text[]),
    ('PSARA License', 'psara-license', 'Expert assistance for PSARA License', 'Comprehensive services for PSARA License.', v_company_id, ARRAY[]::text[]),
    ('Class 3 Digital Signature Certificate', 'class-3-dsc', 'Expert assistance for Class 3 DSC', 'Comprehensive services for Class 3 Digital Signature Certificate.', v_company_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Government Registration Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('Drug License', 'drug-license', 'Expert assistance for Drug License', 'Comprehensive services for Drug License.', v_govt_id, ARRAY[]::text[]),
    ('Ayush License', 'ayush-license', 'Expert assistance for Ayush License', 'Comprehensive services for Ayush License.', v_govt_id, ARRAY[]::text[]),
    ('ISI Mark Certification', 'isi-mark', 'Expert assistance for ISI Mark Certification', 'Comprehensive services for ISI Mark Certification.', v_govt_id, ARRAY[]::text[]),
    ('RCMC Registration', 'rcmc-registration', 'Expert assistance for RCMC Registration', 'Comprehensive services for RCMC Registration.', v_govt_id, ARRAY[]::text[]),
    ('Petrol Pump License', 'petrol-pump-license', 'Expert assistance for Petrol Pump License', 'Comprehensive services for Petrol Pump License.', v_govt_id, ARRAY[]::text[]),
    ('SPICe+ Form', 'spice-plus-form', 'Expert assistance for SPICe+ Form', 'Comprehensive services for SPICe+ Form.', v_govt_id, ARRAY[]::text[]),
    ('ISO 50001 Certification', 'iso-50001', 'Expert assistance for ISO 50001', 'Comprehensive services for ISO 50001 Certification.', v_govt_id, ARRAY[]::text[]),
    ('ISO 27001 Certification', 'iso-27001', 'Expert assistance for ISO 27001', 'Comprehensive services for ISO 27001 Certification.', v_govt_id, ARRAY[]::text[]),
    ('Geographical Indication', 'geographical-indication', 'Expert assistance for Geographical Indication', 'Comprehensive services for Geographical Indication.', v_govt_id, ARRAY[]::text[]),
    ('Liquor License', 'liquor-license', 'Expert assistance for Liquor License', 'Comprehensive services for Liquor License.', v_govt_id, ARRAY[]::text[]),
    ('FIEO Registration', 'fieo-registration', 'Expert assistance for FIEO Registration', 'Comprehensive services for FIEO Registration.', v_govt_id, ARRAY[]::text[]),
    ('Professional Tax Registration', 'professional-tax', 'Expert assistance for Professional Tax', 'Comprehensive services for Professional Tax Registration.', v_govt_id, ARRAY[]::text[]),
    ('Factory License', 'factory-license', 'Expert assistance for Factory License', 'Comprehensive services for Factory License.', v_govt_id, ARRAY[]::text[]),
    ('Network License', 'network-license', 'Expert assistance for Network License', 'Comprehensive services for Network License.', v_govt_id, ARRAY[]::text[]),
    ('ISSN Number', 'issn-number', 'Expert assistance for ISSN Number', 'Comprehensive services for ISSN Number.', v_govt_id, ARRAY[]::text[]),
    ('ISO 31000 Certification', 'iso-31000', 'Expert assistance for ISO 31000', 'Comprehensive services for ISO 31000 Certification.', v_govt_id, ARRAY[]::text[]),
    ('ISO 14001 Certification', 'iso-14001', 'Expert assistance for ISO 14001', 'Comprehensive services for ISO 14001 Certification.', v_govt_id, ARRAY[]::text[]),
    ('GMP Certification', 'gmp-certification', 'Expert assistance for GMP Certification', 'Comprehensive services for GMP Certification.', v_govt_id, ARRAY[]::text[]),
    ('ISO Registration', 'iso-registration', 'Expert assistance for ISO Registration', 'Comprehensive services for ISO Registration.', v_govt_id, ARRAY[]::text[]),
    ('Medical Device Registration', 'medical-device-registration', 'Expert assistance for Medical Device', 'Comprehensive services for Medical Device Registration.', v_govt_id, ARRAY[]::text[]),
    ('PTEC Registration', 'ptec-registration', 'Expert assistance for PTEC Registration', 'Comprehensive services for PTEC Registration.', v_govt_id, ARRAY[]::text[]),
    ('ICEGATE Registration', 'icegate-registration', 'Expert assistance for ICEGATE', 'Comprehensive services for ICEGATE Registration.', v_govt_id, ARRAY[]::text[]),
    ('TEC Certification', 'tec-certification', 'Expert assistance for TEC Certification', 'Comprehensive services for TEC Certification.', v_govt_id, ARRAY[]::text[]),
    ('ISO 22000 FSMS Certification', 'iso-22000', 'Expert assistance for ISO 22000', 'Comprehensive services for ISO 22000 FSMS Certification.', v_govt_id, ARRAY[]::text[]),
    ('ISO 9001 Certification', 'iso-9001', 'Expert assistance for ISO 9001', 'Comprehensive services for ISO 9001 Certification.', v_govt_id, ARRAY[]::text[]),
    ('DUNS Number', 'duns-number', 'Expert assistance for DUNS Number', 'Comprehensive services for DUNS Number.', v_govt_id, ARRAY[]::text[]),
    ('ISBN Number Registration', 'isbn-number', 'Expert assistance for ISBN Number', 'Comprehensive services for ISBN Number Registration.', v_govt_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Business Certifications Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('RERA Registration', 'rera-registration', 'Expert assistance for RERA Registration', 'Comprehensive services for RERA Registration.', v_cert_id, ARRAY[]::text[]),
    ('Hallmark registration', 'hallmark-registration', 'Expert assistance for Hallmark registration', 'Comprehensive services for Hallmark registration.', v_cert_id, ARRAY[]::text[]),
    ('FPO Mark Certification', 'fpo-mark', 'Expert assistance for FPO Mark Certification', 'Comprehensive services for FPO Mark Certification.', v_cert_id, ARRAY[]::text[]),
    ('Make In India Certificate', 'make-in-india', 'Expert assistance for Make In India Certificate', 'Comprehensive services for Make In India Certificate.', v_cert_id, ARRAY[]::text[]),
    ('NGO Project Report', 'ngo-project-report', 'Expert assistance for NGO Project Report', 'Comprehensive services for NGO Project Report.', v_cert_id, ARRAY[]::text[]),
    ('TEXPROCIL Registration', 'texprocil-registration', 'Expert assistance for TEXPROCIL Registration', 'Comprehensive services for TEXPROCIL Registration.', v_cert_id, ARRAY[]::text[]),
    ('NSIC Registration', 'nsic-registration', 'Expert assistance for NSIC Registration', 'Comprehensive services for NSIC Registration.', v_cert_id, ARRAY[]::text[]),
    ('Rubber Board Registration', 'rubber-board-registration', 'Expert assistance for Rubber Board Registration', 'Comprehensive services for Rubber Board Registration.', v_cert_id, ARRAY[]::text[]),
    ('Spice Board Registration', 'spice-board-registration', 'Expert assistance for Spice Board Registration', 'Comprehensive services for Spice Board Registration.', v_cert_id, ARRAY[]::text[]),
    ('ZED Certification', 'zed-certification', 'Expert assistance for ZED Certification', 'Comprehensive services for ZED Certification.', v_cert_id, ARRAY[]::text[]),
    ('CMMI Certification', 'cmmi-certification', 'Expert assistance for CMMI Certification', 'Comprehensive services for CMMI Certification.', v_cert_id, ARRAY[]::text[]),
    ('Certificate of Good Standing', 'certificate-of-good-standing', 'Expert assistance for Certificate of Good Standing', 'Comprehensive services for Certificate of Good Standing.', v_cert_id, ARRAY[]::text[]),
    ('PESO Certificate', 'peso-certificate', 'Expert assistance for PESO Certificate', 'Comprehensive services for PESO Certificate.', v_cert_id, ARRAY[]::text[]),
    ('IJCEPA Certificate', 'ijcepa-certificate', 'Expert assistance for IJCEPA Certificate', 'Comprehensive services for IJCEPA Certificate.', v_cert_id, ARRAY[]::text[]),
    ('BEE Registration', 'bee-registration', 'Expert assistance for BEE Registration', 'Comprehensive services for BEE Registration.', v_cert_id, ARRAY[]::text[]),
    ('NSDC Registration', 'nsdc-registration', 'Expert assistance for NSDC Registration', 'Comprehensive services for NSDC Registration.', v_cert_id, ARRAY[]::text[]),
    ('APEDA Registration', 'apeda-registration', 'Expert assistance for APEDA Registration', 'Comprehensive services for APEDA Registration.', v_cert_id, ARRAY[]::text[]),
    ('CE Certification', 'ce-certification', 'Expert assistance for CE Certification', 'Comprehensive services for CE Certification.', v_cert_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Business License Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('RNI Registration', 'rni-registration', 'Expert assistance for RNI Registration', 'Comprehensive services for RNI Registration.', v_lic_id, ARRAY[]::text[]),
    ('GSP Registration', 'gsp-registration', 'Expert assistance for GSP Registration', 'Comprehensive services for GSP Registration.', v_lic_id, ARRAY[]::text[]),
    ('MSTC License Registration', 'mstc-license', 'Expert assistance for MSTC License', 'Comprehensive services for MSTC License Registration.', v_lic_id, ARRAY[]::text[]),
    ('CDSCO Registration', 'cdsco-registration', 'Expert assistance for CDSCO Registration', 'Comprehensive services for CDSCO Registration.', v_lic_id, ARRAY[]::text[]),
    ('SAFTA License', 'safta-license', 'Expert assistance for SAFTA License', 'Comprehensive services for SAFTA License.', v_lic_id, ARRAY[]::text[]),
    ('AGMARK License', 'agmark-license', 'Expert assistance for AGMARK License', 'Comprehensive services for AGMARK License.', v_lic_id, ARRAY[]::text[]),
    ('AD Code Registration', 'ad-code-registration', 'Expert assistance for AD Code Registration', 'Comprehensive services for AD Code Registration.', v_lic_id, ARRAY[]::text[]),
    ('WPC Certificate', 'wpc-certificate', 'Expert assistance for WPC Certificate', 'Comprehensive services for WPC Certificate.', v_lic_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert NGO Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('Section 8 Company Registration', 'section-8-company', 'Expert assistance for Section 8 Company', 'Comprehensive services for Section 8 Company Registration.', v_ngo_id, ARRAY[]::text[]),
    ('Section 8 Microfinance Company Registration', 'section-8-microfinance', 'Expert assistance for Section 8 Microfinance', 'Comprehensive services for Section 8 Microfinance Company Registration.', v_ngo_id, ARRAY[]::text[]),
    ('Darpan Registration', 'darpan-registration', 'Expert assistance for Darpan Registration', 'Comprehensive services for Darpan Registration.', v_ngo_id, ARRAY[]::text[]),
    ('12A and 80G Registration', '12a-80g-registration', 'Expert assistance for 12A and 80G', 'Comprehensive services for 12A and 80G Registration.', v_ngo_id, ARRAY[]::text[]),
    ('FCRA Registration', 'fcra-registration', 'Expert assistance for FCRA Registration', 'Comprehensive services for FCRA Registration.', v_ngo_id, ARRAY[]::text[]),
    ('NGO Accounting', 'ngo-accounting', 'Expert assistance for NGO Accounting', 'Comprehensive services for NGO Accounting.', v_ngo_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Other Services Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('Virtual CFO Services', 'virtual-cfo', 'Expert assistance for Virtual CFO', 'Comprehensive services for Virtual CFO.', v_other_id, ARRAY[]::text[]),
    ('Tea Board Registration', 'tea-board-registration', 'Expert assistance for Tea Board', 'Comprehensive services for Tea Board Registration.', v_other_id, ARRAY[]::text[]),
    ('Insurance Repository Registration Services', 'insurance-repository-registration', 'Expert assistance for Insurance Repository', 'Comprehensive services for Insurance Repository Registration.', v_other_id, ARRAY[]::text[]),
    ('SEPC License', 'sepc-license', 'Expert assistance for SEPC License', 'Comprehensive services for SEPC License.', v_other_id, ARRAY[]::text[]),
    ('GJEPC Registration', 'gjepc-registration', 'Expert assistance for GJEPC Registration', 'Comprehensive services for GJEPC Registration.', v_other_id, ARRAY[]::text[]),
    ('ISP Registration', 'isp-registration', 'Expert assistance for ISP Registration', 'Comprehensive services for ISP Registration.', v_other_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Income Tax Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('Income Tax Return Filing', 'itr-filing', 'Expert assistance for ITR Filing', 'Comprehensive services for Income Tax Return Filing.', v_income_tax_id, ARRAY[]::text[]),
    ('Tds Return Filing', 'tds-return', 'Expert assistance for TDS Return', 'Comprehensive services for TDS Return Filing.', v_income_tax_id, ARRAY[]::text[]),
    ('PF Return', 'pf-return', 'Expert assistance for PF Return', 'Comprehensive services for PF Return.', v_income_tax_id, ARRAY[]::text[]),
    ('ITR 2 Form Filing', 'itr-2-form', 'Expert assistance for ITR 2', 'Comprehensive services for ITR 2 Form Filing.', v_income_tax_id, ARRAY[]::text[]),
    ('ITR 7 Form Filing', 'itr-7-form', 'Expert assistance for ITR 7', 'Comprehensive services for ITR 7 Form Filing.', v_income_tax_id, ARRAY[]::text[]),
    ('ITR 1 Form Filing', 'itr-1-form', 'Expert assistance for ITR 1', 'Comprehensive services for ITR 1 Form Filing.', v_income_tax_id, ARRAY[]::text[]),
    ('80-IAC Tax Exemption for Startups', '80-iac-tax-exemption', 'Expert assistance for 80-IAC', 'Comprehensive services for 80-IAC Tax Exemption for Startups.', v_income_tax_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

    -- Insert Good & Service Tax Subservices
    INSERT INTO public.services (name, slug, short, description, category_id, process) VALUES
    ('GST Registration', 'gst-registration', 'Expert assistance for GST Registration', 'Comprehensive services for GST Registration.', v_gst_id, ARRAY[]::text[]),
    ('GST Return Filing', 'gst-return-filing', 'Expert assistance for GST Return Filing', 'Comprehensive services for GST Return Filing.', v_gst_id, ARRAY[]::text[]),
    ('GSTR9 Return', 'gstr9-return', 'Expert assistance for GSTR9 Return', 'Comprehensive services for GSTR9 Return.', v_gst_id, ARRAY[]::text[]),
    ('Cancel GST Registration', 'cancel-gst-registration', 'Expert assistance to Cancel GST', 'Comprehensive services for Cancel GST Registration.', v_gst_id, ARRAY[]::text[]),
    ('Virtual Place of Business in GST', 'virtual-place-business-gst', 'Expert assistance for Virtual Place of Business in GST', 'Comprehensive services for Virtual Place of Business in GST.', v_gst_id, ARRAY[]::text[]),
    ('Additional Place of Business in GST', 'additional-place-business-gst', 'Expert assistance for Additional Place of Business in GST', 'Comprehensive services for Additional Place of Business in GST.', v_gst_id, ARRAY[]::text[]),
    ('GST Registration for E-commerce', 'gst-registration-ecommerce', 'Expert assistance for GST Registration for E-commerce', 'Comprehensive services for GST Registration for E-commerce.', v_gst_id, ARRAY[]::text[]),
    ('GST Return Filing for E-commerce', 'gst-return-ecommerce', 'Expert assistance for GST Return for E-commerce', 'Comprehensive services for GST Return Filing for E-commerce.', v_gst_id, ARRAY[]::text[]),
    ('Input Tax Credit', 'input-tax-credit', 'Expert assistance for Input Tax Credit', 'Comprehensive services for Input Tax Credit.', v_gst_id, ARRAY[]::text[]),
    ('GST E-Invoice', 'gst-e-invoice', 'Expert assistance for GST E-Invoice', 'Comprehensive services for GST E-Invoice.', v_gst_id, ARRAY[]::text[]),
    ('E-Way Bill Registration', 'e-way-bill', 'Expert assistance for E-Way Bill', 'Comprehensive services for E-Way Bill Registration.', v_gst_id, ARRAY[]::text[])
    ON CONFLICT (slug) DO UPDATE SET category_id = EXCLUDED.category_id;

END $$;
