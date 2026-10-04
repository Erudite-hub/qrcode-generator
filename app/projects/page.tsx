"use client";

import { ProjectGrid } from "@/components/modules/projects/project-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved QR code designs. Everything is stored securely in your browser&apos;s local database.
          </p>
        </div>
        <Link href="/" passHref legacyBehavior>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New QR Code
          </Button>
        </Link>
      </div>

      <ProjectGrid />
    </div>
  );
}
