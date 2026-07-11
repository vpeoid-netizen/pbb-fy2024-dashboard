import { NextResponse } from "next/server";
import { fetchRecentActivity } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activity = await fetchRecentActivity(10);
    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load recent activity." },
      { status: 500 },
    );
  }
}
