import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const PAINS = [
  {
    title: "Pośrednicy zabierają Twój zysk",
    desc: "15–20% prowizji od każdej rezerwacji to utrata tysięcy złotych rocznie. Przy 50 rezerwacjach za 1000 zł, oddajesz portalom nawet 10 000 zł.",
  },
  {
    title: "Gość nie wie, że u Ciebie jest taniej",
    desc: "Brak własnej strony sprawia, że klienci rezerwują przez pośredników. Gdyby mieli wybór, zarezerwowaliby bezpośrednio, aby zaoszczędzić.",
  },
  {
    title: "Twój obiekt znika w tłumie",
    desc: "Na portalach rezerwacyjnych wyglądasz jak setki innych. Własna, profesjonalna strona buduje zaufanie i pozwala pokazać Twój prawdziwy standard.",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32 bg-background border-b border-border/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-6">
              Każdy rok bez własnej strony to pieniądze oddane portalom.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Budowa własnej niezależności w internecie nie musi być trudna ani droga. 
              Czas odciąć się od ciągłych prowizji i przejąć kontrolę nad swoimi rezerwacjami.
            </p>
            
            <a href="#funkcje" className="inline-flex items-center gap-3 text-sm font-semibold tracking-wide uppercase hover:text-primary transition-colors">
              <span className="w-8 h-px bg-current" />
              Zobacz nasze rozwiązanie
              <ArrowDownRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-12">
            {PAINS.map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className="text-sm font-serif text-accent font-semibold mb-3">0{i + 1}</div>
                <h3 className="text-xl font-serif font-medium mb-3">{pain.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pain.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}