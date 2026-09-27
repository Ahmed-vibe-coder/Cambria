import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getCredentialByToken } from "@/lib/db";
import { fetchAssetBuffer, getSignedDeliveryUrl } from "@/lib/storage/cloudinary";

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
 * 1. Never exposes naked Cloudinary or storage URLs to the client.
 * 2. On EVERY request, queries live PostgreSQL status of the credential.
 * 3. If credential status is 'revoked' -> STRICT 403 FORBIDDEN.
 * 4. If credential status is 'suspended' -> STRICT 403 FORBIDDEN.
 * 5. If active/valid -> Streams binary PDF or PNG thumbnail directly from Cloudinary
 *    or private storage with strict no-cache headers.
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

    const contentType = isThumb ? "image/png" : "application/pdf";
    const filename = `${credential.credential_number}_${docType}.${isThumb ? "png" : "pdf"}`;
    const responseHeaders = {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "X-Credential-Status": credential.status,
    };

    // 4. Primary: Stream directly from Cloudinary (Serverless-Safe Persistent Storage)
    const cldUrl = isThumb
      ? (docRecord?.cloudinary_thumb_url || docRecord?.current_version?.cloudinary_thumb_url)
      : (docRecord?.cloudinary_url || docRecord?.current_version?.cloudinary_url);

    const cldPublicId = isThumb
      ? (docRecord?.cloudinary_thumb_public_id || docRecord?.current_version?.cloudinary_thumb_public_id)
      : (docRecord?.cloudinary_public_id || docRecord?.current_version?.cloudinary_public_id);

    if (cldUrl || cldPublicId) {
      try {
        let fetchUrl = cldUrl;
        if (!fetchUrl && cldPublicId) {
          fetchUrl = getSignedDeliveryUrl(cldPublicId, {
            resourceType: isThumb ? "image" : "raw",
            expiresInSeconds: 60,
          });
        }

        if (fetchUrl) {
          const buffer = await fetchAssetBuffer(fetchUrl);
          return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: responseHeaders,
          });
        }
      } catch (cldFetchErr) {
        console.warn("[GatedStream] Failed to stream from Cloudinary, trying local fallback:", cldFetchErr);
      }
    }

    // 5. Fallback: Local filesystem (for local dev and pre-seeded documents)
    const docsDir = path.join(process.cwd(), "data", "documents");

    let targetFileName = "";
    if (isThumb) {
      if (docRecord?.thumbnail_path && !docRecord.thumbnail_path.startsWith("/api/")) {
        targetFileName = path.basename(docRecord.thumbnail_path);
      } else {
        targetFileName = docType === "certificate" ? "sample-cert-001.png" : "sample-card-001.png";
      }
    } else {
      if (docRecord?.file_path && !docRecord.file_path.startsWith("/api/")) {
        targetFileName = path.basename(docRecord.file_path);
      } else {
        targetFileName = docType === "certificate" ? "sample-cert-001.pdf" : "sample-card-001.pdf";
      }
    }

    const filePath = path.join(docsDir, targetFileName);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: responseHeaders,
      });
    }

    // Try seeded sample fallback file
    const fallbackName = isThumb
      ? (docType === "certificate" ? "sample-cert-001.png" : "sample-card-001.png")
      : (docType === "certificate" ? "sample-cert-001.pdf" : "sample-card-001.pdf");
    const fallbackPath = path.join(docsDir, fallbackName);

    if (fs.existsSync(fallbackPath)) {
      const fileBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: responseHeaders,
      });
    }

    return NextResponse.json(
      { error: "Requested document artifact is not available on storage." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("❌ Gated document access error:", error);
    return NextResponse.json(
      { error: "Internal document server error: " + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
