import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { isAdminGmail } from "@/lib/randap-admin";

export const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
export const VIDEO_DIR = path.join(UPLOAD_ROOT, "videos");
export const THUMB_DIR = path.join(UPLOAD_ROOT, "thumbs");

export const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300 MB
export const MAX_THUMB_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_SHORT_SEC = 80;
/** Bo'laklab yuklash: har bir bo'lakning xom bayt hajmi (serverless 4.5MB limit) */
export const UPLOAD_CHUNK_BYTES = 3_000_000;

export function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function ensureUploadDirs() {
  await mkdir(VIDEO_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });
}

function safeExt(fileName: string, fallback: string): string {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return ext && ext.length <= 6 ? ext : fallback;
}

export async function saveUpload(
  buffer: Buffer,
  dir: string,
  baseName: string,
  fileName: string,
  fallbackExt: string
): Promise<string> {
  const ext = safeExt(fileName, fallbackExt);
  const full = path.join(dir, `${baseName}${ext}`);
  await writeFile(full, buffer);
  return `uploads/${path.basename(dir)}/${baseName}${ext}`;
}

export function placeholderThumb(title: string): string {
  const letter = (title.trim()[0] ?? "R").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#3f3f46"/><stop offset="1" stop-color="#18181b"/>
  </linearGradient></defs>
  <rect width="640" height="360" fill="url(#g)"/>
  <circle cx="320" cy="180" r="56" fill="#dc2626"/>
  <path d="M305 158 L305 202 L343 180 Z" fill="#ffffff"/>
  <text x="24" y="330" font-family="sans-serif" font-size="26" fill="#fafafa" opacity="0.85">${letter} · Randap</text>
</svg>`;
  return svg;
}

export function getDeviceKeyFromRequest(
  req: Request,
  fallbackFromParam?: string | null
): string {
  const header = req.headers.get("x-device-key");
  const fromParam = fallbackFromParam ?? "";
  return (header ?? fromParam ?? "").trim();
}

/** deviceKey bo'yicha foydalanuvchini topadi/yaratadi (device-identity) */
export async function ensureUser(deviceKey: string) {
  const existing = await db.user.findUnique({ where: { deviceKey } });
  if (existing) return existing;

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  let handle = `@randap_${suffix.toLowerCase()}`;
  const handleExists = await db.user.findUnique({ where: { handle } });
  if (handleExists) handle = `@randap_${Date.now().toString(36).slice(-6)}`;

  return db.user.create({
    data: { deviceKey, name: `RandapUser ${suffix}`, handle },
  });
}

/**
 * Admin tekshiruvi: kalit sayt egasining hisobiga tegishlimi?
 * Kalit ikki xil bo'lishi mumkin: eski deviceKey (AuthAccount) yoki
 * yangi accountKey (Account — gmail asosidagi hisob).
 */
export async function isAdminDevice(deviceKey: string): Promise<boolean> {
  const key = (deviceKey ?? "").trim();
  if (!key) return false;
  const account = await db.authAccount.findUnique({ where: { deviceKey: key } });
  if (isAdminGmail(account?.gmail)) return true;
  const acct = await db.account.findUnique({ where: { accountKey: key } });
  return isAdminGmail(acct?.gmail);
}

/** Yangi yuklangan fayl uchun unikal fayl nomi (kengaytmasiz) */
export function uploadBaseName(): string {
  const a = Math.random().toString(36).slice(2, 10);
  const b = Math.random().toString(36).slice(2, 8);
  return `${a}-${b}`;
}
