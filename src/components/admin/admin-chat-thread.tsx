"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Lock, Unlock, Bot, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { closeConversation, reopenConversation, returnConversationToAi } from "@/actions/admin/chat";

type Message = {
  id: string;
  senderType: "USER" | "ADMIN" | "AI";
  message: string;
  createdAt: string;
};

export default function AdminChatThread({
  conversationId,
  initialMessages,
  initialStatus,
  initialHandledBy,
}: {
  conversationId: string;
  initialMessages: Message[];
  initialStatus: "OPEN" | "CLOSED";
  initialHandledBy: "AI" | "HUMAN";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(initialStatus);
  const [handledBy, setHandledBy] = useState(initialHandledBy);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
      setStatus(data.status);
      setHandledBy(data.handledBy);
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    await fetch("/api/admin/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: text }),
    });
    setHandledBy("HUMAN");
    const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
    const data = await res.json();
    setMessages(data.messages);
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "OPEN" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
            {status === "OPEN" ? "باز" : "بسته"}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              handledBy === "AI" ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <Bot size={12} />
            {handledBy === "AI" ? "پاسخ‌دهی هوشمند" : "در دست پشتیبان انسانی"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {handledBy === "HUMAN" && (
            <button
              onClick={() =>
                returnConversationToAi(conversationId).then(() => {
                  setHandledBy("AI");
                  toast.success("گفتگو به هوش مصنوعی بازگردانده شد");
                })
              }
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600"
            >
              <RefreshCw size={14} />
              بازگرداندن به هوش مصنوعی
            </button>
          )}
          <button
            onClick={() => {
              const action = status === "OPEN" ? closeConversation : reopenConversation;
              action(conversationId).then(() => {
                setStatus(status === "OPEN" ? "CLOSED" : "OPEN");
                toast.success(status === "OPEN" ? "گفتگو بسته شد" : "گفتگو باز شد");
              });
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600"
          >
            {status === "OPEN" ? <Lock size={14} /> : <Unlock size={14} />}
            {status === "OPEN" ? "بستن تیکت" : "بازگشایی تیکت"}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
        {messages.map((m) => (
          <div key={m.id}>
            {m.senderType === "AI" && <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold text-indigo-400">
              <Bot size={11} /> هوش مصنوعی
            </div>}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-6",
                m.senderType === "USER"
                  ? "ml-auto rounded-bl-sm bg-white text-slate-800 shadow"
                  : m.senderType === "AI"
                    ? "mr-auto rounded-br-sm bg-indigo-50 text-indigo-900"
                    : "mr-auto rounded-br-sm bg-brand-500 text-white"
              )}
            >
              {m.message}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-slate-100 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پاسخ خود را بنویسید..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
        />
        <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
