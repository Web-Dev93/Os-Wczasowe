import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListRooms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, ChevronRight, Check } from "lucide-react";
import roomImg1 from "@assets/generated_images/room1.jpg";

export default function Rooms() {
  const { data: rooms, isLoading } = useListRooms();

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Ładowanie...</div>;
  }

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <section className="page-banner bg-primary text-primary-foreground py-16 md:py-24 pb-24">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            Nasze Pokoje
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
          >
            Zatrzymaj się w jednym z naszych przytulnych pokoi. Każdy zaprojektowany z myślą o komforcie i relaksie.
          </motion.p>
        </div>
      </section>

      {/* Room List */}
      <section className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="space-y-16">
          {rooms?.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col md:flex-row gap-8 bg-card rounded-3xl overflow-hidden border shadow-sm room-card-hover"
            >
              {/* Image */}
              <div className="md:w-2/5 lg:w-1/2 relative img-zoom-wrap">
                <img 
                  src={room.coverPhotoUrl || roomImg1} 
                  alt={room.name} 
                  className="w-full h-full object-cover aspect-[4/3] md:aspect-auto"
                />
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8 md:w-3/5 lg:w-1/2 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-card-foreground">{room.name}</h2>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground block">od</span>
                    <span className="text-xl font-bold text-primary">{room.pricePerNight} zł</span>
                    <span className="text-xs text-muted-foreground">/ noc</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-6 pb-6 border-b">
                  <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"><Users className="w-4 h-4" /> Max. {room.capacity} osób</span>
                  {room.minNights && (
                    <span className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"><BedDouble className="w-4 h-4" /> Min. {room.minNights} noce</span>
                  )}
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {room.description || "Brak opisu dla tego pokoju. Skontaktuj się z nami, aby dowiedzieć się więcej."}
                </p>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-foreground">W pokoju:</h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" /> {amenity}
                        </li>
                      ))}
                      {room.amenities.length > 4 && (
                        <li className="text-xs text-muted-foreground italic flex items-center">
                          + {room.amenities.length - 4} więcej...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="rounded-full flex-1">
                    <Link href={`/rezerwacja?pokoj=${room.id}`}>Zarezerwuj</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full flex-1 group">
                    <Link href={`/pokoj/${room.id}`}>
                      <span>Szczegóły</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {(!rooms || rooms.length === 0) && (
            <div className="text-center py-24 text-muted-foreground">
              Nie znaleziono żadnych pokoi.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
