import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getCredentialByToken } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    token: string;
    docType: string;
  }>;
}

/**
 * GATED CREDENTIAL DOCUMENT STREAMING ENDPOINT
 * 
 * Strict Security Invariants:
 * 1. Never serves files from public/ web root.
 * 2. On EVERY request, queries live PostgreSQL status of the credential.
 * 3. If credential status is 'revoked' -> STRICT 403 FORBIDDEN.
 * 4. If credential status is 'suspended' -> STRICT 403 FORBIDDEN.
 * 5. If active/valid -> Streams binary PDF or PNG thumbnail directly from private storage.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { token, docType } = await params;
    const url = new URL(req.url);
    const isThumb = url.searchParams.get("thumb") === "true";

    if (!token || !docType) {
      return NextResponse.json(
        { error: "Missing required token or document type parameters." },
        { status: 400 }
      );
    }

    if (!["certificate", "student_card"].includes(docType)) {
      return NextResponse.json(
        { error: "Invalid document type requested." },
        { status: 400 }
      );
    }

    // 1. Live database lookup for current status
    const credential = await getCredentialByToken(token);
    if (!credential) {
      return NextResponse.json(
        { error: "Credential record not found for this verification token." },
        { status: 404 }
      );
    }

    // 2. Strict Lifecycle Security Checks
    if (credential.status === "revoked") {
      return NextResponse.json(
        {
          error: "Access Denied: This credential has been officially REVOKED by the College Registrar.",
          status: "revoked",
          credential_number: credential.credential_number,
          revocation_reason: credential.revocation_reason,
          revoked_at: credential.revoked_at,
        },
        {
          status: 403,
          headers: {
            "X-Credential-Status": "revoked",
          },
        }
      );
    }

    if (credential.status === "suspended") {
      return NextResponse.json(
        {
          error: "Access Denied: This credential has been temporarily SUSPENDED pending review.",
          status: "suspended",
          credential_number: credential.credential_number,
          suspension_reason: credential.suspension_reason,
        },
        {
          status: 403,
          headers: {
            "X-Credential-Status": "suspended",
          },
        }
      );
    }

    // 3. Locate matching document record
    const docRecord = credential.documents?.find(
      (d) => d.document_type === docType
    );

    const docsDir = path.join(process.cwd(), "data", "documents");

    // Resolve filename from DB record or convention
    let targetFileName = "";
    if (isThumb) {
      if (docRecord?.thumbnail_path) {
        targetFileName = path.basename(docRecord.thumbnail_path);
      } else {
        targetFileName = docType === "certificate" ? "sample-cert-001.png" : "sample-card-001.png";
      }
    } else {
      if (docRecord?.file_path) {
        targetFileName = path.basename(docRecord.file_path);
      } else {
        targetFileName = docType === "certificate" ? "sample-cert-001.pdf" : "sample-card-001.pdf";
      }
    }

    const filePath = path.join(docsDir, targetFileName);

    if (!fs.existsSync(filePath)) {
      // Fallback to sample document for seeded credentials
      const fallbackName = isThumb
        ? (docType === "certificate" ? "sample-cert-001.png" : "sample-card-001.png")
        : (docType === "certificate" ? "sample-cert-001.pdf" : "sample-card-001.pdf");
      const fallbackPath = path.join(docsDir, fallbackName);

      if (!fs.existsSync(fallbackPath)) {
        return NextResponse.json(
          { error: "Requested document artifact is not available on storage." },
          { status: 404 }
        );
      }

      const fileBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": isThumb ? "image/png" : "application/pdf",
          "Content-Disposition": `inline; filename="${credential.credential_number}_${docType}.${isThumb ? "png" : "pdf"}"`,
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": isThumb ? "image/png" : "application/pdf",
        "Content-Disposition": `inline; filename="${credential.credential_number}_${docType}.${isThumb ? "png" : "pdf"}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("❌ Gated document access error:", error);
    return NextResponse.json(
      { error: "Internal document server error: " + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
