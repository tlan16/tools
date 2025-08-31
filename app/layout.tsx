import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Tools",
  description: "Frank's collection of tools.",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Preload critical CSS */}
      <link rel="preload" href="/_next/static/css/app.css" as="style" />
    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full">
        {children}
      </main>
    </SidebarProvider>
    </body>
    </html>
  );
}
