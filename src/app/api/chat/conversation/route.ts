import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getOrCreateGuestId } from "@/lib/guest";

// Returns (creating if necessary) the current visitor's open conversation.
export async function GET() {
  const session = await auth();

  const conversation = session?.user
    ? await findOrCreateForUser(session.user.id)
    : await findOrCreateForGuest();

  return NextResponse.json({ conversation });
}

async function findOrCreateForUser(userId: string) {
  const existing = await prisma.chatConversation.findFirst({
    where: { userId, status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;
  return prisma.chatConversation.create({ data: { userId, status: "OPEN" } });
}

async function findOrCreateForGuest() {
  const guestId = await getOrCreateGuestId();
  const existing = await prisma.chatConversation.findFirst({
    where: { guestId, status: "OPEN" },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;
  return prisma.chatConversation.create({ data: { guestId, status: "OPEN" } });
}
