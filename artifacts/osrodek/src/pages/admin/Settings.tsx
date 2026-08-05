import React, { useEffect, useState } from "react";
import {
  useAdminGetSettings,
  useAdminUpdateSettings,
  getAdminGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Palette, Phone, Lock, Image, Clock } from "lucide-react";

const THEMES = [
  { value: "professional", label: "Professional — Morski profesjonalizm" },
  { value: "exclusive", label: "Exclusive — Luksusowy i elegancki" },
  { value: "fun", label: "Fun — Wakacyjny i wesoły" },
  { value: "family", label: "Family — Przyjazny rodzinom" },
  { value: "rustic", label: "Rustic — Naturalny i przytulny" },
  { value: "modern", label: "Modern — Nowoczesny minimalizm" },
];

const BOOKING_MODES = [
  { value: "inquiry", label: "Tylko zapytania (formularz kontaktowy)" },
  { value: "online", label: "Tylko rezerwacje online" },
  { value: "both", label: "Oba — zapytania i rezerwacje online" },
];

type FieldGroupProps = { title: string; icon: React.ReactNode; children: React.ReactNode };
function FieldGroup({ title, icon, children }: FieldGroupProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { data: settings, isLoading } = useAdminGetSettings();
  const updateSettings = useAdminUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    resortName: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    facebook: "",
    logoUrl: "",
    heroImageUrl: "",
    theme: "professional",
    bookingMode: "both",
    checkInTime: "14:00",
    checkOutTime: "10:00",
    adminPassword: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        resortName: settings.resortName || "",
        tagline: settings.tagline || "",
        description: settings.description || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        facebook: settings.facebook || "",
        logoUrl: settings.logoUrl || "",
        heroImageUrl: settings.heroImageUrl || "",
        theme: settings.theme || "professional",
        bookingMode: settings.bookingMode || "both",
        checkInTime: settings.checkInTime || "14:00",
        checkOutTime: settings.checkOutTime || "10:00",
        adminPassword: "",
      });
    }
  }, [settings]);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSelect = (key: keyof typeof form) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resortName.trim()) {
      toast({ title: "Nazwa ośrodka jest wymagana", variant: "destructive" });
      return;
    }

    const payload: Record<string, string | undefined> = {
      resortName: form.resortName,
      tagline: form.tagline || undefined,
      description: form.description || undefined,
      address: form.address || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
      facebook: form.facebook || undefined,
      logoUrl: form.logoUrl || undefined,
      heroImageUrl: form.heroImageUrl || undefined,
      theme: form.theme,
      bookingMode: form.bookingMode,
      checkInTime: form.checkInTime || undefined,
      checkOutTime: form.checkOutTime || undefined,
    };

    if (form.adminPassword.trim()) {
      payload.adminPassword = form.adminPassword;
    }

    updateSettings.mutate(
      { data: payload as never },
      {
        onSuccess: () => {
          toast({ title: "Ustawienia zapisane ✓" });
          queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() });
          setForm(prev => ({ ...prev, adminPassword: "" }));
        },
        onError: () => toast({ title: "Błąd podczas zapisywania", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Ustawienia</h1>
          <p className="text-muted-foreground mt-1">Konfiguracja strony i ośrodka</p>
        </div>
        <Button type="submit" size="lg" disabled={updateSettings.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>

      <FieldGroup title="Podstawowe informacje" icon={<Globe className="w-5 h-5 text-primary" />}>
        <Field label="Nazwa ośrodka" required>
          <Input value={form.resortName} onChange={handleChange("resortName")} placeholder="Ośrodek Przy Morzu" required />
        </Field>
        <Field label="Hasło / slogan">
          <Input value={form.tagline} onChange={handleChange("tagline")} placeholder="Twój wypoczynek nad Bałtykiem" />
        </Field>
        <Field label="Opis ośrodka">
          <Textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Krótki opis widoczny na stronie głównej..."
            rows={4}
          />
        </Field>
      </FieldGroup>

      <FieldGroup title="Kontakt" icon={<Phone className="w-5 h-5 text-primary" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefon">
            <Input value={form.phone} onChange={handleChange("phone")} placeholder="+48 500 123 456" />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={form.email} onChange={handleChange("email")} placeholder="kontakt@ośrodek.pl" />
          </Field>
        </div>
        <Field label="Adres">
          <Input value={form.address} onChange={handleChange("address")} placeholder="ul. Nadmorska 42, 84-100 Puck" />
        </Field>
        <Field label="Facebook (URL)">
          <Input value={form.facebook} onChange={handleChange("facebook")} placeholder="https://facebook.com/mojosrodek" />
        </Field>
      </FieldGroup>

      <FieldGroup title="Wygląd i zdjęcia" icon={<Image className="w-5 h-5 text-primary" />}>
        <Field label="URL logo (opcjonalnie)">
          <Input value={form.logoUrl} onChange={handleChange("logoUrl")} placeholder="https://..." />
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Logo" className="mt-2 h-12 object-contain rounded border p-1 bg-muted" />
          )}
        </Field>
        <Field label="URL zdjęcia hero (baner główny)">
          <Input value={form.heroImageUrl} onChange={handleChange("heroImageUrl")} placeholder="https://..." />
          {form.heroImageUrl && (
            <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
              <img src={form.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
            </div>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup title="Wygląd strony" icon={<Palette className="w-5 h-5 text-primary" />}>
        <Field label="Motyw kolorystyczny">
          <Select value={form.theme} onValueChange={handleSelect("theme")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tryb rezerwacji">
          <Select value={form.bookingMode} onValueChange={handleSelect("bookingMode")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_MODES.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup title="Godziny" icon={<Clock className="w-5 h-5 text-primary" />}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Check-in">
            <Input type="time" value={form.checkInTime} onChange={handleChange("checkInTime")} />
          </Field>
          <Field label="Check-out">
            <Input type="time" value={form.checkOutTime} onChange={handleChange("checkOutTime")} />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup title="Bezpieczeństwo" icon={<Lock className="w-5 h-5 text-primary" />}>
        <Field label="Nowe hasło administratora">
          <Input
            type="password"
            value={form.adminPassword}
            onChange={handleChange("adminPassword")}
            placeholder="Zostaw puste, żeby nie zmieniać"
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground pt-1">Wypełnij tylko jeśli chcesz zmienić hasło.</p>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateSettings.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </div>
    </form>
  );
}
