import { NextRequest, NextResponse } from "next/server";
import {
  generateStructuredBrief,
  type GeneratorOptions,
} from "@/lib/ai/brief-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "A campaign idea or prompt is required.",
        },
        { status: 400 }
      );
    }

    // Support simulation modes for testing API error / malformed responses
    const simHeader = req.headers.get("x-simulation-mode") as GeneratorOptions["simulationMode"];
    const simQuery = req.nextUrl.searchParams.get("simulationMode") as GeneratorOptions["simulationMode"];
    const simulationMode = simHeader || simQuery || undefined;

    const result = await generateStructuredBrief(prompt, {
      simulationMode,
      timeoutMs: 6000,
    });

    if (!result.success) {
      const status =
        simulationMode === "api_error" || result.error?.includes("503")
          ? 503
          : 400;

      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to generate brief draft.",
          errors: result.errors,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        draft: result.draft,
        isFallback: result.isFallback,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[API briefs/generate] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while generating brief.",
      },
      { status: 500 }
    );
  }
}
