import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Czy muszę znać się na komputerach, żeby obsługiwać stronę?",
    a: "Absolutnie nie. Panel admina zaprojektowaliśmy tak, żeby mógł go obsłużyć każdy — wystarczy umiejętność pisania SMS-ów. Możesz zmieniać ceny, opisy, zdjęcia, aktualności — wszystko przez prosty formularz. Każde pole ma dymek z wyjaśnieniem co wpisać.",
  },
  {
    q: "Czy synchronizacja z Booking.com naprawdę działa automatycznie?",
    a: "Tak. Booking.com udostępnia publiczny kalendarz w formacie iCal. Twoja strona pobiera go regularnie i automatycznie blokuje zajęte terminy. Gość próbujący zarezerwować termin zajęty przez Booking.com zobaczy komunikat o niedostępności. Zero ręcznej pracy z Twojej strony.",
  },
  {
    q: "Co z synchronizacją z Google Calendar?",
    a: "Możesz wkleić adres swojego publicznego kalendarza Google w Ustawieniach — i zajęte dni zablokują się automatycznie na Twojej stronie. Idealne jeśli prowadzisz kalendarz w Google, a nie chcesz nic robić ręcznie.",
  },
  {
    q: "Ile kosztuje utrzymanie strony miesięcznie?",
    a: "Zero złotych miesięcznie. Płacisz raz — 1 200 zł — i masz stronę na zawsze. Jedyny wydatek to Twoja domena (ok. 50–100 zł/rok), jeśli jej nie masz. Hosting jest wliczony w cenę.",
  },
  {
    q: "Jak szybko będę miał gotową stronę?",
    a: "W ciągu 24 godzin od przesłania materiałów (zdjęcia, opisy pokoi, dane kontaktowe). Najczęściej robimy to szybciej. Masz gwarancję — jeśli nie wyrobiliśmy się w 24h, zwrócimy pieniądze.",
  },
  {
    q: "Czy mogę potem samodzielnie zmieniać treści?",
    a: "Tak, i to jest jeden z głównych atutów. Możesz zmienić ceny, opisy pokoi, dodać zdjęcia, opublikować aktualność, zmienić styl kolorystyczny — wszystko samodzielnie przez panel admina. Żadnego kontaktu z programistą.",
  },
  {
    q: "Czy strona będzie działać na telefonach?",
    a: "Oczywiście. Strona jest w pełni responsywna — wygląda perfekcyjnie zarówno na telefonie, tablecie, jak i na komputerze. Przetestowaliśmy wszystkie 5 stylów na różnych urządzeniach.",
  },
  {
    q: "Czy mogę zmienić styl po wdrożeniu?",
    a: "Tak. Zmiana stylu (motywu) to jedno kliknięcie w Ustawieniach panelu admina. Możesz eksperymentować i wybrać ten, który najlepiej pasuje do Twojego obiektu.",
  },
  {
    q: "Co jeśli mam więcej niż jeden obiekt lub chcę zmiany po wdrożeniu?",
    a: "Każdy obiekt to oddzielna instalacja — cena jest taka sama dla każdego. Drobne zmiany (np. dodanie sekcji, zmiana układu) realizujemy indywidualnie po ustaleniu zakresu. Standardowe treści zmieniasz samodzielnie.",
  },
  {
    q: "Czy dostaję kod źródłowy strony?",
    a: "Strona działa na naszym hostingu (wliczonym w cenę). Jeśli chcesz pełnego dostępu do kodu — możemy to ustalić indywidualnie.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border border-border rounded-2xl overflow-hidden bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-foreground pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-24 bg-[hsl(38,35%,97%)]">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">
            Pytania i odpowiedzi
          </h2>
          <p className="text-lg text-muted-foreground">
            Masz wątpliwości? Sprawdź czy tutaj znajdziesz odpowiedź.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
