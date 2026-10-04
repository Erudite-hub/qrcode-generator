"use client";

import { useQRStore } from "@/lib/store/use-qr-store";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function HistoryToolbar() {
  const { undo, redo, resetDesign, pastDesigns, futureDesigns } = useQRStore();

  return (
    <div className="flex items-center space-x-2 bg-card border rounded-md p-1 shadow-sm">
      <Tooltip>
        <TooltipTrigger>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={undo} 
            disabled={pastDesigns.length === 0}
            className="h-8 w-8"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={redo} 
            disabled={futureDesigns.length === 0}
            className="h-8 w-8"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>

      <div className="w-[1px] h-4 bg-border mx-1" />

      <Tooltip>
        <TooltipTrigger>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetDesign}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset to Default</TooltipContent>
      </Tooltip>
    </div>
  );
}
