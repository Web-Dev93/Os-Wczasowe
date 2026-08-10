import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-foreground">
      {/* Background Image with elegant overlay */}
      <div className="absolute inset-0">
        {/* Placeholder color while loading */}
        <div className="absolute inset-0 bg-primary/30" />
        <img
          src="/hero-bg.jpg"
          alt="Krajobraz Morza Bałtyckiego"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/40 via-transparent to-accent/30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Dla pensjonatów i ośrodków
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white leading-[1.05] tracking-tight mb-8">
            Własna strona.<br />
            <span className="text-white/70 italic">Zero prowizji.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Kompletny system rezerwacji z panelem zarządzania i synchronizacją z Booking.com.
            Gotowy w 24 godziny. Płacisz raz — 1 200 zł — i strona jest Twoja.
            Chcesz coś po swojemu? Robimy też indywidualne zmiany.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="#kontakt"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded text-sm font-semibold hover:bg-accent/90 shadow-[0_0_30px_-5px_rgba(255,180,80,0.4)] transition-all duration-300"
            >
              Zamów teraz — 1 200 zł
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white rounded text-sm font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Zobacz stronę na żywo
            </a>
          </div>

          <p className="mt-6 text-xs text-white/60 tracking-wide">
            Bez ryzyka: jeśli nie dowieziemy strony w 24 h od przesłania materiałów — zwracamy całą kwotę.
          </p>
        </motion.div>
      </div>

      {/* Bottom info bar */}
      <div className="relative z-10 w-full mt-auto border-t border-white/10 bg-background/5 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            {[
              { value: "24 h", label: "Czas wdrożenia" },
              { value: "1 200 zł", label: "Jednorazowy koszt" },
              { value: "0 zł", label: "Miesięczny abonament" },
              { value: "6", label: "Gotowych stylów" },
            ].map(({ value, label }) => (
              <div key={label} className="px-4">
                <div className="text-white font-serif text-2xl mb-1">{value}</div>
                <div className="text-white/60 text-xs uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}