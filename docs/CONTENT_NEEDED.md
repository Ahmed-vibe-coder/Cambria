# CONTENT NEEDED & ASSET AUDIT LOG — Cambria International College Platform

Per the non-negotiable architectural mandates (§2, §10, §11.6), this platform strictly avoids fabricating placeholder testimonials, fake team biographies, fictitious accreditation claims, or synthetic institutional metrics. Where authentic information is pending client provision, an honest, distinguished **"Institutional Information Pending"** state is displayed in the UI, and logged below.

---

## 1. Institutional Accreditation & Regulatory Data

| Content Item | Current State in System | Required From Client | Impacted Surface |
|---|---|---|---|
| Official Ministry / Board Registration Numbers | Displayed as "Accreditation dossier under institutional review" with verifiable seal | Official registration / charter certificates, regulatory body identifiers | `/about`, `/verify`, Footer |
| Quality Assurance Affiliation Logos | Rendered as text designations without unverified badges | High-res vector marks of partner inspection bodies / educational councils | `/about`, `/programs` |

---

## 2. Leadership & Academic Faculty Directory

| Content Item | Current State in System | Required From Client | Impacted Surface |
|---|---|---|---|
| Board of Governors & Chancellor Biographies | Rendered with leadership titles and institutional role outlines; marked with pending photo flags | Real names, verified credentials (e.g. Ph.D., Ed.D.), official executive portrait photography | `/team` |
| Academic Deans & Department Chairs | Detailed department structure rendered with honest vacant/pending notice | Official faculty listings, bios, academic disciplines | `/team`, `/about` |

---

## 3. Academic Curriculum & Course Syllabi

| Content Item | Current State in System | Required From Client | Impacted Surface |
|---|---|---|---|
| Complete Course Modular Unit Outlines | Outlined with core program competencies, credit weighting, and duration | Detailed module-by-module breakdown and syllabus documents for Diplomas and Master's | `/programs`, `/majors` |
| Tuition & Admission Requirements | Stated as "Direct inquiry via Registrar" | Exact fee schedule, entry criteria, documentation requirements | `/programs`, `/contact` |

---

## 4. Official High-Resolution Graphic Assets

| Content Item | Current State in System | Required From Client | Impacted Surface |
|---|---|---|---|
| Official Physical Certificate Vector Background | High-fidelity generated SVG/Canvas artwork matching Cambria seal, borders, and guilloche motifs | Production high-resolution vector artwork (`.ai` / `.eps` / `.svg`) used for printed diplomas | PDF Rendering Engine (`/templates`) |
| Official Student ID Card Vector Background | High-fidelity generated SVG/Canvas CR80 card artwork matching Cambria deep navy palette | Production high-resolution print artwork for plastic ID cards | PDF Rendering Engine (`/templates`) |
| Chancellor Signature & Registrar Seal Stamp | Crisp institutional cryptographic stamp placeholder | Transparent PNG scans of authorized signatory signatures and embossed gold seal | Certificate Renderer |

---

## 5. Contact & Campus Locations

| Content Item | Current State in System | Required From Client | Impacted Surface |
|---|---|---|---|
| Primary Administrative Headquarters | Rendered with official London/International liaison office format | Physical campus building address, direct registrar phone, support mailbox | `/contact`, Footer |
