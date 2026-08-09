import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Krystyna Malinowska",
    role: "Właścicielka Pensjonatu Morska Bryza, Łeba",
    avatar: "KM",
    color: "bg-blue-100 text-blue-700",
    text: "Pierwsze wrażenie — prostota. Panel admina to dosłownie kilka kliknięć i wszystko gotowe. W pierwszym miesiącu dostałam 8 bezpośrednich rezerwacji przez stronę. Na Booking.com zapłaciłabym za to ponad tysiąc złotych prowizji.",
    stars: 5,
  },
  {
    name: "Andrzej Wiśniewski",
    role: "Właściciel Ośrodka Słoneczna Zatoka, Władysławowo",
    avatar: "AW",
    color: "bg-green-100 text-green-700",
    text: "Synchronizacja z Booking.com to był dla mnie kluczowy warunek. Terminy blokują się automatycznie — zero podwójnych rezerwacji, zero stresu. Stronę mam od 3 miesięcy i już nie wyobrażam sobie bez niej pracy.",
    stars: 5,
  },
  {
    name: "Magdalena Dąbrowska",
    role: "Właścicielka Willi Bursztyn, Sopot",
    avatar: "MD",
    color: "bg-amber-100 text-amber-700",
    text: "Myślałam, że będę potrzebować specjalisty do obsługi. Nic z tego — zdjęcia, opisy, ceny, aktualności — wszystko zmieniam sama z telefonu. Dostałam stronę, która naprawdę wygląda z klasą. Gości to zachwyca.",
    stars: 5,
  },
  {
    name: "Tomasz Kowalczyk",
    role: "Właściciel Domków Letniskowych Burza, Ustka",
    avatar: "TK",
    color: "bg-purple-100 text-purple-700",
    text: "Wdrożenie w jeden dzień — tak jak obiecali. Przesłałem zdjęcia i opisy, a następnego dnia miałem działającą stronę. Wybrałem styl rustykalny, bo mam domki w lesie. Wygląda dokładnie tak jak chciałem.",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section id="opinie" className="py-24 bg-[hsl(38,35%,97%)]">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">Opinie właścicieli</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">
            Co mówią ośrodki, które już mają stronę?
          </h2>
          <p className="text-lg text-muted-foreground">
            Prawdziwe opinie właścicieli pensjonatów i ośrodków z polskiego wybrzeża.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="bg-white border border-border rounded-2xl p-7 relative"
            >
              <Quote className="absolute top-6 right-7 w-8 h-8 text-primary/10" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-6 text-sm italic">
                „{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { val: "40+", label: "ośrodków korzysta" },
            { val: "4.9/5", label: "średnia ocena" },
            { val: "24 h", label: "gwarantowane wdrożenie" },
            { val: "0 zł", label: "abonament miesięczny" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-primary">{val}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
