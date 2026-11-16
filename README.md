# Randap — video platforma + testlar + o'rganish + chat

Randap — YouTubega o'xshagan video/Shorts platforma, barcha fanlardan testlar
(alohida Ballar reytingi), uzun maqolalar bo'limi (O'rganish) va Telegram-ga
o'xshagan chat (random chat, stikerlar, rasm yuborish) bilan.

Saytga kirish darvozasi bor: ism + Gmail kiritiladi, "Google orqali kirish"
tugmasi bilan tasdiqlanadi. Sayt 3 tilda ishlaydi: **English (standart),
Русский, O'zbekcha** — Profil yonidagi ⚙ gildirak orqali almashtiriladi.

## Texnologiyalar

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui
- Prisma ORM + SQLite (`db/custom.db` — demo ma'lumotlar bilan birga keldi)
- Real-time o'rniga polling (chat: typing, online, o'qilmagan xabarlar)

## Lokal ishga tushirish

Talab: [Node.js 20+](https://nodejs.org) yoki [Bun](https://bun.sh), Git.

```bash
# 1) Paketlarni o'rnatish
npm install        # yoki: bun install

# 2) Muhit faylini yaratish
cp .env.example .env

# 3) Ma'lumotlar bazasini yangilash (ixtiyoriy — demo bazasi allaqachon bor)
npx prisma db push # yoki: bun run db:push

# 4) Ishga tushirish
npm run dev        # yoki: bun run dev
```

Brauzerda `http://localhost:3000` oching — avval ism + Gmail kiritiladi,
so'ngra asosiy menyu (4 bo'lim + Ballar) ochiladi.

## Skriptlar

| Buyruq | Vazifa |
| --- | --- |
| `dev` | Dev server (port 3000) |
| `build` + `start` | Production build va ishga tushirish (standalone) |
| `lint` | ESLint tekshiruvi |
| `db:push` | Prisma sxemani bazaga qo'llash |
| `db:generate` | Prisma client yaratish |

## Loyiha tuzilishi

```
prisma/schema.prisma      — DB sxema (User, Video, Quiz, ChatProfile, AuthAccount...)
src/app/api/              — REST API (videos, sections, chat/*, auth, upload...)
src/components/randap/    — butun interfeys (portal, watch, shorts, chat, organish...)
src/lib/randap-i18n.ts    — 3 tilli lug'at (en/ru/uz)
public/uploads/           — demo video, shorts va rasmlar
db/custom.db              — demo ma'lumotlar bilan SQLite baza
```

## Deploy (Vercel)

**Muhim:** SQLite va `public/uploads` fayl tizimi Vercelda doimiy saqlanmaydi
(serverless). To'liq ishlashi uchun:

1. Baza: Prisma provider'ini `sqlite` → `postgresql` (Neon/Supabase) yoki
   Turso (libSQL) ga o'zgartirib, `DATABASE_URL` ni Vercel env'da berish;
2. Yuklamalar: video/rasm uchun Vercel Blob / S3 / Cloudinary ulash;
3. `package.json` dagi `build` skriptini Vercel uchun sodda `next build`
   qilib ko'rish mumkin.

Yoki demo maqsadlarida: repni Vercelga ulab, `DATABASE_URL` env'ini
`file:/tmp/custom.db` qilib build qilsa ham bo'ladi (har deployda bazani
qayta yaratadi).
