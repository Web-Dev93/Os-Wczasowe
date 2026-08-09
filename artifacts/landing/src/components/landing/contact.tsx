import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
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
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Podaj imię i nazwisko (min. 2 znaki)." }),
  email: z.string().email({ message: "Podaj poprawny adres email." }),
  phone: z.string().min(9, { message: "Podaj numer telefonu (min. 9 cyfr)." }),
  message: z.string().optional(),
});

const BENEFITS = [
  { icon: BadgeCheck, text: "Płacisz raz — brak abonamentów na zawsze" },
  { icon: ShieldCheck, text: "Strona gotowa w 24 godziny" },
  { icon: Phone,       text: "Wsparcie telefoniczne w razie pytań" },
];

// API base — works in both dev (proxy) and via absolute BASE_URL
const API_BASE = (() => {
  const base = import.meta.env.BASE_URL ?? "/";
  return base.replace(/\/[^/]+\/?$/, "/api").replace(/\/\/$/, "/api");
})();

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/landing/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data?.error ?? `Błąd serwera: ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Coś poszło nie tak.");
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
            Bezpłatna rozmowa
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Zainteresowany? Odezwij się.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Zostaw dane — zadzwonimy i odpowiemy na wszystkie pytania.
            Bez zobowiązań, bez ukrytych kosztów.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left — benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6 pt-2"
          >
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{text}</span>
              </div>
            ))}

            {/* Price card */}
            <div className="mt-8 p-6 rounded-2xl border-2 border-primary bg-primary/5">
              <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">
                Jednorazowa opłata
              </div>
              <div className="text-4xl font-bold text-foreground mb-1">
                1 200 zł
              </div>
              <div className="text-sm text-muted-foreground">
                Strona + panel admina + synchronizacja z Booking.com.
                Zero abonamentów. Na zawsze Twoje.
              </div>
            </div>

            {/* Contact direct */}
            <div className="space-y-3 pt-2">
              <a
                href="tel:+48500000000"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Wolisz zadzwonić? +48 500 000 000</span>
              </a>
              <a
                href="mailto:kontakt@twojsystem.pl"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>kontakt@twojsystem.pl</span>
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">
                  Dziękujemy! Odezwiemy się wkrótce.
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Twoje zapytanie trafiło do nas. Zadzwonimy lub napiszemy
                  najszybciej jak możemy — zazwyczaj w ciągu kilku godzin.
                </p>
                <Button
                  onClick={() => { setSubmitted(false); form.reset(); }}
                  variant="outline"
                  className="mt-8"
                >
                  Wyślij kolejne zapytanie
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Wyślij zapytanie</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jan@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
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

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pytania lub uwagi <span className="text-muted-foreground font-normal">(opcjonalnie)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Np. ile mam pokoi, jaki motyw mnie interesuje, kiedy chciałbym uruchomić stronę…"
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
                    className="w-full text-base py-6 gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                    {loading ? "Wysyłanie…" : "Wyślij zapytanie"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Odpowiemy w ciągu kilku godzin. Bez zobowiązań.
                  </p>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
