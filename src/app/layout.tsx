import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SwRegister } from "@/components/randap/sw-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://randap.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Randap — Video platforma | Videolar, Shorts, Testlar, Chat",
    template: "%s | Randap",
  },
  description:
    "Randap — O'zbek tilidagi video platforma: videolar va Shorts yuklash hamda ko'rish, layk, izoh, obuna, hamma fandan onlayn testlar, o'rganish darslari va jonli chat. Hammasi bir joyda — randap.vercel.app",
  keywords: [
    "randap",
    "randap video",
    "randap platforma",
    "video platforma",
    "o'zbek video platforma",
    "shorts",
    "video yuklash",
    "video ko'rish",
    "onlayn test",
    "testlar",
    "o'rganish",
    "chat",
    "dapzif",
  ],
  applicationName: "Randap",
  authors: [{ name: "Randap" }],
  creator: "Randap",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    description:
      "Videolar, Shorts, testlar, o'rganish va chat — hammasi bir joyda. Randap platformasiga xush kelibsiz!",
    siteName: "Randap",
    type: "website",
    url: SITE_URL,
    locale: "uz_UZ",
    images: [
      {
        url: "/og-randap.png",
        width: 1200,
        height: 630,
        alt: "Randap — Video platforma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Randap — Video platforma",
    description:
      "Videolar, Shorts, testlar, o'rganish va chat — hammasi bir joyda.",
    images: ["/og-randap.png"],
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
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SwRegister />
        <Analytics />
        {/* JSON-LD: Google'ga sayt haqida aniq ma'lumot beradi */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Randap",
              alternateName: "Randap Video platforma",
              url: SITE_URL,
              description:
                "Videolar, Shorts, testlar, o'rganish va chat — hammasi bir joyda",
              inLanguage: "uz",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {adsClient ? (
          <Script
            id="adsense-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
          />
        ) : null}
      </body>
    </html>
  );
}
