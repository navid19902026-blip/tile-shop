import type { NextAuthConfig } from "next-auth";

// Edge-safe NextAuth config: no Prisma adapter, no DB-backed providers.
// Used by middleware (which runs on the Edge Runtime, where the Node.js
// Prisma client can't open a raw TCP connection). The full config with the
// Prisma adapter and Credentials provider lives in auth.ts, used only in
// Node.js runtime contexts (API routes, Server Components).
export const authConfig: NextAuthConfig = {
  // This host sits behind Parspack's reverse proxy, which doesn't forward
  // request headers in a way Auth.js can verify against AUTH_URL by default.
  // Without trustHost, Auth.js rejects the host on every request, which
  // showed up as an infinite redirect loop on every page.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CUSTOMER" | "ADMIN") ?? "CUSTOMER";
      }
      return session;
    },
  },
};
