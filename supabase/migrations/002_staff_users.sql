-- Cambria Platform Migration: 002_staff_users.sql
-- Administrative Staff Users with Salted Passwords and Encrypted Per-Admin MFA Secrets

CREATE TABLE IF NOT EXISTS public.staff_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'registrar', 'compliance', 'auditor')),
    password_hash VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(500),
    mfa_enrolled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_users_email ON public.staff_users(email);

ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

-- Default deny for anon role
-- Authenticated staff access policy
DROP POLICY IF EXISTS "Staff manage staff users" ON public.staff_users;
CREATE POLICY "Staff manage staff users"
    ON public.staff_users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
