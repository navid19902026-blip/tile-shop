import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminChatThread from "@/components/admin/admin-chat-thread";

export default async function AdminChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } }, user: true },
  });
  if (!conversation) notFound();

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-slate-900">
        گفتگو با {conversation.user?.name ?? conversation.guestName ?? "کاربر مهمان"}
      </h1>
      <p className="mb-6 text-xs text-slate-400">{conversation.user?.phone ?? conversation.user?.email ?? "کاربر مهمان (بدون حساب کاربری)"}</p>

      <AdminChatThread
        conversationId={conversation.id}
        initialMessages={conversation.messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
        initialStatus={conversation.status}
        initialHandledBy={conversation.handledBy}
      />
    </div>
  );
}
