import { loginAction } from "../src/actions/auth";

async function test() {
  const fdOld = new FormData();
  fdOld.append("email", "admin@cambria.edu");
  fdOld.append("password", "AdminPass123!");
  const resOld = await loginAction(null, fdOld);
  console.log("Old password rejection test (AdminPass123!):", resOld);

  const fdNew = new FormData();
  fdNew.append("email", "admin@cambria.edu");
  fdNew.append("password", "Cambria@Admin2026!");
  fdNew.append("rememberMe", "true");
  try {
    const res = await loginAction(null, fdNew);
    console.log("New password result:", res);
  } catch (e: any) {
    console.log("Redirected to MFA as expected:", e?.digest);
  }
}

test().catch(console.error);
