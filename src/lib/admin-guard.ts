import { auth } from "@/lib/auth";

/** Throws if the current session is not an admin. Call at the top of every admin server action. */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("دسترسی غیرمجاز");
  }
  return session;
}
