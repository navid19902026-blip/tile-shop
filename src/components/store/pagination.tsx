import { Link } from "@/i18n/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-slate-300">…</span>}
          <Link
            href={buildHref(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
              p === page ? "bg-brand-500 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </Link>
    </div>
  );
}
