-- Create storage bucket for property photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload property photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-photos' 
  AND auth.uid() IS NOT NULL
);

-- Allow public read access to property photos
CREATE POLICY "Property photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-photos');

-- Allow users to update/delete their own photos
CREATE POLICY "Users can update their property photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their property photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add latitude and longitude columns to properties table for location
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8);

-- Add same columns to owner_leads for capturing location during registration
ALTER TABLE public.owner_leads
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::TEXT[];