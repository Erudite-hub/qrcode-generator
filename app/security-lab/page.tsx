"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ShieldAlert, ShieldX, Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SecurityIndicator {
  name: string;
  passed: boolean;
  scoreImpact: number;
  message: string;
}

export default function SecurityLabPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SecurityLabContent />
    </Suspense>
  );
}

function SecurityLabContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams?.get("url") || "";

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [indicators, setIndicators] = useState<SecurityIndicator[]>([]);

  // Automatically analyze if a URL is provided in query params
  useEffect(() => {
    if (initialUrl) {
      handleAnalyze(initialUrl);
    }
  }, [initialUrl]);

  const handleAnalyze = (urlToAnalyze: string) => {
    if (!urlToAnalyze) return;
    
    setIsAnalyzing(true);
    setScore(null);
    setIndicators([]);

    // Simulate network delay for realistic feel of an analysis engine
    setTimeout(() => {
      let currentScore = 100;
      const results: SecurityIndicator[] = [];

      const isUrl = urlToAnalyze.startsWith("http://") || urlToAnalyze.startsWith("https://");
      
      if (!isUrl) {
        results.push({ name: "Protocol", passed: true, scoreImpact: 0, message: "Not a web URL. Contains raw text or structured payload." });
        setIndicators(results);
        setScore(100);
        setIsAnalyzing(false);
        return;
      }

      // 1. HTTP Protocol Check (15 points)
      if (urlToAnalyze.startsWith("http://")) {
        currentScore -= 15;
        results.push({ name: "HTTPS Encryption", passed: false, scoreImpact: -15, message: "Uses insecure HTTP protocol. Data is not encrypted in transit." });
      } else {
        results.push({ name: "HTTPS Encryption", passed: true, scoreImpact: 0, message: "Uses secure HTTPS protocol." });
      }

      try {
        const urlObj = new URL(urlToAnalyze);
        
        // 2. IP Address Hostname Check (20 points)
        const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(urlObj.hostname);
        if (isIpAddress) {
          currentScore -= 20;
          results.push({ name: "IP Address Hostname", passed: false, scoreImpact: -20, message: "Uses an IP address instead of a domain name, common in phishing." });
        } else {
          results.push({ name: "IP Address Hostname", passed: true, scoreImpact: 0, message: "Uses a standard domain name." });
        }

        // 3. Common URL Shorteners (5 points)
        const shorteners = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd"];
        if (shorteners.includes(urlObj.hostname.toLowerCase())) {
          currentScore -= 5;
          results.push({ name: "URL Shortener", passed: false, scoreImpact: -5, message: "Destination is obscured by a URL shortener." });
        } else {
          results.push({ name: "URL Shortener", passed: true, scoreImpact: 0, message: "Not using a recognized URL shortener." });
        }

        // 4. Embedded Credentials (25 points)
        if (urlObj.username || urlObj.password) {
          currentScore -= 25;
          results.push({ name: "Embedded Credentials", passed: false, scoreImpact: -25, message: "URL contains embedded credentials (e.g., user:pass@domain), which is highly suspicious." });
        } else {
          results.push({ name: "Embedded Credentials", passed: true, scoreImpact: 0, message: "No embedded credentials found." });
        }

        // 5. Suspicious Subdomain Length/Structure (15 points)
        const parts = urlObj.hostname.split(".");
        if (parts.length > 4) {
          currentScore -= 15;
          results.push({ name: "Suspicious Subdomains", passed: false, scoreImpact: -15, message: "Unusually high number of subdomains. Often used to trick users." });
        } else {
          results.push({ name: "Suspicious Subdomains", passed: true, scoreImpact: 0, message: "Domain structure appears normal." });
        }

      } catch {
        currentScore = 0;
        results.push({ name: "URL Parsing", passed: false, scoreImpact: -100, message: "Malformed or invalid URL structure." });
      }

      setScore(Math.max(0, currentScore));
      setIndicators(results);
      setIsAnalyzing(false);
    }, 1200);
  };

  const getRiskLevel = (s: number) => {
    if (s >= 90) return { label: "Low Risk", color: "text-green-500", icon: ShieldCheck, bar: "bg-green-500" };
    if (s >= 70) return { label: "Moderate Risk", color: "text-yellow-500", icon: Info, bar: "bg-yellow-500" };
    if (s >= 40) return { label: "High Risk", color: "text-orange-500", icon: ShieldAlert, bar: "bg-orange-500" };
    return { label: "Critical Risk", color: "text-red-500", icon: ShieldX, bar: "bg-red-500" };
  };

  const risk = score !== null ? getRiskLevel(score) : null;
  const RiskIcon = risk?.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Lab</h1>
        <p className="text-muted-foreground">
          Analyze QR code destinations for potential security risks and deceptive patterns.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label>URL or Decoded Content</Label>
              <Input 
                value={inputUrl} 
                onChange={(e) => setInputUrl(e.target.value)} 
                placeholder="https://..."
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(inputUrl)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => handleAnalyze(inputUrl)} disabled={!inputUrl || isAnalyzing} className="w-32">
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {score !== null && risk && (
        <div className="grid md:grid-cols-[1fr_2fr] gap-6 animate-in fade-in zoom-in duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Risk Score</CardTitle>
              <CardDescription>Based on heuristic URL analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
              {RiskIcon && <RiskIcon className={`h-16 w-16 ${risk.color}`} />}
              <div className="text-5xl font-bold">{score}<span className="text-2xl text-muted-foreground">/100</span></div>
              <div className={`text-xl font-semibold ${risk.color}`}>{risk.label}</div>
              <Progress value={score} className={`w-full h-3 mt-4 ${risk.bar}`} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Disclaimer: Analysis is heuristic and advisory. Cannot guarantee absolute safety.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {indicators.map((ind, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                  <div className="mt-0.5">
                    {ind.passed ? (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{ind.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{ind.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
