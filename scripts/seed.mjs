import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const db = new PrismaClient();

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const hashOf = (label) =>
  createHash('sha256').update(`randap-demo-${label}-${Math.random()}`).digest('hex');

async function main() {
  await db.comment.deleteMany();
  await db.like.deleteMany();
  await db.subscription.deleteMany();
  await db.video.deleteMany();
  await db.user.deleteMany();

  const studio = await db.user.create({
    data: { deviceKey: 'demo-studio-key', name: 'Randap Studio', handle: '@randapstudio' },
  });
  const oila = await db.user.create({
    data: { deviceKey: 'demo-oila-key', name: 'Oila Media', handle: '@oilamedia' },
  });
  const tech = await db.user.create({
    data: { deviceKey: 'demo-tech-key', name: 'Tech Uz', handle: '@techuz' },
  });

  const videos = [
    { title: "Toshkent metropoliteni — to'liq sayohat", desc: "Shaharostaning eng go'zal bekatlari bo'ylab sayohat. Ovqat olib boring va yaxshi yorug'lik!", path: 'demo-metro', dur: 18, kind: 'video', up: studio, views: rand(12000, 98000) },
    { title: 'Osh qanday tayyorlanadi? Tez retsept', desc: "Haqiqiy osh retsepti: zirvador guruch, sabzi va gazanda mol go'shti. Qadam-baqadam ko'rsatilgan.", path: 'demo-osh', dur: 12, kind: 'video', up: oila, views: rand(5000, 50000) },
    { title: 'Dasturlashni 0 dan boshlash — 1-dars', desc: "HTML, CSS va JavaScript asoslari. Birinchi darsda nimalarni o'rganamiz? Ko'ring va izohga savol qoldiring!", path: 'demo-dars', dur: 15, kind: 'video', up: tech, views: rand(3000, 30000) },
    { title: 'Xiva shahri — sharq durdonasi', desc: "Ichan qal'a, Muhammad Aminzon minorasi va eski shahar ko'chalari. 4K sifatda suratga olindi.", path: 'demo-xiva', dur: 14, kind: 'video', up: studio, views: rand(8000, 70000) },
    { title: 'Bulutlar ustidan parvoz', desc: 'Samolyot oynasidan olingan lahzalar. Qisqa ammo taassurotli!', path: 'demo-short-parvoz', dur: 10, kind: 'short', up: studio, views: rand(20000, 150000) },
    { title: '5 soniyada fokus testi', desc: "Diqqatni tekshiring: ko'ring va javobini izohlarda yozing.", path: 'demo-short-fokus', dur: 8, kind: 'short', up: tech, views: rand(10000, 90000) },
    { title: 'Piyola choy va shahar manzarasi', desc: 'Tong vaqti choyxona manzarasi. Yaxshi kun boshlanishi!', path: 'demo-short-choy', dur: 12, kind: 'short', up: oila, views: rand(4000, 40000) },
  ];

  const commentTexts = [
    "Zo'r video! Davomini kutamiz.",
    "Rahmat, juda foydali bo'ldi.",
    "Qayerda suratga olgansiz? Joy chiroyli ekan.",
    "Izohdagi maslahatlar menga yordam berdi.",
    "Yana shunaqangi videolar qo'ying!",
    'Sifati juda yaxshi ekan.',
  ];

  for (const v of videos) {
    const created = await db.video.create({
      data: {
        title: v.title,
        description: v.desc,
        thumbPath: `uploads/thumbs/${v.path}.jpg`,
        videoPath: `uploads/videos/${v.path}.mp4`,
        hash: hashOf(v.path),
        kind: v.kind,
        durationSec: v.dur,
        allowComments: true,
        views: v.views,
        uploaderId: v.up.id,
      },
    });

    const likeCount = rand(20, 900);
    for (let i = 0; i < likeCount; i++) {
      await db.like
        .create({ data: { videoId: created.id, deviceId: `demo-like-${i}` } })
        .catch(() => {});
    }

    const commentCount = rand(1, 3);
    for (let i = 0; i < commentCount; i++) {
      await db.comment.create({
        data: {
          videoId: created.id,
          authorId: [studio, oila, tech][rand(0, 2)].id,
          body: commentTexts[rand(0, commentTexts.length - 1)],
        },
      });
    }
  }

  const counts = {
    users: await db.user.count(),
    videos: await db.video.count(),
    likes: await db.like.count(),
    comments: await db.comment.count(),
  };
  console.log('Seed tugadi:', JSON.stringify(counts));
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
