import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { uploadTemplateBackgroundToCloudinary } from "@/lib/cloudinary";


export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Maximum

function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; mimeType: string; ext: string } {
  if (buffer.length < 8) return { isValid: false, mimeType: "", ext: "" };

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { isValid: true, mimeType: "image/png", ext: ".png" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, mimeType: "image/jpeg", ext: ".jpg" };
  }

  // WebP: RIFF ... WEBP (52 49 46 46 ... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, mimeType: "image/webp", ext: ".webp" };
  }

  return { isValid: false, mimeType: "", ext: "" };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Mandatory Administrative Authentication & MFA Session Gate
    const sessionCookie = req.cookies.get("cambria_staff_session");
    const mfaCookie = req.cookies.get("cambria_staff_mfa_verified");
    const supabaseCookie =
      req.cookies.get("sb-access-token") ||
      req.cookies.get("supabase-auth-token") ||
      req.cookies.getAll().find((c) => c.name.includes("-auth-token"));

    const hasSession = Boolean(sessionCookie?.value || supabaseCookie?.value);
    const hasMfa = Boolean(mfaCookie?.value === "true" || supabaseCookie?.value);

    if (!hasSession || !hasMfa) {
      return NextResponse.json(
        { error: "Unauthorized: Active administrative MFA session required to upload template assets." },
        { status: 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided for upload." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Enforce Strict Size Limit (5MB)
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 5 MB.`,
        },
        { status: 400 }
      );
    }

    // 4. Server-Side Magic Bytes Validation (Prevent MIME Spoofing & Malicious Executables)
    const { isValid, mimeType, ext } = validateImageMagicBytes(buffer);
    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid file format. Only authentic image files (PNG, JPEG, WebP) are accepted.",
        },
        { status: 400 }
      );
    }

    // 5. Generate Non-Guessable Sanitized Filename (Cryptographic UUID)
    const safeName = `template_bg_${Date.now()}_${crypto.randomUUID()}${ext}`;

    // 6. Generate Base64 Data URI (Instant preview & fallback)
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    let publicUrl = dataUri;
    let storageProvider = "data_uri";

    // 7. Primary Persistent Cloud Storage: Cloudinary CDN
    try {
      const cld = await uploadTemplateBackgroundToCloudinary(buffer, safeName);
      publicUrl = cld.secure_url;
      storageProvider = "cloudinary";
    } catch (cldErr) {
      console.warn("[Upload] Cloudinary upload fallback, attempting local storage:", cldErr);
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "templates");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);
        publicUrl = `/uploads/templates/${safeName}`;
        storageProvider = "local_filesystem";
      } catch {
        publicUrl = dataUri;
        storageProvider = "data_uri_fallback";
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      dataUri,
      fileName: safeName,
      storage: storageProvider,
    });
  } catch (err: any) {
    console.error("Template upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
