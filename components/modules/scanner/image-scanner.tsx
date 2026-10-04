"use client";

import { useState, useRef } from "react";
import jsQR from "jsqr";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

export function ImageScanner({ onResult }: { onResult: (text: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setPreview(src);
      decodeImage(src);
    };
    reader.readAsDataURL(file);
  };

  const decodeImage = (src: string) => {
    setError("");
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        setError("Failed to initialize canvas context.");
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        onResult(code.data);
        toast.success("QR Code Decoded successfully!");
      } else {
        setError("No valid QR code found in this image.");
        toast.error("Decoding failed");
      }
    };
    img.onerror = () => {
      setError("Failed to load image.");
    };
    img.src = src;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div 
          className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileUpload}
          />
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">Upload QR Image</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports PNG, JPG, JPEG, WebP
          </p>
        </div>

        {preview && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/20 flex flex-col items-center">
            <p className="text-sm font-medium mb-3 w-full text-left">Uploaded Image:</p>
            <div className="relative bg-white p-2 rounded border max-w-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="QR Preview" className="max-w-full h-auto" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
