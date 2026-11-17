/**
 * Migrate seed data (exported from SQLite) into the Postgres database.
 * Usage: set -a; source .env.vercel; set +a; node prisma/migrate-seed.mjs
 */
import { PrismaClient, Prisma } from "@prisma/client";
import data from "./seed-data.json" with { type: "json" };

const db = new PrismaClient({ log: ["error"] });

// Field type map from the Prisma schema (model name -> field -> type)
const TYPES = {};
for (const model of Prisma.dmmf.datamodel.models) {
  TYPES[model.name] = Object.fromEntries(
    model.fields.map((f) => [f.name, f.type])
  );
}

/** Convert SQLite-ish raw values to what Prisma/Postgres expects. */
function coerce(model, row) {
  const fixed = { ...row };
  const ft = TYPES[model] || {};
  for (const [k, v] of Object.entries(fixed)) {
    const t = ft[k];
    if (!t) continue;
    if (t === "DateTime") {
      if (typeof v === "number" && v > 1e12) fixed[k] = new Date(v);
      else if (typeof v === "string") fixed[k] = new Date(v);
    } else if (t === "Boolean" && typeof v === "number") {
      fixed[k] = v !== 0;
    } else if ((t === "Int" || t === "Float" || t === "BigInt") && typeof v === "string") {
      const num = Number(v);
      if (!Number.isNaN(num)) fixed[k] = num;
    }
  }
  return fixed;
}

const ORDER = [
  "User",
  "Subject",
  "Video",
  "Lesson",
  "Quiz",
  "Question",
  "ChatProfile",
  "Like",
  "Comment",
  "Subscription",
  "QuizAttempt",
  "Conversation",
  "Message",
  "RandomQueue",
  "AuthAccount",
];

async function main() {
  for (const table of ORDER) {
    const rows = data[table] || [];
    if (!rows.length) {
      console.log(`${table}: 0 rows, skipped`);
      continue;
    }
    const key = table.charAt(0).toLowerCase() + table.slice(1);
    const client = db[key];
    if (!client) throw new Error(`No prisma model named ${key}`);
    let n = 0;
    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500).map((r) => coerce(table, r));
      await client.createMany({ data: chunk, skipDuplicates: true });
      n += chunk.length;
    }
    console.log(`${table}: inserted ${n}`);
  }
  console.log("Migration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
