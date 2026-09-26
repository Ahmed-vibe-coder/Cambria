# DECISION LOG — Cambria International College Platform

This log documents all architectural and product decisions made during planning and execution.

---

## Decision 001: Unified Credential Token vs Per-Document Identifiers

- **Date**: 2026-09-26
- **Status**: Accepted & Implemented
- **Context**: The client requires that if a program issues both a diploma/certificate and a student identification card to the same student, both documents must display the **same** credential number and contain the **same** QR code pointing to the **same** verification URL (`/verify/<token>`).
- **Options Considered**:
  1. *Per-document tokens*: Each document has its own unique serial number and verification token.
  2. *Shared credential-level token (Client Requirement)*: A `credentials` entity holds the canonical `credential_number` and `verification_token`. Multiple `credential_documents` (e.g., `certificate` and `student_card`) link to this parent record.
- **Decision**: Adopt Option 2 (Shared Credential Model). `credentials` stores `credential_number` and `verification_token`. The `credential_documents` table models individual document types with independent versions (`document_versions`).
- **Consequences**:
  - The verification page (`/verify/[token]`) displays the unified record and lists both available documents (certificate + card) with distinct preview/download links.
  - Generating either document uses the existing parent credential token.
  - Regeneration of either document increments only its version without touching the parent credential number or QR destination.

---

## Decision 002: Document Rendering Isolation via Dedicated Route Handler

- **Date**: 2026-09-26
- **Status**: Accepted & Implemented
- **Context**: Document rendering requires headless Chromium for high-fidelity CSS layout, vector PDF export, and bidirectional Arabic OpenType font shaping. Executing Chromium directly inside a Server Action can lead to timeout issues and bloated action bundle sizes.
- **Options Considered**:
  1. *Server Action execution*: Launch browser directly in the Next.js action.
  2. *Isolated Route Handler*: A dedicated Next.js API Route Handler (`/api/render-document`) configured with extended `maxDuration: 60` and isolated memory.
- **Decision**: Adopt Option 2. An isolated Route Handler receives structured layout JSON and dynamic metadata, renders the HTML with embedded fonts, and outputs both a vector PDF buffer and a PNG thumbnail buffer.
- **Consequences**:
  - Eliminates thread blocking on the admin UI.
  - Seamlessly packages `@sparticuz/chromium` for production serverless deployments while using local browser binaries during local development.

---

## Decision 003: Postgres-Backed Rate Limiting (Zero Redis Dependency)

- **Date**: 2026-09-26
- **Status**: Accepted & Implemented
- **Context**: The credential-number search route is guessable by design and must be rate-limited (10 req/min/IP). Admin login attempts must also be rate-limited (5 attempts / 15 min). Architecture rules lock against introducing Redis or external caching infrastructure.
- **Options Considered**:
  1. *External Redis (Upstash)*: Adds external dependency and operational credentials.
  2. *Postgres-backed table with atomic UPSERT*: A dedicated `rate_limits` table with `(ip_hash, endpoint)` primary key and `window_start` timestamp.
- **Decision**: Adopt Option 2. Rate limits are tracked inside Supabase Postgres using atomic queries.
- **Consequences**:
  - Zero external infrastructure or third-party API keys required.
  - Fully transactional, persistent across serverless cold starts.

---

## Decision 004: Typography & Bidirectional Arabic Support

- **Date**: 2026-09-26
- **Status**: Accepted & Implemented
- **Context**: Certificates and student cards must support both English and Arabic text with correct font ligatures, bidirectional layout (LTR/RTL), and consistent cross-platform appearance.
- **Decision**:
  - Web UI: Google Fonts `Cormorant Garamond` (Headings) and `Inter` (Body/UI) configured via `next/font/google`. Arabic typography powered by `Cairo` and `Noto Naskh Arabic`.
  - Chromium PDF Renderer: Fonts are directly embedded into the render HTML via `@font-face` with base64 data URIs or local assets, guaranteeing identical rendering regardless of the operating system sandbox.
- **Consequences**:
  - Perfect Arabic ligature rendering without letter-detachment bugs common in Canvas or `pdf-lib` libraries.
  - High-resolution vector text in generated PDFs.

---

## Decision 005: Strict Design Discipline & Radius Ceiling

- **Date**: 2026-09-26
- **Status**: Accepted & Implemented
- **Context**: Institutional identity demands academic gravitas and restraint. Standard modern SaaS templates with large bubble corners (`rounded-2xl`, `rounded-3xl`) or neon gradients violate brand guidelines.
- **Decision**:
  - Enforce a strict **4px–8px maximum border radius** (`--radius: 6px`) across all components and shadcn overrides.
  - Restrict the Gold accent (`#C8A84E`) to ≤5% of the visual space (dividers, badges, stars).
  - Use numbered catalog lists instead of generic card grids for academic programs.
