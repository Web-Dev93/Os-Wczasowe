import { motion } from "framer-motion";
import { Waves } from "lucide-react";

const BEACH_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0">
        <img
          src={BEACH_BG}
          alt="Bałtyk"
          className="w-full h-full object-cover animate-[kenBurnsHero_12s_ease-out_both]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* Animated wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20 fill-[hsl(38,35%,97%)]">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8">
            <Waves className="w-3.5 h-3.5" />
            Dla pensjonatów i ośrodków nad morzem
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] mb-6 drop-shadow-lg">
            Piękna strona<br />
            <span className="text-[hsl(38,90%,65%)]">dla Twojego ośrodka</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/85 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
            Gotowa, w pełni funkcjonalna strona z panelem admina.
            Twoje pokoje, galeria, rezerwacje — wszystko pod kontrolą.
            Płacisz raz. Masz na zawsze.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#style"
              className="bg-[hsl(199,88%,36%)] hover:bg-[hsl(199,88%,30%)] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-2xl shadow-[hsl(199,88%,36%)]/40"
            >
              Zobacz 5 stylów
            </a>
            <a
              href="#kontakt"
              className="btn-ocean bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              Kup teraz
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes kenBurnsHero {
          from { transform: scale(1); }
          to   { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
