import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary with server-only environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "kwe1gmrq";
const apiKey = process.env.CLOUDINARY_API_KEY || "677939994143521";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "NFF8T6jmZgmelp-NbmN4OEVIn4c";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface CloudinaryStoredAsset {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

/**
 * Core primitive: Upload an in-memory buffer directly to Cloudinary.
 */
export async function uploadBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    public_id?: string;
    resource_type?: "image" | "raw" | "auto";
    type?: "upload" | "authenticated" | "private";
    format?: string;
    tags?: string[];
  }
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.public_id,
        resource_type: options.resource_type || "auto",
        type: options.type || "upload",
        format: options.format,
        tags: options.tags,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed: no result returned."));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload an admin-provided template background image.
 * Saved to folder `cambria/templates` with standard image optimization.
 */
export async function uploadTemplateBackground(
  buffer: Buffer,
  filename: string
): Promise<CloudinaryStoredAsset> {
  const cleanId = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const result = await uploadBuffer(buffer, {
    folder: "cambria/templates",
    public_id: cleanId,
    resource_type: "image",
    tags: ["template", "background", "cambria-college"],
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    resource_type: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

/**
 * Upload a generated credential document artifact (PDF or PNG thumbnail).
 * Uploaded with private/authenticated access type or strictly routed through gated endpoint.
 */
export async function uploadDocumentArtifact(
  buffer: Buffer,
  options: {
    credentialNumber: string;
    documentType: string;
    isPdf: boolean;
    version?: number;
  }
): Promise<CloudinaryStoredAsset> {
  const v = options.version || 1;
  const kind = options.documentType;
  const cleanCredNum = options.credentialNumber.replace(/[^a-zA-Z0-9_-]/g, "_");
  const publicId = `${cleanCredNum}_${kind}_v${v}`;

  const result = await uploadBuffer(buffer, {
    folder: "cambria/documents",
    public_id: publicId,
    resource_type: options.isPdf ? "raw" : "image",
    tags: ["credential", kind, options.isPdf ? "pdf" : "thumbnail"],
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    resource_type: result.resource_type,
    format: result.format,
    bytes: result.bytes,
  };
}

export const uploadTemplateBackgroundToCloudinary = uploadTemplateBackground;
export const uploadDocumentArtifactToCloudinary = uploadDocumentArtifact;

/**
 * Delete an asset from Cloudinary by its public ID.
 */
export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<boolean> {
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return res.result === "ok";
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, err);
    return false;
  }
}

/**
 * Generate a cryptographically signed, time-limited delivery URL.
 * Used exclusively after checking live database status for gated documents.
 */
export function getSignedDeliveryUrl(
  publicId: string,
  options: {
    resourceType?: "image" | "raw";
    expiresInSeconds?: number;
    format?: string;
  } = {}
): string {
  const expiresIn = options.expiresInSeconds || 60; // 60 seconds default
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

  return cloudinary.utils.url(publicId, {
    resource_type: options.resourceType || "image",
    format: options.format,
    sign_url: true,
    secure: true,
    expires_at: expiresAt,
  });
}

/**
 * Fetch asset buffer directly via Cloudinary CDN or API (for server-side streaming).
 */
export async function fetchAssetBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch Cloudinary asset (HTTP ${res.status}): ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
