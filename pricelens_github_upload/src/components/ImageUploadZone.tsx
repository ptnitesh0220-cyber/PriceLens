import React, { useState, useRef } from "react";
import { Upload, Camera, Sparkles, Image as ImageIcon, Zap, Check } from "lucide-react";

interface ImageUploadZoneProps {
  onImageSelected: (imageDataUrl: string) => void;
  onOpenCamera: () => void;
}

const SAMPLE_PRODUCTS = [
  {
    name: "Sony WH-1000XM5",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Air Jordan 1 High",
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Galaxy Watch 6",
    category: "Wearable",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Classic Denim Jacket",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "iPhone 15 Pro Max",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
  }
];

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageSelected,
  onOpenCamera
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Feature Main Card: Two Large Option Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Button 1: Upload Product Image Drag & Drop Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-3xl p-6 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden bg-slate-900/80 backdrop-blur-xl ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
              : "border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition"></div>

          <div className="relative w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 shadow-xl shadow-cyan-950/40">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            1. Upload Product Image
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-3">
            Drag & drop any product photo or click to browse files from your device.
          </p>

          <span className="px-3 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-cyan-400 border border-slate-700/60 group-hover:border-cyan-500/40 transition">
            Supports JPG, PNG, WEBP
          </span>
        </div>

        {/* Button 2: Take Photo Using Camera */}
        <div
          onClick={onOpenCamera}
          className="relative group cursor-pointer rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/60 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/80 backdrop-blur-xl hover:scale-[1.01]"
        >
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>

          <div className="relative w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition duration-300 shadow-xl shadow-cyan-500/25">
            <Camera className="w-7 h-7" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            2. Take Photo Using Camera
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-3">
            Use your phone or web camera to snap a live product item in front of you.
          </p>

          <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition duration-200">
            Open Live Camera Viewport
          </span>
        </div>
      </div>

      {/* Quick Test / Sample Products */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Or try with sample products:
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SAMPLE_PRODUCTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelected(sample.image)}
              className="group relative flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition text-left"
            >
              <img
                src={sample.image}
                alt={sample.name}
                className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition">
                  {sample.name}
                </p>
                <p className="text-[10px] text-slate-500">{sample.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
