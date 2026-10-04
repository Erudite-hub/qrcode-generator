"use client";

import { useQRStore } from "@/lib/store/use-qr-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

// Helper to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Relative luminance calculation
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Contrast ratio calculation
function calculateContrast(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function QualityAnalyzerPage() {
  const { design } = useQRStore();

  // Perform calculations based on current design in store
  const contrast = calculateContrast(design.foreground, design.background);
  
  // Scannability heuristics
  const hasGoodContrast = contrast >= 3.0;
  const hasExcellentContrast = contrast >= 4.5;
  
  const hasLogo = !!design.logo;
  const isHighErrorCorrection = design.errorCorrection === "H" || design.errorCorrection === "Q";
  const logoWarning = hasLogo && !isHighErrorCorrection;

  // Basic overall score calculation
  let score = 100;
  if (!hasExcellentContrast) score -= 20;
  if (!hasGoodContrast) score -= 30;
  if (logoWarning) score -= 25;
  if (design.margin < 10) score -= 10;
  if (design.margin === 0) score -= 20;

  score = Math.max(0, score);

  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-green-500";
    if (s >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreBar = (s: number) => {
    if (s >= 90) return "bg-green-500";
    if (s >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Analyzer</h1>
        <p className="text-muted-foreground">
          Assess the current QR code configuration from the Design Studio for scannability and accessibility.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Quality Score</CardTitle>
            <CardDescription>Based on physical scanning heuristics</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {score}<span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Progress value={score} className={`w-full h-3 mt-4 ${getScoreBar(score)}`} />
            <p className="text-xs text-muted-foreground text-center mt-4">
              A score above 80 generally indicates reliable scanning across most modern smartphone cameras.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1">
                {hasExcellentContrast ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : hasGoodContrast ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg">Contrast Ratio: {contrast.toFixed(2)}:1</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The contrast between the foreground ({design.foreground}) and background ({design.background}).
                  {hasExcellentContrast 
                    ? " Excellent contrast ensures rapid detection by camera sensors." 
                    : hasGoodContrast 
                    ? " Acceptable contrast, but might struggle in low light or low-end cameras." 
                    : " Critical: Contrast is too low. The QR code may be unreadable."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1">
                {!hasLogo ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : logoWarning ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg">Logo Integration & Error Correction</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Current Error Correction Level: <strong>{design.errorCorrection}</strong>.
                  {!hasLogo 
                    ? " No logo is integrated, meaning the data area is fully preserved." 
                    : logoWarning 
                    ? " Warning: A logo is present but error correction is Low or Medium. This risks making the QR unreadable. Increase to Q or H." 
                    : " A logo is present and error correction is adequately high to compensate for the obscured modules."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1">
                {design.margin >= 10 ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-lg">Quiet Zone (Margin)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Current Margin: {design.margin}px. The quiet zone is the blank space surrounding the QR code. It is essential for scanners to distinguish the code from its surroundings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
