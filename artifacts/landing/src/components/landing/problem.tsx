import { motion } from "framer-motion";
import { TrendingDown, Percent, AlertTriangle, ArrowRight } from "lucide-react";

const PAINS = [
  {
    icon: Percent,
    title: "Booking.com bierze 15–20%",
    desc: "Każda rezerwacja przez portal to strata. Przy 50 rezerwacjach po 1000 zł tracisz nawet 10 000 zł rocznie na prowizjach.",
  },
  {
    icon: TrendingDown,
    title: "Gość nie wie, że możesz taniej",
    desc: "Bez własnej strony gość bookuje przez pośrednika. Gdyby wiedział, że u Ciebie bezpośrednio jest taniej — wybrałby Ciebie.",
  },
  {
    icon: AlertTriangle,
    title: "Nie masz kontroli nad swoim wizerunkiem",
    desc: "Na Booking.com wyglądasz tak samo jak setki innych. Własna strona to Twoja twarz — taka, jaką chcesz pokazać.",
  },
];

export function Problem() {
  return (
    <section className="py-24 bg-[hsl(38,35%,97%)]">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-destructive text-sm uppercase tracking-[0.2em] font-semibold mb-3">Problem</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">
            Czy wiesz, ile tracisz bez własnej strony?
          </h2>
          <p className="text-lg text-muted-foreground">
            Każdy rok bez własnej strony to tysiące złotych wypłacone portalem zamiast Tobie.
          </p>
        </div>

        {/* Pain points */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PAINS.map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="bg-white border border-border rounded-2xl p-7"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-5">
                <pain.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-3">{pain.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pain.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution bridge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary text-primary-foreground rounded-3xl p-10 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Rozwiązanie: własna strona, raz na zawsze
          </h3>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Inwestujesz 1 200 zł jednorazowo i już po pierwszych kilku bezpośrednich rezerwacjach
            się to zwraca. Bez abonamentu, bez prowizji — tylko Twoje pieniądze.
          </p>
          <a
            href="#funkcje"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all hover:scale-105"
          >
            Sprawdź co dostajesz
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
