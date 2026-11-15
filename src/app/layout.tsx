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
  title: "ZamonBilim — O'quv markazi | Ingliz tili, IELTS, Matematika, Dasturlash",
  description:
    "ZamonBilim o'quv markazi: ingliz tili, IELTS 6.5+, matematika, abituriyent kurslari (DTM), frontend dasturlash va mental arifmetika. Kichik guruhlar, tajribali ustozlar, birinchi dars bepul.",
  keywords: [
    "o'quv markazi",
    "ingliz tili kursi",
    "IELTS",
    "matematika",
    "abituriyent",
    "dasturlash o'rganish",
    "Toshkent o'quv markazi",
  ],
  authors: [{ name: "ZamonBilim" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ZamonBilim — O'quv markazi",
    description:
      "Zamonaviy bilim — kelajak kaliti. Birinchi sinov darsi bepul!",
    siteName: "ZamonBilim",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
