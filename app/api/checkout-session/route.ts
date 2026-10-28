import { NextRequest, NextResponse } from "next/server";
import { verifyCheckoutSession } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id") || undefined;
    const result = await verifyCheckoutSession(sessionId);

    return NextResponse.json(result, {
      status: result.status === "error" ? 500 : 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        verified: false,
        status: "error",
        errorMessage: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
