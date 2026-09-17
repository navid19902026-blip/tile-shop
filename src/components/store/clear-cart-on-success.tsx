"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

/** Empties the client-side cart once a payment result page reports success. */
export default function ClearCartOnSuccess() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
