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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle2, Zap, Shield, Headphones } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Podaj swoje imię i nazwisko." }),
  resortName: z.string().min(2, { message: "Podaj nazwę obiektu." }),
  contact: z.string().min(5, { message: "Podaj telefon lub email." }),
  style: z.string().min(1, { message: "Wybierz styl." }),
});

const PROMISES = [
  { icon: Zap,        text: "Strona gotowa w 24 godziny" },
  { icon: Shield,     text: "Jednorazowa płatność — bez abonamentu" },
  { icon: Headphones, text: "Pomoc przy wdrożeniu w cenie" },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      resortName: "",
      contact: "",
      style: "",
    },
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setSubmitted(true);
  }

  return (
    <section id="kontakt" className="py-24 px-6 bg-[hsl(195,40%,97%)]">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-primary text-sm uppercase tracking-[0.2em] font-semibold mb-3">Gotowe — czeka na Ciebie</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Kup teraz. Masz stronę jutro.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Strona jest gotowa — tylko Twoje dane trzeba wpisać. Wybierz styl, podaj nazwę ośrodka i kontakt. Resztą zajmujemy się my.
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

            <div className="mt-8 p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="text-3xl font-bold text-primary mb-1">1 200 zł</div>
              <div className="text-sm text-muted-foreground">jednorazowo, brutto</div>
              <div className="text-sm text-muted-foreground mt-1">Domena i hosting — Twoje, nie nasze.</div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">Zamówienie przyjęte!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Odezwiemy się w ciągu kilku godzin z linkiem do płatności i kolejnymi krokami. Twoja strona będzie gotowa jutro.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">
                  Wróć do formularza
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      name="resortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa ośrodka</FormLabel>
                          <FormControl>
                            <Input placeholder="Willa Morska" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon lub email</FormLabel>
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
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wybrany styl strony</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Który styl Ci się podoba?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ekskluzywny">Ekskluzywny (ciemny luksus)</SelectItem>
                            <SelectItem value="rodzinny">Rodzinny (jasny i radosny)</SelectItem>
                            <SelectItem value="nowoczesny">Nowoczesny (minimalizm)</SelectItem>
                            <SelectItem value="rustykalny">Rustykalny (natura i drewno)</SelectItem>
                            <SelectItem value="profesjonalny">Profesjonalny (klasyka)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full text-base py-6 gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Kup teraz — 1 200 zł
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Po złożeniu zamówienia odezwiemy się z linkiem do płatności w ciągu kilku godzin.
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
