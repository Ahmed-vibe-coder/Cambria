"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCredential,
  deleteCredential,
  getCredentialById,
  transitionCredentialStatus,
  saveDocumentVersion,
  getTemplateByKind,
  getTemplateById,
  getStudentById,
  getStudentByEmail,
  getStudentByIdNumber,
  createStudent,
  getProgramById,
  addAuditLog,
} from "@/lib/db";
import { CredentialStatus, DocumentType } from "@/types/database";
import { getAppBaseUrl } from "@/lib/utils";

const createCredentialSchema = z.object({
  student_mode: z.enum(["inline", "existing"]).default("inline"),
  // Existing scholar selection
  student_id: z.string().optional().nullable(),

  // Direct inline student parameters
  student_full_name_en: z.string().optional().nullable(),
  student_full_name_ar: z.string().optional().nullable(),
  student_id_number: z.string().optional().nullable(),
  student_national_id: z.string().optional().nullable(),
  student_email: z.string().optional().nullable(),
  student_phone: z.string().optional().nullable(),
  student_birth_date: z.string().optional().nullable(),
  student_gender: z.string().optional().nullable(),
  student_nationality: z.string().optional().nullable(),
  save_as_student: z.boolean().default(true),

  // Program & Credential parameters
  program_id: z.string().min(1, "Academic program selection is required"),
  issue_date: z.string().min(1, "Conferral / issue date is required"),
  expiry_date: z.string().optional().nullable(),
  generate_certificate: z.boolean(),
  generate_student_card: z.boolean(),
  certificate_template_id: z.string().optional().nullable(),
  card_template_id: z.string().optional().nullable(),
  notes: z.string().optional(),

  // Dynamic & Custom metadata
  grade: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  honors: z.string().optional().nullable(),
  custom_fields_json: z.string().optional().nullable(),
});

const transitionStatusSchema = z.object({
  credential_id: z.string().min(1),
  to_status: z.enum(["active", "expired", "revoked", "suspended", "replaced", "cancelled"]),
  reason: z.string().min(5, "A substantive explanation (at least 5 characters) is mandatory"),
});

export async function createCredentialAction(prevState: any, formData: FormData) {
  const studentMode = (formData.get("student_mode") as "inline" | "existing") || "inline";

  const data = {
    student_mode: studentMode,
    student_id: (formData.get("student_id") as string) || null,

    student_full_name_en: (formData.get("student_full_name_en") as string) || null,
    student_full_name_ar: (formData.get("student_full_name_ar") as string) || null,
    student_id_number: (formData.get("student_id_number") as string) || null,
    student_national_id: (formData.get("student_national_id") as string) || null,
    student_email: (formData.get("student_email") as string) || null,
    student_phone: (formData.get("student_phone") as string) || null,
    student_birth_date: (formData.get("student_birth_date") as string) || null,
    student_gender: (formData.get("student_gender") as string) || null,
    student_nationality: (formData.get("student_nationality") as string) || null,
    save_as_student: formData.get("save_as_student") !== "off" && formData.get("save_as_student") !== "false",

    program_id: (formData.get("program_id") as string) || "",
    issue_date: (formData.get("issue_date") as string) || "",
    expiry_date: (formData.get("expiry_date") as string) || null,
    generate_certificate: formData.get("generate_certificate") === "on",
    generate_student_card: formData.get("generate_student_card") === "on",
    certificate_template_id: (formData.get("certificate_template_id") as string) || null,
    card_template_id: (formData.get("card_template_id") as string) || null,
    notes: (formData.get("notes") as string) || undefined,

    grade: (formData.get("grade") as string) || null,
    specialization: (formData.get("specialization") as string) || null,
    honors: (formData.get("honors") as string) || null,
    custom_fields_json: (formData.get("custom_fields_json") as string) || null,
  };

  const parsed = createCredentialSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  // 1. Resolve or Auto-Create Scholar Record
  let finalStudentId = parsed.data.student_id;

  if (parsed.data.student_mode === "inline" || !finalStudentId) {
    const fullNameEn = (parsed.data.student_full_name_en || "").trim();
    if (!fullNameEn || fullNameEn.length < 2) {
      return {
        success: false,
        error: "Please enter the candidate scholar's full English name (at least 2 characters).",
      };
    }

    const fullNameAr = (parsed.data.student_full_name_ar || "").trim() || fullNameEn;
    const year = new Date().getFullYear();
    const idNum = (parsed.data.student_id_number || "").trim() ||
      `STU-${year}-${Math.floor(100000 + Math.random() * 900000)}`;
    const natId = (parsed.data.student_national_id || "").trim() ||
      `ID-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const rawEmail = (parsed.data.student_email || "").trim();
    const sanitizedEmail = (rawEmail && rawEmail.includes("@"))
      ? rawEmail
      : `${fullNameEn.toLowerCase().replace(/[^a-z0-9]/g, ".")}.${Math.floor(100 + Math.random() * 900)}@cambria.edu`;

    // Deduplication check: see if a student with this ID or email already exists
    let student = await getStudentByIdNumber(idNum);
    if (!student && rawEmail) {
      student = await getStudentByEmail(rawEmail);
    }

    // Auto-create and persist student profile in database if not found
    if (!student) {
      try {
        student = await createStudent({
          student_id_number: idNum,
          full_name_en: fullNameEn,
          full_name_ar: fullNameAr,
          national_id: natId,
          email: sanitizedEmail,
          phone: (parsed.data.student_phone || "").trim() || null,
          birth_date: (parsed.data.student_birth_date || "").trim() || null,
          gender: (parsed.data.student_gender || "").trim() || null,
          nationality: (parsed.data.student_nationality || "").trim() || "International",
        });

        await addAuditLog({
          entity_type: "student",
          entity_id: student.id,
          action: "register_student_inline",
          actor_email: "admin@cambria.edu",
          reason: `Auto-registered scholar profile during direct credential conferral: ${fullNameEn} (${idNum})`,
        });
      } catch (err: any) {
        return {
          success: false,
          error: `Failed to create scholar profile: ${err?.message || "Unknown database error"}`,
        };
      }
    }

    finalStudentId = student.id;
  }

  // 2. Aggregate Dynamic and Custom Metadata
  const customFields: Record<string, any> = {};
  if (parsed.data.grade) customFields.grade = parsed.data.grade.trim();
  if (parsed.data.specialization) customFields.specialization = parsed.data.specialization.trim();
  if (parsed.data.honors) customFields.honors = parsed.data.honors.trim();

  if (parsed.data.custom_fields_json) {
    try {
      const parsedObj = JSON.parse(parsed.data.custom_fields_json);
      if (typeof parsedObj === "object" && parsedObj !== null) {
        Object.assign(customFields, parsedObj);
      }
    } catch {}
  }

  // Also collect any dynamic custom_field_key_* and custom_field_val_* entries from FormData
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("custom_field_key_")) {
      const idx = key.replace("custom_field_key_", "");
      const val = formData.get(`custom_field_val_${idx}`) as string;
      const fieldKey = (value as string).trim();
      if (fieldKey && val) {
        customFields[fieldKey] = val.trim();
      }
    }
  }

  let newCredId = "";
  try {
    const cred = await createCredential({
      student_id: finalStudentId!,
      program_id: parsed.data.program_id,
      issue_date: parsed.data.issue_date,
      expiry_date: parsed.data.expiry_date,
      generate_certificate: parsed.data.generate_certificate,
      generate_student_card: parsed.data.generate_student_card,
      certificate_template_id: parsed.data.certificate_template_id,
      card_template_id: parsed.data.card_template_id,
      notes: parsed.data.notes,
      custom_fields: customFields,
      actor_email: "admin@cambria.edu",
    });
    newCredId = cred.id;

    // Trigger rendering pipeline for attached document types
    const student = await getStudentById(cred.student_id);
    const program = await getProgramById(cred.program_id);

    if (student && program && cred.documents) {
      for (const doc of cred.documents) {
        await triggerRenderForDocument(doc.id, cred, student, program, doc.document_type);
      }
    }

    revalidatePath("/admin/credentials");
    revalidatePath("/admin/students");
    revalidatePath("/admin");
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to issue credential.",
    };
  }

  redirect(`/admin/credentials/${newCredId}`);
}

export async function transitionStatusAction(formData: FormData): Promise<void> {
  const credential_id = formData.get("credential_id") as string;
  const to_status = formData.get("to_status") as CredentialStatus;
  const reason = formData.get("reason") as string;

  const parsed = transitionStatusSchema.safeParse({
    credential_id,
    to_status,
    reason,
  });

  if (!parsed.success) {
    return;
  }

  try {
    await transitionCredentialStatus(
      credential_id,
      to_status,
      reason,
      "admin@cambria.edu"
    );

    revalidatePath(`/admin/credentials/${credential_id}`);
    revalidatePath("/admin/credentials");
    revalidatePath("/verify");
  } catch (err: any) {
    console.error("Status transition error:", err);
  }
}

export async function regenerateDocumentAction(formData: FormData): Promise<void> {
  const credential_document_id = formData.get("credential_document_id") as string;
  const credential_id = formData.get("credential_id") as string;
  const document_type = formData.get("document_type") as DocumentType;

  try {
    const cred = await getCredentialById(credential_id);
    if (!cred) throw new Error("Credential not found");

    const student = await getStudentById(cred.student_id);
    const program = await getProgramById(cred.program_id);
    if (!student || !program) throw new Error("Linked student or program missing");

    await triggerRenderForDocument(credential_document_id, cred, student, program, document_type);

    revalidatePath(`/admin/credentials/${credential_id}`);
    revalidatePath("/admin/documents");
  } catch (err: any) {
    console.error("Regenerate document error:", err);
  }
}

async function triggerRenderForDocument(
  credDocId: string,
  cred: any,
  student: any,
  program: any,
  documentType: DocumentType
) {
  const credDoc = cred.documents?.find((d: any) => d.id === credDocId);
  const template = credDoc?.template_id
    ? (await getTemplateById(credDoc.template_id)) || (await getTemplateByKind(documentType))
    : await getTemplateByKind(documentType);
  if (!template) return;

  const baseUrl = getAppBaseUrl();

  // Invoke internal Chromium Route Handler
  try {
    const res = await fetch(`${baseUrl}/api/render-document`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        layout: template.layout_schema,
        studentData: {
          student_name_en: student.full_name_en,
          student_name_ar: student.full_name_ar,
          program_name_en: program.name,
          program_name_ar: program.name_ar || program.name,
          credential_number: cred.credential_number,
          student_id_number: student.student_id_number,
          student_national_id: student.national_id || "",
          student_country: student.nationality || "EGYPT",
          specialization: (cred as any).custom_fields?.specialization || (cred as any).specialization || program.name,
          grade: (cred as any).custom_fields?.grade || (cred as any).grade || "Excellent",
          honors: (cred as any).custom_fields?.honors || "",
          student_avatar: (student as any).avatar_url || null,
          verification_token: cred.verification_token,
          issue_date: cred.issue_date,
          expiry_date: cred.expiry_date,
          degree_level: program.degree_level,
          ...((cred as any).custom_fields || {}),
        },
        baseUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      await saveDocumentVersion(
        credDocId,
        data.filePath,
        data.thumbnailPath,
        {
          student_name_en: student.full_name_en,
          student_name_ar: student.full_name_ar,
          program_name_en: program.name,
          credential_number: cred.credential_number,
        },
        "admin@cambria.edu",
        data.fileSizeBytes,
        data.cloudinaryPdfUrl,
        data.cloudinaryThumbUrl,
        data.cloudinaryPdfPublicId,
        data.cloudinaryThumbPublicId
      );
    }
  } catch (err) {
    console.error("Renderer background call failed:", err);
  }
}

export async function deleteCredentialAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await deleteCredential(id);

    await addAuditLog({
      entity_type: "credential",
      entity_id: id,
      action: "delete_credential",
      actor_email: "admin@cambria.edu",
      reason: `Permanently expunged credential (${id}) from academic ledger`,
    });

    revalidatePath("/admin/credentials");
    revalidatePath("/admin");
    revalidatePath("/verify");
  } catch (err: any) {
    console.error("deleteCredentialAction error:", err);
  }
}
