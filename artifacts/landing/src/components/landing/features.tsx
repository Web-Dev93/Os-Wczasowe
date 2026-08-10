import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

const SITE_FEATURES = [
  {
    t: "Formularz rezerwacji z kalkulatorem ceny",
    d: "Gość od razu widzi koszt pobytu (noce × cena), a zajęte terminy są blokowane automatycznie. Mniej telefonów z pytaniami, więcej pewnych rezerwacji.",
  },
  {
    t: "Katalog pokoi, który sprzedaje za Ciebie",
    d: "Duże zdjęcia, cennik, udogodnienia i kalendarz dostępności przy każdym pokoju. Gość podejmuje decyzję bez dzwonienia.",
  },
  {
    t: "Strona główna z sliderem zdjęć",
    d: "Pierwsze wrażenie w 3 sekundy — pełnoekranowe kadry Twojego obiektu zamiast ściany tekstu.",
  },
  {
    t: "Galeria z powiększeniem (lightbox)",
    d: "Plaża, ogród, wnętrza — goście oglądają jak w folderze premium.",
  },
  {
    t: "Kontakt z mapą dojazdu i WhatsApp",
    d: "Telefon, mail, mapa Google i przycisk WhatsApp — gość pisze do Ciebie jednym kliknięciem.",
  },
  {
    t: "Aktualności dla gości",
    d: "Promocje, wolne terminy, wydarzenia — publikujesz w minutę, strona żyje i wraca w Google.",
  },
  {
    t: "Perfekcyjna na telefonie",
    d: "Ponad 70% gości szuka noclegu na komórce. Każdy z 6 motywów jest w pełni responsywny.",
  },
];

const ADMIN_FEATURES = [
  "Potwierdzasz rezerwację 1 kliknięciem — termin blokuje się sam",
  "Zmieniasz ceny, opisy i zdjęcia bez informatyka",
  "Eksportujesz rezerwacje do Excela (CSV) dla księgowości",
  "Zmieniasz cały wygląd strony jednym kliknięciem (6 motywów)",
  "Publikujesz aktualności i promocje dla gości",
  "Widzisz statystyki rezerwacji na dashboardzie",
];

const INTEGRATIONS = [
  {
    label: "Booking.com",
    desc: "Zajęte terminy blokują się automatycznie. Zero podwójnych rezerwacji (synchronizacja iCal).",
    badge: "Auto",
  },
  {
    label: "Google Calendar",
    desc: "Wklej adres kalendarza i niedostępne dni znikają z formularza na Twojej stronie.",
    badge: "Auto",
  },
  {
    label: "Google Analytics",
    desc: "Dodaj swój identyfikator, aby śledzić ruch na stronie i zachowania potencjalnych gości.",
    badge: "Wbudowane",
  },
];

export function Features() {
  return (
    <section id="funkcje" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="mb-20 max-w-3xl">
          <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Co otrzymujesz
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
            Jeden kompletny system, który pracuje na Ciebie 24/7.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To nie jest „wizytówka". To narzędzie sprzedaży: przyjmuje zapytania, pilnuje kalendarza
            i wygląda tak, że goście chcą u Ciebie zostać. Wszystko w cenie — bez dobierania modułów.
            A jeśli potrzebujesz czegoś więcej, <a href="#kontakt" className="underline underline-offset-4 hover:text-primary transition-colors">robimy też zmiany na indywidualne zamówienie</a>.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Col */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <h3 className="text-2xl font-serif font-medium mb-8">Dla Twoich gości</h3>
              <ul className="space-y-6">
                {SITE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-accent-foreground/80" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">{f.t}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-serif font-medium mb-8">Kluczowe integracje</h3>
              <div className="space-y-6">
                {INTEGRATIONS.map((item, i) => (
                  <div key={i} className="border-l-2 border-border pl-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-wider bg-border/50 px-2 py-0.5 rounded text-muted-foreground">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Admin Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="bg-card border border-border rounded shadow-sm overflow-hidden flex flex-col h-full">
              {/* Browser Header */}
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-4">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border/80" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block bg-background border border-border rounded px-4 py-1 text-xs text-muted-foreground font-mono">
                    twojosrodek.pl/admin
                  </div>
                </div>
                <div className="w-12"></div>
              </div>

              {/* Admin UI */}
              <div className="flex flex-1 min-h-[450px]">
                <div className="w-48 border-r border-border bg-muted/10 p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-6 text-foreground font-serif">
                    <Lock className="w-4 h-4" />
                    <span>Panel</span>
                  </div>
                  {["Dashboard", "Pokoje", "Rezerwacje", "Ustawienia"].map((label, i) => (
                    <div 
                      key={label} 
                      className={`px-3 py-2 text-sm rounded ${i === 1 ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground'}`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 p-8 bg-background">
                  <h4 className="font-medium text-lg mb-6">Zarządzanie pokojami</h4>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Apartament Morski", price: "350 zł", status: "Dostępny" },
                      { name: "Pokój 2-osobowy Standard", price: "180 zł", status: "Dostępny" },
                      { name: "Domek Letniskowy", price: "400 zł", status: "Brak miejsc" }
                    ].map((room, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-border rounded">
                        <div>
                          <div className="font-medium text-sm mb-1">{room.name}</div>
                          <div className="text-xs text-muted-foreground">{room.price} / noc</div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-muted">Edytuj</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">Co jeszcze zrobisz w panelu?</p>
                    <ul className="grid grid-cols-2 gap-3">
                      {ADMIN_FEATURES.map((f, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}