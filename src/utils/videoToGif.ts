import GIF from "gif.js";

export async function convertVideoToGif(
  videoUrl: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    console.log("Starting video to GIF conversion...", videoUrl);
    
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    let resolved = false;

    video.onloadedmetadata = async () => {
      console.log("Video metadata loaded:", video.videoWidth, "x", video.videoHeight, "duration:", video.duration);
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        reject(new Error("Invalid video dimensions"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas size (max 480px for reasonable GIF size)
      const maxSize = 480;
      const scale = Math.min(maxSize / video.videoWidth, maxSize / video.videoHeight);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);

      console.log("Canvas size:", canvas.width, "x", canvas.height);

      // Create GIF encoder
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: "/gif.worker.js",
      });

      gif.on("progress", (p: number) => {
        onProgress?.(p);
      });

      gif.on("finished", (blob: Blob) => {
        console.log("GIF finished, size:", blob.size);
        resolved = true;
        resolve(blob);
      });

      gif.on("error", (err: Error) => {
        console.error("GIF error:", err);
        reject(err);
      });

      // Extract frames from video
      const fps = 10;
      const duration = Math.min(video.duration, 8);
      const frameCount = Math.floor(duration * fps);
      const frameDelay = 1000 / fps;

      console.log("Extracting", frameCount, "frames...");

      try {
        for (let i = 0; i < frameCount; i++) {
          const time = i / fps;
          video.currentTime = time;

          await new Promise<void>((res, rej) => {
            const timeout = setTimeout(() => {
              rej(new Error("Frame extraction timeout"));
            }, 5000);

            video.onseeked = () => {
              clearTimeout(timeout);
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              gif.addFrame(ctx, { copy: true, delay: frameDelay });
              res();
            };
          });
        }

        console.log("Rendering GIF...");
        gif.render();
      } catch (err) {
        console.error("Frame extraction error:", err);
        reject(err);
      }
    };

    video.onerror = (e) => {
      console.error("Video load error:", e);
      reject(new Error("Failed to load video"));
    };

    video.oncanplay = () => {
      console.log("Video can play");
    };

    video.src = videoUrl;
    video.load();

    // Timeout for entire operation
    setTimeout(() => {
      if (!resolved) {
        reject(new Error("GIF conversion timed out"));
      }
    }, 120000);
  });
}
