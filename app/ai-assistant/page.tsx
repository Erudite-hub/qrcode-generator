"use client";

import { ChatInterface } from "@/components/modules/ai/chat-interface";
import { QRPreview } from "@/components/modules/generator/qr-preview";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Chat with the Gemini 2.0 Flash model to automatically generate and style QR codes via natural language.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
        {/* Left Side: Chat Interface */}
        <div className="h-full">
          <ChatInterface />
        </div>

        {/* Right Side: Live Preview responding to AI */}
        <div className="h-full sticky top-6">
          <div className="hidden lg:block h-full">
             <QRPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
