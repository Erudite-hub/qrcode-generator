"use client";

import { useQRStore } from "@/lib/store/use-qr-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { QRDesignConfig } from "@/lib/types/qr";

export function DesignControls() {
  const { design, setDesign } = useQRStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (key: keyof QRDesignConfig, value: any) => {
    setDesign({ [key]: value });
  };

  return (
    // @ts-expect-error Accordion type definition mismatch
    <Accordion type="multiple" defaultValue={["colors", "shapes", "logo"]} className="w-full h-full pr-4">
      <AccordionItem value="colors">
        <AccordionTrigger>Colors & Background</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Foreground Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={design.foreground} 
                  onChange={(e) => handleUpdate("foreground", e.target.value)}
                  className="w-12 p-1 h-9 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={design.foreground} 
                  onChange={(e) => handleUpdate("foreground", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={design.background} 
                  onChange={(e) => handleUpdate("background", e.target.value)}
                  className="w-12 p-1 h-9 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={design.background} 
                  onChange={(e) => handleUpdate("background", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t mt-4">
            <Label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={design.gradient?.enabled || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleUpdate("gradient", { enabled: true, start: design.foreground, end: "#1555A5", rotation: 45 });
                  } else {
                    handleUpdate("gradient", undefined);
                  }
                }}
              /> Enable Gradient Foreground
            </Label>
            
            {design.gradient?.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start Color</Label>
                  <Input 
                    type="color" 
                    value={design.gradient.start} 
                    onChange={(e) => handleUpdate("gradient", { ...design.gradient, start: e.target.value })}
                    className="w-full p-1 h-9 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Color</Label>
                  <Input 
                    type="color" 
                    value={design.gradient.end} 
                    onChange={(e) => handleUpdate("gradient", { ...design.gradient, end: e.target.value })}
                    className="w-full p-1 h-9 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shapes">
        <AccordionTrigger>Patterns & Shapes</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Dot Style</Label>
            <Select value={design.dotStyle} onValueChange={(v) => handleUpdate("dotStyle", v as string)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Corner Square Style</Label>
            <Select value={design.cornerSquareStyle} onValueChange={(v) => handleUpdate("cornerSquareStyle", v as string)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Corner Dot Style</Label>
            <Select value={design.cornerDotStyle} onValueChange={(v) => handleUpdate("cornerDotStyle", v as string)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dot">Dot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="logo">
        <AccordionTrigger>Logo Integration</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Logo Image URL</Label>
            <Input 
              type="url" 
              placeholder="https://..." 
              value={design.logo || ""}
              onChange={(e) => handleUpdate("logo", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              File upload support will be implemented via IndexedDB in the Projects phase.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Logo Margin</Label>
            <Input 
              type="number" 
              min="0" 
              max="50" 
              value={design.logoMargin || 0}
              onChange={(e) => handleUpdate("logoMargin", Number(e.target.value))}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="options">
        <AccordionTrigger>Advanced Options</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Error Correction Level</Label>
            <Select value={design.errorCorrection} onValueChange={(v) => handleUpdate("errorCorrection", v as string)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Use higher levels if integrating a logo to ensure readability.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Padding / Margin</Label>
            <Input 
              type="number" 
              min="0" 
              max="100" 
              value={design.margin}
              onChange={(e) => handleUpdate("margin", Number(e.target.value))}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
