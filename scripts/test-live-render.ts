async function testLiveRender() {
  const LIVE_URL = "https://cambria-five.vercel.app";
  console.log("Calling POST /api/render-document on:", LIVE_URL);

  const res = await fetch(`${LIVE_URL}/api/render-document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      layout: {
        width: 800,
        height: 600,
        template_kind: "certificate",
        fields: [],
      },
      studentData: {
        student_name_en: "Audit Test Student",
        student_name_ar: "طالب فحص تجريبي",
        program_name_en: "Cybersecurity Specialization",
        credential_number: "CAM-AUDIT-999",
        issue_date: "2026-09-27",
        verification_token: "tok_audit_test_999",
      },
      baseUrl: LIVE_URL,
    }),
  });

  console.log(`HTTP Status: ${res.status} ${res.statusText}`);
  const text = await res.text();
  console.log(`Response Body:\n${text}`);
}

testLiveRender().catch(console.error);
