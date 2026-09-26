async function runGatedDocumentTest() {
  console.log("================================================================================");
  console.log("🔒 RUNNING GATED DOCUMENT ACCESS CONTROL & REVERSAL TESTS");
  console.log("================================================================================");
  const baseUrl = "http://localhost:3000";

  // Test 1: Direct old public static path
  const oldPublicUrl = `${baseUrl}/documents/sample-cert-001.pdf`;
  console.log(`\n[Test 1] Attempting direct request to old static path:\n         GET ${oldPublicUrl}`);
  const resOld = await fetch(oldPublicUrl);
  console.log(`         HTTP Status: ${resOld.status} (Expected: 404 Not Found)`);
  if (resOld.status === 404) {
    console.log("✅ PASS: Direct public folder access is strictly blocked (404 Not Found).");
  } else {
    console.error(`❌ FAILURE: Old static path unexpectedly returned ${resOld.status}!`);
    process.exit(1);
  }

  // Test 2: Gated route for REVOKED credential
  // Revoked credential from DB: CAM-2026-000186, token: tok_r3N82AcWx62Q4d0E1y
  const revokedToken = "tok_r3N82AcWx62Q4d0E1y";
  const revokedDocUrl = `${baseUrl}/api/documents/${revokedToken}/certificate`;
  console.log(`\n[Test 2] Attempting gated download for REVOKED credential:\n         GET ${revokedDocUrl}`);
  const resRevoked = await fetch(revokedDocUrl);
  const revokedJson = await resRevoked.json();
  console.log(`         HTTP Status: ${resRevoked.status} (Expected: 403 Forbidden)`);
  console.log(`         Response Body: ${JSON.stringify(revokedJson)}`);
  if (resRevoked.status === 403 && revokedJson.status === "revoked") {
    console.log("✅ PASS: Revoked credential document request strictly denied with 403 Forbidden.");
  } else {
    console.error(`❌ FAILURE: Expected 403 Forbidden for revoked document, got ${resRevoked.status}`);
    process.exit(1);
  }

  // Test 3: Gated route for SUSPENDED credential
  // Suspended credential from DB: CAM-2026-000187, token: tok_p9L71BdUy53R5e2F3x
  const suspendedToken = "tok_p9L71BdUy53R5e2F3x";
  const suspendedDocUrl = `${baseUrl}/api/documents/${suspendedToken}/certificate`;
  console.log(`\n[Test 3] Attempting gated download for SUSPENDED credential:\n         GET ${suspendedDocUrl}`);
  const resSuspended = await fetch(suspendedDocUrl);
  const suspendedJson = await resSuspended.json();
  console.log(`         HTTP Status: ${resSuspended.status} (Expected: 403 Forbidden)`);
  console.log(`         Response Body: ${JSON.stringify(suspendedJson)}`);
  if (resSuspended.status === 403 && suspendedJson.status === "suspended") {
    console.log("✅ PASS: Suspended credential document request strictly denied with 403 Forbidden.");
  } else {
    console.error(`❌ FAILURE: Expected 403 Forbidden for suspended document, got ${resSuspended.status}`);
    process.exit(1);
  }

  // Test 4: Gated route for ACTIVE credential
  // Active credential from DB: CAM-2026-000184, token: tok_v8K29LpQx92M1a8B4z
  const activeToken = "tok_v8K29LpQx92M1a8B4z";
  const activeDocUrl = `${baseUrl}/api/documents/${activeToken}/certificate`;
  console.log(`\n[Test 4] Attempting gated download for ACTIVE credential:\n         GET ${activeDocUrl}`);
  const resActive = await fetch(activeDocUrl);
  const contentType = resActive.headers.get("content-type");
  const contentDisp = resActive.headers.get("content-disposition");
  const arrayBuffer = await resActive.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isPdfHeader = buffer.slice(0, 5).toString() === "%PDF-";

  console.log(`         HTTP Status: ${resActive.status} (Expected: 200 OK)`);
  console.log(`         Content-Type: ${contentType}`);
  console.log(`         Content-Disposition: ${contentDisp}`);
  console.log(`         Payload Size: ${buffer.length} bytes`);
  console.log(`         Binary Header Check (%PDF-): ${isPdfHeader ? "✅ VALID PDF BYTE STREAM" : "❌ INVALID"}`);

  if (resActive.status === 200 && contentType?.includes("application/pdf") && isPdfHeader) {
    console.log("✅ PASS: Active credential document successfully streamed as real PDF byte stream.");
  } else {
    console.error("❌ FAILURE: Active credential document was not returned as a valid PDF stream.");
    process.exit(1);
  }

  console.log("\n================================================================================");
  console.log("🎉 ALL GATED DOCUMENT SECURITY & LIFECYCLE CHECKS PASSED PERFECTLY!");
  console.log("================================================================================");
}

runGatedDocumentTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
