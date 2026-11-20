import { NextResponse } from "next/server";
import { VAPID_PUBLIC_KEY } from "@/lib/push-config";

/**
 * GET /api/push/config
 * Client (service worker'ni obuna qilish uchun) VAPID public kalitini oladi.
 */
export async function GET() {
  return NextResponse.json({ ok: true, publicKey: VAPID_PUBLIC_KEY });
}
