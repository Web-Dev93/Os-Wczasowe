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

const formSchema = z.object({
  name: z.string().min(2, { message: "Wymagane (min. 2 znaki)." }),
  email: z.string().email({ message: "Błędny adres email." }),
  phone: z.string().min(9, { message: "Wymagane (min. 9 cyfr)." }),
  message: z.string().optional(),
});

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
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">Porozmawiajmy o detalach.</h2>
            <p className="text-muted-foreground leading-relaxed mb-12">
              Zostaw kontakt do siebie. Oddzwonimy, by odpowiedzieć na wszystkie pytania. 
              Możesz też od razu podjąć decyzję o wyborze stylu i rozpoczęciu współpracy.
            </p>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Email</div>
                <a href="mailto:kontakt@stronydlaosrodkow.pl" className="text-lg hover:text-primary transition-colors">kontakt@stronydlaosrodkow.pl</a>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Telefon</div>
                <a href="tel:+48500000000" className="text-lg hover:text-primary transition-colors">+48 500 000 000</a>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border p-8 rounded shadow-sm">
            {submitted ? (
              <div className="py-12 text-center">
                <h3 className="text-2xl font-serif font-medium mb-4">Dziękujemy</h3>
                <p className="text-muted-foreground mb-8">Wiadomość została wysłana. Odezwiemy się niebawem.</p>
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Wiadomość (opcjonalnie)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground resize-none"
                            rows={3}
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
                    {loading ? "Wysyłanie..." : "Wyślij"}
                  </button>
                </form>
              </Form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}