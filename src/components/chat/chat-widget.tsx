"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  senderType: "USER" | "ADMIN" | "AI";
  message: string;
  createdAt: string;
};

const POLL_INTERVAL_MS = 4000;

export default function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [handledBy, setHandledBy] = useState<"AI" | "HUMAN">("AI");
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    fetch("/api/chat/conversation")
      .then((r) => r.json())
      .then((d) => setConversationId(d.conversation.id));
  }, [open]);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    async function poll() {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setMessages(data.messages);
      setHandledBy(data.handledBy);
      if (!open && data.messages.length > lastCountRef.current) {
        setUnread((u) => u + (data.messages.length - lastCountRef.current));
      }
      lastCountRef.current = data.messages.length;
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [conversationId, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open, messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    let cid = conversationId;
    if (!cid) {
      const res = await fetch("/api/chat/conversation");
      const data = await res.json();
      cid = data.conversation.id;
      setConversationId(cid);
    }
    const text = input;
    setInput("");
    setSending(true);
    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: cid, message: text, locale }),
      });
      const res = await fetch(`/api/chat/messages?conversationId=${cid}`);
      const data = await res.json();
      setMessages(data.messages);
      setHandledBy(data.handledBy);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {open && (
        <div className="mb-3 flex h-[26rem] w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between bg-brand-500 px-4 py-3 text-white">
            <span className="text-sm font-bold">{t("title")}</span>
            <button onClick={() => setOpen(false)} aria-label={t("close")}>
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {messages.length === 0 && (
              <p className="mt-6 text-center text-xs text-slate-400">{t("greeting")}</p>
            )}
            {messages.map((m) => (
              <div key={m.id}>
                {m.senderType === "AI" && (
                  <div className="mb-0.5 flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                    <Bot size={11} /> {t("aiLabel")}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                    m.senderType === "USER"
                      ? "mr-auto rounded-br-sm bg-brand-500 text-white"
                      : m.senderType === "AI"
                        ? "ml-auto rounded-bl-sm bg-indigo-50 text-indigo-900 shadow"
                        : "ml-auto rounded-bl-sm bg-white text-slate-800 shadow"
                  )}
                >
                  {m.message}
                </div>
              </div>
            ))}
            {messages.length > 0 && handledBy === "HUMAN" && (
              <p className="pt-1 text-center text-[11px] text-slate-400">{t("humanConnected")}</p>
            )}
            {sending && (
              <div className="ml-auto flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-slate-100 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              disabled={sending}
              className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white disabled:opacity-60"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl transition hover:bg-brand-600"
        aria-label={t("widgetLabel")}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
