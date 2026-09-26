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
  getStudentById,
  getProgramById,
  addAuditLog,
} from "@/lib/db";
import { CredentialStatus, DocumentType } from "@/types/database";

const createCredentialSchema = z.object({
  student_id: z.string().min(1, "Student selection is required"),
  program_id: z.string().min(1, "Program selection is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional().nullable(),
  generate_certificate: z.boolean(),
  generate_student_card: z.boolean(),
  notes: z.string().optional(),
});

const transitionStatusSchema = z.object({
  credential_id: z.string().min(1),
  to_status: z.enum(["active", "expired", "revoked", "suspended", "replaced", "cancelled"]),
  reason: z.string().min(5, "A substantive explanation (at least 5 characters) is mandatory"),
});

export async function createCredentialAction(prevState: any, formData: FormData) {
  const data = {
    student_id: formData.get("student_id") as string,
    program_id: formData.get("program_id") as string,
    issue_date: formData.get("issue_date") as string,
    expiry_date: (formData.get("expiry_date") as string) || null,
    generate_certificate: formData.get("generate_certificate") === "on",
    generate_student_card: formData.get("generate_student_card") === "on",
    notes: (formData.get("notes") as string) || undefined,
  };

  const parsed = createCredentialSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  let newCredId = "";
  try {
    const cred = await createCredential({
      ...parsed.data,
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
  const template = await getTemplateByKind(documentType);
  if (!template) return;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
          credential_number: cred.credential_number,
          verification_token: cred.verification_token,
          issue_date: cred.issue_date,
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
        "admin@cambria.edu"
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
