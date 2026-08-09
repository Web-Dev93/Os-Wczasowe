import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useListRooms, useSubmitInquiry, useGetSettings } from "@workspace/api-client-react";
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

  useEffect(() => {
    if (roomIdFromUrl) {
      form.setValue("roomId", roomIdFromUrl);
    }
  }, [roomIdFromUrl, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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

              <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold" disabled={submitInquiry.isPending}>
                {submitInquiry.isPending ? "Wysyłanie..." : "Wyślij zapytanie o rezerwację"}
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
