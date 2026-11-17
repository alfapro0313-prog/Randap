/**
 * Admin panel yordamchilari.
 * Admin — sayt egasi: gmail orqali aniqlanadi (env: NEXT_PUBLIC_ADMIN_GMAIL).
 * Bu fayl client va server tomonda birga ishlaydi.
 */

export const ADMIN_GMAIL = (
  process.env.NEXT_PUBLIC_ADMIN_GMAIL || "alfapro0313@gmail.com"
).toLowerCase();

export function isAdminGmail(gmail: string | null | undefined): boolean {
  return (gmail ?? "").trim().toLowerCase() === ADMIN_GMAIL;
}

/** blockUntil ms yoki ISO → ms; null/o'tgan bo'lsa null */
export function activeBlockMs(
  blockedUntil: string | number | null | undefined
): number | null {
  if (!blockedUntil) return null;
  const ms = typeof blockedUntil === "number" ? blockedUntil : Date.parse(blockedUntil);
  if (!Number.isFinite(ms) || ms <= Date.now()) return null;
  return ms;
}

/** Blok tugashigacha QOLGAN millisekund */
export function remainingMs(untilMs: number): number {
  return Math.max(0, untilMs - Date.now());
}

/** Qolgan vaqtni "2 hr 14 min" ko'rinishida chiqaradi */
export function formatLeft(
  ms: number,
  unitHour: string,
  unitMin: string
): string {
  const total = Math.max(0, Math.ceil(ms / 60000));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h > 0) return `${h} ${unitHour} ${m} ${unitMin}`;
  return `${m} ${unitMin}`;
}

export const BLOCK_HOURS = 3;
