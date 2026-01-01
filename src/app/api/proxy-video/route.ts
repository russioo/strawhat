import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: "No URL provided" },
        { status: 400 }
      );
    }

    // Fetch the video
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch video" },
        { status: 500 }
      );
    }

    const videoBuffer = await response.arrayBuffer();

    // Return the video with proper headers
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy video error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

