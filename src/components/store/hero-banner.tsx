"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type BannerSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: string | null;
  gradient: string;
};

const AUTO_ADVANCE_MS = 5000;

export default function HeroBanner({ slides }: { slides: BannerSlide[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section className="relative overflow-hidden">
      <div className={cn("relative bg-gradient-to-l text-white transition-all duration-500", slide.gradient)}>
        {slide.image && (
          <Image
            src={slide.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 mix-blend-overlay"
          />
        )}
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div key={slide.id} className="animate-fade-in">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {slide.eyebrow}
            </span>
            <h1 className="text-3xl font-extrabold leading-relaxed md:text-4xl">{slide.title}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/90">{slide.description}</p>
            <Link
              href={slide.ctaHref}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-50"
            >
              {slide.ctaLabel}
              <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="hidden justify-self-end md:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="mt-6 h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="mt-6 h-36 w-36 rounded-2xl bg-white/10 backdrop-blur" />
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="اسلاید قبلی"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 backdrop-blur transition hover:bg-white/25 sm:flex"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={next}
              aria-label="اسلاید بعدی"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-2 backdrop-blur transition hover:bg-white/25 sm:flex"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  aria-label={`رفتن به اسلاید ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
