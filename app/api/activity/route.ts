import { NextRequest, NextResponse } from "next/server";
import { fetchRecentActivity } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(Number(limitParam), 1), 200) : 5;
    const activity = await fetchRecentActivity(limit);
    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load recent activity." },
      { status: 500 },
    );
  }
}
