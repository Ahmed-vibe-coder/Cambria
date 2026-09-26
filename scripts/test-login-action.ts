import { loginAction } from "../src/actions/auth";

async function test() {
  const fdOld = new FormData();
  fdOld.append("email", "admin@cambria.edu");
  fdOld.append("password", "old-revoked-pass");
  const resOld = await loginAction(null, fdOld);
  console.log("Old password rejection test:", resOld);

  const fdNew = new FormData();
  fdNew.append("email", "admin@cambria.edu");
  fdNew.append("password", "jnHNd9gd7kx4D4G4NU91Kqx1vsUt9-KH#K9");
  try {
    const res = await loginAction(null, fdNew);
    console.log("New password result:", res);
  } catch (e: any) {
    console.log("Redirected to MFA as expected:", e?.digest);
  }
}

test().catch(console.error);
