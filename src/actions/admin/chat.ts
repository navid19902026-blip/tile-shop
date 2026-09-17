"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function closeConversation(conversationId: string) {
  await requireAdmin();
  await prisma.chatConversation.update({ where: { id: conversationId }, data: { status: "CLOSED" } });
  revalidatePath("/admin/chats");
  revalidatePath(`/admin/chats/${conversationId}`);
}

export async function reopenConversation(conversationId: string) {
  await requireAdmin();
  await prisma.chatConversation.update({ where: { id: conversationId }, data: { status: "OPEN" } });
  revalidatePath("/admin/chats");
  revalidatePath(`/admin/chats/${conversationId}`);
}
