"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { navigation } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, Search, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store/use-app-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function TopNav() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation menu for SmartQR Studio</SheetDescription>
          </VisuallyHidden>
          {/* We reuse the sidebar design but allow it to render in the sheet */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex items-center justify-center rounded-md bg-primary/10 p-1">
              <span className="text-lg font-bold tracking-tight text-primary">SmartQR Studio</span>
            </div>
          </div>
          <div className="p-4 relative z-10 w-full h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const isHomeActive = pathname === "/" && item.href === "/";
                const finalIsActive = item.href === "/" ? isHomeActive : isActive;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
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
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="outline" className="hidden sm:flex items-center gap-2 text-muted-foreground w-64 justify-start">
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
