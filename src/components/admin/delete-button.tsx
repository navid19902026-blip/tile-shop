"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

export default function DeleteButton({
  action,
  confirmMessage = "آیا از حذف مطمئن هستید؟",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          await action();
          toast.success("با موفقیت حذف شد");
        });
      }}
      disabled={pending}
      className="text-slate-300 hover:text-red-500 disabled:opacity-50"
      aria-label="حذف"
    >
      <Trash2 size={16} />
    </button>
  );
}
