import fs from "fs";
import path from "path";
import { Client } from "@neondatabase/serverless";
import "dotenv/config";

const filePath = process.argv[2];

if (!filePath) {
  console.error("❌ Provide a SQL file path");
  console.error(
    "👉 Example: npm run run-sql db/migrations/001_create_users.sql"
  );
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

async function main() {
  const sql = fs.readFileSync(fullPath, "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  try {
    console.log(`▶ Running ${filePath}`);
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log(`✅ ${filePath} executed successfully`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`❌ Failed to execute ${filePath}`);
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
