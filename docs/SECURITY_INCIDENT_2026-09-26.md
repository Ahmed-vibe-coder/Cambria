# Security Incident Report: Administrative Credential Exposure & Login Hardening

**Incident ID:** INC-2026-09-26-AUTH  
**Severity:** CRITICAL (P0)  
**Date Resolved:** September 26, 2026  
**Status:** RESOLVED & VERIFIED  
**System:** Cambria College Academic & Institutional Portal  

---

## 1. Executive Summary

During deployment inspection of the Cambria institutional portal (`cambria-five.vercel.app`), an exposed credential block was identified on the public administrative authentication page (`/admin/login`). The page rendered pre-populated login inputs with local administrative credentials (`admin@cambria.edu` / `AdminPass123!`) alongside a visible card titled `"Local Staff Credentials"`. Furthermore, public navigation elements (top academic announcement bar, mobile drawer, and footer) broadcasted direct links to administrative and staff login routes.

Immediate containment, remediation, credential rotation, and architectural hardening were executed across the entire codebase. All hardcoded credentials and UI signposts have been eradicated, compromised passwords rotated to cryptographically secure values, authentication flows hardened against enumeration and brute force, and pre-authentication views strictly partitioned from administrative layout chrome.

---

## 2. Root Cause Analysis

1. **Development Helper Artifacts Left in View Component:**  
   `src/app/admin/login/page.tsx` contained static placeholder text and a demonstration helper card (`Local Staff Credentials`) intended for local development convenience. The component lacked strict build-time pruning and was inadvertently rendered in production environments.
2. **Pre-filled Input Attributes:**  
   The email and password form inputs contained hardcoded `defaultValue` attributes (`admin@cambria.edu` and `AdminPass123!`), resulting in visible pre-filled fields.
3. **Shared Layout Chrome on Pre-Auth Routes:**  
   `src/app/admin/layout.tsx` indiscriminately wrapped all routes under `/admin/*`, causing internal administrative layout headers (displaying internal status strings such as `"RLS Default-Deny Active"` and `"Test Public Verification"`) to render on unauthenticated pages like `/admin/login` and `/admin/mfa`.
4. **Public Link Exposure:**  
   The primary marketing navbar (`src/components/layout/navbar.tsx`) and global footer (`src/components/layout/footer.tsx`) featured prominent "Staff Portal Access" and "Staff Login (MFA)" links.

---

## 3. Immediate Remediation Actions Taken

### 3.1 Total Deletion of Leaked Credentials & UI Helpers
- Completely removed the `Local Staff Credentials` card, demo alerts, and default credentials from `src/app/admin/login/page.tsx`.
- Removed `defaultValue="admin@cambria.edu"` and `defaultValue="AdminPass123!"` from the login form. Form fields now initialize completely blank.
- Sanitized `src/app/admin/mfa/page.tsx` by deleting live TOTP token readouts (`currentToken`) and raw secret displays. Replaced with institutional authenticator app guidance.
- Updated all local seeding and migration scripts (`scripts/migrate-staff.ts`, `scripts/verify-e2e.ts`, `scripts/test-login-action.ts`, `scripts/test-per-admin-mfa.ts`) to purge `AdminPass123!`.

### 3.2 Administrative Credential Rotation
- **Compromised Account:** `admin@cambria.edu`
- **Revocation:** The compromised password `AdminPass123!` was immediately invalidated and replaced in both PostgreSQL database records and local development stores.
- **New Password:** Rotated to a 32+ character cryptographically random high-entropy passphrase:
  - **Stored Hash Algorithm:** `scrypt` with unique 16-byte cryptographically secure random salt (`N=16384, r=8, p=1, keylen=64`).
  - **New Hash:** `scrypt:5f7cbbeac1846169389fcda6d47f5ffc:6031722dc99b0b75239dd3e567b4dace1c620767517facd63734f2541454a5aa797d0ea42c2e70bac66bd0aa266cca4302bac9f2504aa40f2a5ab74d628b978f`
- **Rejection Verification:** Tested programmatically via `scripts/test-login-action.ts`:
  - Attempting login with revoked password returns: `Invalid staff credentials or unapproved account.` (HTTP 401 equivalent).
  - Attempting login with rotated password succeeds and immediately routes to Step-2 MFA challenge.

### 3.3 Removal of Public Administrative Signposts
- **Top Announcement Bar:** Removed the top sub-bar in `src/components/layout/navbar.tsx` that previously linked to `/admin/login`.
- **Mobile Drawer:** Removed the "Staff Login" button from the mobile navigation drawer. Shortened "Faculty & Team" to "Team" with `whitespace-nowrap` to prevent line wrapping on responsive viewports.
- **Footer:** Removed the "Staff Login (MFA)" link from `src/components/layout/footer.tsx`.
- **Search Engine Exclusion:** Verified that `src/app/robots.ts` explicitly disallows search crawlers:
  ```ts
  disallow: ["/admin/", "/api/"];
  ```
  And `src/middleware.ts` injects `X-Robots-Tag: noindex, nofollow` on all `/admin/*` requests.

### 3.4 Pre-Authentication View Sanitization
- Refactored `src/app/admin/layout.tsx` to inspect authentication session cookies (`cambria_staff_mfa_verified`).
- Unauthenticated requests (accessing `/admin/login` or `/admin/mfa`) now bypass dashboard chrome completely and render bare, clean views without sidebars, institutional banners, or internal status badges.
- Within authenticated dashboards, replaced debug strings (`"RLS Default-Deny Active"`) with clean institutional badges (`"Institutional Administration"`).

---

## 4. Security Hardening & Defenses

### 4.1 Sliding-Window IP Rate Limiting
- Integrated `checkRateLimit` within `loginAction` (`src/actions/auth.ts`) and API routes (`src/app/api/auth/login/route.ts`).
- Rate limit policy: Maximum 5 failed attempts per client IP within a 5-minute sliding window (300 seconds).
- Exceeding the threshold triggers an immediate lockout response (`Too many login attempts. Access is temporarily locked.`) and logs a `login_throttled` event in the audit trail.

### 4.2 Timing Attack Defense & User Enumeration Resistance
- In `src/actions/auth.ts` and `src/app/api/auth/login/route.ts`, if an unrecognized email address is queried, a constant-time dummy scrypt verification is executed against a dummy hash:
  ```ts
  await verifyPassword("dummy-pass-for-timing", DUMMY_SCRYPT_HASH);
  ```
- Uniform error messaging (`"Invalid staff credentials or unapproved account."`) is returned across all failure scenarios (unknown user, wrong password, inactive account) to eliminate account enumeration vectors.

### 4.3 Two-Factor Authentication (TOTP) Hardening
- Individual staff accounts have unique TOTP secrets encrypted at rest using AES-256-GCM.
- Step-1 password validation grants a temporary, HttpOnly, SameSite=Lax challenge cookie (`cambria_mfa_pending`) with a 5-minute TTL.
- Full administrative session cookies (`cambria_staff_session`, `cambria_staff_mfa_verified`) are only granted after valid 6-digit TOTP code verification.

### 4.4 Comprehensive Security Audit Logging
- Every authentication attempt, failure, lockout, and TOTP verification is recorded via `addAuditLog` in PostgreSQL / Supabase:
  - `action`: `password_authenticated`, `login_failed`, `login_throttled`, `mfa_failed`, `login_success`.
  - Captures `actor_email`, `ip_address`, `user_agent`, `timestamp`, and `reason`.

---

## 5. Verification Evidence & Test Results

### 5.1 Repository-Wide Grep for Leaked Credentials
Executed zero-tolerance search across the entire project codebase:
```powershell
git grep -i "AdminPass123"
```
**Result:** 0 matches found in application source code, API routes, configurations, or seed scripts.

```powershell
git grep -i "Local Staff Credentials"
```
**Result:** 0 matches found across all frontend views and layouts.

### 5.2 Server Action & Authentication Test Log
Executed via `npx tsx scripts/test-login-action.ts`:
```text
Old password rejection test: {
  success: false,
  error: 'Invalid staff credentials or unapproved account.'
}
Redirected to MFA as expected: NEXT_REDIRECT;replace;/admin/mfa;307;
```

### 5.3 Per-Account MFA Secret Isolation Test
Executed via `scripts/test-per-admin-mfa.ts`:
```text
✅ PASS: Both accounts store MFA secrets strictly encrypted at rest (AES-256-GCM).
✅ PASS: Admin A and Admin B have completely independent, unique secrets.
```

---

## 6. Recommendations & Preventive Controls

1. **Pre-commit / CI Credential Scanning:** Integrate `trufflehog` or `gitleaks` into the CI/CD pipeline to reject commits containing credential patterns or mock helper cards.
2. **Environment Variable Segregation:** Ensure all production credentials and Supabase service role keys reside strictly in secure vault environments (e.g. Vercel Project Settings) without `NEXT_PUBLIC_` prefixes.
3. **Periodic Secret Rotation:** Mandate 90-day administrative password and TOTP secret re-enrollment across all administrative staff.
