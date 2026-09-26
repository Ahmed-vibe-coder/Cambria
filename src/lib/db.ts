import { PGlite } from "@electric-sql/pglite";
import path from "path";
import crypto from "crypto";
import {
  Program,
  Student,
  Credential,
  CredentialDocument,
  DocumentVersion,
  AuditLog,
  Template,
  PublicVerificationResult,
  CredentialStatus,
} from "@/types/database";
import { toPublicVerificationView } from "@/lib/serializers/public-verification";

declare global {
  // eslint-disable-next-line no-var
  var __cambria_pglite__: PGlite | undefined;
}

function getDatabaseInstance(): PGlite {
  if (!globalThis.__cambria_pglite__) {
    const dbDir = path.resolve(process.cwd(), "data/postgres");
    globalThis.__cambria_pglite__ = new PGlite(dbDir);
  }
  return globalThis.__cambria_pglite__;
}

export const db = {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const instance = getDatabaseInstance();
    const res = await instance.query(sql, params);
    return res.rows as T[];
  },

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await db.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },

  async exec(sql: string): Promise<void> {
    const instance = getDatabaseInstance();
    await instance.exec(sql);
  },
};

// ============================================================================
// PROGRAMS
// ============================================================================
export async function getPrograms(): Promise<Program[]> {
  return await db.query<Program>(`
    SELECT * FROM programs 
    ORDER BY code ASC;
  `);
}

export async function getActivePrograms(): Promise<Program[]> {
  return await db.query<Program>(`
    SELECT * FROM programs 
    WHERE is_active = true 
    ORDER BY code ASC;
  `);
}

export async function getProgramById(id: string): Promise<Program | null> {
  return await db.queryOne<Program>(`
    SELECT * FROM programs 
    WHERE id = $1;
  `, [id]);
}

export async function createProgram(
  input: Omit<Program, "id" | "created_at" | "updated_at">
): Promise<Program> {
  const result = await db.queryOne<Program>(`
    INSERT INTO programs (code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `, [
    input.code,
    input.name,
    input.name_ar,
    input.degree_level,
    input.description || null,
    input.description_ar || null,
    input.duration || null,
    input.credits ?? 0,
    input.is_active ?? true,
  ]);

  if (!result) throw new Error("Failed to insert program into PostgreSQL");
  return result;
}

// ============================================================================
// STUDENTS
// ============================================================================
export async function getStudents(): Promise<Student[]> {
  return await db.query<Student>(`
    SELECT * FROM students 
    ORDER BY created_at DESC;
  `);
}

export async function getStudentById(id: string): Promise<Student | null> {
  return await db.queryOne<Student>(`
    SELECT * FROM students 
    WHERE id = $1;
  `, [id]);
}

export async function createStudent(
  input: Omit<Student, "id" | "created_at" | "updated_at">
): Promise<Student> {
  const result = await db.queryOne<Student>(`
    INSERT INTO students (student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `, [
    input.student_id_number,
    input.full_name_en,
    input.full_name_ar,
    input.national_id,
    input.email,
    input.phone || null,
    input.birth_date || null,
    input.gender || null,
    input.nationality || null,
  ]);

  if (!result) throw new Error("Failed to insert student into PostgreSQL");
  return result;
}

// ============================================================================
// TEMPLATES
// ============================================================================
export async function getTemplates(): Promise<Template[]> {
  return await db.query<Template>(`
    SELECT * FROM templates 
    ORDER BY created_at ASC;
  `);
}

export async function getTemplateByKind(
  kind: "certificate" | "student_card"
): Promise<Template | null> {
  return await db.queryOne<Template>(`
    SELECT * FROM templates 
    WHERE template_kind = $1 AND is_active = true 
    LIMIT 1;
  `, [kind]);
}

// ============================================================================
// CREDENTIALS & DOCUMENTS
// ============================================================================
export async function getCredentials(): Promise<Credential[]> {
  const creds = await db.query<any>(`
    SELECT 
      c.*,
      row_to_json(s.*) as student,
      row_to_json(p.*) as program
    FROM credentials c
    LEFT JOIN students s ON c.student_id = s.id
    LEFT JOIN programs p ON c.program_id = p.id
    ORDER BY c.created_at DESC;
  `);

  // Hydrate documents for each credential
  for (const cred of creds) {
    const docs = await db.query<any>(`
      SELECT 
        cd.*,
        row_to_json(t.*) as template,
        row_to_json(dv.*) as current_version
      FROM credential_documents cd
      LEFT JOIN templates t ON cd.template_id = t.id
      LEFT JOIN document_versions dv ON cd.current_version_id = dv.id
      WHERE cd.credential_id = $1
      ORDER BY cd.created_at ASC;
    `, [cred.id]);

    for (const doc of docs) {
      doc.versions = await db.query<DocumentVersion>(`
        SELECT * FROM document_versions 
        WHERE credential_document_id = $1 
        ORDER BY version_number ASC;
      `, [doc.id]);
    }

    cred.documents = docs;
  }

  return creds as Credential[];
}

export async function getCredentialById(id: string): Promise<Credential | null> {
  const cred = await db.queryOne<any>(`
    SELECT 
      c.*,
      row_to_json(s.*) as student,
      row_to_json(p.*) as program
    FROM credentials c
    LEFT JOIN students s ON c.student_id = s.id
    LEFT JOIN programs p ON c.program_id = p.id
    WHERE c.id = $1;
  `, [id]);

  if (!cred) return null;

  const docs = await db.query<any>(`
    SELECT 
      cd.*,
      row_to_json(t.*) as template,
      row_to_json(dv.*) as current_version
    FROM credential_documents cd
    LEFT JOIN templates t ON cd.template_id = t.id
    LEFT JOIN document_versions dv ON cd.current_version_id = dv.id
    WHERE cd.credential_id = $1
    ORDER BY cd.created_at ASC;
  `, [cred.id]);

  for (const doc of docs) {
    doc.versions = await db.query<DocumentVersion>(`
      SELECT * FROM document_versions 
      WHERE credential_document_id = $1 
      ORDER BY version_number ASC;
    `, [doc.id]);
  }

  cred.documents = docs;
  return cred as Credential;
}

export async function getCredentialByToken(token: string): Promise<Credential | null> {
  const cred = await db.queryOne<any>(`
    SELECT 
      c.*,
      row_to_json(s.*) as student,
      row_to_json(p.*) as program
    FROM credentials c
    LEFT JOIN students s ON c.student_id = s.id
    LEFT JOIN programs p ON c.program_id = p.id
    WHERE c.verification_token = $1;
  `, [token]);

  if (!cred) return null;

  const docs = await db.query<any>(`
    SELECT 
      cd.*,
      row_to_json(t.*) as template,
      row_to_json(dv.*) as current_version
    FROM credential_documents cd
    LEFT JOIN templates t ON cd.template_id = t.id
    LEFT JOIN document_versions dv ON cd.current_version_id = dv.id
    WHERE cd.credential_id = $1;
  `, [cred.id]);

  cred.documents = docs;
  return cred as Credential;
}

export async function getCredentialByNumber(num: string): Promise<Credential | null> {
  const clean = num.trim().toUpperCase();
  const cred = await db.queryOne<any>(`
    SELECT 
      c.*,
      row_to_json(s.*) as student,
      row_to_json(p.*) as program
    FROM credentials c
    LEFT JOIN students s ON c.student_id = s.id
    LEFT JOIN programs p ON c.program_id = p.id
    WHERE UPPER(c.credential_number) = $1;
  `, [clean]);

  if (!cred) return null;

  const docs = await db.query<any>(`
    SELECT 
      cd.*,
      row_to_json(t.*) as template,
      row_to_json(dv.*) as current_version
    FROM credential_documents cd
    LEFT JOIN templates t ON cd.template_id = t.id
    LEFT JOIN document_versions dv ON cd.current_version_id = dv.id
    WHERE cd.credential_id = $1;
  `, [cred.id]);

  cred.documents = docs;
  return cred as Credential;
}

export async function generateCredentialNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const countRes = await db.queryOne<{ count: string | number }>(`
    SELECT count(*) as count FROM credentials;
  `);
  const count = Number(countRes?.count ?? 0) + 184;
  const seqStr = String(count + 1).padStart(6, "0");
  return `CAM-${year}-${seqStr}`;
}

export function generateVerificationToken(): string {
  const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.randomBytes(22);
  let token = "tok_";
  for (let i = 0; i < 18; i++) {
    token += base62Chars[bytes[i] % base62Chars.length];
  }
  return token;
}

export async function createCredential(input: {
  student_id: string;
  program_id: string;
  issue_date: string;
  expiry_date?: string | null;
  generate_certificate: boolean;
  generate_student_card: boolean;
  notes?: string | null;
  actor_email?: string;
}): Promise<Credential> {
  const credential_number = await generateCredentialNumber();
  const verification_token = generateVerificationToken();

  const cred = await db.queryOne<Credential>(`
    INSERT INTO credentials (student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, notes)
    VALUES ($1, $2, $3, $4, 'active', $5, $6, $7)
    RETURNING *;
  `, [
    input.student_id,
    input.program_id,
    credential_number,
    verification_token,
    input.issue_date,
    input.expiry_date || null,
    input.notes || null,
  ]);

  if (!cred) throw new Error("Failed to insert credential row into PostgreSQL");

  const certTmpl = await getTemplateByKind("certificate");
  const cardTmpl = await getTemplateByKind("student_card");

  if (input.generate_certificate && certTmpl) {
    await db.query(`
      INSERT INTO credential_documents (credential_id, document_type, template_id)
      VALUES ($1, 'certificate', $2);
    `, [cred.id, certTmpl.id]);
  }

  if (input.generate_student_card && cardTmpl) {
    await db.query(`
      INSERT INTO credential_documents (credential_id, document_type, template_id)
      VALUES ($1, 'student_card', $2);
    `, [cred.id, cardTmpl.id]);
  }

  await addAuditLog({
    entity_type: "credential",
    entity_id: cred.id,
    action: "create",
    actor_email: input.actor_email || "system@cambria.edu",
    from_state: "draft",
    to_state: "active",
    reason: `Initial issuance of credential ${credential_number}`,
  });

  return (await getCredentialById(cred.id))!;
}

export async function transitionCredentialStatus(
  credentialId: string,
  toStatus: CredentialStatus,
  reason: string,
  actorEmail: string
): Promise<Credential | null> {
  const cred = await getCredentialById(credentialId);
  if (!cred) return null;

  const fromState = cred.status;
  const now = new Date().toISOString();

  let revokedAt: string | null = null;
  let revocationReason: string | null = null;
  let suspendedAt: string | null = null;
  let suspensionReason: string | null = null;

  if (toStatus === "revoked") {
    revokedAt = now;
    revocationReason = reason;
  } else if (toStatus === "suspended") {
    suspendedAt = now;
    suspensionReason = reason;
  }

  await db.query(`
    UPDATE credentials
    SET 
      status = $1,
      revoked_at = $2,
      revocation_reason = $3,
      suspended_at = $4,
      suspension_reason = $5,
      updated_at = now()
    WHERE id = $6;
  `, [
    toStatus,
    revokedAt,
    revocationReason,
    suspendedAt,
    suspensionReason,
    credentialId,
  ]);

  await addAuditLog({
    entity_type: "credential",
    entity_id: credentialId,
    action: `transition_${toStatus}`,
    actor_email: actorEmail,
    from_state: fromState,
    to_state: toStatus,
    reason: reason,
  });

  return await getCredentialById(credentialId);
}

export async function saveDocumentVersion(
  credentialDocumentId: string,
  filePath: string,
  thumbnailPath: string,
  metadataSnapshot: Record<string, any>,
  actorEmail?: string
): Promise<DocumentVersion> {
  const versionCountRes = await db.queryOne<{ count: string | number }>(`
    SELECT count(*) as count FROM document_versions WHERE credential_document_id = $1;
  `, [credentialDocumentId]);

  const nextVersionNumber = Number(versionCountRes?.count ?? 0) + 1;

  const version = await db.queryOne<DocumentVersion>(`
    INSERT INTO document_versions (credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `, [
    credentialDocumentId,
    nextVersionNumber,
    filePath,
    thumbnailPath,
    JSON.stringify(metadataSnapshot),
  ]);

  if (!version) throw new Error("Failed to insert document version into PostgreSQL");

  await db.query(`
    UPDATE credential_documents
    SET 
      current_version_id = $1,
      file_path = $2,
      thumbnail_path = $3,
      updated_at = now()
    WHERE id = $4;
  `, [
    version.id,
    filePath,
    thumbnailPath,
    credentialDocumentId,
  ]);

  await addAuditLog({
    entity_type: "document",
    entity_id: credentialDocumentId,
    action: "regenerate_version",
    actor_email: actorEmail || "system@cambria.edu",
    from_state: `v${nextVersionNumber - 1}`,
    to_state: `v${nextVersionNumber}`,
    reason: `Document generated / regenerated as version ${nextVersionNumber}`,
  });

  return version;
}

// ============================================================================
// AUDIT LOGS
// ============================================================================
export async function getAuditLogs(): Promise<AuditLog[]> {
  return await db.query<AuditLog>(`
    SELECT * FROM audit_logs 
    ORDER BY created_at DESC;
  `);
}

export async function addAuditLog(
  input: Omit<AuditLog, "id" | "created_at">
): Promise<AuditLog> {
  const log = await db.queryOne<AuditLog>(`
    INSERT INTO audit_logs (entity_type, entity_id, action, actor_email, from_state, to_state, reason, ip_address, user_agent, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `, [
    input.entity_type,
    input.entity_id,
    input.action,
    input.actor_email || null,
    input.from_state || null,
    input.to_state || null,
    input.reason || null,
    input.ip_address || null,
    input.user_agent || null,
    input.metadata ? JSON.stringify(input.metadata) : "{}",
  ]);

  if (!log) throw new Error("Failed to insert audit log into PostgreSQL");
  return log;
}

// ============================================================================
// PUBLIC SAFE VERIFICATION PROJECTION (Strictly Zero Sensitive Student Data)
// ============================================================================
export async function getPublicVerification(
  tokenOrNumber: string
): Promise<PublicVerificationResult | null> {
  const clean = tokenOrNumber.trim();
  let cred: Credential | null = null;

  if (clean.startsWith("tok_")) {
    cred = await getCredentialByToken(clean);
  } else {
    cred = await getCredentialByNumber(clean);
  }

  if (!cred || !cred.student || !cred.program) return null;

  // Gated URLs: Never serve from /public/ web root. Always route through gated Route Handler.
  const docs = (cred.documents || [])
    .filter((d) => d.file_path)
    .map((d) => ({
      document_type: d.document_type,
      file_path: `/api/documents/${cred!.verification_token}/${d.document_type}`,
      thumbnail_path: `/api/documents/${cred!.verification_token}/${d.document_type}?thumb=true`,
    }));

  return toPublicVerificationView({
    credential_number: cred.credential_number,
    verification_token: cred.verification_token,
    status: cred.status,
    issue_date: cred.issue_date,
    expiry_date: cred.expiry_date,
    revocation_reason: cred.revocation_reason || null,
    suspension_reason: cred.suspension_reason || null,
    student_name_en: cred.student.full_name_en,
    student_name_ar: cred.student.full_name_ar,
    program_name_en: cred.program.name,
    program_name_ar: cred.program.name_ar,
    degree_level: cred.program.degree_level,
    documents: docs,
  });
}

// ============================================================================
// ADMINISTRATIVE STAFF USERS & PER-USER MFA
// ============================================================================
import { StaffUser } from "@/types/database";

export async function getStaffUserByEmail(email: string): Promise<StaffUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  return await db.queryOne<StaffUser>(
    `SELECT * FROM staff_users WHERE LOWER(email) = $1 LIMIT 1;`,
    [cleanEmail]
  );
}

export async function getStaffUserById(id: string): Promise<StaffUser | null> {
  return await db.queryOne<StaffUser>(
    `SELECT * FROM staff_users WHERE id = $1 LIMIT 1;`,
    [id]
  );
}

export async function updateStaffUserMfa(
  email: string,
  encryptedSecret: string,
  enrolled: boolean = true
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  await db.exec(`
    UPDATE staff_users 
    SET mfa_secret = '${encryptedSecret}', mfa_enrolled = ${enrolled}, updated_at = NOW() 
    WHERE LOWER(email) = '${cleanEmail}';
  `);
}

