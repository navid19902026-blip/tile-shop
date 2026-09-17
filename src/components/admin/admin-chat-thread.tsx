"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { closeConversation, reopenConversation } from "@/actions/admin/chat";

type Message = {
  id: string;
  senderType: "USER" | "ADMIN";
  message: string;
  createdAt: string;
};

export default function AdminChatThread({
  conversationId,
  initialMessages,
  initialStatus,
}: {
  conversationId: string;
  initialMessages: Message[];
  initialStatus: "OPEN" | "CLOSED";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(initialStatus);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
      setStatus(data.status);
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
    const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
    const data = await res.json();
    setMessages(data.messages);
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status === "OPEN" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
          {status === "OPEN" ? "باز" : "بسته"}
        </span>
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

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-6",
              m.senderType === "ADMIN"
                ? "mr-auto rounded-br-sm bg-brand-500 text-white"
                : "ml-auto rounded-bl-sm bg-white text-slate-800 shadow"
            )}
          >
            {m.message}
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
