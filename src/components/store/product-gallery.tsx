"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string | null }[];
  productName: string;
}) {
  const t = useTranslations("product");
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const current = images[active];

  function openLightbox() {
    if (!current) return;
    setZoomed(false);
    setLightboxOpen(true);
  }
  function closeLightbox() {
    setLightboxOpen(false);
  }
  function showRelative(delta: number) {
    setZoomed(false);
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-slate-50"
        onClick={openLightbox}
        role={current ? "button" : undefined}
        aria-label={current ? t("zoomImage") : undefined}
      >
        {current ? (
          <>
            <Image src={current.url} alt={current.alt ?? productName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white opacity-90 backdrop-blur-sm transition group-hover:opacity-100">
              <ZoomIn size={14} />
              {t("zoomImage")}
            </span>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">{t("noImage")}</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2",
                i === active ? "border-brand-500" : "border-transparent"
              )}
            >
              <Image src={img.url} alt={img.alt ?? productName} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("closeZoom")}
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showRelative(-1);
                }}
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
                aria-label={t("prevImage")}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showRelative(1);
                }}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
                aria-label={t("nextImage")}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className={cn("relative h-full w-full max-w-4xl overflow-auto", zoomed ? "cursor-zoom-out" : "cursor-zoom-in")}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            <div
              className={cn(
                "relative mx-auto my-auto aspect-square transition-transform duration-300",
                zoomed ? "h-[180%] w-[180%] scale-100" : "h-full w-full"
              )}
            >
              <Image
                src={current.url}
                alt={current.alt ?? productName}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
