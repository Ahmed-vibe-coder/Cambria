interface TestResult {
  id: string;
  description: string;
  passed: boolean;
  status?: number;
  details?: any;
}

const results: TestResult[] = [];

function recordTest(id: string, description: string, passed: boolean, details: any = {}) {
  results.push({ id, description, passed, details });
  const badge = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
  console.log(`${badge} ${id}: ${description}`);
  if (!passed) {
    console.error("       Details:", JSON.stringify(details, null, 2));
  }
}

async function runE2E() {
  const BASE_URL = "http://localhost:3000";
  console.log("==================================================================");
  console.log("       CAMBRIA ADMIN AUTHENTICATION & MFA E2E VERIFICATION        ");
  console.log("==================================================================\n");

  // -------------------------------------------------------------------------
  // TEST 1: Unauthenticated request to /admin
  // -------------------------------------------------------------------------
  console.log("--- 1. Security Gate: Unauthenticated /admin Access ---");
  const unauthRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  const unauthLocation = unauthRes.headers.get("location");
  recordTest(
    "AUTH-01",
    "Unauthenticated request to /admin redirects to /admin/login",
    unauthRes.status === 307 && Boolean(unauthLocation?.includes("/admin/login")),
    { status: unauthRes.status, location: unauthLocation }
  );

  // -------------------------------------------------------------------------
  // TEST 2: Invalid password attempt
  // -------------------------------------------------------------------------
  console.log("\n--- 2. Credential Verification: Bad Password ---");
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@cambria.edu", password: "WrongPassword999!" }),
  });
  const badLoginBody = await badLoginRes.json();
  recordTest(
    "AUTH-02",
    "Invalid password returns HTTP 401 with descriptive error",
    badLoginRes.status === 401 && badLoginBody.success === false,
    { status: badLoginRes.status, body: badLoginBody }
  );

  // -------------------------------------------------------------------------
  // TEST 3: Valid admin login (Primary goal: no forced MFA challenge)
  // -------------------------------------------------------------------------
  console.log("\n--- 3. Primary Fix: Valid Admin Login (MFA Optional / Direct /admin) ---");
  const goodLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@cambria.edu", password: "Cambria@Admin2026!" }),
  });
  const goodLoginBody = await goodLoginRes.json();
  const rawCookies = goodLoginRes.headers.getSetCookie();

  let sessionCookie = "";
  let mfaVerifiedCookie = "";
  for (const c of rawCookies) {
    if (c.includes("cambria_staff_session=")) {
      sessionCookie = c.split(";")[0];
    }
    if (c.includes("cambria_staff_mfa_verified=")) {
      mfaVerifiedCookie = c.split(";")[0];
    }
  }

  const cookieJar = [sessionCookie, mfaVerifiedCookie].filter(Boolean).join("; ");

  recordTest(
    "AUTH-03",
    "Admin login returns 200 OK with requireMfa: false and redirectTo: /admin",
    goodLoginRes.status === 200 &&
      goodLoginBody.success === true &&
      goodLoginBody.requireMfa === false &&
      goodLoginBody.redirectTo === "/admin",
    { status: goodLoginRes.status, body: goodLoginBody }
  );

  recordTest(
    "AUTH-04",
    "Admin login issues secure cambria_staff_session and cambria_staff_mfa_verified cookies",
    Boolean(sessionCookie && mfaVerifiedCookie),
    { sessionCookieFound: Boolean(sessionCookie), mfaVerifiedCookieFound: Boolean(mfaVerifiedCookie) }
  );

  // -------------------------------------------------------------------------
  // TEST 4: Direct navigation to /admin with authenticated session
  // -------------------------------------------------------------------------
  console.log("\n--- 4. Dashboard Accessibility: Direct Access to /admin ---");
  const adminPageRes = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: cookieJar },
    redirect: "manual",
  });
  const adminHtml = await adminPageRes.text();

  recordTest(
    "AUTH-05",
    "Direct request to /admin with session cookies returns HTTP 200 (NOT redirected to /admin/mfa)",
    adminPageRes.status === 200,
    { status: adminPageRes.status, location: adminPageRes.headers.get("location") }
  );

  const containsDashboardContent =
    adminHtml.includes("Cambria") || adminHtml.includes("Overview") || adminHtml.includes("Dashboard");
  const containsTotpForm =
    adminHtml.includes("Authenticator App (TOTP)") || adminHtml.includes("6-digit");

  recordTest(
    "AUTH-06",
    "Admin page renders dashboard UI with ZERO TOTP / MFA prompts",
    containsDashboardContent && !containsTotpForm,
    { containsDashboardContent, containsTotpForm }
  );

  // -------------------------------------------------------------------------
  // TEST 5: Refresh resilience (Multiple consecutive requests)
  // -------------------------------------------------------------------------
  console.log("\n--- 5. Session Resilience: Browser Refresh ---");
  const refreshRes1 = await fetch(`${BASE_URL}/admin`, { headers: { Cookie: cookieJar }, redirect: "manual" });
  const refreshRes2 = await fetch(`${BASE_URL}/admin`, { headers: { Cookie: cookieJar }, redirect: "manual" });
  recordTest(
    "AUTH-07",
    "Session persists across repeated browser refreshes without MFA prompts",
    refreshRes1.status === 200 && refreshRes2.status === 200,
    { refresh1: refreshRes1.status, refresh2: refreshRes2.status }
  );

  // -------------------------------------------------------------------------
  // TEST 6: Redirect from /admin/login when already authenticated
  // -------------------------------------------------------------------------
  console.log("\n--- 6. Login UX: Forwarding already-authenticated admin ---");
  const loginWhileAuthRes = await fetch(`${BASE_URL}/admin/login`, {
    headers: { Cookie: cookieJar },
    redirect: "manual",
  });
  const loginForwardLocation = loginWhileAuthRes.headers.get("location");
  recordTest(
    "AUTH-08",
    "Accessing /admin/login while authenticated redirects directly to /admin",
    loginWhileAuthRes.status === 307 && Boolean(loginForwardLocation?.endsWith("/admin")),
    { status: loginWhileAuthRes.status, location: loginForwardLocation }
  );

  // -------------------------------------------------------------------------
  // TEST 7: Protected API endpoints authorization
  // -------------------------------------------------------------------------
  console.log("\n--- 7. API Security: Route Guards ---");
  // /api/admin-data without cookies
  const apiNoAuth = await fetch(`${BASE_URL}/api/admin-data?type=students`);
  recordTest(
    "AUTH-09",
    "GET /api/admin-data without cookies returns HTTP 401 Unauthorized",
    apiNoAuth.status === 401,
    { status: apiNoAuth.status }
  );

  // /api/admin-data with cookies
  const apiWithAuth = await fetch(`${BASE_URL}/api/admin-data?type=students`, {
    headers: { Cookie: cookieJar },
  });
  const apiData = await apiWithAuth.json();
  recordTest(
    "AUTH-10",
    "GET /api/admin-data with session cookies returns HTTP 200 with student records",
    apiWithAuth.status === 200 && Array.isArray(apiData) && apiData.length > 0,
    { status: apiWithAuth.status, count: Array.isArray(apiData) ? apiData.length : 0 }
  );

  // /api/templates POST without cookies
  const tplNoAuth = await fetch(`${BASE_URL}/api/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Unauthorized Test" }),
  });
  recordTest(
    "AUTH-11",
    "POST /api/templates without cookies returns HTTP 401 Unauthorized",
    tplNoAuth.status === 401,
    { status: tplNoAuth.status }
  );

  // -------------------------------------------------------------------------
  // TEST 8: /admin/mfa route accessibility for authenticated admin
  // -------------------------------------------------------------------------
  console.log("\n--- 8. MFA Management: Setup page accessible without loops ---");
  // Without cookies -> redirects to /admin/login
  const mfaNoAuth = await fetch(`${BASE_URL}/admin/mfa`, { redirect: "manual" });
  recordTest(
    "AUTH-12",
    "Accessing /admin/mfa unauthenticated redirects to /admin/login",
    mfaNoAuth.status === 307 && Boolean(mfaNoAuth.headers.get("location")?.includes("/admin/login")),
    { status: mfaNoAuth.status, location: mfaNoAuth.headers.get("location") }
  );

  // With cookies -> renders setup page (200 OK, no redirect loop)
  const mfaWithAuth = await fetch(`${BASE_URL}/admin/mfa`, {
    headers: { Cookie: cookieJar },
    redirect: "manual",
  });
  recordTest(
    "AUTH-13",
    "Accessing /admin/mfa authenticated renders setup view (200 OK, no redirect loop)",
    mfaWithAuth.status === 200,
    { status: mfaWithAuth.status }
  );

  // -------------------------------------------------------------------------
  // TEST 9: Admin Settings page reflection
  // -------------------------------------------------------------------------
  console.log("\n--- 9. Settings UI: Dynamic MFA Status Reflection ---");
  const settingsRes = await fetch(`${BASE_URL}/admin/settings`, {
    headers: { Cookie: cookieJar },
    redirect: "manual",
  });
  const settingsHtml = await settingsRes.text();
  const showsOptional = settingsHtml.includes("Optional / Standard");
  recordTest(
    "AUTH-14",
    "Settings page displays 'Optional / Standard' when MFA is not enforced",
    settingsRes.status === 200 && showsOptional,
    { status: settingsRes.status, showsOptional }
  );

  // -------------------------------------------------------------------------
  // FINAL SCORECARD
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`TOTAL AUDIT CHECKS: ${total}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`SUCCESS RATE: ${((passed / total) * 100).toFixed(1)}%`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runE2E().catch((err) => {
  console.error("FATAL ERROR IN E2E VERIFICATION:", err);
  process.exit(1);
});
