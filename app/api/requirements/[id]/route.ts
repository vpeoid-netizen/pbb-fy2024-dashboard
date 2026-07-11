import { NextRequest, NextResponse } from "next/server";
import {
  fetchDashboardData,
  requirementExists,
} from "@/lib/dashboard-queries";
import { updateRequirementMonitoring } from "@/lib/requirement-mutations";
import {
  parseJsonBody,
  requirementIdSchema,
  requirementPatchSchema,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const idResult = requirementIdSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json({ error: "Invalid requirement ID." }, { status: 400 });
    }

    const exists = await requirementExists(idResult.data);
    if (!exists) {
      return NextResponse.json({ error: "Requirement not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseJsonBody(requirementPatchSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await updateRequirementMonitoring({
      requirementId: idResult.data,
      ...parsed.data,
    });

    if (!result.success && result.conflict) {
      const dashboard = await fetchDashboardData();
      const requirement = dashboard.requirements.find((r) => r.id === idResult.data);
      return NextResponse.json(
        {
          error:
            "This requirement was updated by another user. The latest information has been loaded. Review it before saving again.",
          requirement,
          summary: dashboard.summary,
        },
        { status: 409 },
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      requirement: result.requirement,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Requirement update error:", error);
    return NextResponse.json(
      { error: "Unable to update requirement." },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const idResult = requirementIdSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json({ error: "Invalid requirement ID." }, { status: 400 });
    }

    const exists = await requirementExists(idResult.data);
    if (!exists) {
      return NextResponse.json({ error: "Requirement not found." }, { status: 404 });
    }

    const dashboard = await fetchDashboardData();
    const requirement = dashboard.requirements.find((r) => r.id === idResult.data);

    return NextResponse.json({ requirement, summary: dashboard.summary });
  } catch (error) {
    console.error("Requirement fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load requirement." },
      { status: 500 },
    );
  }
}
