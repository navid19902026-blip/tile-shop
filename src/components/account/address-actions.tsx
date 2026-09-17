"use client";

import { Trash2, Star } from "lucide-react";
import { deleteAddress, setDefaultAddress } from "@/actions/addresses";
import { toast } from "sonner";

export default function AddressActions({ addressId, isDefault }: { addressId: string; isDefault: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {!isDefault && (
        <button
          onClick={() => setDefaultAddress(addressId).then(() => toast.success("آدرس پیش‌فرض تغییر کرد"))}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600"
        >
          <Star size={14} />
          پیش‌فرض
        </button>
      )}
      <button
        onClick={() => deleteAddress(addressId).then(() => toast.success("آدرس حذف شد"))}
        className="text-slate-300 hover:text-red-500"
        aria-label="حذف آدرس"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
