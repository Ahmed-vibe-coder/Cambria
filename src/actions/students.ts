"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createStudent, addAuditLog } from "@/lib/db";

const studentSchema = z.object({
  student_id_number: z.string().min(3, "Student ID number must be at least 3 characters"),
  full_name_en: z.string().min(2, "English name must be at least 2 characters"),
  full_name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  national_id: z.string().min(5, "National Identification must be at least 5 characters"),
  email: z.string().email("Valid student email required"),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
});

export async function createStudentAction(prevState: any, formData: FormData) {
  const data = {
    student_id_number: formData.get("student_id_number") as string,
    full_name_en: formData.get("full_name_en") as string,
    full_name_ar: formData.get("full_name_ar") as string,
    national_id: formData.get("national_id") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    birth_date: (formData.get("birth_date") as string) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    nationality: (formData.get("nationality") as string) || undefined,
  };

  const parsed = studentSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  try {
    const student = await createStudent(parsed.data);

    await addAuditLog({
      entity_type: "student",
      entity_id: student.id,
      action: "register_student",
      actor_email: "admin@cambria.edu",
      reason: `Registered new student ${student.full_name_en} (${student.student_id_number})`,
    });

    revalidatePath("/admin/students");
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to register student record.",
    };
  }

  redirect("/admin/students");
}
