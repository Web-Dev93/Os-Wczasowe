import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
  { id: "nadmorski", themeKey: "professional", name: "Nadmorski", desc: "Klasyczny klimat polskiego wybrzeża. Błękit, biel i przestrzeń." },
  { id: "ekskluzywny", themeKey: "exclusive", name: "Ekskluzywny", desc: "Ciemny, elegancki motyw. Idealny dla apartamentów premium." },
  { id: "rustykalny", themeKey: "rustic", name: "Rustykalny", desc: "Ciepło drewna i natury. Doskonały dla domków letniskowych." },
  { id: "nowoczesny", themeKey: "modern", name: "Nowoczesny", desc: "Minimalistyczny, czarno-biały. Dla designerskich obiektów." },
  { id: "rodzinny", themeKey: "family", name: "Rodzinny", desc: "Ciepły i radosny. Stworzony, by przyciągać rodziny z dziećmi." },
  { id: "wakacyjny", themeKey: "fun", name: "Wakacyjny", desc: "Energia i kolor. Dla ośrodków pełnych życia i letniej zabawy." },
];

const SITE_WIDTH = 1280;
const SITE_HEIGHT = 1000;

export function StylesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [view, setView] = useState<"site" | "admin">("site");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const s = STYLES[activeIdx];

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

  const iframeSrc = view === "site" 
    ? `/osrodek/?theme=${s.themeKey}&demo=1` 
    : `/osrodek/admin/login?theme=${s.themeKey}&demo=1`;
    
  const containerHeight = Math.round(SITE_HEIGHT * scale);

  return (
    <section id="demo" className="py-24 md:py-32 bg-background border-b border-border/50">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">Zaprojektowane, by zachwycać.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Wybierz motyw, który najlepiej oddaje charakter Twojego miejsca. 
            Możesz go w każdej chwili zmienić jednym kliknięciem w panelu.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {STYLES.map((style, idx) => (
              <button
                key={style.id}
                onClick={() => switchStyle(idx)}
                className={`px-5 py-2 rounded text-sm transition-all duration-300 ${
                  idx === activeIdx
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mb-8 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-sm"
            >
              {s.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 border border-border rounded bg-muted/30">
            <button
              onClick={() => { setLoading(true); setView("site"); }}
              className={`px-6 py-1.5 rounded text-xs tracking-wider uppercase transition-colors ${
                view === "site" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Strona gościa
            </button>
            <button
              onClick={() => { setLoading(true); setView("admin"); }}
              className={`px-6 py-1.5 rounded text-xs tracking-wider uppercase transition-colors ${
                view === "admin" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Panel Admina
            </button>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto">
          <div className="border border-border/60 rounded shadow-2xl bg-card overflow-hidden">
            
            {/* Browser Chrome */}
            <div className="h-12 bg-muted/20 border-b border-border/50 flex items-center px-4 relative">
              <div className="flex gap-2 absolute left-4">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <div className="mx-auto bg-background border border-border/50 rounded px-4 py-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                {view === "site" ? `twojosrodek.pl — ${s.name}` : `twojosrodek.pl/admin`}
              </div>
            </div>

            {/* Viewport */}
            <div ref={containerRef} className="relative w-full bg-background" style={{ height: containerHeight }}>
              
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background">
                  <div className="w-full h-full p-8 flex flex-col gap-6">
                    <div className="w-full h-48 skeleton-shimmer rounded" />
                    <div className="w-3/4 h-8 skeleton-shimmer rounded mx-auto" />
                    <div className="w-1/2 h-4 skeleton-shimmer rounded mx-auto" />
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <div className="h-32 skeleton-shimmer rounded" />
                      <div className="h-32 skeleton-shimmer rounded" />
                      <div className="h-32 skeleton-shimmer rounded" />
                    </div>
                  </div>
                </div>
              )}

              <iframe
                key={`${s.themeKey}-${view}`}
                src={iframeSrc}
                title={`Podgląd: ${s.name}`}
                onLoad={(e) => {
                  const key = `${s.themeKey}-${view}`;
                  const el = e.currentTarget;
                  setTimeout(() => {
                    if (el.isConnected && el.dataset.viewKey === key) setLoading(false);
                  }, 1000);
                  el.dataset.viewKey = key;
                }}
                className={`absolute top-0 left-0 border-0 transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  width: `${SITE_WIDTH}px`,
                  height: `${SITE_HEIGHT}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  pointerEvents: loading ? "none" : "auto"
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}