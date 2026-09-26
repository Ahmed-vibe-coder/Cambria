# ROUTES & SERVER ACTIONS INVENTORY — Cambria International College Platform

## 1. Public Routes

Public routes provide marketing and institutional credibility for Cambria International College, along with the digital credential verification engine. They require **no user authentication** and do not expose student portals.

| Path | Description | Access / Auth | Rate Limiting | SEO / Indexing |
|---|---|---|---|---|
| `/` | Institutional Homepage (Editorial hero, seal motifs, CTAs, academic pillars) | Public Anon | Standard CDN cache | `index, follow` |
| `/about` | Institutional narrative, academic philosophy, history & mission | Public Anon | Standard CDN cache | `index, follow` |
| `/programs` | Numbered academic program catalog (Training, Diplomas, Master's) | Public Anon | Standard CDN cache | `index, follow` |
| `/majors` | Detailed majors & disciplinary concentrations catalog | Public Anon | Standard CDN cache | `index, follow` |
| `/services` | Institutional, academic & credentialing services | Public Anon | Standard CDN cache | `index, follow` |
| `/team` | Leadership, Academic Advisory Board & Faculty directory | Public Anon | Standard CDN cache | `index, follow` |
| `/contact` | Official campus contact, registrar inquiry & location details | Public Anon | Standard CDN cache | `index, follow` |
| `/verify` | Primary credential lookup landing page (search form + QR instructions) | Public Anon | Search form rate-limited (10 req/min/IP) | `noindex, nofollow` |
| `/verify/[token]` | Direct QR destination: renders verified credential status & documents | Public Anon | Mild rate-limit (60 req/min/IP) | `noindex, nofollow` |

---

## 2. Admin Routes (`/admin/*`)

All `/admin/*` routes (except `/admin/login`) are **strictly session-gated** via Next.js Middleware and Supabase Auth. Any unauthenticated or unverified session is immediately redirected to `/admin/login`. Admin accounts require **TOTP MFA enrollment**.

| Path | Description | Access / Auth | Layout / Components |
|---|---|---|---|
| `/admin/login` | Staff authentication with email + password | Public Anon (Rate-limited: 5 attempts / 15 min) | Auth layout, card with college seal |
| `/admin/mfa/verify` | TOTP MFA Challenge prompt for logged-in staff | Authenticated (MFA Pending) | Numeric OTP code input |
| `/admin/mfa/enroll` | First-time staff TOTP MFA setup (QR + secret key) | Authenticated (No MFA yet) | MFA QR scanner + backup codes |
| `/admin` | Main Admin Dashboard: key metrics, quick stats, recent issuances | Authenticated + MFA Verified | Admin Shell, Stat Cards, Quick Actions |
| `/admin/students` | Student directory: search, filters, pagination, profile triggers | Authenticated + MFA Verified | Data Table, Filter Bar, Action Menus |
| `/admin/students/new` | Student registration modal/page | Authenticated + MFA Verified | Form with EN/AR names, masked National ID |
| `/admin/students/[id]` | Student detail view: profile data, linked credentials history | Authenticated + MFA Verified | Profile card, linked credentials list |
| `/admin/programs` | Program curriculum management: listing and status toggle | Authenticated + MFA Verified | Programs Table, Degree badge chips |
| `/admin/programs/new` | Create new academic program/course | Authenticated + MFA Verified | Form (EN/AR titles, code, credits, duration) |
| `/admin/programs/[id]` | Edit program details and curriculum units | Authenticated + MFA Verified | Edit Form, Active toggle |
| `/admin/credentials` | All issued credentials with status filters (Active, Expired, Revoked) | Authenticated + MFA Verified | Filterable Table, Lifecycle badges, Actions |
| `/admin/credentials/new` | Issue new credential: select student + program + issue/expiry dates | Authenticated + MFA Verified | Multi-step form, Document template selection |
| `/admin/credentials/[id]` | Credential detail view: status lifecycle actions, document versions | Authenticated + MFA Verified | Status manager, Document cards, Audit history |
| `/admin/documents` | Visual document repository: thumbnails, PDF downloads, filter by type | Authenticated + MFA Verified | Grid view with high-res thumbnails |
| `/admin/audit-logs` | Tamper-evident system activity and status transition trail | Authenticated + MFA Verified | Detailed audit table with actor, reason, diff |

---

## 3. API Route Handlers

Route handlers execute secure server-side logic outside React Server Components.

| Endpoint | Method | Security / Auth | Purpose & Implementation |
|---|---|---|---|
| `/api/render-document` | `POST` | Internal Server Secret / Admin Session | Headless Chromium rendering engine via Playwright + `@sparticuz/chromium`. Accepts JSON template layout + dynamic student data. Renders vector PDF + PNG thumbnail. Configured with extended `maxDuration: 60`. |
| `/api/verify/search` | `POST` | Public Anon + IP Rate Limit | Rate-limited endpoint for looking up a credential by `credential_number`. Returns uniform JSON shape on hit or miss to prevent timing attacks. |

---

## 4. Server Actions Inventory & Input Validation

All Server Actions strictly validate inputs using **Zod schemas** on the server before database execution.

### 4.1 Authentication Actions (`src/actions/auth.ts`)
- `loginAction(formData)`:
  - Zod: `z.object({ email: z.string().email(), password: z.string().min(8) })`
  - Action: Authenticates with Supabase Auth, checks MFA enrollment status, sets session cookie.
- `verifyMfaAction(formData)`:
  - Zod: `z.object({ code: z.string().length(6), factorId: z.string() })`
  - Action: Challenges TOTP factor and promotes session to AAL2.
- `logoutAction()`:
  - Action: Clears Supabase session and redirects to `/admin/login`.

### 4.2 Student Actions (`src/actions/students.ts`)
- `createStudentAction(data)`:
  - Zod: `z.object({ student_id_number: z.string().min(3), full_name_en: z.string().min(2), full_name_ar: z.string().min(2), national_id: z.string().min(5), email: z.string().email(), phone: z.string().optional(), birth_date: z.string().optional(), gender: z.string().optional(), nationality: z.string().optional() })`
  - Action: Inserts row into `students`, writes audit log.
- `updateStudentAction(id, data)`:
  - Zod: Same fields partial. Updates student record.

### 4.3 Program Actions (`src/actions/programs.ts`)
- `createProgramAction(data)`:
  - Zod: `z.object({ code: z.string().min(2), name: z.string().min(3), name_ar: z.string().min(3), degree_level: z.enum(['training_course', 'professional_diploma', 'professional_masters', 'other']), description: z.string().optional(), description_ar: z.string().optional(), duration: z.string().optional(), credits: z.coerce.number().min(0) })`
  - Action: Inserts new curriculum program.
- `updateProgramAction(id, data)`:
  - Updates program details and active status.

### 4.4 Credential & Document Actions (`src/actions/credentials.ts`)
- `createCredentialAction(data)`:
  - Zod: `z.object({ student_id: z.string().uuid(), program_id: z.string().uuid(), issue_date: z.string(), expiry_date: z.string().nullable().optional(), generate_certificate: z.boolean(), generate_student_card: z.boolean(), notes: z.string().optional() })`
  - Action: Generates sequential `credential_number` (`CAM-YYYY-XXXXXX`) and CSPRNG 128-bit `verification_token`. Creates `credentials` row in `draft` or `active` state. Attaches `credential_documents` for chosen document types. Writes audit log.
- `transitionCredentialStatusAction(data)`:
  - Zod: `z.object({ credential_id: z.string().uuid(), to_status: z.enum(['active', 'expired', 'revoked', 'suspended', 'replaced', 'cancelled']), reason: z.string().min(5, "A substantive reason is required for status changes") })`
  - Action: Enforces valid state machine transition (see Architecture §8). Updates status, timestamps, and reason. Logs transition in `audit_logs`.
- `generateDocumentAction(data)`:
  - Zod: `z.object({ credential_id: z.string().uuid(), document_type: z.enum(['certificate', 'student_card']) })`
  - Action: Calls `/api/render-document`. Uploads PDF and thumbnail to Supabase Storage. Creates immutable `document_versions` record. Updates `credential_documents.current_version_id`. Writes audit log.
