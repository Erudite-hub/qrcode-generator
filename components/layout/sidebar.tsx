"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  QrCode,
  Paintbrush,
  ScanLine,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  FolderOpen,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const navigation = [
  { name: "QR Generator", href: "/", icon: QrCode },
  { name: "Design Studio", href: "/design-studio", icon: Paintbrush },
  { name: "QR Scanner", href: "/scanner", icon: ScanLine },
  { name: "Security Lab", href: "/security-lab", icon: ShieldCheck },
  { name: "Quality Analyzer", href: "/quality-analyzer", icon: Activity },
  { name: "Bulk Generator", href: "/bulk-generator", icon: Layers },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "My Projects", href: "/projects", icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background lg:block lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0 z-50">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex items-center justify-center rounded-md bg-primary/10 p-1">
          <QrCode className="h-6 w-6 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">SmartQR Studio</span>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            // Exception for home route
            const isHomeActive = pathname === "/" && item.href === "/";
            const finalIsActive = item.href === "/" ? isHomeActive : isActive;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  finalIsActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
