import { NextRequest, NextResponse } from "next/server";

const KIE_API_KEY = process.env.KIE_API_KEY || "";
const KIE_API_URL = "https://api.kie.ai/api/v1/jobs/createTask";

// Base prompt for One Piece straw hat GIF
const BASE_PROMPT = `Create a smooth looping GIF in the exact official One Piece anime style by Eiichiro Oda and Toei Animation: clean thick black outlines, vibrant cel-shading, high contrast, dynamic anime lighting, dramatic expressions, speed lines and impact effects when needed. The central focus is always Monkey D. Luffy's iconic straw hat – precisely accurate design: bright golden-yellow woven straw with visible textured strands, slight wear and frayed edges, wide brim gently curved upward, thick vibrant red ribbon band tied around the base with the ends hanging down exactly like in the anime. The straw hat must be prominently visible and perfectly detailed in every frame.

Scene: `;

const PROMPT_SUFFIX = `

Camera: dynamic cinematic anime shots, smooth panning or subtle rotation around the straw hat for emphasis, dramatic angles, occasional slow-motion for impact. Background in classic One Piece aesthetic with bold colors, sea, sky, ships or ancient ruins if it fits. Energetic and adventurous mood, epic yet fun atmosphere. Seamless loop optimized for GIF, 4-8 seconds long, high resolution, masterpiece anime quality.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "No prompt provided" },
        { status: 400 }
      );
    }

    if (!KIE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build the full prompt
    const fullPrompt = `${BASE_PROMPT}${prompt}${PROMPT_SUFFIX}`;

    console.log("GIF Generation - Prompt:", fullPrompt);

    const response = await fetch(KIE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-imagine/text-to-video",
        input: {
          prompt: fullPrompt,
          aspect_ratio: "1:1",
          mode: "normal",
        },
      }),
    });

    const data = await response.json();
    
    console.log("Grok Imagine API Response:", JSON.stringify(data, null, 2));

    if (data.code !== 200) {
      console.error("Grok Imagine API Error:", data);
      return NextResponse.json(
        { success: false, error: data.message || data.msg || "API Error" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      taskId: data.data.taskId,
    });
  } catch (error) {
    console.error("Generate GIF error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

