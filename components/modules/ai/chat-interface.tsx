"use client";

import { useState, useRef, useEffect } from "react";
import { useAIStore } from "@/lib/store/use-ai-store";
import { useQRStore } from "@/lib/store/use-qr-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Key, Sparkles, User, Bot, Loader2, Info } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const SYSTEM_PROMPT = `You are SmartQR Studio AI, a highly specialized assistant designed to configure QR codes.
You help users by analyzing their requests and extracting the perfect configuration.

When the user asks to create or style a QR code, you must ALWAYS output a JSON block wrapped in \`\`\`json containing two keys:
1. "content": A string representing the payload data (e.g., a URL, phone number, text).
2. "design": A partial QRDesignConfig object containing any visual styling inferred from their prompt.

Example Output:
Okay, I will create a classy dark-themed QR code for DeepMind!
\`\`\`json
{
  "content": "https://deepmind.google",
  "design": {
    "background": "#ffffff",
    "foreground": "#000000",
    "dotStyle": "classy",
    "cornerSquareStyle": "extra-rounded",
    "cornerDotStyle": "dot"
  }
}
\`\`\`

Available design keys:
- background (hex)
- foreground (hex)
- dotStyle: "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded"
- cornerSquareStyle: "square" | "dot" | "extra-rounded"
- cornerDotStyle: "square" | "dot"
- margin: number (0 to 100)
- errorCorrection: "L" | "M" | "Q" | "H"

If the user isn't asking for a QR code but just chatting, reply naturally without the JSON block.`;

export function ChatInterface() {
  const { apiKey, setApiKey, messages, addMessage } = useAIStore();
  const { setDesign, setContent } = useQRStore();
  
  const [input, setInput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSaveKey = () => {
    if (keyInput.trim().length > 10) {
      setApiKey(keyInput.trim());
      toast.success("API Key saved securely to local storage.");
    } else {
      toast.error("Please enter a valid API key.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    
    const userText = input.trim();
    setInput("");
    addMessage({ role: "user", content: userText });
    setIsLoading(true);

    try {
      // Create genai client natively for browser
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood. I will follow those instructions." }] },
          // Include history (simplified for this implementation)
          ...messages.slice(-5).map(m => ({ 
            role: m.role === "user" ? "user" : "model", 
            parts: [{ text: m.content }] 
          })),
          { role: "user", parts: [{ text: userText }] }
        ],
      });

      const responseText = response.text || "I couldn't process that.";
      let parsedDesign = false;

      // Extract JSON if present
      const jsonMatch = responseText.match(/\`\`\`json\n([\s\S]*?)\n\`\`\`/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const config = JSON.parse(jsonMatch[1]);
          if (config.content) {
            setContent(config.content);
          }
          if (config.design) {
            setDesign(config.design);
          }
          parsedDesign = true;
          toast.success("Applied AI configurations to the Design Studio!");
        } catch (e) {
          console.error("Failed to parse AI JSON:", e);
        }
      }

      addMessage({ 
        role: "assistant", 
        content: responseText.replace(/\`\`\`json\n[\s\S]*?\n\`\`\`/g, "*Configuration Applied Automatically*"),
        isApplyingDesign: parsedDesign
      });

    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to contact Gemini API. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <Card className="w-full max-w-md mx-auto mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> Gemini API Key Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            SmartQR Studio AI runs 100% locally in your browser. Your API key is never sent to our servers.
            It is stored securely in your browser&apos;s local storage.
          </p>
          <Input 
            type="password" 
            placeholder="AIzaSy..." 
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <Button onClick={handleSaveKey} className="w-full">Save Key</Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <Info className="h-4 w-4" /> Get a free API key from Google AI Studio.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full border-primary/20 shadow-md">
      <CardHeader className="border-b bg-muted/30 py-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Assistant</span>
          <Button variant="ghost" size="sm" onClick={() => setApiKey("")} className="h-8 text-xs text-muted-foreground">
            Clear Key
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
              <Sparkles className="h-12 w-12 opacity-20" />
              <p>Hi! I can generate QR codes and customize their designs for you.</p>
              <p className="text-sm">Try asking: <br/>&quot;Create a QR code for youtube.com with a rounded red design&quot;</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              
              <div className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 border'
              }`}>
                {m.content}
                {m.isApplyingDesign && (
                  <div className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Design Updated
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="rounded-lg px-4 py-3 bg-muted/50 border flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t bg-background">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI to design a QR code..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
