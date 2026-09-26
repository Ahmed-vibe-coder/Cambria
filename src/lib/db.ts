import crypto from "crypto";
import path from "path";
import fs from "fs";
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
  StaffUser,
} from "@/types/database";
import { toPublicVerificationView } from "@/lib/serializers/public-verification";
import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  FALLBACK_PROGRAMS,
  FALLBACK_STUDENTS,
  FALLBACK_TEMPLATES,
  FALLBACK_CREDENTIALS,
  FALLBACK_STAFF_USERS,
  FALLBACK_AUDIT_LOGS,
} from "@/lib/fallback-data";

// In-memory runtime state cache for serverless lifecycles & local writes
let memoryCredentials = [...FALLBACK_CREDENTIALS];
let memoryStudents = [...FALLBACK_STUDENTS];
let memoryPrograms = [...FALLBACK_PROGRAMS];
let memoryAuditLogs = [...FALLBACK_AUDIT_LOGS];

function getSupabase() {
  try {
    return createServiceRoleClient();
  } catch (err) {
    return null;
  }
}

// ============================================================================
// LOCAL PGLITE (Available strictly in non-serverless local environments)
// ============================================================================
declare global {
  // eslint-disable-next-line no-var
  var __cambria_pglite__: any | undefined;
}

function getLocalPgLite(): any | null {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return null; // Disable PGlite in serverless containers
  }
  try {
    const dbDir = path.resolve(process.cwd(), "data/postgres");
    if (!fs.existsSync(dbDir)) return null;

    if (!globalThis.__cambria_pglite__) {
      // eslint-disable-next-line
      const { PGlite } = require("@electric-sql/pglite");
      globalThis.__cambria_pglite__ = new PGlite(dbDir);
    }
    return globalThis.__cambria_pglite__;
  } catch {
    return null;
  }
}

export const db = {
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const pglite = getLocalPgLite();
    if (pglite) {
      try {
        const res = await pglite.query(sql, params);
        return res.rows as T[];
      } catch (err) {
        console.warn("[DB] PGlite query error:", err);
      }
    }
    return [];
  },

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await db.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },

  async exec(sql: string): Promise<void> {
    const pglite = getLocalPgLite();
    if (pglite) {
      try {
        await pglite.exec(sql);
      } catch (err) {
        console.warn("[DB] PGlite exec error:", err);
      }
    }
  },
};

// ============================================================================
// PROGRAMS
// ============================================================================
export async function getPrograms(): Promise<Program[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("code", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Program[];
      }
    } catch (err) {
      console.warn("[DB] Supabase getPrograms failed, using fallback:", err);
    }
  }

  // Try local PGlite
  const pgRows = await db.query<Program>(`SELECT * FROM programs ORDER BY code ASC;`);
  if (pgRows && pgRows.length > 0) return pgRows;

  return memoryPrograms;
}

export async function getActivePrograms(): Promise<Program[]> {
  const programs = await getPrograms();
  return programs.filter((p) => p.is_active);
}

export async function getProgramById(id: string): Promise<Program | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return data as Program;
    } catch (err) {
      console.warn("[DB] Supabase getProgramById error:", err);
    }
  }

  const programs = await getPrograms();
  return programs.find((p) => p.id === id) || null;
}

export async function createProgram(
  input: Omit<Program, "id" | "created_at" | "updated_at">
): Promise<Program> {
  const newProgram: Program = {
    id: crypto.randomUUID(),
    ...input,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .insert(newProgram)
        .select()
        .single();
      if (!error && data) return data as Program;
    } catch (err) {
      console.warn("[DB] Supabase createProgram failed:", err);
    }
  }

  memoryPrograms.push(newProgram);
  return newProgram;
}

// ============================================================================
// STUDENTS
// ============================================================================
export async function getStudents(): Promise<Student[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Student[];
    } catch (err) {
      console.warn("[DB] Supabase getStudents failed, using fallback:", err);
    }
  }

  const pgRows = await db.query<Student>(`SELECT * FROM students ORDER BY created_at DESC;`);
  if (pgRows && pgRows.length > 0) return pgRows;

  return memoryStudents;
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return data as Student;
    } catch (err) {
      console.warn("[DB] Supabase getStudentById error:", err);
    }
  }

  const students = await getStudents();
  return students.find((s) => s.id === id) || null;
}

export async function createStudent(
  input: Omit<Student, "id" | "created_at" | "updated_at">
): Promise<Student> {
  const newStudent: Student = {
    id: crypto.randomUUID(),
    ...input,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .insert(newStudent)
        .select()
        .single();
      if (!error && data) return data as Student;
    } catch (err) {
      console.warn("[DB] Supabase createStudent failed:", err);
    }
  }

  memoryStudents.unshift(newStudent);
  return newStudent;
}

// ============================================================================
// TEMPLATES
// ============================================================================
export async function getTemplates(): Promise<Template[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data && data.length > 0) return data as Template[];
    } catch (err) {
      console.warn("[DB] Supabase getTemplates failed, using fallback:", err);
    }
  }

  const pgRows = await db.query<Template>(`SELECT * FROM templates ORDER BY created_at ASC;`);
  if (pgRows && pgRows.length > 0) return pgRows;

  return FALLBACK_TEMPLATES;
}

export async function getTemplateByKind(
  kind: "certificate" | "student_card"
): Promise<Template | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("template_kind", kind)
        .eq("is_active", true)
        .maybeSingle();
      if (!error && data) return data as Template;
    } catch (err) {
      console.warn("[DB] Supabase getTemplateByKind error:", err);
    }
  }

  const templates = await getTemplates();
  return templates.find((t) => t.template_kind === kind && t.is_active) || null;
}

// ============================================================================
// CREDENTIALS & DOCUMENTS
// ============================================================================
export async function getCredentials(): Promise<Credential[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(`
          *,
          student:students(*),
          program:programs(*),
          documents:credential_documents(
            *,
            template:templates(*),
            current_version:document_versions(*)
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Credential[];
      }
    } catch (err) {
      console.warn("[DB] Supabase getCredentials failed, using fallback:", err);
    }
  }

  // Fallback to memory / local
  return memoryCredentials;
}

export async function getCredentialById(id: string): Promise<Credential | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(`
          *,
          student:students(*),
          program:programs(*),
          documents:credential_documents(
            *,
            template:templates(*),
            current_version:document_versions(*)
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (!error && data) return data as Credential;
    } catch (err) {
      console.warn("[DB] Supabase getCredentialById error:", err);
    }
  }

  const creds = await getCredentials();
  return creds.find((c) => c.id === id) || null;
}

export async function getCredentialByToken(token: string): Promise<Credential | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(`
          *,
          student:students(*),
          program:programs(*),
          documents:credential_documents(
            *,
            template:templates(*),
            current_version:document_versions(*)
          )
        `)
        .eq("verification_token", token)
        .maybeSingle();

      if (!error && data) return data as Credential;
    } catch (err) {
      console.warn("[DB] Supabase getCredentialByToken error:", err);
    }
  }

  const creds = await getCredentials();
  return creds.find((c) => c.verification_token === token) || null;
}

export async function getCredentialByNumber(num: string): Promise<Credential | null> {
  const clean = num.trim().toUpperCase();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("credentials")
        .select(`
          *,
          student:students(*),
          program:programs(*),
          documents:credential_documents(
            *,
            template:templates(*),
            current_version:document_versions(*)
          )
        `)
        .ilike("credential_number", clean)
        .maybeSingle();

      if (!error && data) return data as Credential;
    } catch (err) {
      console.warn("[DB] Supabase getCredentialByNumber error:", err);
    }
  }

  const creds = await getCredentials();
  return (
    creds.find(
      (c) => c.credential_number.toUpperCase() === clean
    ) || null
  );
}

export async function generateCredentialNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `CAM-${year}-${rand}`;
}

export function generateVerificationToken(): string {
  const randBytes = crypto.randomBytes(16).toString("hex");
  return `tok_${randBytes}`;
}

export async function createCredential(input: {
  student_id: string;
  program_id: string;
  issue_date?: string;
  expiry_date?: string | null;
  notes?: string | null;
  created_by?: string;
  actor_email?: string;
  generate_certificate?: boolean;
  generate_card?: boolean;
  generate_student_card?: boolean;
}): Promise<Credential> {
  const credentialNumber = await generateCredentialNumber();
  const verificationToken = generateVerificationToken();
  const credentialId = crypto.randomUUID();

  const newCred: any = {
    id: credentialId,
    student_id: input.student_id,
    program_id: input.program_id,
    credential_number: credentialNumber,
    verification_token: verificationToken,
    status: "draft",
    issue_date: input.issue_date || new Date().toISOString().split("T")[0],
    expiry_date: input.expiry_date || null,
    notes: input.notes || null,
    created_by: input.created_by || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credentials").insert(newCred);

      // Create initial credential document placeholders
      const certTemplate = await getTemplateByKind("certificate");
      const cardTemplate = await getTemplateByKind("student_card");

      if (certTemplate && input.generate_certificate !== false) {
        await supabase.from("credential_documents").insert({
          id: crypto.randomUUID(),
          credential_id: credentialId,
          document_type: "certificate",
          template_id: certTemplate.id,
        });
      }

      if (cardTemplate && input.generate_card !== false) {
        await supabase.from("credential_documents").insert({
          id: crypto.randomUUID(),
          credential_id: credentialId,
          document_type: "student_card",
          template_id: cardTemplate.id,
        });
      }

      const fetched = await getCredentialById(credentialId);
      if (fetched) return fetched;
    } catch (err) {
      console.warn("[DB] Supabase createCredential error:", err);
    }
  }

  // Hydrate in memory
  const student = await getStudentById(input.student_id);
  const program = await getProgramById(input.program_id);
  newCred.student = student;
  newCred.program = program;
  newCred.documents = [];

  memoryCredentials.unshift(newCred);
  return newCred as Credential;
}

export async function transitionCredentialStatus(
  credentialId: string,
  newStatus: CredentialStatus,
  reasonOrOptions?:
    | string
    | {
        reason?: string;
        actor_email?: string;
        actor_id?: string;
        replaced_by_credential_id?: string;
      },
  actorEmail?: string,
  actorId?: string,
  replacedByCredentialId?: string
): Promise<Credential | null> {
  let reason: string | undefined;
  let actor_email: string | undefined;
  let actor_id: string | undefined;
  let replaced_by_credential_id: string | undefined;

  if (typeof reasonOrOptions === "object" && reasonOrOptions !== null) {
    reason = reasonOrOptions.reason;
    actor_email = reasonOrOptions.actor_email;
    actor_id = reasonOrOptions.actor_id;
    replaced_by_credential_id = reasonOrOptions.replaced_by_credential_id;
  } else {
    reason = reasonOrOptions;
    actor_email = actorEmail;
    actor_id = actorId;
    replaced_by_credential_id = replacedByCredentialId;
  }

  const current = await getCredentialById(credentialId);
  if (!current) return null;

  const now = new Date().toISOString();
  const updates: any = {
    status: newStatus,
    updated_at: now,
  };

  if (newStatus === "revoked") {
    updates.revoked_at = now;
    updates.revocation_reason = reason || "Revoked by registrar";
  } else if (newStatus === "suspended") {
    updates.suspended_at = now;
    updates.suspension_reason = reason || "Suspended pending review";
  } else if (newStatus === "replaced" && replaced_by_credential_id) {
    updates.replaced_by_credential_id = replaced_by_credential_id;
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credentials").update(updates).eq("id", credentialId);
      await addAuditLog({
        entity_type: "credential",
        entity_id: credentialId,
        action: newStatus,
        actor_email: actor_email,
        actor_id: actor_id,
        from_state: current.status,
        to_state: newStatus,
        reason: reason,
      });
      return await getCredentialById(credentialId);
    } catch (err) {
      console.warn("[DB] Supabase transitionCredentialStatus error:", err);
    }
  }

  // Memory fallback
  Object.assign(current, updates);
  return current;
}

export async function saveDocumentVersion(
  credentialDocumentId: string,
  filePathOrData:
    | string
    | {
        version_number?: number;
        file_path: string;
        thumbnail_path?: string;
        metadata_snapshot: any;
        generated_by?: string;
        file_size_bytes?: number;
        sha256_hash?: string;
      },
  thumbnailPath?: string,
  metadataSnapshot?: any,
  generatedBy?: string
): Promise<DocumentVersion> {
  let filePath: string;
  let thumb: string | null = null;
  let meta: any = {};
  let genBy: string | null = null;
  let sizeBytes: number | null = null;
  let hash: string | null = null;
  let verNum = 1;

  if (typeof filePathOrData === "object" && filePathOrData !== null) {
    filePath = filePathOrData.file_path;
    thumb = filePathOrData.thumbnail_path || null;
    meta = filePathOrData.metadata_snapshot || {};
    genBy = filePathOrData.generated_by || null;
    sizeBytes = filePathOrData.file_size_bytes || null;
    hash = filePathOrData.sha256_hash || null;
    verNum = filePathOrData.version_number || 1;
  } else {
    filePath = filePathOrData;
    thumb = thumbnailPath || null;
    meta = metadataSnapshot || {};
    genBy = generatedBy || null;
  }

  const newVer: DocumentVersion = {
    id: crypto.randomUUID(),
    credential_document_id: credentialDocumentId,
    version_number: verNum,
    file_path: filePath,
    thumbnail_path: thumb,
    metadata_snapshot: meta,
    generated_by: genBy,
    generated_at: new Date().toISOString(),
    file_size_bytes: sizeBytes,
    sha256_hash: hash,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("document_versions").insert(newVer);
      await supabase
        .from("credential_documents")
        .update({
          current_version_id: newVer.id,
          file_path: newVer.file_path,
          thumbnail_path: newVer.thumbnail_path,
          updated_at: new Date().toISOString(),
        })
        .eq("id", credentialDocumentId);
      return newVer;
    } catch (err) {
      console.warn("[DB] Supabase saveDocumentVersion error:", err);
    }
  }

  return newVer;
}

// ============================================================================
// AUDIT LOGS
// ============================================================================
export async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as AuditLog[];
    } catch (err) {
      console.warn("[DB] Supabase getAuditLogs error:", err);
    }
  }

  return memoryAuditLogs;
}

export async function addAuditLog(
  input: Omit<AuditLog, "id" | "created_at">
): Promise<AuditLog> {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    ...input,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("audit_logs").insert(log);
      return log;
    } catch (err) {
      console.warn("[DB] Supabase addAuditLog error:", err);
    }
  }

  memoryAuditLogs.unshift(log);
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
export async function getStaffUserByEmail(email: string): Promise<StaffUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("staff_users")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();
      if (!error && data) return data as StaffUser;
    } catch (err) {
      console.warn("[DB] Supabase getStaffUserByEmail error:", err);
    }
  }

  return (
    FALLBACK_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    ) || null
  );
}

export async function getStaffUserById(id: string): Promise<StaffUser | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("staff_users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return data as StaffUser;
    } catch (err) {
      console.warn("[DB] Supabase getStaffUserById error:", err);
    }
  }

  return FALLBACK_STAFF_USERS.find((u) => u.id === id) || null;
}

export async function updateStaffUserMfa(
  id: string,
  mfaSecretEncrypted: string,
  mfaEnrolled: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("staff_users")
        .update({
          mfa_secret: mfaSecretEncrypted,
          mfa_enrolled: mfaEnrolled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      return;
    } catch (err) {
      console.warn("[DB] Supabase updateStaffUserMfa error:", err);
    }
  }

  const user = FALLBACK_STAFF_USERS.find((u) => u.id === id);
  if (user) {
    user.mfa_secret = mfaSecretEncrypted;
    user.mfa_enrolled = mfaEnrolled;
  }
}
