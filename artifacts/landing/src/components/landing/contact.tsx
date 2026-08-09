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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Podaj swoje imię i nazwisko." }),
  resortName: z.string().min(2, { message: "Podaj nazwę obiektu." }),
  contact: z.string().min(5, { message: "Podaj telefon lub email." }),
  style: z.string().min(1, { message: "Wybierz styl." }),
  message: z.string().optional(),
});

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      resortName: "",
      contact: "",
      style: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Form doesn't need to actually send
    setSubmitted(true);
  }

  return (
    <section id="kontakt" className="py-24 px-6 container mx-auto">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Zacznijmy projekt.</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Jesteś gotowy na nową stronę? Wypełnij formularz lub skontaktuj się z nami bezpośrednio. 
            Odpowiadamy w ciągu 24 godzin i ustalamy szczegóły wdrożenia.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium">Napisz do nas</div>
                <div className="font-semibold text-lg">kontakt@mojastrona.pl</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium">Zadzwoń (Pn-Pt 9:00 - 17:00)</div>
                <div className="font-semibold text-lg">+48 500 123 456</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Dziękujemy!</h3>
              <p className="text-muted-foreground">
                Twoja wiadomość została wysłana. Odezwiemy się wkrótce, aby omówić szczegóły Twojej nowej strony.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">
                Wyślij kolejną wiadomość
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="resortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa ośrodka / Pensjonatu</FormLabel>
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
                        <FormLabel>Telefon lub Email</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 500 123 456" {...field} />
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
                      <FormLabel>Zainteresowany styl</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz styl..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ekskluzywny">Ekskluzywny (Ciemny luksus)</SelectItem>
                          <SelectItem value="rodzinny">Rodzinny (Jasny i radosny)</SelectItem>
                          <SelectItem value="nowoczesny">Nowoczesny (Minimalizm)</SelectItem>
                          <SelectItem value="rustykalny">Rustykalny (Natura i drewno)</SelectItem>
                          <SelectItem value="profesjonalny">Profesjonalny (Klasyka i zaufanie)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dodatkowa wiadomość (opcjonalnie)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Zależy mi na szybkiej realizacji przed wakacjami..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full text-lg py-6">
                  Wyślij zapytanie
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
