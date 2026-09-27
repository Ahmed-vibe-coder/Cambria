import { uploadTemplateBackgroundToCloudinary } from "../src/lib/cloudinary";

async function testCloudinary() {
  console.log("===============================================================");
  console.log("☁️ TESTING CLOUDINARY CLOUD INTEGRATION");
  console.log("===============================================================\n");

  // Create a minimal 1x1 transparent PNG buffer
  const samplePngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  const testName = `test_upload_${Date.now()}`;
  console.log(`Uploading test image "${testName}" to Cloudinary (kwe1gmrq)...`);

  const res = await uploadTemplateBackgroundToCloudinary(samplePngBuffer, testName);
  console.log("\n✅ Cloudinary Upload Succeeded!");
  console.log(`Secure URL: ${res.secure_url}`);
  console.log(`Public ID:  ${res.public_id}`);
  console.log(`Width:      ${res.width}px, Height: ${res.height}px`);

  // Verify fetch of the uploaded image
  console.log("\nVerifying image fetch from Cloudinary CDN...");
  const fetchRes = await fetch(res.secure_url);
  console.log(`Fetch Status: ${fetchRes.status} ${fetchRes.statusText}`);
  console.log(`Content-Type: ${fetchRes.headers.get("content-type")}`);
  console.log(`Content-Length: ${fetchRes.headers.get("content-length")} bytes`);
}

testCloudinary().catch(console.error);
