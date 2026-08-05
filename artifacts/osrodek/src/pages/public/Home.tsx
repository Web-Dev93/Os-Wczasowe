import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetSettings, useListRooms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, ChevronRight } from "lucide-react";
import heroImg from "@assets/generated_images/hero.jpg";

export default function Home() {
  const { data: settings, isLoading: isSettingsLoading } = useGetSettings();
  const { data: rooms, isLoading: isRoomsLoading } = useListRooms();

  if (isSettingsLoading || isRoomsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>;
  }

  const featuredRooms = rooms?.slice(0, 3) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={settings?.heroImageUrl || heroImg} 
          alt="Ośrodek" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg"
          >
            {settings?.tagline || "Twój nadmorski odpoczynek"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl drop-shadow-md font-medium"
          >
            {settings?.description?.substring(0, 120) || "Poczuj piasek pod stopami i sól we włosach. Idealne miejsce na relaks z dala od zgiełku."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full">
              <Link href="/rezerwacja">Zarezerwuj teraz</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-white/10 text-white border-white/30 hover:bg-white hover:text-black">
              <Link href="/pokoje">Zobacz pokoje</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nasze Pokoje</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Przytulne i komfortowe wnętrza zaprojektowane z myślą o Twoim pełnym relaksie po dniu pełnym słońca.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room, index) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={room.coverPhotoUrl || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800"} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary">
                    Od {room.pricePerNight} zł
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-serif font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">{room.name}</h3>
                  
                  <div className="flex gap-4 text-muted-foreground text-sm mb-4">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> max {room.capacity} osób</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {room.minNights ? `min ${room.minNights} noce` : '1 noc'}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                    {room.description || "Brak opisu."}
                  </p>
                  
                  <Button asChild variant="ghost" className="mt-auto w-full group/btn justify-between hover:bg-primary hover:text-primary-foreground">
                    <Link href={`/pokoj/${room.id}`}>
                      <span>Szczegóły</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/pokoje">Zobacz wszystkie pokoje</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Dlaczego warto do nas przyjechać?</h2>
              <div className="h-1 w-16 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Jesteśmy małym, rodzinnym ośrodkiem z duszą. Wiele pokoleń spędzało tu swoje najpiękniejsze wakacje. Stawiamy na ciszę, bliskość natury i domową atmosferę, której nie znajdziesz w wielkich hotelach.
              </p>
              <ul className="space-y-3 mt-6">
                {[
                  "Kameralna atmosfera i prywatność",
                  "Zaledwie kilka minut od piaszczystej plaży",
                  "Piękne, odnowione wnętrza z morskim klimatem",
                  "Bezpieczny teren idealny dla rodzin z dziećmi"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <div className="mt-1 bg-primary/10 p-1 rounded-full text-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative z-10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" 
                  alt="Nasz ośrodek" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-3/4 aspect-square bg-primary/10 rounded-3xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-1/2 aspect-square bg-secondary rounded-full -z-10 blur-3xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
