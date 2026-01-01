import GIF from "gif.js";

export async function convertVideoToGif(
  videoUrl: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
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
        resolve(blob);
      });

      // Extract frames from video
      const fps = 10; // 10 frames per second
      const duration = Math.min(video.duration, 8); // Max 8 seconds
      const frameCount = Math.floor(duration * fps);
      const frameDelay = 1000 / fps;

      for (let i = 0; i < frameCount; i++) {
        const time = (i / fps);
        video.currentTime = time;

        await new Promise<void>((res) => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            gif.addFrame(ctx, { copy: true, delay: frameDelay });
            res();
          };
        });
      }

      gif.render();
    };

    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };

    video.src = videoUrl;
    video.load();
  });
}

