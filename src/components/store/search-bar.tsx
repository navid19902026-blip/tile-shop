"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const t = useTranslations("nav");
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams?.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-brand-400 focus-within:bg-white">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
    </form>
  );
}
