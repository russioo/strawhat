"use client";

import { useState, useRef, useCallback } from "react";

type GeneratorMode = "pfp" | "meme" | "gif";

export default function GeneratorSection() {
  const [mode, setMode] = useState<GeneratorMode>("pfp");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [resultGif, setResultGif] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setError("JPEG, PNG, or WebP only");
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError("Max 30MB");
      return;
    }
    setError("");
    setResultImage(null);
    setResultVideo(null);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const generateImage = async () => {
    if (mode !== "gif" && !uploadedImage) return;
    if ((mode === "meme" || mode === "gif") && !prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    setError("");
    setResultImage(null);
    setResultVideo(null);
    setStatus("Creating your masterpiece...");

    try {
      if (mode === "gif") {
        // GIF mode uses Grok Imagine
        const createResponse = await fetch("/api/generate-gif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt,
            image: uploadedImage || undefined
          }),
        });
        const createData = await createResponse.json();
        if (!createData.success) throw new Error(createData.error);
        
        const taskId = createData.taskId;
        setStatus("AI is generating video...");

        // Poll for result
        let videoUrl: string | null = null;
        let attempts = 0;
        while (attempts < 120) {
          await new Promise((r) => setTimeout(r, 3000));
          const statusResponse = await fetch(`/api/status?taskId=${taskId}&model=grok-imagine`);
          const statusData = await statusResponse.json();
          
          if (statusData.state === "success") {
            videoUrl = statusData.resultUrl;
            break;
          } else if (statusData.state === "fail") {
            throw new Error(statusData.error || "Generation failed");
          }
          attempts++;
        }
        if (attempts >= 120) throw new Error("Request timed out");
        if (!videoUrl) throw new Error("No video URL received");

        // Auto-convert to GIF
        setStatus("Converting to GIF...");
        const { convertVideoToGif } = await import("@/utils/videoToGif");
        const gifBlob = await convertVideoToGif(videoUrl, (progress) => {
          setConversionProgress(Math.round(progress * 100));
          setStatus(`Converting to GIF... ${Math.round(progress * 100)}%`);
        });
        
        const gifUrl = URL.createObjectURL(gifBlob);
        setResultGif(gifUrl);
        setResultVideo(videoUrl);
        setStatus("GIF ready!");
      } else {
        // PFP/Meme mode uses nano-banana-pro
        const createResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            image: uploadedImage,
            mode: mode,
            customPrompt: mode === "meme" ? prompt : undefined
          }),
        });
        const createData = await createResponse.json();
        if (!createData.success) throw new Error(createData.error);
        
        const taskId = createData.taskId;
        setStatus("AI is working its magic...");

        // Poll for result
        let attempts = 0;
        while (attempts < 60) {
          await new Promise((r) => setTimeout(r, 2000));
          const statusResponse = await fetch(`/api/status?taskId=${taskId}`);
          const statusData = await statusResponse.json();
          
          if (statusData.state === "success") {
            setResultImage(statusData.resultUrl);
            setStatus("Complete!");
            break;
          } else if (statusData.state === "fail") {
            throw new Error(statusData.error || "Generation failed");
          }
          attempts++;
        }
        if (attempts >= 60) throw new Error("Request timed out");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setUploadedImage(null);
    setResultImage(null);
    setResultVideo(null);
    setResultGif(null);
    setStatus("");
    setError("");
    setPrompt("");
    setConversionProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchMode = (newMode: GeneratorMode) => {
    setMode(newMode);
    setResultImage(null);
    setResultVideo(null);
    setResultGif(null);
    setConversionProgress(0);
    setStatus("");
    setError("");
  };

  return (
    <section id="generator" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#d4a012]" />
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#d4a012]">Create</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#d4a012]" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-[#f5f0e6] tracking-wide mb-4">
            Straw Hat <span className="text-gradient">Generator</span>
          </h2>
          <p className="font-sans text-sm text-[#6b7280]">
            Transform your images with AI
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center mb-10 reveal">
          <div className="inline-flex gap-1 p-1 bg-[#111822] border border-[#1a2535] rounded-lg">
            <button
              onClick={() => switchMode("pfp")}
              className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium rounded-md transition-all duration-200 ${
                mode === "pfp"
                  ? "bg-[#d4a012] text-[#020408]"
                  : "text-[#6b7280] hover:text-[#f5f0e6]"
              }`}
            >
              PFP
            </button>
            <button
              onClick={() => switchMode("meme")}
              className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium rounded-md transition-all duration-200 ${
                mode === "meme"
                  ? "bg-[#d4a012] text-[#020408]"
                  : "text-[#6b7280] hover:text-[#f5f0e6]"
              }`}
            >
              Meme
            </button>
            <button
              onClick={() => switchMode("gif")}
              className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium rounded-md transition-all duration-200 ${
                mode === "gif"
                  ? "bg-[#d4a012] text-[#020408]"
                  : "text-[#6b7280] hover:text-[#f5f0e6]"
              }`}
            >
              GIF
            </button>
          </div>
        </div>

        {/* Mode description */}
        <div className="text-center mb-8">
          <p className="font-display text-lg italic text-[#8a9bb0]">
            {mode === "pfp" && "Upload your photo to get the iconic Straw Hat"}
            {mode === "meme" && "Upload image + describe your meme idea"}
            {mode === "gif" && "Describe a scene, or upload an image to animate"}
          </p>
        </div>

        {/* GIF Mode */}
        {mode === "gif" ? (
          <div className="max-w-2xl mx-auto">
            {/* Optional image upload for GIF */}
            <div className="mb-6">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#d4a012] mb-3">
                Reference Image (Optional)
              </label>
              {uploadedImage ? (
                <div className="flex items-center gap-4 p-4 bg-[#0a0e14]/50 border border-[#d4a012]/15 rounded-xl">
                  <img src={uploadedImage} alt="Reference" className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="font-sans text-sm text-[#f5f0e6]">Image uploaded</p>
                    <p className="font-sans text-xs text-[#6b7280]">Will animate this image</p>
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase text-[#6b7280] border border-[#2a3545] rounded-lg hover:border-[#3a4555] hover:text-[#f5f0e6] transition-all"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  className={`
                    cursor-pointer p-4 rounded-xl border border-dashed transition-all
                    ${isDragOver 
                      ? "border-[#d4a012] bg-[#d4a012]/5" 
                      : "border-[#d4a012]/15 hover:border-[#d4a012]/35 bg-[#0a0e14]/30"
                    }
                  `}
                >
                  <p className="font-sans text-sm text-center text-[#6b7280]">
                    Drop image or <span className="text-[#d4a012]">browse</span> (optional)
                  </p>
                </div>
              )}
            </div>

            {/* Prompt input */}
            <div className="mb-8">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#d4a012] mb-3">
                Animation Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={uploadedImage 
                  ? "e.g., 'Make the character wave' or 'Add wind blowing through hair'"
                  : "e.g., 'Luffy throwing a punch with his straw hat flying off'"
                }
                className="w-full px-5 py-4 bg-[#0a0e14]/50 border border-[#d4a012]/15 rounded-xl text-[#f5f0e6] placeholder-[#6b7280] font-sans text-sm focus:outline-none focus:border-[#d4a012]/40 transition-colors resize-none"
                rows={3}
              />
            </div>

            {/* Result preview */}
            <div className="rounded-xl overflow-hidden bg-[#0a0e14]/40 border border-[#d4a012]/10 mb-8">
              <div className="px-4 py-3 border-b border-[#d4a012]/10">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8a9bb0]">
                  {resultGif ? "GIF Ready" : "Result"}
                </span>
              </div>
              <div className="aspect-video flex items-center justify-center">
                {resultGif ? (
                  <img 
                    src={resultGif} 
                    alt="Generated GIF"
                    className="w-full h-full object-contain"
                  />
                ) : isGenerating ? (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 border-2 border-[#d4a012]/30 border-t-[#d4a012] rounded-full spinner" />
                    <p className="font-sans text-sm text-[#8a9bb0]">{status}</p>
                    {conversionProgress > 0 && (
                      <div className="mt-3 w-48 mx-auto bg-[#1a2535] rounded-full h-1.5">
                        <div 
                          className="bg-[#d4a012] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${conversionProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-dashed border-[#d4a012]/15 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#d4a012]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <p className="font-sans text-xs text-[#6b7280]">Enter a prompt and generate</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={reset}
                className="px-5 py-2.5 text-[11px] tracking-[0.05em] uppercase text-[#6b7280] border border-[#2a3545] rounded-lg hover:border-[#3a4555] hover:text-[#f5f0e6] transition-all duration-200"
              >
                Reset
              </button>
              {!resultGif && (
                <button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className={`px-8 py-2.5 text-[11px] tracking-[0.05em] uppercase font-medium rounded-lg transition-all duration-200 ${
                    isGenerating || !prompt.trim()
                      ? "bg-[#2a3545] text-[#4a5565] cursor-not-allowed"
                      : "bg-[#d4a012] text-[#020408] hover:bg-[#e0b020]"
                  }`}
                >
                  {isGenerating ? "Generating..." : "Generate GIF"}
                </button>
              )}
              {resultGif && (
                <a
                  href={resultGif}
                  download="strawhat-animation.gif"
                  className="px-6 py-2.5 text-[11px] tracking-[0.05em] uppercase font-medium bg-[#d4a012] text-[#020408] rounded-lg hover:bg-[#e0b020] transition-all duration-200"
                >
                  Download GIF
                </a>
              )}
            </div>

            {/* Status/Error */}
            {(status && !isGenerating) || error ? (
              <p className={`mt-6 text-center font-sans text-sm ${error ? 'text-red-400' : 'text-[#d4a012]'}`}>
                {error || status}
              </p>
            ) : null}
          </div>
        ) : !uploadedImage ? (
          /* Upload Zone for PFP/Meme */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            className={`
              relative cursor-pointer rounded-2xl transition-all duration-500 aspect-[16/9] max-w-2xl mx-auto
              flex items-center justify-center border-2 border-dashed
              ${isDragOver 
                ? "border-[#d4a012] bg-[#d4a012]/5 scale-[1.01]" 
                : "border-[#d4a012]/15 hover:border-[#d4a012]/35 bg-[#0a0e14]/30"
              }
            `}
          >
            <div className="relative text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#d4a012]/15 to-transparent flex items-center justify-center border border-[#d4a012]/15">
                <svg className="w-8 h-8 text-[#d4a012]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="font-sans text-base text-[#8a9bb0] mb-2">
                Drop image or <span className="text-[#d4a012]">browse</span>
              </p>
              <p className="font-sans text-xs text-[#6b7280]">
                JPEG, PNG, WebP
              </p>
            </div>
          </div>
        ) : (
          /* Editing View for PFP/Meme */
          <div className="max-w-4xl mx-auto">
            {/* Meme prompt input */}
            {mode === "meme" && (
              <div className="mb-8">
                <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#d4a012] mb-3">
                  Your Creative Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Make it look like Luffy eating meat' or 'Add dramatic One Piece anime effects'"
                  className="w-full px-5 py-4 bg-[#0a0e14]/50 border border-[#d4a012]/15 rounded-xl text-[#f5f0e6] placeholder-[#6b7280] font-sans text-sm focus:outline-none focus:border-[#d4a012]/40 transition-colors resize-none"
                  rows={2}
                />
              </div>
            )}

            {/* Image preview grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Original */}
              <div className="rounded-xl overflow-hidden bg-[#0a0e14]/40 border border-[#d4a012]/10">
                <div className="px-4 py-3 border-b border-[#d4a012]/10 flex items-center justify-between">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8a9bb0]">Original</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] tracking-[0.1em] uppercase text-[#d4a012] hover:text-[#f0c848] transition-colors"
                  >
                    Change
                  </button>
                </div>
                <div className="aspect-square">
                  <img src={uploadedImage} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Result */}
              <div className="rounded-xl overflow-hidden bg-[#0a0e14]/40 border border-[#d4a012]/10">
                <div className="px-4 py-3 border-b border-[#d4a012]/10">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8a9bb0]">
                    {mode === "pfp" ? "With Hat" : "Meme"}
                  </span>
                </div>
                <div className="aspect-square flex items-center justify-center">
                  {resultImage ? (
                    <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                  ) : isGenerating ? (
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-3 border-2 border-[#d4a012]/30 border-t-[#d4a012] rounded-full spinner" />
                      <p className="font-sans text-sm text-[#8a9bb0]">{status}</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-dashed border-[#d4a012]/15 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#d4a012]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <p className="font-sans text-xs text-[#6b7280]">Ready</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={reset}
                className="px-5 py-2.5 text-[11px] tracking-[0.05em] uppercase text-[#6b7280] border border-[#2a3545] rounded-lg hover:border-[#3a4555] hover:text-[#f5f0e6] transition-all duration-200"
              >
                Reset
              </button>
              <button
                onClick={generateImage}
                disabled={isGenerating || (mode === "meme" && !prompt.trim())}
                className={`px-8 py-2.5 text-[11px] tracking-[0.05em] uppercase font-medium rounded-lg transition-all duration-200 ${
                  isGenerating || (mode === "meme" && !prompt.trim())
                    ? "bg-[#2a3545] text-[#4a5565] cursor-not-allowed"
                    : "bg-[#d4a012] text-[#020408] hover:bg-[#e0b020]"
                }`}
              >
                {isGenerating ? "Processing..." : "Generate"}
              </button>
              {resultImage && (
                <a
                  href={resultImage}
                  download={mode === "pfp" ? "strawhat-pfp.png" : "strawhat-meme.png"}
                  className="px-5 py-2.5 text-[11px] tracking-[0.05em] uppercase text-[#d4a012] border border-[#d4a012]/30 rounded-lg hover:bg-[#d4a012] hover:text-[#020408] transition-all duration-200"
                >
                  Download
                </a>
              )}
            </div>

            {/* Status/Error */}
            {(status && !isGenerating) || error ? (
              <p className={`mt-6 text-center font-sans text-sm ${error ? 'text-red-400' : 'text-[#d4a012]'}`}>
                {error || status}
              </p>
            ) : null}
          </div>
        )}

        {/* Hidden file input - available for all modes */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
      </div>
    </section>
  );
}
