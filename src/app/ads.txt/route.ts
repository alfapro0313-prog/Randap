import { NextResponse } from "next/server";

/**
 * /ads.txt — AdSense publisher huquqini tasdiqlaydi.
 * NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-...) env'da bo'lsa to'g'ri qator qaytaradi.
 */
export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return new NextResponse("Not configured", { status: 404 });
  }
  const pub = client.replace(/^ca-/, "");
  return new NextResponse(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
