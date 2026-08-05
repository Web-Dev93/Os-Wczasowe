import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetRoom, useGetAvailability, getGetRoomQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { 
  Users, BedDouble, Check, ChevronLeft, Calendar as CalendarIcon, 
  Wifi, Tv, Coffee, Wind, TreePine, Car, Bath, Waves, Flame
} from "lucide-react";
import { format, addMonths, isBefore, startOfToday, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import roomImg1 from "@assets/generated_images/room1.jpg";
import roomImg2 from "@assets/generated_images/room2.jpg";

export default function RoomDetail({ id }: { id: string }) {
  const roomId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const { data: room, isLoading: isRoomLoading } = useGetRoom(roomId, {
    query: {
      enabled: !!roomId,
      queryKey: getGetRoomQueryKey(roomId)
    }
  });

  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailability({ roomId });

  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (isRoomLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Ładowanie...</div>;
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Nie znaleziono pokoju</h2>
        <Button asChild><Link href="/pokoje">Wróć do listy pokoi</Link></Button>
      </div>
    );
  }

  // Get blocked dates for calendar
  const disabledDates = availability?.flatMap(block => {
    const start = new Date(block.dateFrom);
    const end = new Date(block.dateTo);
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }) || [];

  const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi') || n.includes('internet')) return <Wifi className="w-5 h-5" />;
    if (n.includes('tv') || n.includes('telewizor')) return <Tv className="w-5 h-5" />;
    if (n.includes('kuchnia') || n.includes('aneks')) return <Coffee className="w-5 h-5" />;
    if (n.includes('klimatyzacja')) return <Wind className="w-5 h-5" />;
    if (n.includes('ogród') || n.includes('taras')) return <TreePine className="w-5 h-5" />;
    if (n.includes('parking')) return <Car className="w-5 h-5" />;
    if (n.includes('łazienka') || n.includes('prysznic')) return <Bath className="w-5 h-5" />;
    if (n.includes('morze') || n.includes('widok')) return <Waves className="w-5 h-5" />;
    if (n.includes('grill')) return <Flame className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  const images = room.photos?.map(p => p.url) || [];
  if (room.coverPhotoUrl && !images.includes(room.coverPhotoUrl)) {
    images.unshift(room.coverPhotoUrl);
  }
  if (images.length === 0) {
    images.push(roomImg1, roomImg2);
  }

  return (
    <div className="w-full pb-24">
      {/* Header section with back button */}
      <div className="bg-muted/30 pt-8 pb-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button variant="ghost" className="mb-4 -ml-4" asChild>
            <Link href="/pokoje">
              <ChevronLeft className="w-4 h-4 mr-2" /> Pokoje
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-2">{room.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Max {room.capacity} osób</span>
                {room.minNights && (
                  <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> Min {room.minNights} noce</span>
                )}
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-muted-foreground">Cena za noc</div>
              <div className="text-3xl font-bold text-primary">{room.pricePerNight} zł</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[500px]">
          {/* Main big image */}
          <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setActiveImage(images[0])}>
            <img 
              src={images[0]} 
              alt={room.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          {/* Smaller images */}
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="hidden md:block rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setActiveImage(img)}>
              <img 
                src={img} 
                alt={`${room.name} ${i+1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">Opis pokoju</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="whitespace-pre-line leading-relaxed">{room.description}</p>
              </div>
            </section>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6">Udogodnienia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl border bg-card text-card-foreground">
                      <div className="text-primary">{getAmenityIcon(amenity)}</div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Booking CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 font-serif">Dostępność</h3>
              
              <div className="mb-6 rounded-xl border bg-background overflow-hidden p-2 flex justify-center">
                <DayPicker
                  mode="multiple"
                  locale={pl}
                  disabled={[{ before: startOfToday() }, ...disabledDates]}
                  modifiers={{ booked: disabledDates }}
                  modifiersStyles={{
                    booked: { textDecoration: 'line-through', color: 'gray', backgroundColor: 'transparent' }
                  }}
                  className="mx-auto"
                />
              </div>

              <div className="flex gap-2 text-xs text-muted-foreground mb-6 justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Dostępne</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-dashed border-muted-foreground inline-block"></span> Zajęte</span>
              </div>

              <Button size="lg" className="w-full rounded-full h-14 text-lg" onClick={() => setLocation(`/rezerwacja?pokoj=${room.id}`)}>
                Zapytaj o termin
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setActiveImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setActiveImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img 
              src={activeImage} 
              alt="Powiększenie" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
