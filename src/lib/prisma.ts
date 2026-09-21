import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Neon's driver pools connections over WebSocket (wss://, port 443) instead
// of a raw Postgres TCP socket (port 5432). Some hosts (this project's PaaS
// included) block outbound TCP on 5432 while allowing normal HTTPS/WSS
// egress, which made the plain `postgresql://` connection unreachable in
// production. Node.js has no global WebSocket implementation before v22, so
// the `ws` package is wired in explicitly.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
