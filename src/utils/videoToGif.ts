import GIF from "gif.js";

export async function convertVideoToGif(
  videoUrl: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  console.log("🎬 Starting video to GIF conversion...", videoUrl);

  // First fetch the video as blob to avoid any streaming issues
  const response = await fetch(videoUrl);
  const videoBlob = await response.blob();
  const blobUrl = URL.createObjectURL(videoBlob);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    // Wait for video to be fully loaded
    video.onloadeddata = async () => {
      console.log(
        "📹 Video loaded:",
        video.videoWidth,
        "x",
        video.videoHeight,
        "duration:",
        video.duration
      );

      if (video.videoWidth === 0 || video.videoHeight === 0 || !video.duration) {
        URL.revokeObjectURL(blobUrl);
        reject(new Error("Invalid video"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(blobUrl);
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Scale down for reasonable GIF size
      const maxSize = 400;
      const scale = Math.min(
        maxSize / video.videoWidth,
        maxSize / video.videoHeight,
        1
      );
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);

      console.log("🖼️ Canvas size:", canvas.width, "x", canvas.height);

      // Create GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: "/gif.worker.js",
      });

      gif.on("progress", (p: number) => {
        console.log("📊 GIF encoding progress:", Math.round(p * 100) + "%");
        onProgress?.(0.5 + p * 0.5); // 50-100% for encoding
      });

      gif.on("finished", (blob: Blob) => {
        console.log("✅ GIF finished! Size:", blob.size, "bytes");
        URL.revokeObjectURL(blobUrl);
        resolve(blob);
      });

      gif.on("error", (err: Error) => {
        console.error("❌ GIF error:", err);
        URL.revokeObjectURL(blobUrl);
        reject(err);
      });

      // Extract frames
      const fps = 10;
      const duration = Math.min(video.duration, 6); // Max 6 seconds
      const totalFrames = Math.floor(duration * fps);
      const frameDelay = Math.round(1000 / fps);

      console.log("🎞️ Extracting", totalFrames, "frames at", fps, "fps...");

      try {
        for (let i = 0; i < totalFrames; i++) {
          const targetTime = (i / fps);
          
          // Seek to time and wait
          await new Promise<void>((res, rej) => {
            const timeout = setTimeout(() => {
              console.warn("⚠️ Frame", i, "timeout, skipping...");
              res();
            }, 2000);

            const handleSeeked = () => {
              clearTimeout(timeout);
              video.removeEventListener("seeked", handleSeeked);
              
              // Draw frame to canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              gif.addFrame(ctx, { copy: true, delay: frameDelay });
              
              onProgress?.((i / totalFrames) * 0.5); // 0-50% for extraction
              res();
            };

            video.addEventListener("seeked", handleSeeked);
            video.currentTime = targetTime;
          });
        }

        console.log("🔧 All frames extracted, rendering GIF...");
        gif.render();
      } catch (err) {
        console.error("❌ Frame extraction error:", err);
        URL.revokeObjectURL(blobUrl);
        reject(err);
      }
    };

    video.onerror = (e) => {
      console.error("❌ Video load error:", e);
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to load video"));
    };

    video.src = blobUrl;
    video.load();
  });
}
