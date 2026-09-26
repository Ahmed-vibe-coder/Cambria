import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getPublicVerification } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limit: 10 requests per minute per IP for credential number searches
    const rateLimit = await checkRateLimit(ip, "verify-search", 10, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before attempting further verification searches.",
          retryAfter: rateLimit.reset,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.reset),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const credentialNumber = body.credentialNumber;

    if (!credentialNumber || typeof credentialNumber !== "string") {
      return NextResponse.json(
        { error: "Invalid credential number format." },
        { status: 400 }
      );
    }

    // Uniform timing-safe query
    const startTime = Date.now();
    const result = await getPublicVerification(credentialNumber);
    const elapsed = Date.now() - startTime;

    // Minimum delay pad to thwart timing attacks
    if (elapsed < 120) {
      await new Promise((r) => setTimeout(r, 120 - elapsed));
    }

    if (!result) {
      return NextResponse.json(
        { found: false, message: "No active or archived credential matches this identification number." },
        { status: 200 }
      );
    }

    return NextResponse.json({ found: true, credential: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during verification lookup." },
      { status: 500 }
    );
  }
}
