import { createServiceRoleClient } from "./supabase/service";
import crypto from "crypto";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

// In-memory fallback map for sub-millisecond local caching / resilience
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const cacheKey = `${ipHash}:${endpoint}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // 1. Check in-memory fast window
  const memRecord = memoryStore.get(cacheKey);
  if (memRecord && memRecord.expiresAt > now) {
    if (memRecord.count >= maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: Math.ceil(memRecord.expiresAt / 1000),
      };
    }
    memRecord.count += 1;
    return {
      success: true,
      remaining: maxRequests - memRecord.count,
      reset: Math.ceil(memRecord.expiresAt / 1000),
    };
  }

  // Set fresh in-memory entry
  const expiresAt = now + windowMs;
  memoryStore.set(cacheKey, { count: 1, expiresAt });

  // 2. Synchronize with Supabase rate_limits table if reachable
  try {
    const supabase = createServiceRoleClient();
    const windowStart = new Date(now - windowMs).toISOString();

    const { data, error } = await supabase
      .from("rate_limits")
      .select("count, window_start")
      .eq("ip_hash", ipHash)
      .eq("endpoint", endpoint)
      .maybeSingle();

    if (!error && data) {
      const dbWindowStart = new Date(data.window_start).getTime();
      if (dbWindowStart > now - windowMs) {
        // Window still active
        const newCount = (data.count || 0) + 1;
        await supabase
          .from("rate_limits")
          .update({ count: newCount })
          .eq("ip_hash", ipHash)
          .eq("endpoint", endpoint);

        if (newCount > maxRequests) {
          return {
            success: false,
            remaining: 0,
            reset: Math.ceil((dbWindowStart + windowMs) / 1000),
          };
        }
        return {
          success: true,
          remaining: maxRequests - newCount,
          reset: Math.ceil((dbWindowStart + windowMs) / 1000),
        };
      }
    }

    // Reset window in DB
    await supabase.from("rate_limits").upsert({
      ip_hash: ipHash,
      endpoint: endpoint,
      count: 1,
      window_start: new Date(now).toISOString(),
    });
  } catch {
    // If DB is unreachable, memoryStore guarantees rate-limiting enforcement locally
  }

  return {
    success: true,
    remaining: maxRequests - 1,
    reset: Math.ceil(expiresAt / 1000),
  };
}
