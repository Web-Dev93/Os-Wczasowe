import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ekskluzywnyImg from "@assets/generated_images/style-ekskluzywny.jpg";
import rodzinnyImg from "@assets/generated_images/style-rodzinny.jpg";
import nowoczesnyImg from "@assets/generated_images/style-nowoczesny.jpg";
import rustykalnyImg from "@assets/generated_images/style-rustykalny.jpg";
import profesjonalnyImg from "@assets/generated_images/style-profesjonalny.jpg";

const STYLES = [
  {
    id: "ekskluzywny",
    name: "Ekskluzywny",
    desc: "Luksusowe SPA, elegancja, whisky przy kominku.",
    img: ekskluzywnyImg,
    theme: {
      bg: "#0a0a0f",
      text: "#ffffff",
      accent: "#c9a227",
      btnText: "#000000",
      fontHead: "font-playfair",
      fontBody: "font-dm",
      radius: "rounded-none",
      border: "border-[#1a1a24]"
    }
  },
  {
    id: "rodzinny",
    name: "Rodzinny",
    desc: "Bezpieczne wakacje z dziećmi, lody na plaży, uśmiech.",
    img: rodzinnyImg,
    theme: {
      bg: "#fdf8f5",
      text: "#1e293b",
      accent: "#2da8d8",
      btnText: "#ffffff",
      fontHead: "font-jakarta",
      fontBody: "font-jakarta",
      radius: "rounded-2xl",
      border: "border-[#f1e6df]"
    }
  },
  {
    id: "nowoczesny",
    name: "Nowoczesny",
    desc: "Designerski boutique hotel, Nowy Jork, minimalistyczna architektura.",
    img: nowoczesnyImg,
    theme: {
      bg: "#ffffff",
      text: "#1a1a1a",
      accent: "#1a1a1a",
      btnText: "#ffffff",
      fontHead: "font-dm",
      fontBody: "font-dm",
      radius: "rounded-none",
      border: "border-[#e5e5e5]"
    }
  },
  {
    id: "rustykalny",
    name: "Rustykalny",
    desc: "Drewniane deski, las, domowa atmosfera, natura.",
    img: rustykalnyImg,
    theme: {
      bg: "#f5f0ea",
      text: "#2c241b",
      accent: "#6b4c2a",
      btnText: "#ffffff",
      fontHead: "font-fraunces",
      fontBody: "font-jakarta",
      radius: "rounded-md",
      border: "border-[#e6ded5]"
    }
  },
  {
    id: "profesjonalny",
    name: "Profesjonalny",
    desc: "Zaufany, solidny, sprawdzony, polska tradycja.",
    img: profesjonalnyImg,
    theme: {
      bg: "#ffffff",
      text: "#0f172a",
      accent: "#1e3a6b",
      btnText: "#ffffff",
      fontHead: "font-cormorant",
      fontBody: "font-dm",
      radius: "rounded-sm",
      border: "border-[#e2e8f0]"
    }
  }
];

export function StylesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStyle = STYLES[activeIdx];

  return (
    <section id="style" className="py-24 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Wybierz swój charakter</h2>
          <p className="text-lg text-muted-foreground">
            Każdy styl to inna osobowość. Zobacz jak zmieniają się kolory, fonty i klimat. 
            Wybierz ten, który najlepiej oddaje ducha Twojego obiektu.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {STYLES.map((style, idx) => (
            <button
              key={style.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                idx === activeIdx 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-background border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Description of active style */}
        <div className="text-center mb-12 h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeStyle.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-muted-foreground font-medium"
            >
              {activeStyle.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Preview Window */}
        <div className="max-w-6xl mx-auto border-[8px] border-background rounded-2xl shadow-2xl overflow-hidden relative" style={{ height: "600px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStyle.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 w-full h-full flex flex-col ${activeStyle.theme.fontBody}`}
              style={{ backgroundColor: activeStyle.theme.bg, color: activeStyle.theme.text }}
            >
              {/* Mock Header */}
              <header className={`flex items-center justify-between p-6 border-b ${activeStyle.theme.border}`}>
                <div className={`text-2xl font-bold ${activeStyle.theme.fontHead}`}>Willa Morska</div>
                <div className="hidden md:flex gap-6 text-sm opacity-80">
                  <span>Pokoje</span>
                  <span>Galeria</span>
                  <span>O nas</span>
                  <span>Kontakt</span>
                </div>
                <button 
                  className={`px-5 py-2 text-sm font-semibold transition-transform hover:scale-105 ${activeStyle.theme.radius}`}
                  style={{ backgroundColor: activeStyle.theme.accent, color: activeStyle.theme.btnText }}
                >
                  Rezerwuj
                </button>
              </header>

              {/* Mock Body */}
              <div className="flex-1 flex flex-col md:flex-row">
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center z-10 relative">
                  <span className="text-sm uppercase tracking-widest opacity-60 mb-4 block">Witamy nad morzem</span>
                  <h1 className={`text-4xl md:text-6xl mb-6 leading-tight ${activeStyle.theme.fontHead}`}>
                    Twój idealny wypoczynek.
                  </h1>
                  <p className="text-lg opacity-80 mb-10 max-w-md">
                    Odkryj spokój i harmonię w naszych komfortowych apartamentach zaledwie krok od plaży.
                  </p>
                  
                  {/* Mock Availability Form */}
                  <div className={`flex flex-col sm:flex-row gap-2 p-2 border ${activeStyle.theme.border} ${activeStyle.theme.radius} max-w-lg`} style={{ backgroundColor: activeStyle.theme.bg }}>
                    <div className="flex-1 px-4 py-2 border-r border-current/10">
                      <div className="text-xs opacity-60 mb-1">Przyjazd</div>
                      <div className="font-medium">12 Lipca 2024</div>
                    </div>
                    <div className="flex-1 px-4 py-2">
                      <div className="text-xs opacity-60 mb-1">Wyjazd</div>
                      <div className="font-medium">19 Lipca 2024</div>
                    </div>
                    <button 
                      className={`px-6 py-3 font-semibold ${activeStyle.theme.radius}`}
                      style={{ backgroundColor: activeStyle.theme.accent, color: activeStyle.theme.btnText }}
                    >
                      Szukaj
                    </button>
                  </div>
                </div>

                {/* Mock Image Side */}
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 md:relative h-full opacity-20 md:opacity-100">
                  <div className="w-full h-full relative">
                    <img 
                      src={activeStyle.img} 
                      alt={activeStyle.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r from-[${activeStyle.theme.bg}] to-transparent md:hidden`}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="text-center mt-12">
          <a href="#kontakt" className="inline-block bg-foreground text-background px-8 py-4 rounded-md font-medium hover:bg-foreground/90 transition-colors text-lg">
            Ten styl jest mój. Chcę taką stronę.
          </a>
        </div>
      </div>
    </section>
  );
}
