"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/admin/orders";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const OPTIONS: OrderStatus[] = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
          toast.success("وضعیت سفارش به‌روزرسانی شد");
        });
      }}
      className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-brand-400"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>{ORDER_STATUS_LABELS[o]}</option>
      ))}
    </select>
  );
}
