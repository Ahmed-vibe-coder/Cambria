import React from "react";
import { notFound } from "next/navigation";
import { getTemplateById } from "@/lib/db";
import { TemplateBuilder } from "@/components/admin/template-builder/template-builder";

export const dynamic = "force-dynamic";

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params;
  const template = await getTemplateById(id);

  if (!template) {
    notFound();
  }

  return <TemplateBuilder initialTemplate={template} />;
}
