import { NextResponse } from "next/server";
import { getBriefById, updateBrief } from "@/lib/services/briefs";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const result = await getBriefById(id);

  if (!result.data) {
    return NextResponse.json(
      { success: false, error: "Brief not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateBrief(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, brief: result.brief });
  } catch (error) {
    console.error("[API Briefs PUT Error]", error);
    return NextResponse.json(
      {
        success: false,
        errors: { form: "Server error occurred while updating the brief." },
      },
      { status: 500 }
    );
  }
}
