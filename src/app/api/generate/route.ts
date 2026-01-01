import { NextRequest, NextResponse } from "next/server";

const KIE_API_KEY = process.env.KIE_API_KEY || "";
const KIE_API_URL = "https://api.kie.ai/api/v1/jobs/createTask";
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "";

// Base prompts for different modes
const BASE_PROMPTS = {
  pfp: "Add the iconic One Piece straw hat (Luffy's mugiwara hat with red ribbon band) on top of the head. Keep everything else unchanged.",
  meme: "Add the iconic One Piece straw hat (Luffy's mugiwara hat with red ribbon band) to this image. "
};

async function uploadToImgBB(base64Image: string): Promise<string> {
  // Remove the data URL prefix to get pure base64
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  // Use URLSearchParams for form data (works in Node.js)
  const params = new URLSearchParams();
  params.append("key", IMGBB_API_KEY);
  params.append("image", base64Data);
  
  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  
  const data = await response.json();
  
  console.log("ImgBB response:", JSON.stringify(data, null, 2));
  
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to upload image");
  }
  
  return data.data.url;
}

export async function POST(request: NextRequest) {
  try {
    const { image, mode = "pfp", customPrompt } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!KIE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build the prompt based on mode
    let finalPrompt: string;
    
    if (mode === "meme" && customPrompt) {
      finalPrompt = `${BASE_PROMPTS.meme}${customPrompt}`;
    } else {
      finalPrompt = BASE_PROMPTS.pfp;
    }

    // Upload image to get URL
    let imageUrl: string;
    
    if (!IMGBB_API_KEY) {
      return NextResponse.json(
        { success: false, error: "IMGBB_API_KEY not configured in .env.local" },
        { status: 500 }
      );
    }
    
    if (image.startsWith("data:")) {
      console.log("Uploading to ImgBB...");
      try {
        imageUrl = await uploadToImgBB(image);
        console.log("Uploaded to:", imageUrl);
      } catch (uploadError) {
        console.error("ImgBB upload failed:", uploadError);
        return NextResponse.json(
          { success: false, error: "Failed to upload image. Check IMGBB_API_KEY." },
          { status: 500 }
        );
      }
    } else {
      imageUrl = image;
    }

    console.log("Mode:", mode);
    console.log("Prompt:", finalPrompt);

    const response = await fetch(KIE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "nano-banana-pro",
        input: {
          prompt: finalPrompt,
          image_input: [imageUrl],
          aspect_ratio: "1:1",
          resolution: "1K",
          output_format: "png",
        },
      }),
    });

    const data = await response.json();
    
    console.log("KIE API Response:", JSON.stringify(data, null, 2));

    if (data.code !== 200) {
      console.error("KIE API Error:", data);
      return NextResponse.json(
        { success: false, error: data.message || data.msg || `API Error: ${JSON.stringify(data)}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      taskId: data.data.taskId,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
