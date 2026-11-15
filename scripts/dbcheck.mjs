import { PrismaClient } from '@prisma/client';

async function main() {
  const db = new PrismaClient();
  const users = await db.user.findMany();
  const videos = await db.video.findMany({ select: { id: true, title: true, kind: true } });
  const likes = await db.like.count();
  const comments = await db.comment.count();
  const subs = await db.subscription.count();
  console.log(JSON.stringify({ users, videos, likes, comments, subs }, null, 2));
  await db.$disconnect();
}

main();
