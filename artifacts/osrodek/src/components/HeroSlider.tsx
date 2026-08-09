import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const DEFAULT_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    kb: "a" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80",
    kb: "b" as const,
  },
  {
    img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1920&q=80",
    kb: "c" as const,
  },
];

interface Props {
  tagline?: string | null;
  description?: string | null;
  heroImageUrl?: string | null;
}

export function HeroSlider({ tagline, description, heroImageUrl }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // key changes every slide-switch so hero-text animations restart
  const [textKey, setTextKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = heroImageUrl
    ? [{ img: heroImageUrl, kb: "a" as const }, ...DEFAULT_SLIDES.slice(1)]
    : DEFAULT_SLIDES;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent((idx + slides.length) % slides.length);
      setTextKey((k) => k + 1);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 5800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, paused]);

  const handleDot = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(i);
  };

  const title = tagline || "Twój wypoczynek nad Bałtykiem";
  const raw = description ?? "";
  const subtitle = raw.length > 120
    ? raw.substring(0, raw.lastIndexOf(" ", 120)) + "…"
    : raw || "Poczuj smak wolności — szum fal, zapach soli i czas tylko dla Ciebie.";

  return (
    <section
      className="relative h-[92vh] min-h-[600px] max-h-[900px] overflow-hidden select-none"
      style={{ background: "linear-gradient(160deg, #1a3556 0%, #1b5e7b 40%, #16788a 70%, #0e9aa7 100%)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide${i === current ? " hero-slide--active" : ""}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.img}
            alt=""
            className={`hero-slide__img${i === current ? ` ken-burns-${slide.kb}` : ""}`}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="hero-overlay" />

      {/* Side arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 focus-visible:outline-none"
        aria-label="Poprzednie"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 focus-visible:outline-none"
        aria-label="Następne"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 md:pb-28 px-4 text-center">
        <div key={textKey} className="max-w-4xl mx-auto">
          <p className="hero-text-1 text-white/80 text-sm md:text-base uppercase tracking-[0.25em] font-medium mb-4">
            Ośrodek Nad Morzem
          </p>
          <h1 className="hero-text-2 text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.08] mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="hero-text-3 text-base md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
          <div className="hero-text-3 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-base rounded-full shadow-2xl shadow-black/40 hover:scale-105 transition-transform"
            >
              <Link href="/rezerwacja">Zarezerwuj pobyt</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 text-base rounded-full bg-white/10 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Link href="/pokoje">Nasze pokoje</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Slajd ${i + 1}`}
            className={`rounded-full transition-all duration-400 focus-visible:outline-none ${
              i === current
                ? "w-8 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div
          key={`${current}-${textKey}`}
          className="h-full bg-white/60"
          style={{
            animation: paused ? "none" : "progressBar 5.8s linear both",
          }}
        />
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
