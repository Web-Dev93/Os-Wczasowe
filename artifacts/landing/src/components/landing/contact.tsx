import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  Users,
  Banknote,
  Phone,
  Loader2,
} from "lucide-react";

const formSchema = z
  .object({
    guestName: z.string().min(2, { message: "Podaj imię i nazwisko." }),
    guestEmail: z.string().email({ message: "Podaj poprawny adres email." }),
    guestPhone: z.string().min(9, { message: "Podaj numer telefonu." }),
    checkIn: z.string().min(1, { message: "Wybierz datę przyjazdu." }),
    checkOut: z.string().min(1, { message: "Wybierz datę wyjazdu." }),
    guestsCount: z.coerce
      .number()
      .int()
      .min(1, { message: "Min. 1 osoba." })
      .max(20, { message: "Maks. 20 osób." }),
    message: z.string().optional(),
  })
  .refine(
    (d) => !d.checkIn || !d.checkOut || d.checkOut > d.checkIn,
    { message: "Data wyjazdu musi być późniejsza niż przyjazdu.", path: ["checkOut"] },
  );

const PROMISES = [
  { icon: Banknote, text: "Płatność gotówką przy przyjeździe" },
  { icon: CalendarDays, text: "Bezpłatne odwołanie do 48 h przed przyjazdem" },
  { icon: Phone, text: "Potwierdzenie telefoniczne w ciągu 24 h" },
];

// Resolve API base — works both in dev (proxied) and via absolute BASE_URL
const API_BASE = (() => {
  const base = import.meta.env.BASE_URL ?? "/";
  // Strip trailing slug segment so /landing/ → /api
  return base.replace(/\/[^/]+\/?$/, "/api").replace(/\/\/$/, "/api");
})();

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: "",
      checkOut: "",
      guestsCount: 2,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: values.guestName,
          guestEmail: values.guestEmail,
          guestPhone: values.guestPhone,
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          guestsCount: values.guestsCount,
          message: values.message || undefined,
          type: "inquiry",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Błąd serwera: ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="kontakt" className="py-24 px-6 bg-[hsl(195,40%,97%)]">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-semibold mb-3">
            Rezerwacja online
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Zarezerwuj pobyt. Płacisz przy przyjeździe.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Wypełnij formularz — skontaktujemy się w ciągu 24 godzin, aby potwierdzić
            dostępność i szczegóły. Bez zaliczki, bez ryzyka.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left — promises */}
          <div className="lg:col-span-2 space-y-6 pt-2">
            {PROMISES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{text}</span>
              </div>
            ))}

            <div className="price-glow mt-8 p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">
                Płatność
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">Gotówka</div>
              <div className="text-sm text-muted-foreground">
                Płacisz dopiero w recepcji przy zameldowaniu. Żadnych opłat z góry.
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">
                  Zapytanie przyjęte!
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Skontaktujemy się z Tobą w ciągu 24 godzin, aby potwierdzić
                  dostępność i szczegóły pobytu. Płatność gotówką przy zameldowaniu.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-8"
                >
                  Złóż kolejną rezerwację
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan Kowalski" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jan@przykład.pl"
                              {...field}
                            />
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
                            <Input placeholder="500 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="checkIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <CalendarDays className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                            Przyjazd
                          </FormLabel>
                          <FormControl>
                            <Input type="date" min={today} {...field} />
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
                          <FormLabel>
                            <CalendarDays className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                            Wyjazd
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={form.watch("checkIn") || today}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="guestsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Users className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                          Liczba osób
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uwagi (opcjonalnie)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Np. potrzebujemy łóżeczka dziecięcego, przyjeżdżamy późnym wieczorem…"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {apiError && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
                      {apiError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="btn-ocean w-full text-base py-6 gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CalendarDays className="w-5 h-5" />
                    )}
                    {loading ? "Wysyłanie…" : "Wyślij zapytanie o rezerwację"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Bez zaliczki. Płatność gotówką przy przyjeździe.
                    Potwierdzenie w ciągu 24 h.
                  </p>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
