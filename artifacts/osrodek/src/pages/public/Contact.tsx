import React from "react";
import { motion } from "framer-motion";
import { useGetSettings, useSubmitInquiry } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Facebook, Send, MessageCircle } from "lucide-react";
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

/** Builds a working no-API-key Google Maps embed src */
function buildMapSrc(googleMapsUrl?: string | null, address?: string | null): string | null {
  if (googleMapsUrl?.trim()) return googleMapsUrl.trim();
  if (address?.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address.trim())}&output=embed&hl=pl`;
  }
  return null;
}

export default function Contact() {
  const { data: settings, isLoading } = useGetSettings();
  const submitInquiry = useSubmitInquiry();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { guestName: "", guestEmail: "", guestPhone: "", message: "" },
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center">Ładowanie...</div>;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const today = new Date().toISOString().split("T")[0];
    submitInquiry.mutate(
      {
        data: {
          guestName: values.guestName,
          guestEmail: values.guestEmail,
          guestPhone: values.guestPhone,
          message: values.message,
          checkIn: today,
          checkOut: today,
          guestsCount: 1,
          type: "inquiry",
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Wiadomość wysłana!", description: "Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Błąd", description: "Wystąpił problem podczas wysyłania. Spróbuj ponownie.", variant: "destructive" });
        },
      }
    );
  };

  const mapSrc = buildMapSrc(settings?.googleMapsUrl, settings?.address);

  return (
    <div className="w-full pb-24">
      {/* Banner */}
      <section className="page-banner bg-primary text-primary-foreground py-16 md:py-24 pb-24 mb-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Kontakt</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Masz pytania? Chętnie pomożemy. Jesteśmy do Twojej dyspozycji.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Contact info + Map */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Informacje kontaktowe</h2>
              <div className="space-y-6">
                {settings?.address && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
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
                    <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Telefon</h4>
                      <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-primary transition">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Email</h4>
                      <a href={`mailto:${settings.email}`} className="text-muted-foreground hover:text-primary transition">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {settings?.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">WhatsApp</h4>
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition"
                      >
                        Napisz na WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {settings?.facebook && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                      <Facebook className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Facebook</h4>
                      <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
                        Odwiedź nasz profil
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Maps embed — no API key required */}
            {mapSrc ? (
              <div className="rounded-2xl overflow-hidden border border-border shadow-md h-[340px]">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa dojazdu"
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border h-[200px] flex items-center justify-center text-center p-6 text-muted-foreground">
                <div>
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Mapa pojawi się tu automatycznie po wpisaniu adresu w panelu administratora.</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Form */}
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
