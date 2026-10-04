"use client";

import { DesignControls } from "@/components/modules/design-studio/design-controls";
import { HistoryToolbar } from "@/components/modules/design-studio/history-toolbar";
import { QRPreview } from "@/components/modules/generator/qr-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DesignStudioPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Studio</h1>
          <p className="text-muted-foreground">
            Visually customize your QR code appearance, colors, and logos.
          </p>
        </div>
        <HistoryToolbar />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 flex-1 min-h-[600px]">
        {/* Left Side: Design Controls */}
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <Tabs defaultValue="editor" className="w-full h-full flex flex-col">
              <TabsList className="w-full rounded-none rounded-t-lg justify-start px-2 py-1 h-auto bg-muted/50 border-b">
                <TabsTrigger value="editor">Design Editor</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="p-4 m-0 flex-1 overflow-y-auto">
                <DesignControls />
              </TabsContent>
              
              <TabsContent value="templates" className="p-4 m-0 flex-1">
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground border-2 border-dashed rounded-lg p-6 text-center">
                  <p>Template Gallery is under construction.</p>
                  <p className="text-sm mt-2">Will be implemented during Phase 9 (Templates).</p>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="p-4 m-0 flex-1">
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground border-2 border-dashed rounded-lg p-6 text-center">
                  <p>Local Asset Uploads are under construction.</p>
                  <p className="text-sm mt-2">Will be powered by IndexedDB in Phase 7.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Side: Live Preview */}
        <div className="h-full lg:sticky lg:top-6">
          <QRPreview />
        </div>
      </div>
    </div>
  );
}
