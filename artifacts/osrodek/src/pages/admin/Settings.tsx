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
import { Save, Globe, Palette, Phone, Lock, Image, Clock, CalendarArrowDown, ExternalLink, RefreshCw, MessageCircle } from "lucide-react";

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
    website: "",
    whatsapp: "",
    facebook: "",
    logoUrl: "",
    heroImageUrl: "",
    heroImageUrl2: "",
    heroImageUrl3: "",
    theme: "professional",
    bookingMode: "both",
    checkInTime: "14:00",
    checkOutTime: "10:00",
    adminPassword: "",
    bookingComIcalUrl: "",
  });
  const [icalImportStatus, setIcalImportStatus] = useState<{
    loading: boolean;
    result: { eventsFound: number } | null;
    error: string | null;
  }>({ loading: false, result: null, error: null });

  useEffect(() => {
    if (settings) {
      setForm({
        resortName: settings.resortName || "",
        tagline: settings.tagline || "",
        description: settings.description || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        website: settings.website || "",
        whatsapp: settings.whatsapp || "",
        facebook: settings.facebook || "",
        logoUrl: settings.logoUrl || "",
        heroImageUrl: settings.heroImageUrl || "",
        heroImageUrl2: settings.heroImageUrl2 || "",
        heroImageUrl3: settings.heroImageUrl3 || "",
        theme: settings.theme || "professional",
        bookingMode: settings.bookingMode || "both",
        checkInTime: settings.checkInTime || "14:00",
        checkOutTime: settings.checkOutTime || "10:00",
        adminPassword: "",
        bookingComIcalUrl: settings.bookingComIcalUrl || "",
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
      website: form.website || undefined,
      whatsapp: form.whatsapp || undefined,
      facebook: form.facebook || undefined,
      logoUrl: form.logoUrl || undefined,
      heroImageUrl: form.heroImageUrl || undefined,
      heroImageUrl2: form.heroImageUrl2 || undefined,
      heroImageUrl3: form.heroImageUrl3 || undefined,
      theme: form.theme,
      bookingMode: form.bookingMode,
      checkInTime: form.checkInTime || undefined,
      checkOutTime: form.checkOutTime || undefined,
      bookingComIcalUrl: form.bookingComIcalUrl || undefined,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Facebook (URL)">
            <Input value={form.facebook} onChange={handleChange("facebook")} placeholder="https://facebook.com/mojosrodek" />
          </Field>
          <Field label="Strona WWW (URL)">
            <Input value={form.website} onChange={handleChange("website")} placeholder="https://mojosrodek.pl" />
          </Field>
        </div>
        <Field label="WhatsApp (numer telefonu)">
          <Input value={form.whatsapp} onChange={handleChange("whatsapp")} placeholder="+48 500 123 456" />
          <p className="text-xs text-muted-foreground pt-1">Numer w formacie międzynarodowym — pojawi się jako przycisk WhatsApp na stronie.</p>
        </Field>
      </FieldGroup>

      <FieldGroup title="Wygląd i zdjęcia" icon={<Image className="w-5 h-5 text-primary" />}>
        <Field label="URL logo (opcjonalnie)">
          <Input value={form.logoUrl} onChange={handleChange("logoUrl")} placeholder="https://..." />
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Logo" className="mt-2 h-12 object-contain rounded border p-1 bg-muted" />
          )}
        </Field>
        <p className="text-xs text-muted-foreground -mt-2">Wklej URL zdjęcia (np. z Unsplash, Google Drive, własnego serwera). Slider pokazuje do 3 slajdów — zostaw puste żeby użyć domyślnego zdjęcia morskiego.</p>
        {[
          { key: "heroImageUrl" as const, label: "Slajd 1 — URL zdjęcia (główny baner)" },
          { key: "heroImageUrl2" as const, label: "Slajd 2 — URL zdjęcia" },
          { key: "heroImageUrl3" as const, label: "Slajd 3 — URL zdjęcia" },
        ].map(({ key, label }) => (
          <Field key={key} label={label}>
            <Input value={form[key]} onChange={handleChange(key)} placeholder="https://images.unsplash.com/..." />
            {form[key] && (
              <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-muted">
                <img src={form[key]} alt={label} className="w-full h-full object-cover" />
              </div>
            )}
          </Field>
        ))}
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

      <FieldGroup title="Synchronizacja z Booking.com (iCal)" icon={<CalendarArrowDown className="w-5 h-5 text-primary" />}>
        <Field label="URL kalendarza iCal z Booking.com">
          <Input
            value={form.bookingComIcalUrl}
            onChange={handleChange("bookingComIcalUrl")}
            placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?..."
          />
          <p className="text-xs text-muted-foreground pt-1">
            W panelu Booking.com: Nieruchomość → Kalendarze → Synchronizacja kalendarza → Skopiuj URL iCal.
          </p>
        </Field>

        <div className="flex flex-wrap gap-3 items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={icalImportStatus.loading}
            className="gap-2"
            onClick={async () => {
              setIcalImportStatus({ loading: true, result: null, error: null });
              try {
                const res = await fetch("/api/admin/ical-import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: form.bookingComIcalUrl || undefined }),
                  credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
                setIcalImportStatus({ loading: false, result: data, error: null });
                toast({ title: `Znaleziono ${data.eventsFound} wpisów w kalendarzu Booking.com` });
              } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                setIcalImportStatus({ loading: false, result: null, error: msg });
              }
            }}
          >
            {icalImportStatus.loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sprawdź kalendarz Booking.com
          </Button>

          <a
            href="/api/ical"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pobierz eksport iCal (do importu w Booking.com)
          </a>
        </div>

        {icalImportStatus.error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {icalImportStatus.error}
          </p>
        )}
        {icalImportStatus.result && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            ✓ Pobrano kalendarz — znaleziono {icalImportStatus.result.eventsFound} zajętych terminów.
          </p>
        )}
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
