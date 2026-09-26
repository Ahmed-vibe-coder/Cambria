-- Cambria Platform Migration: 003_trusted_devices.sql
-- Trusted Device Tokens for friction-free authenticated sessions

CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    is_revoked BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trusted_devices_lookup ON public.trusted_devices(user_email, token_hash);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_email ON public.trusted_devices(user_email);

ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff manage trusted devices" ON public.trusted_devices;
CREATE POLICY "Staff manage trusted devices"
    ON public.trusted_devices FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
