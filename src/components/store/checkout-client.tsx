"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Truck, Tag, Award, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatToman, TIER_LABELS, toPersianDigits } from "@/lib/utils";
import { placeOrderAndRedirect } from "@/actions/checkout";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
};

const SHIPPING_COST = 350_000;
const FREE_SHIPPING_THRESHOLD = 15_000_000;

export default function CheckoutClient({
  addresses,
  loyaltyPoints,
  pointValueInToman,
  tierPercent,
  tier,
}: {
  addresses: Address[];
  loyaltyPoints: number;
  pointValueInToman: number;
  tierPercent: number;
  tier: string;
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [addressId, setAddressId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [shippingMethod, setShippingMethod] = useState<"post" | "peyk">("post");
  const [discountCode, setDiscountCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && items.length === 0) router.push("/cart");
  }, [mounted, items, router]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tierDiscount = Math.round((subtotal * tierPercent) / 100);
  const pointsDiscount = usePoints ? loyaltyPoints * pointValueInToman : 0;
  const estimatedDiscount = tierDiscount + pointsDiscount;
  const shippingCost = subtotal - estimatedDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal - estimatedDiscount) + shippingCost;

  async function handleSubmit() {
    if (!addressId) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    setLoading(true);
    const result = await placeOrderAndRedirect({
      addressId,
      shippingMethod,
      discountCode: discountCode || undefined,
      usePoints,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    }).catch((e) => {
      // redirect() throws internally on success; only real errors land here as non-redirect exceptions
      if (e?.digest?.startsWith?.("NEXT_REDIRECT")) throw e;
      return { error: "خطایی در ثبت سفارش رخ داد" };
    });
    setLoading(false);
    if (result?.error) toast.error(result.error);
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">تسویه حساب</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section icon={<MapPin size={17} />} title="آدرس ارسال">
            {addresses.length === 0 ? (
              <p className="text-sm text-slate-400">
                آدرسی ثبت نشده. از{" "}
                <a href="/account/addresses" className="font-medium text-brand-600 hover:underline">
                  صفحه آدرس‌ها
                </a>{" "}
                یک آدرس اضافه کنید.
              </p>
            ) : (
              <div className="space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                      addressId === a.id ? "border-brand-400 bg-brand-50/50" : "border-slate-200"
                    }`}
                  >
                    <input type="radio" name="address" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1 accent-brand-500" />
                    <div>
                      <div className="font-bold text-slate-800">{a.fullName}</div>
                      <div className="text-xs text-slate-500">{a.province}، {a.city}، {a.addressLine}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </Section>

          <Section icon={<Truck size={17} />} title="روش ارسال">
            <div className="space-y-2">
              <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${shippingMethod === "post" ? "border-brand-400 bg-brand-50/50" : "border-slate-200"}`}>
                <span className="flex items-center gap-2">
                  <input type="radio" checked={shippingMethod === "post"} onChange={() => setShippingMethod("post")} className="accent-brand-500" />
                  پست پیشتاز
                </span>
                <span className="text-slate-500">{formatToman(SHIPPING_COST)}</span>
              </label>
              <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${shippingMethod === "peyk" ? "border-brand-400 bg-brand-50/50" : "border-slate-200"}`}>
                <span className="flex items-center gap-2">
                  <input type="radio" checked={shippingMethod === "peyk"} onChange={() => setShippingMethod("peyk")} className="accent-brand-500" />
                  پیک موتوری (فقط تهران)
                </span>
                <span className="text-slate-500">{formatToman(SHIPPING_COST)}</span>
              </label>
              <p className="text-xs text-slate-400">سفارش‌های بالای {formatToman(FREE_SHIPPING_THRESHOLD)} ارسال رایگان دارند.</p>
            </div>
          </Section>

          <Section icon={<Tag size={17} />} title="کد تخفیف">
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="کد تخفیف را وارد کنید"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </Section>

          {loyaltyPoints > 0 && (
            <Section icon={<Award size={17} />} title="باشگاه مشتریان">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="accent-brand-500" />
                  استفاده از {toPersianDigits(loyaltyPoints)} امتیاز ({formatToman(loyaltyPoints * pointValueInToman)} تخفیف)
                </span>
              </label>
              {tierPercent > 0 && (
                <p className="mt-2 text-xs text-emerald-600">
                  شما مشتری سطح {TIER_LABELS[tier]} هستید و {toPersianDigits(tierPercent)}٪ تخفیف ویژه دریافت می‌کنید.
                </p>
              )}
            </Section>
          )}
        </div>

        <div className="h-fit space-y-3 rounded-2xl border border-slate-100 p-5">
          <h2 className="mb-1 text-sm font-bold text-slate-800">خلاصه سفارش</h2>
          <Row label="جمع کالاها" value={formatToman(subtotal)} />
          {estimatedDiscount > 0 && <Row label="تخفیف" value={`-${formatToman(estimatedDiscount)}`} />}
          <Row label="هزینه ارسال" value={shippingCost === 0 ? "رایگان" : formatToman(shippingCost)} />
          <div className="border-t border-slate-100 pt-3">
            <Row label="مبلغ قابل پرداخت" value={formatToman(total)} bold />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || addresses.length === 0}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            پرداخت و ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-bold text-slate-900" : "text-slate-500"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
