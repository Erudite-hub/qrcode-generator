"use client";

import { useState } from "react";
import { CameraScanner } from "@/components/modules/scanner/camera-scanner";
import { ImageScanner } from "@/components/modules/scanner/image-scanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { db } from "@/lib/db/indexed-db";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleResult = async (text: string) => {
    if (!scanResult) {
      setScanResult(text);
      try {
        await db.analytics.add({
          type: "scan",
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Failed to log scan", e);
      }
    }
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      toast.success("Copied to clipboard");
    }
  };

  const isUrl = scanResult?.startsWith("http://") || scanResult?.startsWith("https://");

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Scanner & Decoder</h1>
        <p className="text-muted-foreground">
          Scan QR codes using your camera or upload an image to decode its contents.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="camera">Camera Scan</TabsTrigger>
            <TabsTrigger value="image">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            <CameraScanner onResult={handleResult} />
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <ImageScanner onResult={handleResult} />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Card className="h-full border-primary/20">
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md break-all text-sm font-mono border">
                    {scanResult}
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2 border-t">
                    <Button variant="outline" onClick={copyToClipboard} className="w-full justify-start">
                      <Copy className="mr-2 h-4 w-4" /> Copy Content
                    </Button>
                    
                    {isUrl && (
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open(scanResult, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                      </Button>
                    )}
                    
                    <Link href={`/security-lab?url=${encodeURIComponent(scanResult)}`} passHref legacyBehavior>
                      <Button className="w-full justify-start">
                        <ShieldCheck className="mr-2 h-4 w-4" /> Analyze Security
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-center space-y-2">
                  <ScanPlaceholderIcon />
                  <p className="text-sm">No QR code scanned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScanPlaceholderIcon() {
  return (
    <div className="relative w-16 h-16 opacity-20">
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current"></div>
    </div>
  );
}
