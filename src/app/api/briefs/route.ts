import { NextResponse } from "next/server";
import { getBriefs, createBrief } from "@/lib/services/briefs";

export async function GET() {
  const result = await getBriefs();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createBrief(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, brief: result.brief },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API Briefs POST Error]", error);
    return NextResponse.json(
      {
        success: false,
        errors: { form: "Invalid request payload or server processing error." },
      },
      { status: 500 }
    );
  }
}
