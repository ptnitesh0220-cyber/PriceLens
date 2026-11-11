import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, Zap, Sparkles, CheckCircle2 } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlash, setIsFlash] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setCaptured(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = newStream;
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setCameraError("Camera permission denied or camera unavailable on this device. You can use drag-and-drop file upload instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCaptured(dataUrl);
    }
  };

  const handleConfirmCaptured = () => {
    if (captured) {
      onCapture(captured);
      stopCamera();
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Lens Price Scanner</h3>
              <p className="text-[11px] text-slate-400">Position the product inside the frame</p>
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center max-w-md">
              <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-xs text-rose-400 mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Retry Camera Access
              </button>
            </div>
          ) : captured ? (
            <div className="relative w-full h-full">
              <img src={captured} alt="Captured product" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
                <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center gap-2 shadow-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Image Captured Successfully
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isFlash ? "brightness-125" : ""}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Lens Viewfinder Overlays */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-cyan-400/80 rounded-2xl relative shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse">
                  {/* Four Corner Lens Markers */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-cyan-400 rounded-tl-md"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-cyan-400 rounded-tr-md"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-cyan-400 rounded-bl-md"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-cyan-400 rounded-br-md"></div>

                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                      Target Product
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlash(!isFlash)}
              disabled={!!cameraError || !!captured}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                isFlash ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-slate-800 border-slate-700 text-slate-300"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Light</span>
            </button>

            <button
              onClick={toggleFacingMode}
              disabled={!!cameraError || !!captured}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Flip Camera</span>
            </button>
          </div>

          <div>
            {captured ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCaptured(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Retake Photo
                </button>
                <button
                  onClick={handleConfirmCaptured}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Product
                </button>
              </div>
            ) : (
              <button
                onClick={handleTakeSnap}
                disabled={!!cameraError}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 transition flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture Snap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
