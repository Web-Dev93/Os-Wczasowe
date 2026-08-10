import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Check } from "lucide-react";
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

const THEMES = [
  "Jeszcze nie wiem — doradźcie",
  "Nadmorski",
  "Ekskluzywny",
  "Rustykalny",
  "Nowoczesny",
  "Rodzinny",
  "Wakacyjny",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Wymagane (min. 2 znaki)." }),
  email: z.string().email({ message: "Błędny adres email." }),
  phone: z.string().min(9, { message: "Wymagane (min. 9 cyfr)." }),
  theme: z.string().optional(),
  message: z.string().optional(),
});

// API jest zamontowane w korzeniu domeny (app.use("/api", ...)), niezależnie
// od tego, pod jaką ścieżką serwowany jest frontend. Wcześniejsze wyliczanie
// z BASE_URL dawało dla landingu "//landing/contact" — czyli adres innego
// hosta (URL protokołowo-względny) i fetch kończył się "Failed to fetch".
const API_BASE = "/api";

const TRUST_POINTS = [
  "Odpowiadamy na każdą wiadomość",
  "Wycena i termin ustalane indywidualnie",
  "Indywidualne zmiany możliwe — bezpłatna wycena",
  "Nic nie płacisz, dopóki nie ustalimy szczegółów",
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", theme: THEMES[0], message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setApiError(null);
    try {
      // Motyw dokładamy do wiadomości — kontrakt API (name/email/phone/message) bez zmian
      const messageParts = [
        values.theme ? `Wybrany motyw: ${values.theme}` : null,
        values.message?.trim() || null,
      ].filter(Boolean);
      const res = await fetch(`${API_BASE}/landing/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: messageParts.join("\n\n"),
        }),
      });
      if (!res.ok) {
        throw new Error("Błąd serwera. Spróbuj ponownie.");
      }
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div className="max-w-md">
            <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Kontakt
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">Napisz do nas.</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Podoba Ci się to, co widzisz? Zostaw wiadomość — wróci do nas mailem.
              Odpiszemy z wyceną i możliwym terminem, ustalimy szczegóły (motyw, treści,
              ewentualne indywidualne zmiany) i dopiero po Twoim „tak" ruszamy.
            </p>

            <ul className="space-y-4 mb-12">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent-foreground/80" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Email</div>
              <a href="mailto:www.osrodki.wczasowe@gmail.com" className="text-lg hover:text-primary transition-colors break-all">www.osrodki.wczasowe@gmail.com</a>
            </div>
          </div>

          <div className="bg-background border border-border p-8 rounded shadow-sm">
            {submitted ? (
              <div className="py-12 text-center">
                <h3 className="text-2xl font-serif font-medium mb-4">Dziękujemy za wiadomość</h3>
                <p className="text-muted-foreground mb-8">
                  Wiadomość do nas dotarła. Odezwiemy się mailem lub telefonicznie, żeby ustalić szczegóły.
                </p>
                <button
                  onClick={() => { setSubmitted(false); form.reset(); }}
                  className="px-6 py-2 border border-border text-sm font-medium hover:bg-muted transition-colors rounded"
                >
                  Wyślij ponownie
                </button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Imię i nazwisko / Nazwa obiektu</FormLabel>
                        <FormControl>
                          <Input className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" {...field} />
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
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Telefon</FormLabel>
                          <FormControl>
                            <Input className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Motyw strony</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-foreground"
                          >
                            {THEMES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
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
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                          Wiadomość — np. indywidualne zmiany (opcjonalnie)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground resize-none"
                            rows={3}
                            placeholder="Np. własne logo i kolory, dodatkowa podstrona, wersja niemiecka…"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {apiError && <p className="text-sm text-destructive">{apiError}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-accent-foreground py-4 font-semibold uppercase tracking-wider text-xs transition-colors hover:bg-accent/90 disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Wysłanie wiadomości do niczego nie zobowiązuje — najpierw ustalimy wszystkie szczegóły.
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
