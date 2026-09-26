import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function runRealSeed() {
  console.log("🌱 [Cambria Seeder] Connecting to local PostgreSQL (PGlite)...");
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const db = new PGlite(dbDir);

  console.log("🌱 [Cambria Seeder] Connected to PostgreSQL 18.3 at:", dbDir);

  // 1. Programs
  console.log("1. Seeding Programs via SQL INSERT...");
  const programs = [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      code: "EMBA-701",
      name: "Executive Leadership & Educational Governance",
      name_ar: "القيادة التنفيذية والحوكمة التعليمية",
      degree_level: "professional_masters",
      description: "A postgraduate curriculum designed for senior academic administrators, provosts, and institutional directors focusing on higher education policy, ethics, and strategic institutional governance.",
      description_ar: "منهج دراسي عالي المستوى مصمم للقيادات الأكاديمية ومدراء المؤسسات يركز على سياسات التعليم العالي والحوكمة الاستراتيجية.",
      duration: "18 Months (Full-Time)",
      credits: 60,
      is_active: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      code: "IBDS-501",
      name: "International Business Administration & Digital Strategy",
      name_ar: "إدارة الأعمال الدولية والاستراتيجية الرقمية",
      degree_level: "professional_diploma",
      description: "Comprehensive professional diploma covering transnational trade, corporate finance, digital enterprise transformation, and multinational organizational leadership.",
      description_ar: "دبلوم مهني شامل يغطي التجارة الدولية والتحول الرقمي للشركات وإدارة المؤسسات متعددة الجنسيات.",
      duration: "12 Months (Full-Time)",
      credits: 36,
      is_active: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000003",
      code: "CYBR-301",
      name: "Advanced Cybersecurity & Cloud Defense Systems",
      name_ar: "الأمن السيبراني المتقدم وأنظمة الدفاع السحابي",
      degree_level: "training_course",
      description: "Rigorous technical specialization course covering threat modeling, zero-trust infrastructure architecture, incident response protocols, and security compliance.",
      description_ar: "برنامج تدريبي تقني مكثف يشمل نمذجة التهديدات وبنية الثقة الصفرية وبروتوكولات الاستجابة للحوادث.",
      duration: "16 Weeks (Intensive)",
      credits: 16,
      is_active: true,
    },
    {
      id: "a0000000-0000-0000-0000-000000000004",
      code: "AIMS-601",
      name: "Applied Artificial Intelligence & Data Architecture",
      name_ar: "الذكاء الاصطناعي التطبيقي وهندسة البيانات",
      degree_level: "professional_masters",
      description: "Advanced graduate program spanning deep learning system design, scalable data engineering, natural language processing, and ethical AI deployment in enterprise contexts.",
      description_ar: "برنامج ماجستير مهني متقدم يغطي تصميم أنظمة التعلم العميق وهندسة البيانات الضخمة وأخلاقيات الذكاء الاصطناعي.",
      duration: "24 Months",
      credits: 64,
      is_active: true,
    },
  ];

  for (const p of programs) {
    await db.query(`
      INSERT INTO programs (id, code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        name_ar = EXCLUDED.name_ar,
        degree_level = EXCLUDED.degree_level;
    `, [p.id, p.code, p.name, p.name_ar, p.degree_level, p.description, p.description_ar, p.duration, p.credits, p.is_active]);
  }
  console.log(`   ✓ Inserted/Upserted ${programs.length} programs`);

  // 2. Students
  console.log("2. Seeding Students via SQL INSERT...");
  const students = [
    {
      id: "b0000000-0000-0000-0000-000000000001",
      student_id_number: "STU-2026-000184",
      full_name_en: "Tariq Mansoor Al-Hashimi",
      full_name_ar: "طارق منصور الهاشمي",
      national_id: "ID-98240182",
      email: "t.mansoor@example.org",
      phone: "+44 20 7946 0912",
      birth_date: "1994-06-14",
      gender: "Male",
      nationality: "Jordanian",
    },
    {
      id: "b0000000-0000-0000-0000-000000000002",
      student_id_number: "STU-2026-000185",
      full_name_en: "Eleanor Claire Vance",
      full_name_ar: "إليانور كلير فانس",
      national_id: "ID-84729104",
      email: "e.vance@example.org",
      phone: "+44 20 7946 0945",
      birth_date: "1996-11-22",
      gender: "Female",
      nationality: "British",
    },
    {
      id: "b0000000-0000-0000-0000-000000000003",
      student_id_number: "STU-2026-000186",
      full_name_en: "Khalid Abdulrahman Al-Fassi",
      full_name_ar: "خالد عبد الرحمن الفاسي",
      national_id: "ID-72910482",
      email: "k.fassi@example.org",
      phone: "+971 4 391 0293",
      birth_date: "1992-03-08",
      gender: "Male",
      nationality: "Emirati",
    },
    {
      id: "b0000000-0000-0000-0000-000000000004",
      student_id_number: "STU-2026-000187",
      full_name_en: "Sarah Louise Jenkins",
      full_name_ar: "سارة لويز جينكينز",
      national_id: "ID-62910394",
      email: "s.jenkins@example.org",
      phone: "+44 20 7946 0881",
      birth_date: "1998-08-30",
      gender: "Female",
      nationality: "British",
    },
    {
      id: "b0000000-0000-0000-0000-000000000005",
      student_id_number: "STU-2026-000188",
      full_name_en: "Omar Zaid Al-Qadi",
      full_name_ar: "عمر زيد القاضي",
      national_id: "ID-51920381",
      email: "o.qadi@example.org",
      phone: "+966 11 482 9102",
      birth_date: "1995-12-05",
      gender: "Male",
      nationality: "Saudi",
    },
  ];

  for (const s of students) {
    await db.query(`
      INSERT INTO students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        student_id_number = EXCLUDED.student_id_number,
        full_name_en = EXCLUDED.full_name_en,
        full_name_ar = EXCLUDED.full_name_ar;
    `, [s.id, s.student_id_number, s.full_name_en, s.full_name_ar, s.national_id, s.email, s.phone, s.birth_date, s.gender, s.nationality]);
  }
  console.log(`   ✓ Inserted/Upserted ${students.length} students`);

  // 3. Templates
  console.log("3. Seeding Templates via SQL INSERT...");
  const templates = [
    {
      id: "c0000000-0000-0000-0000-000000000001",
      code: "CERT_STANDARD_V1",
      name: "Official Cambria Institutional Diploma & Certificate",
      template_kind: "certificate",
      width: 1600,
      height: 1131,
      background_image_url: null,
      layout_schema: {
        template_kind: "certificate",
        width: 1600,
        height: 1131,
        background_color: "#FFFFFF",
        fields: [
          { id: "college_name", type: "text", x: 200, y: 140, w: 1200, h: 40, font: "Inter", size: 18, weight: 700, color: "#020B5A", align: "center", staticText: "CAMBRIA INTERNATIONAL COLLEGE" },
          { id: "certificate_title", type: "text", x: 200, y: 260, w: 1200, h: 60, font: "Cormorant Garamond", size: 46, weight: 600, color: "#020B5A", align: "center", staticText: "Certificate of Completion & Professional Award" },
          { id: "conferred_notice", type: "text", x: 300, y: 350, w: 1000, h: 30, font: "Inter", size: 15, color: "#64748B", align: "center", staticText: "This official credential is duly conferred upon" },
          { id: "student_name_en", type: "text", x: 200, y: 410, w: 1200, h: 65, font: "Cormorant Garamond", size: 44, weight: 700, color: "#020B5A", align: "center", contentKey: "student_name_en" },
          { id: "student_name_ar", type: "text", x: 200, y: 480, w: 1200, h: 50, font: "Cairo", size: 28, weight: 700, color: "#243A8F", align: "center", direction: "rtl", contentKey: "student_name_ar" },
          { id: "requirement_notice", type: "text", x: 300, y: 560, w: 1000, h: 30, font: "Inter", size: 15, color: "#64748B", align: "center", staticText: "having successfully fulfilled all academic requirements for the curriculum of" },
          { id: "program_name_en", type: "text", x: 200, y: 610, w: 1200, h: 55, font: "Cormorant Garamond", size: 36, weight: 600, color: "#07133F", align: "center", contentKey: "program_name_en" },
          { id: "credential_number", type: "text", x: 60, y: 1050, w: 400, h: 25, font: "Inter", size: 12, weight: 600, color: "#020B5A", align: "left", contentKey: "credential_number" },
          { id: "issue_date", type: "text", x: 60, y: 1075, w: 400, h: 25, font: "Inter", size: 11, color: "#64748B", align: "left", contentKey: "issue_date" },
          { id: "qr_code", type: "qr", x: 1380, y: 920, w: 130, h: 130, contentKey: "verification_url" },
        ],
      },
      is_active: true,
    },
    {
      id: "c0000000-0000-0000-0000-000000000002",
      code: "CARD_STANDARD_V1",
      name: "Official Cambria Student Identification Card",
      template_kind: "student_card",
      width: 600,
      height: 900,
      background_image_url: null,
      layout_schema: {
        template_kind: "student_card",
        width: 600,
        height: 900,
        background_color: "#07133F",
        fields: [
          { id: "card_header_institution", type: "text", x: 30, y: 50, w: 540, h: 30, font: "Inter", size: 14, weight: 700, color: "#FFFFFF", align: "center", staticText: "CAMBRIA INTERNATIONAL COLLEGE" },
          { id: "card_badge_title", type: "text", x: 30, y: 80, w: 540, h: 24, font: "Inter", size: 11, weight: 600, color: "#C8A84E", align: "center", staticText: "OFFICIAL STUDENT IDENTIFICATION" },
          { id: "student_name_en", type: "text", x: 40, y: 340, w: 520, h: 35, font: "Cormorant Garamond", size: 26, weight: 600, color: "#FFFFFF", align: "center", contentKey: "student_name_en" },
          { id: "student_name_ar", type: "text", x: 40, y: 380, w: 520, h: 30, font: "Cairo", size: 18, weight: 600, color: "#E2CCA0", align: "center", direction: "rtl", contentKey: "student_name_ar" },
          { id: "program_name_en", type: "text", x: 40, y: 440, w: 520, h: 40, font: "Inter", size: 13, color: "#EAF0FF", align: "center", contentKey: "program_name_en" },
          { id: "credential_number", type: "text", x: 40, y: 520, w: 520, h: 25, font: "Inter", size: 12, weight: 600, color: "#C8A84E", align: "center", contentKey: "credential_number" },
          { id: "qr_code", type: "qr", x: 230, y: 590, w: 140, h: 140, contentKey: "verification_url" },
        ],
      },
      is_active: true,
    },
  ];

  for (const t of templates) {
    await db.query(`
      INSERT INTO templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        layout_schema = EXCLUDED.layout_schema;
    `, [t.id, t.code, t.name, t.template_kind, t.width, t.height, t.background_image_url, JSON.stringify(t.layout_schema), t.is_active]);
  }
  console.log(`   ✓ Inserted/Upserted ${templates.length} templates`);

  // 4. Credentials
  console.log("4. Seeding Credentials via SQL INSERT...");
  const credentials = [
    {
      id: "d0000000-0000-0000-0000-000000000001",
      student_id: "b0000000-0000-0000-0000-000000000001",
      program_id: "a0000000-0000-0000-0000-000000000001",
      credential_number: "CAM-2026-000184",
      verification_token: "tok_v8K29LpQx92M1a8B4z",
      status: "active",
      issue_date: "2026-01-15",
      expiry_date: "2031-01-15",
      notes: "Honor graduate with institutional distinction.",
    },
    {
      id: "d0000000-0000-0000-0000-000000000002",
      student_id: "b0000000-0000-0000-0000-000000000002",
      program_id: "a0000000-0000-0000-0000-000000000002",
      credential_number: "CAM-2026-000185",
      verification_token: "tok_k4M91ZbVx71P3c9D2w",
      status: "expired",
      issue_date: "2021-02-01",
      expiry_date: "2026-02-01",
      notes: "Standard 5-year credential validity elapsed.",
    },
    {
      id: "d0000000-0000-0000-0000-000000000003",
      student_id: "b0000000-0000-0000-0000-000000000003",
      program_id: "a0000000-0000-0000-0000-000000000003",
      credential_number: "CAM-2026-000186",
      verification_token: "tok_r3N82AcWx62Q4d0E1y",
      status: "revoked",
      issue_date: "2025-06-10",
      expiry_date: "2030-06-10",
      revoked_at: "2026-01-20T14:30:00Z",
      revocation_reason: "Administrative disciplinary revocation under Academic Integrity Bylaw Article 14.",
      notes: "Revoked following disciplinary committee review.",
    },
    {
      id: "d0000000-0000-0000-0000-000000000004",
      student_id: "b0000000-0000-0000-0000-000000000004",
      program_id: "a0000000-0000-0000-0000-000000000004",
      credential_number: "CAM-2026-000187",
      verification_token: "tok_p9L71BdUy53R5e2F3x",
      status: "suspended",
      issue_date: "2025-09-01",
      expiry_date: "2030-09-01",
      suspended_at: "2026-02-15T11:00:00Z",
      suspension_reason: "Temporary administrative suspension pending identity verification documentation.",
      notes: "Under institutional audit review.",
    },
    {
      id: "d0000000-0000-0000-0000-000000000005",
      student_id: "b0000000-0000-0000-0000-000000000005",
      program_id: "a0000000-0000-0000-0000-000000000001",
      credential_number: "CAM-2026-000188",
      verification_token: "tok_m2K60CeTz44S6f3G4z",
      status: "draft",
      issue_date: "2026-03-01",
      expiry_date: "2031-03-01",
      notes: "Awaiting final Dean signature before issuance.",
    },
  ];

  for (const c of credentials) {
    await db.query(`
      INSERT INTO credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        verification_token = EXCLUDED.verification_token,
        credential_number = EXCLUDED.credential_number;
    `, [c.id, c.student_id, c.program_id, c.credential_number, c.verification_token, c.status, c.issue_date, c.expiry_date, (c as any).revoked_at || null, (c as any).revocation_reason || null, (c as any).suspended_at || null, (c as any).suspension_reason || null, c.notes]);
  }
  console.log(`   ✓ Inserted/Upserted ${credentials.length} credentials`);

  // 5. Credential Documents
  console.log("5. Seeding Credential Documents via SQL INSERT...");
  const credDocs = [
    {
      id: "e0000000-0000-0000-0000-000000000001",
      credential_id: "d0000000-0000-0000-0000-000000000001",
      document_type: "certificate",
      template_id: "c0000000-0000-0000-0000-000000000001",
      file_path: "/documents/sample-cert-001.pdf",
      thumbnail_path: "/documents/sample-cert-001.png",
    },
    {
      id: "e0000000-0000-0000-0000-000000000002",
      credential_id: "d0000000-0000-0000-0000-000000000001",
      document_type: "student_card",
      template_id: "c0000000-0000-0000-0000-000000000002",
      file_path: "/documents/sample-card-001.pdf",
      thumbnail_path: "/documents/sample-card-001.png",
    },
  ];

  for (const doc of credDocs) {
    await db.query(`
      INSERT INTO credential_documents (id, credential_id, document_type, template_id, file_path, thumbnail_path)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        file_path = EXCLUDED.file_path,
        thumbnail_path = EXCLUDED.thumbnail_path;
    `, [doc.id, doc.credential_id, doc.document_type, doc.template_id, doc.file_path, doc.thumbnail_path]);
  }
  console.log(`   ✓ Inserted/Upserted ${credDocs.length} credential documents`);

  // 6. Document Versions
  console.log("6. Seeding Document Versions via SQL INSERT...");
  const docVersions = [
    {
      id: "f0000000-0000-0000-0000-000000000001",
      credential_document_id: "e0000000-0000-0000-0000-000000000001",
      version_number: 1,
      file_path: "/documents/sample-cert-001.pdf",
      thumbnail_path: "/documents/sample-cert-001.png",
      metadata_snapshot: {
        student_name_en: "Tariq Mansoor Al-Hashimi",
        student_name_ar: "طارق منصور الهاشمي",
        program_name_en: "Executive Leadership & Educational Governance",
        credential_number: "CAM-2026-000184",
      },
    },
    {
      id: "f0000000-0000-0000-0000-000000000002",
      credential_document_id: "e0000000-0000-0000-0000-000000000002",
      version_number: 1,
      file_path: "/documents/sample-card-001.pdf",
      thumbnail_path: "/documents/sample-card-001.png",
      metadata_snapshot: {
        student_name_en: "Tariq Mansoor Al-Hashimi",
        student_name_ar: "طارق منصور الهاشمي",
        program_name_en: "Executive Leadership & Educational Governance",
        credential_number: "CAM-2026-000184",
      },
    },
  ];

  for (const v of docVersions) {
    await db.query(`
      INSERT INTO document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        file_path = EXCLUDED.file_path;
    `, [v.id, v.credential_document_id, v.version_number, v.file_path, v.thumbnail_path, JSON.stringify(v.metadata_snapshot)]);
  }

  // Link current version IDs
  await db.query(`UPDATE credential_documents SET current_version_id = 'f0000000-0000-0000-0000-000000000001' WHERE id = 'e0000000-0000-0000-0000-000000000001';`);
  await db.query(`UPDATE credential_documents SET current_version_id = 'f0000000-0000-0000-0000-000000000002' WHERE id = 'e0000000-0000-0000-0000-000000000002';`);

  console.log(`   ✓ Inserted/Upserted ${docVersions.length} document versions`);

  // 7. Audit Logs
  console.log("7. Seeding Audit Logs via SQL INSERT...");
  const auditLogs = [
    {
      id: "80000000-0000-0000-0000-000000000001",
      entity_type: "credential",
      entity_id: "d0000000-0000-0000-0000-000000000001",
      action: "create",
      actor_email: "admin@cambria.edu",
      from_state: "draft",
      to_state: "active",
      reason: "Official credential issuance upon completion of Executive Leadership program.",
      ip_address: "192.168.1.1",
    },
    {
      id: "80000000-0000-0000-0000-000000000002",
      entity_type: "credential",
      entity_id: "d0000000-0000-0000-0000-000000000003",
      action: "revoke",
      actor_email: "dean@cambria.edu",
      from_state: "active",
      to_state: "revoked",
      reason: "Administrative disciplinary revocation under Academic Integrity Bylaw Article 14.",
      ip_address: "192.168.1.5",
    },
    {
      id: "80000000-0000-0000-0000-000000000003",
      entity_type: "credential",
      entity_id: "d0000000-0000-0000-0000-000000000004",
      action: "suspend",
      actor_email: "registrar@cambria.edu",
      from_state: "active",
      to_state: "suspended",
      reason: "Temporary administrative suspension pending identity verification documentation.",
      ip_address: "192.168.1.10",
    },
  ];

  for (const a of auditLogs) {
    await db.query(`
      INSERT INTO audit_logs (id, entity_type, entity_id, action, actor_email, from_state, to_state, reason, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING;
    `, [a.id, a.entity_type, a.entity_id, a.action, a.actor_email, a.from_state, a.to_state, a.reason, a.ip_address]);
  }
  console.log(`   ✓ Inserted ${auditLogs.length} audit logs`);

  // Final count verification from database
  console.log("\n📊 [Cambria Seeder] Querying real PostgreSQL row counts:");
  const counts = await db.query(`
    SELECT 'programs' as tbl, count(*) as count FROM programs
    UNION ALL SELECT 'students', count(*) FROM students
    UNION ALL SELECT 'templates', count(*) FROM templates
    UNION ALL SELECT 'credentials', count(*) FROM credentials
    UNION ALL SELECT 'credential_documents', count(*) FROM credential_documents
    UNION ALL SELECT 'document_versions', count(*) FROM document_versions
    UNION ALL SELECT 'audit_logs', count(*) FROM audit_logs;
  `);

  console.table(counts.rows);
  await db.close();
  console.log("✨ Seeding completed successfully against real PostgreSQL (data/postgres)!");
}

runRealSeed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
