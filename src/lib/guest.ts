import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const GUEST_COOKIE = "guest_id";

/** Returns the current guest id from cookies, creating one if absent. Call only from a Server Action or Route Handler. */
export async function getOrCreateGuestId() {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(GUEST_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}

export async function readGuestId() {
  const store = await cookies();
  return store.get(GUEST_COOKIE)?.value ?? null;
}
