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
  TrustedDevice,
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
let memoryTemplates: Template[] = [...FALLBACK_TEMPLATES];
let memoryTrustedDevices: TrustedDevice[] = [];

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

export async function deleteProgram(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credentials").delete().eq("program_id", id);
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (!error) {
        memoryPrograms = memoryPrograms.filter((p) => p.id !== id);
        memoryCredentials = memoryCredentials.filter((c) => c.program_id !== id);
        return true;
      }
    } catch (err) {
      console.warn("[DB] Supabase deleteProgram failed:", err);
    }
  }

  try {
    await db.exec(`DELETE FROM credential_documents WHERE credential_id IN (SELECT id FROM credentials WHERE program_id = '${id}');`);
    await db.exec(`DELETE FROM credentials WHERE program_id = '${id}';`);
    await db.exec(`DELETE FROM programs WHERE id = '${id}';`);
  } catch (err) {
    console.warn("[DB] PGlite deleteProgram error:", err);
  }

  memoryPrograms = memoryPrograms.filter((p) => p.id !== id);
  memoryCredentials = memoryCredentials.filter((c) => c.program_id !== id);
  return true;
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

export async function getStudentByEmail(email: string): Promise<Student | null> {
  const cleanEmail = email.trim().toLowerCase();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();
      if (!error && data) return data as Student;
    } catch {}
  }
  const students = await getStudents();
  return students.find((s) => s.email.toLowerCase() === cleanEmail) || null;
}

export async function getStudentByIdNumber(idNumber: string): Promise<Student | null> {
  const cleanId = idNumber.trim().toUpperCase();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_id_number", cleanId)
        .maybeSingle();
      if (!error && data) return data as Student;
    } catch {}
  }
  const students = await getStudents();
  return students.find((s) => s.student_id_number.toUpperCase() === cleanId) || null;
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

export async function deleteStudent(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credentials").delete().eq("student_id", id);
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (!error) {
        memoryStudents = memoryStudents.filter((s) => s.id !== id);
        memoryCredentials = memoryCredentials.filter((c) => c.student_id !== id);
        return true;
      }
    } catch (err) {
      console.warn("[DB] Supabase deleteStudent failed:", err);
    }
  }

  try {
    await db.exec(`DELETE FROM credential_documents WHERE credential_id IN (SELECT id FROM credentials WHERE student_id = '${id}');`);
    await db.exec(`DELETE FROM credentials WHERE student_id = '${id}';`);
    await db.exec(`DELETE FROM students WHERE id = '${id}';`);
  } catch (err) {
    console.warn("[DB] PGlite deleteStudent error:", err);
  }

  memoryStudents = memoryStudents.filter((s) => s.id !== id);
  memoryCredentials = memoryCredentials.filter((c) => c.student_id !== id);
  return true;
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
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Template[];
    } catch (err) {
      console.warn("[DB] Supabase getTemplates failed, using fallback:", err);
    }
  }

  const pgRows = await db.query<Template>(`SELECT * FROM templates ORDER BY created_at DESC;`);
  if (pgRows && pgRows.length > 0) return pgRows;

  return memoryTemplates;
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) return data as Template;
    } catch (err) {
      console.warn("[DB] Supabase getTemplateById error:", err);
    }
  }

  const templates = await getTemplates();
  return templates.find((t) => t.id === id) || null;
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
  return templates.find((t) => t.template_kind === kind && t.is_active) || templates.find((t) => t.template_kind === kind) || null;
}

export async function createTemplate(
  input: Omit<Template, "id" | "created_at" | "updated_at"> & { id?: string }
): Promise<Template> {
  const now = new Date().toISOString();
  const template: Template = {
    ...input,
    id: input.id || crypto.randomUUID(),
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("templates").insert({
        id: template.id,
        code: template.code,
        name: template.name,
        template_kind: template.template_kind,
        width: template.width,
        height: template.height,
        background_image_url: template.background_image_url,
        layout_schema: template.layout_schema,
        is_active: template.is_active,
        created_at: template.created_at,
        updated_at: template.updated_at,
      });
    } catch (err) {
      console.warn("[DB] Supabase createTemplate error:", err);
    }
  }

  try {
    await db.query(
      `INSERT INTO templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         layout_schema = EXCLUDED.layout_schema,
         updated_at = EXCLUDED.updated_at;`,
      [
        template.id,
        template.code,
        template.name,
        template.template_kind,
        template.width,
        template.height,
        template.background_image_url || null,
        JSON.stringify(template.layout_schema),
        template.is_active,
        template.created_at,
        template.updated_at,
      ]
    );
  } catch (err) {
    console.warn("[DB] PGlite createTemplate error:", err);
  }

  // Update memory state
  memoryTemplates.unshift(template);
  return template;
}

export async function updateTemplate(
  id: string,
  input: Partial<Template>
): Promise<Template | null> {
  const existing = await getTemplateById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: Template = {
    ...existing,
    ...input,
    id,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("templates")
        .update({
          ...input,
          updated_at: now,
        })
        .eq("id", id);
    } catch (err) {
      console.warn("[DB] Supabase updateTemplate error:", err);
    }
  }

  try {
    await db.query(
      `UPDATE templates SET
         code = COALESCE($2, code),
         name = COALESCE($3, name),
         template_kind = COALESCE($4, template_kind),
         width = COALESCE($5, width),
         height = COALESCE($6, height),
         background_image_url = $7,
         layout_schema = COALESCE($8, layout_schema),
         is_active = COALESCE($9, is_active),
         updated_at = $10
       WHERE id = $1;`,
      [
        id,
        updated.code,
        updated.name,
        updated.template_kind,
        updated.width,
        updated.height,
        updated.background_image_url || null,
        JSON.stringify(updated.layout_schema),
        updated.is_active,
        updated.updated_at,
      ]
    );
  } catch (err) {
    console.warn("[DB] PGlite updateTemplate error:", err);
  }

  const idx = memoryTemplates.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryTemplates[idx] = updated;
  } else {
    memoryTemplates.unshift(updated);
  }

  return updated;
}

export async function isTemplateInUse(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { count, error } = await supabase
        .from("credential_documents")
        .select("id", { count: "exact" })
        .eq("template_id", id);
      if (!error && (count || 0) > 0) return true;
    } catch (err) {
      console.warn("[DB] Supabase isTemplateInUse check error:", err);
    }
  }

  try {
    const rows = await db.query<{ count: string | number }>(
      `SELECT COUNT(*) as count FROM credential_documents WHERE template_id = $1;`,
      [id]
    );
    if (rows && rows.length > 0 && Number(rows[0].count) > 0) return true;
  } catch (err) {
    console.warn("[DB] PGlite isTemplateInUse check error:", err);
  }

  for (const cred of memoryCredentials) {
    if (cred.documents?.some((d) => d.template_id === id)) {
      return true;
    }
  }

  for (const cred of FALLBACK_CREDENTIALS) {
    if (cred.documents?.some((d) => d.template_id === id)) {
      return true;
    }
  }

  return false;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const inUse = await isTemplateInUse(id);
  if (inUse) {
    throw new Error(
      "Cannot delete template: it is currently referenced by issued credentials. Deletion is restricted to protect credential document integrity."
    );
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("templates").delete().eq("id", id);
    } catch (err) {
      console.warn("[DB] Supabase deleteTemplate error:", err);
    }
  }

  try {
    await db.query(`DELETE FROM templates WHERE id = $1;`, [id]);
  } catch (err) {
    console.warn("[DB] PGlite deleteTemplate error:", err);
  }

  memoryTemplates = memoryTemplates.filter((t) => t.id !== id);
  return true;
}

export async function setDefaultTemplate(
  id: string,
  kind: "certificate" | "student_card"
): Promise<boolean> {
  // Set all templates of this kind to is_active = false, then set target id to is_active = true
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("templates")
        .update({ is_active: false })
        .eq("template_kind", kind);
      await supabase
        .from("templates")
        .update({ is_active: true })
        .eq("id", id);
    } catch (err) {
      console.warn("[DB] Supabase setDefaultTemplate error:", err);
    }
  }

  try {
    await db.query(`UPDATE templates SET is_active = false WHERE template_kind = $1;`, [kind]);
    await db.query(`UPDATE templates SET is_active = true WHERE id = $1;`, [id]);
  } catch (err) {
    console.warn("[DB] PGlite setDefaultTemplate error:", err);
  }

  memoryTemplates.forEach((t) => {
    if (t.template_kind === kind) {
      t.is_active = t.id === id;
    }
  });

  return true;
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

function parseCredentialNotes(cred: any): any {
  if (!cred) return cred;
  if (cred.notes && typeof cred.notes === "string" && cred.notes.startsWith("{")) {
    try {
      const parsed = JSON.parse(cred.notes);
      if (parsed && typeof parsed === "object") {
        if (parsed.custom_fields) {
          cred.custom_fields = { ...(cred.custom_fields || {}), ...parsed.custom_fields };
        }
        if (parsed.text !== undefined) {
          cred.notes = parsed.text;
        }
      }
    } catch {}
  }
  return cred;
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
  certificate_template_id?: string | null;
  card_template_id?: string | null;
  custom_fields?: Record<string, any>;
}): Promise<Credential> {
  const credentialNumber = await generateCredentialNumber();
  const verificationToken = generateVerificationToken();
  const credentialId = crypto.randomUUID();

  let notesPayload = input.notes || null;
  if (input.custom_fields && Object.keys(input.custom_fields).length > 0) {
    try {
      notesPayload = JSON.stringify({
        text: input.notes || "",
        custom_fields: input.custom_fields,
      });
    } catch {}
  }

  const newCred: any = {
    id: credentialId,
    student_id: input.student_id,
    program_id: input.program_id,
    credential_number: credentialNumber,
    verification_token: verificationToken,
    status: "draft",
    issue_date: input.issue_date || new Date().toISOString().split("T")[0],
    expiry_date: input.expiry_date || null,
    notes: notesPayload,
    created_by: input.created_by || null,
    custom_fields: input.custom_fields || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const certTemplate = input.certificate_template_id
    ? await getTemplateById(input.certificate_template_id)
    : await getTemplateByKind("certificate");
  const cardTemplate = input.card_template_id
    ? await getTemplateById(input.card_template_id)
    : await getTemplateByKind("student_card");

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credentials").insert(newCred);

      // Create initial credential document placeholders
      if (certTemplate && input.generate_certificate !== false) {
        await supabase.from("credential_documents").insert({
          id: crypto.randomUUID(),
          credential_id: credentialId,
          document_type: "certificate",
          template_id: certTemplate.id,
        });
      }

      if (cardTemplate && (input.generate_card !== false && input.generate_student_card !== false)) {
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

  if (certTemplate && input.generate_certificate !== false) {
    newCred.documents.push({
      id: crypto.randomUUID(),
      credential_id: credentialId,
      document_type: "certificate",
      template_id: certTemplate.id,
      template: certTemplate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (cardTemplate && (input.generate_card !== false && input.generate_student_card !== false)) {
    newCred.documents.push({
      id: crypto.randomUUID(),
      credential_id: credentialId,
      document_type: "student_card",
      template_id: cardTemplate.id,
      template: cardTemplate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

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
      const { error } = await supabase.from("credentials").update(updates).eq("id", credentialId);
      if (!error) {
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
      }
    } catch (err) {
      console.warn("[DB] Supabase transitionCredentialStatus error:", err);
    }
  }

  // Update local PGlite if available
  try {
    await db.query(
      `UPDATE credentials SET status = $1, updated_at = $2 WHERE id = $3;`,
      [newStatus, now, credentialId]
    );
  } catch (err) {
    console.warn("[DB] PGlite update credential status error:", err);
  }

  // Always record audit log on status transition
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

  // Memory fallback
  Object.assign(current, updates);
  return current;
}

export const updateCredentialStatus = transitionCredentialStatus;

export async function deleteCredential(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("credential_documents").delete().eq("credential_id", id);
      const { error } = await supabase.from("credentials").delete().eq("id", id);
      if (!error) {
        memoryCredentials = memoryCredentials.filter((c) => c.id !== id);
        return true;
      }
    } catch (err) {
      console.warn("[DB] Supabase deleteCredential failed:", err);
    }
  }

  try {
    await db.exec(`DELETE FROM credential_documents WHERE credential_id = '${id}';`);
    await db.exec(`DELETE FROM credentials WHERE id = '${id}';`);
  } catch (err) {
    console.warn("[DB] PGlite deleteCredential error:", err);
  }

  memoryCredentials = memoryCredentials.filter((c) => c.id !== id);
  return true;
}

export async function saveDocumentVersion(
  credentialDocumentId: string,
  filePathOrData:
    | string
    | {
        version_number?: number;
        file_path: string;
        thumbnail_path?: string;
        cloudinary_public_id?: string | null;
        cloudinary_url?: string | null;
        cloudinary_thumb_public_id?: string | null;
        cloudinary_thumb_url?: string | null;
        metadata_snapshot: any;
        generated_by?: string;
        file_size_bytes?: number | null;
        sha256_hash?: string | null;
      },
  thumbnailPath?: string,
  metadataSnapshot?: any,
  generatedBy?: string,
  fileSizeBytes?: number | null,
  cloudinaryPdfUrl?: string | null,
  cloudinaryThumbUrl?: string | null,
  cloudinaryPdfPublicId?: string | null,
  cloudinaryThumbPublicId?: string | null
): Promise<DocumentVersion> {
  let filePath: string;
  let thumb: string | null = null;
  let meta: any = {};
  let genBy: string | null = null;
  let sizeBytes: number | null = null;
  let hash: string | null = null;
  let verNum = 1;
  let cldPdfUrl: string | null = null;
  let cldThumbUrl: string | null = null;
  let cldPdfPublicId: string | null = null;
  let cldThumbPublicId: string | null = null;

  if (typeof filePathOrData === "object" && filePathOrData !== null) {
    filePath = filePathOrData.file_path;
    thumb = filePathOrData.thumbnail_path || null;
    meta = filePathOrData.metadata_snapshot || {};
    genBy = filePathOrData.generated_by || null;
    sizeBytes = filePathOrData.file_size_bytes || null;
    hash = filePathOrData.sha256_hash || null;
    verNum = filePathOrData.version_number || 1;
    cldPdfUrl = filePathOrData.cloudinary_url || null;
    cldThumbUrl = filePathOrData.cloudinary_thumb_url || null;
    cldPdfPublicId = filePathOrData.cloudinary_public_id || null;
    cldThumbPublicId = filePathOrData.cloudinary_thumb_public_id || null;
  } else {
    filePath = filePathOrData;
    thumb = thumbnailPath || null;
    meta = metadataSnapshot || {};
    genBy = generatedBy || null;
    sizeBytes = fileSizeBytes || null;
    cldPdfUrl = cloudinaryPdfUrl || null;
    cldThumbUrl = cloudinaryThumbUrl || null;
    cldPdfPublicId = cloudinaryPdfPublicId || null;
    cldThumbPublicId = cloudinaryThumbPublicId || null;
  }

  const newVer: DocumentVersion = {
    id: crypto.randomUUID(),
    credential_document_id: credentialDocumentId,
    version_number: verNum,
    file_path: filePath,
    thumbnail_path: thumb,
    cloudinary_public_id: cldPdfPublicId,
    cloudinary_url: cldPdfUrl,
    cloudinary_thumb_public_id: cldThumbPublicId,
    cloudinary_thumb_url: cldThumbUrl,
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
          cloudinary_public_id: newVer.cloudinary_public_id,
          cloudinary_url: newVer.cloudinary_url,
          cloudinary_thumb_public_id: newVer.cloudinary_thumb_public_id,
          cloudinary_thumb_url: newVer.cloudinary_thumb_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", credentialDocumentId);
    } catch (err) {
      console.warn("[DB] Supabase saveDocumentVersion error:", err);
    }
  }

  // Update in-memory fallback cache
  for (const cred of memoryCredentials) {
    const doc = cred.documents?.find((d) => d.id === credentialDocumentId);
    if (doc) {
      doc.current_version_id = newVer.id;
      doc.file_path = newVer.file_path;
      doc.thumbnail_path = newVer.thumbnail_path;
      doc.cloudinary_public_id = newVer.cloudinary_public_id;
      doc.cloudinary_url = newVer.cloudinary_url;
      doc.cloudinary_thumb_public_id = newVer.cloudinary_thumb_public_id;
      doc.cloudinary_thumb_url = newVer.cloudinary_thumb_url;
      doc.current_version = newVer;
      if (!doc.versions) doc.versions = [];
      doc.versions.unshift(newVer);
      break;
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
    .filter((d) => d.file_path || d.cloudinary_url || d.current_version?.cloudinary_url)
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
  idOrEmail: string,
  mfaSecretEncrypted: string,
  mfaEnrolled: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const query = idOrEmail.includes("@")
        ? supabase.from("staff_users").update({
            mfa_secret: mfaSecretEncrypted,
            mfa_enrolled: mfaEnrolled,
            updated_at: new Date().toISOString(),
          }).eq("email", idOrEmail.toLowerCase().trim())
        : supabase.from("staff_users").update({
            mfa_secret: mfaSecretEncrypted,
            mfa_enrolled: mfaEnrolled,
            updated_at: new Date().toISOString(),
          }).eq("id", idOrEmail);
      await query;
    } catch (err) {
      console.warn("[DB] Supabase updateStaffUserMfa error:", err);
    }
  }

  const user = FALLBACK_STAFF_USERS.find(
    (u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase().trim()
  );
  if (user) {
    user.mfa_secret = mfaSecretEncrypted;
    user.mfa_enrolled = mfaEnrolled;
  }

  // Security: Invalidate all existing trusted devices when MFA configuration is changed or reset
  const email = user ? user.email : idOrEmail.includes("@") ? idOrEmail : null;
  if (email) {
    await revokeAllTrustedDevices(email);
  }
}

// ============================================================================
// TRUSTED DEVICES MANAGEMENT (30-Day Device Trust Flow)
// ============================================================================

export async function createTrustedDevice(input: {
  user_email: string;
  token: string;
  device_name: string;
  ip_address?: string;
  days?: number;
}): Promise<TrustedDevice> {
  const tokenHash = crypto.createHash("sha256").update(input.token).digest("hex");
  const days = input.days || 30;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const device: TrustedDevice = {
    id: crypto.randomUUID(),
    user_email: input.user_email.toLowerCase().trim(),
    token_hash: tokenHash,
    device_name: input.device_name || "Unknown Browser / Device",
    ip_address: input.ip_address || null,
    is_revoked: false,
    expires_at: expiresAt,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("trusted_devices").insert(device).select().single();
      if (!error && data) {
        memoryTrustedDevices.unshift(data as TrustedDevice);
        return data as TrustedDevice;
      }
    } catch (err) {
      console.warn("[DB] Supabase createTrustedDevice error:", err);
    }
  }

  memoryTrustedDevices.unshift(device);
  return device;
}

export async function verifyTrustedDevice(
  user_email: string,
  token: string
): Promise<boolean> {
  if (!user_email || !token) return false;
  const cleanEmail = user_email.toLowerCase().trim();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date().toISOString();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("trusted_devices")
        .select("*")
        .eq("user_email", cleanEmail)
        .eq("token_hash", tokenHash)
        .eq("is_revoked", false)
        .gt("expires_at", now)
        .maybeSingle();
      if (!error && data) return true;
    } catch (err) {
      console.warn("[DB] Supabase verifyTrustedDevice error:", err);
    }
  }

  const found = memoryTrustedDevices.find(
    (d) =>
      d.user_email === cleanEmail &&
      d.token_hash === tokenHash &&
      !d.is_revoked &&
      new Date(d.expires_at) > new Date()
  );
  return Boolean(found);
}

export async function getTrustedDevicesForUser(
  user_email: string
): Promise<TrustedDevice[]> {
  const cleanEmail = user_email.toLowerCase().trim();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("trusted_devices")
        .select("*")
        .eq("user_email", cleanEmail)
        .order("created_at", { ascending: false });
      if (!error && data) return data as TrustedDevice[];
    } catch (err) {
      console.warn("[DB] Supabase getTrustedDevicesForUser error:", err);
    }
  }

  return memoryTrustedDevices.filter((d) => d.user_email === cleanEmail);
}

export async function revokeTrustedDevice(
  id: string,
  user_email: string
): Promise<boolean> {
  const cleanEmail = user_email.toLowerCase().trim();
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("trusted_devices")
        .update({ is_revoked: true, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_email", cleanEmail);
    } catch (err) {
      console.warn("[DB] Supabase revokeTrustedDevice error:", err);
    }
  }

  const dev = memoryTrustedDevices.find((d) => d.id === id && d.user_email === cleanEmail);
  if (dev) {
    dev.is_revoked = true;
    dev.updated_at = new Date().toISOString();
  }
  return true;
}

export async function revokeAllTrustedDevices(
  user_email: string
): Promise<boolean> {
  const cleanEmail = user_email.toLowerCase().trim();
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("trusted_devices")
        .update({ is_revoked: true, updated_at: new Date().toISOString() })
        .eq("user_email", cleanEmail);
    } catch (err) {
      console.warn("[DB] Supabase revokeAllTrustedDevices error:", err);
    }
  }

  for (const dev of memoryTrustedDevices) {
    if (dev.user_email === cleanEmail) {
      dev.is_revoked = true;
      dev.updated_at = new Date().toISOString();
    }
  }
  return true;
}
