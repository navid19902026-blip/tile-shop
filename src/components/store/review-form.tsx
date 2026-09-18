"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { submitReview, type ReviewFormState } from "@/actions/reviews";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState: ReviewFormState = {};

export default function ReviewForm({ productId, productSlug }: { productId: string; productSlug: string }) {
  const t = useTranslations("review");
  const { data: session } = useSession();
  const [state, formAction] = useFormState(submitReview, initialState);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (state.success) toast.success(t("success"));
    if (state.error) toast.error(state.error);
  }, [state, t]);

  if (!session) {
    return <p className="text-sm text-slate-400">{t("loginRequired")}</p>;
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-100 p-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={t("ratingLabel", { n })}>
            <Star size={22} className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        placeholder={t("placeholder")}
        rows={3}
        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-400"
      />

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const t = useTranslations("review");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}
