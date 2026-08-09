import { motion } from "framer-motion";
import {
  BedDouble, Images, CalendarCheck, Settings, Smartphone,
  Lock, MapPin, Check
} from "lucide-react";

const FEATURES = [
  { icon: BedDouble,     text: "Strona główna z animowanym sliderem zdjęć" },
  { icon: BedDouble,     text: "Katalog pokoi z cenami i udogodnieniami" },
  { icon: CalendarCheck, text: "Formularz rezerwacji lub zapytania online" },
  { icon: Images,        text: "Galeria zdjęć w układzie masonry z lightboxem" },
  { icon: MapPin,        text: "Strona kontaktu z mapą i danymi" },
  { icon: Smartphone,    text: "W pełni responsywna — piękna na telefonie" },
];

const ADMIN_FEATURES = [
  "Zarządzaj pokojami, cenami i zdjęciami",
  "Przeglądaj i obsługuj rezerwacje",
  "Dodawaj i usuwaj zdjęcia galerii",
  "Blokuj terminy (urlop, remont)",
  "Zmień styl, opis i dane kontaktowe",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }),
};

export function Features() {
  return (
    <section id="funkcje" className="py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">Co dostajesz</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">Kompletna strona — gotowa do działania</h2>
          <p className="text-lg text-muted-foreground">
            Żadnych modułów, wtyczek i tajemniczych subskrypcji.
            Dostajesz gotową stronę z panelem admina. Płacisz raz i masz ją na zawsze.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: feature list */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-8">Strona publiczna dla Twoich gości</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-card border border-border rounded-2xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm leading-relaxed text-foreground/85">{f.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Admin box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 bg-primary text-primary-foreground rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 opacity-80" />
                <h4 className="font-bold text-lg">Twój własny panel administratora</h4>
              </div>
              <p className="opacity-80 mb-5 text-sm leading-relaxed">
                Chroniony hasłem panel tylko dla Ciebie. Zarządzasz wszystkim samodzielnie — bez kontaktu z programistą, bez dodatkowych kosztów.
              </p>
              <ul className="space-y-2.5">
                {ADMIN_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: admin panel mock */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
          >
            {/* Browser chrome */}
            <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto bg-background px-3 py-1 rounded text-xs text-muted-foreground w-1/2 text-center border border-border">
                admin.twojosrodek.pl
              </div>
            </div>

            {/* Admin panel mock UI */}
            <div className="flex h-[420px]">
              {/* Sidebar */}
              <div className="w-44 bg-muted/60 border-r border-border p-4 flex flex-col gap-1 shrink-0">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Panel admin</div>
                {[
                  { label: "Dashboard", active: false },
                  { label: "Pokoje", active: true },
                  { label: "Rezerwacje", active: false },
                  { label: "Galeria", active: false },
                  { label: "Ustawienia", active: false },
                ].map(({ label, active }) => (
                  <div
                    key={label}
                    className={`px-3 py-2 rounded-lg text-xs font-medium cursor-default ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Pokoje i apartamenty</h3>
                  <button className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg font-medium">
                    + Dodaj pokój
                  </button>
                </div>
                {/* Room list mock */}
                <div className="space-y-2.5">
                  {[
                    { name: "Apartament Bałtyk", price: "320 zł/noc", cap: "4 os.", active: true },
                    { name: "Pokój Standard",    price: "180 zł/noc", cap: "2 os.", active: true },
                    { name: "Domek Wydmy",       price: "450 zł/noc", cap: "6 os.", active: false },
                  ].map((room) => (
                    <div key={room.name} className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs truncate">{room.name}</div>
                        <div className="text-xs text-muted-foreground">{room.price} · {room.cap}</div>
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${room.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {room.active ? "Aktywny" : "Ukryty"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats at bottom */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    { label: "Rezerwacje", val: "12" },
                    { label: "Oczekujące", val: "3" },
                    { label: "Ten miesiąc", val: "4 200 zł" },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-muted/40 border border-border rounded-xl p-2.5 text-center">
                      <div className="font-bold text-sm text-primary">{val}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
