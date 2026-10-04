"use client";

import { QRForms } from "@/components/modules/generator/qr-forms";
import { QRPreview } from "@/components/modules/generator/qr-preview";

export default function Home() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Generator</h1>
        <p className="text-muted-foreground">
          Create customized QR codes for any type of content.
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 flex-1 min-h-[500px]">
        {/* Left Side: Forms */}
        <div className="h-full">
          <QRForms />
        </div>

        {/* Right Side: Preview */}
        <div className="h-full lg:sticky lg:top-6">
          <QRPreview />
        </div>
      </div>
    </div>
  );
}