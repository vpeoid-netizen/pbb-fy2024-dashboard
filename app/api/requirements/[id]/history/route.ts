import { NextRequest, NextResponse } from "next/server";
import { fetchRequirementHistory, requirementExists } from "@/lib/dashboard-queries";
import { requirementIdSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

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

    const history = await fetchRequirementHistory(idResult.data);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Unable to load update history." },
      { status: 500 },
    );
  }
}
