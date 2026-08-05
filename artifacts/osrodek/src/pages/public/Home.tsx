import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetSettings, useListRooms, useListGallery } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/HeroSlider";
import {
  Users, BedDouble, ChevronRight, Sun, Shield, Heart, Star,
  Waves, MapPin, Clock
} from "lucide-react";

/* ── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* ── stats ──────────────────────────────────────────────── */
const STATS = [
  { icon: BedDouble, value: "4",    label: "pokoje & apartamenty" },
  { icon: MapPin,    value: "5 min", label: "spacerem do plaży"    },
  { icon: Clock,     value: "15+",  label: "lat tradycji"          },
  { icon: Waves,     value: "500+", label: "zadowolonych gości"    },
];

/* ── why-us ─────────────────────────────────────────────── */
const WHY = [
  { icon: Sun,    text: "Słoneczna lokalizacja tuż przy Bałtyku"              },
  { icon: Heart,  text: "Domowa atmosfera i indywidualne podejście"            },
  { icon: Shield, text: "Bezpieczny, spokojny teren — idealny dla rodzin"     },
  { icon: Star,   text: "Starannie odnowione wnętrza z morskim klimatem"      },
];

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: rooms }    = useListRooms();
  const { data: gallery }  = useListGallery();

  const featuredRooms  = rooms?.slice(0, 3)   || [];
  const galleryPreview = gallery?.slice(0, 6)  || FALLBACK_GALLERY;

  return (
    <div className="w-full overflow-x-hidden">

      {/* ════════════════════════════════ HERO ══ */}
      <HeroSlider
        tagline={settings?.tagline}
        description={settings?.description}
        heroImageUrl={settings?.heroImageUrl}
      />

      {/* ════════════════════════════════ STATS BAR ══ */}
      <section className="relative bg-primary py-0">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/15"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex flex-col items-center gap-2 py-8 px-4 text-primary-foreground"
              >
                <Icon className="w-6 h-6 opacity-70 mb-1" />
                <span className="text-3xl md:text-4xl font-serif font-bold tracking-tight leading-none">
                  {value}
                </span>
                <span className="text-xs uppercase tracking-widest opacity-65 text-center">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════ ROOMS ══ */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* heading */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">
              Noclegi
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-5">
              Nasze Pokoje
            </motion.h2>
            <motion.div variants={fadeUp} className="h-px w-24 bg-primary/30 mx-auto mb-6" />
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Każdy pokój to oddzielny świat — cichy, zadbany, z nutą morza.
            </motion.p>
          </motion.div>

          {/* cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {featuredRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={fadeUp}
                className="card-lift group rounded-3xl overflow-hidden bg-card border border-border/60 shadow-sm flex flex-col"
              >
                {/* image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={room.coverPhotoUrl || FALLBACK_ROOM}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* price badge */}
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-bold px-3.5 py-1.5 rounded-full shadow-lg">
                    od {room.pricePerNight} zł
                  </div>
                  {/* capacity badge */}
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> max {room.capacity} os.
                  </div>
                </div>

                {/* body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                    {room.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                    {room.description || "Przytulny pokój w morskim stylu."}
                  </p>

                  {/* amenity pills */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {room.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                          {a}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <Button asChild size="sm" className="flex-1 rounded-full">
                      <Link href={`/rezerwacja?pokoj=${room.id}`}>Rezerwuj</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-full group/btn">
                      <Link href={`/pokoj/${room.id}`}>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full px-10 h-13 text-base hover:scale-105 transition-transform">
              <Link href="/pokoje">Wszystkie pokoje <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ WHY US ══ */}
      <section className="py-28 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* text side */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-primary text-sm uppercase tracking-[0.2em] font-medium">
                Dlaczego my?
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                Małe miejsce,<br />
                <span className="text-primary">wielkie wakacje</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg leading-relaxed">
                Jesteśmy ośrodkiem z historią — małym, rodzinnym i z duszą. Tu nie ma anonimowości wielkich hoteli. Tu pamiętamy Twoje imię, ulubiony pokój i jak lubisz kawę.
              </motion.p>

              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {WHY.map(({ icon: Icon, text }) => (
                  <motion.div
                    key={text}
                    variants={fadeUp}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="mt-0.5 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button asChild size="lg" className="rounded-full px-8 hover:scale-105 transition-transform">
                  <Link href="/kontakt">Skontaktuj się z nami</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* image side */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* stacked photo effect */}
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full aspect-[4/5] rounded-3xl bg-primary/8 rotate-3" />
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80"
                    alt="Bałtyk"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* floating card */}
                <div className="float-anim absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-2xl max-w-[180px]">
                  <div className="text-3xl font-serif font-bold leading-none mb-1">15+</div>
                  <div className="text-xs opacity-75 uppercase tracking-wider">lat na rynku</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════ GALLERY STRIP ══ */}
      {galleryPreview.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              className="flex items-end justify-between mb-10"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <div>
                <motion.p variants={fadeUp} className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-2">
                  Galeria
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-serif font-bold">
                  Poczuj klimat
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Button asChild variant="outline" className="rounded-full hidden sm:flex">
                  <Link href="/galeria">Cała galeria <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="gallery-strip"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {galleryPreview.map((photo) => (
                <Link key={photo.id} href="/galeria" className="gallery-strip-item">
                  <img src={photo.url} alt={photo.caption || ""} loading="lazy" />
                  {photo.caption && (
                    <div className="caption">
                      <span className="text-white text-sm font-medium">{photo.caption}</span>
                    </div>
                  )}
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════ CTA ══ */}
      <section className="relative py-32 overflow-hidden bg-primary">
        {/* decorative circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-primary-foreground/5 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-primary-foreground/60 text-sm uppercase tracking-[0.25em] font-medium mb-4">
              Zarezerwuj już dziś
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6">
              Morze czeka.<br />Czy Ty jesteś gotowy?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-primary-foreground/70 text-xl mb-12 max-w-lg mx-auto">
              Wolnych terminów ubywa szybko — sprawdź dostępność i zarezerwuj swój idealny pobyt.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-base rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:scale-105 transition-transform shadow-2xl"
              >
                <Link href="/rezerwacja">Sprawdź dostępność</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 text-base rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:scale-105 transition-transform"
              >
                <Link href="/kontakt">Zadzwoń do nas</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

/* ── fallbacks ───────────────────────────────────────────── */
const FALLBACK_ROOM = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80";
const FALLBACK_GALLERY = [
  { id: 1, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", caption: "Plaża o zachodzie słońca", sortOrder: 0 },
  { id: 2, url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", caption: "Spokojne morze", sortOrder: 1 },
  { id: 3, url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=600&q=80", caption: "Wydmy", sortOrder: 2 },
  { id: 4, url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&q=80", caption: "Molo", sortOrder: 3 },
  { id: 5, url: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&q=80", caption: "Lato nad morzem", sortOrder: 4 },
  { id: 6, url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80", caption: "Wieczór", sortOrder: 5 },
];
