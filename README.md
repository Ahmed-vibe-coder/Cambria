# Cambria International College Platform

A production-grade web platform and digital credentialing/verification system for **Cambria International College**, an educational institution providing executive qualifications, professional diplomas, and verifiable credentials.

---

## 🏛️ Architectural Overview

The system features two unified, production experiences built on a single **Next.js 15 App Router** architecture:
1. **Public Academic Portal**: Marketing, institutional governance, program catalog, and the public credential verification engine (`/verify` and `/verify/[token]`).
2. **Private Administrative Dashboard (`/admin/*`)**: Strictly gated staff registry interface for managing students, curricula, credential conferral, and document lifecycles.

### Key Architectural Mandates
- **Single Next.js 15 Application**: Monolithic full-stack architecture using Server Components, Server Actions, and Route Handlers. Zero microservices, Express backends, or Redis instances.
- **Unified Credential Token Model (§4)**: Every issued credential possesses a single sequential credential number (`CAM-YYYY-XXXXXX`) and a single cryptographic verification token (`tok_...`). If both a parchment certificate and a plastic student identification card are generated, **both documents share the exact same QR destination and serial number**.
- **Headless Chromium Document Renderer (§6)**: Playwright / Chromium running in an isolated Route Handler (`/api/render-document`) composites JSON layout schemas and dynamic text into vector PDFs and PNG thumbnails, with full native OpenType shaping for Arabic (Cairo) and English (Cormorant Garamond).
- **Session-Gated Defense-in-Depth (§9)**: `/admin/*` routes are protected by Next.js middleware, authenticated cookies, and database Row Level Security (RLS) configured to `DEFAULT DENY`.
- **Database-Backed Rate Limiting**: The sequential credential search endpoint is rate-limited (10 req/min/IP) using PostgreSQL atomic upserts to prevent brute-force enumeration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack, React 19) |
| **Language** | TypeScript 5 (Strict Mode enabled) |
| **Styling** | Tailwind CSS + Custom Tokens (4–8px radius, border-first shadows) |
| **Icons** | Lucide React |
| **Database & Auth** | Supabase (PostgreSQL with RLS, Auth with TOTP MFA, Storage) |
| **PDF Rendering** | Playwright Chromium + `@sparticuz/chromium` |
| **Validation** | Zod (on every Server Action and API payload) |
| **QR Code Engine** | `qrcode` (Level M error correction) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v20+` or `v22+` (v22.14.0 recommended)
- npm `v10+`

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

Ensure Playwright's headless browser binary is installed:
```bash
npx playwright install chromium
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default local development configuration is already set in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
INTERNAL_RENDER_SECRET=cambria-render-secret-key-32-chars-minimum
```

### 4. Running Database Migrations & Seeding
- SQL migrations are located at: `supabase/migrations/001_initial_schema.sql`
- Run the seed script:
```bash
npm run seed
```
*Note: In local standalone mode (when external Supabase is not connected), the system seamlessly runs against rich in-memory seed data featuring 5 scholars, 4 programs, 5 credentials across all lifecycle states, and active certificates.*

### 5. Start Development Server
```bash
npm run dev
```
Visit:
- Public Academic Portal: `http://localhost:3000`
- Credential Verification: `http://localhost:3000/verify`
- Sample QR Verification: `http://localhost:3000/verify/tok_v8K29LpQx92M1a8B4z`
- Staff Admin Dashboard: `http://localhost:3000/admin`
  - Demo Staff Email: `admin@cambria.edu`
  - Demo Staff Password: `AdminPass123!`

---

## 🎨 Brand Identity & Design Tokens

Derived exclusively from the circular **Cambria Institutional Seal**:
- **Primary Navy**: `#020B5A` (Headers, brand authority)
- **Deep Navy**: `#07133F` (Dark hero sections, footer)
- **Academic Blue**: `#243A8F` (Interactive accents, focus states)
- **Soft Blue**: `#EAF0FF` (Light badge and card fills)
- **Off-White**: `#F8F9FC` (Page background)
- **Gold Accent**: `#C8A84E` (Borders, seals, stars; ≤5% surface area)
- **Border Radius**: 4px–8px strictly enforced project-wide (no `rounded-2xl` or large bubbles).
- **Typography**: Cormorant Garamond (Headings), Inter (Body & UI), Cairo (Arabic RTL).

---

## 📁 Repository Structure & Documentation

```
.
├── docs/                      # Planning & Architecture Specifications
│   ├── ARCHITECTURE.md        # System boundaries & request/data flow diagrams
│   ├── DATA_MODEL.md          # Full relational ERD, DDL, and RLS policies
│   ├── ROUTES.md              # Public and admin route inventory & Server Actions
│   ├── DESIGN_SYSTEM.md       # Color tokens, typography, and shadcn overrides
│   ├── CONTENT_NEEDED.md      # Unprovided client content audit & placeholder log
│   ├── DECISIONS.md           # Architecture decision records (ADRs)
│   ├── PROJECT_PLAN.md        # Milestone breakdown & acceptance criteria
│   └── PROGRESS.md            # Live implementation checklist
├── public/
│   └── documents/             # Rendered vector PDFs & PNG preview thumbnails
├── src/
│   ├── actions/               # Zod-validated Server Actions (auth, students, credentials)
│   ├── app/                   # Next.js 15 App Router pages & route handlers
│   │   ├── admin/             # Session-gated administrative staff experience
│   │   ├── api/               # Document rendering & verification search APIs
│   │   ├── verify/            # Public credential verification search & QR targets
│   │   ├── about/, programs/, majors/, services/, team/, contact/
│   ├── components/            # Layout, UI primitives, and verification display
│   ├── lib/                   # Supabase clients, data store, rate limiting, renderer
│   └── types/                 # Database entity & template layout TypeScript interfaces
├── supabase/
│   └── migrations/            # DDL migrations with RLS policies
└── scripts/                   # Database seeder & test document generation
```

---

## 🔒 Security & Verification Guarantees

1. **Anti-Enumeration Protection**: Credential serial searches on `/verify` enforce strict rate-limiting (10 requests/minute/IP) and return identical timing-safe responses whether a record exists or not.
2. **Sensitive Column Masking**: Student National ID numbers and personal contact details are shielded behind database RLS and masked in administrative lists (`••••••••1048`).
3. **Immutable Lifecycle State Machine**: Every state transition (`active` → `revoked`, `suspended`, or `expired`) mandates an official justification reason, persists an immutable row to `audit_logs`, and immediately reflects in real-time across public QR scans.
