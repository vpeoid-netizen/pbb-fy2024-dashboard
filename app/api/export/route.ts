import { NextRequest, NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/dashboard-queries";
import { buildCsvExport, buildJsonExport } from "@/lib/export";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") ?? "json";
    const data = await fetchDashboardData();

    if (format === "csv") {
      const csv = buildCsvExport(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="pbb-fy2024-monitoring-export.csv"',
        },
      });
    }

    const json = buildJsonExport(data);
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="pbb-fy2024-monitoring-export.json"',
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Unable to export monitoring data." },
      { status: 500 },
    );
  }
}
