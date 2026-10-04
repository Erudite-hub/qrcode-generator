"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, StopCircle } from "lucide-react";

export function CameraScanner({ onResult }: { onResult: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Get camera devices
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          // Prefer back camera if available
          const backCamera = videoInputDevices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"));
          setSelectedDevice(backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Camera permission denied or camera unavailable.");
      });

  }, []);

  const startScan = async () => {
    if (!videoRef.current || !selectedDevice) return;
    
    try {
      const codeReader = new BrowserMultiFormatReader();
      const ctrl = await codeReader.decodeFromVideoDevice(
        selectedDevice, 
        videoRef.current, 
        (result, err) => {
          if (result) {
            onResult(result.getText());
            // Optional: Stop after success to prevent duplicate scans
            // stopScan(); 
          }
          if (err && err.name !== "NotFoundException") {
            // Ignore NotFoundException, it just means no QR found in this frame
          }
        }
      );
      setControls(ctrl);
      setIsScanning(true);
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start camera.");
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    if (controls) {
      controls.stop();
      setControls(null);
    }
    setIsScanning(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <Select 
            value={selectedDevice} 
            onValueChange={(val) => {
              setSelectedDevice(val as string);
              if (isScanning) {
                stopScan();
                setTimeout(startScan, 100);
              }
            }}
            disabled={devices.length === 0}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((d) => (
                <SelectItem key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.substring(0, 5)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!isScanning ? (
            <Button onClick={startScan} disabled={!selectedDevice} className="w-32">
              <Camera className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <Button onClick={stopScan} variant="destructive" className="w-32">
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
          )}
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${!isScanning ? "hidden" : ""}`} 
          />
          {!isScanning && (
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <Camera className="h-8 w-8 opacity-50" />
              <span>Camera inactive</span>
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none border-2 border-primary/50 m-8 rounded-lg relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
