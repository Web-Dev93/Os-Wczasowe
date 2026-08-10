import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useListRooms, useSubmitInquiry, useGetSettings, useGetAvailability } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { pl } from "date-fns/locale";

const formSchema = z.object({
  roomId: z.string().optional(),
  guestName: z.string().min(2, "Imię jest wymagane"),
  guestEmail: z.string().email("Niepoprawny email"),
  guestPhone: z.string().min(6, "Telefon jest wymagany"),
  guestsCount: z.coerce.number().min(1, "Minimum 1 dorosły"),
  childrenCount: z.coerce.number().min(0, "Nie może być ujemna"),
  checkIn: z.string().min(1, "Wybierz datę przyjazdu"),
  checkOut: z.string().min(1, "Wybierz datę wyjazdu"),
  message: z.string().optional(),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn);
  }
  return true;
}, {
  message: "Data wyjazdu musi być późniejsza niż data przyjazdu",
  path: ["checkOut"],
});

export default function Reservation() {
  const { data: rooms, isLoading: isRoomsLoading } = useListRooms();
  const { data: settings } = useGetSettings();
  const submitInquiry = useSubmitInquiry();
  const { toast } = useToast();
  const [roomIdFromUrl, setRoomIdFromUrl] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("pokoj");
    if (roomParam) {
      setRoomIdFromUrl(roomParam);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestsCount: 2,
      childrenCount: 0,
      checkIn: "",
      checkOut: "",
      message: "",
    },
  });

  // Ustawiamy pokój z URL dopiero gdy lista pokoi jest załadowana — Radix
  // Select nie dopasuje wartości do itemu, który jeszcze nie istnieje.
  useEffect(() => {
    if (roomIdFromUrl && rooms?.some((r) => r.id.toString() === roomIdFromUrl)) {
      form.setValue("roomId", roomIdFromUrl);
    }
  }, [roomIdFromUrl, rooms, form]);

  // ── Podsumowanie ceny i walidacja terminu ──────────────────────────────────
  const watchedRoomId = form.watch("roomId");
  const watchedCheckIn = form.watch("checkIn");
  const watchedCheckOut = form.watch("checkOut");

  const selectedRoom = useMemo(
    () => rooms?.find((r) => r.id.toString() === watchedRoomId),
    [rooms, watchedRoomId],
  );

  const { data: availabilityBlocks } = useGetAvailability(
    selectedRoom ? { roomId: selectedRoom.id } : undefined,
    { query: { enabled: !!selectedRoom } as never },
  );

  const nights = useMemo(() => {
    if (!watchedCheckIn || !watchedCheckOut) return 0;
    const ms = new Date(watchedCheckOut).getTime() - new Date(watchedCheckIn).getTime();
    return ms > 0 ? Math.round(ms / 86_400_000) : 0;
  }, [watchedCheckIn, watchedCheckOut]);

  // Zakres [checkIn, checkOut) nachodzi na blokadę [dateFrom, dateTo)?
  const dateConflict = useMemo(() => {
    if (!selectedRoom || !watchedCheckIn || !watchedCheckOut || !availabilityBlocks) return false;
    return availabilityBlocks.some(
      (b) => b.status === "blocked" && watchedCheckIn < b.dateTo && watchedCheckOut > b.dateFrom,
    );
  }, [selectedRoom, watchedCheckIn, watchedCheckOut, availabilityBlocks]);

  const minNightsUnmet =
    !!selectedRoom && nights > 0 && nights < (selectedRoom.minNights ?? 1);

  const totalPrice = selectedRoom && nights > 0 ? nights * selectedRoom.pricePerNight : null;
  const blockSubmit = dateConflict || minNightsUnmet;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (blockSubmit) return;
    submitInquiry.mutate({
      data: {
        roomId: values.roomId ? parseInt(values.roomId, 10) : undefined,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        guestsCount: values.guestsCount,
        childrenCount: values.childrenCount,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        message: values.message,
        type: 'booking'
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Zapytanie wysłane!",
          description: "Dziękujemy. Skontaktujemy się w celu potwierdzenia rezerwacji.",
        });
        form.reset({
          roomId: values.roomId,
          guestName: "",
          guestEmail: "",
          guestPhone: "",
          guestsCount: 2,
          childrenCount: 0,
          checkIn: "",
          checkOut: "",
          message: "",
        });
      },
      onError: () => {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać zapytania. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="w-full pb-24">
      <section className="bg-primary text-primary-foreground py-16 md:py-24 mb-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Rezerwacja</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Wypełnij formularz, aby zapytać o wolny termin. Potwierdzimy rezerwację tak szybko, jak to możliwe.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-3xl p-6 md:p-10 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6 pb-6 border-b">
                <h3 className="text-xl font-bold font-serif text-primary">Szczegóły pobytu</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Wybierz pokój (opcjonalnie)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-muted/50 rounded-xl">
                              <SelectValue placeholder="Dowolny pokój" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Dowolny pokój</SelectItem>
                            {rooms?.map(room => (
                              <SelectItem key={room.id} value={room.id.toString()}>{room.name} (Max: {room.capacity})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data przyjazdu</FormLabel>
                        <FormControl>
                          <Input type="date" className="h-12 bg-muted/50 rounded-xl" min={new Date().toISOString().split('T')[0]} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data wyjazdu</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="h-12 bg-muted/50 rounded-xl" 
                            min={form.watch('checkIn') || new Date().toISOString().split('T')[0]} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guestsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liczba dorosłych</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" className="h-12 bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="childrenCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liczba dzieci</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="10" className="h-12 bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {settings?.petsAllowed === "yes" && (
                  <div className="rounded-xl bg-muted/40 border border-border px-4 py-3 text-sm flex items-start gap-2">
                    <span aria-hidden>🐾</span>
                    <p>
                      Akceptujemy zwierzęta{settings?.petPrice ? <> — dopłata: <strong>{settings.petPrice}</strong></> : " — bezpłatnie"}.
                      {" "}Jeśli przyjeżdżasz ze zwierzęciem, napisz o tym w polu „Wiadomość".
                    </p>
                  </div>
                )}

                {dateConflict && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                    Wybrany termin jest już zajęty dla tego pokoju. Zmień daty lub wybierz inny pokój —
                    dostępność sprawdzisz w kalendarzu na stronie pokoju.
                  </div>
                )}

                {!dateConflict && minNightsUnmet && selectedRoom && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
                    Minimalna długość pobytu w pokoju „{selectedRoom.name}" to {selectedRoom.minNights}{" "}
                    {selectedRoom.minNights === 2 ? "noce" : "nocy"} — wybrano {nights}.
                  </div>
                )}

                {!blockSubmit && totalPrice !== null && selectedRoom && (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 px-5 py-4">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-muted-foreground">
                        {selectedRoom.name} · {nights} {nights === 1 ? "noc" : nights < 5 ? "noce" : "nocy"} ×{" "}
                        {selectedRoom.pricePerNight} zł
                      </span>
                      <span className="text-xl font-bold text-primary whitespace-nowrap">{totalPrice} zł</span>
                    </div>
                    {settings?.petsAllowed === "yes" && settings?.petPrice && (
                      <p className="text-xs text-muted-foreground mt-1.5">
                        + ewentualna opłata za zwierzę: {settings.petPrice}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Cena orientacyjna — ostateczną potwierdzimy w odpowiedzi na zapytanie.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6 pb-6">
                <h3 className="text-xl font-bold font-serif text-primary">Twoje dane</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Kowalski" className="h-12 bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jan@example.com" className="h-12 bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="+48 123 456 789" className="h-12 bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dodatkowe życzenia / uwagi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Czy potrzebujesz łóżeczka dla dziecka?" className="min-h-[100px] bg-muted/50 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold" disabled={submitInquiry.isPending || blockSubmit}>
                {submitInquiry.isPending
                  ? "Wysyłanie..."
                  : dateConflict
                    ? "Termin zajęty — zmień daty"
                    : "Wyślij zapytanie o rezerwację"}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Wysłanie formularza nie jest równoznaczne z rezerwacją. 
                Skontaktujemy się z Tobą w celu potwierdzenia dostępności i ceny.
              </p>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
