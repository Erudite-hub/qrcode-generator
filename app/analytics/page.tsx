"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/indexed-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Activity, Download, QrCode, ScanLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, subDays, startOfDay } from "date-fns";

export default function AnalyticsPage() {
  const events = useLiveQuery(() => db.analytics.toArray(), []);

  if (!events) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading analytics...</div>;
  }

  // Calculate high-level stats
  const totalGenerates = events.filter(e => e.type === "generate").length;
  const totalScans = events.filter(e => e.type === "scan").length;
  const totalDownloads = events.filter(e => e.type === "download").length;
  const totalBulk = events.filter(e => e.type === "bulk_generate")
    .reduce((acc, curr) => acc + ((curr.metadata?.count as number) || 0), 0);

  // Group events by day for the line chart (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => startOfDay(subDays(new Date(), 6 - i)));
  
  const chartData = last7Days.map(day => {
    const dayStr = format(day, "MMM dd");
    const dayEvents = events.filter(e => startOfDay(new Date(e.timestamp)).getTime() === day.getTime());
    
    return {
      name: dayStr,
      scans: dayEvents.filter(e => e.type === "scan").length,
      generates: dayEvents.filter(e => e.type === "generate").length,
      downloads: dayEvents.filter(e => e.type === "download").length,
    };
  });

  // Action distribution for Pie Chart
  const distributionData = [
    { name: 'Generated', value: totalGenerates, color: '#3b82f6' },
    { name: 'Scanned', value: totalScans, color: '#10b981' },
    { name: 'Downloaded', value: totalDownloads, color: '#8b5cf6' },
    { name: 'Bulk Gen', value: totalBulk > 0 ? 1 : 0, color: '#f59e0b' } // Just presence for pie chart
  ].filter(d => d.value > 0);

  const clearAnalytics = async () => {
    if (confirm("Are you sure you want to clear all analytics history?")) {
      await db.analytics.clear();
      toast.success("Analytics history cleared.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Offline metrics tracking your QR code generation and scanning behavior.
          </p>
        </div>
        <Button variant="outline" className="text-destructive" onClick={clearAnalytics}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGenerates + totalBulk}</div>
            <p className="text-xs text-muted-foreground">Includes {totalBulk} from Bulk exports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Codes Scanned</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
            <p className="text-xs text-muted-foreground">Via camera or upload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">PNG & SVG exports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Logging</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Local tracking enabled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-w-0">
          <CardHeader>
            <CardTitle>Activity Over Time</CardTitle>
            <CardDescription>Actions logged over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            {events.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="generates" name="Generates" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="scans" name="Scans" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="downloads" name="Downloads" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No activity data yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Action Distribution</CardTitle>
            <CardDescription>Breakdown of all interactions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
             {distributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="text-muted-foreground text-center">
                  <PieChart className="opacity-20 mb-2 h-16 w-16 mx-auto" />
                  Not enough data to display distribution.
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
