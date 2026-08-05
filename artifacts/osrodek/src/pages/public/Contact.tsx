import React from "react";
import { motion } from "framer-motion";
import { useGetSettings, useSubmitInquiry } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Facebook, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  guestName: z.string().min(2, "Imię jest wymagane"),
  guestEmail: z.string().email("Niepoprawny email"),
  guestPhone: z.string().min(6, "Telefon jest wymagany"),
  message: z.string().min(10, "Wiadomość musi mieć minimum 10 znaków"),
});

export default function Contact() {
  const { data: settings, isLoading } = useGetSettings();
  const submitInquiry = useSubmitInquiry();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      message: "",
    },
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center">Ładowanie...</div>;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Treat generic contact form as inquiry without specific dates
    const today = new Date().toISOString().split('T')[0];
    
    submitInquiry.mutate({
      data: {
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        message: values.message,
        checkIn: today, 
        checkOut: today,
        guestsCount: 1,
        type: 'inquiry'
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Wiadomość wysłana!",
          description: "Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Błąd",
          description: "Wystąpił problem podczas wysyłania. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="w-full pb-24">
      <section className="bg-primary text-primary-foreground py-16 md:py-24 mb-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Kontakt</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Masz pytania? Chętnie pomożemy. Jesteśmy do Twojej dyspozycji.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Informacje kontaktowe</h2>
              <div className="space-y-6">
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Adres</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                )}
                
                {settings?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Telefon</h4>
                      <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-primary transition">{settings.phone}</a>
                    </div>
                  </div>
                )}
                
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email</h4>
                      <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition">{settings.email}</a>
                    </div>
                  </div>
                )}

                {settings?.facebook && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                      <Facebook className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Social Media</h4>
                      <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">Odwiedź nasz profil na FB</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            {settings?.address && (
              <div className="w-full h-[300px] bg-muted rounded-2xl overflow-hidden relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodeURIComponent(settings.address)}`}
                ></iframe>
                {/* Fallback overlay if key is missing */}
                <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center border">
                  <MapPin className="w-8 h-8 text-primary mb-2 opacity-50" />
                  <p className="text-muted-foreground font-medium">Mapa zablokowana (brak klucza API)</p>
                  <p className="text-sm text-muted-foreground mt-2">{settings.address}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold mb-6">Napisz do nas</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <FormControl><Input placeholder="Jan Kowalski" className="h-12 bg-muted/50 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres email</FormLabel>
                          <FormControl><Input type="email" placeholder="jan@example.com" className="h-12 bg-muted/50 rounded-xl" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="+48 123 456 789" className="h-12 bg-muted/50 rounded-xl" {...field} /></FormControl>
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
                        <FormLabel>Twoja wiadomość</FormLabel>
                        <FormControl><Textarea placeholder="W czym możemy pomóc?" className="min-h-[150px] bg-muted/50 rounded-xl resize-y" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg group" disabled={submitInquiry.isPending}>
                    {submitInquiry.isPending ? "Wysyłanie..." : (
                      <>
                        Wyślij wiadomość
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
