import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";

const PROMISES = [
  { icon: Zap,    text: "Strona gotowa w 24 godziny" },
  { icon: Shield, text: "Gwarancja zwrotu jeśli nie dowozimy" },
  { icon: Clock,  text: "Wsparcie techniczne po wdrożeniu" },
];

export function CtaFinal() {
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(199,88%,36%) 0%, hsl(199,80%,24%) 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/60 text-sm uppercase tracking-[0.25em] font-medium mb-5">
            Gotowy na własną stronę?
          </p>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.1]">
            Zarabiaj bezpośrednio.<br />
            <span className="text-[hsl(38,90%,65%)]">Bez prowizji. Już od dziś.</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Dołącz do ośrodków, które przestały płacić Booking.com tysiące złotych prowizji
            i zarabiają więcej na bezpośrednich rezerwacjach przez własną stronę.
          </p>

          {/* Promises */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {PROMISES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-white/85">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold text-lg px-10 py-5 rounded-full hover:bg-white/90 transition-all hover:scale-105 shadow-2xl"
            >
              Zamów stronę — 1 200 zł
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-lg px-10 py-5 rounded-full transition-all hover:scale-105"
            >
              Najpierw zobaczę demo
            </a>
          </div>

          <p className="mt-6 text-white/50 text-sm">
            Masz pytania? Zadzwoń lub napisz — odpowiemy w kilka minut.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
