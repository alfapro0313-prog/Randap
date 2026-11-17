import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Randap — Video platforma",
  description:
    "Randap — videolar va shorts joylash, ko'rish, layk bosish, izoh qoldirish va obuna bo'lish mumkin bo'lgan video platforma.",
  keywords: ["Randap", "video", "shorts", "video platforma", "layk", "obuna"],
  authors: [{ name: "Randap" }],
  verification: {
    google: "VXb85HgWsMBp_pNu5PhoVKpZeoqxfkYMhh6_n0GipFw",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Randap — Video platforma",
    description: "Videolar va shorts — hammasi bir joyda.",
    siteName: "Randap",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
