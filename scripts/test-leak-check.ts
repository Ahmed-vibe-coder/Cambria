async function runLeakCheck() {
  console.log("================================================================================");
  console.log("🔍 RUNNING LIVE SENSITIVE FIELD NEGATIVE TEST AGAINST NEXT.JS SERVER");
  console.log("================================================================================");
  const baseUrl = "http://localhost:3000";

  const sensitiveValues = [
    { label: "National ID Value", pattern: "29508141209384" },
    { label: "Student Email Value", pattern: "tariq.alhashimi@email.com" },
    { label: "Student Phone Value", pattern: "+966 50 123 4567" },
    { label: "Student Birth Date Value", pattern: "1995-08-14" },
    { label: "National ID Key", pattern: '"national_id"' },
    { label: "Birth Date Key", pattern: '"birth_date"' },
  ];

  // Route 1: GET /verify
  console.log("\n[Test 1] Testing GET /verify ...");
  const resVerify = await fetch(`${baseUrl}/verify`);
  const htmlVerify = await resVerify.text();
  console.log(`         HTTP Status: ${resVerify.status} (Length: ${htmlVerify.length} bytes)`);

  for (const item of sensitiveValues) {
    const found = htmlVerify.includes(item.pattern);
    console.log(`         Checking for ${item.label} ('${item.pattern}'): ${found ? "🚨 LEAK DETECTED!" : "✅ 0 matches (CLEAN)"}`);
    if (found) process.exit(1);
  }

  // Route 2: GET /verify/[token] with active token tok_v8K29LpQx92M1a8B4z
  const activeToken = "tok_v8K29LpQx92M1a8B4z";
  console.log(`\n[Test 2] Testing GET /verify/${activeToken} (Positive Active Verification) ...`);
  const resToken = await fetch(`${baseUrl}/verify/${activeToken}`);
  const htmlToken = await resToken.text();
  console.log(`         HTTP Status: ${resToken.status} (Length: ${htmlToken.length} bytes)`);

  for (const item of sensitiveValues) {
    const found = htmlToken.includes(item.pattern);
    console.log(`         Checking for ${item.label} ('${item.pattern}'): ${found ? "🚨 LEAK DETECTED!" : "✅ 0 matches (CLEAN)"}`);
    if (found) process.exit(1);
  }

  // Route 3: POST /api/verify/search with real active credential number 'CAM-2026-000184'
  console.log("\n[Test 3] Testing POST /api/verify/search with credential number 'CAM-2026-000184' (Positive Active Match) ...");
  const resSearch = await fetch(`${baseUrl}/api/verify/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credentialNumber: "CAM-2026-000184" }),
  });
  const jsonSearch = await resSearch.text();
  console.log(`         HTTP Status: ${resSearch.status} (Length: ${jsonSearch.length} bytes)`);
  console.log(`         Response Body:\n${jsonSearch}\n`);

  for (const item of sensitiveValues) {
    const found = jsonSearch.includes(item.pattern);
    console.log(`         Checking for ${item.label} ('${item.pattern}'): ${found ? "🚨 LEAK DETECTED!" : "✅ 0 matches (CLEAN)"}`);
    if (found) process.exit(1);
  }

  console.log("\n================================================================================");
  console.log("🎉 ALL PUBLIC ROUTES & APIS TESTED: STRICTLY ZERO SENSITIVE DATA LEAKED!");
  console.log("================================================================================");
}

runLeakCheck().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
