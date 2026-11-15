const { PrismaClient } = require('@prisma/client');

async function main() {
  const db = new PrismaClient();
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(messages, null, 2));
  await db.$disconnect();
}

main();
