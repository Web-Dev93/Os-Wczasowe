import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// All Unsplash – no local assets
const IMGS = {
  ekskluzywny: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
  rodzinny:    "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=900&q=80",
  nowoczesny:  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80",
  rustykalny:  "https://images.unsplash.com/photo-1549778399-f94fd24c3b07?w=900&q=80",
  nadmorski:   "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
};

const STYLES = [
  {
    id: "ekskluzywny",
    name: "Ekskluzywny",
    emoji: "✦",
    desc: "Ciemny, złoty, luksusowy. Idealny dla wymagających gości i apartamentów premium.",
    img: IMGS.ekskluzywny,
    theme: {
      bg: "#0c0c14",
      text: "#f5f0e8",
      muted: "rgba(245,240,232,0.5)",
      accent: "#c9a227",
      btnText: "#0c0c14",
      radius: "0px",
      borderColor: "#1e1e2e",
      fontHead: "'Playfair Display', serif",
      fontBody: "'DM Sans', sans-serif",
    },
  },
  {
    id: "rodzinny",
    name: "Rodzinny",
    emoji: "☀",
    desc: "Ciepły, radosny, z letnią energią. Przyciąga rodziny i gości z dziećmi.",
    img: IMGS.rodzinny,
    theme: {
      bg: "#fdf8f2",
      text: "#1e293b",
      muted: "#6b7280",
      accent: "#2da8d8",
      btnText: "#ffffff",
      radius: "999px",
      borderColor: "#f0e6d8",
      fontHead: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
    },
  },
  {
    id: "nowoczesny",
    name: "Nowoczesny",
    emoji: "◼",
    desc: "Minimalistyczny, czarno-biały. Dla obiektu który stawia na designerską architekturę.",
    img: IMGS.nowoczesny,
    theme: {
      bg: "#ffffff",
      text: "#111111",
      muted: "#666666",
      accent: "#111111",
      btnText: "#ffffff",
      radius: "0px",
      borderColor: "#e5e5e5",
      fontHead: "'DM Sans', sans-serif",
      fontBody: "'DM Sans', sans-serif",
    },
  },
  {
    id: "rustykalny",
    name: "Rustykalny",
    emoji: "🌿",
    desc: "Drewno, zieleń, natura. Dla ośrodków w lesie, domków letniskowych i agroturystyki.",
    img: IMGS.rustykalny,
    theme: {
      bg: "#f5f0e8",
      text: "#2c1f0e",
      muted: "#7a6a55",
      accent: "#6b4c2a",
      btnText: "#f5f0e8",
      radius: "6px",
      borderColor: "#e0d4c0",
      fontHead: "'Playfair Display', serif",
      fontBody: "'DM Sans', sans-serif",
    },
  },
  {
    id: "nadmorski",
    name: "Nadmorski",
    emoji: "〰",
    desc: "Błękit morza, piasek, świeże powietrze. Klasyczny klimat polskiego wybrzeża.",
    img: IMGS.nadmorski,
    theme: {
      bg: "#f0f8ff",
      text: "#0d2b45",
      muted: "#4a7a9b",
      accent: "#0891b2",
      btnText: "#ffffff",
      radius: "8px",
      borderColor: "#c8e6f4",
      fontHead: "'Cormorant Garamond', serif",
      fontBody: "'DM Sans', sans-serif",
    },
  },
];

export function StylesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const s = STYLES[activeIdx];
  const t = s.theme;

  return (
    <section id="style" className="py-24 bg-card overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">5 Stylów do wyboru</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">Który to Twój?</h2>
          <p className="text-lg text-muted-foreground">
            Każdy styl to inny charakter, inne kolory, inne fonty. Ta sama funkcjonalność — inny klimat.
            Wybierz ten, który najlepiej oddaje ducha Twojego miejsca.
          </p>
        </div>

        {/* Style tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {STYLES.map((style, idx) => (
            <button
              key={style.id}
              onClick={() => setActiveIdx(idx)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                idx === activeIdx
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                  : "bg-background border border-border text-foreground hover:border-primary/40 hover:scale-102"
              }`}
            >
              <span className="text-base leading-none">{style.emoji}</span>
              {style.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-8 h-7">
          <AnimatePresence mode="wait">
            <motion.p
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-muted-foreground font-medium"
            >
              {s.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Browser mockup */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-foreground/10" style={{ minHeight: 560 }}>
            {/* Browser chrome */}
            <div className="h-10 bg-gray-100 flex items-center px-4 gap-1.5 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 bg-white rounded px-3 py-1 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
                willa-morska.pl
              </div>
            </div>

            {/* Site preview */}
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
                style={{ backgroundColor: t.bg, color: t.text, fontFamily: t.fontBody, minHeight: 520 }}
              >
                {/* Mock nav */}
                <header
                  className="flex items-center justify-between px-8 py-4 border-b"
                  style={{ borderColor: t.borderColor }}
                >
                  <div className="text-xl font-bold" style={{ fontFamily: t.fontHead }}>
                    Willa Morska
                  </div>
                  <div className="hidden md:flex gap-6 text-sm" style={{ color: t.muted }}>
                    <span>Pokoje</span><span>Galeria</span><span>Kontakt</span>
                  </div>
                  <button
                    className="px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: t.accent,
                      color: t.btnText,
                      borderRadius: t.radius,
                    }}
                  >
                    Rezerwuj
                  </button>
                </header>

                {/* Mock hero */}
                <div className="flex flex-col md:flex-row flex-1">
                  <div className="flex-1 px-8 md:px-14 py-12 flex flex-col justify-center">
                    <span
                      className="text-xs uppercase tracking-[0.2em] mb-4 block"
                      style={{ color: t.muted }}
                    >
                      Witamy nad Bałtykiem
                    </span>
                    <h1
                      className="text-4xl md:text-5xl mb-5 leading-tight"
                      style={{ fontFamily: t.fontHead }}
                    >
                      Twój idealny<br />wypoczynek.
                    </h1>
                    <p className="text-base mb-8 max-w-sm" style={{ color: t.muted }}>
                      Spokój, morski klimat i komfortowe apartamenty zaledwie krok od plaży.
                    </p>
                    {/* Date picker mockup */}
                    <div
                      className="flex flex-col sm:flex-row gap-0 border overflow-hidden max-w-sm"
                      style={{ borderColor: t.borderColor, borderRadius: t.radius === "999px" ? "16px" : t.radius }}
                    >
                      <div className="flex-1 px-4 py-3 border-r" style={{ borderColor: t.borderColor }}>
                        <div className="text-xs mb-0.5" style={{ color: t.muted }}>Przyjazd</div>
                        <div className="font-medium text-sm">12 lip 2025</div>
                      </div>
                      <div className="flex-1 px-4 py-3">
                        <div className="text-xs mb-0.5" style={{ color: t.muted }}>Wyjazd</div>
                        <div className="font-medium text-sm">19 lip 2025</div>
                      </div>
                      <button
                        className="px-6 py-3 font-semibold text-sm"
                        style={{ backgroundColor: t.accent, color: t.btnText }}
                      >
                        Szukaj
                      </button>
                    </div>
                  </div>

                  {/* Right image */}
                  <div className="w-full md:w-5/12 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Color overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="#kontakt"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25"
          >
            Ten styl jest mój — chcę taką stronę!
          </a>
        </div>
      </div>
    </section>
  );
}
