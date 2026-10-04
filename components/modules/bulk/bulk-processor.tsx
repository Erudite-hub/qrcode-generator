"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import { useQRStore } from "@/lib/store/use-qr-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, CheckCircle2, Play, FileDown } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db/indexed-db";

export function BulkProcessor() {
  const { design } = useQRStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataCol, setDataCol] = useState<string>("");
  const [filenameCol, setFilenameCol] = useState<string>("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedZip, setProcessedZip] = useState<Blob | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const keys = Object.keys(results.data[0] as object);
          setHeaders(keys);
          setCsvData(results.data);
          
          // Auto-guess columns if possible
          if (keys.includes("data")) setDataCol("data");
          else if (keys.includes("url")) setDataCol("url");
          else setDataCol(keys[0]);
          
          if (keys.includes("filename")) setFilenameCol("filename");
          else if (keys.includes("name")) setFilenameCol("name");
          else setFilenameCol(keys[1] || keys[0]);
          
          toast.success(`Loaded ${results.data.length} rows`);
        } else {
          toast.error("CSV is empty or invalid");
        }
      },
      error: (error) => {
        toast.error(error.message);
      }
    });
  };

  const processBatch = async () => {
    if (!dataCol || !filenameCol) {
      toast.error("Please map the required columns.");
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    setProcessedZip(null);

    const zip = new JSZip();
    const qrCode = new QRCodeStyling({
      width: design.width,
      height: design.height,
      margin: design.margin,
      image: design.logo || undefined,
      qrOptions: { errorCorrectionLevel: design.errorCorrection },
      imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin || 0 },
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
      backgroundOptions: { color: design.background },
      cornersSquareOptions: { type: design.cornerSquareStyle as CornerSquareType, color: design.foreground },
      cornersDotOptions: { type: design.cornerDotStyle as CornerDotType, color: design.foreground },
    });

    const total = csvData.length;
    const batchSize = 10; // Process in small chunks so UI doesn't freeze

    for (let i = 0; i < total; i += batchSize) {
      const chunk = csvData.slice(i, i + batchSize);
      
      // Process chunk
      await Promise.all(
        chunk.map(async (row, idx) => {
          const content = row[dataCol];
          let fname = row[filenameCol] || `qr_${i + idx}`;
          
          if (!content) return;
          if (!fname.endsWith(".png")) fname += ".png";

          qrCode.update({ data: String(content) });
          try {
            const blob = await qrCode.getRawData("png");
            if (blob) {
              zip.file(fname, blob);
            }
          } catch (err) {
            console.error(`Failed to generate QR for row ${i + idx}:`, err);
          }
        })
      );

      // Yield to event loop and update progress
      setProgress(Math.round(((i + chunk.length) / total) * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      setProcessedZip(content);
      toast.success("Batch processing complete!");
      
      // Log to analytics
      db.analytics.add({
        type: "bulk_generate",
        timestamp: new Date().toISOString(),
        metadata: { count: total }
      }).catch(console.error);

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ZIP file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadZip = () => {
    if (processedZip) {
      saveAs(processedZip, `smartqr-bulk-${Date.now()}.zip`);
    }
  };

  return (
    <div className="space-y-6">
      {!csvData.length ? (
        <div 
          className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv"
            onChange={handleFileUpload}
          />
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-xl">Upload CSV Data</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Upload a CSV file containing the data for your QR codes. The first row should contain column headers.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Data Mapping</span>
                <Button variant="ghost" size="sm" onClick={() => setCsvData([])}>
                  Clear Data
                </Button>
              </CardTitle>
              <CardDescription>
                Map your CSV columns to the QR Code generator properties.
                Loaded {csvData.length} rows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">QR Content Column (Required)</label>
                  <Select value={dataCol} onValueChange={(val) => setDataCol(val as string)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filename Column (Optional)</label>
                  <Select value={filenameCol} onValueChange={(val) => setFilenameCol(val as string)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Preview */}
              <div className="mt-6 border rounded-md overflow-hidden">
                <div className="bg-muted p-2 font-semibold text-sm border-b grid grid-cols-2">
                  <div>Mapped Content ({dataCol})</div>
                  <div>Mapped Filename ({filenameCol})</div>
                </div>
                <div className="divide-y max-h-40 overflow-y-auto">
                  {csvData.slice(0, 5).map((row, i) => (
                    <div key={i} className="p-2 text-sm grid grid-cols-2 truncate">
                      <div className="truncate pr-4">{row[dataCol] || "-"}</div>
                      <div className="truncate text-muted-foreground">{row[filenameCol] || `qr_${i}`}</div>
                    </div>
                  ))}
                  {csvData.length > 5 && (
                    <div className="p-2 text-sm text-center text-muted-foreground bg-muted/30">
                      ...and {csvData.length - 5} more rows
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                <p><strong>Design:</strong> Current Design Studio settings will be applied.</p>
                <p><strong>Quantity:</strong> {csvData.length} QR Codes</p>
                <p><strong>Format:</strong> PNG Archive (.zip)</p>
              </div>

              {!processedZip ? (
                <div className="space-y-4">
                  <Button 
                    onClick={processBatch} 
                    disabled={isProcessing || !dataCol} 
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? "Processing..." : (
                      <><Play className="mr-2 h-4 w-4" /> Start Generation</>
                    )}
                  </Button>
                  
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Generating...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in">
                  <div className="bg-green-500/10 text-green-600 p-4 rounded-lg flex flex-col items-center justify-center text-center space-y-2 border border-green-500/20">
                    <CheckCircle2 className="h-8 w-8" />
                    <span className="font-medium">Generation Complete!</span>
                  </div>
                  
                  <Button onClick={downloadZip} className="w-full" size="lg">
                    <FileDown className="mr-2 h-4 w-4" /> Download ZIP
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
