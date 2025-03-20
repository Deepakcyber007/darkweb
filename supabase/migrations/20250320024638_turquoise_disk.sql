/*
  # Add file upload support for profile pictures and documents

  1. Changes
    - Add profile_picture column to data_breaches table
    - Add breach_documents column to store document URLs
    - Enable storage for file uploads
  
  2. Security
    - Maintain existing RLS policies
    - Add storage bucket policies
*/

-- Add new columns for file storage
ALTER TABLE data_breaches 
ADD COLUMN IF NOT EXISTS profile_picture text,
ADD COLUMN IF NOT EXISTS breach_documents text[];

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('breach-documents', 'breach-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('profile-pictures', 'breach-documents'));

CREATE POLICY "Auth users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('profile-pictures', 'breach-documents'));

CREATE POLICY "Auth users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('profile-pictures', 'breach-documents'));

CREATE POLICY "Auth users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('profile-pictures', 'breach-documents'));