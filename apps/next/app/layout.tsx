import type { Metadata, Viewport } from "next";
import './globals.css';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Wolfie Tutor",
  description: "",
  openGraph: {
    title: "Wolfie Tutor",
    description: "Wolfie Tutor",
    siteName: "Wolfie Tutor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <TooltipProvider>
          <NextTopLoader
            height={3}
            color="#F5883E"
            showSpinner={false}
          />
          {children}
          <Toaster position="bottom-left" richColors closeButton={true} />
        </TooltipProvider>
      </body>
    </html>
  )
}