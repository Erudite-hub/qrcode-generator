"use client";
import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import QRCodeStyling from "qr-code-styling";

export interface QRCodeCanvasRef {
  download: () => void;
  share: () => void;
}

interface QRCodeCanvasProps {
  data: string;
  dotColor: string;
  dotType: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  bgColor: string;
  logoUrl: string;
  width?: number;
  height?: number;
}

const QRCodeCanvas = forwardRef<QRCodeCanvasRef, QRCodeCanvasProps>(
  ({ data, dotColor, dotType, bgColor, logoUrl, width = 200, height = 200 }, ref) => {
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling | null>(null);

    // Initialize QRCodeStyling on mount
    useEffect(() => {
      qrCodeInstance.current = new QRCodeStyling({
        width,
        height,
        data: data || "",
        dotsOptions: { color: dotColor, type: dotType },
        backgroundOptions: { color: bgColor },
        image: logoUrl || "",
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 20,
          imageSize: 0.3,
        },
      });
      if (qrCodeContainerRef.current) {
        qrCodeInstance.current.append(qrCodeContainerRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update QR code when props change
    useEffect(() => {
      if (qrCodeInstance.current) {
        qrCodeInstance.current.update({
          data,
          dotsOptions: { color: dotColor, type: dotType },
          backgroundOptions: { color: bgColor },
          image: logoUrl || "",
        });
      }
    }, [data, dotColor, dotType, bgColor, logoUrl]);

    const handleDownload = () => {
      if (qrCodeInstance.current) {
        qrCodeInstance.current.download({
          name: "qr-code",
          extension: "png",
        });
      }
    };

    const hasContent = Boolean(data && data.trim() && data !== "{}" );

    const handleShare = async () => {
      if (!qrCodeInstance.current) return;
      try {
        const qrBlob = await qrCodeInstance.current.getRawData();
        if (!qrBlob) return;
        
        // Convert to proper BlobPart format
        const blobPart = qrBlob instanceof Blob ? qrBlob : new Uint8Array(qrBlob);
        const file = new File([blobPart], "qr-code.png", { type: "image/png" });
        
        if (navigator.share) {
          await navigator.share({
            title: "Scan this QR Code",
            text: "Generated with QR Generator",
            files: [file],
          });
        } else {
          const url = URL.createObjectURL(file);
          window.open(url, "_blank");
        }
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    };

    // Expose download and share functions to parent
    useImperativeHandle(ref, () => ({
      download: handleDownload,
      share: handleShare,
    }));

    if (!hasContent) {
      return (
        <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center text-slate-500">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700">Your QR preview will appear here</h3>
          <p className="mt-1 text-sm">Enter content or upload a file to generate a polished QR code.</p>
        </div>
      );
    }

    return <div ref={qrCodeContainerRef} className="flex h-full w-full items-center justify-center" />;
  }
);

QRCodeCanvas.displayName = "QRCodeCanvas";
export default QRCodeCanvas;
