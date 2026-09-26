-- Cambria International College Platform Database Migration
-- Version: 001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROGRAMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    degree_level VARCHAR(50) NOT NULL CHECK (degree_level IN ('training_course', 'professional_diploma', 'professional_masters', 'other')),
    description TEXT,
    description_ar TEXT,
    duration VARCHAR(100),
    credits INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programs_code ON public.programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_active ON public.programs(is_active);

-- ============================================================================
-- 2. STUDENTS TABLE (Sensitive fields protected)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id_number VARCHAR(50) NOT NULL UNIQUE,
    full_name_en VARCHAR(255) NOT NULL,
    full_name_ar VARCHAR(255) NOT NULL,
    national_id VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    birth_date DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_id_number ON public.students(student_id_number);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);

-- ============================================================================
-- 3. TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    template_kind VARCHAR(50) NOT NULL CHECK (template_kind IN ('certificate', 'student_card')),
    width INTEGER NOT NULL DEFAULT 1600,
    height INTEGER NOT NULL DEFAULT 1131,
    background_image_url TEXT,
    layout_schema JSONB NOT NULL DEFAULT '{"fields": []}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_code ON public.templates(code);
CREATE INDEX IF NOT EXISTS idx_templates_kind ON public.templates(template_kind);

-- ============================================================================
-- 4. CREDENTIALS TABLE (Shared Token & Credential Number)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
    credential_number VARCHAR(50) NOT NULL UNIQUE,
    verification_token VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'revoked', 'suspended', 'replaced', 'cancelled')),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    suspended_at TIMESTAMPTZ,
    suspension_reason TEXT,
    replaced_by_credential_id UUID REFERENCES public.credentials(id) ON DELETE SET NULL,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credentials_number ON public.credentials(credential_number);
CREATE INDEX IF NOT EXISTS idx_credentials_token ON public.credentials(verification_token);
CREATE INDEX IF NOT EXISTS idx_credentials_status ON public.credentials(status);

-- ============================================================================
-- 5. CREDENTIAL_DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credential_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_id UUID NOT NULL REFERENCES public.credentials(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('certificate', 'student_card')),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE RESTRICT,
    current_version_id UUID,
    file_path TEXT,
    thumbnail_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_credential_document_type UNIQUE (credential_id, document_type)
);

CREATE INDEX IF NOT EXISTS idx_cred_docs_credential ON public.credential_documents(credential_id);

-- ============================================================================
-- 6. DOCUMENT_VERSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credential_document_id UUID NOT NULL REFERENCES public.credential_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    file_path TEXT NOT NULL,
    thumbnail_path TEXT,
    metadata_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by UUID,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_size_bytes BIGINT,
    sha256_hash VARCHAR(64),
    CONSTRAINT uq_doc_version UNIQUE (credential_document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_doc_versions_document ON public.document_versions(credential_document_id);

-- ============================================================================
-- 7. AUDIT_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    actor_id UUID,
    actor_email VARCHAR(255),
    from_state VARCHAR(50),
    to_state VARCHAR(50),
    reason TEXT,
    ip_address VARCHAR(100),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================================
-- 8. RATE_LIMITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
    ip_hash VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (ip_hash, endpoint)
);

-- ============================================================================
-- ROW LEVEL SECURITY (Default Deny)
-- ============================================================================
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Anonymous public access allowed ONLY to read active programs
CREATE POLICY "Public read active programs"
    ON public.programs FOR SELECT
    USING (is_active = true);

-- Authenticated staff access
CREATE POLICY "Admin manage programs"
    ON public.programs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage students"
    ON public.students FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage templates"
    ON public.templates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage credentials"
    ON public.credentials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage credential documents"
    ON public.credential_documents FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin manage document versions"
    ON public.document_versions FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin read audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (true);
