import { POST } from "../src/app/api/templates/upload/route";
import { NextRequest } from "next/server";

async function run() {
  console.log("===============================================================");
  console.log("🔒 TESTING HARDENED TEMPLATE UPLOAD SECURITY CONTROLS");
  console.log("===============================================================\n");

  // 1. Test unauthenticated request
  console.log("Test 1: Upload without authentication cookies");
  const unauthReq = new NextRequest("http://localhost:3000/api/templates/upload", {
    method: "POST",
  });
  const res1 = await POST(unauthReq);
  const json1 = await res1.json();
  console.log(`Status: ${res1.status} (Expected: 401)`);
  console.log(`Response:`, json1);

  // 2. Test request with session but no MFA
  console.log("\nTest 2: Upload with session cookie but without MFA cookie");
  const noMfaReq = new NextRequest("http://localhost:3000/api/templates/upload", {
    method: "POST",
    headers: {
      cookie: "cambria_staff_session=admin@cambria.edu",
    },
  });
  const res2 = await POST(noMfaReq);
  const json2 = await res2.json();
  console.log(`Status: ${res2.status} (Expected: 401)`);
  console.log(`Response:`, json2);

  // 3. Test request with valid MFA session but fake malicious file (magic bytes mismatch)
  console.log("\nTest 3: Upload with valid MFA session but invalid non-image payload (spoofed .png)");
  const fakeFormData = new FormData();
  const fakeFile = new Blob(["malicious shell script or text"], { type: "image/png" });
  fakeFormData.append("file", fakeFile, "malicious.png");

  const spoofedReq = new NextRequest("http://localhost:3000/api/templates/upload", {
    method: "POST",
    headers: {
      cookie: "cambria_staff_session=admin@cambria.edu; cambria_staff_mfa_verified=true",
    },
    body: fakeFormData,
  });
  const res3 = await POST(spoofedReq);
  const json3 = await res3.json();
  console.log(`Status: ${res3.status} (Expected: 400)`);
  console.log(`Response:`, json3);

  // 4. Test request with valid MFA session and authentic complete PNG image bytes
  console.log("\nTest 4: Upload with valid MFA session and authentic PNG image bytes");
  const validPngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  const validFormData = new FormData();
  const validBlob = new Blob([validPngHeader], { type: "image/png" });
  validFormData.append("file", validBlob, "valid_test.png");

  const validReq = new NextRequest("http://localhost:3000/api/templates/upload", {
    method: "POST",
    headers: {
      cookie: "cambria_staff_session=admin@cambria.edu; cambria_staff_mfa_verified=true",
    },
    body: validFormData,
  });
  const res4 = await POST(validReq);
  const json4 = await res4.json();
  console.log(`Status: ${res4.status} (Expected: 200)`);
  console.log(`Response:`, {
    success: json4.success,
    url: json4.url?.substring(0, 50) + "...",
    dataUriPrefix: json4.dataUri?.substring(0, 30) + "...",
    fileName: json4.fileName,
  });
}

run().catch(console.error);
