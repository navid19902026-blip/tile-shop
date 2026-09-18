"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";

export default function MobileNav({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="باز کردن منو"
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        <MenuIcon size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative mr-auto flex h-full w-72 flex-col bg-white p-4 shadow-xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-brand-600">منو</span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/products" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-brand-50">
                همه محصولات
              </Link>
              <Link href="/brands" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-brand-50">
                برندها
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-brand-50"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
