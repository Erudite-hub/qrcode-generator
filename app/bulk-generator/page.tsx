"use client";

import { BulkProcessor } from "@/components/modules/bulk/bulk-processor";

export default function BulkGeneratorPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Generator</h1>
        <p className="text-muted-foreground">
          Import a CSV file to generate hundreds of QR codes simultaneously, applying your current Design Studio styles.
        </p>
      </div>

      <BulkProcessor />
    </div>
  );
}
