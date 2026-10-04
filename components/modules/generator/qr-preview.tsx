"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import { useQRStore } from "@/lib/store/use-qr-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db/indexed-db";
import { QRProject } from "@/lib/types/qr";

export function QRPreview() {
  const { content, design, contentType } = useQRStore();
  const ref = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    // Initialize or update QR Code
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: design.width,
        height: design.height,
        data: content || "https://smartqr.studio",
        margin: design.margin,
        qrOptions: {
          errorCorrectionLevel: design.errorCorrection,
        },
        image: design.logo || undefined,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: design.logoMargin || 0,
        },
        dotsOptions: {
          type: design.dotStyle as DotType,
          color: design.foreground,
          gradient: design.gradient?.enabled ? {
            type: "linear",
            rotation: design.gradient.rotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: design.gradient.start },
              { offset: 1, color: design.gradient.end }
            ]
          } : undefined
        },
        backgroundOptions: {
          color: design.background,
        },
        cornersSquareOptions: {
          type: design.cornerSquareStyle as CornerSquareType,
          color: design.foreground,
        },
        cornersDotOptions: {
          type: design.cornerDotStyle as CornerDotType,
          color: design.foreground,
        },
      });
      
      if (ref.current) {
        qrCodeRef.current.append(ref.current);
      }
    } else {
      qrCodeRef.current.update({
        data: content || "https://smartqr.studio",
        width: design.width,
        height: design.height,
        margin: design.margin,
        image: design.logo || undefined,
        qrOptions: {
          errorCorrectionLevel: design.errorCorrection,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: design.logoMargin || 0,
        },
        dotsOptions: {
          type: design.dotStyle as DotType,
          color: design.foreground,
          gradient: design.gradient?.enabled ? {
            type: "linear",
            rotation: design.gradient.rotation * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: design.gradient.start },
              { offset: 1, color: design.gradient.end }
            ]
          } : undefined
        },
        backgroundOptions: {
          color: design.background,
        },
        cornersSquareOptions: {
          type: design.cornerSquareStyle as CornerSquareType,
          color: design.foreground,
        },
        cornersDotOptions: {
          type: design.cornerDotStyle as CornerDotType,
          color: design.foreground,
        },
      });

      // Log generate event silently in background
      db.analytics.add({
        type: "generate",
        timestamp: new Date().toISOString(),
      }).catch(console.error);

    }
  }, [content, design]);

  const handleDownload = async (ext: "png" | "jpeg" | "svg") => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: `smartqr-${Date.now()}`, extension: ext });
      toast.success(`Downloaded as ${ext.toUpperCase()}`);
      try {
        await db.analytics.add({
          type: "download",
          timestamp: new Date().toISOString(),
          metadata: { format: ext }
        });
      } catch (err) {
        console.error("Failed to log download", err);
      }
    }
  };

  const handleSaveProject = async () => {
    try {
      const project: QRProject = {
        id: Date.now().toString(),
        name: `QR Code ${new Date().toLocaleDateString()}`,
        description: "",
        type: contentType,
        content: content || "https://smartqr.studio",
        design,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: [],
        isFavorite: false
      };
      await db.projects.put(project);
      toast.success("Saved to your Projects library!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save project");
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="relative bg-white rounded-lg p-4 shadow-sm border overflow-hidden flex items-center justify-center min-h-[350px] w-full max-w-[350px]">
          <div ref={ref} className="qr-container" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 w-full max-w-[350px]">
          <Button variant="outline" onClick={() => handleDownload("png")} className="w-full">
            <Download className="mr-2 h-4 w-4" /> PNG
          </Button>
          <Button variant="outline" onClick={() => handleDownload("svg")} className="w-full">
            <Download className="mr-2 h-4 w-4" /> SVG
          </Button>
          <Button variant="secondary" className="col-span-2" onClick={handleSaveProject}>
            <Save className="mr-2 h-4 w-4" /> Save to Projects
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
