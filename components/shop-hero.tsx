"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { APP_NAME } from "@/lib/brand";

const SLIDES = [
  {
    id: "cosmetics",
    kicker: "化粧品",
    title: "少品種を、丁寧に。",
    href: "/products?category=化粧品#catalog",
    image: "/shop-hero.png",
    imageClass: "object-cover object-[20%_30%]",
    fit: "bleed" as const,
  },
  {
    id: "health",
    kicker: "健康商品",
    title: "内側から、整える。",
    href: "/products?category=健康商品#catalog",
    image: "/shop-hero-health.png",
    imageClass: "object-contain object-center",
    fit: "still" as const,
  },
];

export function ShopHero() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label={APP_NAME} className="relative overflow-hidden bg-surface">
      <div className="relative h-[320px] sm:h-[400px] lg:h-[460px]">
        {SLIDES.map((item, itemIndex) => (
          <div
            key={item.id}
            aria-hidden={itemIndex !== index}
            className={`absolute inset-0 bg-white transition-opacity duration-700 ${
              itemIndex === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
          >
            {item.fit === "still" ? (
              <>
                <div className="absolute inset-0 bg-[#cfe4f0]" />
                <div className="absolute inset-y-0 right-0 w-full sm:w-[62%]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 62vw, 100vw"
                    className={item.imageClass}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent sm:from-white sm:via-white/55 sm:to-transparent" />
              </>
            ) : (
              <>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  priority={itemIndex === 0}
                  sizes="100vw"
                  className={item.imageClass}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
              </>
            )}
          </div>
        ))}

        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="mx-auto flex w-full max-w-[1120px] px-4 sm:px-6">
            <div className="max-w-[18rem] text-forest-strong sm:max-w-md">
              <p className="text-[11px] font-medium tracking-[0.52em]">
                {slide.kicker}
              </p>
              <span className="mt-3 block h-px w-10 bg-gold" aria-hidden />
              <p className="mt-3 font-[family-name:var(--font-heading)] text-[clamp(28px,4.2vw,44px)] font-semibold leading-[1.25] tracking-[0.04em]">
                {slide.title}
              </p>
              <Link
                href={slide.href}
                aria-label={`${slide.kicker}を見る`}
                className="mt-6 inline-flex h-11 min-w-[132px] items-center justify-center border border-forest bg-white px-8 text-[12px] font-medium tracking-[0.38em] text-forest-strong transition-colors duration-200 hover:bg-forest hover:text-white"
              >
                詳細
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 z-[3] hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-forest/20 bg-white text-forest-strong transition-opacity hover:opacity-80 sm:inline-flex"
          aria-label="前のスライド"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 z-[3] hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-forest/20 bg-white text-forest-strong transition-opacity hover:opacity-80 sm:inline-flex"
          aria-label="次のスライド"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 z-[3] flex justify-center gap-2">
          {SLIDES.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${item.kicker}のスライド`}
              aria-current={itemIndex === index ? "true" : undefined}
              onClick={() => go(itemIndex)}
              className={`h-1.5 rounded-full transition-all ${
                itemIndex === index
                  ? "w-8 bg-forest"
                  : "w-2.5 bg-forest/30 hover:bg-forest/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
