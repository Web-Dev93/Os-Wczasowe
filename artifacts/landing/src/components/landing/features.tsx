import { motion, type Variants } from "framer-motion";
import {
  BedDouble, Images, CalendarCheck, Smartphone,
  Lock, MapPin, Check, RefreshCw, Newspaper,
  BarChart3, Calendar, Globe, Settings2, MessageSquare
} from "lucide-react";

const SITE_FEATURES = [
  { text: "Strona główna z animowanym sliderem zdjęć" },
  { text: "Katalog pokoi z cenami i udogodnieniami" },
  { text: "Formularz rezerwacji lub zapytania online" },
  { text: "Galeria zdjęć w układzie masonry z lightboxem" },
  { text: "Strona kontaktu z mapą Google Maps" },
  { text: "Sekcja aktualności — nowości dla gości" },
  { text: "W pełni responsywna — piękna na telefonie" },
  { text: "6 stylów wizualnych do wyboru" },
];

const ADMIN_FEATURES = [
  "Zarządzaj pokojami, cenami i zdjęciami",
  "Przeglądaj i obsługuj rezerwacje",
  "Dodawaj i usuwaj zdjęcia galerii",
  "Blokuj terminy (Booking.com, Google Calendar)",
  "Zmień styl, opis i dane kontaktowe",
  "Publikuj aktualności dla gości",
  "Google Analytics — statystyki strony",
  "Google Maps — mapa dla gości",
];

const INTEGRATIONS = [
  {
    icon: RefreshCw,
    color: "bg-[#003580] text-white",
    label: "Booking.com",
    desc: "Zajęte terminy blokują się automatycznie. Zero podwójnych rezerwacji.",
    badge: "Automatyczne",
  },
  {
    icon: Calendar,
    color: "bg-[#1a73e8] text-white",
    label: "Google Calendar",
    desc: "Wklej adres kalendarza i zajęte dni znikają z formularza rezerwacji.",
    badge: "Automatyczne",
  },
  {
    icon: BarChart3,
    color: "bg-[#e37400] text-white",
    label: "Google Analytics",
    desc: "Wklej swój kod GA4 i śledź skąd przychodzą goście i które pokoje oglądają.",
    badge: "1 kliknięcie",
  },
  {
    icon: MapPin,
    color: "bg-[#34a853] text-white",
    label: "Google Maps",
    desc: "Mapa z lokalizacją Twojego ośrodka pojawi się na stronie kontaktu automatycznie.",
    badge: "1 kliknięcie",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }),
};

export function Features() {
  return (
    <section id="funkcje" className="py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">Co dostajesz</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">Kompletny system. Gotowy w 24 h.</h2>
          <p className="text-lg text-muted-foreground">
            Wszystko, czego potrzebuje ośrodek nad morzem — w jednym pakiecie,
            za jedną cenę, bez ukrytych kosztów.
          </p>
        </div>

        {/* Google + Booking integrations */}
        <div className="mb-20">
          <h3 className="text-center text-xl font-serif font-bold mb-8 text-foreground/70">
            Integracje wbudowane w standard
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTEGRATIONS.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <div className="font-bold text-sm mb-1">{item.label}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: feature list */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-8">Strona publiczna dla Twoich gości</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {SITE_FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-card border border-border rounded-2xl"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
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
              transition={{ duration: 0.6 }}
              className="p-7 bg-primary text-primary-foreground rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 opacity-80" />
                <h4 className="font-bold text-lg">Panel administratora — tylko dla Ciebie</h4>
              </div>
              <p className="opacity-80 mb-5 text-sm leading-relaxed">
                Chroniony hasłem panel do zarządzania całą stroną.
                Zmieniasz wszystko samodzielnie — bez kontaktu z programistą, bez dodatkowych kosztów.
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
            transition={{ duration: 0.7 }}
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
                twojosrodek.pl/admin
              </div>
            </div>

            {/* Admin panel mock */}
            <div className="flex h-[480px]">
              <div className="w-44 bg-muted/60 border-r border-border p-4 flex flex-col gap-1 shrink-0">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Panel</div>
                {[
                  { label: "Dashboard", active: false },
                  { label: "Pokoje", active: false },
                  { label: "Rezerwacje", active: false },
                  { label: "Galeria", active: false },
                  { label: "Aktualności", active: false },
                  { label: "Ustawienia", active: true },
                ].map(({ label, active }) => (
                  <div key={label} className={`px-3 py-2 rounded-lg text-xs font-medium ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-5 overflow-hidden">
                <h3 className="font-bold text-sm mb-4">Ustawienia — Integracje</h3>

                {/* Integration mocks */}
                <div className="space-y-3">
                  {[
                    { icon: "🔵", label: "Booking.com iCal URL", val: "https://booking.com/ical/...", ok: true },
                    { icon: "📅", label: "Google Calendar URL", val: "https://calendar.google.com/...", ok: true },
                    { icon: "📊", label: "Google Analytics ID", val: "G-XXXXXXXXXX", ok: false },
                    { icon: "🗺️", label: "Google Maps Embed URL", val: "https://maps.google.com/...", ok: false },
                  ].map((row) => (
                    <div key={row.label} className="p-3 bg-muted/40 border border-border rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-medium flex items-center gap-1.5">
                          <span>{row.icon}</span>
                          {row.label}
                        </div>
                        {row.ok
                          ? <span className="text-xs text-green-600 font-semibold">✓ Aktywne</span>
                          : <span className="text-xs text-muted-foreground">Opcjonalne</span>
                        }
                      </div>
                      <div className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded truncate">
                        {row.val}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full bg-primary text-primary-foreground text-xs py-2.5 rounded-lg font-semibold">
                  Zapisz ustawienia
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
