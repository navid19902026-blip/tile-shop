"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" richColors dir="rtl" toastOptions={{ style: { fontFamily: "var(--font-vazirmatn)" } }} />
    </SessionProvider>
  );
}
