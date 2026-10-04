"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/indexed-db";
import { useQRStore } from "@/lib/store/use-qr-store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Clock, Box } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { QRProject } from "@/lib/types/qr";

export function ProjectGrid() {
  const router = useRouter();
  const { setContent, setContentType, setDesign } = useQRStore();
  
  const projects = useLiveQuery(
    () => db.projects.orderBy("updatedAt").reverse().toArray()
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await db.projects.delete(id);
      toast.success("Project deleted");
    }
  };

  const handleEdit = (project: QRProject) => {
    setContent(project.content);
    setContentType(project.type);
    setDesign(project.design);
    toast.success("Project loaded into Design Studio");
    router.push("/design-studio");
  };

  if (!projects) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading projects...</div>;

  if (projects.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
        <Box className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-xl">No Projects Found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          You haven&apos;t saved any QR codes yet. Head over to the Generator or Design Studio and click &quot;Save to Projects&quot; to store your work locally.
        </p>
        <Button className="mt-6" onClick={() => router.push("/generator")}>
          Go to Generator
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col group overflow-hidden">
          <CardHeader className="p-4 border-b bg-muted/20">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium uppercase text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {project.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content:</span>
                <span className="truncate max-w-[150px] font-mono text-xs">{project.content}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-muted-foreground text-xs">Colors:</span>
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: project.design.background }} />
                  <div className="w-5 h-5 rounded-full border shadow-sm" style={{ backgroundColor: project.design.foreground }} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 bg-muted/10 border-t flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => handleEdit(project)}>
              <Edit2 className="mr-2 h-4 w-4" /> Load
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
