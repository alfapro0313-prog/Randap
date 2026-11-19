# Randap — video platforma + testlar + o'rganish + chat

Randap — YouTubega o'xshagan video/Shorts platforma, barcha fanlardan testlar
(alohida Ballar reytingi), uzun maqolalar bo'limi (O'rganish) va Telegram-ga
o'xshagan chat (random chat, stikerlar, rasm yuborish) bilan.

Saytga kirish darvozasi bor: ism + Gmail kiritiladi, "Google orqali kirish"
tugmasi bilan tasdiqlanadi. Sayt 3 tilda ishlaydi: **English (standart),
Русский, O'zbekcha** — Profil yonidagi ⚙ gildirak orqali almashtiriladi.

## Texnologiyalar

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui
- Prisma ORM + PostgreSQL (Neon, Vercel'da ishlaydi; lokada `db/custom.db` SQLite arxiv sifatida qoladi)
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
| `db:push` | Lokal SQLite sxemani bazaga qo'llash (`schema.local.prisma`) |
| `db:generate` | Lokal Prisma client yaratish (`schema.local.prisma`) |

## Loyiha tuzilishi

```
prisma/schema.prisma      — DB sxema: Postgres (Vercel/Neon uchun)
prisma/schema.local.prisma — xuddi shu sxema, lokal uchun SQLite (DATABASE_URL)
src/app/api/              — REST API (videos, sections, chat/*, auth, upload...)
src/components/randap/    — butun interfeys (portal, watch, shorts, chat, organish...)
src/lib/randap-i18n.ts    — 3 tilli lug'at (en/ru/uz)
public/uploads/           — demo video, shorts va rasmlar
prisma/seed-data.json     — demo ma'lumotlar (Postgresga `prisma/migrate-seed.mjs` bilan yuklanadi)
```

Lokalda ishlatish: `bun run db:push` (SQLite) va kerak bo'lsa `bun run db:generate`.
Diqqat: `bun install`dan keyin postinstall Postgres sxemadan client yaratadi —
lokal devni davom ettirish uchun `bun run db:generate` ni qayta ishga tushiring.

## Deploy (Vercel)

Sayt allaqachon Vercelga deploy qilingan: **https://randap.vercel.app**

- Baza: **Neon Postgres** (Vercel Marketplace orqali ulangan, `POSTGRES_URL_NON_POOLING`
  env'i Vercel tomonidan avtomatik qo'shiladi);
- Demi ma'lumotlarni qayta yuklash: `source .env.vercel && node prisma/migrate-seed.mjs`;
- `public/uploads` dagi fayllar build bilan birga jonlanadi (demo kontenti).
