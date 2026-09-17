"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserTier } from "@/actions/admin/users";
import { TIER_LABELS } from "@/lib/utils";
import type { LoyaltyTierLevel } from "@prisma/client";

const OPTIONS: LoyaltyTierLevel[] = ["BRONZE", "SILVER", "GOLD"];

export default function UserTierSelect({ userId, tier }: { userId: string; tier: LoyaltyTierLevel }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={tier}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as LoyaltyTierLevel;
        startTransition(async () => {
          await updateUserTier(userId, next);
          toast.success("سطح مشتری به‌روزرسانی شد");
        });
      }}
      className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-brand-400"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>{TIER_LABELS[o]}</option>
      ))}
    </select>
  );
}
