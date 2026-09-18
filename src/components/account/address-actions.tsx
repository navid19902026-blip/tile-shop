"use client";

import { useTranslations } from "next-intl";
import { Trash2, Star } from "lucide-react";
import { deleteAddress, setDefaultAddress } from "@/actions/addresses";
import { toast } from "sonner";

export default function AddressActions({ addressId, isDefault }: { addressId: string; isDefault: boolean }) {
  const t = useTranslations("account");
  return (
    <div className="flex items-center gap-3">
      {!isDefault && (
        <button
          onClick={() => setDefaultAddress(addressId).then(() => toast.success(t("defaultAddressChanged")))}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600"
        >
          <Star size={14} />
          {t("default")}
        </button>
      )}
      <button
        onClick={() => deleteAddress(addressId).then(() => toast.success(t("addressDeleted")))}
        className="text-slate-300 hover:text-red-500"
        aria-label={t("deleteAddress")}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
