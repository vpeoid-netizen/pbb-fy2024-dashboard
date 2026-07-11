import { NextRequest, NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/dashboard-queries";
import { updateEligibilityAssessment } from "@/lib/requirement-mutations";
import { eligibilityPatchSchema, parseJsonBody } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchDashboardData();
    return NextResponse.json({
      eligibilityAssessment: data.eligibilityAssessment,
      eligibilityResult: data.eligibilityResult,
    });
  } catch (error) {
    console.error("Eligibility fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load eligibility assessment." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseJsonBody(eligibilityPatchSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await updateEligibilityAssessment(parsed.data);

    if (!result.success && result.conflict) {
      const data = await fetchDashboardData();
      return NextResponse.json(
        {
          error:
            "This assessment was updated by another user. The latest information has been loaded. Review it before saving again.",
          eligibilityAssessment: data.eligibilityAssessment,
          eligibilityResult: data.eligibilityResult,
        },
        { status: 409 },
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: "Unable to update eligibility." }, { status: 400 });
    }

    const data = await fetchDashboardData();
    return NextResponse.json({
      eligibilityAssessment: data.eligibilityAssessment,
      eligibilityResult: data.eligibilityResult,
    });
  } catch (error) {
    console.error("Eligibility update error:", error);
    return NextResponse.json(
      { error: "Unable to update eligibility assessment." },
      { status: 500 },
    );
  }
}
