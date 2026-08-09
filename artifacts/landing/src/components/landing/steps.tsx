import { motion } from "framer-motion";
import { Palette, Upload, Key } from "lucide-react";

const STEPS = [
  {
    icon: Palette,
    num: "01",
    title: "Wybierz styl i kup",
    desc: "Spośród 5 stylów wybierasz ten, który pasuje do Twojego ośrodka. Klikasz \u201eKup teraz\u201d i podajesz dane do faktury \u2014 gotowe.",
  },
  {
    icon: Upload,
    num: "02",
    title: "Wysyłasz nam materiały",
    desc: "Opisy, cennik pokoi i zdjęcia (choćby z telefonu). My instalujemy stronę na Twojej domenie i uzupełniamy wszystkie treści.",
  },
  {
    icon: Key,
    num: "03",
    title: "Gotowe w 24 godziny",
    desc: "Twoja strona działa i przyjmuje gości. Dostajesz hasło do panelu admina. Od teraz rządzisz sam — bez żadnych miesięcznych opłat.",
  },
];

export function Steps() {
  return (
    <section id="proces" className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(199,88%,36%) 0%, hsl(199,80%,28%) 100%)" }}>
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-white/60 text-sm uppercase tracking-[0.2em] font-medium mb-3">Prosty proces</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5">
            Od pomysłu do gotowej strony w kilka dni
          </h2>
          <p className="text-lg text-white/75">
            Trzy kroki, zero stresu, pełne wsparcie. Nie musisz znać się na technikaliach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-px bg-white/20" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/25 flex items-center justify-center mb-6 backdrop-blur-sm">
                <step.icon className="w-9 h-9 text-white" />
              </div>
              <div className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">{step.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="#kontakt"
            className="inline-block bg-white text-[hsl(199,88%,36%)] hover:bg-white/90 px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-2xl"
          >
            Kup teraz — masz stronę w 24 h
          </a>
        </div>
      </div>
    </section>
  );
}
