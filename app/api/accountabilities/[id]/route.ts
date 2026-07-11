import { NextRequest, NextResponse } from "next/server";
import { accountabilityExists, fetchAccountabilities } from "@/lib/dashboard-queries";
import { updateAccountabilityAssessment } from "@/lib/requirement-mutations";
import {
  accountabilityIdSchema,
  accountabilityPatchSchema,
  parseJsonBody,
} from "@/lib/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const idResult = accountabilityIdSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json({ error: "Invalid accountability ID." }, { status: 400 });
    }

    const exists = await accountabilityExists(idResult.data);
    if (!exists) {
      return NextResponse.json({ error: "Accountability not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseJsonBody(accountabilityPatchSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await updateAccountabilityAssessment({
      accountabilityId: idResult.data,
      ...parsed.data,
    });

    if (!result.success && result.conflict) {
      const accountabilities = await fetchAccountabilities();
      const accountability = accountabilities.find(
        (a) => a.accountabilityId === idResult.data,
      );
      return NextResponse.json(
        {
          error:
            "This assessment was updated by another user. The latest information has been loaded. Review it before saving again.",
          accountability,
        },
        { status: 409 },
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: "Unable to update accountability." }, { status: 400 });
    }

    const accountabilities = await fetchAccountabilities();
    const accountability = accountabilities.find(
      (a) => a.accountabilityId === idResult.data,
    );

    return NextResponse.json({ accountability });
  } catch (error) {
    console.error("Accountability update error:", error);
    return NextResponse.json(
      { error: "Unable to update accountability assessment." },
      { status: 500 },
    );
  }
}
