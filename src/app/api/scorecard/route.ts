import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/auth";
import { generateScorecard } from "@/lib/scorecard-engine";
import { scorecardInputSchema, scorecardResultSchema } from "@/lib/scorecard-schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedInput = scorecardInputSchema.safeParse(json);

    if (!parsedInput.success) {
      return NextResponse.json(
        { error: "The scorecard input is incomplete or invalid." },
        { status: 400 }
      );
    }

    const viewer = await getViewerContext(parsedInput.data.experienceId);

    if (!viewer || viewer.accessLevel === "no_access") {
      return NextResponse.json(
        { error: "You do not have access to this tool." },
        { status: 403 }
      );
    }

    const result = generateScorecard(parsedInput.data, viewer.tier);
    const parsedResult = scorecardResultSchema.safeParse(result);

    if (!parsedResult.success) {
      return NextResponse.json(
        { error: "The scorecard output did not pass validation." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsedResult.data });
  } catch {
    return NextResponse.json(
      {
        error:
          "The scorecard could not be generated. Try again with more specific workflow detail.",
      },
      { status: 500 }
    );
  }
}
