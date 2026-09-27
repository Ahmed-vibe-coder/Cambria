-- Migration 004: Add Cloudinary storage tracking columns
-- Supports serverless document artifacts and template backgrounds

ALTER TABLE public.credential_documents 
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_thumb_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_thumb_url TEXT;

ALTER TABLE public.document_versions 
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_url TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_thumb_public_id TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_thumb_url TEXT;

COMMENT ON COLUMN public.credential_documents.cloudinary_public_id IS 'Cloudinary asset public_id for vector PDF document';
COMMENT ON COLUMN public.credential_documents.cloudinary_url IS 'Cloudinary HTTPS secure CDN delivery URL for PDF';
COMMENT ON COLUMN public.credential_documents.cloudinary_thumb_public_id IS 'Cloudinary asset public_id for PNG thumbnail';
COMMENT ON COLUMN public.credential_documents.cloudinary_thumb_url IS 'Cloudinary HTTPS secure CDN delivery URL for thumbnail';
