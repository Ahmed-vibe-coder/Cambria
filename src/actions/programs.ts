"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProgram, addAuditLog } from "@/lib/db";

const programSchema = z.object({
  code: z.string().min(2, "Program code must be at least 2 characters"),
  name: z.string().min(3, "Program English name must be at least 3 characters"),
  name_ar: z.string().min(3, "Program Arabic name must be at least 3 characters"),
  degree_level: z.enum([
    "training_course",
    "professional_diploma",
    "professional_masters",
    "other",
  ]),
  description: z.string().optional(),
  description_ar: z.string().optional(),
  duration: z.string().optional(),
  credits: z.coerce.number().min(0, "Credits cannot be negative"),
  is_active: z.boolean().default(true),
});

export async function createProgramAction(prevState: any, formData: FormData) {
  const data = {
    code: (formData.get("code") as string).trim().toUpperCase(),
    name: formData.get("name") as string,
    name_ar: formData.get("name_ar") as string,
    degree_level: formData.get("degree_level") as any,
    description: (formData.get("description") as string) || undefined,
    description_ar: (formData.get("description_ar") as string) || undefined,
    duration: (formData.get("duration") as string) || undefined,
    credits: formData.get("credits") as string,
    is_active: true,
  };

  const parsed = programSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  try {
    const program = await createProgram(parsed.data);

    await addAuditLog({
      entity_type: "program",
      entity_id: program.id,
      action: "create_program",
      actor_email: "admin@cambria.edu",
      reason: `Created academic curriculum program ${program.name} (${program.code})`,
    });

    revalidatePath("/admin/programs");
    revalidatePath("/programs");
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create program.",
    };
  }

  redirect("/admin/programs");
}
