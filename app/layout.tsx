import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'SmartQR Studio',
  description: 'AI-Powered Intelligent QR Code Generation and Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
              <TopNav />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}