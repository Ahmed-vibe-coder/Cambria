import React from "react";
import { TemplateBuilder } from "@/components/admin/template-builder/template-builder";
import { TemplateKind } from "@/types/database";

export const dynamic = "force-dynamic";

interface NewTemplatePageProps {
  searchParams?: Promise<{ kind?: string }>;
}

export default async function NewTemplatePage({ searchParams }: NewTemplatePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const kind: TemplateKind =
    resolvedParams.kind === "student_card" ? "student_card" : "certificate";

  return <TemplateBuilder defaultKind={kind} />;
}
