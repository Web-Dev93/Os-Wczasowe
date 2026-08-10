import { motion } from "framer-motion";

export function CtaFinal() {
  return (
    <section className="py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-6">
            Ostatni krok
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight">
            Czas na rezerwacje bez prowizji.
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Przestań oddawać portalom 15–20% od każdej rezerwacji. Przy dwóch gościach
            strona już się zwraca — a należy do Ciebie na zawsze. Napisz przez formularz,
            a szczegóły (motyw, treści, indywidualne zmiany) ustalimy wspólnie.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#kontakt"
              className="w-full sm:w-auto px-10 py-5 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 shadow-[0_0_30px_-5px_rgba(255,180,80,0.4)] transition-all duration-300"
            >
              Napisz do nas
            </a>
            <a
              href="#demo"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/30 text-white font-semibold rounded hover:bg-white/10 transition-all duration-300"
            >
              Najpierw zobacz demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}