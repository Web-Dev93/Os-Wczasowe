import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const BEACH_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85";

const STATS = [
  { value: "24 h", label: "Czas wdrożenia" },
  { value: "1 200 zł", label: "Jednorazowy koszt" },
  { value: "0 zł", label: "Abonament miesięczny" },
  { value: "6", label: "Stylów do wyboru" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={BEACH_BG}
          alt="Bałtyk"
          className="w-full h-full object-cover animate-[kenBurnsHero_14s_ease-out_both]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 md:h-20 fill-[hsl(38,35%,97%)]">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-28 pb-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs uppercase tracking-[0.25em] px-5 py-2.5 rounded-full mb-8">
            System dla pensjonatów i ośrodków nad morzem
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] mb-6 drop-shadow-lg">
            Własna strona.<br />
            <span className="text-[hsl(38,90%,65%)]">Zero prowizji. Na zawsze.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/85 max-w-3xl mx-auto mb-4 leading-relaxed drop-shadow">
            Profesjonalna strona internetowa z panelem admina, synchronizacją
            z Booking.com i Google. Płacisz raz — zarabiasz bezpośrednio.
          </p>
          <p className="text-base text-white/65 max-w-xl mx-auto mb-12">
            Gotowa w 24 godziny. Żadnych miesięcznych opłat. Żadnych prowizji.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#cennik"
              className="bg-[hsl(199,88%,36%)] hover:bg-[hsl(199,88%,30%)] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-2xl shadow-[hsl(199,88%,36%)]/50"
            >
              Kup teraz — 1 200 zł
            </a>
            <a
              href="#demo"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105"
            >
              Zobacz 6 stylów
            </a>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">{value}</div>
                <div className="text-xs text-white/65 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ArrowDown className="w-6 h-6 text-white/50 animate-bounce" />
      </motion.div>

      <style>{`
        @keyframes kenBurnsHero {
          from { transform: scale(1); }
          to   { transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
