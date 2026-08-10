import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Czy muszę znać się na komputerach, żeby obsługiwać stronę?",
    a: "Nie. Panel zaprojektowaliśmy w oparciu o prostotę. Jeśli potrafisz obsługiwać smartfona czy napisać maila, poradzisz sobie ze zmianą cen czy dodaniem zdjęć. Dodatkowo każde pole posiada krótki opis.",
  },
  {
    q: "Jak działa synchronizacja z Booking.com?",
    a: "Booking.com generuje link kalendarza (iCal). Wklejasz go raz w panelu administracyjnym. Twoja strona będzie co kilka minut sprawdzać ten link i automatycznie blokować terminy zajęte przez Booking.",
  },
  {
    q: "Ile wynosi koszt utrzymania (hosting)?",
    a: "Hosting na pierwszy rok jest wliczony w cenę 1 200 zł. Od drugiego roku opłata za utrzymanie serwera to 200 zł rocznie. Brak opłat za abonament czy prowizji od rezerwacji.",
  },
  {
    q: "Czy strona będzie poprawnie działać na telefonach?",
    a: "Tak. Każdy z naszych 6 motywów jest w pełni responsywny i zoptymalizowany pod kątem urządzeń mobilnych oraz tabletów. Tam dzisiaj goście szukają noclegów najczęściej.",
  },
  {
    q: "Czy mogę zmienić motyw graficzny po jakimś czasie?",
    a: "Tak, w panelu administratora wystarczy jedno kliknięcie, aby cała strona zmieniła wygląd na inny motyw, bez utraty wprowadzonych danych, pokoi czy opisów.",
  },
  {
    q: "Czy mogę zamówić indywidualne zmiany?",
    a: "Tak. Własne logo i kolory, dodatkowa podstrona (np. cennik atrakcji, regulamin), wersja językowa czy dodatkowa funkcja w panelu — napisz w formularzu, czego potrzebujesz, a bezpłatnie to wycenimy. Podstawowy pakiet za 1 200 zł w zupełności wystarcza większości obiektów.",
  },
  {
    q: "Jak wygląda zamówienie krok po kroku?",
    a: "1) Wysyłasz formularz na dole strony (niezobowiązująco). 2) Odzywamy się, ustalamy motyw, treści i ewentualne zmiany. 3) Po Twojej akceptacji przesyłasz materiały i płatność. 4) W 24 godziny odbierasz działającą stronę i dostęp do panelu.",
  },
  {
    q: "Czy strona jest naprawdę moja?",
    a: "Tak. Płacisz raz i strona z całym systemem należy do Ciebie — bez abonamentu i bez prowizji od rezerwacji. Jedyny stały koszt to utrzymanie serwera od drugiego roku (200 zł rocznie).",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left"
      >
        <span className="font-medium text-foreground pr-8">{q}</span>
        <span className="shrink-0 text-muted-foreground">
          {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground text-sm leading-relaxed max-w-3xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Częste pytania
          </h2>
        </div>

        <div className="border-t border-border">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}