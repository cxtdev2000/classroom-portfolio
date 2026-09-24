import { NextRequest, NextResponse } from "next/server";
import { getTrafficStats, recordVisit, resetTrafficStats } from "@/lib/traffic";

export const dynamic = "force-dynamic";

function extractClientIp(req: NextRequest): string {
  // Netlify edge client IP header
  const netlifyIp = req.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();

  // Standard reverse proxy forwarded header
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

export async function GET() {
  const stats = await getTrafficStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      path?: string;
      referer?: string;
    };

    const visitPath = body.path || "/";

    // Do NOT count visits to the count / stats dashboard
    if (visitPath.startsWith("/count") || visitPath.startsWith("/api")) {
      const stats = await getTrafficStats();
      return NextResponse.json(stats);
    }

    const ip = extractClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";
    const referer = body.referer || req.headers.get("referer") || "";

    const stats = await recordVisit(ip, userAgent, referer, visitPath);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Traffic recording error:", error);
    return NextResponse.json({ error: "Failed to record traffic" }, { status: 500 });
  }
}

export async function DELETE() {
  const stats = await resetTrafficStats();
  return NextResponse.json({ ok: true, stats });
}
