-- Add is_marquee column to news table
ALTER TABLE public.news ADD COLUMN is_marquee BOOLEAN DEFAULT FALSE NOT NULL;
