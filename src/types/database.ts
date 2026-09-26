export type DegreeLevel =
  | "training_course"
  | "professional_diploma"
  | "professional_masters"
  | "other";

export type CredentialStatus =
  | "draft"
  | "active"
  | "expired"
  | "revoked"
  | "suspended"
  | "replaced"
  | "cancelled";

export type DocumentType = "certificate" | "student_card";

export type TemplateKind = "certificate" | "student_card";

export interface Program {
  id: string;
  code: string;
  name: string;
  name_ar: string;
  degree_level: DegreeLevel;
  description?: string | null;
  description_ar?: string | null;
  duration?: string | null;
  credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_id_number: string;
  full_name_en: string;
  full_name_ar: string;
  national_id: string; // sensitive
  email: string;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  nationality?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  code: string;
  name: string;
  template_kind: TemplateKind;
  width: number;
  height: number;
  background_image_url?: string | null;
  layout_schema: TemplateLayout;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Credential {
  id: string;
  student_id: string;
  program_id: string;
  credential_number: string;
  verification_token: string;
  status: CredentialStatus;
  issue_date: string;
  expiry_date?: string | null;
  revoked_at?: string | null;
  revocation_reason?: string | null;
  suspended_at?: string | null;
  suspension_reason?: string | null;
  replaced_by_credential_id?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;

  // Joined relations
  student?: Student;
  program?: Program;
  documents?: CredentialDocument[];
}

export interface CredentialDocument {
  id: string;
  credential_id: string;
  document_type: DocumentType;
  template_id: string;
  current_version_id?: string | null;
  file_path?: string | null;
  thumbnail_path?: string | null;
  created_at: string;
  updated_at: string;

  // Joined relations
  template?: Template;
  current_version?: DocumentVersion;
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  credential_document_id: string;
  version_number: number;
  file_path: string;
  thumbnail_path?: string | null;
  metadata_snapshot: Record<string, any>;
  generated_by?: string | null;
  generated_at: string;
  file_size_bytes?: number | null;
  sha256_hash?: string | null;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id?: string | null;
  actor_email?: string | null;
  from_state?: string | null;
  to_state?: string | null;
  reason?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
}

export interface PublicVerificationResult {
  credential_number: string;
  verification_token: string;
  status: CredentialStatus;
  issue_date: string;
  expiry_date?: string | null;
  revocation_reason?: string | null;
  suspension_reason?: string | null;
  student_name_en: string;
  student_name_ar: string;
  program_name_en: string;
  program_name_ar: string;
  degree_level: DegreeLevel;
  documents: {
    document_type: DocumentType;
    file_path: string;
    thumbnail_path?: string | null;
  }[];
}

export interface TemplateField {
  id: string;
  type: "text" | "qr" | "image" | "badge" | "date";
  x: number;
  y: number;
  w: number;
  h: number;
  font?: string;
  size?: number;
  weight?: string | number;
  color?: string;
  align?: "left" | "center" | "right";
  direction?: "ltr" | "rtl";
  contentKey?: string;
  staticText?: string;
  format?: string;
}

export interface TemplateLayout {
  template_kind: TemplateKind;
  width: number;
  height: number;
  background_image_url?: string;
  background_color?: string;
  fields: TemplateField[];
}

export interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin" | "registrar" | "compliance" | "auditor";
  password_hash: string;
  mfa_secret?: string | null;
  mfa_enrolled: boolean;
  created_at: string;
  updated_at: string;
}

