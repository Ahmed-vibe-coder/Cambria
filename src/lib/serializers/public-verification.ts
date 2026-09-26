import { PublicVerificationResult, CredentialStatus, DegreeLevel } from "@/types/database";

/**
 * STRICT ALLOW-LIST FOR PUBLIC CREDENTIAL VERIFICATION
 * 
 * Only the fields explicitly listed here may ever be returned to an unauthenticated
 * public visitor. Under no circumstances should raw database rows, student records,
 * or unlisted columns be exposed.
 */
export const ALLOWED_PUBLIC_VERIFICATION_KEYS = new Set([
  "credential_number",
  "verification_token",
  "status",
  "issue_date",
  "expiry_date",
  "revocation_reason",
  "suspension_reason",
  "student_name_en",
  "student_name_ar",
  "program_name_en",
  "program_name_ar",
  "degree_level",
  "documents",
]);

export interface RawVerificationInput {
  credential_number: string;
  verification_token: string;
  status: string;
  issue_date: string;
  expiry_date?: string | null;
  revocation_reason?: string | null;
  suspension_reason?: string | null;
  student?: {
    full_name_en?: string;
    full_name_ar?: string;
    // Sensitive fields that might exist on raw student objects:
    national_id?: string;
    email?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
    nationality?: string;
  } | null;
  program?: {
    name?: string;
    name_ar?: string;
    degree_level?: string;
  } | null;
  // If flattened from SQL joins:
  student_name_en?: string;
  student_name_ar?: string;
  program_name_en?: string;
  program_name_ar?: string;
  degree_level?: string;
  documents?: Array<{
    document_type: string;
    file_path: string;
    thumbnail_path?: string | null;
  }>;
  // Potential dangerous leaks:
  [key: string]: any;
}

/**
 * Explicit allow-listed serialization function for public-facing verification responses.
 * Constructs the response object STRICTLY field-by-field.
 * Never uses spread operator (`{ ...row }`), never reflects arbitrary columns.
 */
export function toPublicVerificationView(raw: RawVerificationInput): PublicVerificationResult {
  if (!raw) {
    throw new Error("Cannot serialize null or undefined credential record.");
  }

  // 1. Resolve student names strictly
  const studentNameEn =
    raw.student_name_en ||
    raw.student?.full_name_en ||
    "";
  const studentNameAr =
    raw.student_name_ar ||
    raw.student?.full_name_ar ||
    "";

  // 2. Resolve program metadata strictly
  const programNameEn =
    raw.program_name_en ||
    raw.program?.name ||
    "";
  const programNameAr =
    raw.program_name_ar ||
    raw.program?.name_ar ||
    "";
  const degreeLevel = (raw.degree_level ||
    raw.program?.degree_level ||
    "other") as DegreeLevel;

  // 3. Resolve documents strictly
  const safeDocs = Array.isArray(raw.documents)
    ? raw.documents
        .filter((d) => d && typeof d.file_path === "string")
        .map((d) => ({
          document_type: String(d.document_type) as "certificate" | "student_card",
          file_path: String(d.file_path),
          thumbnail_path: d.thumbnail_path ? String(d.thumbnail_path) : undefined,
        }))
    : [];

  // 4. Construct output object explicitly field-by-field
  const output: PublicVerificationResult = {
    credential_number: String(raw.credential_number || ""),
    verification_token: String(raw.verification_token || ""),
    status: (raw.status || "draft") as CredentialStatus,
    issue_date: String(raw.issue_date || ""),
    expiry_date: raw.expiry_date ? String(raw.expiry_date) : undefined,
    revocation_reason: raw.revocation_reason ? String(raw.revocation_reason) : null,
    suspension_reason: raw.suspension_reason ? String(raw.suspension_reason) : null,
    student_name_en: studentNameEn,
    student_name_ar: studentNameAr,
    program_name_en: programNameEn,
    program_name_ar: programNameAr,
    degree_level: degreeLevel,
    documents: safeDocs,
  };

  // 5. Hard enforcement: runtime assertion against allow-list
  const actualKeys = Object.keys(output);
  for (const key of actualKeys) {
    if (!ALLOWED_PUBLIC_VERIFICATION_KEYS.has(key)) {
      throw new Error(`Security Violation: Unallow-listed key '${key}' detected in public view.`);
    }
  }

  // Explicit check for sensitive fields to ensure zero possibility of contamination
  const dangerousFields = [
    "national_id",
    "email",
    "phone",
    "birth_date",
    "gender",
    "nationality",
    "password_hash",
    "mfa_secret",
    "created_by",
  ];
  for (const field of dangerousFields) {
    if (field in output) {
      throw new Error(`Security Violation: Sensitive field '${field}' leaked into public view!`);
    }
  }

  return output;
}
