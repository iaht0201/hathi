"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Slide = {
  id: number;
  kicker: string;
  title: string;
  sub: string;
  cta: string;
  image: string;
};

const SLIDE_MS = 5000;

export const SliderHomePage = () => {
  const slides: Slide[] = [
    {
      id: 1,
      kicker: "New Season • Fall 2025",
      title: "Glow Up Your Routine",
      sub: "Vegan, cruelty-free essentials for everyday radiance.",
      cta: "Shop new arrivals",
      image:
        "https://youthvietnam.vn/wp-content/uploads/2021/05/banner-my-pham.jpg",
    },
    {
      id: 2,
      kicker: "Bundle & Save",
      title: "Skin First, Makeup Second",
      sub: "Up to 40% off curated skincare kits.",
      cta: "Explore bundles",
      image:
        "https://thegioidohoa.com/wp-content/uploads/2018/12/thi%E1%BA%BFt-k%E1%BA%BF-banner-m%E1%BB%B9-ph%E1%BA%A9m-6.png",
    },
    {
      id: 3,
      kicker: "Members Exclusive",
      title: "Scent Stories",
      sub: "Fragrances inspired by weekend escapes.",
      cta: "Join & shop",
      image:
        "https://invietnhat.vn/wp-content/uploads/2023/08/Top-nhung-mau-banner-my-pham-dep-10.jpg",
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Autoplay (dừng khi hover hoặc user set reduced motion)
  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, [paused, prefersReducedMotion, slides.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((s) => (s + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setIndex((s) => (s - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  // Swipe mobile
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) =>
    (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      setIndex((s) =>
        dx < 0
          ? (s + 1) % slides.length
          : (s - 1 + slides.length) % slides.length
      );
    }
    touchX.current = null;
  };

  const current = slides[index];

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Hero promotions"
    >
      <div className="container w-full  mx-auto px-2 my-2">
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="relative aspect-[16/9] w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                className="absolute inset-0"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                <div className="absolute left-12 right-5 sm:left-10 md:left-20 top-1/2 -translate-y-1/2 max-w-lg sm:max-w-xl text-white">
                  <p className="uppercase tracking-widest text-[10px] sm:text-xs md:text-sm opacity-90">
                    {current.kicker}
                  </p>
                  <h2 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                    {current.title}
                  </h2>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base opacity-90">
                    {current.sub}
                  </p>
                  <Button size="lg" className="mt-4 sm:mt-6 rounded-full">
                    {current.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2 sm:p-4">
              <div className="pointer-events-auto">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() =>
                    setIndex((s) => (s - 1 + slides.length) % slides.length)
                  }
                  aria-label="Previous slide"
                >
                  <ChevronLeft />
                </Button>
              </div>
              <div className="pointer-events-auto">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIndex((s) => (s + 1) % slides.length)}
                  aria-label="Next slide"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                    i === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SliderHomePage;
