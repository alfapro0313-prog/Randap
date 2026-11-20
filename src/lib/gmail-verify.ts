/**
 * Haqiqiy Gmail tekshiruvi — soxta gmail bilan saytga kirishni to'sadi.
 *
 * Qatlamlar:
 *  1) QATIY FORMAT — Gmail qoidalariga to'liq mosligi (6-30 belgi, nuqta qoidalari);
 *  2) SMTP TEKSHIRUVI — Gmail serveriga RCPT TO yuboriladi: mavjud akkaunt 250,
 *     mavjud bo'lmagan 550 qaytaradi (port 25 ochiq bo'lgan muhitda aniq natija);
 *  3) LIMIT — bir qurilmadan kuniga ko'p yangi akkaunt yaratish bloklanadi.
 *
 * SMTP port yopiq bo'lgan muhitlarda (Vercel serverless) 2-qatlam "unknown"
 * qaytaradi — o'shanda 1 va 3-qatlamlar himoyani davom ettiradi.
 */

import { resolveMx } from "dns/promises";
import { createConnection, Socket } from "net";

/** Gmail lokal qismi qoidalariga to'liq mos tekshiruv */
export function validateGmailFormat(
  gmail: string
): { ok: boolean; error?: string } {
  const g = gmail.trim().toLowerCase();
  if (!g) return { ok: false, error: "Gmail yozilishi shart" };
  if (!/^[a-z0-9._]+@(?:gmail|googlemail)\.com$/.test(g)) {
    return { ok: false, error: "Faqat Gmail manzil bilan kirish mumkin" };
  }
  const local = g.split("@")[0];
  if (local.length < 6 || local.length > 30) {
    return { ok: false, error: "Gmail noto'g'ri: ism qismi 6-30 belgi bo'lishi kerak" };
  }
  if (local.startsWith(".") || local.endsWith(".")) {
    return { ok: false, error: "Gmail noto'g'ri: nuqta bilan boshlanib/yakunlanmaydi" };
  }
  if (local.includes("..")) {
    return { ok: false, error: "Gmail noto'g'ri: ketma-ket nuqtalar yo'q" };
  }
  return { ok: true };
}

type Verdict = "exists" | "fake" | "unknown";

/** Tekshiruv natijalari keshi — bir gmailni qayta-qayta so'ramaslik uchun */
const cache = new Map<string, { verdict: Verdict; at: number }>();
const CACHE_MS = 10 * 60 * 1000;

/** SMTP so'rovlariga umumiy timeout */
const SMTP_TIMEOUT_MS = 6000;

/**
 * Gmail manzil mavjudligini SMTP RCPT TO bilan tekshirish.
 * Natija: "exists" (haqiqiy), "fake" (mavjud emas), "unknown" (tekshirib bo'lmadi).
 */
async function smtpProbe(gmail: string): Promise<Verdict> {
  let mx: Array<{ exchange: string; priority: number }>;
  try {
    mx = await resolveMx("gmail.com");
  } catch {
    return "unknown";
  }
  if (!mx.length) return "unknown";
  const host = mx.sort((a, b) => a.priority - b.priority)[0].exchange;

  return new Promise<Verdict>((resolve) => {
    let socket: Socket | null = null;
    let stage = 0; // 0: banner, 1: HELO→MAIL, 2: RCPT
    let buf = "";
    const finish = (v: Verdict) => {
      try {
        socket?.destroy();
      } catch {
        // ignore
      }
      clearTimeout(timer);
      resolve(v);
    };
    const timer = setTimeout(() => finish("unknown"), SMTP_TIMEOUT_MS);

    try {
      socket = createConnection({ host, port: 25, timeout: SMTP_TIMEOUT_MS });
    } catch {
      finish("unknown");
      return;
    }

    socket.on("timeout", () => finish("unknown"));
    socket.on("error", () => finish("unknown"));
    socket.on("data", (chunk: Buffer) => {
      buf += chunk.toString("utf8");
      if (!/\r?\n$/.test(buf)) return;
      const code = parseInt(buf.slice(0, 3), 10);
      buf = "";

      if (stage === 0) {
        if (code !== 220) return finish("unknown");
        stage = 1;
        socket?.write("HELO randap.vercel.app\r\n");
        return;
      }
      if (stage === 1) {
        if (code !== 250) return finish("unknown");
        stage = 2;
        socket?.write("MAIL FROM:<noreply@randap.vercel.app>\r\n");
        return;
      }
      if (stage === 2) {
        if (code !== 250) return finish("unknown");
        stage = 3;
        socket?.write(`RCPT TO:<${gmail}>\r\n`);
        return;
      }
      // stage 3 — RCPT javobi
      if (code === 250 || code === 251) return finish("exists");
      if (code >= 500 && code < 600) return finish("fake");
      finish("unknown");
    });
    socket.on("connect", () => {
      // banner kutamiz — "data" handler bosqichlarni boshqaradi
    });
  });
}

/**
 * Gmail haqiqiyligini tekshiradi (format + SMTP mavjudlik).
 * Kesh 10 daqiqa — bir xil gmailni tez-tez so'rov qilmaydi.
 */
export async function verifyGmailReal(gmail: string): Promise<Verdict> {
  const format = validateGmailFormat(gmail);
  if (!format.ok) return "fake";

  const g = gmail.trim().toLowerCase();
  const hit = cache.get(g);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.verdict;

  const verdict = await smtpProbe(g);
  if (verdict !== "unknown") cache.set(g, { verdict, at: Date.now() });
  return verdict;
}

/* ---------- Yangi akkaunt yaratish limiti ---------- */

const MAX_NEW_PER_DAY = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const created = new Map<string, number[]>();

/**
 * Bir qurilmadan kuniga ko'pi bilan MAX_NEW_PER_DAY ta YANGI akkaunt
 * yaratiladi (soxta akkauntlar oqimini sekinlashtiradi).
 * true = ruxsat bor.
 */
export function allowNewAccount(deviceKey: string): boolean {
  const now = Date.now();
  const list = (created.get(deviceKey) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_NEW_PER_DAY) return false;
  list.push(now);
  created.set(deviceKey, list);
  return true;
}
