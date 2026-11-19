import { db } from "@/lib/db";

/**
 * Bazadagi yuklamalarni (video/thumbnail baytlarini) oqim qilib beradi.
 * UploadChunk qatorlari tartib bilan o'qib ReadableStream ga yuboriladi —
 * butun fayl xotiraga yuklanmaydi. <video> uchun Range (206) so'rovlari
 * ham qo'llab-quvvatlanadi (seek ishlashi uchun).
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const file = await db.uploadFile.findUnique({ where: { id } });
    if (!file) {
      return new Response("Not found", { status: 404 });
    }

    // Umumiy hajm — bo'laklar baytlari yig'indisi
    const agg = await db.uploadChunk.aggregate({
      _sum: { bytes: true },
      where: { fileId: id },
    });
    const total = agg._sum.bytes ?? 0;
    if (total <= 0) {
      return new Response("Not found", { status: 404 });
    }

    const baseHeaders: Record<string, string> = {
      "Content-Type": file.mime || "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };

    // --- Range: bytes=start[-end] ---
    const rangeHeader = req.headers.get("range");
    let start = 0;
    let end = total - 1;
    let partial = false;
    if (rangeHeader) {
      const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
      if (m) {
        if (m[1] === "" && m[2] === "") {
          // bytes=- : butun fayl
        } else if (m[1] === "") {
          // oxirgi N bayt: bytes=-N
          const n = Math.min(parseInt(m[2], 10) || 0, total);
          start = total - n;
          end = total - 1;
          partial = true;
        } else {
          start = Math.min(parseInt(m[1], 10) || 0, total - 1);
          end = m[2] ? Math.min(parseInt(m[2], 10) || total - 1, total - 1) : total - 1;
          partial = true;
        }
        if (start > end) {
          return new Response("Range Not Satisfiable", {
            status: 416,
            headers: { "Content-Range": `bytes */${total}` },
          });
        }
      }
    }

    const contentLength = end - start + 1;

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          // Kerakli oraliqni bo'laklardan yig'ib beramiz
          const BATCH = 8;
          let offset = 0; // shu vaqtga qadar o'qilgan bayt
          let cursor = 0;
          let sent = 0;
          let done = false;
          while (!done) {
            const parts = await db.uploadChunk.findMany({
              where: { fileId: id, idx: { gte: cursor } },
              orderBy: { idx: "asc" },
              take: BATCH,
            });
            if (parts.length === 0) break;
            for (const part of parts) {
              const buf = Buffer.from(part.data, "base64");
              const partStart = offset;
              const partEnd = offset + buf.byteLength; // eksklyuziv
              offset = partEnd;
              if (partEnd <= start) continue; // butunlay oldinda
              if (partStart > end) {
                done = true;
                break;
              }
              const from = Math.max(0, start - partStart);
              const to = Math.min(buf.byteLength, end - partStart + 1); // eksklyuziv
              if (to > from) {
                controller.enqueue(new Uint8Array(buf.subarray(from, to)));
                sent += to - from;
                if (partStart + to > end) {
                  done = true;
                  break;
                }
              }
            }
            if (parts.length < BATCH) break;
            cursor = parts[parts.length - 1].idx + 1;
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: partial ? 206 : 200,
      headers: {
        ...baseHeaders,
        "Content-Length": String(contentLength),
        ...(partial ? { "Content-Range": `bytes ${start}-${end}/${total}` } : {}),
      },
    });
  } catch (error) {
    console.error("/api/files GET error:", error);
    return new Response("Server error", { status: 500 });
  }
}
