import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminChatsPage() {
  const conversations = await prisma.chatConversation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { name: true, phone: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">گفتگوهای پشتیبانی</h1>

      <div className="space-y-2">
        {conversations.map((c) => (
          <Link
            key={c.id}
            href={`/admin/chats/${c.id}`}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 hover:border-brand-200"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{c.user?.name ?? c.guestName ?? "کاربر مهمان"}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c.status === "OPEN" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                  {c.status === "OPEN" ? "باز" : "بسته"}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-slate-400">{c.messages[0]?.message ?? "بدون پیام"}</p>
            </div>
            <span className="text-xs text-slate-300">{new Date(c.updatedAt).toLocaleString("fa-IR")}</span>
          </Link>
        ))}
        {conversations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
            هنوز گفتگویی ثبت نشده است
          </div>
        )}
      </div>
    </div>
  );
}
