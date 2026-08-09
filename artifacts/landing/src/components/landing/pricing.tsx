import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

const INCLUDED = [
  "Profesjonalna strona internetowa (5 stylów)",
  "Panel administratora z pełnym CMS",
  "Synchronizacja z Booking.com (iCal)",
  "Synchronizacja z Google Calendar",
  "Google Analytics — śledzenie odwiedzin",
  "Google Maps — mapa na stronie kontaktu",
  "Formularz rezerwacji / zapytań online",
  "Galeria zdjęć (masonry + lightbox)",
  "Sekcja aktualności (wpisy dla gości)",
  "6 motywów / stylów wizualnych",
  "Wdrożenie w 24 godziny",
  "Hosting na Twojej domenie",
  "Wsparcie techniczne przez e-mail",
  "Edytowalny opis, ceny, zdjęcia, kontakt",
];

const NOT_INCLUDED = [
  "Abonament miesięczny",
  "Prowizja od rezerwacji",
  "Opłata za aktualizacje treści",
  "Ukryte koszty",
];

const COMPARED = [
  { label: "Booking.com", cost: "15–20% prowizji od każdej rezerwacji", bad: true },
  { label: "Agencja strona", cost: "5 000–15 000 zł + 200 zł/mies.", bad: true },
  { label: "Strony w subskrypcji", cost: "100–300 zł/mies. bez końca", bad: true },
  { label: "Nasza strona", cost: "1 200 zł jednorazowo — i koniec", bad: false },
];

export function Pricing() {
  return (
    <section id="cennik" className="py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">Cennik</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">
            Jedna cena. Wszystko w środku.
          </h2>
          <p className="text-lg text-muted-foreground">
            Żadnych niespodzianek. Żadnych modułów dokupowanych osobno. Płacisz raz i masz stronę na zawsze.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Main pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                <Zap className="w-3.5 h-3.5" />
                Jednorazowa opłata
              </span>
            </div>

            <div className="bg-card border-2 border-primary rounded-3xl p-8 shadow-xl pt-10">
              {/* Price */}
              <div className="text-center mb-8 pb-8 border-b border-border">
                <div className="text-6xl font-bold text-foreground mb-2">
                  1 200 <span className="text-3xl font-semibold text-muted-foreground">zł</span>
                </div>
                <p className="text-muted-foreground">jednorazowo — bez abonamentu, bez prowizji</p>
              </div>

              {/* What's included */}
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Co dostajesz:</h3>
              <ul className="space-y-3 mb-8">
                {INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Not included */}
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Czego NIE ma:</h3>
              <ul className="space-y-2 mb-8">
                {NOT_INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className="block w-full text-center bg-primary text-primary-foreground font-bold text-lg py-4 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/25"
              >
                Zamów stronę teraz
              </a>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Wdrożenie w 24 godziny od przesłania materiałów
              </p>
            </div>
          </motion.div>

          {/* Right column: comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif font-bold mb-2">
              Porównaj z alternatywami
            </h3>
            <p className="text-muted-foreground mb-6">
              Zanim wybierzesz, sprawdź ile naprawdę kosztują inne opcje.
            </p>

            <div className="space-y-3">
              {COMPARED.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-5 rounded-2xl border ${
                    c.bad
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div>
                    <div className={`font-semibold text-sm ${c.bad ? "text-foreground" : "text-green-800"}`}>
                      {c.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${c.bad ? "text-destructive" : "text-green-700 font-semibold"}`}>
                      {c.cost}
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    c.bad ? "bg-destructive/15 text-destructive" : "bg-green-200 text-green-700"
                  }`}>
                    {c.bad ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>

            {/* ROI calculator */}
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <h4 className="font-bold text-primary mb-3">💡 Szybki rachunek</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jeśli masz <strong>30 rezerwacji rocznie po 1 500 zł</strong>, to Booking.com
                bierze od Ciebie <strong>~6 750 zł</strong> prowizji (15%).
                <br /><br />
                Własna strona kosztuje <strong>1 200 zł jednorazowo</strong>. Wystarczy,
                że przez nią zrobisz <strong>1–2 rezerwacje</strong> — i już się zwraca.
              </p>
            </div>

            {/* Guarantee */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🛡️</div>
                <div>
                  <h4 className="font-bold mb-1">Gwarancja satysfakcji</h4>
                  <p className="text-sm text-muted-foreground">
                    Jeśli strona nie będzie gotowa w 24 godziny od przesłania materiałów
                    lub nie spełni ustalonych wymagań — zwrócimy pieniądze w całości.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
