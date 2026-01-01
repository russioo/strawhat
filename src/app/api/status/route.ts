import { NextRequest, NextResponse } from "next/server";

const KIE_API_KEY = process.env.KIE_API_KEY || "";
const KIE_STATUS_URL = "https://api.kie.ai/api/v1/jobs/recordInfo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "No task ID provided" },
        { status: 400 }
      );
    }

    if (!KIE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${KIE_STATUS_URL}?taskId=${taskId}`, {
      headers: {
        Authorization: `Bearer ${KIE_API_KEY}`,
      },
    });

    const data = await response.json();

    if (data.code !== 200) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to check status" },
        { status: 400 }
      );
    }

    const { state, resultJson, failMsg } = data.data;

    console.log("Status check result:", JSON.stringify(data.data, null, 2));

    let resultUrl = null;
    if (state === "success" && resultJson) {
      try {
        const result = JSON.parse(resultJson);
        // Handle both image and video outputs
        resultUrl = result.resultUrls?.[0] || result.video_url || result.url || null;
      } catch {
        // JSON parse error
      }
    }

    return NextResponse.json({
      success: true,
      state,
      resultUrl,
      error: failMsg || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

