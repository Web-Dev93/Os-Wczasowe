import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Wybierasz styl",
    desc: "Zaczynasz od wyboru jednego z 6 dostępnych motywów. Zawsze możesz go zmienić w przyszłości.",
  },
  {
    num: "02",
    title: "Przesyłasz materiały",
    desc: "Wysyłasz nam cennik, opisy i zdjęcia (wystarczą takie z telefonu). My uzupełniamy i konfigurujemy stronę za Ciebie.",
  },
  {
    num: "03",
    title: "Odbierasz klucze",
    desc: "W ciągu 24 godzin dostajesz gotową, działającą stronę i dostęp do panelu. Od teraz rezerwacje należą tylko do Ciebie.",
  },
];

export function Steps() {
  return (
    <section id="proces" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Proces
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Prościej się nie da.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="mb-6 pb-6 border-b border-border">
                <span className="font-serif text-5xl text-primary/30 font-light tracking-tighter">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-serif font-medium mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center px-8 py-4 rounded bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors shadow-sm"
          >
            Rozpocznij teraz
          </a>
        </div>
      </div>
    </section>
  );
}