import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Krystyna Malinowska",
    role: "Pensjonat Morska Bryza, Łeba",
    text: "Pierwsze wrażenie — prostota. Panel admina to dosłownie kilka kliknięć i wszystko gotowe. W pierwszym miesiącu dostałam 8 bezpośrednich rezerwacji przez stronę. Na Booking.com zapłaciłabym za to ponad tysiąc złotych prowizji.",
  },
  {
    name: "Andrzej Wiśniewski",
    role: "Ośrodek Słoneczna Zatoka, Władysławowo",
    text: "Synchronizacja z Booking.com to był dla mnie kluczowy warunek. Terminy blokują się automatycznie — zero podwójnych rezerwacji, zero stresu. Stronę mam od 3 miesięcy i już nie wyobrażam sobie bez niej pracy.",
  },
  {
    name: "Magdalena Dąbrowska",
    role: "Willa Bursztyn, Sopot",
    text: "Myślałam, że będę potrzebować specjalisty do obsługi. Nic z tego — zdjęcia, opisy, ceny, aktualności — wszystko zmieniam sama z telefonu. Dostałam stronę, która naprawdę wygląda z klasą. Gości to zachwyca.",
  },
  {
    name: "Tomasz Kowalczyk",
    role: "Domki Letniskowe Burza, Ustka",
    text: "Wdrożenie w jeden dzień — tak jak obiecali. Przesłałem zdjęcia i opisy, a następnego dnia miałem działającą stronę. Wybrałem styl rustykalny, bo mam domki w lesie. Wygląda dokładnie tak jak chciałem.",
  },
];

export function Testimonials() {
  return (
    <section id="opinie" className="py-24 md:py-32 bg-background border-b border-border/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Opinie
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Zaufali nam na wybrzeżu.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="text-5xl font-serif text-accent/60 leading-none mb-4">„</div>
              <p className="text-lg leading-relaxed text-foreground/80 mb-8 flex-1">
                {t.text}
              </p>
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-12 border-t border-border flex flex-wrap justify-center gap-12 md:gap-24 text-center"
        >
          {[
            { val: "40+", label: "Aktywnych ośrodków" },
            { val: "24 h", label: "Czas wdrożenia" },
            { val: "0 zł", label: "Miesięczny abonament" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-4xl font-serif text-primary mb-2">{val}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}