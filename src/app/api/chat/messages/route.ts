import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { readGuestId } from "@/lib/guest";
import { generateAiReply } from "@/lib/chat-ai";
import { z } from "zod";

// GET /api/chat/messages?conversationId=... — poll for messages in a conversation.
export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ error: "conversationId الزامی است" }, { status: 400 });

  const conversation = await assertAccess(conversationId);
  if (!conversation) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages, status: conversation.status, handledBy: conversation.handledBy });
}

const sendSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1).max(2000),
  locale: z.enum(["fa", "az", "en", "ka"]).optional(),
});

// POST /api/chat/messages — send a message as the current user or guest.
// If the conversation is still AI-handled, this also generates and saves the assistant's reply before responding.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

  const conversation = await assertAccess(parsed.data.conversationId);
  if (!conversation) return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });

  const session = await auth();
  const locale = parsed.data.locale ?? conversation.locale ?? "fa";

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderType: "USER",
      senderId: session?.user?.id ?? null,
      message: parsed.data.message,
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date(), status: "OPEN", locale },
  });

  if (conversation.handledBy === "AI") {
    const history = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const { text, handoff } = await generateAiReply(
      locale,
      history.map((h) => ({ role: h.senderType, message: h.message }))
    );

    await prisma.chatMessage.create({
      data: { conversationId: conversation.id, senderType: "AI", message: text },
    });

    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date(), ...(handoff ? { handledBy: "HUMAN" } : {}) },
    });
  }

  return NextResponse.json({ message });
}

async function assertAccess(conversationId: string) {
  const session = await auth();
  const conversation = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return null;

  if (session?.user) {
    if (conversation.userId === session.user.id || session.user.role === "ADMIN") return conversation;
    return null;
  }

  const guestId = await readGuestId();
  if (guestId && conversation.guestId === guestId) return conversation;
  return null;
}
