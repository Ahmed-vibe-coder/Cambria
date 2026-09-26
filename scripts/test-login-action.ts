import { loginAction } from "../src/actions/auth";

async function test() {
  const fd = new FormData();
  fd.append("email", "admin@cambria.edu");
  fd.append("password", "AdminPass123!");
  try {
    const res = await loginAction(null, fd);
    console.log("Result:", res);
  } catch (e: any) {
    console.log("Caught exception:");
    console.log("  message:", e?.message);
    console.log("  digest:", e?.digest);
  }
}

test().catch(console.error);
