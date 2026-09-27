import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary with environment variables or provided credentials
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "kwe1gmrq",
  api_key: process.env.CLOUDINARY_API_KEY || "677939994143521",
  api_secret: process.env.CLOUDINARY_API_SECRET || "NFF8T6jmZgmelp-NbmN4OEVIn4c",
  secure: true,
});

export { cloudinary };

/**
 * Upload an image or file buffer to Cloudinary using an upload stream.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    public_id?: string;
    resource_type?: "image" | "raw" | "video" | "auto";
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
 * Upload a template background image to Cloudinary (folder: cambria/templates).
 */
export async function uploadTemplateBackgroundToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<{ secure_url: string; public_id: string; width: number; height: number }> {
  const result = await uploadBufferToCloudinary(buffer, {
    folder: "cambria/templates",
    public_id: filename.replace(/\.[^/.]+$/, ""),
    resource_type: "image",
    tags: ["template", "background", "cambria-college"],
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
  };
}

/**
 * Upload a generated document artifact (PDF or PNG) to Cloudinary (folder: cambria/documents).
 */
export async function uploadDocumentToCloudinary(
  buffer: Buffer,
  filename: string,
  isPdf: boolean
): Promise<{ secure_url: string; public_id: string }> {
  const result = await uploadBufferToCloudinary(buffer, {
    folder: "cambria/documents",
    public_id: filename.replace(/\.[^/.]+$/, ""),
    resource_type: isPdf ? "raw" : "image",
    tags: ["credential", isPdf ? "pdf" : "thumbnail"],
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}
