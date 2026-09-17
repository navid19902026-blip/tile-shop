import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const sendSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  const parsed = sendSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ورودی نامعتبر" }, { status: 400 });

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderType: "ADMIN",
      senderId: session.user.id,
      message: parsed.data.message,
    },
  });

  await prisma.chatConversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}
