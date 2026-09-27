import fs from "fs";
import path from "path";

const LIVE_URL = "https://cambria-five.vercel.app";

async function main() {
  console.log("================================================================================");
  console.log("🔍 FORENSIC AUDIT: TEMPLATE STUDIO & LIVE DEPLOYMENT AT", LIVE_URL);
  console.log("================================================================================\n");

  // 1. Check live /api/templates
  console.log("--- TEST 1: GET /api/templates on Live Deployment ---");
  try {
    const res = await fetch(`${LIVE_URL}/api/templates`, {
      headers: { "User-Agent": "Cambria-Audit-Bot/1.0" },
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.log(`Response Body (first 500 chars):\n${body.substring(0, 500)}`);
  } catch (err: any) {
    console.error("Fetch error on /api/templates:", err.message);
  }

  // 2. Check live /admin/templates HTML response
  console.log("\n--- TEST 2: GET /admin/templates on Live Deployment ---");
  try {
    const res = await fetch(`${LIVE_URL}/admin/templates`, {
      headers: { "User-Agent": "Cambria-Audit-Bot/1.0" },
      redirect: "manual",
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    console.log(`Location Header:`, res.headers.get("location"));
  } catch (err: any) {
    console.error("Fetch error on /admin/templates:", err.message);
  }

  // 3. Test unauthenticated POST /api/templates/upload
  console.log("\n--- TEST 3: POST /api/templates/upload without Auth ---");
  try {
    const formData = new FormData();
    const blob = new Blob(["fake image data"], { type: "image/png" });
    formData.append("file", blob, "test.png");

    const res = await fetch(`${LIVE_URL}/api/templates/upload`, {
      method: "POST",
      body: formData,
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.log(`Response Body:\n${body}`);
  } catch (err: any) {
    console.error("Fetch error on /api/templates/upload:", err.message);
  }

  // 4. Test POST /api/templates create template on Live
  console.log("\n--- TEST 4: POST /api/templates on Live (Create Test Template) ---");
  const testTemplate = {
    code: `AUDIT-TEST-${Date.now()}`,
    name: "Forensic Live Audit Template",
    template_kind: "certificate",
    width: 1920,
    height: 1080,
    background_image_url: null,
    is_active: false,
    layout_schema: {
      width: 1920,
      height: 1080,
      template_kind: "certificate",
      fields: [
        {
          id: "f-audit-1",
          type: "text",
          contentKey: "student_name_en",
          label: "Audit Student Name",
          x: 200,
          y: 300,
          width: 600,
          height: 60,
          fontFamily: "Cairo",
          fontSize: 32,
          fontWeight: "bold",
          color: "#020B5A",
          textAlign: "center",
          textDirection: "ltr",
        },
      ],
    },
  };

  let createdTemplateId: string | null = null;
  try {
    const res = await fetch(`${LIVE_URL}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testTemplate),
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const json = await res.json();
    console.log(`Created Template Response:`, JSON.stringify(json, null, 2));
    if (json?.data?.id) {
      createdTemplateId = json.data.id;
    }
  } catch (err: any) {
    console.error("Create template error:", err.message);
  }

  // 5. Test Persistence: GET /api/templates again to verify if createdTemplateId exists
  console.log("\n--- TEST 5: GET /api/templates (Persistence Verification) ---");
  try {
    const res = await fetch(`${LIVE_URL}/api/templates`, {
      cache: "no-store",
    });
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const json = await res.json();
    console.log(`Total Templates returned:`, json?.data?.length);
    const found = json?.data?.find((t: any) => t.id === createdTemplateId || t.code === testTemplate.code);
    console.log(`Found newly created template in live DB:`, Boolean(found));
    if (found) {
      console.log(`Template Details:`, JSON.stringify(found, null, 2));
    }
  } catch (err: any) {
    console.error("Persistence check error:", err.message);
  }
}

main().catch(console.error);
