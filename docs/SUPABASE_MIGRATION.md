# CAMBRIA PLATFORM — CONCRETE SUPABASE PRODUCTION MIGRATION ROADMAP

**Document Version:** 1.0.0  
**Target Environment:** Supabase Cloud / Production Edge Infrastructure  
**Author:** Autonomous Systems Engineering Lead  
**Status:** Canonical Blueprint & Step-by-Step Transition Checklist  

---

## 1. ARCHITECTURAL REALITY & VERCEL INCOMPATIBILITY NOTICE

> [!CAUTION]
> **CRITICAL ARCHITECTURAL LIMITATION NOTICE**  
> The current persistence engine (`@electric-sql/pglite` v0.5.8 mounted on `./data/postgres`) was introduced as a strict forensic substitute to eradicate in-memory mock stores when Docker daemon was unavailable on the local Windows development host.  
> 
> **It is a local single-writer development environment and CANNOT run in production on Vercel or any serverless runtime.**

### Why PGlite Cannot Run on Vercel:
1. **Serverless Ephemeral Filesystem:** Vercel functions execute in isolated, stateless microVM containers where the filesystem is ephemeral and destroyed upon container spin-down. Disk writes to `./data/postgres` are lost across cold starts.
2. **Concurrency & Lock Violations:** PGlite is a single-process WebAssembly compilation of PostgreSQL. Multiple simultaneous serverless function instances attempting to acquire locks on the same filesystem directory will throw database corruption and locking errors.
3. **No Network Security Boundary:** In embedded PGlite, application code connects as the internal database owner. There is no network-isolated PostgREST API gateway enforcing an unprivileged anonymous JWT role.

---

## 2. SYSTEM BOUNDARY COMPARISON: LOCAL DEV VS. SUPABASE PRODUCTION

| Component | Local Dev (`pglite` WASM) | Real Supabase Production (`@supabase/ssr`) |
|---|---|---|
| **Database Engine** | Embedded Postgres 18.3 in Node.js process | Managed Cloud Postgres 15+ Cluster |
| **API Gateway** | Direct function calls (`src/lib/db.ts`) | PostgREST HTTP REST / GraphQL Gateway |
| **Anonymous Security (Gap 1)** | Application-level allow-list serializer (`toPublicVerificationView`) | **True Network RLS Gate:** PostgREST automatically runs queries as `SET ROLE anon;` using `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Authentication & MFA (Gap 2)** | Custom `staff_users` table with scrypt hashes & AES-256-GCM secrets | **Native Supabase Auth MFA:** `supabase.auth.mfa.enroll({ factorType: 'totp' })` + `mfa.challenge()` |
| **Document Storage (Gap 3)** | Node.js filesystem (`./data/documents/`) gated by Next.js Route Handler | **Private Supabase Storage:** Private bucket `documents` with signed, time-limited download URLs (`createSignedUrl(..., 60)`) |
| **Multi-Region Scale** | Single local machine | Global serverless edge + connection pooling (Supavisor) |

---

## 3. ORDERED STEP-BY-STEP MIGRATION CHECKLIST

When migrating to a Supabase Cloud organization or a Docker-enabled local Supabase instance, execute these exact steps in order:

### Phase 1: Supabase Project Provisioning & Environment Setup
1. Create a new Supabase project at [database.new](https://database.new) or run `supabase init` on a Docker host.
2. Copy project credentials into production environment variables (e.g. Vercel Project Settings):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-PUBLIC-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-SECRET-KEY]
   ENCRYPTION_MASTER_KEY=[32-BYTE-HEX-SECRET-KEY]
   ```

### Phase 2: Schema & RLS Policy Application
1. Apply the foundational schema migration:
   - Run `supabase/migrations/001_initial_schema.sql` via Supabase CLI or SQL Editor:
     - All 8 core tables: `programs`, `students`, `templates`, `credentials`, `credential_documents`, `document_versions`, `audit_logs`, `rate_limits`.
     - Constraints: unique tokens, valid lifecycle states, foreign keys.
     - Row Level Security (RLS) enabled on all tables with default-deny.
2. Apply staff user migration:
   - Run `supabase/migrations/002_staff_users.sql` (or transition to Supabase Auth `auth.users`).

### Phase 3: Data Migration & Seeding
1. Export current persistent data from `./data/postgres` using SQL dumps or export scripts.
2. Seed the production database using the standard curricula:
   - `EMBA-701` (Executive Leadership & Educational Governance)
   - `IBDS-501` (International Business Administration & Digital Strategy)
   - `CYBR-301` (Advanced Cybersecurity & Cloud Defense Systems)
   - `AIMS-601` (Applied Artificial Intelligence & Data Architecture)
3. Seed the document templates (`certificate` and `student_card`).

### Phase 4: Storage Bucket Configuration (Closing Gap 3 at Storage Layer)
1. In the Supabase Dashboard, navigate to **Storage** and create a **private** bucket:
   - Bucket name: `documents`
   - Public: **Disabled** (False)
   - Allowed MIME types: `application/pdf`, `image/png`
   - File size limit: 10 MB
2. Apply Storage RLS Policies:
   ```sql
   -- Allow service role and authenticated staff to upload and read documents
   CREATE POLICY "Staff upload documents" 
   ON storage.objects FOR INSERT 
   TO authenticated 
   WITH CHECK (bucket_id = 'documents');

   CREATE POLICY "Staff read documents" 
   ON storage.objects FOR SELECT 
   TO authenticated 
   USING (bucket_id = 'documents');
   ```
3. Update `src/app/api/render-document/route.ts` to upload directly to Supabase Storage:
   ```typescript
   const { data, error } = await supabaseAdmin.storage
     .from("documents")
     .upload(`${credentialNumber}/${docType}.pdf`, pdfBuffer, {
       contentType: "application/pdf",
       upsert: true,
     });
   ```
4. Update document downloads to generate **short-lived signed URLs** (e.g. 60 seconds):
   ```typescript
   const { data, error } = await supabaseAdmin.storage
     .from("documents")
     .createSignedUrl(`${credentialNumber}/${docType}.pdf`, 60);
   ```

### Phase 5: Gating Public Traffic with Real PostgREST RLS (Closing Gap 1 at Network Layer)
1. In `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`, un-comment and direct all public read requests (`/programs`, `/verify/[token]`, `/api/verify/search`) to use `createBrowserSupabaseClient()` or `createServerSupabaseClient()`.
2. Because these clients pass `NEXT_PUBLIC_SUPABASE_ANON_KEY`, PostgREST automatically dispatches every query with role `anon`:
   - `SELECT * FROM students` $\rightarrow$ Blocked at the PostgreSQL network layer by RLS policy.
   - `SELECT * FROM credentials` $\rightarrow$ Blocked at the PostgreSQL network layer by RLS policy.
   - `SELECT * FROM programs WHERE is_active = true` $\rightarrow$ Permitted via `Public read active programs`.
3. Retain the application-level allow-list serializer `toPublicVerificationView()` as **Defense-in-Depth Layer 2**.

### Phase 6: Native Supabase Auth & Native TOTP MFA (Closing Gap 2 via Auth Gateway)
1. Enable native MFA in the Supabase Dashboard under **Authentication -> Multi-Factor (MFA)**.
2. In `src/actions/auth.ts`, replace custom staff session management with native Supabase Auth methods:
   - Login:
     ```typescript
     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
     ```
   - Enrollment:
     ```typescript
     const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
     // data.totp.qr_code and data.totp.secret
     ```
   - Verification / Challenge:
     ```typescript
     const { data, error } = await supabase.auth.mfa.challengeAndVerify({
       factorId: factor.id,
       code: totpCode,
     });
     ```

### Phase 7: Deployment Configuration on Vercel
1. In `next.config.ts`, remove `@electric-sql/pglite` from `serverExternalPackages` once the local driver is replaced.
2. Remove `./data/postgres` from Git tracking (it is already in `.gitignore`).
3. Deploy to Vercel via CLI or GitHub integration:
   ```bash
   vercel --prod
   ```
4. Execute `scripts/verify-e2e.ts` pointing `TEST_APP_URL` to the production domain:
   ```bash
   TEST_APP_URL=https://cambria-college.vercel.app npx tsx scripts/verify-e2e.ts
   ```

---

## 4. VERIFICATION GATES BEFORE PRODUCTION SIGN-OFF

Before declaring production migration complete, verify:
- [ ] PostgREST anon client returns 0 rows for `students` table.
- [ ] Direct file download from Supabase Storage without signed URL returns 403 Forbidden.
- [ ] Document signed URL expires after 60 seconds.
- [ ] Attempting to generate signed URL for revoked credential is blocked by Route Handler.
- [ ] Supabase native TOTP MFA challenge rejects cross-account and invalid codes.
- [ ] All 16 E2E tests pass against production URL.
