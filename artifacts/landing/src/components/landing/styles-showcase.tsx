import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const STYLES = [
  {
    id: "ekskluzywny",
    themeKey: "exclusive",
    name: "Ekskluzywny",
    emoji: "✦",
    desc: "Ciemny, złoty, luksusowy. Idealny dla wymagających gości i apartamentów premium.",
    accent: "#c9a227",
  },
  {
    id: "rodzinny",
    themeKey: "family",
    name: "Rodzinny",
    emoji: "☀",
    desc: "Ciepły, radosny, z letnią energią. Przyciąga rodziny z dziećmi.",
    accent: "#2da8d8",
  },
  {
    id: "nowoczesny",
    themeKey: "modern",
    name: "Nowoczesny",
    emoji: "◼",
    desc: "Minimalistyczny, czarno-biały. Dla obiektu który stawia na designerską architekturę.",
    accent: "#111111",
  },
  {
    id: "rustykalny",
    themeKey: "rustic",
    name: "Rustykalny",
    emoji: "🌿",
    desc: "Drewno, zieleń, natura. Dla domków letniskowych i agroturystyki.",
    accent: "#6b4c2a",
  },
  {
    id: "nadmorski",
    themeKey: "professional",
    name: "Nadmorski",
    emoji: "〰",
    desc: "Błękit morza, piasek, świeże powietrze. Klasyczny klimat polskiego wybrzeża.",
    accent: "#1e3a6b",
  },
];

// Scale the 1280px-wide site to fit the preview container
const SITE_WIDTH = 1280;
const SITE_HEIGHT = 780;

export function StylesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.82);
  const s = STYLES[activeIdx];

  // Compute scale based on container width
  useEffect(() => {
    function computeScale() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setScale(Math.min(1, w / SITE_WIDTH));
      }
    }
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  function switchStyle(idx: number) {
    if (idx === activeIdx) return;
    setLoading(true);
    setActiveIdx(idx);
  }

  const iframeSrc = `/?theme=${s.themeKey}`;
  const containerHeight = Math.round(SITE_HEIGHT * scale);

  return (
    <section id="style" className="py-24 bg-card overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">5 Stylów do wyboru</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">Który to Twój?</h2>
          <p className="text-lg text-muted-foreground">
            Kliknij styl i zobaczysz na żywo jak będzie wyglądać Twoja strona.
            Ta sama funkcjonalność — inny klimat.
          </p>
        </div>

        {/* Style tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
          {STYLES.map((style, idx) => (
            <button
              key={style.id}
              onClick={() => switchStyle(idx)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                idx === activeIdx
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                  : "bg-background border border-border text-foreground hover:border-primary/40"
              }`}
            >
              <span className="text-base leading-none">{style.emoji}</span>
              {style.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-6 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={s.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground text-sm font-medium"
            >
              {s.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Browser frame + live iframe */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-foreground/10">

            {/* Browser chrome */}
            <div className="h-10 bg-gray-100 flex items-center px-4 gap-1.5 border-b border-gray-200 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 flex justify-center">
                <div className="bg-white border border-gray-200 rounded px-3 py-0.5 text-xs text-gray-400 w-64 text-center truncate">
                  willa-morska.pl?theme={s.themeKey}
                </div>
              </div>
              <div
                className="ml-auto w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: s.accent }}
              />
            </div>

            {/* Iframe container with exact scaled height */}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden bg-white"
              style={{ height: containerHeight }}
            >
              {/* Loading spinner overlay */}
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-medium">Ładowanie podglądu…</p>
                  </div>
                </div>
              )}

              <iframe
                key={s.themeKey}
                src={iframeSrc}
                title={`Podgląd stylu: ${s.name}`}
                onLoad={() => setLoading(false)}
                className="absolute top-0 left-0 border-0 pointer-events-none"
                style={{
                  width: `${SITE_WIDTH}px`,
                  height: `${SITE_HEIGHT}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
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
