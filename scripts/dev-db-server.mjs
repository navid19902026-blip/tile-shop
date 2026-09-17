// Local-only dev database for verifying this app without a real PostgreSQL server.
// Runs Postgres-compiled-to-WASM (PGlite) in-process and exposes it over the real
// Postgres wire protocol so @prisma/client can connect normally via DATABASE_URL.
// Not part of the shipped app — see README for real deployment instructions.
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", ".devdb");
const schemaPath = path.join(__dirname, "dev-db-schema.sql");

const isFreshDb = !existsSync(dataDir);

const db = new PGlite(dataDir);
await db.waitReady;

if (isFreshDb) {
  console.log("[dev-db] fresh database, applying schema...");
  const schemaSql = readFileSync(schemaPath, "utf-8");
  await db.exec(schemaSql);
  console.log("[dev-db] schema applied");
} else {
  console.log("[dev-db] reusing existing database at .devdb");
}

const server = new PGLiteSocketServer({ db, port: 55432, host: "127.0.0.1" });
await server.start();
console.log("[dev-db] listening on postgresql://postgres:postgres@127.0.0.1:55432/postgres");

process.on("SIGINT", async () => {
  await server.stop();
  await db.close();
  process.exit(0);
});
