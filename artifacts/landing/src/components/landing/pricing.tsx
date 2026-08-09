import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const INCLUDED = [
  "Strona internetowa (6 motywów do wyboru)",
  "Panel administratora (własny CMS)",
  "Synchronizacja z Booking.com i Google Calendar",
  "Google Analytics i Google Maps",
  "Formularz zapytań online",
  "Galeria zdjęć, pokoje, aktualności",
  "Wdrożenie w 24 godziny",
  "Hosting i certyfikat SSL",
  "Wsparcie techniczne przez e-mail",
];

const COMPARED = [
  { label: "Booking.com", cost: "15–20% prowizji od każdej rezerwacji", bad: true },
  { label: "Agencja interaktywna", cost: "5 000–15 000 zł + koszty utrzymania", bad: true },
  { label: "Kreatory (Wix, itp.)", cost: "Abonament co miesiąc w nieskończoność", bad: true },
  { label: "Strony dla Ośrodków", cost: "1 200 zł jednorazowo — na zawsze", bad: false },
];

export function Pricing() {
  return (
    <section id="cennik" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Inwestycja
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Prosty układ. Zero abonamentu.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zamiast płacić 20% prowizji od każdej rezerwacji do końca życia, 
            zapłać raz za solidne narzędzie i zarabiaj 100% kwoty z gościa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-background border border-border p-8 md:p-12 shadow-sm rounded">
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="text-2xl font-serif font-medium mb-2">Pełen Pakiet</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-medium tracking-tight">1 200</span>
                  <span className="text-xl text-muted-foreground">zł</span>
                </div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">
                  Opłata jednorazowa
                </p>
              </div>

              <ul className="space-y-4 mb-10">
                {INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
                <li className="flex items-start gap-4 opacity-50">
                  <X className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm">Brak ukrytych kosztów i prowizji</span>
                </li>
              </ul>

              <a
                href="#kontakt"
                className="flex items-center justify-center w-full px-8 py-4 bg-foreground text-background font-semibold rounded transition-colors hover:bg-foreground/90"
              >
                Zamów swoją stronę
              </a>
            </div>
          </motion.div>

          {/* Right column: comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h4 className="text-xl font-serif font-medium mb-6">Alternatywy kosztują więcej</h4>
              <div className="space-y-4">
                {COMPARED.map((c, i) => (
                  <div key={i} className="flex flex-col py-3 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{c.label}</span>
                    <span className={`text-sm mt-1 ${c.bad ? 'text-muted-foreground' : 'text-foreground font-semibold'}`}>
                      {c.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-border/20 border-l-2 border-foreground">
              <h4 className="font-medium mb-2">Gwarancja zwrotu</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jeśli strona nie będzie gotowa do działania w 24 godziny od przesłania materiałów, zwracamy całą kwotę. Gramy w otwarte karty.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}